import type React from 'react'

export type TimelineStatus = 'pending' | 'active' | 'complete' | 'error' | 'warning'
export type TimelineVariant = 'default' | 'compact' | 'reverse'

export interface TimelineItem {
  id?: string
  title: string
  description?: React.ReactNode
  timestamp?: string
  status?: TimelineStatus
  icon?: React.ReactNode
  badge?: React.ReactNode
  actions?: React.ReactNode
}

export interface TimelineProps {
  items: TimelineItem[]
  variant?: TimelineVariant
  lastLine?: boolean
  className?: string
  style?: React.CSSProperties
}
