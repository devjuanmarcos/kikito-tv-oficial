'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import type { EventCalendarProps, CalendarEvent } from './event-calendar.types'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}

const intentMap: Record<string, string> = {
  primary:     'bg-patina-soft text-patina',
  secondary:   'bg-kinpaku-soft text-kinpaku',
  info:        'bg-info-soft text-info',
  success:     'bg-success-soft text-success',
  warning:     'bg-warning-soft text-warning',
  danger:      'bg-danger-soft text-danger',
  tertiary:    'bg-violet-soft text-violet',
  quaternary:  'bg-rose-soft text-rose',
}

export function EventCalendar({
  events = [],
  defaultMonth,
  onEventClick,
  onDayClick,
  className,
  style,
}: EventCalendarProps) {
  const initial = defaultMonth ? new Date(defaultMonth + '-01') : new Date()
  const [year, setYear] = useState(initial.getFullYear())
  const [month, setMonth] = useState(initial.getMonth())

  const today = new Date()
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const cells: { day: number; outside: boolean; str: string }[] = []
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i
    const prevM = month === 0 ? 11 : month - 1
    const prevY = month === 0 ? year - 1 : year
    cells.push({ day: d, outside: true, str: toDateStr(prevY, prevM, d) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, outside: false, str: toDateStr(year, month, d) })
  }
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    const nextM = month === 11 ? 0 : month + 1
    const nextY = month === 11 ? year + 1 : year
    cells.push({ day: d, outside: true, str: toDateStr(nextY, nextM, d) })
  }

  const eventsOnDay = (str: string): CalendarEvent[] =>
    events.filter(e => e.date === str)

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  return (
    <div className={cn('bg-raised border border-rule rounded-[--radius-lg] overflow-hidden text-[0.8125rem] text-foreground', className)} style={style}>
      <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-rule bg-sunken">
        <button
          className="w-[30px] h-[30px] bg-transparent border border-rule rounded-[--radius-sm] cursor-pointer text-muted flex items-center justify-center text-[0.875rem] transition-colors duration-[120ms] hover:bg-float hover:text-foreground"
          onClick={prev}
        >
          ‹
        </button>
        <span className="text-[0.9375rem] font-bold text-foreground">{MONTHS[month]} {year}</span>
        <button
          className="w-[30px] h-[30px] bg-transparent border border-rule rounded-[--radius-sm] cursor-pointer text-muted flex items-center justify-center text-[0.875rem] transition-colors duration-[120ms] hover:bg-float hover:text-foreground"
          onClick={next}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-rule">
        {WEEKDAYS.map(d => (
          <div key={d} className="py-2 text-center text-[0.625rem] font-bold uppercase tracking-[0.06em] text-faint">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const dayEvents = eventsOnDay(cell.str)
          const isToday = cell.str === todayStr
          return (
            <div
              key={i}
              className={cn(
                'min-h-[80px] p-[6px_8px] border-r border-b border-rule cursor-pointer transition-colors duration-100 align-top',
                '[&:nth-child(7n)]:border-r-0',
                'hover:bg-float',
                isToday && 'bg-patina-soft',
                cell.outside && 'opacity-30',
              )}
              onClick={() => onDayClick?.(cell.str)}
            >
              <div className={cn('text-[0.75rem] font-semibold text-muted mb-1', isToday && 'text-patina')}>
                {cell.day}
              </div>
              <div className="flex flex-col gap-[2px]">
                {dayEvents.slice(0, 3).map(ev => (
                  <div
                    key={ev.id}
                    className={cn(
                      'px-[6px] py-[2px] rounded text-[0.625rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer transition-opacity duration-[120ms] hover:opacity-80',
                      intentMap[ev.intent ?? 'primary'] ?? intentMap.primary,
                    )}
                    onClick={e => { e.stopPropagation(); onEventClick?.(ev) }}
                  >
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="px-[6px] py-[2px] rounded text-[0.625rem] font-semibold bg-patina-soft text-patina opacity-60">
                    +{dayEvents.length - 3}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
