'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { KanbanCard, KanbanColumn, KanbanProps } from './kanban.types'

const INTENT_COLORS: Record<string, string> = {
  primary: 'var(--ks-patina)',
  success: 'var(--ks-success)',
  warning: 'var(--ks-warning)',
  danger:  'var(--ks-danger)',
  neutral: 'var(--ks-rule)',
}

function KanbanCardItem({ card, dragging, onDragStart, onDragEnd }: {
  card: KanbanCard
  dragging: boolean
  onDragStart: () => void
  onDragEnd: () => void
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'rounded-[--radius-sm] border border-rule bg-lacquer p-3 cursor-grab active:cursor-grabbing select-none',
        'transition-all duration-150',
        dragging && 'opacity-40 scale-95'
      )}
    >
      {card.label && (
        <div
          className="inline-block text-[0.625rem] font-bold px-1.5 py-0.5 rounded-full mb-2"
          style={{
            background: card.labelColor ? card.labelColor + '22' : 'color-mix(in srgb, var(--ks-patina) 15%, transparent)',
            color: card.labelColor ?? 'var(--ks-patina)',
          }}
        >
          {card.label}
        </div>
      )}
      <div className="text-body-callout font-medium text-foreground">{card.title}</div>
      {card.description && (
        <div className="text-body-caption text-muted mt-1 leading-relaxed">{card.description}</div>
      )}
      {card.assignee && (
        <div className="mt-2 flex justify-end">
          <div
            className="w-6 h-6 rounded-full bg-patina text-patina-fg text-[0.625rem] font-bold flex items-center justify-center"
            title={card.assignee}
          >
            {card.assignee.slice(0, 2).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  )
}

export function Kanban({ columns: initial, onChange, className, style }: KanbanProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initial)
  const [dragging, setDragging] = useState<{ colId: string; cardId: string | number } | null>(null)
  const [overCol, setOverCol] = useState<string | null>(null)

  const update = (next: KanbanColumn[]) => { setColumns(next); onChange?.(next) }

  const onDragOver = (e: React.DragEvent, colId: string) => { e.preventDefault(); setOverCol(colId) }

  const onDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault()
    if (!dragging || dragging.colId === targetColId) { setOverCol(null); setDragging(null); return }
    const next = columns.map(col => {
      if (col.id === dragging.colId)
        return { ...col, cards: col.cards.filter(c => c.id !== dragging.cardId) }
      if (col.id === targetColId) {
        const card = columns.find(c => c.id === dragging.colId)?.cards.find(c => c.id === dragging.cardId)
        return card ? { ...col, cards: [...col.cards, card] } : col
      }
      return col
    })
    update(next)
    setOverCol(null)
    setDragging(null)
  }

  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-2', className)} style={style}>
      {columns.map(col => {
        const dotColor = INTENT_COLORS[col.intent ?? 'neutral']
        return (
          <div
            key={col.id}
            className={cn(
              'flex flex-col gap-2 min-w-[220px] max-w-[240px] rounded-[--radius-md] border p-3 transition-colors duration-150',
              overCol === col.id ? 'border-patina bg-patina/5' : 'border-rule bg-canvas'
            )}
            onDragOver={e => onDragOver(e, col.id)}
            onDrop={e => onDrop(e, col.id)}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: dotColor }} />
                <span className="text-body-callout font-semibold text-foreground">{col.title}</span>
              </div>
              <span className="text-body-caption font-bold text-faint bg-graphite px-1.5 py-0.5 rounded-full">
                {col.cards.length}
              </span>
            </div>
            {col.cards.map(card => (
              <KanbanCardItem
                key={card.id}
                card={card}
                dragging={dragging?.cardId === card.id}
                onDragStart={() => setDragging({ colId: col.id, cardId: card.id })}
                onDragEnd={() => { setDragging(null); setOverCol(null) }}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
