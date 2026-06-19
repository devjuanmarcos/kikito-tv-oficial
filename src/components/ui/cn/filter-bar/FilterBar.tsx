import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { FilterBarProps } from './filter-bar.types'

export function FilterBar({
  options,
  value: controlled,
  defaultValue,
  onChange,
  multiSelect = true,
  clearable   = true,
  className,
  style,
}: FilterBarProps) {
  const [internal, setInternal] = useState<string[]>(defaultValue ?? [])
  const selected = controlled !== undefined ? controlled : internal

  function toggle(v: string) {
    const next = !multiSelect
      ? (selected.includes(v) ? [] : [v])
      : (selected.includes(v) ? selected.filter(s => s !== v) : [...selected, v])
    if (controlled === undefined) setInternal(next)
    onChange?.(next)
  }

  function clear() {
    if (controlled === undefined) setInternal([])
    onChange?.([])
  }

  return (
    <div className={cn('flex flex-wrap gap-[6px] items-center', className)} style={style}>
      {options.map(opt => {
        const isActive = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            className={cn(
              'inline-flex items-center gap-[5px] py-[5px] px-3 rounded-pill text-[0.8125rem] font-medium cursor-pointer border border-rule bg-transparent text-muted transition-[border-color,background,color] duration-[150ms] select-none',
              'hover:border-patina hover:text-foreground hover:bg-[color-mix(in_srgb,var(--ks-patina)_8%,transparent)]',
              isActive && 'border-patina bg-[color-mix(in_srgb,var(--ks-patina)_15%,transparent)] text-patina font-semibold',
            )}
            onClick={() => toggle(opt.value)}
          >
            {opt.label}
            {opt.count !== undefined && (
              <span className={cn(
                'bg-raised rounded-pill px-[6px] py-[1px] text-[0.6875rem] font-bold text-muted min-w-[18px] text-center',
                isActive && 'bg-[color-mix(in_srgb,var(--ks-patina)_25%,transparent)] text-patina',
              )}>
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
      {clearable && selected.length > 0 && (
        <button
          type="button"
          className="inline-flex items-center gap-1 py-[5px] px-[10px] rounded-pill text-[0.75rem] cursor-pointer border border-dashed border-rule bg-transparent text-muted transition-[color,border-color] hover:text-danger hover:border-danger"
          onClick={clear}
        >
          ✕ Clear
        </button>
      )}
    </div>
  )
}
