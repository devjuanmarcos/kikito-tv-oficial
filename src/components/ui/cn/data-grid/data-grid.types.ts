import type React from 'react'

export interface DataGridColumn<T = Record<string, unknown>> {
  key: string
  header: string
  width?: number | string
  sortable?: boolean
  render?: (row: T, rowIndex: number) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

export interface DataGridProps<T = Record<string, unknown>> {
  columns: DataGridColumn<T>[]
  rows: T[]
  getRowKey?: (row: T, index: number) => string
  selectable?: boolean
  selectedKeys?: string[]
  onSelectionChange?: (keys: string[]) => void
  stickyHeader?: boolean
  striped?: boolean
  className?: string
  style?: React.CSSProperties
}
