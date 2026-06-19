import type React from 'react'

export type GradientBorderVariant = 'spin' | 'pulse' | 'static'

export interface GradientBorderProps {
  children: React.ReactNode
  colors?: string[]
  borderWidth?: number
  borderRadius?: number
  speed?: number
  variant?: GradientBorderVariant
  className?: string
  style?: React.CSSProperties
}
