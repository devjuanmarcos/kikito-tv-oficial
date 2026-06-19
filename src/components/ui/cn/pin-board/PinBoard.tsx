'use client'

import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { PinNote, PinBoardProps } from './pin-board.types'

const COLORS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff', '#fed7aa']
const ROTATIONS = [-3, -2, -1, 0, 1, 2, 3]

let idCounter = 1000

export function PinBoard({
  defaultNotes,
  onChange,
  width = '100%',
  height = 400,
  className,
  style,
}: PinBoardProps) {
  const [notes, setNotes] = useState<PinNote[]>(() =>
    defaultNotes ?? [
      { id: 1, content: 'Drag me around!', color: COLORS[0], x: 24, y: 24, rotate: -2 },
      { id: 2, content: 'Click + to add notes', color: COLORS[2], x: 180, y: 60, rotate: 1 },
      { id: 3, content: 'Double-click to delete', color: COLORS[4], x: 80, y: 160, rotate: -1 },
    ]
  )

  const boardRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{ id: string | number; offX: number; offY: number } | null>(null)

  const onMouseDown = useCallback((e: React.MouseEvent, id: string | number) => {
    e.preventDefault()
    const card = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const board = boardRef.current?.getBoundingClientRect()
    if (!board) return
    dragState.current = {
      id,
      offX: e.clientX - card.left,
      offY: e.clientY - card.top,
    }
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const ds = dragState.current
    if (!ds || !boardRef.current) return
    const board = boardRef.current.getBoundingClientRect()
    const x = e.clientX - board.left - ds.offX
    const y = e.clientY - board.top - ds.offY
    setNotes(prev =>
      prev.map(n => n.id === ds.id ? { ...n, x, y } : n)
    )
  }, [])

  const onMouseUp = useCallback(() => {
    if (!dragState.current) return
    dragState.current = null
    setNotes(prev => {
      onChange?.(prev)
      return prev
    })
  }, [onChange])

  function addNote() {
    idCounter++
    const note: PinNote = {
      id: idCounter,
      content: 'New note',
      color: COLORS[idCounter % COLORS.length],
      x: 40 + Math.random() * 120,
      y: 40 + Math.random() * 100,
      rotate: ROTATIONS[idCounter % ROTATIONS.length],
    }
    setNotes(prev => {
      const next = [...prev, note]
      onChange?.(next)
      return next
    })
  }

  function deleteNote(id: string | number) {
    setNotes(prev => {
      const next = prev.filter(n => n.id !== id)
      onChange?.(next)
      return next
    })
  }

  return (
    <div className={cn('relative overflow-hidden rounded-[--radius-lg] border border-rule bg-canvas', className)}
      style={{ width, height, ...style }}
      ref={boardRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {notes.map(note => (
        <div
          key={note.id}
          onMouseDown={e => onMouseDown(e, note.id)}
          onDoubleClick={() => deleteNote(note.id)}
          style={{
            position: 'absolute',
            left: note.x ?? 0,
            top: note.y ?? 0,
            transform: `rotate(${note.rotate ?? 0}deg)`,
            background: note.color ?? COLORS[0],
            cursor: 'grab',
            userSelect: 'none',
            zIndex: dragState.current?.id === note.id ? 10 : 1,
          }}
          className="w-32 min-h-[7rem] p-3 shadow-md rounded-[--radius-sm] text-[0.8125rem] text-neutral-800 leading-snug"
          title="Double-click to delete"
        >
          {note.content}
        </div>
      ))}

      <button
        onClick={addNote}
        className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-patina text-patina-fg flex items-center justify-center text-xl shadow-md hover:bg-patina/90 transition-colors"
        title="Add note"
      >
        +
      </button>
    </div>
  )
}
