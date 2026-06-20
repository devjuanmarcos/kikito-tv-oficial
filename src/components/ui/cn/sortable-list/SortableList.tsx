'use client'
import type React from 'react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface SortableItem {
  id:      string
  content: React.ReactNode
}

export interface SortableListProps {
  items:      SortableItem[]
  onChange?:  (items: SortableItem[]) => void
  disabled?:  boolean
  className?: string
  style?:     React.CSSProperties
}

const GripIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="w-4 h-4">
    <circle cx="9" cy="7" r="0.8" fill="currentColor" stroke="none"/>
    <circle cx="9" cy="12" r="0.8" fill="currentColor" stroke="none"/>
    <circle cx="9" cy="17" r="0.8" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="7" r="0.8" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="12" r="0.8" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="17" r="0.8" fill="currentColor" stroke="none"/>
  </svg>
)

export function SortableList({
  items: initialItems,
  onChange,
  disabled  = false,
  className,
  style,
}: SortableListProps) {
  const [items, setItems]       = useState<SortableItem[]>(initialItems)
  const [dragging, setDragging] = useState<string | null>(null)
  const [over, setOver]         = useState<string | null>(null)
  const dragId                  = useRef<string | null>(null)

  function handleDragStart(id: string) {
    dragId.current = id
    setDragging(id)
  }

  function handleDrop(targetId: string) {
    if (!dragId.current || dragId.current === targetId) return
    const from = items.findIndex(i => i.id === dragId.current)
    const to   = items.findIndex(i => i.id === targetId)
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setItems(next)
    onChange?.(next)
    setDragging(null)
    setOver(null)
    dragId.current = null
  }

  return (
    <ul
      style={style}
      className={cn('flex flex-col gap-1', className)}
    >
      {items.map(item => (
        <li
          key={item.id}
          draggable={!disabled}
          onDragStart={() => handleDragStart(item.id)}
          onDragEnd={() => { setDragging(null); setOver(null) }}
          onDragOver={(e) => { e.preventDefault(); setOver(item.id) }}
          onDrop={() => handleDrop(item.id)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg border border-rule bg-raised',
            'transition-[opacity,border-color,background] duration-[100ms]',
            !disabled && 'cursor-default',
            dragging === item.id && 'opacity-40',
            over === item.id && dragging !== item.id && 'border-patina bg-patina/5',
          )}
        >
          {!disabled && (
            <span className="flex-shrink-0 text-faint cursor-grab active:cursor-grabbing">
              <GripIcon />
            </span>
          )}
          <div className="flex-1 min-w-0">{item.content}</div>
        </li>
      ))}
    </ul>
  )
}
