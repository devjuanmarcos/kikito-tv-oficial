'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { PhoneInputProps } from './phone-input.types'

const COUNTRIES = [
  { code: 'BR', dial: '+55',  flag: '🇧🇷', name: 'Brazil' },
  { code: 'US', dial: '+1',   flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dial: '+44',  flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'DE', dial: '+49',  flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', dial: '+33',  flag: '🇫🇷', name: 'France' },
  { code: 'JP', dial: '+81',  flag: '🇯🇵', name: 'Japan' },
  { code: 'CA', dial: '+1',   flag: '🇨🇦', name: 'Canada' },
  { code: 'AU', dial: '+61',  flag: '🇦🇺', name: 'Australia' },
  { code: 'IN', dial: '+91',  flag: '🇮🇳', name: 'India' },
  { code: 'MX', dial: '+52',  flag: '🇲🇽', name: 'Mexico' },
  { code: 'PT', dial: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: 'ES', dial: '+34',  flag: '🇪🇸', name: 'Spain' },
]

const SIZE_CLS: Record<string, string> = {
  sm: 'text-body-callout h-8',
  md: 'text-body-callout h-10',
  lg: 'text-body-paragraph h-12',
}

export function PhoneInput({
  value,
  defaultValue = '',
  onChange,
  placeholder = '(00) 00000-0000',
  size = 'md',
  disabled = false,
  defaultCountry = 'BR',
  className,
  style,
}: PhoneInputProps) {
  const [internal, setInternal] = useState(defaultValue)
  const [country, setCountry] = useState(COUNTRIES.find(c => c.code === defaultCountry) ?? COUNTRIES[0])
  const phone = value !== undefined ? value : internal

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/[^0-9\s()\-+]/g, '')
    if (value === undefined) setInternal(v)
    onChange?.(`${country.dial} ${v}`)
  }

  return (
    <div
      className={cn(
        'flex items-stretch rounded-[--radius-sm] border border-rule bg-canvas overflow-hidden focus-within:border-patina/60 transition-colors',
        disabled && 'opacity-60 cursor-not-allowed',
        SIZE_CLS[size] ?? SIZE_CLS.md,
        className
      )}
      style={style}
    >
      {/* Country selector */}
      <div className="relative flex items-center gap-1.5 px-2.5 border-r border-rule bg-graphite/40 shrink-0">
        <span className="text-body-paragraph leading-none">{country.flag}</span>
        <span className="text-body-callout text-muted font-medium tabular-nums">{country.dial}</span>
        <select
          className="absolute inset-0 opacity-0 cursor-pointer w-full"
          value={country.code}
          disabled={disabled}
          onChange={e => {
            const c = COUNTRIES.find(c => c.code === e.target.value)
            if (c) setCountry(c)
          }}
          aria-label="Country"
        >
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.dial})</option>
          ))}
        </select>
      </div>

      <input
        type="tel"
        value={phone}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleChange}
        className="flex-1 px-3 bg-transparent outline-none text-foreground placeholder:text-faint"
      />
    </div>
  )
}
