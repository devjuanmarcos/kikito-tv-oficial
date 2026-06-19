import type React from 'react'

export interface GlassCardProps {
  children?: React.ReactNode
  blur?: number
  opacity?: number
  border?: boolean
  className?: string
  style?: React.CSSProperties
}
