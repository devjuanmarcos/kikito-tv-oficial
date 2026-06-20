'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CN_GROUPS, CN_REGISTRY } from '@/lib/cn-registry'
import type { CnComponentMeta } from '@/lib/cn-registry'
import { CnThemeToggle } from '@/components/ui/cn/cn-theme-toggle'

const GROUP_ICONS: Record<string, string> = {
  inputs:   '▤',
  display:  '◲',
  data:     '⊟',
  feedback: '◫',
  layout:   '▭',
  overlays: '◆',
  charts:   '◑',
}

/* ── SidebarGroup ─────────────────────────────────────────────────────── */
function SidebarGroup({
  groupId,
  label,
  icon,
  components,
  pathname,
  query,
  defaultOpen,
}: {
  groupId: string
  label: string
  icon: string
  components: CnComponentMeta[]
  pathname: string
  query: string
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  const filtered = query
    ? components.filter(c => c.title.toLowerCase().includes(query.toLowerCase()))
    : components

  if (query && filtered.length === 0) return null

  const hasActive = components.some(c => pathname.endsWith(`/cn/${c.group}/${c.name}`))
  const isOpen = open || !!query

  return (
    <div className="cns-group" key={groupId}>
      <button
        className={cn('cns-group-header', hasActive && 'cns-group-header--active')}
        onClick={() => setOpen(o => !o)}
        aria-expanded={isOpen}
      >
        <span className="cns-group-icon">{icon}</span>
        <span className="cns-group-label">{label}</span>
        <span className="cns-count">{components.length}</span>
        <span className={cn('cns-chevron', isOpen && 'cns-chevron--open')}>▾</span>
      </button>

      <div className={cn('cns-items-grid', isOpen && 'cns-items-grid--open')}>
        <div>
          <div className="cns-items-inner">
            {filtered.map(comp => {
              const href = `/cn/${comp.group}/${comp.name}`
              const isActive = pathname.endsWith(`/cn/${comp.group}/${comp.name}`)
              return (
                <Link
                  key={comp.name}
                  href={href}
                  className={cn('cns-item', isActive && 'cns-item--active')}
                >
                  {isActive && <span className="cns-active-dot" aria-hidden />}
                  {comp.title}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── CnSidebar ────────────────────────────────────────────────────────── */
export function CnSidebar() {
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <style>{`
        .cns-group {
          border-bottom: 1px solid color-mix(in oklch, var(--ks-rule) 50%, transparent);
        }
        .cns-group:last-child { border-bottom: none; }

        .cns-group-header {
          display: flex; align-items: center; gap: 0.4375rem;
          width: 100%; padding: 0.5625rem 0.875rem 0.5625rem 1rem;
          background: none; border: none; cursor: pointer;
          color: var(--ks-text-faint); text-align: left;
          font-family: inherit; font-size: 0.6875rem;
          font-weight: 700; letter-spacing: 0.065em; text-transform: uppercase;
          transition: color 120ms ease, background 120ms ease;
        }
        .cns-group-header:hover {
          color: var(--ks-text);
          background: color-mix(in oklch, var(--ks-lacquer-raised) 60%, transparent);
        }
        .cns-group-header--active { color: var(--ks-patina); }

        .cns-group-icon {
          font-size: 0.8125rem; opacity: 0.6; flex-shrink: 0;
          width: 0.875rem; text-align: center; line-height: 1;
        }
        .cns-group-label { flex: 1; }

        .cns-count {
          font-size: 0.625rem; font-weight: 600; letter-spacing: 0;
          color: var(--ks-text-faint); opacity: 0.6;
          background: color-mix(in oklch, var(--ks-rule) 60%, transparent);
          padding: 0.0625rem 0.3125rem; border-radius: 999px; line-height: 1.5;
          text-transform: none;
        }

        .cns-chevron {
          display: inline-block; font-size: 0.6875rem;
          opacity: 0.45; flex-shrink: 0; line-height: 1;
          transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cns-chevron--open { transform: rotate(180deg); }

        .cns-items-grid {
          display: grid; grid-template-rows: 0fr;
          transition: grid-template-rows 260ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cns-items-grid--open { grid-template-rows: 1fr; }
        .cns-items-grid > div { overflow: hidden; min-height: 0; }
        .cns-items-inner {
          padding: 0.125rem 0.4375rem 0.5rem;
          display: flex; flex-direction: column; gap: 1px;
        }

        .cns-item {
          position: relative; display: flex; align-items: center; gap: 0.4375rem;
          padding: 0.34375rem 0.6875rem; border-radius: var(--ks-radius-base);
          font-size: 0.8125rem; color: var(--ks-text-faint); text-decoration: none;
          transition: background 100ms ease, color 100ms ease, transform 120ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cns-item:hover {
          background: color-mix(in oklch, var(--ks-lacquer-raised) 80%, transparent);
          color: var(--ks-text); transform: translateX(2px);
        }
        .cns-item--active {
          background: color-mix(in oklch, var(--ks-patina) 11%, transparent);
          color: var(--ks-patina); font-weight: 600;
        }
        .cns-item--active:hover {
          background: color-mix(in oklch, var(--ks-patina) 17%, transparent);
          transform: none;
        }

        .cns-active-dot {
          display: inline-block; width: 5px; height: 5px; border-radius: 50%;
          background: var(--ks-patina); flex-shrink: 0;
        }

        .cns-search {
          width: 100%; height: 1.9375rem;
          background: color-mix(in oklch, var(--ks-lacquer-raised) 80%, transparent);
          border: 1px solid var(--ks-rule);
          border-radius: var(--ks-radius-base);
          padding: 0 2.125rem 0 1.875rem;
          font-size: 0.8125rem; color: var(--ks-text); outline: none;
          font-family: inherit; box-sizing: border-box;
          transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;
        }
        .cns-search::placeholder { color: var(--ks-text-faint); }
        .cns-search:focus {
          border-color: var(--ks-patina);
          background: var(--ks-lacquer);
          box-shadow: 0 0 0 2px color-mix(in oklch, var(--ks-patina) 20%, transparent);
        }

        .cns-scroll { scrollbar-width: thin; scrollbar-color: var(--ks-rule) transparent; }
        .cns-scroll::-webkit-scrollbar { width: 3px; }
        .cns-scroll::-webkit-scrollbar-track { background: transparent; }
        .cns-scroll::-webkit-scrollbar-thumb { background: var(--ks-rule); border-radius: 999px; }
        .cns-scroll::-webkit-scrollbar-thumb:hover { background: var(--ks-text-faint); }
      `}</style>

      {/* ── Logo / header ─────────────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-4 border-b border-rule flex-shrink-0 flex items-center justify-between gap-2">
        <Link href="/cn" className="block min-w-0">
          <span className="text-[0.5625rem] font-bold tracking-[0.16em] uppercase text-faint">Kikito</span>
          <div className="flex items-baseline gap-1.5 mt-[3px]">
            <span className="text-body-title font-bold text-foreground leading-none tracking-tight">CN</span>
            <span className="text-[0.6rem] font-bold tracking-[0.04em] uppercase text-patina leading-none">
              Design System
            </span>
          </div>
        </Link>
        <CnThemeToggle />
      </div>

      {/* ── Search ────────────────────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-1.5 flex-shrink-0">
        <div className="relative">
          <svg
            className="absolute left-[0.5625rem] top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--ks-text-faint)' }}
            width="12" height="12" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" strokeWidth="2"
          >
            <circle cx="7" cy="7" r="5"/><path d="m12.5 12.5-3-3"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="cns-search"
            placeholder="Buscar componentes…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Buscar componentes"
          />
          {query && (
            <button
              className="absolute right-[0.5625rem] top-1/2 -translate-y-1/2 text-[0.625rem] leading-none text-faint hover:text-foreground transition-colors"
              onClick={() => setQuery('')}
              aria-label="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Count ─────────────────────────────────────────────────────── */}
      <div className="px-4 pb-1.5 flex-shrink-0">
        <span className="text-body-caption text-faint">{CN_REGISTRY.length} componentes</span>
      </div>

      {/* ── Nav groups ────────────────────────────────────────────────── */}
      <nav className="cns-scroll flex-1 overflow-y-auto py-1 pb-6" aria-label="Componentes CN">
        {CN_GROUPS.map(group => {
          const components = CN_REGISTRY.filter(c => c.group === group.id)
          if (components.length === 0) return null
          const hasActive = components.some(c => pathname.endsWith(`/cn/${c.group}/${c.name}`))
          return (
            <SidebarGroup
              key={group.id}
              groupId={group.id}
              label={group.label}
              icon={GROUP_ICONS[group.id] ?? '◈'}
              components={components}
              pathname={pathname}
              query={query}
              defaultOpen={hasActive}
            />
          )
        })}
      </nav>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-rule flex-shrink-0">
        <p className="text-body-caption text-faint">v0.1 · kikito.com.br</p>
      </div>
    </>
  )
}
