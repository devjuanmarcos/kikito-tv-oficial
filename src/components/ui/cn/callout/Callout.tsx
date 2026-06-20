import { cn } from '@/lib/utils'
import type { CalloutProps } from './callout.types'

const InfoIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const SuccessIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
const WarningIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const DangerIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
const NeutralIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
const XIcon       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

const DEFAULT_ICONS = {
  info:    <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  danger:  <DangerIcon />,
  neutral: <NeutralIcon />,
}

const INTENT_VARS: Record<string, string> = {
  info:    '[--i:var(--ks-info)] [--i-fg:var(--ks-info-fg)] [--i-soft:var(--ks-info-soft)] [--i-deep:var(--ks-info-deep)]',
  success: '[--i:var(--ks-success)] [--i-fg:var(--ks-success-fg)] [--i-soft:var(--ks-success-soft)] [--i-deep:var(--ks-success-deep)]',
  warning: '[--i:var(--ks-warning)] [--i-fg:var(--ks-warning-fg)] [--i-soft:var(--ks-warning-soft)] [--i-deep:var(--ks-warning-deep)]',
  danger:  '[--i:var(--ks-danger)] [--i-fg:var(--ks-danger-fg)] [--i-soft:var(--ks-danger-soft)] [--i-deep:var(--ks-danger-deep)]',
  neutral: '[--i:var(--ks-text-muted)] [--i-fg:var(--ks-text)] [--i-soft:var(--ks-graphite)] [--i-deep:var(--ks-text)]',
}

const APPEARANCE_CLS: Record<string, string> = {
  soft:    'bg-[--i-soft] border border-[color-mix(in_oklch,var(--i)_30%,transparent)]',
  outline: 'bg-transparent border-[1.5px] border-[--i]',
  solid:   'bg-[--i] border border-[--i-deep] text-[--i-fg]',
}

export function Callout({
  intent     = 'info',
  appearance = 'soft',
  title,
  icon,
  children,
  onClose,
  action,
  className,
  style,
}: CalloutProps) {
  const resolvedIcon = icon !== undefined ? icon : DEFAULT_ICONS[intent as keyof typeof DEFAULT_ICONS]
  const isSolid = appearance === 'solid'

  return (
    <div
      className={cn(
        'flex gap-3 px-[1.125rem] py-4 rounded-[--radius-md] relative leading-normal',
        INTENT_VARS[intent],
        APPEARANCE_CLS[appearance],
        className,
      )}
      role="note"
      style={style}
    >
      {resolvedIcon && (
        <span
          className={cn(
            'shrink-0 flex items-start pt-px [&>svg]:w-[18px] [&>svg]:h-[18px]',
            isSolid ? 'text-[--i-fg]' : 'text-[--i]',
          )}
          aria-hidden="true"
        >
          {resolvedIcon}
        </span>
      )}

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {title && (
          <p className={cn('font-semibold text-body-callout leading-snug', isSolid ? 'text-[--i-fg]' : 'text-[--i]')}>
            {title}
          </p>
        )}
        {children && (
          <div className={cn('text-body-callout leading-relaxed', isSolid ? 'text-[color-mix(in_oklch,var(--i-fg)_85%,transparent)]' : 'text-muted')}>
            {children}
          </div>
        )}
        {action && <div className="mt-[0.625rem]">{action}</div>}
      </div>

      {onClose && (
        <button
          type="button"
          className="absolute top-[0.625rem] right-[0.625rem] w-6 h-6 flex items-center justify-center border-none bg-transparent cursor-pointer rounded-[--radius-sm] text-faint p-0 [&>svg]:w-[14px] [&>svg]:h-[14px] transition-[color,background] duration-[150ms] hover:bg-[color-mix(in_oklch,currentColor_10%,transparent)] hover:text-foreground"
          onClick={onClose}
          aria-label="Dismiss"
        >
          <XIcon />
        </button>
      )}
    </div>
  )
}
