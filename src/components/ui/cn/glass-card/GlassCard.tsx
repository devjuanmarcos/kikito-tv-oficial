import React from 'react'
import { cn } from '@/lib/utils'
import type { GlassCardProps } from './glass-card.types'

export function GlassCard({
  children,
  blur = 12,
  opacity = 0.1,
  border = true,
  className,
  style,
}: GlassCardProps) {
  return (
    <div
      className={cn('rounded-[--radius-lg] overflow-hidden', className)}
      style={{
        background: `rgba(255,255,255,${opacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: border ? '1px solid rgba(255,255,255,0.2)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
