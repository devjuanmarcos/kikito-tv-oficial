import type { BreadcrumbProps, BreadcrumbItem } from './breadcrumb.types'
import { cn } from '@/lib/utils'

const DefaultSeparator = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

function buildVisible(items: BreadcrumbItem[], maxItems?: number): (BreadcrumbItem | '…')[] {
  if (!maxItems || items.length <= maxItems) return items
  const keep = Math.max(maxItems - 1, 2)
  const tailCount = Math.floor((keep - 1) / 2)
  const headCount = keep - 1 - tailCount
  const head = items.slice(0, headCount)
  const tail = items.slice(items.length - tailCount - 1)
  return [...head, '…', ...tail]
}

const SIZE_CLS: Record<string, string> = {
  sm: 'text-[0.75rem]',
  md: 'text-[0.875rem]',
  lg: 'text-[1rem]',
}

const interactiveCls = 'inline-flex items-center gap-[0.3125rem] py-[0.375rem] text-faint no-underline bg-none border-none font-[inherit] cursor-pointer rounded-sm transition-colors duration-[140ms] whitespace-nowrap hover:text-foreground'

export function Breadcrumb({
  items,
  separator,
  maxItems,
  size = 'md',
  className,
  style,
}: BreadcrumbProps) {
  const visible = buildVisible(items, maxItems)
  const sep = separator ?? <DefaultSeparator />

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('inline-flex items-center', SIZE_CLS[size], className)}
      style={style}
    >
      <ol className="flex flex-wrap items-center gap-0 list-none m-0 p-0">
        {visible.map((item, idx) => {
          const isLast = idx === visible.length - 1
          const isEllipsis = item === '…'

          return (
            <li key={idx} className="flex items-center">
              {idx > 0 && (
                <span className="inline-flex items-center text-faint px-1 shrink-0 pointer-events-none [&>svg]:w-[0.875em] [&>svg]:h-[0.875em]" aria-hidden="true">
                  {sep}
                </span>
              )}

              {isEllipsis ? (
                <span className="inline-flex items-center py-[0.375rem] text-faint tracking-[0.05em]" aria-hidden="true">…</span>
              ) : isLast ? (
                <span className="inline-flex items-center gap-[0.3125rem] py-[0.375rem] text-foreground font-medium whitespace-nowrap pointer-events-none" aria-current="page">
                  {(item as BreadcrumbItem).icon && <span className="inline-flex items-center shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em]">{(item as BreadcrumbItem).icon}</span>}
                  {(item as BreadcrumbItem).label}
                </span>
              ) : (item as BreadcrumbItem).href ? (
                <a href={(item as BreadcrumbItem).href} className={interactiveCls}>
                  {(item as BreadcrumbItem).icon && <span className="inline-flex items-center shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em]">{(item as BreadcrumbItem).icon}</span>}
                  {(item as BreadcrumbItem).label}
                </a>
              ) : (item as BreadcrumbItem).onClick ? (
                <button type="button" className={interactiveCls} onClick={(item as BreadcrumbItem).onClick}>
                  {(item as BreadcrumbItem).icon && <span className="inline-flex items-center shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em]">{(item as BreadcrumbItem).icon}</span>}
                  {(item as BreadcrumbItem).label}
                </button>
              ) : (
                <span className={cn(interactiveCls, 'pointer-events-none')}>
                  {(item as BreadcrumbItem).icon && <span className="inline-flex items-center shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em]">{(item as BreadcrumbItem).icon}</span>}
                  {(item as BreadcrumbItem).label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
