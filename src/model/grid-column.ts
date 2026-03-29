import { IGridColumn } from "../interface";
import { PinColumn } from ".";
import { CellWidth } from "./grid-constants";

export class GridColumn implements IGridColumn {
    field: string;
    headerName: string;
    valueFn?: () => string | number;
    enableSort?: boolean;
    sortFn?: (aValue: any, bValue: any, aRow: any, bRow: any, direction: 'asc' | 'desc') => number;
    enableFilter?: boolean;
    pinColumn?: PinColumn;
    width: number | string | CellWidth;
    minWidth: number | string | CellWidth;

    constructor(args: IGridColumn) {
        this.field = args.field;
        this.headerName = args.headerName;
        this.valueFn = args.valueFn || null;
        this.enableSort = args.enableSort || false;
        this.sortFn = args.sortFn || null;
        this.enableFilter = args.enableFilter || false;
        this.pinColumn = args.pinColumn || PinColumn.None;
        this.width = args.width || CellWidth.Auto;
        this.minWidth = args.minWidth || CellWidth.Auto;
    }
}