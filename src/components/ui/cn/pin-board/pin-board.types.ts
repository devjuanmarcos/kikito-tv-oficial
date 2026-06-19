import type React from 'react'

export interface PinNote {
  id: string | number
  content: string
  color?: string
  x?: number
  y?: number
  rotate?: number
}

export interface PinBoardProps {
  notes?: PinNote[]
  defaultNotes?: PinNote[]
  onChange?: (notes: PinNote[]) => void
  width?: number | string
  height?: number | string
  className?: string
  style?: React.CSSProperties
}
