import type React from 'react'

export type InputSize    = 'sm' | 'md' | 'lg'
export type InputVariant = 'outline' | 'filled' | 'flushed'
export type InputStatus  = 'default' | 'error' | 'success' | 'warning'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize
  variant?: InputVariant
  status?: InputStatus
  label?: string
  hint?: string
  error?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  prefix?: string
  suffix?: string
  fullWidth?: boolean
}
