import type React from 'react'

export interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  size?: 'sm' | 'md'
  showEdges?: boolean
  siblings?: number
  totalItems?: number
  pageSize?: number
  className?: string
  style?: React.CSSProperties
}
