import type React from 'react'

export type ResizableDirection = 'horizontal' | 'vertical'

export interface ResizableProps {
  children: [React.ReactNode, React.ReactNode]
  direction?: ResizableDirection
  defaultSize?: number
  minSize?: number
  maxSize?: number
  onResize?: (size: number) => void
  className?: string
  style?: React.CSSProperties
}
