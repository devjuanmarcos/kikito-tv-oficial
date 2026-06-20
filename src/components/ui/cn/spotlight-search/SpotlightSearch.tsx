'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import type { SpotlightSearchProps } from './spotlight-search.types'

export function SpotlightSearch({
  actions,
  isOpen,
  onClose,
  placeholder = 'Buscar ações…',
  maxResults  = 8,
  className,
}: SpotlightSearchProps) {
  const [query, setQuery]     = useState('')
  const [focused, setFocused] = useState(0)
  const inputRef              = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) { setQuery(''); setFocused(0); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [isOpen])

  const filtered = actions
    .filter(a => !query || a.label.toLowerCase().includes(query.toLowerCase()) || a.description?.toLowerCase().includes(query.toLowerCase()))
    .slice(0, maxResults)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(f + 1, filtered.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)) }
      if (e.key === 'Enter' && filtered[focused]) { filtered[focused].onSelect(); onClose() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  if (!isOpen) return null

  const groups = Array.from(new Set(filtered.map(a => a.group ?? '')))

  return createPortal(
    <div
      className="fixed inset-0 bg-black/55 backdrop-blur-[4px] flex items-start justify-center pt-[10vh] z-[1000]"
      onClick={onClose}
    >
      <div
        className={cn('bg-float border border-rule rounded-[--radius-xl] w-[580px] max-w-[calc(100vw-32px)] max-h-[70vh] flex flex-col shadow-[var(--ks-shadow-xl)] overflow-hidden', className)}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Busca rápida"
      >
        <div className="flex items-center gap-[10px] px-[18px] py-[14px] border-b border-rule flex-shrink-0">
          <span className="text-body-title text-faint flex-shrink-0" aria-hidden>🔍</span>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none text-foreground text-body-paragraph placeholder:text-faint"
            placeholder={placeholder}
            value={query}
            onChange={e => { setQuery(e.target.value); setFocused(0) }}
          />
        </div>

        <div className="overflow-y-auto flex-1 py-2" role="listbox">
          {filtered.length === 0 ? (
            <div className="py-8 px-4 text-center text-muted text-body-callout">Nenhuma ação encontrada para "{query}"</div>
          ) : groups.map(group => {
            const groupActions  = filtered.filter(a => (a.group ?? '') === group)
            const globalOffset  = filtered.indexOf(groupActions[0])
            return (
              <div key={group}>
                {group && (
                  <div className="px-4 py-2 pb-1 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-faint">{group}</div>
                )}
                {groupActions.map((action, i) => (
                  <button
                    key={action.id}
                    type="button"
                    className={cn(
                      'w-full flex items-center gap-3 px-[18px] py-[10px] bg-transparent border-none cursor-pointer text-left transition-[background] duration-[100ms] hover:bg-raised',
                      focused === globalOffset + i && 'bg-raised',
                    )}
                    onMouseEnter={() => setFocused(globalOffset + i)}
                    onClick={() => { action.onSelect(); onClose() }}
                    role="option"
                  >
                    <span className="w-8 h-8 bg-graphite rounded-[--radius-sm] flex items-center justify-center text-body-paragraph flex-shrink-0">
                      {action.icon ?? '⚡'}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-body-callout text-foreground font-medium">{action.label}</span>
                      {action.description && (
                        <span className="block text-body-caption text-muted whitespace-nowrap overflow-hidden text-ellipsis">{action.description}</span>
                      )}
                    </span>
                    {action.shortcut && (
                      <span className="flex gap-[3px] flex-shrink-0">
                        {action.shortcut.map((k, ki) => (
                          <kbd key={ki} className="px-[6px] py-[2px] border border-rule bg-raised rounded-[4px] text-body-caption text-muted font-mono">{k}</kbd>
                        ))}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )
          })}
        </div>

        <div className="px-[18px] py-2 border-t border-rule flex items-center gap-3 flex-shrink-0">
          {[['↑↓', 'navegar'], ['↵', 'selecionar'], ['Esc', 'fechar']].map(([key, hint]) => (
            <span key={hint} className="flex items-center gap-[5px] text-body-caption text-faint">
              <kbd className="px-[6px] py-[2px] border border-rule bg-raised rounded-[4px] text-body-caption text-muted font-mono">{key}</kbd>
              {hint}
            </span>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}
