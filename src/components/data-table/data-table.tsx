import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import * as React from "react";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getColumnPinningStyle } from "@/lib/data-table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  /**
   * Quando true, considera o padding do card (p-4/p-6) no cálculo da largura máxima.
   * Use true quando a tabela estiver dentro de TableCard/BaseCard.
   */
  insideCard?: boolean;
}

/** Calc da largura máxima: viewport - sidebar - 2× SidebarInset padding - 2× page padding - (opcional) 2× card padding */
function getTableMaxWidthCalc(insideCard: boolean): string {
  const cardPart = insideCard ? " - 2 * var(--layout-card-padding-x)" : "";
  return `calc(100vw - var(--layout-sidebar-offset, 0rem) - 2 * var(--layout-sidebar-inset-padding-x) - 2.2 * var(--layout-page-padding-x)${cardPart})`;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  insideCard = true,
  style,
  ...props
}: DataTableProps<TData>) {
  const maxWidthStyle = React.useMemo(
    () => ({ ...style, minWidth: 0, maxWidth: getTableMaxWidthCalc(insideCard) }),
    [insideCard, style]
  );

  return (
    <div className={cn("flex min-w-0 w-full max-w-full flex-col gap-2.5", className)} style={maxWidthStyle} {...props}>
      {children}
      {/* Container com largura máxima 100% do pai: scroll horizontal sem quebrar o layout */}
      <div
        className="w-full max-w-full min-w-0 overflow-x-auto overflow-y-visible rounded-md border bg-card"
        style={{ maxWidth: "100%" }}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getColumnPinningStyle({ column: header.column }),
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getColumnPinningStyle({ column: cell.column }),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex min-w-0 flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
}
