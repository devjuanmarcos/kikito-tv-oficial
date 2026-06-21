'use client'
import type React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface CalendarEvent {
  id:     string | number
  date:   Date
  title:  string
  color?: string
}

export interface CalendarProps {
  value?:         Date
  defaultValue?:  Date
  onChange?:      (date: Date) => void
  events?:        CalendarEvent[]
  onEventClick?:  (event: CalendarEvent) => void
  className?:     string
  style?:         React.CSSProperties
}

const DAYS   = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function Calendar({
  value,
  defaultValue,
  onChange,
  events       = [],
  onEventClick,
  className,
  style,
}: CalendarProps) {
  const today = new Date()
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<Date | undefined>(defaultValue)
  const selected = isControlled ? value : internal

  const [viewYear, setViewYear]   = useState(() => (defaultValue ?? value ?? today).getFullYear())
  const [viewMonth, setViewMonth] = useState(() => (defaultValue ?? value ?? today).getMonth())

  function select(d: Date) {
    if (!isControlled) setInternal(d)
    onChange?.(d)
    const dayEvents = events.filter(e => sameDay(e.date, d))
    if (dayEvents.length > 0) onEventClick?.(dayEvents[0])
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1)
  while (cells.length % 7 !== 0) cells.push(null)

  const ChevronL = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-4 h-4">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  const ChevronR = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-4 h-4">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <div style={style} className={cn('inline-flex flex-col gap-1 p-4 rounded-2xl border border-rule bg-raised', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg text-faint hover:text-foreground hover:bg-graphite transition-colors">
          <ChevronL />
        </button>
        <span className="text-body-callout font-semibold text-foreground">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg text-faint hover:text-foreground hover:bg-graphite transition-colors">
          <ChevronR />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[0.65rem] font-medium text-faint py-1">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const date = new Date(viewYear, viewMonth, day)
          const isToday    = sameDay(date, today)
          const isSelected = selected ? sameDay(date, selected) : false
          const dayEvents  = events.filter(e => sameDay(e.date, date))

          return (
            <button
              key={i}
              type="button"
              onClick={() => select(date)}
              className={cn(
                'relative flex flex-col items-center justify-center w-8 h-8 rounded-lg mx-auto text-body-callout',
                'transition-[background,color] duration-[80ms]',
                isSelected && 'bg-patina text-patina-fg font-semibold',
                !isSelected && isToday && 'border border-patina text-patina font-semibold',
                !isSelected && !isToday && 'text-foreground hover:bg-graphite',
              )}
            >
              {day}
              {dayEvents.length > 0 && (
                <span
                  className={cn('absolute bottom-0.5 w-1 h-1 rounded-full', isSelected ? 'bg-patina-fg/80' : '')}
                  style={!isSelected ? { background: dayEvents[0].color ?? 'var(--ks-primary)' } : undefined}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
