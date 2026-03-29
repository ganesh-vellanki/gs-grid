import { CellWidth, PinColumn } from "../model";

export type GridSortDirection = 'asc' | 'desc';
export type GridSortFn<T = any> = (aValue: any, bValue: any, aRow: T, bRow: T, direction: GridSortDirection) => number;

/**
 * Grid column interface.
 */
export interface IGridColumn {
    field: string;
    headerName: string;
    valueFn?: () => string | number;
    enableSort?: boolean;
    sortFn?: GridSortFn;
    enableFilter?: boolean;
    pinColumn?: PinColumn;
    width?: number | string | CellWidth;
    minWidth?: number | string;
}