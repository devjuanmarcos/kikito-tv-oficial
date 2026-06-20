'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export type MetricIntent = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export type MetricTrend  = 'up' | 'down' | 'flat'

export interface MetricCardProps {
  label:        string
  value:        string | number
  unit?:        string
  trend?:       MetricTrend
  trendValue?:  string
  trendLabel?:  string
  sparkline?:   number[]
  intent?:      MetricIntent
  loading?:     boolean
  description?: string
  className?:   string
  style?:       React.CSSProperties
}

const INTENT_SPARK: Record<MetricIntent, string> = {
  primary: 'stroke-patina',
  success: 'stroke-success',
  warning: 'stroke-warning',
  danger:  'stroke-danger',
  info:    'stroke-info',
  neutral: 'stroke-foreground/40',
}

const TREND_CLS: Record<MetricTrend, string> = {
  up:   'text-success',
  down: 'text-danger',
  flat: 'text-faint',
}
const TREND_ARROW: Record<MetricTrend, string> = {
  up: '↑', down: '↓', flat: '→',
}

function Sparkline({ data, intent }: { data: number[]; intent: MetricIntent }) {
  const min  = Math.min(...data)
  const max  = Math.max(...data) - min || 1
  const w    = 80
  const h    = 28
  const pts  = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / max) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={INTENT_SPARK[intent]}
      />
    </svg>
  )
}

export function MetricCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  trendLabel  = 'vs last period',
  sparkline,
  intent      = 'primary',
  loading     = false,
  description,
  className,
  style,
}: MetricCardProps) {
  return (
    <div
      style={style}
      className={cn(
        'flex flex-col gap-3 p-4 rounded-xl border border-rule bg-raised',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-body-caption text-faint">{label}</span>
        {sparkline && sparkline.length > 1 && (
          <Sparkline data={sparkline} intent={intent} />
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-7 w-24 rounded bg-graphite-2 animate-pulse" />
          <div className="h-4 w-16 rounded bg-graphite-2 animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground leading-none">{value}</span>
            {unit && <span className="text-body-caption text-faint">{unit}</span>}
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              <span className={cn('text-body-caption font-medium', TREND_CLS[trend])}>
                {TREND_ARROW[trend]} {trendValue}
              </span>
              <span className="text-body-caption text-faint">{trendLabel}</span>
            </div>
          )}
        </>
      )}

      {description && (
        <p className="text-body-caption text-faint border-t border-rule pt-2">{description}</p>
      )}
    </div>
  )
}
