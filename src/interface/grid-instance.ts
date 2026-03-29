export interface IGridInstance {
    id: string;
    refreshGrid(delay?: number): Promise<boolean>;
    rebuildGrid(force: boolean): Promise<boolean>;
    updateData(data: any[]): Promise<boolean>;
    performSearch(query: string): Promise<boolean>;
    clearSearch(): Promise<boolean>;
    exportToExcel(fileName?: string): Promise<boolean>;
    exportToCsv(fileName?: string): Promise<boolean>;
    clearData(data: any[], showNoDataMessage: true, message: string): Promise<boolean>;
    hideColumn(field: string): void;
    showColumn(field: string): void;
    scrollToTop(): void;
    scrollToBottom(): void;
    scrollTo(position: number): void;
}