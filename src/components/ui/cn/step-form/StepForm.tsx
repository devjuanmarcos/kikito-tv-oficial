'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/cn/button'
import type { StepFormProps } from './step-form.types'

export function StepForm({ steps, onComplete, className, style }: StepFormProps) {
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function next() {
    const step = steps[current]
    if (step.validate) {
      const result = step.validate()
      if (result !== true && result !== undefined) {
        setError(typeof result === 'string' ? result : 'Please complete this step.')
        return
      }
    }
    setError('')
    if (current < steps.length - 1) {
      setCurrent(c => c + 1)
    } else {
      setDone(true)
      onComplete?.(steps[current].id)
    }
  }

  function back() {
    setError('')
    setCurrent(c => Math.max(0, c - 1))
  }

  if (done) {
    return (
      <div className={cn('rounded-[--radius-lg] border border-rule bg-raised p-10 flex flex-col items-center gap-3', className)} style={style}>
        <span className="text-heading-01">🎉</span>
        <p className="font-bold text-foreground text-body-title">All done!</p>
        <p className="text-muted text-body-callout">Your form has been submitted successfully.</p>
      </div>
    )
  }

  const stepData = steps[current]

  return (
    <div className={cn('rounded-[--radius-lg] border border-rule bg-raised overflow-hidden', className)} style={style}>
      {/* Step progress header */}
      <div className="px-6 py-4 border-b border-rule bg-canvas flex items-center gap-2">
        {steps.map((step, i) => {
          const state = i < current ? 'done' : i === current ? 'active' : 'pending'
          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-body-caption font-bold transition-all',
                    state === 'done'    && 'bg-success text-success-fg',
                    state === 'active'  && 'bg-patina text-patina-fg',
                    state === 'pending' && 'bg-graphite text-faint'
                  )}
                >
                  {i < current ? '✓' : i + 1}
                </div>
                <span className={cn('text-body-callout font-medium hidden sm:block', state === 'active' ? 'text-foreground' : 'text-faint')}>
                  {step.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="flex-1 h-0.5 min-w-4"
                  style={{ background: i < current ? 'var(--ks-success)' : 'var(--ks-rule)' }}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <h3 className="font-semibold text-foreground text-body-title mb-1">{stepData.title}</h3>
        {stepData.description && (
          <p className="text-muted text-body-callout mb-4">{stepData.description}</p>
        )}
        <div>{stepData.content}</div>
        {error && (
          <p className="mt-3 text-body-callout text-danger">{error}</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-rule flex items-center justify-between gap-3">
        <Button onClick={back} disabled={current === 0} intent="neutral" variant="outline" size="sm">Back</Button>
        <span className="text-body-caption text-faint">{current + 1} / {steps.length}</span>
        <Button onClick={next} intent="primary" variant="solid" size="sm">
          {current === steps.length - 1 ? 'Complete' : 'Next →'}
        </Button>
      </div>
    </div>
  )
}
