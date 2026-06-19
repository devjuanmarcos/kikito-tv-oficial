import type React from 'react'

export interface TreeTableColumn<T = Record<string, unknown>> {
  key: string
  header: string
  width?: number | string
  render?: (row: T) => React.ReactNode
}

export interface TreeTableRow<T = Record<string, unknown>> {
  id: string
  data: T
  children?: TreeTableRow<T>[]
}

export interface TreeTableProps<T = Record<string, unknown>> {
  columns: TreeTableColumn<T>[]
  rows: TreeTableRow<T>[]
  defaultExpanded?: boolean
  className?: string
  style?: React.CSSProperties
}
