import type React from 'react'

export type LabelSize = 'sm' | 'md' | 'lg'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  size?: LabelSize
  required?: boolean
  optional?: boolean
  hint?: string
  disabled?: boolean
}
