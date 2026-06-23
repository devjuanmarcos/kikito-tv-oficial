"use client";

import { DataTable } from "@/components/ui/cn/table/Table";

import type { DataListProps } from "./data-list.types";

/**
 * DataList — backward-compat wrapper over the Super DataTable (`variant="list"`).
 * Visual and API identical to the original DataList.
 */
export function DataList(props: DataListProps) {
  return <DataTable variant="list" {...props} />;
}
