import type React from 'react'

export type SparklineType = 'line' | 'bar' | 'area'

export interface SparklineProps {
  data: number[]
  type?: SparklineType
  width?: number
  height?: number
  color?: string
  intent?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
  strokeWidth?: number
  filled?: boolean
  className?: string
  style?: React.CSSProperties
}
