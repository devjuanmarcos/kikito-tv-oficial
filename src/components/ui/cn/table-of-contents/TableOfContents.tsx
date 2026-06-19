'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { TableOfContentsProps } from './table-of-contents.types'

const LEVEL_PL: Record<number, string> = {
  1: 'pl-2',
  2: 'pl-5',
  3: 'pl-8',
  4: 'pl-11',
}

export function TableOfContents({
  items,
  title            = 'Nesta página',
  activeId: controlledActiveId,
  onItemClick,
  maxDepth         = 3,
  sticky           = false,
  className,
  style,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(controlledActiveId ?? items[0]?.id ?? '')

  useEffect(() => {
    if (controlledActiveId !== undefined) setActiveId(controlledActiveId)
  }, [controlledActiveId])

  useEffect(() => {
    if (controlledActiveId !== undefined) return
    const observer = new IntersectionObserver(
      entries => { const v = entries.find(e => e.isIntersecting); if (v) setActiveId(v.target.id) },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    )
    items.forEach(item => { const el = document.getElementById(item.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [items, controlledActiveId])

  const handleClick = useCallback((id: string) => {
    setActiveId(id)
    onItemClick?.(id)
    if (controlledActiveId === undefined) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [onItemClick, controlledActiveId])

  const filtered = items.filter(item => item.level <= maxDepth)

  return (
    <nav
      className={cn('w-full text-body-callout', sticky && 'sticky top-6', className)}
      style={style}
      aria-label="Table of contents"
    >
      {title && <div className="text-body-caption font-bold tracking-[0.08em] uppercase text-faint mb-[10px]">{title}</div>}
      <ul className="list-none m-0 p-0 flex flex-col gap-[2px]">
        {filtered.map(item => {
          const isActive = activeId === item.id
          return (
            <li key={item.id} className="block">
              <button
                type="button"
                className={cn(
                  'block w-full py-1 rounded-[--radius-sm] no-underline leading-snug border-l-2 border-transparent transition-[color,background,border-color] duration-[150ms] cursor-pointer bg-transparent border-t-0 border-r-0 border-b-0 text-left font-[inherit] text-[inherit]',
                  LEVEL_PL[item.level] ?? 'pl-2',
                  isActive
                    ? 'text-patina border-l-patina bg-patina-soft font-medium'
                    : 'text-muted hover:text-foreground hover:bg-raised',
                )}
                onClick={() => handleClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
