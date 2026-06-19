import type React from 'react'

export interface AreaChartDataPoint {
  label: string
  [series: string]: number | string
}

export interface AreaChartSeries {
  key: string
  label?: string
  color?: string
}

export interface AreaChartProps {
  data: AreaChartDataPoint[]
  series: AreaChartSeries[]
  height?: number
  showGrid?: boolean
  showDots?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  stacked?: boolean
  gradient?: boolean
  className?: string
  style?: React.CSSProperties
}
