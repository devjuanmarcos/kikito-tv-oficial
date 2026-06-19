import type React from 'react'

export type ActivityFeedIntent = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export interface ActivityFeedItem {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  time: string
  icon?: React.ReactNode
  intent?: ActivityFeedIntent
  avatar?: string
  avatarFallback?: string
}

export interface ActivityFeedProps {
  items: ActivityFeedItem[]
  compact?: boolean
  className?: string
  style?: React.CSSProperties
}
