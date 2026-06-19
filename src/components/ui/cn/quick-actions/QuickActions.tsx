'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { QuickActionsProps } from './quick-actions.types'

const INTENT_CLS: Record<string, string> = {
  primary: 'bg-patina text-patina-fg hover:bg-patina/90',
  success: 'bg-success text-success-fg hover:bg-success/90',
  warning: 'bg-warning text-warning-fg hover:bg-warning/90',
  danger:  'bg-danger text-danger-fg hover:bg-danger/90',
  neutral: 'bg-raised border border-rule text-foreground hover:bg-graphite',
}

const PLACEMENT_CLS: Record<string, string> = {
  top:    'bottom-full mb-2 flex-col-reverse',
  bottom: 'top-full mt-2 flex-col',
  left:   'right-full mr-2 flex-row-reverse',
  right:  'left-full ml-2 flex-row',
}

export function QuickActions({
  actions,
  triggerIcon = '+',
  placement = 'top',
  className,
  style,
}: QuickActionsProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('relative inline-flex', className)} style={style}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label="Quick actions"
        className={cn(
          'w-12 h-12 rounded-full bg-patina text-patina-fg flex items-center justify-center shadow-md text-[1.25rem] transition-transform duration-200 hover:bg-patina/90 z-10',
          open && 'rotate-45'
        )}
      >
        {triggerIcon}
      </button>

      <div
        className={cn(
          'absolute flex items-center gap-2 z-20',
          PLACEMENT_CLS[placement] ?? PLACEMENT_CLS.top,
          !open && 'pointer-events-none'
        )}
      >
        {actions.map((action, i) => (
          <div key={action.id} className="relative group">
            <button
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center shadow-md text-[1rem] transition-all duration-200',
                INTENT_CLS[action.intent ?? 'neutral'],
                open ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              )}
              style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
              onClick={() => { action.onClick?.(); setOpen(false) }}
              title={action.label}
              aria-label={action.label}
            >
              {action.icon}
            </button>
            {/* Tooltip */}
            <span className={cn(
              'absolute text-[0.6875rem] font-medium bg-graphite text-foreground px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity',
              ['top','bottom'].includes(placement) ? 'left-1/2 -translate-x-1/2 -top-7' : 'top-1/2 -translate-y-1/2 left-12'
            )}>
              {action.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
