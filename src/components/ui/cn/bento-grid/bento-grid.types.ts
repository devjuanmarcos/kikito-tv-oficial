import type React from 'react'

export interface BentoItem {
  id: string | number
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2
  className?: string
  children?: React.ReactNode
}

export interface BentoGridProps {
  items: BentoItem[]
  cols?: 3 | 4
  gap?: number
  className?: string
  style?: React.CSSProperties
}
