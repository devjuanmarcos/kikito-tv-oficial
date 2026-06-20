'use client'
import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export type NavigationMenuOrientation = 'horizontal' | 'vertical'

export interface NavigationMenuItem {
  label:       string
  href?:       string
  icon?:       React.ReactNode
  badge?:      string | number
  disabled?:   boolean
  children?:   NavigationMenuItem[]
}

export interface NavigationMenuProps {
  items:        NavigationMenuItem[]
  activeHref?:  string
  orientation?: NavigationMenuOrientation
  onNavigate?:  (href: string) => void
  className?:   string
  style?:       React.CSSProperties
}

const ChevronIcon = ({ open, vertical }: { open: boolean; vertical?: boolean }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    aria-hidden="true"
    className={cn('w-3 h-3 flex-shrink-0 transition-transform duration-[160ms]', open && 'rotate-180', vertical && !open && '-rotate-90')}
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function NavItem({
  item,
  activeHref,
  onNavigate,
  orientation,
}: {
  item:        NavigationMenuItem
  activeHref?: string
  onNavigate?: (href: string) => void
  orientation: NavigationMenuOrientation
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isHorizontal = orientation === 'horizontal'
  const hasChildren  = !!item.children?.length
  const isActive     = item.href === activeHref

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={item.disabled}
        aria-expanded={hasChildren ? open : undefined}
        onClick={() => {
          if (hasChildren) setOpen(v => !v)
          else if (item.href) onNavigate?.(item.href)
        }}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-lg text-body-callout font-medium whitespace-nowrap',
          'transition-[background,color] duration-[80ms]',
          isActive
            ? 'bg-patina/15 text-patina'
            : 'text-foreground hover:bg-graphite',
          item.disabled && 'opacity-40 pointer-events-none',
        )}
      >
        {item.icon && <span className="leading-none">{item.icon}</span>}
        {item.label}
        {item.badge !== undefined && (
          <span className="px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold bg-danger text-danger-fg leading-none">
            {item.badge}
          </span>
        )}
        {hasChildren && <ChevronIcon open={open} vertical={!isHorizontal} />}
      </button>

      {hasChildren && open && (
        <div
          className={cn(
            'z-50 py-1 rounded-xl border border-rule bg-raised shadow-[0_8px_24px_-8px_oklch(0%_0_0/0.4)]',
            isHorizontal ? 'absolute top-full left-0 mt-1 min-w-[160px]' : 'ml-4 mt-0.5',
          )}
        >
          {item.children!.map((child, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { if (child.href) { onNavigate?.(child.href); setOpen(false) } }}
              className={cn(
                'w-full flex items-center justify-between gap-4 px-4 py-2 text-body-callout text-left',
                'transition-colors duration-[80ms] hover:bg-graphite',
                child.href === activeHref ? 'text-patina' : 'text-foreground',
              )}
            >
              <span>{child.label}</span>
              {child.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold bg-danger text-danger-fg leading-none">
                  {child.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function NavigationMenu({
  items,
  activeHref,
  orientation = 'horizontal',
  onNavigate,
  className,
  style,
}: NavigationMenuProps) {
  return (
    <nav
      style={style}
      aria-label="Navigation"
      className={cn(
        'flex gap-0.5',
        orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
        className,
      )}
    >
      {items.map((item, i) => (
        <NavItem
          key={i}
          item={item}
          activeHref={activeHref}
          onNavigate={onNavigate}
          orientation={orientation}
        />
      ))}
    </nav>
  )
}
