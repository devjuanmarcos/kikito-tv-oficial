import { cn } from '@/lib/utils'
import type { DataListProps } from './data-list.types'

export function DataList({
  items,
  layout   = 'horizontal',
  columns  = 2,
  striped  = false,
  bordered = false,
  compact  = false,
  className,
  style,
}: DataListProps) {
  const isGrid  = layout === 'grid'
  const isHoriz = layout === 'horizontal'
  const isVert  = layout === 'vertical'

  return (
    <dl
      className={cn(
        isGrid ? 'grid' : 'flex flex-col',
        className,
      )}
      style={isGrid ? { gridTemplateColumns: `repeat(${columns}, 1fr)`, ...style } : style}
    >
      {items.map((item, i) => {
        const isEven = i % 2 === 1
        return (
          <div
            key={i}
            className={cn(
              'flex gap-3',
              isHoriz && 'flex-row items-baseline py-[10px] border-b border-rule last:border-none',
              isVert  && 'flex-col gap-1 py-[10px] border-b border-rule last:border-none',
              isGrid  && 'flex-col gap-1 p-3 border border-rule rounded-[--radius-base]',
              bordered && (isHoriz || isVert) && 'py-[10px] px-3 border border-rule rounded-[--radius-base] mb-1',
              striped && isEven && !bordered && 'bg-sunken rounded-[--radius-sm] px-3',
              compact && 'py-[6px]',
            )}
            style={item.span && isGrid ? { gridColumn: `span ${item.span}` } : undefined}
          >
            <dt className={cn(
              'text-[0.75rem] font-semibold text-muted opacity-60 uppercase tracking-[0.04em] flex-shrink-0',
              isHoriz && 'w-40 min-w-40',
            )}>
              {item.label}
            </dt>
            <dd className="text-[0.8125rem] text-foreground flex-1">{item.value}</dd>
          </div>
        )
      })}
    </dl>
  )
}
