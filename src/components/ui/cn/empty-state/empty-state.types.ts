import type React from 'react'

export type EmptyStateSize = 'sm' | 'md' | 'lg'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  size?: EmptyStateSize
  className?: string
  style?: React.CSSProperties
}
