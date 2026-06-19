import type React from 'react'

export interface CountdownTimerProps {
  targetDate?: Date | string
  seconds?: number
  showDays?: boolean
  showLabels?: boolean
  separator?: string
  onComplete?: () => void
  className?: string
  style?: React.CSSProperties
}
