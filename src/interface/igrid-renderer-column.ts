import { CellWidth } from "../model";

/**
 * Grid render column interface.
 */
export interface IGridRenderColumn {

    /**
     * Field of grid renderer column.
     */
    field: string;

    /**
     * Display name of grid renderer column.
     */
    displayName: string;

    /**
     * Value of grid renderer column, optional.
     */
    value?: string;

    /**
     * Value of cell width.
     */
    width: number | string | CellWidth;

    /**
     * Value of cell min width.
     */
    minWidth: number | string | CellWidth;
}