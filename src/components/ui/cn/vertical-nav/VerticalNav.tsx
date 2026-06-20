'use client'
import type React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface NavItem {
  id:        string
  label:     string
  icon?:     React.ReactNode
  badge?:    string | number
  href?:     string
  disabled?: boolean
  children?: NavItem[]
}

export interface VerticalNavProps {
  items:      NavItem[]
  activeId?:  string
  onSelect?:  (id: string) => void
  className?: string
  style?:     React.CSSProperties
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    aria-hidden="true"
    className={cn('w-3.5 h-3.5 flex-shrink-0 transition-transform duration-[160ms]', open && 'rotate-180')}
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function NavItemRow({
  item,
  activeId,
  onSelect,
  depth = 0,
}: {
  item:     NavItem
  activeId?: string
  onSelect?: (id: string) => void
  depth?:    number
}) {
  const hasChildren = !!item.children?.length
  const isActive    = item.id === activeId
  const [expanded, setExpanded] = useState(() =>
    hasChildren ? !!(item.children?.some(c => c.id === activeId || c.children?.some(g => g.id === activeId))) : false
  )

  function handleClick() {
    if (item.disabled) return
    if (hasChildren) setExpanded(v => !v)
    else onSelect?.(item.id)
  }

  return (
    <li>
      <button
        type="button"
        disabled={item.disabled}
        aria-current={isActive ? 'page' : undefined}
        aria-expanded={hasChildren ? expanded : undefined}
        onClick={handleClick}
        style={{ paddingLeft: `${0.75 + depth * 1}rem` }}
        className={cn(
          'w-full flex items-center gap-2.5 pr-3 py-2 rounded-lg text-body-callout text-left',
          'transition-[background,color] duration-[80ms]',
          isActive
            ? 'bg-patina/15 text-patina font-semibold'
            : 'text-foreground hover:bg-graphite',
          item.disabled && 'opacity-40 pointer-events-none',
        )}
      >
        {item.icon && (
          <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-base leading-none">
            {item.icon}
          </span>
        )}
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge !== undefined && (
          <span className={cn(
            'flex-shrink-0 px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold leading-none',
            typeof item.badge === 'number'
              ? 'bg-danger text-danger-fg'
              : 'bg-graphite-2 text-faint',
          )}>
            {item.badge}
          </span>
        )}
        {hasChildren && <ChevronIcon open={expanded} />}
      </button>

      {hasChildren && expanded && (
        <ul className="mt-0.5 space-y-0.5">
          {item.children!.map(child => (
            <NavItemRow key={child.id} item={child} activeId={activeId} onSelect={onSelect} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

export function VerticalNav({
  items,
  activeId,
  onSelect,
  className,
  style,
}: VerticalNavProps) {
  return (
    <nav
      style={style}
      aria-label="Sidebar navigation"
      className={cn('flex flex-col gap-0.5 p-2 bg-raised border-r border-rule overflow-y-auto', className)}
    >
      <ul className="space-y-0.5">
        {items.map(item => (
          <NavItemRow key={item.id} item={item} activeId={activeId} onSelect={onSelect} />
        ))}
      </ul>
    </nav>
  )
}
