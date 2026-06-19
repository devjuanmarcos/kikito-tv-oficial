import type React from 'react'

export interface ShortcutKeyProps {
  keys: string[]
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled'
  className?: string
  style?: React.CSSProperties
}
