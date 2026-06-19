import type React from 'react'

export type SortDir = 'asc' | 'desc'
export type FilterVariant = 'text' | 'select' | 'multiSelect'
export type TableSize = 'sm' | 'md' | 'lg'

export interface FilterOption {
  value: string
  label: string
  icon?: React.ReactNode
}

export interface ColumnDef<TRow> {
  key: string
  header: string
  cell?: (row: TRow, rowIndex: number) => React.ReactNode
  accessor?: (row: TRow) => string | number
  sortable?: boolean
  filterable?: boolean
  filterVariant?: FilterVariant
  filterOptions?: FilterOption[]
  width?: number | string
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  pinRight?: boolean
  hideable?: boolean
  defaultHidden?: boolean
}

export interface DataTableProps<TRow> {
  columns: ColumnDef<TRow>[]
  data: TRow[]
  getRowId?: (row: TRow, index: number) => string
  selectable?: boolean
  pageSizeOptions?: number[]
  defaultPageSize?: number
  defaultSort?: { key: string; dir: SortDir }
  emptyMessage?: string
  actionBar?: (selectedIds: string[]) => React.ReactNode
  onRowClick?: (row: TRow) => void
  stickyHeader?: boolean
  striped?: boolean
  size?: TableSize
  loading?: boolean
  className?: string
  style?: React.CSSProperties
}
