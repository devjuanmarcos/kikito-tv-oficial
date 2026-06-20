'use client'
import type React from 'react'
import { useState, useRef, useEffect, cloneElement, Children } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export type HoverCardSide  = 'top' | 'bottom' | 'left' | 'right'
export type HoverCardAlign = 'start' | 'center' | 'end'

export interface HoverCardProps {
  content:    React.ReactNode
  side?:      HoverCardSide
  align?:     HoverCardAlign
  openDelay?: number
  closeDelay?: number
  children:   React.ReactElement
  className?: string
  style?:     React.CSSProperties
}

const GAP = 8

function getPos(trigger: DOMRect, card: DOMRect, side: HoverCardSide, align: HoverCardAlign) {
  let top = 0, left = 0
  const { top: tT, bottom: tB, left: tL, right: tR, width: tW, height: tH } = trigger
  const { width: cW, height: cH } = card

  if (side === 'top' || side === 'bottom') {
    top = side === 'top' ? tT - cH - GAP : tB + GAP
    left = align === 'start' ? tL : align === 'end' ? tR - cW : tL + tW / 2 - cW / 2
  } else {
    left = side === 'left' ? tL - cW - GAP : tR + GAP
    top  = align === 'start' ? tT : align === 'end' ? tB - cH : tT + tH / 2 - cH / 2
  }

  const vW = window.innerWidth, vH = window.innerHeight
  return {
    top:  Math.max(8, Math.min(top,  vH - cH - 8)),
    left: Math.max(8, Math.min(left, vW - cW - 8)),
  }
}

export function HoverCard({
  content,
  side       = 'bottom',
  align      = 'center',
  openDelay  = 300,
  closeDelay = 150,
  children,
  className,
  style,
}: HoverCardProps) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos]         = useState({ top: 0, left: 0 })
  const [ready, setReady]     = useState(false)
  const triggerRef = useRef<HTMLElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)
  const openTimer  = useRef<ReturnType<typeof setTimeout>>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(null)

  function scheduleOpen() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    openTimer.current = setTimeout(() => {
      setVisible(true)
      setReady(false)
      requestAnimationFrame(() => {
        if (!triggerRef.current || !cardRef.current) return
        const tRect = triggerRef.current.getBoundingClientRect()
        const cRect = cardRef.current.getBoundingClientRect()
        setPos(getPos(tRect, cRect, side, align))
        setReady(true)
      })
    }, openDelay)
  }

  function scheduleClose() {
    if (openTimer.current) clearTimeout(openTimer.current)
    closeTimer.current = setTimeout(() => setVisible(false), closeDelay)
  }

  useEffect(() => () => {
    if (openTimer.current)  clearTimeout(openTimer.current)
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const trigger = cloneElement(Children.only(children), {
    ref:          triggerRef,
    onMouseEnter: scheduleOpen,
    onMouseLeave: scheduleClose,
    onFocus:      scheduleOpen,
    onBlur:       scheduleClose,
  })

  if (typeof document === 'undefined') return trigger

  return (
    <>
      {trigger}
      {visible && createPortal(
        <div
          ref={cardRef}
          role="tooltip"
          className={cn(
            'fixed z-[1050] min-w-[160px] max-w-[300px] p-3',
            'bg-raised border border-rule rounded-[--radius-md]',
            'shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.35),0_0_0_1px_oklch(0%_0_0/0.06)]',
            'transition-[opacity,transform] duration-[140ms]',
            ready ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]',
          )}
          style={{ top: pos.top, left: pos.left }}
          onMouseEnter={scheduleOpen}
          onMouseLeave={scheduleClose}
        >
          {content}
        </div>,
        document.body,
      )}
    </>
  )
}
