import type React from 'react'

export interface ComparisonColumn {
  key: string
  label: string
  highlight?: boolean
  badge?: string
}

export interface ComparisonRow {
  feature: string
  group?: string
  values: Record<string, boolean | string | React.ReactNode>
  tooltip?: string
}

export interface ComparisonTableProps {
  columns: ComparisonColumn[]
  rows: ComparisonRow[]
  stickyHeader?: boolean
  className?: string
  style?: React.CSSProperties
}
