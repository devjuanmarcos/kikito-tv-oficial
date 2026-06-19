import type React from 'react'

export type MultiSelectSize = 'sm' | 'md' | 'lg'

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  size?: MultiSelectSize
  disabled?: boolean
  maxSelected?: number
  searchable?: boolean
  clearable?: boolean
  className?: string
  style?: React.CSSProperties
}
