import { IGridConfig, IGridScrollPosition } from "../interface";

/**
 * Virtualize core.
 */
export class Virtualize {

    /**
     * Available grid height of virtualize.
     */
    private availableGridHeight: number;

    /**
     * Data set of virtualize.
     */
    private dataSet: any[];

    /**
     * Last rendered start index.
     */
    private lastStartIndex: number;

    /**
     * Resize observer for viewport dimension changes.
     */
    private resizeObserver: any;

    /**
     * Gets rows per index.
     */
    private get rowsPerIndex(): number {
        return Math.max(1, Math.floor(this.availableGridHeight / this.gridConfig.rowHeight));
    }

    /**
     * Creates an instance of virtualize.
     * @param gridConfig grid configuration.
     * @param shadowRoot shadow root.
     */
    constructor(
        private gridConfig: IGridConfig,
        private shadowRoot: ShadowRoot,
        private renderViewportRows: (rows: any[]) => void
    ) {
        this.dataSet = [...this.gridConfig.data];
        this.lastStartIndex = -1;
        this.setGridHeight();
        this.observeViewportResize();

        // Render the first page when virtualization starts.
        this.renderViewportRows(this.getDataSetForIndex(0));
    }

    /**
     * Replaces the internal dataset (e.g. after sort) and re-renders from the top.
     * @param data new dataset.
     */
    public setDataSet(data: any[]): void {
        this.dataSet = [...data];
        this.lastStartIndex = -1;
        this.renderViewportRows(this.getDataSetForIndex(0));
    }

    /**
     * Callback on grid scroll position change.
     * @param scrollYPos scroll position.
     */
    public OnGridScrollPositionChange(scrollYPos: IGridScrollPosition) {
        if (!scrollYPos) {
            return;
        }

        const yPercent = Math.max(0, Math.min(100, scrollYPos.getYPercent()));
        const maxStartIndex = Math.max(0, this.dataSet.length - this.rowsPerIndex);
        const startIndex = Math.floor((yPercent / 100) * maxStartIndex);

        if (startIndex === this.lastStartIndex) {
            return;
        }

        this.lastStartIndex = startIndex;
        this.renderViewportRows(this.getDataSetForIndex(startIndex));
    }

    /**
     * Gets data set for index.
     */
    private getDataSetForIndex(scrollIndex: number) {
        const boundedIndex = Math.max(0, Math.min(scrollIndex, this.dataSet.length));
        return this.dataSet.slice(boundedIndex, boundedIndex + this.rowsPerIndex);
    }

    /**
     * Sets grid height using shadow root.
     */
    private setGridHeight() {
        const viewport = this.getViewport();
        if (viewport) {
            this.availableGridHeight = viewport.clientHeight || 200;
        } else {
            this.availableGridHeight = 200;
        }
    }

    /**
     * Gets viewport element.
     * @returns viewport element.
     */
    private getViewport(): HTMLElement {
        return this.shadowRoot.querySelector('.data-viewport');
    }

    /**
     * Observes viewport resize and recalculates virtualization.
     */
    private observeViewportResize() {
        const viewport = this.getViewport();
        
        if (!viewport || typeof (window as any).ResizeObserver === 'undefined') {
            return;
        }

        this.resizeObserver = new (window as any).ResizeObserver(() => {
            this.setGridHeight();
            
            // Re-render current page with new rowsPerIndex based on resized height
            const startIndex = this.lastStartIndex >= 0 ? this.lastStartIndex : 0;
            this.renderViewportRows(this.getDataSetForIndex(startIndex));
        });

        this.resizeObserver.observe(viewport);
    }
}