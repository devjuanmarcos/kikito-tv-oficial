import type React from 'react'

export interface VirtualListProps<T = unknown> {
  items: T[]
  itemHeight: number
  height: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
  style?: React.CSSProperties
}
