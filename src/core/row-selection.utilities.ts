export interface RowSelectionState {
    isAllSelected: boolean;
    isPartiallySelected: boolean;
    selectedCount: number;
}

export type RowSelectionChangeHandler = (selectedRows: any[], currentSelectedRow: any | null) => Promise<void>;

/**
 * Row selection utility for a single grid instance.
 */
export class RowSelectionUtilities {
    private readonly selectedRows: Set<any>;
    private selectionChangeHandler?: RowSelectionChangeHandler;

    constructor(selectionChangeHandler?: RowSelectionChangeHandler) {
        this.selectedRows = new Set<any>();
        this.selectionChangeHandler = selectionChangeHandler;
    }

    setSelectionChangeHandler(handler?: RowSelectionChangeHandler): void {
        this.selectionChangeHandler = handler;
    }

    isSelected(row: any): boolean {
        return this.selectedRows.has(row);
    }

    getSelectedRows(): any[] {
        return Array.from(this.selectedRows);
    }

    clearSelection(): void {
        this.selectedRows.clear();
    }

    resetForData(data: any[]): void {
        const nextDataSet = new Set<any>(data || []);

        this.selectedRows.forEach((row: any) => {
            if (!nextDataSet.has(row)) {
                this.selectedRows.delete(row);
            }
        });
    }

    async toggleRow(row: any): Promise<void> {
        const shouldSelect = !this.selectedRows.has(row);
        await this.setRowSelection(row, shouldSelect, row);
    }

    async setRowSelection(row: any, shouldSelect: boolean, currentSelectedRow: any | null = row): Promise<void> {
        if (shouldSelect) {
            this.selectedRows.add(row);
        } else {
            this.selectedRows.delete(row);
        }

        await this.notifySelectionChange(currentSelectedRow);
    }

    async selectAll(rows: any[]): Promise<void> {
        (rows || []).forEach((row: any) => this.selectedRows.add(row));
        await this.notifySelectionChange(null);
    }

    async unselectAll(rows: any[]): Promise<void> {
        (rows || []).forEach((row: any) => this.selectedRows.delete(row));
        await this.notifySelectionChange(null);
    }

    getHeaderState(rows: any[]): RowSelectionState {
        const activeRows = rows || [];
        const selectedCount = activeRows.reduce((count: number, row: any) => {
            return this.selectedRows.has(row) ? count + 1 : count;
        }, 0);
        const totalRowCount = activeRows.length;

        return {
            isAllSelected: totalRowCount > 0 && selectedCount === totalRowCount,
            isPartiallySelected: selectedCount > 0 && selectedCount < totalRowCount,
            selectedCount
        };
    }

    private async notifySelectionChange(currentSelectedRow: any | null): Promise<void> {
        if (!this.selectionChangeHandler) {
            return;
        }

        await this.selectionChangeHandler(this.getSelectedRows(), currentSelectedRow);
    }
}