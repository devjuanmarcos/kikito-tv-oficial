'use client'
import type React from 'react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export interface ShortcutEntry {
  label: string
  keys:  string[]
}

export interface ShortcutGroup {
  title:     string
  shortcuts: ShortcutEntry[]
}

export interface KeyboardShortcutsProps {
  groups:   ShortcutGroup[]
  isOpen:   boolean
  onClose:  () => void
  title?:   string
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-4 h-4">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
  </svg>
)

export function KeyboardShortcuts({
  groups,
  isOpen,
  onClose,
  title = 'Keyboard Shortcuts',
}: KeyboardShortcutsProps) {
  const [mounted, setMounted] = useState(false)
  const [query, setQuery]     = useState('')

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const filtered = groups
    .map(g => ({
      ...g,
      shortcuts: g.shortcuts.filter(s =>
        !query || s.label.toLowerCase().includes(query.toLowerCase()),
      ),
    }))
    .filter(g => g.shortcuts.length > 0)

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[oklch(0%_0_0/0.6)] backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md mx-4 rounded-2xl border border-rule bg-raised shadow-[0_24px_64px_-16px_oklch(0%_0_0/0.6)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-rule">
          <span className="text-body-callout font-semibold text-foreground">{title}</span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-faint hover:text-foreground hover:bg-graphite transition-colors"
          >
            <XIcon />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-rule">
          <input
            type="search"
            placeholder="Search shortcuts…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-graphite border border-rule rounded-lg px-3 py-2 text-body-callout text-foreground placeholder:text-faint outline-none focus:border-patina transition-colors"
          />
        </div>

        {/* Groups */}
        <div className="max-h-[420px] overflow-y-auto divide-y divide-rule">
          {filtered.length === 0 ? (
            <p className="px-5 py-8 text-center text-body-callout text-faint">No shortcuts found.</p>
          ) : (
            filtered.map(group => (
              <div key={group.title} className="px-5 py-3">
                <p className="text-body-caption font-semibold text-faint uppercase tracking-wide mb-2">{group.title}</p>
                <ul className="space-y-2">
                  {group.shortcuts.map((s, i) => (
                    <li key={i} className="flex items-center justify-between gap-4">
                      <span className="text-body-callout text-foreground">{s.label}</span>
                      <div className="flex items-center gap-1">
                        {s.keys.map((k, j) => (
                          <kbd
                            key={j}
                            className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-md text-[0.65rem] font-medium bg-graphite border border-rule text-foreground shadow-[0_1px_0_oklch(0%_0_0/0.3)]"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
