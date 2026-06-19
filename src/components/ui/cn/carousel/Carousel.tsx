import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { CarouselProps } from './carousel.types'

const ChevronLeft  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={16} height={16}><polyline points="15 18 9 12 15 6"/></svg>
const ChevronRight = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={16} height={16}><polyline points="9 18 15 12 9 6"/></svg>

export function Carousel({
  items,
  autoPlay         = false,
  autoPlayInterval = 3000,
  loop             = true,
  showDots         = true,
  showArrows       = true,
  orientation      = 'horizontal',
  className,
  style,
}: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const n = items.length

  const go = useCallback((idx: number) => {
    if (loop) {
      setCurrent(((idx % n) + n) % n)
    } else {
      setCurrent(Math.max(0, Math.min(idx, n - 1)))
    }
  }, [loop, n])

  const next = useCallback(() => go(current + 1), [go, current])
  const prev = useCallback(() => go(current - 1), [go, current])

  useEffect(() => {
    if (!autoPlay) return
    timerRef.current = setTimeout(next, autoPlayInterval)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [autoPlay, autoPlayInterval, next])

  const canPrev = loop || current > 0
  const canNext = loop || current < n - 1
  const offset  = orientation === 'horizontal'
    ? `translateX(-${current * 100}%)`
    : `translateY(-${current * 100}%)`

  return (
    <div className={cn('relative w-full overflow-hidden', className)} style={style}>
      <div
        className={cn('flex transition-[transform] duration-[350ms] [transition-timing-function:cubic-bezier(0.25,0.1,0.25,1)] will-change-transform', orientation === 'vertical' && 'flex-col')}
        style={{ transform: offset }}
      >
        {items.map(item => (
          <div key={item.id} className="flex-[0_0_100%] w-full">{item.content}</div>
        ))}
      </div>

      {showArrows && n > 1 && (
        <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-3 pointer-events-none box-border">
          <button
            className="w-9 h-9 rounded-full border border-rule bg-float text-foreground flex items-center justify-center cursor-pointer pointer-events-auto transition-[background,transform] duration-[150ms] backdrop-blur-[8px] hover:bg-raised hover:scale-[1.05] disabled:opacity-25 disabled:cursor-default"
            onClick={prev}
            disabled={!canPrev}
            aria-label="Previous"
          >
            <ChevronLeft />
          </button>
          <button
            className="w-9 h-9 rounded-full border border-rule bg-float text-foreground flex items-center justify-center cursor-pointer pointer-events-auto transition-[background,transform] duration-[150ms] backdrop-blur-[8px] hover:bg-raised hover:scale-[1.05] disabled:opacity-25 disabled:cursor-default"
            onClick={next}
            disabled={!canNext}
            aria-label="Next"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {showDots && n > 1 && (
        <div className="flex justify-center gap-[6px] pt-3">
          {items.map((_, i) => (
            <button
              key={i}
              className={cn(
                'h-[6px] rounded-full border-none bg-rule cursor-pointer p-0 transition-[background,width] duration-200',
                i === current ? 'bg-patina w-[18px] rounded-pill' : 'w-[6px]',
              )}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
