'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'
import type { SpotlightProps } from './spotlight.types'

export function Spotlight({
  children,
  color = 'rgba(120,80,255,0.35)',
  size = 300,
  className,
  style,
}: SpotlightProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const root = rootRef.current
    const glow = glowRef.current
    if (!root || !glow) return
    const rect = root.getBoundingClientRect()
    glow.style.left = `${e.clientX - rect.left}px`
    glow.style.top  = `${e.clientY - rect.top}px`
    glow.style.opacity = '1'
  }

  function onMouseLeave() {
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }

  return (
    <div
      ref={rootRef}
      className={cn('relative overflow-hidden', className)}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute opacity-0 transition-opacity duration-200 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
