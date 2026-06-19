import type React from 'react'

export interface AutocompleteOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface AutocompleteProps {
  options: AutocompleteOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onInputChange?: (input: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  maxResults?: number
  emptyMessage?: string
  className?: string
  style?: React.CSSProperties
}
