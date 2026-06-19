import type React from 'react'

export interface CommandBarAction {
  id: string
  label: string
  shortcut?: string[]
  icon?: React.ReactNode
  onSelect?: () => void
  group?: string
}

export interface CommandBarProps {
  actions: CommandBarAction[]
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}
