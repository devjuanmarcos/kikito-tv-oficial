'use client'

import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { cn } from '@/lib/utils'
import type { CountdownTimerProps } from './countdown-timer.types'

function getRemaining(targetDate?: Date | string, seconds?: number) {
  let ms: number
  if (targetDate) {
    ms = new Date(targetDate).getTime() - Date.now()
  } else if (seconds !== undefined) {
    ms = seconds * 1000
  } else {
    ms = 0
  }
  ms = Math.max(0, ms)
  const total = Math.floor(ms / 1000)
  return {
    days:  Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    secs:  total % 60,
    done:  ms <= 0,
  }
}

function pad(n: number) { return String(n).padStart(2, '0') }

export function CountdownTimer({
  targetDate,
  seconds,
  showDays = true,
  showLabels = true,
  separator = ':',
  onComplete,
  className,
  style,
}: CountdownTimerProps) {
  const [time, setTime] = useState(() => getRemaining(targetDate, seconds))
  const startMs = useRef(seconds !== undefined ? Date.now() : null)
  const remainRef = useRef(seconds)
  const calledDone = useRef(false)

  useEffect(() => {
    if (time.done) {
      if (!calledDone.current) { calledDone.current = true; onComplete?.() }
      return
    }
    const id = setInterval(() => {
      if (targetDate) {
        setTime(getRemaining(targetDate))
      } else if (seconds !== undefined && startMs.current !== null) {
        const elapsed = (Date.now() - startMs.current) / 1000
        setTime(getRemaining(undefined, Math.max(0, (remainRef.current ?? 0) - elapsed)))
      }
    }, 500)
    return () => clearInterval(id)
  }, [time.done, targetDate, seconds, onComplete])

  const parts = [
    { value: time.days,    label: 'Days',    show: showDays },
    { value: time.hours,   label: 'Hours',   show: true },
    { value: time.minutes, label: 'Minutes', show: true },
    { value: time.secs,    label: 'Seconds', show: true },
  ].filter(p => p.show)

  return (
    <div
      className={cn('inline-flex items-center gap-1 tabular-nums', className)}
      style={style}
      data-done={time.done}
      role="timer"
      aria-live="off"
    >
      {parts.map((p, i) => (
        <React.Fragment key={p.label}>
          <div className="flex flex-col items-center min-w-[48px]">
            <span className={cn('text-heading-04 font-extrabold leading-none tabular-nums', time.done ? 'text-danger' : 'text-foreground')}>
              {pad(p.value)}
            </span>
            {showLabels && (
              <span className="text-body-caption font-semibold text-muted uppercase tracking-[0.06em] opacity-50 mt-1">
                {p.label}
              </span>
            )}
          </div>
          {i < parts.length - 1 && (
            <span className="text-heading-04 font-extrabold text-patina self-start pt-0.5 select-none" aria-hidden="true">
              {separator}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
