import type React from 'react'

export type RichTooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface RichTooltipProps {
  title?: React.ReactNode
  content: React.ReactNode
  icon?: React.ReactNode
  action?: { label: string; onClick: () => void }
  placement?: RichTooltipPlacement
  maxWidth?: number
  children: React.ReactElement
  className?: string
}
