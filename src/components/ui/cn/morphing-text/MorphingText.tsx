'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { MorphingTextProps } from './morphing-text.types'

export function MorphingText({
  words,
  interval = 2500,
  className,
  style,
}: MorphingTextProps) {
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (words.length < 2) return
    const timer = setTimeout(() => {
      setLeaving(true)
      setTimeout(() => {
        setIndex(i => (i + 1) % words.length)
        setLeaving(false)
      }, 300)
    }, interval)
    return () => clearTimeout(timer)
  }, [index, words, interval])

  return (
    <>
      <style>{`
        @keyframes mt-in {
          from { opacity: 0; transform: translateY(8px) scale(0.97); filter: blur(2px); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    filter: blur(0);  }
        }
        @keyframes mt-out {
          from { opacity: 1; transform: translateY(0)   scale(1);    filter: blur(0);  }
          to   { opacity: 0; transform: translateY(-8px) scale(0.97); filter: blur(2px); }
        }
        .mt-enter { animation: mt-in 0.3s ease forwards; }
        .mt-leave { animation: mt-out 0.3s ease forwards; }
      `}</style>
      <span
        key={index}
        className={cn('inline-block', leaving ? 'mt-leave' : 'mt-enter', className)}
        style={style}
        aria-live="polite"
      >
        {words[index]}
      </span>
    </>
  )
}
