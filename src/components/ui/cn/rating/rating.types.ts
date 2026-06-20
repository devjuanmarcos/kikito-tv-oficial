import type React from 'react'

export type RatingSize = 'sm' | 'md' | 'lg'

export interface RatingProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  max?: number
  size?: RatingSize
  readOnly?: boolean
  disabled?: boolean
  allowHalf?: boolean
  showValue?: boolean
  label?: string
  icon?: React.ReactNode
  emptyIcon?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}
