import React from 'react'
import { cn } from '@/lib/utils'
import type { ContextCardProps } from './context-card.types'

export function ContextCard({
  trigger,
  children,
  placement = 'top',
  width = 280,
  className,
  style,
}: ContextCardProps) {
  return (
    <>
      <style>{`
        .cc-root { position: relative; display: inline-block; }
        .cc-popup {
          position: absolute; z-index: 50;
          pointer-events: none; opacity: 0;
          transform: scale(0.95);
          transition: opacity 0.15s, transform 0.15s;
        }
        .cc-root:hover .cc-popup, .cc-root:focus-within .cc-popup {
          opacity: 1; transform: scale(1); pointer-events: auto;
        }
        .cc-popup[data-placement="top"]    { bottom: calc(100% + 8px); left: 50%; translate: -50% 0; }
        .cc-popup[data-placement="bottom"] { top: calc(100% + 8px); left: 50%; translate: -50% 0; }
        .cc-popup[data-placement="left"]   { right: calc(100% + 8px); top: 50%; translate: 0 -50%; }
        .cc-popup[data-placement="right"]  { left: calc(100% + 8px); top: 50%; translate: 0 -50%; }
      `}</style>
      <div className={cn('cc-root', className)} style={style}>
        {trigger}
        <div
          className="cc-popup bg-raised border border-rule rounded-[--radius] shadow-lg"
          data-placement={placement}
          style={{ width }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
