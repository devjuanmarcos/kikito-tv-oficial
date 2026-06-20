import type React from 'react'
import { cn } from '@/lib/utils'

export type SeparatorOrientation = 'horizontal' | 'vertical'
export type SeparatorVariant     = 'solid' | 'dashed' | 'dotted'
export type SeparatorSpacing     = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SeparatorLabelAlign  = 'start' | 'center' | 'end'

export interface SeparatorProps {
  orientation?: SeparatorOrientation
  variant?:     SeparatorVariant
  label?:       React.ReactNode
  labelAlign?:  SeparatorLabelAlign
  spacing?:     SeparatorSpacing
  decorative?:  boolean
  className?:   string
  style?:       React.CSSProperties
}

const SPACING_H: Record<SeparatorSpacing, string> = {
  xs: 'my-1', sm: 'my-2', md: 'my-4', lg: 'my-6', xl: 'my-8',
}
const SPACING_V: Record<SeparatorSpacing, string> = {
  xs: 'mx-1', sm: 'mx-2', md: 'mx-4', lg: 'mx-6', xl: 'mx-8',
}
const BORDER_STYLE: Record<SeparatorVariant, string> = {
  solid:  'border-rule',
  dashed: 'border-rule border-dashed',
  dotted: 'border-rule border-dotted',
}

export function Separator({
  orientation = 'horizontal',
  variant     = 'solid',
  label,
  labelAlign  = 'center',
  spacing,
  decorative  = true,
  className,
  style,
}: SeparatorProps) {
  const role = decorative ? 'none' : 'separator'

  if (orientation === 'vertical') {
    return (
      <span
        role={role}
        aria-orientation="vertical"
        className={cn(
          'inline-block self-stretch border-l',
          BORDER_STYLE[variant],
          spacing && SPACING_V[spacing],
          className,
        )}
        style={style}
      />
    )
  }

  if (label) {
    const alignCls = labelAlign === 'start' ? 'justify-start' : labelAlign === 'end' ? 'justify-end' : 'justify-center'
    return (
      <div
        role={role}
        className={cn('flex items-center gap-3', spacing && SPACING_H[spacing], className)}
        style={style}
      >
        {labelAlign !== 'start' && (
          <span className={cn('flex-1 border-t', BORDER_STYLE[variant])} />
        )}
        <span className="text-body-caption text-faint shrink-0 whitespace-nowrap">{label}</span>
        {labelAlign !== 'end' && (
          <span className={cn('flex-1 border-t', BORDER_STYLE[variant])} />
        )}
      </div>
    )
  }

  return (
    <hr
      role={role}
      className={cn(
        'border-t border-0',
        BORDER_STYLE[variant],
        spacing && SPACING_H[spacing],
        className,
      )}
      style={style}
    />
  )
}
