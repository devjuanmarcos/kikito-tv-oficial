import type React from 'react'

export type GaugeIntent = 'default' | 'primary' | 'success' | 'warning' | 'danger'
export type GaugeSize = 'sm' | 'md' | 'lg'

export interface GaugeProps {
  value: number
  max?: number
  size?: GaugeSize
  intent?: GaugeIntent
  label?: string
  showValue?: boolean
  strokeWidth?: number
  className?: string
  style?: React.CSSProperties
}
