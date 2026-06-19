import type React from 'react'

export interface MiniMapSection {
  id: string
  label: string
}

export interface MiniMapProps {
  sections: MiniMapSection[]
  activeId?: string
  onNavigate?: (id: string) => void
  position?: 'left' | 'right'
  className?: string
  style?: React.CSSProperties
}
