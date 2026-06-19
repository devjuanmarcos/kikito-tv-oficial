'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'
import type { TiltCardProps } from './tilt-card.types'

export function TiltCard({
  children,
  maxTilt = 15,
  scale = 1.04,
  perspective = 800,
  glare = true,
  className,
  style,
}: TiltCardProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    const rotX = y * -maxTilt * 2
    const rotY = x * maxTilt * 2
    if (innerRef.current) {
      innerRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`
    }
    if (glareRef.current) {
      glareRef.current.style.setProperty('--_gx', `${(x + 0.5) * 100}%`)
      glareRef.current.style.setProperty('--_gy', `${(y + 0.5) * 100}%`)
      glareRef.current.style.opacity = '1'
    }
  }

  function handleMouseLeave() {
    if (innerRef.current) innerRef.current.style.transform = 'rotateX(0) rotateY(0) scale(1)'
    if (glareRef.current) glareRef.current.style.opacity = '0'
  }

  return (
    <div
      className={cn('inline-block cursor-pointer', className)}
      style={{ perspective: `${perspective}px`, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={innerRef}
        className="relative [transform-style:preserve-3d] transition-[transform] duration-100 ease-out rounded-[inherit] overflow-hidden"
      >
        {children}
        {glare && (
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 transition-opacity duration-200"
            style={{
              background: 'radial-gradient(circle at var(--_gx,50%) var(--_gy,50%), color-mix(in srgb, white 18%, transparent) 0%, transparent 65%)',
            }}
          />
        )}
      </div>
    </div>
  )
}
