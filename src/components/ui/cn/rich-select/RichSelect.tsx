'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { RichSelectProps } from './rich-select.types'

export function RichSelect({
  options,
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Selecionar…',
  label,
  disabled,
  searchable = false,
  size = 'md',
  className,
  style,
}: RichSelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const controlled = value !== undefined
  const selected = controlled ? value : internalValue

  const groups = Array.from(new Set(options.map(o => o.group ?? '')))
  const filtered = options.filter(o =>
    !search || o.label.toLowerCase().includes(search.toLowerCase()) || o.description?.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const select = (v: string) => {
    if (!controlled) setInternalValue(v)
    onChange?.(v)
    setOpen(false)
    setSearch('')
  }

  const selectedOpt = options.find(o => o.value === selected)

  return (
    <div ref={rootRef} className={cn('relative flex flex-col gap-1', className)} style={style}>
      {label && (
        <label className="text-[0.75rem] font-semibold text-muted">{label}</label>
      )}
      <button
        type="button"
        className={cn(
          'flex items-center gap-2 px-3 py-[9px] bg-sunken border border-rule rounded-[--radius-md] cursor-pointer text-foreground text-[0.875rem] transition-colors duration-150 text-left hover:border-patina',
          open && 'border-patina',
          disabled && 'opacity-50 cursor-not-allowed',
          size === 'sm' && 'py-[5px] px-[10px] text-[0.75rem]',
          size === 'lg' && 'py-[11px] px-[14px] text-[1rem]',
        )}
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
      >
        {selectedOpt?.icon && <span className="flex-shrink-0">{selectedOpt.icon}</span>}
        {selectedOpt ? (
          <span className="flex-1">{selectedOpt.label}</span>
        ) : (
          <span className="flex-1 text-faint">{placeholder}</span>
        )}
        <span className="ml-auto text-[0.625rem] text-faint flex-shrink-0 transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : undefined }}>▾</span>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-float border border-rule rounded-[--radius-md] shadow-[var(--ks-shadow-md)] z-[100] overflow-hidden max-h-[280px] flex flex-col animate-in fade-in slide-in-from-top-1 duration-100">
          {searchable && (
            <input
              className="px-3 py-2 border-b border-rule border-t-0 border-l-0 border-r-0 bg-transparent text-foreground text-[0.8125rem] outline-none flex-shrink-0 placeholder:text-faint"
              placeholder="Buscar…"
              value={search}
              onChange={e => { setSearch(e.target.value); setHighlighted(0) }}
              autoFocus
            />
          )}
          <div className="overflow-y-auto flex-1 py-1">
            {groups.map(group => {
              const groupOpts = filtered.filter(o => (o.group ?? '') === group)
              if (groupOpts.length === 0) return null
              const gOffset = filtered.indexOf(groupOpts[0])
              return (
                <div key={group}>
                  {group && (
                    <div className="px-3 pt-[6px] pb-[2px] text-[0.625rem] font-bold uppercase tracking-[0.1em] text-faint">
                      {group}
                    </div>
                  )}
                  {groupOpts.map((opt, i) => (
                    <div
                      key={opt.value}
                      className={cn(
                        'flex items-center gap-[10px] px-3 py-[9px] cursor-pointer transition-colors duration-100',
                        (highlighted === gOffset + i || opt.value === selected) ? 'bg-raised' : 'hover:bg-raised',
                        opt.disabled && 'opacity-40 pointer-events-none',
                      )}
                      onMouseEnter={() => setHighlighted(gOffset + i)}
                      onMouseDown={e => { e.preventDefault(); if (!opt.disabled) select(opt.value) }}
                    >
                      {opt.icon && <span className="flex-shrink-0 text-[18px] text-muted">{opt.icon}</span>}
                      <span className="flex-1 min-w-0">
                        <span className={cn('block text-[0.8125rem] font-medium text-foreground', opt.value === selected && 'text-patina font-semibold')}>
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className="block text-[0.6875rem] text-muted truncate">{opt.description}</span>
                        )}
                      </span>
                      {opt.badge && (
                        <span className="px-[7px] py-[1px] rounded-pill bg-patina-soft text-patina text-[0.625rem] font-bold flex-shrink-0">
                          {opt.badge}
                        </span>
                      )}
                      {opt.value === selected && (
                        <span className="ml-auto text-patina text-[0.875rem]">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
