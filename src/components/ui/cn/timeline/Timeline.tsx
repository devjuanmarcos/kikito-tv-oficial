import React from 'react'
import { cn } from '@/lib/utils'
import type { TimelineProps, TimelineItem, TimelineStatus } from './timeline.types'

const CheckIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const ActiveIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>
const PendingIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/></svg>
const ErrorIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const WarnIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>

const DEFAULT_ICONS: Record<TimelineStatus, React.ReactNode> = {
  complete: <CheckIcon />,
  active:   <ActiveIcon />,
  pending:  <PendingIcon />,
  error:    <ErrorIcon />,
  warning:  <WarnIcon />,
}

const NODE_STATUS_CLS: Record<TimelineStatus, string> = {
  complete: 'bg-success-soft text-success border-[1.5px] border-success',
  active:   'bg-patina-soft text-patina border-2 border-patina shadow-[0_0_0_4px_var(--ks-primary-soft)]',
  pending:  'bg-graphite text-faint border-[1.5px] border-dashed border-rule',
  error:    'bg-danger-soft text-danger border-[1.5px] border-danger',
  warning:  'bg-warning-soft text-warning border-[1.5px] border-warning',
}

const LINE_STATUS_CLS: Record<TimelineStatus, string> = {
  complete: 'bg-success opacity-40',
  active:   'bg-rule',
  pending:  'bg-rule',
  error:    'bg-danger opacity-30',
  warning:  'bg-rule',
}

const TITLE_STATUS_CLS: Record<TimelineStatus, string> = {
  complete: 'text-foreground',
  active:   'text-foreground',
  pending:  'text-muted',
  error:    'text-foreground',
  warning:  'text-foreground',
}

export function Timeline({
  items,
  variant  = 'default',
  lastLine = false,
  className,
  style,
}: TimelineProps) {
  const isCompact = variant === 'compact'
  const isReverse = variant === 'reverse'

  const nodeSz = isCompact ? 'w-6 h-6 [&>svg]:w-3 [&>svg]:h-3' : 'w-8 h-8 [&>svg]:w-4 [&>svg]:h-4'
  const stemW  = isCompact ? 'w-6' : 'w-8'

  return (
    <ol className={cn('list-none p-0 m-0 flex flex-col', className)} style={style}>
      {items.map((item, i) => {
        const status: TimelineStatus = item.status ?? 'pending'
        const isLast = i === items.length - 1

        return (
          <li key={item.id ?? i} className="grid gap-x-4" style={{ gridTemplateColumns: 'auto 1fr' }}>
            <div className={cn('flex flex-col items-center shrink-0', stemW)}>
              <span className={cn('rounded-full flex items-center justify-center shrink-0 text-body-callout relative z-[1] transition-[background] duration-[160ms]', nodeSz, NODE_STATUS_CLS[status])}>
                {item.icon ?? DEFAULT_ICONS[status]}
              </span>
              {(!isLast || lastLine) && (
                <div className={cn('flex-1 w-[2px] my-1 min-h-4 transition-[background] duration-[160ms]', LINE_STATUS_CLS[status])} />
              )}
            </div>

            <div className={cn('min-w-0', isLast ? 'pb-0' : isCompact ? 'pb-[0.875rem]' : 'pb-6')}>
              <div className={cn('flex items-start justify-between gap-3 min-h-8 pt-1', isReverse && 'flex-row-reverse')}>
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className={cn('font-semibold leading-snug', isCompact ? 'text-body-callout' : 'text-body-paragraph', TITLE_STATUS_CLS[status])}>
                    {item.title}
                  </span>
                  {item.badge && <span className="shrink-0">{item.badge}</span>}
                </div>
                {item.timestamp && (
                  <time className="text-body-caption text-faint whitespace-nowrap shrink-0 pt-[3px] tabular-nums">
                    {item.timestamp}
                  </time>
                )}
              </div>
              {item.description && (
                <div className={cn('text-muted leading-relaxed mt-1 text-body-callout')}>
                  {item.description}
                </div>
              )}
              {item.actions && (
                <div className="flex gap-2 flex-wrap mt-[0.625rem]">{item.actions}</div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
