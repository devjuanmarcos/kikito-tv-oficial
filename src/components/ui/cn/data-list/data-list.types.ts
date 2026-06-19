export type DataListLayout = 'horizontal' | 'vertical' | 'grid'

export interface DataListItem {
  label: string
  value: React.ReactNode
  span?: number
}

export interface DataListProps {
  items: DataListItem[]
  layout?: DataListLayout
  columns?: number
  striped?: boolean
  bordered?: boolean
  compact?: boolean
  className?: string
  style?: React.CSSProperties
}
