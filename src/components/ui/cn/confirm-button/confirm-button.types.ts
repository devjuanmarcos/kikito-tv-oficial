import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ConfirmButtonIntent = 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
export type ConfirmButtonVariant = 'solid' | 'outline' | 'soft'
export type ConfirmMode = 'doubleclick' | 'hold'

export interface ConfirmButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  children: ReactNode
  onConfirm: () => void
  confirmLabel?: string
  mode?: ConfirmMode
  holdDuration?: number
  intent?: ConfirmButtonIntent
  variant?: ConfirmButtonVariant
  resetDelay?: number
}
