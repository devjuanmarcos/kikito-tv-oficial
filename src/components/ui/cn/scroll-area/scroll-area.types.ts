import type React from 'react'

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'

export interface ScrollAreaProps {
  children: React.ReactNode
  orientation?: ScrollAreaOrientation
  maxHeight?: number | string
  maxWidth?: number | string
  className?: string
  style?: React.CSSProperties
}
