import { Observable } from "rxjs";
import { IGridColumn, IGridInstance } from ".";

/**
 * Grid config interface.
 */
export interface IGridConfig {
    /**
     * Column defs of grid config
     */
    columnDefs: IGridColumn[];

    /**
     * Instance of grid config
     */
    instance: IGridInstance;

    /**
     * Row height of grid config.
     */
    rowHeight: number;

    /**
     * Determines whether instance ready is
     * @returns true if instance ready 
     */
    IsInstanceReady(): boolean;

    /**
     * Determines whether render is complete.
     * @returns render complete subscription.
     */
    IsRenderComplete(): Observable<boolean>

    /**
     * data set to display
     */
    data?: any[];

    /**
     * Convenience API for global search across grid columns.
     */
    performSearch?: (query: string) => Promise<boolean>;

    /**
     * Convenience API to clear active global search.
     */
    clearSearch?: () => Promise<boolean>;
}