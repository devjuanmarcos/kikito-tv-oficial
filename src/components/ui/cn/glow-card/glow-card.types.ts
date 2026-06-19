import type { ReactNode } from 'react'

export interface GlowCardProps {
  children: ReactNode
  glowColor?: string
  glowSize?: number
  glowOpacity?: number
  radius?: number
  padding?: number | string
  className?: string
  style?: React.CSSProperties
}
