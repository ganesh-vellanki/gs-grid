import { CellUtilities } from "../core";
import { IGridConfig, IGridRenderColumn, IGridRenderer } from "../interface";

interface DataRowRenderOptions {
    data?: any[];
    enableRowSelection?: boolean;
    isRowSelected?: (row: any) => boolean;
}

/**
 * Flex data row renderer.
 */
export class FlexDataRowRenderer implements IGridRenderer {
    /**
     * Creates an instance of flex column renderer.
        * @param _renderCols grid columns.
        * @param _cellUtils cell utilities.
     * @param gridConfig grid config.
        * @param shadowRoot shadow root.
     */
    constructor(private _renderCols: IGridRenderColumn[], 
                private _cellUtils: CellUtilities, 
                private gridConfig: IGridConfig,
                private shadowRoot: ShadowRoot) 
    {
    }

    /**
     * Renders flex column renderer.
     */
    render(renderOptions?: DataRowRenderOptions): HTMLElement {
        const dataViewport = document.createElement('div');
        dataViewport.classList.add('data-viewport');

        if(renderOptions?.data && renderOptions.data.length > 0) {
            renderOptions.data.forEach((dataRow: any, index: number) => {
                let colTemplate = '';
                const isSelected = renderOptions.isRowSelected ? renderOptions.isRowSelected(dataRow) : false;
                if (renderOptions.enableRowSelection) {
                    colTemplate += this.selectionCellTemplateFragmentFn(isSelected);
                }
                this._renderCols.forEach(col => {
                    colTemplate += this.cellTemplateFragmentFn(col.field, dataRow);
                });
                dataViewport.append(this.rowTemplateFragmentFn(colTemplate, index, isSelected));
            });
        }
        
        return dataViewport;
    }

    /**
     * Renders into viewport.
     * @param [renderOptions] render options.
     */
    renderIntoViewport(renderOptions?: DataRowRenderOptions): void {
        if (this.shadowRoot) {
            this.shadowRoot.append(this.render(renderOptions || { data: this.gridConfig.data }));
        }
    }

    /**
     * Updates viewport with the provided data set.
     * @param renderOptions render options.
     */
    updateViewportRows(renderOptions?: DataRowRenderOptions): void {
        const viewport = this.shadowRoot.querySelector('.data-viewport');

        if (viewport) {
            const smartScroll = viewport.querySelector('.smart-scroll');
            viewport.classList.add('scrolling-viewport');
            viewport.innerHTML = this.renderNewRows(renderOptions);
            if (smartScroll) {
                viewport.prepend(smartScroll);
            }
            viewport.classList.remove('scrolling-viewport');
        }
    }

    updateViewportRowsUp(renderOptions?: any): void {
        this.updateViewportRows(renderOptions);
    }

    updateViewportRowsDown(renderOptions: DataRowRenderOptions): void {
        this.updateViewportRows(renderOptions);
    }

    renderNewRows(renderOptions?: DataRowRenderOptions): string {
        let rowTemplate = '';
        const rows = renderOptions?.data || [];

        if(rows.length > 0) {
            rows.forEach((dataRow: any, index: number) => {
                let colTemplate = '';
                const isSelected = renderOptions?.isRowSelected ? renderOptions.isRowSelected(dataRow) : false;
                if (renderOptions?.enableRowSelection) {
                    colTemplate += this.selectionCellTemplateFragmentFn(isSelected);
                }
                this._renderCols.forEach(col => {
                    colTemplate += this.cellTemplateFragmentFn(col.field, dataRow);
                });
                rowTemplate += this.rowTemplateFragmentFn(colTemplate, index, isSelected).outerHTML;
            });
        }

        return rowTemplate;
    }

    /**
     * Queues render async.
     * @returns render.
     */
    queueRender(): Promise<HTMLElement> {
        return Promise.resolve(this.render());
    }

    /**
     * Selection cell template fragment.
     * @param isSelected whether row is selected.
     * @returns selection cell markup.
     */
    private selectionCellTemplateFragmentFn(isSelected: boolean): string {
        const checkedAttribute = isSelected ? ' checked' : '';
        return `<div class="cell-column selection-column"><div class="cell-content selection-cell-content"><input type="checkbox" class="row-select-checkbox" aria-label="Select row"${checkedAttribute}></div></div>`;
    }

    /**
     * Cells template fragment method.
     * @param field cell field.
     * @param data field data.
     * @returns template fragment method.
     */
    private cellTemplateFragmentFn(field: string, data: any): string {
        const cellUtils = this._cellUtils.getCellUtilsByFieldName(field);
        const cellValue = this.getCellValue(field, data);
        return `<div title="${cellValue}" class="cell-column" style="width: ${cellUtils.renderWidth}; height: ${this.gridConfig.rowHeight}px"><div class="cell-content">${cellValue}</div></div>`;
    }

    /**
     * Rows template fragment method.
     * @param cellTemplate cell template string.
     * @returns template fragment method.
     */
    private rowTemplateFragmentFn(cellTemplate: string, rowIndex: number, isSelected: boolean): HTMLElement {
        const dataRowContainer = document.createElement('div');
        dataRowContainer.classList.add('data-row');
        if (isSelected) {
            dataRowContainer.classList.add('selected-row');
        }
        dataRowContainer.dataset.rowIndex = rowIndex.toString();
        dataRowContainer.innerHTML = cellTemplate;
        return dataRowContainer;
    }

    /**
     * Gets cell value for field, including nested dot syntax.
     * @param field cell field.
     * @param data row data object.
     * @returns cell data.
     */
    private getCellValue(field: string, data: any) {
        const isDotNotated = field.indexOf('.');

        if(isDotNotated > -1) {
            // if field is dot notated reduce it to final value.
            const fieldAsKeys = field.split('.');
            return fieldAsKeys.reduce((p, c) => { return p[c] }, data);
        }

        return data[field];
    }
}