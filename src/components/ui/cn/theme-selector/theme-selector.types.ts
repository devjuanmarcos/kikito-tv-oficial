import type React from 'react'

export interface ThemeOption {
  id: string
  label: string
  colors: string[]
}

export interface ThemeSelectorProps {
  themes: ThemeOption[]
  value?: string
  defaultValue?: string
  onChange?: (id: string) => void
  className?: string
  style?: React.CSSProperties
}
