import { cn } from '@/lib/utils'
import type { TextGradientAs, TextGradientProps } from './text-gradient.types'

export function TextGradient({
  children,
  from = 'var(--ks-violet)',
  to = 'var(--ks-rose)',
  via,
  direction = '90deg',
  animate = false,
  as: Tag = 'span' as TextGradientAs,
  className,
  style,
}: TextGradientProps) {
  const stops = via
    ? `${from}, ${via}, ${to}${animate ? ', ' + from : ''}`
    : `${from}, ${to}${animate ? ', ' + from : ''}`
  const gradient = `linear-gradient(${direction}, ${stops})`

  return (
    <>
      {animate && (
        <style>{`
          @keyframes gradient-flow {
            0%   { background-position: 0% center; }
            100% { background-position: 200% center; }
          }
        `}</style>
      )}
      <Tag
        className={cn('inline', className)}
        style={{
          background: gradient,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          ...(animate && {
            backgroundSize: '200% auto',
            animation: 'gradient-flow 3s linear infinite',
          }),
          ...style,
        } as React.CSSProperties}
      >
        {children}
      </Tag>
    </>
  )
}
