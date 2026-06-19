import type React from 'react'

export interface FunnelStage {
  label: string
  value: number
  color?: string
}

export interface FunnelChartProps {
  stages: FunnelStage[]
  showValues?: boolean
  showPercent?: boolean
  showConversion?: boolean
  height?: number
  className?: string
  style?: React.CSSProperties
}
