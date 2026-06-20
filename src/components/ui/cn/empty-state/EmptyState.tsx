import React from 'react'
import { cn } from '@/lib/utils'
import type { EmptyStateProps } from './empty-state.types'

const SIZE_CLS: Record<string, { pad: string; gap: string; icon: string; title: string; desc: string }> = {
  sm: { pad: 'p-6',        gap: 'gap-2', icon: 'w-8 h-8',   title: 'text-body-callout',   desc: 'text-body-caption' },
  md: { pad: 'p-12',       gap: 'gap-3', icon: 'w-12 h-12', title: 'text-body-paragraph', desc: 'text-body-callout' },
  lg: { pad: 'p-[4.5rem]', gap: 'gap-4', icon: 'w-16 h-16', title: 'text-body-title',     desc: 'text-body-paragraph' },
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
  style,
}: EmptyStateProps) {
  const s = SIZE_CLS[size]
  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center', s.pad, s.gap, className)}
      style={style}
    >
      {icon && (
        <div className={cn('flex items-center justify-center text-muted opacity-50 [&>svg]:w-full [&>svg]:h-full', s.icon)}>
          {icon}
        </div>
      )}
      <p className={cn('font-semibold text-foreground m-0', s.title)}>{title}</p>
      {description && (
        <p className={cn('text-muted m-0 max-w-[36ch] leading-normal', s.desc)}>{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
