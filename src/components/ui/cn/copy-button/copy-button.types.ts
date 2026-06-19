import type React from 'react'

export type CopyButtonSize = 'sm' | 'md' | 'lg'
export type CopyButtonVariant = 'outline' | 'ghost' | 'solid'

export interface CopyButtonProps {
  text: string
  label?: string
  successLabel?: string
  size?: CopyButtonSize
  variant?: CopyButtonVariant
  timeout?: number
  onCopy?: () => void
  className?: string
  style?: React.CSSProperties
}
