'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { TypewriterProps } from './typewriter.types'

export function Typewriter({
  texts,
  speed = 60,
  deleteSpeed = 30,
  pauseDuration = 1800,
  loop = true,
  cursor = true,
  cursorChar = '|',
  className,
  style,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [textIdx, setTextIdx] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!texts.length) return
    const current = texts[textIdx] ?? ''

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        frameRef.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed)
      } else {
        frameRef.current = setTimeout(() => setPhase('pausing'), pauseDuration)
      }
    } else if (phase === 'pausing') {
      if (texts.length === 1 && !loop) return
      setPhase('deleting')
    } else {
      if (displayed.length > 0) {
        frameRef.current = setTimeout(() => setDisplayed(d => d.slice(0, -1)), deleteSpeed)
      } else {
        const next = (textIdx + 1) % texts.length
        if (next === 0 && !loop) return
        setTextIdx(next)
        setPhase('typing')
      }
    }

    return () => { if (frameRef.current) clearTimeout(frameRef.current) }
  }, [displayed, phase, textIdx, texts, speed, deleteSpeed, pauseDuration, loop])

  return (
    <>
      <style>{`
        @keyframes tw-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        .tw-cursor { animation: tw-blink 1.1s step-end infinite; }
      `}</style>
      <span className={cn('inline', className)} style={style} aria-label={texts[textIdx]}>
        {displayed}
        {cursor && (
          <span className="tw-cursor inline-block ml-[1px] text-patina" aria-hidden="true">
            {cursorChar}
          </span>
        )}
      </span>
    </>
  )
}
