'use client'
import type React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export type TourPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TourStep {
  target:     string
  title:      string
  content:    string
  placement?: TourPlacement
}

export interface OnboardingTourProps {
  steps:       TourStep[]
  isOpen:      boolean
  onClose:     () => void
  onComplete?: () => void
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-4 h-4">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
  </svg>
)

function getTooltipPos(rect: DOMRect, placement: TourPlacement, tw: number, th: number) {
  const gap = 12
  const vW = window.innerWidth
  const vH = window.innerHeight
  let top = 0, left = 0

  if (placement === 'bottom') { top = rect.bottom + gap; left = rect.left + rect.width / 2 - tw / 2 }
  if (placement === 'top')    { top = rect.top - th - gap; left = rect.left + rect.width / 2 - tw / 2 }
  if (placement === 'right')  { top = rect.top + rect.height / 2 - th / 2; left = rect.right + gap }
  if (placement === 'left')   { top = rect.top + rect.height / 2 - th / 2; left = rect.left - tw - gap }

  return {
    top:  Math.max(8, Math.min(top, vH - th - 8)),
    left: Math.max(8, Math.min(left, vW - tw - 8)),
  }
}

export function OnboardingTour({
  steps,
  isOpen,
  onClose,
  onComplete,
}: OnboardingTourProps) {
  const [index, setIndex]     = useState(0)
  const [mounted, setMounted] = useState(false)
  const [rect, setRect]       = useState<DOMRect | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const resolveTarget = useCallback(() => {
    if (!isOpen) return
    const step = steps[index]
    const el   = document.querySelector(step.target)
    if (el) setRect(el.getBoundingClientRect())
  }, [isOpen, index, steps])

  useEffect(() => {
    resolveTarget()
    window.addEventListener('resize', resolveTarget)
    window.addEventListener('scroll', resolveTarget)
    return () => {
      window.removeEventListener('resize', resolveTarget)
      window.removeEventListener('scroll', resolveTarget)
    }
  }, [resolveTarget])

  useEffect(() => {
    if (!isOpen) { setIndex(0) }
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  function prev() { setIndex(i => Math.max(0, i - 1)) }
  function next() {
    if (index < steps.length - 1) setIndex(i => i + 1)
    else { onComplete?.(); onClose() }
  }

  if (!mounted || !isOpen) return null

  const step = steps[index]
  const tw = 280
  const th = 120
  const pos = rect ? getTooltipPos(rect, step.placement ?? 'bottom', tw, th) : { top: 100, left: 100 }

  return createPortal(
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[990] bg-[oklch(0%_0_0/0.5)]" />

      {/* Highlight ring */}
      {rect && (
        <div
          style={{
            position: 'fixed',
            top:    rect.top - 4,
            left:   rect.left - 4,
            width:  rect.width + 8,
            height: rect.height + 8,
            zIndex: 992,
          }}
          className="rounded-xl ring-2 ring-patina ring-offset-2 ring-offset-transparent pointer-events-none"
        />
      )}

      {/* Tooltip */}
      <div
        style={{ top: pos.top, left: pos.left, width: tw, zIndex: 993 }}
        className="fixed rounded-xl border border-rule bg-raised shadow-[0_16px_48px_-8px_oklch(0%_0_0/0.5)] p-4"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-body-callout font-semibold text-foreground">{step.title}</h3>
          <button type="button" aria-label="Close tour" onClick={onClose} className="flex-shrink-0 text-faint hover:text-foreground">
            <XIcon />
          </button>
        </div>
        <p className="text-body-caption text-faint mb-3">{step.content}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-body-caption text-faint">{index + 1} / {steps.length}</span>
          <div className="flex items-center gap-1.5">
            {index > 0 && (
              <button type="button" onClick={prev} className="px-2.5 py-1 rounded-lg text-body-caption border border-rule text-faint hover:text-foreground hover:bg-graphite transition-colors">
                Back
              </button>
            )}
            <button type="button" onClick={next} className="px-2.5 py-1 rounded-lg text-body-caption bg-patina text-patina-fg hover:brightness-110 transition-[filter]">
              {index === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
