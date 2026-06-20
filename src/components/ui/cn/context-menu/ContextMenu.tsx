'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import type { ContextMenuProps } from './context-menu.types'

export function ContextMenu({ groups, children, className, style }: ContextMenuProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos]   = useState({ x: 0, y: 0 })
  const menuRef         = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault()
    const x = Math.min(e.clientX, window.innerWidth - 200)
    const y = Math.min(e.clientY, window.innerHeight - 300)
    setPos({ x, y })
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, close])

  return (
    <>
      <div className={cn('contents', className)} style={style} onContextMenu={handleContextMenu}>
        {children}
      </div>
      {open && createPortal(
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={close}
            onContextMenu={e => { e.preventDefault(); close() }}
          />
          <div
            ref={menuRef}
            className="fixed z-[9999] bg-float border border-rule rounded-[--radius-base] p-1 min-w-[180px] shadow-[var(--ks-shadow-lg)]"
            style={{ top: pos.y, left: pos.x, animationName: 'ctx-in', animationDuration: '0.1s', animationTimingFunction: 'ease', animationFillMode: 'both' }}
            role="menu"
          >
            {groups.map((group, gi) => (
              <div key={gi} className={cn('flex flex-col', gi > 0 && 'before:content-[""] before:block before:h-px before:bg-rule before:my-1')}>
                {group.label && (
                  <div className="text-[0.625rem] font-semibold tracking-[0.06em] uppercase text-muted py-1 px-2">{group.label}</div>
                )}
                {group.items.map((item, ii) => (
                  <button
                    key={ii}
                    className={cn(
                      'flex items-center gap-2 py-[7px] px-2 rounded-[5px] text-body-callout text-foreground cursor-pointer transition-[background] duration-[100ms] border-none bg-transparent w-full text-left',
                      !item.disabled && !item.danger && 'hover:bg-[color-mix(in_srgb,var(--ks-patina)_10%,transparent)] hover:text-patina',
                      item.danger && 'text-danger',
                      item.danger && !item.disabled && 'hover:bg-[color-mix(in_srgb,var(--ks-danger)_10%,transparent)]',
                      item.disabled && 'opacity-35 cursor-default',
                    )}
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => { if (!item.disabled) { item.onClick?.(); close() } }}
                  >
                    {item.icon && (
                      <span className="flex items-center justify-center w-4 h-4 flex-shrink-0 [&_svg]:w-full [&_svg]:h-full">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.shortcut && <span className="text-body-caption opacity-45 font-mono">{item.shortcut}</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>,
        document.body
      )}
    </>
  )
}
