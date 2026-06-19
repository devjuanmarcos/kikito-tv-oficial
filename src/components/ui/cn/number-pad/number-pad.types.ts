import type React from 'react'

export interface NumberPadProps {
  value?: string
  onChange?: (value: string) => void
  maxLength?: number
  showValue?: boolean
  masked?: boolean
  onComplete?: (value: string) => void
  onClear?: () => void
  className?: string
  style?: React.CSSProperties
}
