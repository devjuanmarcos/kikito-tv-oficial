'use client'
import type React from 'react'
import { useState, useRef, cloneElement, useEffect, Children } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export type TooltipPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'right'

export interface TooltipProps {
  content:    React.ReactNode
  placement?: TooltipPlacement
  delay?:     number
  disabled?:  boolean
  children:   React.ReactElement
}

function getPos(trigger: DOMRect, tip: DOMRect, placement: TooltipPlacement, gap = 8) {
  let top = 0, left = 0
  const { top: tT, bottom: tB, left: tL, right: tR, width: tW, height: tH } = trigger
  const { width: pW, height: pH } = tip

  switch (placement) {
    case 'top':          top = tT - pH - gap;     left = tL + tW / 2 - pW / 2; break
    case 'top-start':    top = tT - pH - gap;     left = tL; break
    case 'top-end':      top = tT - pH - gap;     left = tR - pW; break
    case 'bottom':       top = tB + gap;           left = tL + tW / 2 - pW / 2; break
    case 'bottom-start': top = tB + gap;           left = tL; break
    case 'bottom-end':   top = tB + gap;           left = tR - pW; break
    case 'left':         top = tT + tH / 2 - pH / 2; left = tL - pW - gap; break
    case 'right':        top = tT + tH / 2 - pH / 2; left = tR + gap; break
  }

  // keep in viewport
  const vW = window.innerWidth, vH = window.innerHeight
  left = Math.max(8, Math.min(left, vW - pW - 8))
  top  = Math.max(8, Math.min(top,  vH - pH - 8))

  return { top, left }
}

export function Tooltip({
  content,
  placement = 'top',
  delay     = 300,
  disabled  = false,
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos]         = useState({ top: 0, left: 0 })
  const triggerRef = useRef<Element>(null)
  const tipRef     = useRef<HTMLDivElement>(null)
  const timer      = useRef<ReturnType<typeof setTimeout>>(null)

  function show() {
    if (disabled) return
    timer.current = setTimeout(() => {
      setVisible(true)
      requestAnimationFrame(() => {
        if (!triggerRef.current || !tipRef.current) return
        const tRect = triggerRef.current.getBoundingClientRect()
        const pRect = tipRef.current.getBoundingClientRect()
        setPos(getPos(tRect, pRect, placement))
      })
    }, delay)
  }

  function hide() {
    if (timer.current) clearTimeout(timer.current)
    setVisible(false)
  }

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const trigger = cloneElement(Children.only(children), {
    ref: triggerRef,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus:      show,
    onBlur:       hide,
  })

  if (typeof document === 'undefined') return trigger

  return (
    <>
      {trigger}
      {createPortal(
        <div
          ref={tipRef}
          role="tooltip"
          className={cn(
            'fixed z-[2000] pointer-events-none',
            'max-w-[260px] px-2.5 py-1.5 text-body-caption',
            'bg-foreground text-base rounded-[5px] shadow-[0_4px_16px_-4px_oklch(0%_0_0/0.5)]',
            'transition-[opacity,transform] duration-[140ms]',
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.95]',
          )}
          style={{ top: pos.top, left: pos.left }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  )
}
