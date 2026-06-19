import { cn } from '@/lib/utils'
import type { MarqueeTextProps } from './marquee-text.types'

const SIZE_CLASSES = {
  sm: 'text-body-callout',
  md: 'text-body-title',
  lg: 'text-heading-03',
  xl: 'text-heading-02',
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
        className={cn('mq-root', SIZE_CLASSES[size], className)}
        style={style}
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
