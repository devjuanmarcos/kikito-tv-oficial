'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { SwipeCardProps } from './swipe-card.types'

export function SwipeCard({
  items,
  onSwipe,
  onEmpty,
  className,
  style,
}: SwipeCardProps) {
  const [stack, setStack] = useState(items)
  const [drag, setDrag] = useState<{ x: number; startX: number } | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  function dismiss(dir: 'left' | 'right') {
    const item = stack[0]
    setStack(s => s.slice(1))
    onSwipe?.(item, dir)
    if (stack.length === 1) onEmpty?.()
    setDrag(null)
  }

  function onMouseDown(e: React.MouseEvent) {
    setDrag({ x: 0, startX: e.clientX })
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!drag) return
    setDrag(d => d ? { ...d, x: e.clientX - d.startX } : null)
  }

  function onMouseUp() {
    if (!drag) return
    if (drag.x > 80) dismiss('right')
    else if (drag.x < -80) dismiss('left')
    else setDrag(null)
  }

  if (stack.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-48 text-faint text-[0.875rem]', className)} style={style}>
        No more cards
      </div>
    )
  }

  const rotate = drag ? drag.x * 0.1 : 0
  const opacity = drag ? Math.max(0.3, 1 - Math.abs(drag.x) / 300) : 1

  return (
    <div
      className={cn('relative select-none', className)}
      style={{ height: 320, ...style }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {stack.slice(0, 3).map((item, i) => {
        const isTop = i === 0
        const scale = 1 - i * 0.04
        const translateY = i * 12

        return (
          <div
            key={item.id}
            ref={isTop ? cardRef : undefined}
            onMouseDown={isTop ? onMouseDown : undefined}
            style={{
              position: 'absolute',
              inset: 0,
              transform: isTop && drag
                ? `translate(${drag.x}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`
                : `translateY(${translateY}px) scale(${scale})`,
              opacity: isTop ? opacity : 1,
              zIndex: 3 - i,
              cursor: isTop ? 'grab' : 'default',
              transition: isTop && drag ? 'none' : 'all 0.3s ease',
            }}
            className="rounded-[--radius-lg] border border-rule bg-raised shadow-md overflow-hidden"
          >
            {item.image && (
              <div className="h-40 bg-graphite overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <p className="font-semibold text-foreground">{item.title}</p>
              {item.subtitle && <p className="text-[0.8125rem] text-muted mt-0.5">{item.subtitle}</p>}
              {item.content && <div className="mt-2 text-[0.875rem] text-muted">{item.content}</div>}
            </div>

            {isTop && drag && drag.x > 20 && (
              <div className="absolute top-4 left-4 px-2 py-0.5 rounded border-2 border-success text-success font-bold text-sm rotate-[-15deg]">
                KEEP
              </div>
            )}
            {isTop && drag && drag.x < -20 && (
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded border-2 border-danger text-danger font-bold text-sm rotate-[15deg]">
                SKIP
              </div>
            )}
          </div>
        )
      })}

      <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={() => dismiss('left')}
          className="w-10 h-10 rounded-full bg-raised border border-rule text-danger hover:bg-danger/10 transition-colors flex items-center justify-center"
        >
          ✕
        </button>
        <button
          onClick={() => dismiss('right')}
          className="w-10 h-10 rounded-full bg-raised border border-rule text-success hover:bg-success/10 transition-colors flex items-center justify-center"
        >
          ✓
        </button>
      </div>
    </div>
  )
}
