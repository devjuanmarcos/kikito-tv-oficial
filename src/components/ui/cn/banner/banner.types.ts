import type React from 'react'

export type BannerIntent = 'info' | 'success' | 'warning' | 'danger' | 'neutral'

export interface BannerProps {
  children: React.ReactNode
  intent?: BannerIntent
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}
