import React from 'react'
import { cn } from '@/lib/utils'
import type { ShortcutKeyProps } from './shortcut-key.types'

const SPECIAL: Record<string, string> = {
  cmd:       '⌘',
  ctrl:      '⌃',
  alt:       '⌥',
  opt:       '⌥',
  shift:     '⇧',
  enter:     '↵',
  return:    '↵',
  delete:    '⌫',
  backspace: '⌫',
  up:        '↑',
  down:      '↓',
  left:      '←',
  right:     '→',
  esc:       'Esc',
  tab:       '⇥',
  space:     '␣',
}

const SIZE_CLASSES = {
  sm: 'text-[0.5625rem] px-1 py-0.5',
  md: 'text-[0.6875rem] px-1.5 py-0.5',
  lg: 'text-[0.875rem] px-2 py-1',
}

export function ShortcutKey({
  keys,
  size = 'md',
  variant = 'default',
  className,
  style,
}: ShortcutKeyProps) {
  const formatted = keys.map(k => SPECIAL[k.toLowerCase()] ?? k.toUpperCase())

  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} style={style}>
      {formatted.map((k, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-faint text-[0.625rem] px-0.5">+</span>}
          <kbd
            className={cn(
              'inline-flex items-center justify-center rounded font-mono font-bold leading-none',
              SIZE_CLASSES[size],
              variant === 'default'
                ? 'border border-rule bg-raised text-muted shadow-[0_1px_0_var(--ks-rule)]'
                : 'bg-graphite text-foreground'
            )}
          >
            {k}
          </kbd>
        </React.Fragment>
      ))}
    </span>
  )
}
