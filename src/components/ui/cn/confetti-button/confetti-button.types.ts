import type React from 'react'

export type ConfettiButtonIntent = 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
export type ConfettiButtonSize = 'sm' | 'md' | 'lg'

export interface ConfettiButtonProps {
  children: React.ReactNode
  onClick?: () => void
  particleCount?: number
  spread?: number
  intent?: ConfettiButtonIntent
  size?: ConfettiButtonSize
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}
