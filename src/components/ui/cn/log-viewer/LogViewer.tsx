'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { LogEntry, LogViewerProps } from './log-viewer.types'

const LEVEL_STYLES: Record<string, string> = {
  debug:   'bg-graphite text-faint',
  info:    'bg-info/15 text-info',
  warn:    'bg-warning/15 text-warning',
  error:   'bg-danger/15 text-danger',
  success: 'bg-success/15 text-success',
}

const ROW_STYLES: Record<string, string> = {
  debug:   '',
  info:    '',
  warn:    'bg-warning/5',
  error:   'bg-danger/5',
  success: 'bg-success/5',
}

function formatTs(ts: Date | string | undefined): string {
  if (!ts) return ''
  const d = ts instanceof Date ? ts : new Date(ts)
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function LogViewer({
  entries,
  maxHeight = 360,
  searchable = true,
  showTimestamps = true,
  showLevelBadge = true,
  autoScroll = true,
  emptyMessage = 'No log entries.',
  className,
  style,
}: LogViewerProps) {
  const [query, setQuery] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (!query) return entries
    const q = query.toLowerCase()
    return entries.filter(e => e.message.toLowerCase().includes(q) || e.level.includes(q))
  }, [entries, query])

  useEffect(() => {
    if (autoScroll) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries, autoScroll])

  return (
    <div
      className={cn('rounded-[--radius-md] border border-rule bg-canvas font-mono text-body-callout overflow-hidden', className)}
      style={{ maxHeight, ...style }}
    >
      {searchable && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-rule bg-raised">
          <span className="text-faint">🔍</span>
          <input
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-faint"
            placeholder="Filter logs…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="text-body-caption text-faint">
            {filtered.length} / {entries.length}
          </span>
        </div>
      )}

      <div
        className="overflow-y-auto divide-y divide-rule/50"
        style={{ maxHeight: searchable ? `calc(${typeof maxHeight === 'number' ? maxHeight + 'px' : maxHeight} - 44px)` : maxHeight }}
      >
        {filtered.length === 0 ? (
          <div className="px-4 py-6 text-center text-faint">{emptyMessage}</div>
        ) : (
          filtered.map((entry: LogEntry, i: number) => (
            <div
              key={entry.id ?? i}
              className={cn('flex items-start gap-2 px-3 py-1.5', ROW_STYLES[entry.level])}
            >
              {showLevelBadge && (
                <span className={cn('shrink-0 text-[0.5625rem] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide', LEVEL_STYLES[entry.level])}>
                  {entry.level}
                </span>
              )}
              {showTimestamps && entry.timestamp && (
                <span className="shrink-0 text-faint text-body-caption tabular-nums mt-px">
                  {formatTs(entry.timestamp)}
                </span>
              )}
              <span className="text-foreground break-all">{entry.message}</span>
              {entry.meta && (
                <span className="text-faint text-body-caption ml-auto shrink-0">{entry.meta}</span>
              )}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  )
}
