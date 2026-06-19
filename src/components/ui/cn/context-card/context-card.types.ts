import type React from 'react'

export interface ContextCardProps {
  trigger: React.ReactNode
  children: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  width?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
}
