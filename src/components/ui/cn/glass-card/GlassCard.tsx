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
        background: `color-mix(in srgb, var(--ks-lacquer-raised) ${Math.round(opacity * 100)}%, transparent)`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: border ? '1px solid color-mix(in srgb, var(--ks-lacquer-raised) 20%, transparent)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
