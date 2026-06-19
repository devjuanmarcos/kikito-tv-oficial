import type React from 'react'

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'soft'
export type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonIntent  =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  intent?: ButtonIntent
  loading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
  asChild?: boolean
}
