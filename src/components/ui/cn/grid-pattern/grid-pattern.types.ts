import type React from 'react'

export type GridPatternType = 'dots' | 'lines' | 'cross' | 'grid'

export interface GridPatternProps {
  type?: GridPatternType
  size?: number
  color?: string
  opacity?: number
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}
