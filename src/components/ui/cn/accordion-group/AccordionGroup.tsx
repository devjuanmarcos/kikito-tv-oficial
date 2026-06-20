'use client'
import type React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export type AccordionGroupType    = 'single' | 'multi'
export type AccordionGroupVariant = 'default' | 'card' | 'flush'

export interface AccordionGroupItem {
  id:       string
  trigger:  React.ReactNode
  content:  React.ReactNode
  disabled?: boolean
}

export interface AccordionGroupProps {
  items:        AccordionGroupItem[]
  type?:        AccordionGroupType
  variant?:     AccordionGroupVariant
  defaultOpen?: string | string[]
  value?:       string | string[]
  onChange?:    (value: string | string[]) => void
  className?:   string
  style?:       React.CSSProperties
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    aria-hidden="true"
    className={cn('w-4 h-4 flex-shrink-0 transition-transform duration-[180ms]', open && 'rotate-180')}
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function normalizeOpen(v: string | string[] | undefined, type: AccordionGroupType): string[] {
  if (v === undefined) return []
  if (Array.isArray(v)) return type === 'single' ? [v[0]].filter(Boolean) : v
  return [v]
}

export function AccordionGroup({
  items,
  type     = 'single',
  variant  = 'default',
  defaultOpen,
  value,
  onChange,
  className,
  style,
}: AccordionGroupProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<string[]>(() => normalizeOpen(defaultOpen, type))
  const open = isControlled ? normalizeOpen(value, type) : internal

  function toggle(id: string) {
    let next: string[]
    if (type === 'single') {
      next = open[0] === id ? [] : [id]
    } else {
      next = open.includes(id) ? open.filter(v => v !== id) : [...open, id]
    }
    if (!isControlled) setInternal(next)
    onChange?.(type === 'single' ? (next[0] ?? '') : next)
  }

  const WRAP_CLS: Record<AccordionGroupVariant, string> = {
    default: 'divide-y divide-rule border border-rule rounded-xl overflow-hidden',
    card:    'flex flex-col gap-2',
    flush:   'divide-y divide-rule',
  }
  const ITEM_CLS: Record<AccordionGroupVariant, string> = {
    default: '',
    card:    'border border-rule rounded-xl overflow-hidden',
    flush:   '',
  }

  return (
    <div style={style} className={cn(WRAP_CLS[variant], className)}>
      {items.map(item => {
        const isOpen = open.includes(item.id)
        return (
          <div key={item.id} className={ITEM_CLS[variant]}>
            <button
              type="button"
              disabled={item.disabled}
              aria-expanded={isOpen}
              aria-controls={`acc-${item.id}`}
              onClick={() => toggle(item.id)}
              className={cn(
                'w-full flex items-center justify-between gap-3 px-4 py-3.5',
                'text-left text-body-callout font-medium text-foreground',
                'hover:bg-graphite transition-colors duration-[80ms]',
                item.disabled && 'opacity-40 pointer-events-none',
              )}
            >
              <span>{item.trigger}</span>
              <ChevronIcon open={isOpen} />
            </button>
            <div
              id={`acc-${item.id}`}
              role="region"
              aria-hidden={!isOpen}
              className={cn(
                'overflow-hidden transition-[max-height,opacity] duration-[220ms] ease-in-out',
                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
              )}
            >
              <div className="px-4 pb-4 text-body-paragraph text-faint">
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
