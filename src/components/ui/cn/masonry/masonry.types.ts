import type React from 'react'

export interface MasonryProps {
  children: React.ReactNode
  columns?: number | { sm?: number; md?: number; lg?: number }
  gap?: number
  className?: string
  style?: React.CSSProperties
}
