import { cn } from '@/lib/utils'
import type { MarqueeTextProps } from './marquee-text.types'

const SIZE_MAP = {
  sm: '0.875rem',
  md: '1.25rem',
  lg: '2rem',
  xl: '3rem',
}

export function MarqueeText({
  text,
  speed = 30,
  size = 'md',
  repeat = 8,
  className,
  style,
}: MarqueeTextProps) {
  const duration = `${(text.length * repeat) / speed}s`
  const items = Array(repeat * 2).fill(text)

  return (
    <>
      <style>{`
        .mq-root { overflow: hidden; white-space: nowrap; width: 100%; }
        .mq-track {
          display: inline-flex;
          gap: 2em;
          animation: mq-scroll linear infinite;
          will-change: transform;
        }
        @keyframes mq-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .mq-item { display: inline-block; padding-right: 2em; }
      `}</style>
      <div
        className={cn('mq-root', className)}
        style={{ fontSize: SIZE_MAP[size], ...style }}
      >
        <div className="mq-track" style={{ animationDuration: duration }}>
          {items.map((t, i) => (
            <span key={i} className="mq-item">{t}</span>
          ))}
        </div>
      </div>
    </>
  )
}
