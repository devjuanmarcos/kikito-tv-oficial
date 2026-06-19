'use client'
import React, { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { ParticleFieldProps } from './particle-field.types'

interface Particle { x: number; y: number; vx: number; vy: number; r: number; alpha: number }

export function ParticleField({
  count = 60,
  color = '120,80,255',
  speed = 0.5,
  size = 2,
  width = '100%',
  height = 300,
  className,
  style,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    const particles: Particle[] = []

    function resize() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
    }

    function init() {
      particles.length = 0
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: Math.random() * size + 1,
          alpha: Math.random() * 0.6 + 0.2,
        })
      }
    }

    function draw() {
      const w = canvas!.width, h = canvas!.height
      ctx!.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${color},${p.alpha})`
        ctx!.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(${color},${(1 - dist / 100) * 0.3})`
            ctx!.lineWidth = 0.8
            ctx!.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }

    resize(); init(); draw()
    const ro = new ResizeObserver(() => { resize(); init() })
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [count, color, speed, size])

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ width, height, ...style }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
