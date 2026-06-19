import type React from 'react'

export interface SpotlightAction {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  group?: string
  shortcut?: string[]
  onSelect: () => void
}

export interface SpotlightSearchProps {
  actions: SpotlightAction[]
  isOpen: boolean
  onClose: () => void
  placeholder?: string
  maxResults?: number
  className?: string
}
