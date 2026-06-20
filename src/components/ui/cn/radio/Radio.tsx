'use client'
import type React from 'react'
import { useId } from 'react'
import { cn } from '@/lib/utils'

export type RadioSize = 'sm' | 'md' | 'lg'

export interface RadioProps {
  value?:        string
  checked?:      boolean
  defaultChecked?: boolean
  onChange?:     (value: string) => void
  label?:        string
  helperText?:   string
  size?:         RadioSize
  disabled?:     boolean
  name?:         string
  className?:    string
  style?:        React.CSSProperties
}

export interface RadioGroupOption {
  value:       string
  label:       string
  helperText?: string
  disabled?:   boolean
}

export interface RadioGroupProps {
  label?:        string
  helperText?:   string
  options:       RadioGroupOption[]
  value?:        string
  defaultValue?: string
  onChange?:     (value: string) => void
  orientation?:  'vertical' | 'horizontal'
  size?:         RadioSize
  disabled?:     boolean
  name?:         string
  className?:    string
}

const SIZE_DOT: Record<RadioSize, { outer: string; inner: string; label: string; helper: string }> = {
  sm: { outer: 'w-3.5 h-3.5 border',     inner: 'w-[5px] h-[5px]',   label: 'text-body-caption',   helper: 'text-[0.6875rem]' },
  md: { outer: 'w-4 h-4 border-[1.5px]', inner: 'w-[6px] h-[6px]',   label: 'text-body-callout',   helper: 'text-body-caption' },
  lg: { outer: 'w-[1.125rem] h-[1.125rem] border-2', inner: 'w-2 h-2', label: 'text-body-paragraph', helper: 'text-body-callout' },
}

export function Radio({
  value    = '',
  checked,
  defaultChecked,
  onChange,
  label,
  helperText,
  size     = 'md',
  disabled = false,
  name,
  className,
  style,
}: RadioProps) {
  const uid = useId()
  const sz  = SIZE_DOT[size]
  const isControlled = checked !== undefined

  return (
    <label
      className={cn('inline-flex items-start gap-2 cursor-pointer select-none', disabled && 'opacity-50 cursor-not-allowed', className)}
      style={style}
      htmlFor={uid}
    >
      <span className={cn('relative shrink-0 mt-[0.1em] rounded-full border-rule bg-raised transition-[border-color,background] duration-[120ms] flex items-center justify-center', sz.outer)}>
        <input
          id={uid}
          type="radio"
          name={name}
          value={value}
          checked={isControlled ? checked : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          disabled={disabled}
          onChange={e => { if (e.target.checked) onChange?.(value) }}
          className="sr-only peer"
        />
        <span className={cn('rounded-full bg-patina opacity-0 transition-[opacity,transform] duration-[120ms] scale-50 peer-checked:opacity-100 peer-checked:scale-100 peer-checked:[&~span]:border-patina', sz.inner)} />
        <span className={cn('absolute inset-0 rounded-full border border-rule transition-[border-color] duration-[120ms] peer-checked:border-patina')} aria-hidden="true" />
      </span>
      {(label || helperText) && (
        <span className="flex flex-col gap-[0.1rem]">
          {label      && <span className={cn('font-medium text-foreground leading-tight', sz.label)}>{label}</span>}
          {helperText && <span className={cn('text-faint leading-[1.4]', sz.helper)}>{helperText}</span>}
        </span>
      )}
    </label>
  )
}

export function RadioGroup({
  label,
  helperText,
  options,
  value,
  defaultValue,
  onChange,
  orientation = 'vertical',
  size        = 'md',
  disabled    = false,
  name,
  className,
}: RadioGroupProps) {
  const uid       = useId()
  const groupName = name ?? uid
  const isControlled = value !== undefined

  return (
    <fieldset className={cn('border-none p-0 m-0', className)}>
      {label && (
        <legend className="text-body-callout font-semibold text-foreground mb-2 float-none">{label}</legend>
      )}
      <div className={cn('flex', orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-3')}>
        {options.map(opt => (
          <Radio
            key={opt.value}
            value={opt.value}
            name={groupName}
            label={opt.label}
            helperText={opt.helperText}
            checked={isControlled ? value === opt.value : undefined}
            defaultChecked={!isControlled ? defaultValue === opt.value : undefined}
            disabled={disabled || opt.disabled}
            size={size}
            onChange={onChange}
          />
        ))}
      </div>
      {helperText && (
        <p className="text-body-caption text-faint mt-2">{helperText}</p>
      )}
    </fieldset>
  )
}
