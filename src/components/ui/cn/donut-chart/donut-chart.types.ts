import type React from 'react'

export interface DonutSegment {
  label: string
  value: number
  color?: string
}

export interface DonutChartProps {
  segments: DonutSegment[]
  size?: number
  strokeWidth?: number
  showLegend?: boolean
  centerLabel?: string
  centerValue?: string | number
  className?: string
  style?: React.CSSProperties
}
