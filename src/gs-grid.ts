import { CellUtilities, Virtualize, SortUtilities, ExportUtilities, RowSelectionUtilities } from "./core";
import { IGridConfig, IGridRenderer, IGridScrollPosition } from "./interface";
import { CellWidth, GridColumn, GridInstance } from "./model";
import { FlexHeaderRenderer, FlexDataRowRenderer, ScrollRenderer } from "./renderers";
import { ScrollUtilities } from './core';

declare const require: any;

/**
 * Gs grid component class.
 */
export class GsGrid extends HTMLElement {
    /**
     * Grid configuration object of gs-grid.
     */
    gridConfig!: IGridConfig;

    /**
     * Scroll indexer of gs-grid.
     */
    private _scrollIndexer!: number[];

    /**
     * Current scroll index of gs-grid.
     */
    private _currentScrollIndex: number;

    /**
     * Instance id of gs-grid that is set on instance-id attribute.
     */
    private instanceId: string;

    /**
     * Header renderer of gs grid.
     */
    private headerRenderer!: IGridRenderer;

    /**
     * Data row renderer of gs grid.
     */
    private dataRowRenderer!: IGridRenderer;

    /**
     * Scroll renderer of gs grid.
     */
    private scrollRenderer!: ScrollRenderer;

    /**
     * Cell utils of gs grid.
     */
    private cellUtils!: CellUtilities;

    /**
     * Virtualization core of gs grid.
     */
    private virtualizationCore!: Virtualize;

    /**
     * Smart scroll utility instance.
     */
    private smartScrollUtils!: ScrollUtilities;

    /**
     * Original unsorted dataset, preserved for reset when sort direction cycles back to none.
     */
    private originalData!: any[];

    /**
     * Base data set used for search reset.
     */
    private baseData!: any[];

    /**
     * Current search result set before sorting is applied.
     */
    private filteredData!: any[];

    /**
     * Currently active sort field.
     */
    private activeSortField: string | null = null;

    /**
     * Currently active sort direction.
     */
    private activeSortDirection: 'asc' | 'desc' | null = null;

    /**
     * Flag to indicate whether virtualization is currently active.
     */
    private isVirtualizationActive: boolean = true;

    /**
     * Row selection utility instance.
     */
    private rowSelectionUtils!: RowSelectionUtilities;

    /**
     * Currently rendered rows in the viewport.
     */
    private currentRenderedRows: any[] = [];

    /**
     * Creates an instance of gs-grid.
     */
    constructor() {
        super();
        this.instanceId = this.generateInstanceId();
        this.registerGridEventCallback();
        this._currentScrollIndex = 0;
    }

    /**
     * Connected callback of gs-grid component.
     */
    connectedCallback() {
        this.initPropsFromAttrs();
        this.attachShadow({mode: 'open'});
        window.addEventListener('resize', () => this.onWindowResize());
    }

    /**
     * Initialize all attributes of gs-grid component.
     */
    private initPropsFromAttrs() {
        this.setAttribute('instance-id', this.instanceId);
    }

    /**
     * Generates a UUID for instance id.
     * (RFC 4122) Implemented from https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
     * @returns A unique identifier (UUID)
     */
    private generateInstanceId(): string {
        const s = new Array(36);
        const hexDigits = "0123456789abcdef";

        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }

        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";

        return s.join("");
    }

    /**
     * Registers all component event handlers.
     */
    private registerGridEventCallback() {
        this.addEventListener('x-gs-config-setup', (event: Event) => {
            const customEvent = event as CustomEvent<{ gridConfig: IGridConfig }>;
            const { gridConfig } = customEvent.detail;
            this.onGridConfigSet(gridConfig);
        });
    }

    /**
     * Callback to set event config.
     * @param gridConfig grid config param.
     */
    private onGridConfigSet(gridConfig: IGridConfig) {
        this.gridConfig = gridConfig;
        this.gridConfig.columnDefs = gridConfig.columnDefs.map(c => new GridColumn(c));
        this.baseData = [...(gridConfig.data || [])];
        this.filteredData = [...this.baseData];
        this.originalData = [...this.filteredData];
        this.rowSelectionUtils = new RowSelectionUtilities(this.gridConfig.onRowSelectionChangeAsync);
        this.bindInstanceApi();
        this.bindConfigSearchApi();

        // Initialize Cell utils with params.
        this.cellUtils = new CellUtilities(this.getAvailableWidth());
        
        // Register all renderers.
        this.registerRenderers(this.gridConfig);

        // Initialize styles.
        this.initializeStyles();

        // Render grid header.
        this.initializeHeader();

        // Wire sort click handlers on header.
        this.initializeSortHandlers();

        // Render data rows.
        this.initializeViewport();

        // Wire row selection handlers.
        this.initializeSelectionHandlers();

        // Render scroll bar.
        this.initializeScrollBar();

        // Init smart scroll.
        // TODO: move smart scroll reg to new method.
        // TODO: Use Rxjs & remove timeout.
        this.smartScrollUtils = new ScrollUtilities(this.getShadowRoot());
        setTimeout(() => {
            this.smartScrollUtils.registerSmartScrollEvents();
        }, 2000);

        // Init virtualization core.
        // TODO: Use Rxjs & remove timeout.
        setTimeout(() => {
            this.initializeVirtualization();
            this.smartScrollUtils.scrollMoveComplete$.subscribe((scrollPosition: IGridScrollPosition) => {
                if (this.virtualizationCore && this.isVirtualizationActive) {
                    this.virtualizationCore.OnGridScrollPositionChange(scrollPosition);
                }
            });
        }, 500);
    }

    /**
     * Registers renderers of header & column of grid.
     * @param gridConfig grid configuration.
     */
    registerRenderers(gridConfig: IGridConfig) {
        const rendererDataSet = gridConfig.columnDefs.map(x => {
            return {
                displayName: x.headerName,
                field: x.field,
                width: x.width ?? CellWidth.Auto,
                minWidth: x.minWidth ?? CellWidth.Auto,
                enableSort: x.enableSort
            }
        });

        // Register header renderer.
        this.headerRenderer = new FlexHeaderRenderer(rendererDataSet, this.cellUtils, this.gridConfig);

        // Register data row renderer.
        this.dataRowRenderer = new FlexDataRowRenderer(rendererDataSet, this.cellUtils, this.gridConfig, this.getShadowRoot());

        // Register viewport scroll renderer.
        this.scrollRenderer = new ScrollRenderer();
    }

    /**
     * Initializes header.
     */
    private initializeHeader() {
        this.renderHeader();
    }

    /**
     * Attaches delegated click listener for column sorting.
     */
    private initializeSortHandlers() {
        this.getShadowRoot().addEventListener('click', (event: Event) => {
            const target = (event.target as HTMLElement).closest('.header-column') as HTMLElement;
            if (!target || !target.classList.contains('sortable')) {
                return;
            }

            const field = target.dataset.field;
            if (field) {
                this.applySort(field);
            }
        });
    }

    /**
     * Cycles sort state for the given field and re-renders via virtualization.
     * Cycle: none → asc → desc → none
     */
    private applySort(field: string) {
        if (this.activeSortField === field) {
            this.activeSortDirection = this.activeSortDirection === 'asc' ? 'desc' : null;
            if (!this.activeSortDirection) {
                this.activeSortField = null;
            }
        } else {
            this.activeSortField = field;
            this.activeSortDirection = 'asc';
        }

        let sortedData: any[];
        if (!this.activeSortField || !this.activeSortDirection) {
            sortedData = [...this.originalData];
        } else {
            const column = this.gridConfig.columnDefs.find(c => c.field === this.activeSortField);
            sortedData = column
                ? SortUtilities.sortDataSet(this.originalData, column, this.activeSortDirection)
                : [...this.originalData];
        }

        this.applyRenderDataSet(sortedData);

        this.updateSortIndicator(this.activeSortField, this.activeSortDirection);
    }

    /**
     * Binds instance-level APIs for runtime data operations.
     */
    private bindInstanceApi() {
        this.gridConfig.instance = new GridInstance(this.instanceId, {
            updateData: async (data: any[]) => this.updateDataSet(data),
            getSelectedRows: () => this.getSelectedRows(),
            setRowSelectionEnabled: async (enabled: boolean) => this.setRowSelectionEnabled(enabled),
            performSearch: async (query: string) => this.performSearch(query),
            clearSearch: async () => this.performSearch(''),
            exportToExcel: async (fileName?: string) => this.exportToExcel(fileName),
            exportToCsv: async (fileName?: string) => this.exportToCsv(fileName)
        });
    }

    /**
     * Binds config-level convenience API for search.
     */
    private bindConfigSearchApi() {
        this.gridConfig.performSearch = (query: string) => this.performSearch(query);
        this.gridConfig.clearSearch = () => this.performSearch('');
        this.gridConfig.exportToExcel = (fileName?: string) => this.exportToExcel(fileName);
        this.gridConfig.exportToCsv = (fileName?: string) => this.exportToCsv(fileName);
    }

    /**
     * Exports current grid dataset to an xlsx file.
     * @param fileName optional download file name without extension.
     */
    private exportToExcel(fileName?: string): Promise<boolean> {
        const data = this.gridConfig.data || [];
        const columns = this.gridConfig.columnDefs || [];
        return Promise.resolve(ExportUtilities.exportToExcel(data, columns, fileName));
    }

    /**
     * Exports current grid dataset to a csv file.
     * @param fileName optional download file name without extension.
     */
    private exportToCsv(fileName?: string): Promise<boolean> {
        const data = this.gridConfig.data || [];
        const columns = this.gridConfig.columnDefs || [];
        return Promise.resolve(ExportUtilities.exportToCsv(data, columns, fileName));
    }

    /**
     * Applies a new source data set and refreshes rendered rows.
     * @param data new source data.
     */
    private updateDataSet(data: any[]): Promise<boolean> {
        const nextData = data || [];
        this.baseData = [...nextData];
        this.filteredData = [...nextData];
        this.originalData = [...nextData];
        this.rowSelectionUtils.clearSelection();
        this.rowSelectionUtils.resetForData(nextData);
        this.activeSortField = null;
        this.activeSortDirection = null;
        this.updateSortIndicator(null, null);
        this.applyRenderDataSet(nextData);
        return Promise.resolve(true);
    }

    /**
     * Performs a global search across all configured column fields.
     * @param query search query.
     */
    private performSearch(query: string): Promise<boolean> {
        const normalized = (query || '').trim().toLowerCase();

        if (!normalized) {
            this.filteredData = [...this.baseData];
        } else {
            const searchFields = this.gridConfig.columnDefs.map(c => c.field);
            this.filteredData = this.baseData.filter(row => {
                return searchFields.some(field => {
                    const value = SortUtilities.getFieldValue(field, row);
                    return value != null && String(value).toLowerCase().indexOf(normalized) > -1;
                });
            });

            // If no results, fall back to full data by default.
            if (this.filteredData.length === 0) {
                this.filteredData = [...this.baseData];
            }
        }

        this.originalData = [...this.filteredData];

        if (this.activeSortField && this.activeSortDirection) {
            const sortCol = this.gridConfig.columnDefs.find(c => c.field === this.activeSortField);
            const sorted = sortCol
                ? SortUtilities.sortDataSet(this.originalData, sortCol, this.activeSortDirection)
                : [...this.originalData];
            this.applyRenderDataSet(sorted);
        } else {
            this.applyRenderDataSet(this.originalData);
        }

        return Promise.resolve(true);
    }

    /**
     * Applies dataset to config and viewport renderer.
     * @param data rows to render.
     */
    private applyRenderDataSet(data: any[]) {
        this.gridConfig.data = data;
        this.updateVirtualizationMode(data);

        if (this.virtualizationCore && this.isVirtualizationActive) {
            this.virtualizationCore.setDataSet(data);
            this.updateHeaderSelectionState();
            return;
        }

        this.renderViewportRows(data);
    }

    /**
     * Enables/disables virtualization and custom scrollbar based on visible row capacity.
     * @param data current dataset.
     */
    private updateVirtualizationMode(data: any[]) {
        const rowCount = data ? data.length : 0;
        const visibleRows = this.getVisibleRowCapacity();
        this.isVirtualizationActive = rowCount > visibleRows;

        this.scrollRenderer.updateScrollBarThumbSize(this.getShadowRoot(), rowCount, this.gridConfig.rowHeight, this.isVirtualizationActive);

        const scrollContainer = this.getShadowRoot().querySelector('.smart-scroll') as HTMLElement | null;
        if (scrollContainer) {
            scrollContainer.style.display = this.isVirtualizationActive ? 'block' : 'none';
        }

        if (this.smartScrollUtils) {
            this.smartScrollUtils.unRegisterSmartScrollEvents();
            if (this.isVirtualizationActive) {
                this.smartScrollUtils.registerSmartScrollEvents();
            }
        }
    }

    /**
     * Calculates how many rows fit in current viewport height.
     * @returns visible row capacity.
     */
    private getVisibleRowCapacity(): number {
        const viewport = this.getShadowRoot().querySelector('.data-viewport') as HTMLElement | null;
        const viewportHeight = viewport && viewport.clientHeight > 0
            ? viewport.clientHeight
            : this.gridConfig.rowHeight;

        return Math.max(1, Math.floor(viewportHeight / this.gridConfig.rowHeight));
    }

    /**
     * Updates the sort indicator CSS classes on the header row.
     */
    private updateSortIndicator(field: string | null, direction: 'asc' | 'desc' | null) {
        const headerRow = this.getShadowRoot().querySelector('.header-row');
        if (!headerRow) {
            return;
        }

        headerRow.querySelectorAll('.header-column').forEach(col => {
            col.classList.remove('sort-asc', 'sort-desc');
        });

        if (field && direction) {
            const activeCol = headerRow.querySelector(`.header-column[data-field="${field}"]`);
            if (activeCol) {
                activeCol.classList.add(`sort-${direction}`);
            }
        }
    }

    /**
     * Initializes viewport.
     */
    private initializeViewport() {
        // Render only the first page of data
        const defaultVisibleRows = 3;
        const initialGridData = this.gridConfig.data || [];
        const initialData = initialGridData.slice(0, defaultVisibleRows);
        this.currentRenderedRows = [...initialData];
        this.dataRowRenderer.renderIntoViewport({
            data: initialData,
            enableRowSelection: this.isRowSelectionEnabled(),
            isRowSelected: (row: any) => this.rowSelectionUtils.isSelected(row)
        });
        this.updateHeaderSelectionState();
        
        // Get header height and calculate viewport height from available space
        const headerRow = this.getShadowRoot().querySelector('.header-row') as HTMLElement | null;
        const headerHeight = headerRow ? headerRow.getBoundingClientRect().height : this.gridConfig.rowHeight;
        
        // Use window height minus offset, or fall back to grid's clientHeight
        const availableHeight = window.innerHeight - 100;
        const gridHeight = this.clientHeight > 0 ? this.clientHeight : availableHeight;
        this.updateViewportHeight(gridHeight, headerHeight);
    }

    /**
     * Updates viewport height (called on resize and initial setup).
     */
    private updateViewportHeight(gridHeight: number, headerHeight: number) {
        const viewportHeight = Math.max(this.gridConfig.rowHeight, gridHeight - headerHeight - 100);
        
        const viewport = this.getShadowRoot().querySelector('.data-viewport') as HTMLElement | null;
        if (viewport) {
            viewport.style.height = `${viewportHeight}px`;
            viewport.style.overflow = 'hidden';
        }
    }

    /**
     * Handles window resize to recalculate viewport height.
     */
    private onWindowResize() {
        if (!this.gridConfig) {
            return;
        }

        const headerRow = this.getShadowRoot().querySelector('.header-row') as HTMLElement | null;
        const headerHeight = headerRow ? headerRow.getBoundingClientRect().height : this.gridConfig.rowHeight;
        
        const availableHeight = window.innerHeight - 100;
        const gridHeight = this.clientHeight > 0 ? this.clientHeight : availableHeight;
        
        this.updateViewportHeight(gridHeight, headerHeight);

        const currentData = this.gridConfig.data || [];
        const previousMode = this.isVirtualizationActive;
        this.updateVirtualizationMode(currentData);

        if (!this.virtualizationCore) {
            return;
        }

        // Re-render after resize to reflect mode/capacity changes immediately.
        if (this.isVirtualizationActive) {
            this.virtualizationCore.setDataSet(currentData);
        } else if (previousMode !== this.isVirtualizationActive || currentData.length > 0) {
            (this.dataRowRenderer as FlexDataRowRenderer).updateViewportRows({
                data: currentData,
                enableRowSelection: this.isRowSelectionEnabled(),
                isRowSelected: (row: any) => this.rowSelectionUtils.isSelected(row)
            });
        }
    }

    /**
     * Initializes scroll bar for viewport.
     */
    private initializeScrollBar() {
        const viewport = this.getShadowRoot().querySelector('.data-viewport');
        if (viewport) {
            viewport.prepend(this.scrollRenderer.render());
        }
    }

    /**
     * Initializes styles.
     */
    private initializeStyles() {
        const styleRoot = document.createElement('style');
        const gsGridStyles = require('./styles/gs-grid.scss').default[0][1];
        styleRoot.innerText = gsGridStyles.replace(/\n|\r/g, "");
        this.getShadowRoot().appendChild(styleRoot);
    }

    /**
     * Initializes virtualization.
     */
    private initializeVirtualization() {
        // Ensure viewport height is set before virtualization
        const viewport = this.getShadowRoot().querySelector('.data-viewport') as HTMLElement | null;
        if (viewport && !viewport.style.height) {
            const defaultVisibleRows = 3;
            const viewportHeight = defaultVisibleRows * this.gridConfig.rowHeight;
            viewport.style.height = `${viewportHeight}px`;
        }
        
        this.virtualizationCore = new Virtualize(
            this.gridConfig,
            this.getShadowRoot(),
            (rows: any[]) => {
                this.renderViewportRows(rows);
            }
        );

        this.updateVirtualizationMode(this.gridConfig.data || []);
    }

    /**
     * Gets available width for grid.
     * @returns available width for grid, either itself or parent.
     */
    private getAvailableWidth(): number {
        return this.clientWidth || (this.parentElement ? this.parentElement.clientWidth : 0);
    }

    /**
     * Initializes row selection handlers.
     */
    private initializeSelectionHandlers() {
        this.getShadowRoot().addEventListener('change', async (event: Event) => {
            const target = event.target as HTMLElement;

            if (target instanceof HTMLInputElement && target.classList.contains('header-select-checkbox')) {
                if (!this.isRowSelectionEnabled()) {
                    return;
                }
                await this.onHeaderSelectionChange(target.checked);
                return;
            }

            if (target instanceof HTMLInputElement && target.classList.contains('row-select-checkbox')) {
                if (!this.isRowSelectionEnabled()) {
                    return;
                }
                await this.onRowSelectionChange(target);
            }
        });
    }

    /**
     * Handles header checkbox changes.
     * @param shouldSelect whether active rows should be selected.
     */
    private async onHeaderSelectionChange(shouldSelect: boolean): Promise<void> {
        const rows = this.gridConfig.data || [];

        if (shouldSelect) {
            await this.rowSelectionUtils.selectAll(rows);
        } else {
            await this.rowSelectionUtils.unselectAll(rows);
        }

        this.rerenderCurrentViewport();
    }

    /**
     * Handles row checkbox changes.
     * @param checkbox row checkbox element.
     */
    private async onRowSelectionChange(checkbox: HTMLInputElement): Promise<void> {
        const dataRowElement = checkbox.closest('.data-row') as HTMLElement;
        if (!dataRowElement) {
            return;
        }

        const rowIndex = Number(dataRowElement.dataset.rowIndex);
        const row = this.currentRenderedRows[rowIndex];

        if (typeof row === 'undefined') {
            return;
        }

        await this.rowSelectionUtils.setRowSelection(row, checkbox.checked, row);
        this.rerenderCurrentViewport();
    }

    /**
     * Renders rows into the viewport while reflecting selection state.
     * @param rows rows to render.
     */
    private renderViewportRows(rows: any[]): void {
        this.currentRenderedRows = [...(rows || [])];
        (this.dataRowRenderer as FlexDataRowRenderer).updateViewportRows({
            data: rows,
            enableRowSelection: this.isRowSelectionEnabled(),
            isRowSelected: (row: any) => this.rowSelectionUtils.isSelected(row)
        });
        this.updateHeaderSelectionState();
    }

    /**
     * Re-renders the currently visible viewport rows.
     */
    private rerenderCurrentViewport(): void {
        this.renderViewportRows(this.currentRenderedRows);
    }

    /**
     * Updates the header selection checkbox checked and indeterminate state.
     */
    private updateHeaderSelectionState(): void {
        const headerCheckbox = this.getShadowRoot().querySelector('.header-select-checkbox') as HTMLInputElement | null;
        if (!this.isRowSelectionEnabled() || !headerCheckbox || !this.rowSelectionUtils) {
            return;
        }

        const headerState = this.rowSelectionUtils.getHeaderState(this.gridConfig.data || []);
        headerCheckbox.checked = headerState.isAllSelected;
        headerCheckbox.indeterminate = headerState.isPartiallySelected;
    }

    /**
     * Gets all selected rows.
     * @returns selected row list.
     */
    private getSelectedRows(): any[] {
        return this.rowSelectionUtils ? this.rowSelectionUtils.getSelectedRows() : [];
    }

    /**
     * Sets row selection enabled state.
     * @param enabled whether row selection should be enabled.
     * @returns true once applied.
     */
    private setRowSelectionEnabled(enabled: boolean): Promise<boolean> {
        this.gridConfig.enableRowSelection = enabled;

        if (!enabled) {
            this.rowSelectionUtils.clearSelection();
        }

        this.renderHeader();
        this.rerenderCurrentViewport();
        return Promise.resolve(true);
    }

    /**
     * Determines whether row selection is enabled.
     * @returns true if enabled.
     */
    private isRowSelectionEnabled(): boolean {
        return !!this.gridConfig.enableRowSelection;
    }

    /**
     * Renders or refreshes the header row.
     */
    private renderHeader(): void {
        const shadowRoot = this.getShadowRoot();
        const existingHeader = shadowRoot.querySelector('.header-row');
        const nextHeader = this.headerRenderer.render({
            enableRowSelection: this.isRowSelectionEnabled(),
            isAllSelected: false
        }).cloneNode(true) as HTMLElement;

        if (existingHeader) {
            existingHeader.replaceWith(nextHeader);
        } else {
            shadowRoot.appendChild(nextHeader);
        }

        this.updateSortIndicator(this.activeSortField, this.activeSortDirection);
        this.updateHeaderSelectionState();
    }

    /**
     * Gets the attached shadow root.
     * @returns shadow root.
     */
    private getShadowRoot(): ShadowRoot {
        if (!this.shadowRoot) {
            throw new Error('Shadow root is not initialized.');
        }

        return this.shadowRoot;
    }
}

customElements.define('gs-grid', GsGrid);