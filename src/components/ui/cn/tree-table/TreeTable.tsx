"use client";

import { DataTable } from "@/components/ui/cn/table/Table";

import type { TreeTableProps } from "./tree-table.types";

/**
 * TreeTable — backward-compat wrapper over the Super DataTable (`variant="tree"`).
 * Visual and API identical to the original TreeTable.
 */
export function TreeTable<T = Record<string, unknown>>(props: TreeTableProps<T>) {
  return <DataTable variant="tree" {...(props as TreeTableProps<Record<string, unknown>>)} />;
}
