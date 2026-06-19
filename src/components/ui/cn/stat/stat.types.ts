import type React from 'react'

export type StatTrend  = 'up' | 'down' | 'neutral'
export type StatIntent = 'default' | 'primary' | 'success' | 'warning' | 'danger'

export interface StatProps {
  label: string
  value: string | number
  description?: string
  trend?: StatTrend
  trendValue?: string
  icon?: React.ReactNode
  intent?: StatIntent
  loading?: boolean
  className?: string
  style?: React.CSSProperties
}
