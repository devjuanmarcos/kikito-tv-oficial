import { cn } from '@/lib/utils'
import type { ProgressRingProps } from './progress-ring.types'

const INTENT_STROKE: Record<string, string> = {
  primary:   'var(--ks-primary)',
  secondary: 'var(--ks-kinpaku)',
  success:   'var(--ks-success)',
  warning:   'var(--ks-warning)',
  danger:    'var(--ks-danger)',
  info:      'var(--ks-info)',
}

export function ProgressRing({
  value,
  max = 100,
  size = 80,
  stroke = 6,
  intent = 'primary',
  label,
  showValue = true,
  className,
  style,
}: ProgressRingProps) {
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const pct = Math.min(Math.max(value / max, 0), 1)
  const dashOffset = circumference * (1 - pct)
  const color = INTENT_STROKE[intent] ?? 'var(--ks-primary)'

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size, ...style }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="color-mix(in srgb, currentColor 12%, transparent)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className="font-bold tabular-nums leading-none" style={{ fontSize: size * 0.2, color }}>
            {Math.round(pct * 100)}%
          </span>
        )}
        {label && (
          <span className="text-faint leading-none mt-0.5" style={{ fontSize: size * 0.13 }}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
