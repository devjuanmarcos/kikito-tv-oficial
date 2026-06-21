import { cn } from '@/lib/utils'
import type { GaugeProps } from './gauge.types'

const INTENT_COLOR: Record<string, string> = {
  default: 'var(--ks-text-muted)',
  primary: 'var(--ks-primary)',
  success: 'var(--ks-success)',
  warning: 'var(--ks-warning)',
  danger:  'var(--ks-danger)',
}

const SIZE_VARS: Record<string, { sz: string; fsz: string }> = {
  sm: { sz: '64px',  fsz: '12px' },
  md: { sz: '96px',  fsz: '16px' },
  lg: { sz: '128px', fsz: '20px' },
}

export function Gauge({
  value,
  max         = 100,
  size        = 'md',
  intent      = 'primary',
  label,
  showValue   = true,
  strokeWidth,
  className,
  style,
}: GaugeProps) {
  const pct           = Math.max(0, Math.min(value / max, 1))
  const radius        = 44
  const circumference = 2 * Math.PI * radius
  const sw            = strokeWidth ?? (size === 'sm' ? 6 : size === 'lg' ? 10 : 8)
  const offset        = circumference * (1 - pct)
  const displayValue  = Number.isInteger(value) ? value : value.toFixed(1)
  const displayMax    = Number.isInteger(max) ? max : max.toFixed(1)
  const c             = INTENT_COLOR[intent] ?? INTENT_COLOR.primary
  const sz            = SIZE_VARS[size] ?? SIZE_VARS.md

  return (
    <div className={cn('inline-flex flex-col items-center gap-[6px]', className)} style={style}>
      <div className="relative inline-flex items-center justify-center" style={{ width: sz.sz, height: sz.sz }}>
        <svg className="-rotate-90" viewBox="0 0 100 100" style={{ width: sz.sz, height: sz.sz }}>
          <circle
            cx="50" cy="50" r={radius} strokeWidth={sw}
            style={{ fill: 'none', stroke: `color-mix(in srgb, ${c} 15%, transparent)` }}
          />
          <circle
            cx="50" cy="50" r={radius} strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ fill: 'none', stroke: c, transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        {showValue && (
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-bold text-foreground leading-none" style={{ fontSize: sz.fsz }}>{displayValue}</span>
            {max !== 100 && <span style={{ fontSize: 10, opacity: 0.4 }}>/{displayMax}</span>}
          </div>
        )}
      </div>
      {label && <span className="text-body-caption text-muted">{label}</span>}
    </div>
  )
}
