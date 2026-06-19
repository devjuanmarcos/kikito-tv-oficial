import React from 'react'
import { cn } from '@/lib/utils'
import type { GradientBorderProps } from './gradient-border.types'

const DEFAULT_COLORS = ['var(--ks-violet)', 'var(--ks-patina)', 'var(--ks-kinpaku)', 'var(--ks-rose)']

export function GradientBorder({
  children,
  colors = DEFAULT_COLORS,
  borderWidth = 2,
  borderRadius = 12,
  speed = 3,
  variant = 'spin',
  className,
  style,
}: GradientBorderProps) {
  const gradient = variant === 'spin'
    ? `conic-gradient(from var(--_angle, 0deg), ${colors.join(', ')})`
    : `linear-gradient(135deg, ${colors.join(', ')})`

  return (
    <>
      <style>{`
        .gb-wrap { position: relative; display: inline-flex; }
        .gb-border {
          position: absolute; inset: calc(-1 * var(--_bw, 2px));
          border-radius: calc(var(--_r, 12px) + var(--_bw, 2px));
          background: var(--_gradient);
          z-index: 0;
        }
        .gb-border[data-variant="spin"] {
          animation: gb-spin var(--_speed, 3s) linear infinite;
        }
        .gb-border[data-variant="pulse"] {
          animation: gb-pulse var(--_speed, 3s) ease-in-out infinite;
        }
        @keyframes gb-spin { to { --_angle: 360deg; } }
        @property --_angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes gb-pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        .gb-content { position: relative; z-index: 1; background: var(--ks-raised); }
      `}</style>
      <div
        className={cn('gb-wrap', className)}
        style={{ borderRadius, ...style }}
      >
        <div
          className="gb-border"
          data-variant={variant}
          style={{
            '--_bw': `${borderWidth}px`,
            '--_r': `${borderRadius}px`,
            '--_gradient': gradient,
            '--_speed': `${speed}s`,
          } as React.CSSProperties}
        />
        <div
          className="gb-content"
          style={{ borderRadius: borderRadius - borderWidth }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
