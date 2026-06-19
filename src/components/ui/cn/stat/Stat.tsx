import { cn } from '@/lib/utils'
import type { StatProps, StatTrend } from './stat.types'

const TrendUp   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
const TrendDown = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
const TrendFlat = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><line x1="5" y1="12" x2="19" y2="12"/></svg>

const TREND_ICONS: Record<StatTrend, React.ReactNode> = {
  up:      <TrendUp />,
  down:    <TrendDown />,
  neutral: <TrendFlat />,
}

const TREND_CLS: Record<StatTrend, string> = {
  up:      'bg-success/10 text-success',
  down:    'bg-danger/10 text-danger',
  neutral: 'bg-graphite text-muted',
}

const ACCENT_CLS: Record<string, string> = {
  primary: 'text-patina bg-patina/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  danger:  'text-danger bg-danger/10',
  default: 'text-patina bg-patina/10',
}

export function Stat({
  label,
  value,
  description,
  trend,
  trendValue,
  icon,
  intent = 'default',
  loading = false,
  className,
  style,
}: StatProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 px-6 py-5 rounded-[--radius-md] border border-rule bg-raised min-w-[180px]',
        className
      )}
      style={style}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[0.8125rem] font-medium text-muted tracking-[0.01em] leading-snug">{label}</span>
        {icon && (
          <span className={cn('w-9 h-9 rounded-[--radius-sm] flex items-center justify-center shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]', ACCENT_CLS[intent] ?? ACCENT_CLS.default)}>
            {icon}
          </span>
        )}
      </div>

      {loading ? (
        <div className="h-8 w-20 bg-graphite rounded animate-pulse" />
      ) : (
        <div className="text-[2.25rem] font-bold text-foreground leading-none tabular-nums tracking-tight">
          {value}
        </div>
      )}

      {(trend || description) && (
        <div className="flex items-center gap-2 flex-wrap">
          {loading ? (
            <div className="h-5 w-16 bg-graphite rounded-full animate-pulse" />
          ) : trend && (
            <span className={cn('inline-flex items-center gap-[3px] text-[0.75rem] font-semibold py-0.5 px-2 rounded-full', TREND_CLS[trend])}>
              {TREND_ICONS[trend]}
              {trendValue}
            </span>
          )}
          {!loading && description && (
            <span className="text-[0.75rem] text-faint leading-snug">{description}</span>
          )}
        </div>
      )}
    </div>
  )
}
