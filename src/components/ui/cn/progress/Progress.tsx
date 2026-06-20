import type React from 'react'
import { cn } from '@/lib/utils'

export type ProgressIntent = 'primary' | 'info' | 'success' | 'warning' | 'danger'
export type ProgressSize   = 'xs' | 'sm' | 'md' | 'lg'

export interface ProgressProps {
  value?:     number
  max?:       number
  intent?:    ProgressIntent
  size?:      ProgressSize
  label?:     string
  showValue?: boolean
  animated?:  boolean
  className?: string
  style?:     React.CSSProperties
}

const SIZE_H: Record<ProgressSize, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}
const INTENT_FILL: Record<ProgressIntent, string> = {
  primary: 'bg-patina',
  info:    'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
}

export function Progress({
  value,
  max      = 100,
  intent   = 'primary',
  size     = 'md',
  label,
  showValue = false,
  animated  = false,
  className,
  style,
}: ProgressProps) {
  const indeterminate = value === undefined
  const pct = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('flex flex-col gap-1', className)} style={style}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2">
          {label     && <span className="text-body-callout font-medium text-foreground">{label}</span>}
          {showValue && !indeterminate && (
            <span className="text-body-callout text-faint tabular-nums shrink-0">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className={cn('relative w-full rounded-full bg-graphite-2 overflow-hidden', SIZE_H[size])}
      >
        {indeterminate ? (
          <div className={cn('absolute h-full w-2/5 rounded-full animate-[ks-progress-slide_1.4s_ease-in-out_infinite]', INTENT_FILL[intent])} />
        ) : (
          <div
            className={cn(
              'h-full rounded-full transition-[width] duration-[300ms] ease-out',
              INTENT_FILL[intent],
              animated && 'bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.18)_8px,rgba(255,255,255,0.18)_16px)] bg-[length:28px_100%] animate-[ks-progress-stripe_0.7s_linear_infinite]',
            )}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
      <style>{`
        @keyframes ks-progress-slide {
          0%   { left: -40%; }
          100% { left: 100%; }
        }
        @keyframes ks-progress-stripe {
          from { background-position: 0 0; }
          to   { background-position: 28px 0; }
        }
      `}</style>
    </div>
  )
}
