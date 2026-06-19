import type React from 'react'

export interface QuickAction {
  id: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
  intent?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
}

export interface QuickActionsProps {
  actions: QuickAction[]
  triggerIcon?: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  style?: React.CSSProperties
}
