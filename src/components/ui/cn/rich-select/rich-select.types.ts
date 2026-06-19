import type React from 'react'

export interface RichSelectOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
  badge?: string
  disabled?: boolean
  group?: string
}

export interface RichSelectProps {
  options: RichSelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  searchable?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
}
