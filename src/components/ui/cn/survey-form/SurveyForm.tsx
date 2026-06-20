'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/cn/button'
import type { SurveyFormProps } from './survey-form.types'

export function SurveyForm({
  title,
  description,
  questions,
  onSubmit,
  submitLabel = 'Enviar respostas',
  className,
  style,
}: SurveyFormProps) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({})

  const set = (id: string, val: unknown) => setAnswers(a => ({ ...a, [id]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(answers)
  }

  return (
    <form
      className={cn('bg-raised border border-rule rounded-[--radius-lg] p-8', className)}
      style={style}
      onSubmit={handleSubmit}
    >
      {(title || description) && (
        <div className="mb-7">
          {title && <div className="text-heading-05 font-bold text-foreground mb-[6px]">{title}</div>}
          {description && <div className="text-body-callout text-muted leading-normal">{description}</div>}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {questions.map(q => (
          <div key={q.id} className="flex flex-col gap-2">
            <label className="text-body-callout font-semibold text-foreground">
              {q.label}
              {q.required && <span className="text-danger ml-[2px]">*</span>}
            </label>

            {q.type === 'text' && (
              <input
                className="bg-sunken border border-rule rounded-[--radius-md] px-3 py-[9px] text-foreground text-body-callout outline-none transition-colors duration-150 focus:border-patina placeholder:text-faint font-[inherit]"
                placeholder={q.placeholder}
                required={q.required}
                value={String(answers[q.id] ?? '')}
                onChange={e => set(q.id, e.target.value)}
              />
            )}

            {q.type === 'textarea' && (
              <textarea
                className="bg-sunken border border-rule rounded-[--radius-md] px-3 py-[9px] text-foreground text-body-callout outline-none transition-colors duration-150 focus:border-patina placeholder:text-faint font-[inherit] resize-y min-h-[100px]"
                placeholder={q.placeholder}
                required={q.required}
                value={String(answers[q.id] ?? '')}
                onChange={e => set(q.id, e.target.value)}
              />
            )}

            {q.type === 'radio' && (
              <div className="flex flex-col gap-2">
                {(q.options ?? []).map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer text-body-callout text-foreground">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      required={q.required}
                      checked={answers[q.id] === opt}
                      onChange={() => set(q.id, opt)}
                      className="accent-patina"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === 'checkbox' && (
              <div className="flex flex-col gap-2">
                {(q.options ?? []).map(opt => {
                  const checked = (answers[q.id] as string[] ?? []).includes(opt)
                  return (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer text-body-callout text-foreground">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const cur = (answers[q.id] as string[] ?? [])
                          set(q.id, checked ? cur.filter(x => x !== opt) : [...cur, opt])
                        }}
                        className="accent-patina"
                      />
                      {opt}
                    </label>
                  )
                })}
              </div>
            )}

            {q.type === 'scale' && (
              <div className="flex gap-[6px] flex-wrap">
                {Array.from({ length: (q.max ?? 10) - (q.min ?? 1) + 1 }, (_, i) => (q.min ?? 1) + i).map(n => (
                  <button
                    key={n}
                    type="button"
                    className={cn(
                      'w-10 h-10 border border-rule rounded-[--radius-sm] bg-raised text-foreground text-body-callout cursor-pointer transition-all duration-[120ms] hover:border-patina',
                      answers[q.id] === n && 'bg-patina border-patina text-patina-fg',
                    )}
                    onClick={() => set(q.id, n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}

            {q.type === 'rating' && (
              <div className="flex gap-1">
                {Array.from({ length: q.max ?? 5 }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    type="button"
                    className={cn(
                      'text-heading-05 cursor-pointer bg-transparent border-0 p-0 transition-colors duration-100',
                      (answers[q.id] as number ?? 0) >= n ? 'text-kinpaku' : 'text-faint',
                    )}
                    onClick={() => set(q.id, n)}
                  >
                    {(answers[q.id] as number ?? 0) >= n ? '★' : '☆'}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-7">
        <Button type="submit" intent="primary" variant="solid">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
