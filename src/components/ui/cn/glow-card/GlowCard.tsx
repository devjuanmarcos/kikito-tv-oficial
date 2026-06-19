'use client'

import { useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { GlowCardProps } from './glow-card.types'

export function GlowCard({
  children,
  glowColor = 'var(--ks-patina)',
  glowSize = 400,
  glowOpacity = 0.14,
  radius = 16,
  padding = 20,
  className,
  style,
}: GlowCardProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = rootRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--_x', `${x}%`)
    el.style.setProperty('--_y', `${y}%`)
  }, [])

  return (
    <>
      <style>{`
        .gc-root {
          position: relative;
          border-radius: var(--_r, 16px);
          border: 1px solid var(--ks-rule);
          background: var(--ks-raised);
          overflow: hidden;
          isolation: isolate;
        }
        .gc-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle var(--_glow-size, 400px) at var(--_x, 50%) var(--_y, 50%),
            var(--_glow-color) 0%,
            transparent 70%
          );
          opacity: var(--_glow-opacity, 0.14);
          pointer-events: none;
          z-index: 0;
        }
        .gc-content { position: relative; z-index: 1; }
      `}</style>
      <div
        ref={rootRef}
        className={cn('gc-root', className)}
        onMouseMove={onMouseMove}
        style={{
          '--_r': `${radius}px`,
          '--_glow-color': glowColor,
          '--_glow-size': `${glowSize}px`,
          '--_glow-opacity': glowOpacity,
          ...style,
        } as React.CSSProperties}
      >
        <div className="gc-content" style={{ padding }}>{children}</div>
      </div>
    </>
  )
}
