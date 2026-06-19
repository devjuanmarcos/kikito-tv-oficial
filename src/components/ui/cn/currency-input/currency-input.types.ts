import type React from 'react'

export interface CurrencyInputProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  currency?: string
  locale?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  min?: number
  max?: number
  className?: string
  style?: React.CSSProperties
}
