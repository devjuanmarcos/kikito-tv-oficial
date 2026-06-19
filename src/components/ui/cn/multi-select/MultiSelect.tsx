'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { MultiSelectProps } from './multi-select.types'

export function MultiSelect({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  placeholder = 'Select options…',
  size = 'md',
  disabled = false,
  maxSelected,
  searchable = true,
  clearable = true,
  className,
  style,
}: MultiSelectProps) {
  const isControlled = controlledValue !== undefined
  const [internal, setInternal] = useState<string[]>(defaultValue)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selected = isControlled ? (controlledValue ?? []) : internal

  const update = (next: string[]) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const addItem = (val: string) => {
    if (selected.includes(val)) return removeItem(val)
    if (maxSelected && selected.length >= maxSelected) return
    update([...selected, val])
    setQuery('')
  }

  const removeItem = (val: string) => update(selected.filter(v => v !== val))

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={wrapperRef} className={cn('relative flex flex-col gap-1', className)} style={style}>
      <div
        className={cn(
          'flex items-center flex-wrap gap-1 min-h-[38px] px-2 py-1 border border-rule bg-raised rounded-[--radius-base] cursor-pointer transition-colors duration-150 relative focus-within:border-patina',
          open && 'border-patina',
          disabled && 'opacity-50 cursor-not-allowed',
          size === 'sm' && 'min-h-[30px] px-[6px] py-[3px]',
          size === 'lg' && 'min-h-[46px] px-[10px] py-[6px]',
        )}
        onClick={() => !disabled && setOpen(o => !o)}
      >
        {selected.map(v => {
          const opt = options.find(o => o.value === v)
          return opt ? (
            <span key={v} className="flex items-center gap-1 pl-2 pr-1 py-[2px] rounded bg-patina/15 text-patina text-[0.75rem] font-medium">
              {opt.label}
              <button
                className="flex items-center justify-center w-[14px] h-[14px] bg-transparent text-current cursor-pointer p-0 rounded-[2px] opacity-70 hover:opacity-100 border-0"
                onClick={e => { e.stopPropagation(); removeItem(v) }}
                type="button"
                aria-label={`Remove ${opt.label}`}
              >
                ×
              </button>
            </span>
          ) : null
        })}
        {searchable && !disabled ? (
          <input
            className="flex-1 min-w-[80px] border-0 bg-transparent outline-none text-[0.8125rem] py-[2px] text-foreground placeholder:text-muted placeholder:opacity-60"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            placeholder={selected.length === 0 ? placeholder : ''}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          selected.length === 0 && (
            <span className="text-[0.8125rem] text-muted opacity-60 px-[2px]">{placeholder}</span>
          )
        )}
        {clearable && selected.length > 0 && (
          <button
            className="flex items-center justify-center w-4 h-4 border-0 bg-transparent cursor-pointer opacity-40 hover:opacity-100 flex-shrink-0 p-0 text-foreground"
            onClick={e => { e.stopPropagation(); update([]) }}
            type="button"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
        <svg
          className={cn('w-4 h-4 ml-auto flex-shrink-0 opacity-40 transition-transform duration-150', open && 'rotate-180')}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-raised border border-rule rounded-[--radius-base] shadow-[0_8px_24px_rgba(0,0,0,0.2)] z-[200] overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100">
          {filtered.length === 0 ? (
            <p className="px-3 py-3 text-[0.8125rem] text-center opacity-40">No options found</p>
          ) : filtered.map(opt => (
            <div
              key={opt.value}
              className={cn(
                'px-3 py-2 text-[0.8125rem] cursor-pointer flex items-center gap-2 transition-colors duration-100 text-foreground hover:bg-sunken',
                selected.includes(opt.value) && 'text-patina',
                opt.disabled && 'opacity-40 cursor-not-allowed',
              )}
              onClick={() => !opt.disabled && addItem(opt.value)}
            >
              <svg
                className={cn('w-[14px] h-[14px] flex-shrink-0 transition-opacity', selected.includes(opt.value) ? 'opacity-100' : 'opacity-0')}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
