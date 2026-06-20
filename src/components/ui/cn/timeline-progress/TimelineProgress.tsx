'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export type TimelineStepStatus = 'completed' | 'current' | 'upcoming' | 'error'
export type TimelineOrientation = 'horizontal' | 'vertical'

export interface TimelineProgressStep {
  id:           string
  label:        string
  description?: string
  status:       TimelineStepStatus
  icon?:        React.ReactNode
}

export interface TimelineProgressProps {
  steps:        TimelineProgressStep[]
  orientation?: TimelineOrientation
  className?:   string
  style?:       React.CSSProperties
}

const STATUS_CIRCLE: Record<TimelineStepStatus, string> = {
  completed: 'bg-success border-success text-success-fg',
  current:   'bg-transparent border-patina text-patina ring-4 ring-patina/20',
  upcoming:  'bg-transparent border-rule text-faint',
  error:     'bg-danger border-danger text-danger-fg',
}
const STATUS_LINE: Record<TimelineStepStatus, string> = {
  completed: 'bg-success',
  current:   'bg-rule',
  upcoming:  'bg-rule',
  error:     'bg-danger',
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className="w-3 h-3">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className="w-3 h-3">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
  </svg>
)

export function TimelineProgress({
  steps,
  orientation = 'horizontal',
  className,
  style,
}: TimelineProgressProps) {
  const isVertical = orientation === 'vertical'

  return (
    <div
      style={style}
      className={cn(
        'flex',
        isVertical ? 'flex-col gap-0' : 'items-start',
        className,
      )}
    >
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <div
            key={step.id}
            className={cn(
              'flex',
              isVertical ? 'flex-row gap-3' : 'flex-col items-center flex-1',
            )}
          >
            {/* Node + connector */}
            <div className={cn(isVertical ? 'flex flex-col items-center' : 'flex items-center w-full')}>
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 transition-all duration-[200ms] font-semibold text-xs',
                  STATUS_CIRCLE[step.status],
                )}
              >
                {step.icon && step.status === 'upcoming' ? (
                  <span className="text-sm leading-none">{step.icon}</span>
                ) : step.status === 'completed' ? (
                  <CheckIcon />
                ) : step.status === 'error' ? (
                  <XIcon />
                ) : step.icon ? (
                  <span className="text-sm leading-none">{step.icon}</span>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'transition-[background] duration-[200ms]',
                    isVertical ? 'w-px h-8 mx-auto' : 'flex-1 h-px mx-2',
                    STATUS_LINE[step.status],
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className={cn(isVertical ? 'pb-6 pt-1.5' : 'mt-2 text-center')}>
              <p
                className={cn(
                  'text-body-callout font-medium',
                  step.status === 'upcoming' ? 'text-faint' : 'text-foreground',
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-body-caption text-faint">{step.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
