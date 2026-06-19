import React from 'react'
import { cn } from '@/lib/utils'
import type { ActivityFeedProps } from './activity-feed.types'

const INTENT_COLOR: Record<string, string> = {
  primary:   'var(--ks-patina)',
  secondary: 'var(--ks-kinpaku)',
  success:   'var(--ks-success)',
  warning:   'var(--ks-warning)',
  danger:    'var(--ks-danger)',
  info:      'var(--ks-info)',
  neutral:   'var(--ks-text-muted)',
}

const DefaultIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4"/>
  </svg>
)

export function ActivityFeed({ items, compact = false, className, style }: ActivityFeedProps) {
  const pad    = compact ? 'py-2 gap-[10px]' : 'py-3 gap-3'
  const sz     = compact ? 'w-6 h-6' : 'w-[30px] h-[30px]'
  const svgSz  = compact ? '[&>svg]:w-3 [&>svg]:h-3' : '[&>svg]:w-[14px] [&>svg]:h-[14px]'
  const stemL  = compact ? 'left-3' : 'left-[15px]'
  const stemT  = compact ? 'top-9' : 'top-11'

  return (
    <div className={cn('w-full', className)} style={style}>
      <div className="flex flex-col">
        {items.map((item, idx) => {
          const intent = item.intent ?? 'primary'
          const color  = INTENT_COLOR[intent] ?? 'var(--ks-patina)'
          const isLast = idx === items.length - 1

          return (
            <div key={item.id} className={cn('flex relative', pad)}>
              {!isLast && (
                <div
                  className={cn('absolute bottom-0 w-px bg-rule', stemL, stemT)}
                />
              )}
              {item.avatar ? (
                <div
                  className={cn('rounded-full shrink-0 z-[1]', sz)}
                  style={{ backgroundImage: `url(${item.avatar})`, backgroundSize: 'cover' }}
                />
              ) : item.avatarFallback ? (
                <div className={cn('rounded-full shrink-0 z-[1] flex items-center justify-center bg-patina text-patina-fg text-[0.75rem] font-bold', sz)}>
                  {item.avatarFallback[0].toUpperCase()}
                </div>
              ) : (
                <div
                  className={cn('rounded-full shrink-0 z-[1] flex items-center justify-center border', sz, svgSz)}
                  style={{ background: `color-mix(in srgb,${color} 15%,var(--ks-lacquer-raised))`, borderColor: `color-mix(in srgb,${color} 30%,transparent)`, color }}
                >
                  {item.icon ?? <DefaultIcon />}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-[0.8125rem] text-foreground leading-normal">{item.title}</p>
                {item.description && (
                  <p className="text-[0.75rem] text-muted opacity-70 mt-[2px] leading-snug">{item.description}</p>
                )}
              </div>

              <span className="text-[0.6875rem] text-muted opacity-45 whitespace-nowrap mt-[2px] shrink-0">
                {item.time}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
