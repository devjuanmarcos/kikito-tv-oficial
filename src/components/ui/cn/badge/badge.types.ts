import type React from 'react'

export type BadgeVariant = 'solid' | 'outline' | 'soft' | 'ghost' | 'dot'
export type BadgeSize    = 'sm' | 'md' | 'lg'
export type BadgeRounded = 'none' | 'sm' | 'md' | 'lg' | 'full'
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
  rounded?: BadgeRounded
  dot?: boolean
  dismissible?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  onDismiss?: () => void
}
