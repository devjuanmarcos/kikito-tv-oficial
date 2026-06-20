'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export type QuoteBlockVariant = 'default' | 'bordered' | 'filled' | 'minimal'

export interface QuoteBlockProps {
  children:        React.ReactNode
  variant?:        QuoteBlockVariant
  author?:         string
  role?:           string
  avatar?:         string
  avatarFallback?: string
  className?:      string
  style?:          React.CSSProperties
}

const VARIANT_WRAP: Record<QuoteBlockVariant, string> = {
  default:  'border border-rule rounded-[--radius-md] p-5',
  bordered: 'border-l-[3px] border-patina pl-5 py-2',
  filled:   'bg-graphite rounded-[--radius-md] p-5',
  minimal:  'py-2',
}

const QuoteIcon = () => (
  <svg viewBox="0 0 32 28" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-patina/40 shrink-0">
    <path d="M0 28V17.143Q0 12 2.571 7.429T10.286 0L12.571 2.857Q9.143 4.857 7.143 8.214T5.143 14.857H10.857V28H0ZM18.286 28V17.143Q18.286 12 20.857 7.429T28.571 0L30.857 2.857Q27.429 4.857 25.429 8.214T23.429 14.857H29.143V28H18.286Z"/>
  </svg>
)

function AvatarCircle({ src, fallback, name }: { src?: string; fallback?: string; name?: string }) {
  const initials = fallback ?? (name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?')
  if (src) {
    return <img src={src} alt={name} className="w-8 h-8 rounded-full object-cover" />
  }
  return (
    <div className="w-8 h-8 rounded-full bg-patina/20 text-patina flex items-center justify-center text-body-caption font-semibold select-none">
      {initials}
    </div>
  )
}

export function QuoteBlock({
  children,
  variant       = 'default',
  author,
  role,
  avatar,
  avatarFallback,
  className,
  style,
}: QuoteBlockProps) {
  const hasFooter = author || role

  return (
    <figure
      style={style}
      className={cn('m-0', VARIANT_WRAP[variant], className)}
    >
      {variant !== 'minimal' && (
        <div className="mb-3">
          <QuoteIcon />
        </div>
      )}
      <blockquote className="m-0 text-body-callout text-foreground leading-[1.7] font-medium italic">
        {children}
      </blockquote>
      {hasFooter && (
        <figcaption className="flex items-center gap-2.5 mt-4 not-italic">
          {(avatar || avatarFallback) && (
            <AvatarCircle src={avatar} fallback={avatarFallback} name={author} />
          )}
          <div className="flex flex-col">
            {author && <span className="text-body-callout font-semibold text-foreground">{author}</span>}
            {role   && <span className="text-body-caption text-faint">{role}</span>}
          </div>
        </figcaption>
      )}
    </figure>
  )
}
