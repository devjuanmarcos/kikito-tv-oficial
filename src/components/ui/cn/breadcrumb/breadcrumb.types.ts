import type React from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  maxItems?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
}
