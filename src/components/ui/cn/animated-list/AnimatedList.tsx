import { Children } from 'react'
import { cn } from '@/lib/utils'
import type { AnimatedListProps } from './animated-list.types'

/* Animation name map — uses keyframe names from globals.css */
const ANIM_MAP: Record<string, string> = {
  up:    'slide-up-ks',
  down:  'slide-down-ks',
  left:  'slide-left-ks',
  right: 'slide-right-ks',
  fade:  'fade-in-ks',
}

export function AnimatedList({
  children,
  staggerMs   = 80,
  animationMs = 400,
  direction   = 'up',
  className,
  style,
}: AnimatedListProps) {
  const items = Children.toArray(children)

  return (
    <div className={cn('flex flex-col', className)} style={style}>
      {items.map((child, i) => (
        <div
          key={i}
          style={{
            animationName:           ANIM_MAP[direction] ?? 'slide-up-ks',
            animationDuration:       `${animationMs}ms`,
            animationDelay:          `${i * staggerMs}ms`,
            animationTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
            animationFillMode:       'both',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
