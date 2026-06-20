import type React from 'react'

export type InputSize    = 'sm' | 'md' | 'lg'
export type InputVariant = 'outline' | 'filled' | 'flushed' | 'ghost'
export type InputStatus  = 'default' | 'error' | 'success' | 'warning'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize
  variant?: InputVariant
  /** Visual validation state. */
  status?: InputStatus
  /** Alias for `status` (old API compat). */
  state?: InputStatus
  label?: string
  /** Generic helper text below the input. */
  hint?: string
  /** Alias for `hint` (old API compat). */
  helperText?: string
  /** Error message (also forces status=error when provided). */
  error?: string
  /** Alias for `error`. */
  errorText?: string
  /** Text shown when status/state === 'success'. */
  successText?: string
  /** Text shown when status/state === 'warning'. */
  warningText?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  prefix?: string
  suffix?: string
  fullWidth?: boolean
  /** Shows a ×-button when input has value to clear it. */
  clearable?: boolean
  onClear?: () => void
  /** For type="password" — adds a show/hide toggle button. */
  revealable?: boolean
}
