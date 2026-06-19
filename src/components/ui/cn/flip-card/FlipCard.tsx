'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { FlipCardProps } from './flip-card.types'

export function FlipCard({
  front,
  back,
  width = 280,
  height = 180,
  direction = 'horizontal',
  trigger = 'hover',
  defaultFlipped = false,
  flipped: controlledFlipped,
  onFlip,
  className,
  style,
}: FlipCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(defaultFlipped)
  const isControlled = controlledFlipped !== undefined
  const flipped = isControlled ? controlledFlipped : internalFlipped

  const toggle = () => {
    const next = !flipped
    if (!isControlled) setInternalFlipped(next)
    onFlip?.(next)
  }

  const hoverProps = trigger === 'hover'
    ? {
        onMouseEnter: () => { if (!isControlled) setInternalFlipped(true); onFlip?.(true) },
        onMouseLeave: () => { if (!isControlled) setInternalFlipped(false); onFlip?.(false) },
      }
    : {}

  return (
    <>
      <style>{`
        .fc-scene { perspective: 1000px; }
        .fc-card {
          width: 100%; height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.4,0,0.2,1);
        }
        .fc-card[data-flipped="true"][data-direction="horizontal"] { transform: rotateY(180deg); }
        .fc-card[data-flipped="true"][data-direction="vertical"]   { transform: rotateX(180deg); }
        .fc-face {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: inherit;
          overflow: hidden;
        }
        .fc-back[data-direction="horizontal"] { transform: rotateY(180deg); }
        .fc-back[data-direction="vertical"]   { transform: rotateX(180deg); }
      `}</style>
      <div
        className={cn('fc-scene', className)}
        style={{ width, height, borderRadius: 16, cursor: trigger === 'click' ? 'pointer' : undefined, ...style }}
        onClick={trigger === 'click' ? toggle : undefined}
        {...hoverProps}
      >
        <div className="fc-card" style={{ borderRadius: 16 }} data-flipped={flipped} data-direction={direction}>
          <div className="fc-face fc-front">{front}</div>
          <div className="fc-face fc-back" data-direction={direction}>{back}</div>
        </div>
      </div>
    </>
  )
}
