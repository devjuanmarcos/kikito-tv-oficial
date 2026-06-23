import type React from "react";

export type SortDir = "asc" | "desc";
export type FilterVariant = "text" | "select" | "multiSelect";
export type TableSize = "sm" | "md" | "lg";

export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface ColumnDef<TRow> {
  key: string;
  header: string;
  cell?: (row: TRow, rowIndex: number) => React.ReactNode;
  accessor?: (row: TRow) => string | number;
  sortable?: boolean;
  filterable?: boolean;
  filterVariant?: FilterVariant;
  filterOptions?: FilterOption[];
  width?: number | string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  pinRight?: boolean;
  hideable?: boolean;
  defaultHidden?: boolean;
}

export interface DataTableProps<TRow> {
  /** Discriminator selecting the rendering variant. Default 'table'. */
  variant?: "table";
  columns: ColumnDef<TRow>[];
  data: TRow[];
  getRowId?: (row: TRow, index: number) => string;
  selectable?: boolean;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  defaultSort?: { key: string; dir: SortDir };
  emptyMessage?: string;
  actionBar?: (selectedIds: string[]) => React.ReactNode;
  onRowClick?: (row: TRow) => void;
  stickyHeader?: boolean;
  striped?: boolean;
  size?: TableSize;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/* ── Variant: grid (absorbed from DataGrid) ── */

export interface DataGridColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  width?: number | string;
  sortable?: boolean;
  render?: (row: T, rowIndex: number) => React.ReactNode;
  align?: "left" | "center" | "right";
}

export interface DataTableGridProps<T = Record<string, unknown>> {
  variant: "grid";
  columns: DataGridColumn<T>[];
  rows: T[];
  getRowKey?: (row: T, index: number) => string;
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  stickyHeader?: boolean;
  striped?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/* ── Variant: list (absorbed from DataList) ── */

export type DataListLayout = "horizontal" | "vertical" | "grid";

export interface DataListItem {
  label: string;
  value: React.ReactNode;
  span?: number;
}

export interface DataTableListProps {
  variant: "list";
  items: DataListItem[];
  layout?: DataListLayout;
  columns?: number;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/* ── Variant: tree (absorbed from TreeTable) ── */

export interface TreeTableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  width?: number | string;
  render?: (row: T) => React.ReactNode;
}

export interface TreeTableRow<T = Record<string, unknown>> {
  id: string;
  data: T;
  children?: TreeTableRow<T>[];
}

export interface DataTableTreeProps<T = Record<string, unknown>> {
  variant: "tree";
  columns: TreeTableColumn<T>[];
  rows: TreeTableRow<T>[];
  defaultExpanded?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** Discriminated union over `variant` for the Super DataTable. */
export type SuperDataTableProps<TRow extends object = Record<string, unknown>> =
  | DataTableProps<TRow>
  | DataTableGridProps
  | DataTableListProps
  | DataTableTreeProps;
