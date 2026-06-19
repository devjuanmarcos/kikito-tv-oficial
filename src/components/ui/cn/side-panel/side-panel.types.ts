import type React from 'react'

export interface SidePanelProps {
  panel: React.ReactNode
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  side?: 'left' | 'right'
  panelWidth?: number
  collapsedWidth?: number
  className?: string
  style?: React.CSSProperties
}
