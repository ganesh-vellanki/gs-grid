import { IGridInstance } from "../interface";

export interface GridInstanceHandlers {
    updateData?: (data: any[]) => Promise<boolean>;
    getSelectedRows?: () => any[];
    setRowSelectionEnabled?: (enabled: boolean) => Promise<boolean>;
    performSearch?: (query: string) => Promise<boolean>;
    clearSearch?: () => Promise<boolean>;
    exportToExcel?: (fileName?: string) => Promise<boolean>;
    exportToCsv?: (fileName?: string) => Promise<boolean>;
}

/**
 * Grid instance to handle operations on rendered grid.
 */
export class GridInstance implements IGridInstance {
    id: string;
    private handlers: GridInstanceHandlers;

    constructor(id: string, handlers?: GridInstanceHandlers) {
        this.id = id;
        this.handlers = handlers || {};
    }

    refreshGrid(delay?: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    rebuildGrid(force: boolean): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    updateData(data: any[]): Promise<boolean> {
        if (this.handlers.updateData) {
            return this.handlers.updateData(data);
        }

        return Promise.resolve(false);
    }

    getSelectedRows(): any[] {
        if (this.handlers.getSelectedRows) {
            return this.handlers.getSelectedRows();
        }

        return [];
    }

    setRowSelectionEnabled(enabled: boolean): Promise<boolean> {
        if (this.handlers.setRowSelectionEnabled) {
            return this.handlers.setRowSelectionEnabled(enabled);
        }

        return Promise.resolve(false);
    }

    performSearch(query: string): Promise<boolean> {
        if (this.handlers.performSearch) {
            return this.handlers.performSearch(query);
        }

        return Promise.resolve(false);
    }

    clearSearch(): Promise<boolean> {
        if (this.handlers.clearSearch) {
            return this.handlers.clearSearch();
        }

        return Promise.resolve(false);
    }

    exportToExcel(fileName?: string): Promise<boolean> {
        if (this.handlers.exportToExcel) {
            return this.handlers.exportToExcel(fileName);
        }

        return Promise.resolve(false);
    }

    exportToCsv(fileName?: string): Promise<boolean> {
        if (this.handlers.exportToCsv) {
            return this.handlers.exportToCsv(fileName);
        }

        return Promise.resolve(false);
    }

    clearData(data: any[], showNoDataMessage: true, message: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    hideColumn(field: string): void {
        throw new Error("Method not implemented.");
    }

    showColumn(field: string): void {
        throw new Error("Method not implemented.");
    }

    scrollToTop(): void {
        throw new Error("Method not implemented.");
    }

    scrollToBottom(): void {
        throw new Error("Method not implemented.");
    }

    scrollTo(position: number): void {
        throw new Error("Method not implemented.");
    }
}