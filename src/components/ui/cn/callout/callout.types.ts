import type React from 'react'

export type CalloutIntent = 'info' | 'success' | 'warning' | 'danger' | 'neutral'
export type CalloutAppearance = 'soft' | 'outline' | 'solid'

export interface CalloutProps {
  intent?: CalloutIntent
  appearance?: CalloutAppearance
  title?: string
  icon?: React.ReactNode
  children?: React.ReactNode
  onClose?: () => void
  action?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}
