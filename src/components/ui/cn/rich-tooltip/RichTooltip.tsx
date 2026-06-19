'use client'
import React, { useState, cloneElement } from 'react'
import { cn } from '@/lib/utils'
import type { RichTooltipProps } from './rich-tooltip.types'

export function RichTooltip({
  title,
  content,
  icon,
  action,
  placement = 'top',
  maxWidth = 240,
  children,
  className,
}: RichTooltipProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <style>{`
        .rt-wrap { position: relative; display: inline-flex; }
        .rt-bubble {
          position: absolute; z-index: 50;
          pointer-events: none; opacity: 0;
          transform: scale(0.95) translateY(4px);
          transition: opacity 0.15s, transform 0.15s;
        }
        .rt-bubble[data-open="true"] {
          opacity: 1; transform: scale(1) translateY(0); pointer-events: auto;
        }
        .rt-bubble[data-placement="top"]    { bottom: calc(100% + 8px); left: 50%; translate: -50% 0; }
        .rt-bubble[data-placement="bottom"] { top: calc(100% + 8px); left: 50%; translate: -50% 0; }
        .rt-bubble[data-placement="left"]   { right: calc(100% + 8px); top: 50%; translate: 0 -50%; }
        .rt-bubble[data-placement="right"]  { left: calc(100% + 8px); top: 50%; translate: 0 -50%; }
      `}</style>
      <span
        className={cn('rt-wrap', className)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {cloneElement(children)}
        <span
          className="rt-bubble bg-raised border border-rule rounded-[--radius] shadow-lg p-3 flex flex-col gap-2"
          data-open={open}
          data-placement={placement}
          style={{ maxWidth }}
          role="tooltip"
        >
          {(title || icon) && (
            <div className="flex items-center gap-2">
              {icon && <span className="text-patina shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>}
              {title && <span className="text-[0.875rem] font-semibold text-foreground leading-snug">{title}</span>}
            </div>
          )}
          <div className="text-[0.8125rem] text-muted leading-relaxed">{content}</div>
          {action && (
            <button
              className="text-[0.8125rem] text-patina font-semibold text-left hover:underline bg-transparent border-none p-0 cursor-pointer font-[inherit]"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          )}
        </span>
      </span>
    </>
  )
}
