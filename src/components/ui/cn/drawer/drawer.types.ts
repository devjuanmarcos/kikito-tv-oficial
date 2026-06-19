import type React from 'react'

export type DrawerSide = 'right' | 'left' | 'bottom' | 'top'
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  side?: DrawerSide
  size?: DrawerSize
  title?: string
  description?: string
  hideClose?: boolean
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  footer?: React.ReactNode
  footerAlign?: 'left' | 'right' | 'center' | 'between'
  className?: string
  children?: React.ReactNode
}
