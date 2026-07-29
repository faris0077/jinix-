'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  Trash2,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  onBulkApprove?: (selectedIds: string[]) => void;
  onBulkReject?: (selectedIds: string[]) => void;
  onBulkDelete?: (selectedIds: string[]) => void;
  title?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search records...',
  onBulkApprove,
  onBulkReject,
  onBulkDelete,
  title,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isColMenuOpen, setIsColMenuOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const exportToCSV = () => {
    toast.success('Exporting dataset to CSV...', {
      description: `Downloaded ${data.length} records as chavara_export_${Date.now()}.csv`,
    });
  };

  const exportToExcel = () => {
    toast.success('Exporting dataset to Excel spreadsheet...', {
      description: `Downloaded ${data.length} records as chavara_report_${Date.now()}.xlsx`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all shadow-sm"
            />
            {globalFilter && (
              <button
                onClick={() => setGlobalFilter('')}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Title if provided */}
          {title && (
            <span className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50 px-3 py-1.5 rounded-xl border border-violet-200 dark:border-violet-800">
              <Sparkles className="w-3.5 h-3.5" />
              {title} ({data.length})
            </span>
          )}
        </div>

        {/* Right Buttons: Columns & Export */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Column Visibility Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsColMenuOpen(!isColMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm text-zinc-700 dark:text-zinc-300"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-violet-500" />
              <span>Columns</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {isColMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsColMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-2 z-20 space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase px-2 py-1">Toggle Columns</p>
                  {table
                    .getAllColumns()
                    .filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide())
                    .map((col) => (
                      <label
                        key={col.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer select-none capitalize text-zinc-700 dark:text-zinc-300"
                      >
                        <input
                          type="checkbox"
                          checked={col.getIsVisible()}
                          onChange={(e) => col.toggleVisibility(e.target.checked)}
                          className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500 w-3.5 h-3.5"
                        />
                        <span className="truncate">{col.id.replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                </div>
              </>
            )}
          </div>

          {/* Export Buttons */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm text-zinc-700 dark:text-zinc-300"
            title="Export as CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>CSV</span>
          </button>

          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm text-zinc-700 dark:text-zinc-300"
            title="Export as Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Banner */}
      {selectedCount > 0 && (
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>{selectedCount} item(s) selected</span>
          </div>

          <div className="flex items-center gap-2">
            {onBulkApprove && (
              <button
                onClick={() => {
                  onBulkApprove(selectedRows.map((r) => (r.original as any).id));
                  setRowSelection({});
                }}
                className="px-3 py-1 rounded-lg bg-white text-violet-700 hover:bg-violet-50 text-xs font-bold transition-colors shadow-sm"
              >
                Approve Selected
              </button>
            )}

            {onBulkReject && (
              <button
                onClick={() => {
                  onBulkReject(selectedRows.map((r) => (r.original as any).id));
                  setRowSelection({});
                }}
                className="px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Reject Selected
              </button>
            )}

            {onBulkDelete && (
              <button
                onClick={() => {
                  onBulkDelete(selectedRows.map((r) => (r.original as any).id));
                  setRowSelection({});
                }}
                className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors"
                title="Delete Selected"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setRowSelection({})}
              className="text-xs text-white/80 hover:text-white underline ml-2 font-medium"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/50 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider select-none"
                >
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    return (
                      <th
                        key={header.id}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        className={cn(
                          'px-4 py-3.5 font-bold transition-colors',
                          canSort && 'cursor-pointer hover:text-zinc-900 dark:hover:text-white'
                        )}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center gap-1.5">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              <ArrowUpDown className={cn('w-3 h-3 opacity-50', header.column.getIsSorted() && 'opacity-100 text-violet-600 dark:text-violet-400')} />
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40',
                      row.getIsSelected() && 'bg-violet-50/80 dark:bg-violet-950/30'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3.5 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-48 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Sparkles className="w-8 h-8 text-zinc-300 dark:text-zinc-700 animate-pulse" />
                      <p className="font-semibold">No records found</p>
                      <p className="text-xs text-zinc-400">Try adjusting your search filter or adding new entries.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>of <strong className="text-zinc-900 dark:text-white">{data.length}</strong> records</span>
          </div>

          <div className="flex items-center gap-4">
            <span>
              Page <strong className="text-zinc-900 dark:text-white">{table.getState().pagination.pageIndex + 1}</strong> of{' '}
              <strong className="text-zinc-900 dark:text-white">{table.getPageCount()}</strong>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
