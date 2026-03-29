import { IGridColumn } from "../interface";

export type SortDirection = "asc" | "desc";
export type SortComparator<T = any> = (aValue: any, bValue: any, aRow: T, bRow: T, direction: SortDirection) => number;

/**
 * Sort utilities.
 */
export class SortUtilities {
    /**
     * Sorts a data set by field using custom comparator if provided.
     * @param data source rows.
     * @param column selected grid column.
     * @param direction sort direction.
     * @returns sorted copy of source data.
     */
    static sortDataSet<T>(data: T[], column: IGridColumn, direction: SortDirection): T[] {
        if (!data || data.length <= 1 || !column) {
            return data ? [...data] : [];
        }

        const multiplier = direction === "asc" ? 1 : -1;
        const sorter = column.sortFn || SortUtilities.defaultSortFn;

        return [...data].sort((aRow: T, bRow: T) => {
            const aValue = SortUtilities.getFieldValue(column.field, aRow);
            const bValue = SortUtilities.getFieldValue(column.field, bRow);
            return sorter(aValue, bValue, aRow, bRow, direction) * multiplier;
        });
    }

    /**
     * Default sorting logic for primitive values.
     * @param aValue first value.
     * @param bValue second value.
     * @returns number compare result.
     */
    static defaultSortFn(aValue: any, bValue: any): number {
        if (aValue == null && bValue == null) {
            return 0;
        }

        if (aValue == null) {
            return 1;
        }

        if (bValue == null) {
            return -1;
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
            return aValue - bValue;
        }

        const aAsString = String(aValue).toLowerCase();
        const bAsString = String(bValue).toLowerCase();
        return aAsString.localeCompare(bAsString);
    }

    /**
     * Gets nested field value from row data by dot notation.
     * @param field field key, optionally dot-notated.
     * @param row source row.
     * @returns extracted field value.
     */
    static getFieldValue(field: string, row: any): any {
        if (!field || !row) {
            return undefined;
        }

        if (field.indexOf(".") === -1) {
            return row[field];
        }

        return field.split(".").reduce((previous, current) => {
            if (previous == null) {
                return undefined;
            }

            return previous[current];
        }, row);
    }
}