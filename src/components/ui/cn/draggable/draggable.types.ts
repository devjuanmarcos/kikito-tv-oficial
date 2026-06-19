import type React from 'react'

export interface DraggableItem {
  id: string
  content: React.ReactNode
}

export interface DraggableProps {
  items: DraggableItem[]
  onChange?: (items: DraggableItem[]) => void
  direction?: 'vertical' | 'horizontal'
  handle?: boolean
  className?: string
  style?: React.CSSProperties
}
