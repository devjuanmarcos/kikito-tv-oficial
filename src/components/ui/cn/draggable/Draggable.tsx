'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { DraggableProps, DraggableItem } from './draggable.types'

export function Draggable({
  items: initialItems,
  onChange,
  direction = 'vertical',
  handle    = false,
  className,
  style,
}: DraggableProps) {
  const [items, setItems]         = useState<DraggableItem[]>(initialItems)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overId, setOverId]       = useState<string | null>(null)
  const dragIndex                 = useRef<number>(-1)

  const reorder = (from: number, to: number) => {
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setItems(next)
    onChange?.(next)
  }

  const isHoriz = direction === 'horizontal'

  return (
    <div
      className={cn('flex', isHoriz ? 'flex-row' : 'flex-col', className)}
      style={style}
    >
      {items.map((item, idx) => (
        <div
          key={item.id}
          className={cn(
            'flex items-center gap-2 px-[14px] py-[10px] bg-raised border border-rule rounded-[--radius-md] select-none transition-[box-shadow,background,opacity] duration-[150ms] text-foreground text-body-callout active:cursor-grabbing',
            isHoriz ? 'mr-1 last:mr-0 flex-shrink-0' : 'mb-1 last:mb-0',
            !handle && 'cursor-grab',
            draggingId === item.id && 'opacity-40',
            overId === item.id && 'bg-float border-patina shadow-[0_0_0_2px_var(--ks-patina-soft)]',
          )}
          draggable={!handle}
          onDragStart={() => { setDraggingId(item.id); dragIndex.current = idx }}
          onDragEnd={() => { setDraggingId(null); setOverId(null) }}
          onDragOver={e => { e.preventDefault(); setOverId(item.id) }}
          onDrop={() => {
            if (dragIndex.current !== -1 && dragIndex.current !== idx) reorder(dragIndex.current, idx)
            setDraggingId(null); setOverId(null); dragIndex.current = -1
          }}
        >
          {handle && (
            <span
              className="text-faint cursor-grab active:cursor-grabbing flex flex-col gap-[3px] px-1 py-[2px] flex-shrink-0"
              draggable
              onDragStart={e => { e.stopPropagation(); setDraggingId(item.id); dragIndex.current = idx }}
            >
              <span className="block w-[14px] h-[2px] bg-current rounded-[1px]" />
              <span className="block w-[14px] h-[2px] bg-current rounded-[1px]" />
              <span className="block w-[14px] h-[2px] bg-current rounded-[1px]" />
            </span>
          )}
          {item.content}
        </div>
      ))}
    </div>
  )
}
