import type React from 'react'

export type TextGradientAs = 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p'

export interface TextGradientProps {
  children: React.ReactNode
  from?: string
  to?: string
  via?: string
  direction?: string
  animate?: boolean
  as?: TextGradientAs
  className?: string
  style?: React.CSSProperties
}
