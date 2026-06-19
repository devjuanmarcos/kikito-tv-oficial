import type React from 'react'

export type BadgeVariant = 'solid' | 'outline' | 'soft' | 'dot'
export type BadgeSize    = 'sm' | 'md' | 'lg'
export type BadgeIntent  =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  intent?: BadgeIntent
  dot?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  onDismiss?: () => void
}
