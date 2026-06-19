'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { FeedbackWidgetProps } from './feedback-widget.types'

const EMOJIS = [
  { label: 'Terrible', icon: '😡' },
  { label: 'Bad',      icon: '😕' },
  { label: 'Okay',     icon: '😐' },
  { label: 'Good',     icon: '😊' },
  { label: 'Great',    icon: '🤩' },
]

export function FeedbackWidget({
  type = 'stars',
  title = 'How are we doing?',
  placeholder = 'Tell us more (optional)…',
  onSubmit,
  className,
  style,
}: FeedbackWidgetProps) {
  const [score, setScore] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (score === null) return
    onSubmit?.(score, comment)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={cn('rounded-[--radius-lg] border border-rule bg-raised p-8 flex flex-col items-center gap-2', className)} style={style}>
        <span className="text-4xl">🎉</span>
        <p className="font-bold text-foreground">Thank you!</p>
        <p className="text-muted text-[0.875rem]">Your feedback means a lot to us.</p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-[--radius-lg] border border-rule bg-raised p-5 flex flex-col gap-4', className)} style={style}>
      <p className="font-semibold text-foreground text-[0.9375rem]">{title}</p>

      {type === 'nps' && (
        <>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => setScore(i)}
                className={cn(
                  'w-8 h-8 rounded-[--radius-sm] border text-[0.8125rem] font-medium transition-colors',
                  score === i
                    ? 'bg-patina text-patina-fg border-transparent'
                    : 'border-rule text-muted hover:border-patina/50 hover:text-foreground'
                )}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[0.6875rem] text-faint">
            <span>Not likely</span>
            <span>Very likely</span>
          </div>
        </>
      )}

      {type === 'stars' && (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setScore(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'text-3xl transition-transform hover:scale-110',
                n <= (hovered ?? score ?? 0) ? 'text-kinpaku' : 'text-faint'
              )}
            >
              {n <= (hovered ?? score ?? 0) ? '★' : '☆'}
            </button>
          ))}
        </div>
      )}

      {type === 'emoji' && (
        <div className="flex gap-2">
          {EMOJIS.map((e, i) => (
            <button
              key={i}
              onClick={() => setScore(i)}
              title={e.label}
              className={cn(
                'text-2xl p-2 rounded-[--radius-sm] border transition-all hover:scale-110',
                score === i
                  ? 'border-patina bg-patina/10'
                  : 'border-transparent hover:border-rule'
              )}
            >
              {e.icon}
            </button>
          ))}
        </div>
      )}

      <textarea
        rows={3}
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-[--radius-sm] border border-rule bg-canvas text-foreground text-[0.875rem] placeholder:text-faint outline-none focus:border-patina/60 resize-none transition-colors"
      />

      <button
        onClick={handleSubmit}
        disabled={score === null}
        className="w-full py-2 rounded-[--radius-sm] bg-patina text-patina-fg font-medium text-[0.875rem] hover:bg-patina/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit feedback
      </button>
    </div>
  )
}
