import * as XLSX from 'xlsx';
import { IGridColumn } from '../interface';
import { SortUtilities } from './sort.utils';

/**
 * Export utilities for grid datasets.
 */
export class ExportUtilities {
    /**
     * Exports the provided grid data to an xlsx file.
     * @param data source rows.
     * @param columns source columns.
     * @param fileName output file name without extension.
     */
    static exportToExcel(data: any[], columns: IGridColumn[], fileName?: string): boolean {
        const rowsForExport = ExportUtilities.buildExportRows(data, columns);
        const worksheet = XLSX.utils.json_to_sheet(rowsForExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'GridData');
        XLSX.writeFile(workbook, `${fileName || 'gs-grid-export'}.xlsx`);
        return true;
    }

    /**
     * Exports the provided grid data to a csv file.
     * @param data source rows.
     * @param columns source columns.
     * @param fileName output file name without extension.
     */
    static exportToCsv(data: any[], columns: IGridColumn[], fileName?: string): boolean {
        const rowsForExport = ExportUtilities.buildExportRows(data, columns);
        const headers = columns.map(col => col.headerName || col.field);
        const csvRows: string[] = [headers.map(ExportUtilities.escapeCsvValue).join(',')];

        rowsForExport.forEach(row => {
            const csvRow = headers
                .map(header => ExportUtilities.escapeCsvValue(row[header]))
                .join(',');
            csvRows.push(csvRow);
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName || 'gs-grid-export'}.csv`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        return true;
    }

    /**
     * Maps row data into export-friendly shape using column headers as keys.
     */
    private static buildExportRows(data: any[], columns: IGridColumn[]): Array<{ [key: string]: any }> {
        return (data || []).map(row => {
            const exportRow: { [key: string]: any } = {};
            columns.forEach(col => {
                const key = col.headerName || col.field;
                exportRow[key] = SortUtilities.getFieldValue(col.field, row);
            });
            return exportRow;
        });
    }

    /**
     * Escapes a value for csv output.
     */
    private static escapeCsvValue(value: any): string {
        if (value === null || value === undefined) {
            return '""';
        }

        const raw = String(value).replace(/"/g, '""');
        return `"${raw}"`;
    }
}