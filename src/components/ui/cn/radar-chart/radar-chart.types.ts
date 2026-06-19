import type React from 'react'

export interface RadarAxis {
  label: string
  max?: number
}

export interface RadarSeries {
  label: string
  data: number[]
  color?: string
}

export interface RadarChartProps {
  axes: RadarAxis[]
  series: RadarSeries[]
  size?: number
  levels?: number
  showLegend?: boolean
  className?: string
  style?: React.CSSProperties
}
