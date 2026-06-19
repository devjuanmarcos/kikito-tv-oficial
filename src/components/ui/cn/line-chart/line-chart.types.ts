import type React from 'react'

export interface LineChartSeries {
  label: string
  data: number[]
  color?: string
}

export interface LineChartProps {
  series: LineChartSeries[]
  labels?: string[]
  height?: number
  width?: number | string
  showArea?: boolean
  showDots?: boolean
  showGrid?: boolean
  showLegend?: boolean
  className?: string
  style?: React.CSSProperties
}
