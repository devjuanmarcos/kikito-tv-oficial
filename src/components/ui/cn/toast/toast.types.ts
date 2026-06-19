import type React from 'react'

export type ToastIntent    = 'info' | 'success' | 'warning' | 'danger' | 'neutral'
export type ToastVariant   = 'soft' | 'solid'
export type ToastPlacement =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface ToastOptions {
  id?: string
  intent?: ToastIntent
  variant?: ToastVariant
  title?: string
  message?: string
  duration?: number
  dismissible?: boolean
  icon?: React.ReactNode
  action?: { label: string; onClick: () => void }
}

export interface ToastItem extends Required<Omit<ToastOptions, 'icon' | 'action'>> {
  icon?: React.ReactNode
  action?: { label: string; onClick: () => void }
  exiting: boolean
}

export interface ToastContextValue {
  toast:   (opts: ToastOptions | string) => string
  dismiss: (id: string) => void
  clear:   () => void
}
