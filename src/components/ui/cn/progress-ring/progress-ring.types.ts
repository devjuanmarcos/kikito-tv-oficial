import type React from 'react'

export type ProgressRingIntent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'

export interface ProgressRingProps {
  value: number
  max?: number
  size?: number
  stroke?: number
  intent?: ProgressRingIntent
  label?: React.ReactNode
  showValue?: boolean
  className?: string
  style?: React.CSSProperties
}
