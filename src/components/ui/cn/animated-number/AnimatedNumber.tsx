'use client'

import { useEffect, useRef, useState } from 'react'
import type { AnimatedNumberProps } from './animated-number.types'

export function AnimatedNumber({
  value,
  duration = 800,
  format = v => Math.round(v).toLocaleString(),
  className,
  style,
}: AnimatedNumberProps) {
  const [displayed, setDisplayed] = useState(value)
  const startRef = useRef(value)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const prevValueRef = useRef(value)

  useEffect(() => {
    if (value === prevValueRef.current) return
    const from = prevValueRef.current
    prevValueRef.current = value

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    startRef.current = from
    startTimeRef.current = null

    const animate = (ts: number) => {
      if (!startTimeRef.current) startTimeRef.current = ts
      const elapsed = ts - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setDisplayed(from + (value - from) * ease)
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value, duration])

  return (
    <span className={className} style={style}>
      {format(displayed)}
    </span>
  )
}
