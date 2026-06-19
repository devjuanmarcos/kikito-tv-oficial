import type React from 'react'

export type AlertDialogIntent = 'danger' | 'warning' | 'primary'

export interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
  intent?: AlertDialogIntent
  loading?: boolean
  className?: string
  style?: React.CSSProperties
}
