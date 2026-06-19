'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import type { StepperProps, StepDef, StepStatus } from './stepper.types'

const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
const ErrorIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

function resolveStatus(step: StepDef, idx: number, active: number): StepStatus {
  if (step.status) return step.status
  if (idx < active) return 'completed'
  if (idx === active) return 'active'
  return 'upcoming'
}

const CIRCLE_STATUS_CLS: Record<StepStatus, string> = {
  upcoming:  'border-rule bg-base text-faint',
  active:    'border-patina bg-patina-soft text-patina',
  completed: 'border-patina bg-patina text-patina-fg',
  error:     'border-danger bg-danger-soft text-danger',
}

const LABEL_STATUS_CLS: Record<StepStatus, string> = {
  upcoming:  'text-faint',
  active:    'text-patina',
  completed: 'text-foreground',
  error:     'text-danger',
}

function CircleContent({ status, num }: { status: StepStatus; num: number }) {
  if (status === 'completed') return <span className="[&>svg]:w-[14px] [&>svg]:h-[14px]"><CheckIcon /></span>
  if (status === 'error')     return <span className="[&>svg]:w-[14px] [&>svg]:h-[14px]"><ErrorIcon /></span>
  return <>{num + 1}</>
}

export function Stepper({
  steps,
  activeStep,
  defaultStep  = 0,
  onStepChange,
  orientation  = 'horizontal',
  clickable    = false,
  className,
  children,
}: StepperProps) {
  const isControlled = activeStep !== undefined
  const [internal, setInternal] = useState(defaultStep)
  const current = isControlled ? activeStep! : internal

  function goTo(idx: number) {
    if (!isControlled) setInternal(idx)
    onStepChange?.(idx)
  }

  if (orientation === 'vertical') {
    return (
      <div className={cn('flex flex-col w-full', className)}>
        {steps.map((step, idx) => {
          const status = resolveStatus(step, idx, current)
          const isLast = idx === steps.length - 1
          return (
            <div key={idx} className={cn('flex gap-4 relative', !isLast && 'pb-6')}>
              {!isLast && (
                <div className={cn('absolute left-[1.0625rem] top-9 bottom-0 w-[2px] transition-[background] duration-[300ms]', status === 'completed' ? 'bg-patina' : 'bg-rule')} />
              )}
              <div
                className={cn('w-9 h-9 rounded-full border-2 flex items-center justify-center text-[0.8125rem] font-bold shrink-0 relative z-[1] transition-[border-color,background,color] duration-[200ms]', CIRCLE_STATUS_CLS[status])}
                onClick={() => clickable && status === 'completed' && goTo(idx)}
                style={clickable && status === 'completed' ? { cursor: 'pointer' } : undefined}
              >
                <CircleContent status={status} num={idx} />
              </div>
              <div className="flex-1 pt-1">
                <p className={cn('text-[0.875rem] font-semibold transition-[color] duration-[200ms] m-0', LABEL_STATUS_CLS[status])}>
                  {step.label}{step.optional && <span className="font-normal opacity-60"> (optional)</span>}
                </p>
                {step.description && <p className="text-[0.8125rem] text-faint mt-[2px] m-0">{step.description}</p>}
                {status === 'active' && step.content && <div className="mt-3">{step.content}</div>}
              </div>
            </div>
          )
        })}
        {children && <div className="mt-4">{children}</div>}
      </div>
    )
  }

  const activeStepDef = steps[current]

  return (
    <div className={cn('flex flex-col w-full', className)}>
      <div className="flex items-start gap-0 mb-8">
        {steps.map((step, idx) => {
          const status = resolveStatus(step, idx, current)
          const isLast = idx === steps.length - 1
          return (
            <div
              key={idx}
              className={cn(
                'flex flex-col items-center flex-1 relative',
                !isLast && "after:content-[''] after:absolute after:top-[1.125rem] after:left-[calc(50%+1.125rem)] after:right-[calc(-50%+1.125rem)] after:h-[2px] after:transition-[background] after:duration-[300ms]",
                !isLast && (status === 'completed' ? 'after:bg-patina' : 'after:bg-rule')
              )}
            >
              <div
                className={cn('w-9 h-9 rounded-full border-2 flex items-center justify-center text-[0.8125rem] font-bold shrink-0 relative z-[1] transition-[border-color,background,color] duration-[200ms]', CIRCLE_STATUS_CLS[status])}
                onClick={() => clickable && status === 'completed' && goTo(idx)}
                style={clickable && status === 'completed' ? { cursor: 'pointer' } : undefined}
              >
                <CircleContent status={status} num={idx} />
              </div>
              <span className={cn('text-[0.75rem] font-semibold mt-[0.4rem] text-center transition-[color] duration-[200ms]', LABEL_STATUS_CLS[status])}>
                {step.label}{step.optional && <span className="font-normal opacity-60"> *</span>}
              </span>
              {step.description && (
                <span className="text-[0.6875rem] text-faint text-center mt-0.5">{step.description}</span>
              )}
            </div>
          )
        })}
      </div>
      {activeStepDef?.content && <div className="w-full">{activeStepDef.content}</div>}
      {children}
    </div>
  )
}

export function useStepper(totalSteps: number, initial = 0) {
  const [step, setStep] = useState(initial)
  return {
    step,
    isFirst: step === 0,
    isLast:  step === totalSteps - 1,
    next:  () => setStep(s => Math.min(s + 1, totalSteps - 1)),
    prev:  () => setStep(s => Math.max(s - 1, 0)),
    goTo:  setStep,
    reset: () => setStep(0),
  }
}
