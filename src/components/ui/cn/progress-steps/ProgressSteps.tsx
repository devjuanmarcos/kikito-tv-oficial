'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export type ProgressStepsOrientation = 'horizontal' | 'vertical'
export type ProgressStepsSize        = 'sm' | 'md' | 'lg'
export type ProgressStepStatus       = 'complete' | 'current' | 'upcoming'

export interface ProgressStep {
  label:        string
  description?: string
  status?:      ProgressStepStatus
}

export interface ProgressStepsProps {
  steps:        ProgressStep[]
  current:      number
  orientation?: ProgressStepsOrientation
  size?:        ProgressStepsSize
  className?:   string
  style?:       React.CSSProperties
}

const SIZE_CIRCLE: Record<ProgressStepsSize, string> = {
  sm: 'w-6 h-6 text-[0.6rem]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
}
const SIZE_LABEL: Record<ProgressStepsSize, string> = {
  sm: 'text-[0.7rem]',
  md: 'text-body-caption',
  lg: 'text-body-callout',
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className="w-3 h-3">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function ProgressSteps({
  steps,
  current,
  orientation = 'horizontal',
  size        = 'md',
  className,
  style,
}: ProgressStepsProps) {
  const isVertical = orientation === 'vertical'

  function resolveStatus(i: number, overrideStatus?: ProgressStepStatus): ProgressStepStatus {
    if (overrideStatus) return overrideStatus
    if (i < current) return 'complete'
    if (i === current) return 'current'
    return 'upcoming'
  }

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
        const status = resolveStatus(i, step.status)
        const isLast = i === steps.length - 1

        return (
          <div
            key={i}
            className={cn(
              'flex',
              isVertical ? 'flex-row gap-3' : 'flex-col items-center flex-1',
            )}
          >
            {/* Circle + connector */}
            <div className={cn(isVertical ? 'flex flex-col items-center' : 'flex items-center w-full')}>
              {/* Circle */}
              <div
                className={cn(
                  'flex items-center justify-center rounded-full flex-shrink-0 font-semibold border-2 transition-[background,border-color] duration-[200ms]',
                  SIZE_CIRCLE[size],
                  status === 'complete' && 'bg-patina border-patina text-patina-fg',
                  status === 'current'  && 'bg-transparent border-patina text-patina',
                  status === 'upcoming' && 'bg-transparent border-rule text-faint',
                )}
              >
                {status === 'complete' ? <CheckIcon /> : <span>{i + 1}</span>}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    'transition-[background] duration-[200ms]',
                    isVertical
                      ? 'w-px h-8 mx-auto'
                      : 'flex-1 h-px mx-2',
                    status === 'complete' ? 'bg-patina' : 'bg-rule',
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div
              className={cn(
                isVertical ? 'pb-6' : 'mt-2 text-center',
              )}
            >
              <p
                className={cn(
                  'font-medium transition-colors duration-[200ms]',
                  SIZE_LABEL[size],
                  status === 'upcoming' ? 'text-faint' : 'text-foreground',
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className={cn('text-faint', size === 'sm' ? 'text-[0.65rem]' : 'text-body-caption')}>
                  {step.description}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
