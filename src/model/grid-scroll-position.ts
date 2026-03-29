import { IGridScrollPosition } from "../interface";

/**
 * Grid scroll position.
 */
export class GridScrollPosition implements IGridScrollPosition {

    /**
     * Creates an instance of grid scroll position.
        * @param yMin minimum y bound.
        * @param y current y position.
        * @param yMax maximum y bound.
     */
    constructor(yMin: number, y:number, yMax: number) {
        this.yMin = yMin;
        this.y = y;
        this.yMax = yMax;
    }

    /**
     * Y min of grid scroll position.
     */
    yMin: number;
    /**
     * Y max of grid scroll position.
     */
    yMax: number;

    /**
     * Y of grid scroll position.
     */
    y: number;

    /**
     * Gets y percent.
     * @returns y percent.
     */
    getYPercent(): number {
        const denominator = this.yMax - this.yMin;
        if (denominator <= 0) {
            return 0;
        }

        return ((this.y - this.yMin) / denominator) * 100;
    }
}