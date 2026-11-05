import * as React from 'react';
import {
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { cn } from '../../lib/utils';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableRowSelection?: boolean;
  pageSize?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableRowSelection = true,
  pageSize = 5,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // Adiciona coluna de seleção de linhas automaticamente se habilitada
  const tableColumns = React.useMemo(() => {
    if (!enableRowSelection) return columns;

    const selectColumn: ColumnDef<TData, unknown> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todas as linhas"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Selecionar linha ${row.index + 1}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };

    return [selectColumn as ColumnDef<TData, TValue>, ...columns];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Tabela */}
      <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-[var(--color-border)] bg-[var(--color-elevated)] text-xs uppercase tracking-wider text-[var(--color-muted)] table-row-standard"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  return (
                    <th key={header.id} className="px-4 py-2 font-medium">
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className="flex items-center gap-1.5 hover:text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)] rounded-sm cursor-pointer"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {isSorted === 'asc' ? (
                            <ChevronUp className="h-3.5 w-3.5 text-[var(--color-glow)]" />
                          ) : isSorted === 'desc' ? (
                            <ChevronDown className="h-3.5 w-3.5 text-[var(--color-glow)]" />
                          ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'table-row-standard hover:bg-[var(--color-elevated)] transition-colors duration-150',
                    row.getIsSelected() && 'bg-[var(--color-elevated)]/60'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableColumns.length}
                  className="h-24 text-center text-sm text-[var(--color-muted)]"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação e Seleção */}
      <div className="flex items-center justify-between px-2 text-xs text-[var(--color-muted)]">
        <div>
          {enableRowSelection && (
            <span>
              {table.getFilteredSelectedRowModel().rows.length} de{' '}
              {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Próxima página"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
