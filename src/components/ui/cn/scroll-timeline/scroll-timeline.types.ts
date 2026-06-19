import type React from 'react'

export interface ScrollTimelineEvent {
  id: string
  date: string
  title: string
  description?: React.ReactNode
  icon?: React.ReactNode
  intent?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger' | 'neutral'
}

export interface ScrollTimelineProps {
  events: ScrollTimelineEvent[]
  orientation?: 'left' | 'right' | 'alternating'
  lineColor?: string
  className?: string
  style?: React.CSSProperties
}
