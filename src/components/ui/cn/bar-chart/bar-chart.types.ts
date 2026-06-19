import type React from 'react'

export interface BarChartItem {
  label: string
  value: number
  color?: string
}

export interface BarChartProps {
  data: BarChartItem[]
  height?: number
  barWidth?: number
  gap?: number
  showValues?: boolean
  showBaseline?: boolean
  color?: string
  animate?: boolean
  className?: string
  style?: React.CSSProperties
}
