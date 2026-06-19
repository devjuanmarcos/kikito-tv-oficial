import type React from 'react'

export interface TocItem {
  id: string
  label: string
  level: 1 | 2 | 3 | 4
}

export interface TableOfContentsProps {
  items: TocItem[]
  title?: string
  activeId?: string
  onItemClick?: (id: string) => void
  maxDepth?: 1 | 2 | 3 | 4
  sticky?: boolean
  className?: string
  style?: React.CSSProperties
}
