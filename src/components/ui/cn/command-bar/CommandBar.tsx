'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { CommandBarProps } from './command-bar.types'

export function CommandBar({ actions, placeholder = 'Search commands…', className, style }: CommandBarProps) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return q ? actions.filter(a => a.label.toLowerCase().includes(q)) : actions
  }, [actions, query])

  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    filtered.forEach(a => {
      const g = a.group ?? 'Actions'
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(a)
    })
    return map
  }, [filtered])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(filtered.length - 1, c + 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(0, c - 1)) }
    if (e.key === 'Enter' && filtered[cursor]) { filtered[cursor].onSelect?.() }
  }

  let flatIdx = 0

  return (
    <div
      className={cn('rounded-[--radius-lg] border border-rule bg-raised overflow-hidden shadow-lg', className)}
      style={style}
    >
      {/* Search row */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-rule">
        <span className="text-faint text-[1.1rem]">⌕</span>
        <input
          className="flex-1 bg-transparent outline-none text-foreground text-[0.875rem] placeholder:text-faint"
          placeholder={placeholder}
          value={query}
          onChange={e => { setQuery(e.target.value); setCursor(0) }}
          onKeyDown={onKeyDown}
          autoFocus
        />
      </div>

      {/* Results list */}
      <div className="max-h-64 overflow-auto py-1">
        {groups.size === 0 && (
          <div className="px-4 py-6 text-center text-[0.8125rem] text-faint">No commands found</div>
        )}
        {Array.from(groups.entries()).map(([group, items]) => (
          <div key={group}>
            <div className="px-3 pt-2 pb-1 text-[0.6875rem] font-semibold text-faint uppercase tracking-[0.08em]">
              {group}
            </div>
            {items.map(item => {
              const idx = flatIdx++
              return (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors',
                    cursor === idx ? 'bg-patina/10 text-patina' : 'text-foreground hover:bg-graphite'
                  )}
                  onClick={() => item.onSelect?.()}
                  onMouseEnter={() => setCursor(idx)}
                >
                  {item.icon && <span className="text-[1rem] shrink-0">{item.icon}</span>}
                  <span className="flex-1 text-[0.875rem] font-medium">{item.label}</span>
                  {item.shortcut && (
                    <span className="flex items-center gap-1">
                      {item.shortcut.map((k, i) => (
                        <kbd key={i} className="text-[0.625rem] font-bold bg-graphite px-[5px] py-[2px] rounded text-faint">{k}</kbd>
                      ))}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
