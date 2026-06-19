'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ChecklistItem, ChecklistProps } from './checklist.types'

const INTENT_CLS: Record<string, string> = {
  primary: '[--c:var(--ks-patina)] [--c-fg:var(--ks-patina-fg)]',
  success: '[--c:var(--ks-success)] [--c-fg:var(--ks-success-fg)]',
  warning: '[--c:var(--ks-warning)] [--c-fg:var(--ks-warning-fg)]',
  danger:  '[--c:var(--ks-danger)] [--c-fg:var(--ks-danger-fg)]',
}

export function Checklist({
  items: initialItems,
  onChange,
  showProgress  = true,
  intent        = 'primary',
  strikethrough = true,
  className,
  style,
}: ChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems)

  function toggle(id: string | number) {
    const next = items.map(it => it.id === id ? { ...it, checked: !it.checked } : it)
    setItems(next)
    onChange?.(next)
  }

  const done = items.filter(i => i.checked).length
  const pct  = items.length > 0 ? (done / items.length) * 100 : 0

  return (
    <div className={cn('flex flex-col gap-3', INTENT_CLS[intent], className)} style={style}>
      {showProgress && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[0.75rem] opacity-50">
            <span>{done} de {items.length} concluídos</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="h-[6px] bg-sunken rounded-pill overflow-hidden">
            <div
              className="h-full rounded-pill bg-[--c] transition-[width] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-start gap-[0.625rem] px-[0.625rem] py-2 rounded-[--radius-base] cursor-pointer transition-[background] duration-[100ms] hover:bg-sunken"
            role="checkbox"
            aria-checked={item.checked}
            tabIndex={0}
            onClick={() => toggle(item.id)}
            onKeyDown={e => (e.key === ' ' || e.key === 'Enter') ? toggle(item.id) : undefined}
          >
            <div
              className={cn(
                'w-[18px] h-[18px] rounded-[5px] border-2 border-rule shrink-0 mt-px flex items-center justify-center transition-[background,border-color] duration-[150ms]',
                item.checked && 'bg-[--c] border-[--c]',
              )}
            >
              {item.checked && <span className="text-[--c-fg] text-[0.625rem] leading-none">✓</span>}
            </div>
            <div className="flex-1">
              <div
                className={cn(
                  'text-[0.875rem] text-foreground leading-snug transition-[opacity] duration-[150ms]',
                  item.checked && 'opacity-40',
                  item.checked && strikethrough && 'line-through',
                )}
              >
                {item.label}
              </div>
              {item.description && (
                <div className="text-[0.75rem] opacity-40 mt-[2px]">{item.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
