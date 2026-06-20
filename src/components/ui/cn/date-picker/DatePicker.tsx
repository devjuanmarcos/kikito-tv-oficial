'use client'

import { useState, useRef, useEffect, useId, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

export type DatePickerVariant = 'outline' | 'filled' | 'ghost'

export interface DatePickerProps {
  value?:        Date | null
  defaultValue?: Date | null
  onChange?:     (date: Date | null) => void
  placeholder?:  string
  label?:        string
  helperText?:   string
  errorText?:    string
  state?:        'default' | 'error'
  disabled?:     boolean
  clearable?:    boolean
  showTime?:     boolean
  minDate?:      Date
  maxDate?:      Date
  formatDate?:   (d: Date) => string
  locale?:       string
  className?:    string
}

const ChevronL = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><polyline points="15 18 9 12 15 6"/></svg>
const ChevronR = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><polyline points="9 18 15 12 9 6"/></svg>
const CalIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const XIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={12} height={12}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December']

function daysInMonth(y: number, m: number)   { return new Date(y, m + 1, 0).getDate() }
function isSameDay(a: Date, b: Date)         { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate() }
function isToday(d: Date)                    { return isSameDay(d, new Date()) }

export function DatePicker({
  value,
  defaultValue  = null,
  onChange,
  placeholder   = 'Select date…',
  label,
  helperText,
  errorText,
  state         = 'default',
  disabled      = false,
  clearable     = true,
  showTime      = false,
  minDate,
  maxDate,
  formatDate,
  locale        = 'en-US',
  className,
}: DatePickerProps) {
  const uid          = useId()
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<Date | null>(defaultValue)
  const selected = isControlled ? value! : internal

  const now      = new Date()
  const [view,     setView]      = useState<'days' | 'months' | 'years'>('days')
  const [viewYear, setViewYear]  = useState(selected?.getFullYear() ?? now.getFullYear())
  const [viewMonth,setViewMonth] = useState(selected?.getMonth()    ?? now.getMonth())
  const [open, setOpen]          = useState(false)
  const [hour,   setHour]        = useState(selected ? String(selected.getHours()).padStart(2,'0') : '00')
  const [minute, setMinute]      = useState(selected ? String(selected.getMinutes()).padStart(2,'0') : '00')

  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  function commit(d: Date | null) {
    if (!isControlled) setInternal(d)
    onChange?.(d)
  }

  function selectDay(day: Date) {
    let d = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Number(hour), Number(minute))
    commit(d)
    if (!showTime) setOpen(false)
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    commit(null)
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function isDisabled(d: Date) {
    if (minDate && d < minDate) return true
    if (maxDate && d > maxDate) return true
    return false
  }

  function buildGrid() {
    const first    = new Date(viewYear, viewMonth, 1).getDay()
    const dayCount = daysInMonth(viewYear, viewMonth)
    const prevCount= daysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1)
    const cells: { date: Date; otherMonth: boolean }[] = []

    for (let i = first - 1; i >= 0; i--) {
      const m = viewMonth === 0 ? 11 : viewMonth - 1
      const y = viewMonth === 0 ? viewYear - 1 : viewYear
      cells.push({ date: new Date(y, m, prevCount - i), otherMonth: true })
    }
    for (let d = 1; d <= dayCount; d++) {
      cells.push({ date: new Date(viewYear, viewMonth, d), otherMonth: false })
    }
    const remaining = 42 - cells.length
    for (let d = 1; d <= remaining; d++) {
      const m = viewMonth === 11 ? 0 : viewMonth + 1
      const y = viewMonth === 11 ? viewYear + 1 : viewYear
      cells.push({ date: new Date(y, m, d), otherMonth: true })
    }
    return cells
  }

  const fmt        = formatDate ?? ((d: Date) => d.toLocaleDateString(locale, { year:'numeric', month:'short', day:'numeric', ...(showTime ? { hour:'2-digit', minute:'2-digit' } : {}) }))
  const displayStr = selected ? fmt(selected) : null
  const grid       = open && view === 'days' ? buildGrid() : []

  function handleGridKey(e: KeyboardEvent<HTMLButtonElement>, date: Date) {
    let target: Date | null = null
    if (e.key === 'ArrowRight') { target = new Date(date); target.setDate(date.getDate() + 1) }
    if (e.key === 'ArrowLeft')  { target = new Date(date); target.setDate(date.getDate() - 1) }
    if (e.key === 'ArrowDown')  { target = new Date(date); target.setDate(date.getDate() + 7) }
    if (e.key === 'ArrowUp')    { target = new Date(date); target.setDate(date.getDate() - 7) }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectDay(date); return }
    if (e.key === 'Escape') { setOpen(false); return }
    if (target && e.key.startsWith('Arrow')) {
      e.preventDefault()
      if (target.getMonth() !== viewMonth || target.getFullYear() !== viewYear) {
        setViewMonth(target.getMonth()); setViewYear(target.getFullYear())
      }
      setTimeout(() => {
        const btn = wrapRef.current?.querySelector<HTMLButtonElement>(`[data-date='${target!.toDateString()}']`)
        btn?.focus()
      }, 10)
    }
  }

  const dayBtnCls = 'relative aspect-square flex items-center justify-center text-body-callout rounded-[--radius-sm] border-none bg-transparent cursor-pointer text-foreground font-inherit transition-[background,color] duration-[100ms] outline-none hover:bg-graphite focus-visible:shadow-[0_0_0_2px_var(--ks-patina)]'

  return (
    <div ref={wrapRef} className={cn('flex flex-col gap-[0.375rem] w-full relative', className)}>
      {label && <label className="text-body-callout font-semibold text-foreground leading-none" htmlFor={uid}>{label}</label>}

      <button
        id={uid}
        type="button"
        className={cn(
          'flex items-center w-full bg-raised border border-rule rounded-[--radius-sm] cursor-pointer font-inherit text-foreground transition-[border-color,box-shadow] duration-[140ms]',
          'focus:border-patina focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-patina)_18%,transparent)]',
          open && 'border-patina shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-patina)_18%,transparent)]',
          errorText && 'border-[color-mix(in_oklch,var(--ks-danger)_55%,transparent)]',
          disabled && 'opacity-55 cursor-not-allowed',
        )}
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(o => !o); setView('days') } }}
      >
        <span className="inline-flex px-3 text-faint"><CalIcon /></span>
        <span className="flex-1 py-2 pr-2 text-body-callout text-left leading-normal">
          {displayStr ?? <span className="text-faint">{placeholder}</span>}
        </span>
        {clearable && selected && (
          <span
            className="inline-flex py-1 px-2 text-faint hover:text-foreground cursor-pointer"
            onClick={clear}
            role="button"
            aria-label="Clear date"
          >
            <XIcon />
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+4px)] left-0 z-[300] bg-lacquer border border-rule rounded-[--radius-md] shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.45),0_2px_8px_-2px_oklch(0%_0_0/0.28)] p-4 w-[280px]"
          style={{ animationName: 'ks-cal-in', animationDuration: '140ms', animationTimingFunction: 'ease', animationFillMode: 'both' }}
        >
          {view === 'days' && (
            <>
              <div className="flex items-center mb-3">
                <button type="button" className="inline-flex text-faint p-1 rounded-[5px] border-none bg-transparent cursor-pointer hover:text-foreground hover:bg-graphite flex-shrink-0" onClick={prevMonth}><ChevronL /></button>
                <span className="flex-1 text-center text-body-callout font-bold text-foreground cursor-pointer rounded-[5px] p-1 hover:bg-graphite transition-[background]" onClick={() => setView('months')}>
                  {MONTHS[viewMonth]} {viewYear}
                </span>
                <button type="button" className="inline-flex text-faint p-1 rounded-[5px] border-none bg-transparent cursor-pointer hover:text-foreground hover:bg-graphite flex-shrink-0" onClick={nextMonth}><ChevronR /></button>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map(d => (
                  <div key={d} className="text-center text-[0.625rem] font-bold tracking-[0.06em] uppercase text-faint py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-[2px]">
                {grid.map(({ date, otherMonth }) => (
                  <button
                    key={date.toDateString()}
                    type="button"
                    data-date={date.toDateString()}
                    className={cn(
                      dayBtnCls,
                      isToday(date) && 'text-patina font-bold',
                      selected && isSameDay(date, selected) && 'bg-patina! text-patina-fg! font-bold',
                      otherMonth && 'text-faint opacity-50',
                      isDisabled(date) && 'opacity-35 cursor-not-allowed',
                    )}
                    disabled={isDisabled(date)}
                    tabIndex={selected && isSameDay(date, selected) ? 0 : (isToday(date) ? 0 : -1)}
                    onClick={() => selectDay(date)}
                    onKeyDown={e => handleGridKey(e, date)}
                  >
                    {date.getDate()}
                    {isToday(date) && (
                      <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-patina" />
                    )}
                  </button>
                ))}
              </div>
              {showTime && (
                <div className="flex items-center gap-2 border-t border-rule mt-3 pt-3">
                  <input type="number" min={0} max={23} className="flex-1 bg-graphite border border-rule rounded-[5px] py-1 px-2 font-inherit text-body-callout text-foreground text-center outline-none focus:border-patina" value={hour} onChange={e => setHour(e.target.value.padStart(2,'0'))} />
                  <span className="text-faint font-bold">:</span>
                  <input type="number" min={0} max={59} className="flex-1 bg-graphite border border-rule rounded-[5px] py-1 px-2 font-inherit text-body-callout text-foreground text-center outline-none focus:border-patina" value={minute} onChange={e => setMinute(e.target.value.padStart(2,'0'))} />
                  <button type="button" className="text-body-callout text-patina bg-transparent border-none cursor-pointer" onClick={() => { if (selected) { const d = new Date(selected); d.setHours(Number(hour)); d.setMinutes(Number(minute)); commit(d) } setOpen(false) }}>Apply</button>
                </div>
              )}
            </>
          )}

          {view === 'months' && (
            <>
              <div className="flex items-center mb-3">
                <button type="button" className="inline-flex text-faint p-1 rounded-[5px] border-none bg-transparent cursor-pointer hover:text-foreground hover:bg-graphite flex-shrink-0" onClick={() => setViewYear(y => y - 1)}><ChevronL /></button>
                <span className="flex-1 text-center text-body-callout font-bold text-foreground cursor-pointer rounded-[5px] p-1 hover:bg-graphite" onClick={() => setView('years')}>{viewYear}</span>
                <button type="button" className="inline-flex text-faint p-1 rounded-[5px] border-none bg-transparent cursor-pointer hover:text-foreground hover:bg-graphite flex-shrink-0" onClick={() => setViewYear(y => y + 1)}><ChevronR /></button>
              </div>
              <div className="grid grid-cols-4 gap-1 max-h-[200px] overflow-y-auto">
                {MONTHS.map((m, i) => (
                  <button key={m} type="button"
                    className={cn('py-[0.4rem] rounded-[5px] border-none bg-transparent cursor-pointer font-inherit text-body-callout text-foreground text-center hover:bg-graphite transition-[background]', i === viewMonth && viewYear === (selected?.getFullYear() ?? -1) && 'bg-patina! text-patina-fg!')}
                    onClick={() => { setViewMonth(i); setView('days') }}
                  >{m.slice(0,3)}</button>
                ))}
              </div>
            </>
          )}

          {view === 'years' && (
            <>
              <div className="flex items-center mb-3">
                <span className="flex-1 text-center text-body-callout font-bold text-foreground">Select year</span>
              </div>
              <div className="grid grid-cols-4 gap-1 max-h-[200px] overflow-y-auto">
                {Array.from({ length: 24 }, (_, i) => now.getFullYear() - 10 + i).map(y => (
                  <button key={y} type="button"
                    className={cn('py-[0.4rem] rounded-[5px] border-none bg-transparent cursor-pointer font-inherit text-body-callout text-foreground text-center hover:bg-graphite transition-[background]', y === viewYear && 'bg-patina! text-patina-fg!')}
                    onClick={() => { setViewYear(y); setView('months') }}
                  >{y}</button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {(errorText || helperText) && (
        <span className={cn('text-body-caption', errorText ? 'text-danger' : 'text-faint')}>
          {errorText ?? helperText}
        </span>
      )}
    </div>
  )
}
