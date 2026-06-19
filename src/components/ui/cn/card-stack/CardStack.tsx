import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { CardStackProps } from './card-stack.types'

export function CardStack({
  cards,
  offset      = 10,
  scaleFactor = 0.06,
  autoPlay    = false,
  interval    = 3000,
  className,
  style,
}: CardStackProps) {
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!autoPlay) return
    timerRef.current = setTimeout(() => setActive(a => (a + 1) % cards.length), interval)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active, autoPlay, interval, cards.length])

  return (
    <div className={cn('relative w-full', className)} style={style}>
      <div
        className="relative w-full cursor-pointer"
        onClick={() => setActive(a => (a + 1) % cards.length)}
      >
        {cards.map((card, i) => {
          const idx   = (i - active + cards.length) % cards.length
          const isTop = idx === 0
          return (
            <div
              key={card.id}
              style={{
                position:      isTop ? 'relative' : 'absolute',
                top:           isTop ? undefined : 0,
                left:          isTop ? undefined : 0,
                width:         '100%',
                transformOrigin: 'top center',
                transform:     `translateY(${idx * offset}px) scale(${1 - idx * scaleFactor})`,
                opacity:       Math.max(0, 1 - idx * 0.25),
                zIndex:        cards.length - idx,
                pointerEvents: isTop ? 'auto' : 'none',
                transition:    'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s',
              }}
            >
              {card.content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
