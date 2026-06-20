'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export type RibbonIntent   = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'
export type RibbonPosition = 'top-right' | 'top-left'

export interface RibbonProps {
  children:   React.ReactNode
  label:      string
  position?:  RibbonPosition
  intent?:    RibbonIntent
  className?: string
  style?:     React.CSSProperties
}

const INTENT_CLS: Record<RibbonIntent, string> = {
  primary:   'bg-patina text-patina-fg',
  secondary: 'bg-kinpaku text-kinpaku-fg',
  success:   'bg-success text-success-fg',
  warning:   'bg-warning text-warning-fg',
  danger:    'bg-danger text-danger-fg',
  neutral:   'bg-raised text-foreground border border-rule',
}

export function Ribbon({
  children,
  label,
  position = 'top-right',
  intent   = 'primary',
  className,
  style,
}: RibbonProps) {
  const isRight = position === 'top-right'
  return (
    <div style={style} className={cn('relative overflow-hidden inline-block', className)}>
      {children}
      <span
        aria-label={label}
        className={cn(
          'absolute top-[14px] text-[0.6rem] font-bold tracking-wider uppercase select-none pointer-events-none',
          'w-[90px] text-center py-[3px]',
          isRight
            ? 'right-[-22px] rotate-45 origin-top-right'
            : 'left-[-22px] -rotate-45 origin-top-left',
          INTENT_CLS[intent],
        )}
      >
        {label}
      </span>
    </div>
  )
}
