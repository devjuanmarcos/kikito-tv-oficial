import type React from 'react'

export interface ChecklistItem {
  id: string | number
  label: string
  checked?: boolean
  description?: string
}

export type ChecklistIntent = 'primary' | 'success' | 'warning' | 'danger'

export interface ChecklistProps {
  items: ChecklistItem[]
  onChange?: (items: ChecklistItem[]) => void
  showProgress?: boolean
  intent?: ChecklistIntent
  strikethrough?: boolean
  className?: string
  style?: React.CSSProperties
}
