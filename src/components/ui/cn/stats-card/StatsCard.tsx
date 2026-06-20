'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export type StatTrend = 'up' | 'down' | 'neutral'

export interface StatItem {
  label:   string
  value:   string | number
  change?: string
  trend?:  StatTrend
  icon?:   React.ReactNode
}

export interface StatsCardProps {
  stats:      StatItem[]
  cols?:      2 | 3 | 4
  className?: string
  style?:     React.CSSProperties
}

const TREND_CLS: Record<StatTrend, string> = {
  up:      'text-success',
  down:    'text-danger',
  neutral: 'text-faint',
}
const TREND_ARROW: Record<StatTrend, string> = {
  up: '↑', down: '↓', neutral: '·',
}

const COLS_CLS: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

export function StatsCard({
  stats,
  cols = 3,
  className,
  style,
}: StatsCardProps) {
  return (
    <div
      style={style}
      className={cn(
        'grid divide-x divide-rule border border-rule rounded-xl overflow-hidden bg-raised',
        COLS_CLS[cols],
        className,
      )}
    >
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col gap-1.5 px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-body-caption text-faint">{stat.label}</span>
            {stat.icon && <span className="text-lg leading-none">{stat.icon}</span>}
          </div>
          <span className="text-xl font-bold text-foreground">{stat.value}</span>
          {stat.change && (
            <span className={cn('text-body-caption font-medium', stat.trend ? TREND_CLS[stat.trend] : 'text-faint')}>
              {stat.trend && stat.trend !== 'neutral' ? TREND_ARROW[stat.trend] + ' ' : ''}
              {stat.change}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
