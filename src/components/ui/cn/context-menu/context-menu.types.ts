import type React from 'react'

export interface ContextMenuItem {
  label: string
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  onClick?: () => void
}

export interface ContextMenuGroup {
  label?: string
  items: ContextMenuItem[]
}

export interface ContextMenuProps {
  groups: ContextMenuGroup[]
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}
