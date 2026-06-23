"use client";

import { DataTable } from "@/components/ui/cn/table/Table";

import type { DataGridProps } from "./data-grid.types";

/**
 * DataGrid — backward-compat wrapper over the Super DataTable (`variant="grid"`).
 * Visual and API identical to the original DataGrid.
 */
export function DataGrid<T = Record<string, unknown>>(props: DataGridProps<T>) {
  return <DataTable variant="grid" {...(props as DataGridProps<Record<string, unknown>>)} />;
}
