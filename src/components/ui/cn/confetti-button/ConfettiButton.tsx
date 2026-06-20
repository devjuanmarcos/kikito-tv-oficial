'use client'

import { useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/cn/button'
import type { ButtonIntent, ButtonSize } from '@/components/ui/cn/button'
import type { ConfettiButtonProps } from './confetti-button.types'

// Canvas 2D fillStyle requires raw hex strings — CSS vars not supported in canvas context
const COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#1dd1a1']

export function ConfettiButton({
  children,
  onClick,
  particleCount = 60,
  spread = 120,
  intent = 'primary',
  size = 'md',
  disabled = false,
  className,
  style,
}: ConfettiButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  const fire = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const W = 200, H = 200
    canvas.width = W
    canvas.height = H

    const particles = Array.from({ length: particleCount }, () => ({
      x: W / 2, y: H / 2,
      vx: (Math.random() - 0.5) * spread * 0.06,
      vy: -(Math.random() * spread * 0.04 + 2),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 7 + 3,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
      life: 1,
      decay: Math.random() * 0.015 + 0.01,
    }))

    cancelAnimationFrame(animRef.current)

    function draw() {
      const ctx = canvas!.getContext('2d')!
      ctx.clearRect(0, 0, W, H)
      let alive = false
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.15
        p.rot += p.rotV; p.life -= p.decay
        if (p.life <= 0) continue
        alive = true
        ctx.save()
        ctx.globalAlpha = Math.min(p.life, 1)
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5)
        ctx.restore()
      }
      if (alive) animRef.current = requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, W, H)
    }
    draw()
  }, [particleCount, spread])

  const handleClick = () => { fire(); onClick?.() }

  return (
    <span className={cn('relative inline-flex', className)} style={style}>
      <Button
        intent={intent as ButtonIntent}
        variant="solid"
        size={size as ButtonSize}
        disabled={disabled}
        onClick={handleClick}
      >
        {children}
      </Button>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute -top-[100px] -left-[75px] z-50"
        width={200}
        height={200}
        style={{ mixBlendMode: 'normal' }}
      />
    </span>
  )
}
