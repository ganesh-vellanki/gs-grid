import { IGridRenderer } from "../interface";

/**
 * Scroll renderer.
 */
export class ScrollRenderer implements IGridRenderer {

    /**
     * Creates an instance of scroll renderer.
     */
    constructor() {
    }

    /**
     * Renders into viewport.
     * @param [data] render rows.
     */
    renderIntoViewport(data?: any): void {
        throw new Error("Method not implemented.");
    }

    /**
     * Renders scroll renderer.
     * @param [data] render data.
     * @returns Element to render.
     */
    render(data?: any): HTMLElement {
        return this.getSmartScroll();
    }

    /**
     * Queues render async.
     * @returns Element to render async.
     */
    queueRender(): Promise<HTMLElement> {
        return Promise.resolve(this.render());
    }

    /**
     * Updates scroll bar thumb height based on viewport/content ratio.
     * @param shadowRoot grid shadow root.
     * @param rowCount row count in current data set.
     * @param rowHeight grid row height.
     * @param isVirtualizationActive determines if virtualization mode is active.
     */
    updateScrollBarThumbSize(shadowRoot: ShadowRoot, rowCount: number, rowHeight: number, isVirtualizationActive: boolean): void {
        const viewport = shadowRoot.querySelector('.data-viewport') as HTMLElement;
        const scrollBar = shadowRoot.querySelector('.scroll-bar') as HTMLElement;

        if (!viewport || !scrollBar) {
            return;
        }

        const viewportHeight = viewport.clientHeight || rowHeight;

        if (rowCount <= 0 || !isVirtualizationActive) {
            scrollBar.style.height = `${Math.max(20, Math.min(36, viewportHeight))}px`;
            return;
        }

        const totalContentHeight = Math.max(viewportHeight, rowCount * rowHeight);
        const proportionalHeight = (viewportHeight / totalContentHeight) * viewportHeight;
        const thumbHeight = Math.max(20, Math.min(viewportHeight, Math.round(proportionalHeight)));
        scrollBar.style.height = `${thumbHeight}px`;
    }

    /**
     * Gets scroll bar template.
     * @param [options] render options.
     * @returns scroll bar template.
     */
    private getScrollBarTemplate(options?: any): string {
        return `<div class="scroll-bar" />`;
    }

    /**
     * Gets smart scroll element.
     * @returns smart scroll.
     */
    private getSmartScroll(): HTMLElement {
        const scrollElem = document.createElement('div');
        scrollElem.classList.add('smart-scroll');
        scrollElem.innerHTML = this.getScrollBarTemplate();
        return scrollElem;
    }
}