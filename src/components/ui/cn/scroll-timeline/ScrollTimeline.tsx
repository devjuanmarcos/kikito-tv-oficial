import { cn } from '@/lib/utils'
import type { ScrollTimelineProps } from './scroll-timeline.types'

const INTENT_DOT: Record<string, string> = {
  primary:    'border-patina text-patina',
  secondary:  'border-kinpaku text-kinpaku',
  tertiary:   'border-violet text-violet',
  quaternary: 'border-rose text-rose',
  success:    'border-success text-success',
  warning:    'border-warning text-warning',
  danger:     'border-danger text-danger',
  info:       'border-info text-info',
}

const LINE_CLS: Record<string, string> = {
  alternating: 'before:left-1/2 before:-translate-x-1/2',
  left:        'before:left-5 before:translate-x-0',
  right:       'before:right-5 before:left-auto before:translate-x-0',
}

export function ScrollTimeline({
  events,
  orientation = 'alternating',
  className,
  style,
}: ScrollTimelineProps) {
  return (
    <div
      className={cn(
        'relative py-2',
        'before:content-[""] before:absolute before:top-0 before:bottom-0 before:w-[2px] before:bg-rule',
        LINE_CLS[orientation] ?? LINE_CLS.alternating,
        className,
      )}
      style={style}
      role="list"
    >
      {events.map((event, idx) => {
        const intent   = event.intent ?? 'neutral'
        const isOdd    = idx % 2 === 0
        const isAlt    = orientation === 'alternating'
        const dotCls   = INTENT_DOT[intent] ?? ''

        return (
          <div
            key={event.id}
            className={cn(
              'flex items-start gap-4 relative mb-8',
              isAlt && isOdd && 'flex-row-reverse',
              orientation === 'left'  && 'pl-12',
              orientation === 'right' && 'pr-12 justify-end',
            )}
            role="listitem"
          >
            <div className={cn('w-9 h-9 rounded-full bg-raised border-2 border-rule flex items-center justify-center flex-shrink-0 z-[1] text-body-paragraph text-muted transition-[border-color] duration-200', dotCls)}>
              {event.icon ?? '●'}
            </div>
            <div className="flex-1 bg-raised border border-rule rounded-[--radius-md] px-4 py-3 min-w-0">
              <div className="text-body-caption text-muted mb-1 font-semibold uppercase tracking-[0.06em]">{event.date}</div>
              <div className="text-body-callout font-semibold text-foreground mb-1">{event.title}</div>
              {event.description && (
                <div className="text-body-callout text-muted leading-[1.5]">{event.description}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
