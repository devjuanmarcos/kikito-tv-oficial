import type React from 'react'

export interface ColorPickerProps {
  value?: string
  defaultValue?: string
  onChange?: (color: string) => void
  swatches?: string[]
  showInput?: boolean
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}
