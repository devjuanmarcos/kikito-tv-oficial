import type React from 'react'
import { cn } from '@/lib/utils'

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled' | 'ghost'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'
export type CardRadius  = 'sm' | 'md' | 'lg' | 'xl'

export interface CardProps {
  variant?:   CardVariant
  padding?:   CardPadding
  radius?:    CardRadius
  hoverable?: boolean
  clickable?: boolean
  href?:      string
  onClick?:   React.MouseEventHandler<HTMLElement>
  className?: string
  style?:     React.CSSProperties
  children?:  React.ReactNode
}

export interface CardHeaderProps {
  title?:       React.ReactNode
  description?: React.ReactNode
  icon?:        React.ReactNode
  badge?:       React.ReactNode
  action?:      React.ReactNode
  className?:   string
}

export interface CardBodyProps {
  noPadding?: boolean
  className?: string
  children?:  React.ReactNode
  style?:     React.CSSProperties
}

export interface CardFooterProps {
  align?:     'left' | 'right' | 'center' | 'between'
  separator?: boolean
  className?: string
  style?:     React.CSSProperties
  children?:  React.ReactNode
}

const VARIANT_CLS: Record<CardVariant, string> = {
  default:  'bg-raised border border-rule',
  outlined: 'bg-transparent border border-rule',
  elevated: 'bg-raised border border-rule shadow-[0_2px_12px_-4px_oklch(0%_0_0/0.30)]',
  filled:   'bg-graphite border border-transparent',
  ghost:    'bg-transparent border border-transparent',
}
const PADDING_CLS: Record<CardPadding, string> = {
  none: 'p-0',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-7',
}
const RADIUS_CLS: Record<CardRadius, string> = {
  sm: 'rounded-[--radius-sm]',
  md: 'rounded-[--radius-md]',
  lg: 'rounded-[--radius-lg]',
  xl: 'rounded-[24px]',
}
const FOOTER_ALIGN: Record<NonNullable<CardFooterProps['align']>, string> = {
  left:    'justify-start',
  right:   'justify-end',
  center:  'justify-center',
  between: 'justify-between',
}

export function Card({
  variant   = 'default',
  padding   = 'none',
  radius    = 'md',
  hoverable = false,
  clickable = false,
  href,
  onClick,
  className,
  style,
  children,
}: CardProps) {
  const base = cn(
    'flex flex-col overflow-hidden transition-[border-color,box-shadow,transform] duration-[180ms]',
    VARIANT_CLS[variant],
    RADIUS_CLS[radius],
    padding !== 'none' && PADDING_CLS[padding],
    hoverable && 'cursor-pointer hover:-translate-y-px hover:border-patina hover:shadow-[0_4px_20px_-6px_oklch(0%_0_0/0.35)]',
    clickable && 'cursor-pointer active:scale-[0.985]',
    className,
  )

  if (href) {
    return <a href={href} className={base} style={style} onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}>{children}</a>
  }
  if (onClick) {
    return <button type="button" className={cn(base, 'text-left w-full')} style={style} onClick={onClick}>{children}</button>
  }
  return <div className={base} style={style}>{children}</div>
}

export function CardHeader({ title, description, icon, badge, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start gap-3 px-5 pt-5 pb-0', className)}>
      {icon && (
        <span className="shrink-0 mt-0.5 w-[1.125rem] h-[1.125rem] text-faint [&>svg]:w-full [&>svg]:h-full">
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        {title       && <p className="text-body-paragraph font-semibold text-foreground leading-tight">{title}</p>}
        {description && <p className="text-body-callout text-faint mt-[0.2rem] leading-[1.4]">{description}</p>}
      </div>
      {badge  && <span className="shrink-0 ml-1">{badge}</span>}
      {action && <span className="shrink-0 ml-1">{action}</span>}
    </div>
  )
}

export function CardBody({ noPadding = false, className, children, style }: CardBodyProps) {
  return (
    <div className={cn(!noPadding && 'px-5 py-4', className)} style={style}>
      {children}
    </div>
  )
}

export function CardFooter({ align = 'right', separator = true, className, style, children }: CardFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-5 py-4',
        separator && 'border-t border-rule',
        FOOTER_ALIGN[align],
        className,
      )}
      style={style}
    >
      {children}
    </div>
  )
}
