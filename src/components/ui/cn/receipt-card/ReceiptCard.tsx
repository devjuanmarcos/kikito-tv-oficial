'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export type ReceiptStatus = 'paid' | 'pending' | 'cancelled'

export interface ReceiptLineItem {
  label:      string
  value:      number | string
  highlight?: boolean
}

export interface ReceiptCardProps {
  total:       string | number
  title?:      string
  from?:       string
  to?:         string
  date?:       Date | string
  items?:      ReceiptLineItem[]
  subtotal?:   string | number
  discount?:   string | number
  tax?:        string | number
  currency?:   string
  status?:     ReceiptStatus
  className?:  string
  style?:      React.CSSProperties
}

const STATUS_CLS: Record<ReceiptStatus, string> = {
  paid:      'bg-success/15 text-success border border-success/30',
  pending:   'bg-warning/15 text-warning border border-warning/30',
  cancelled: 'bg-danger/15 text-danger border border-danger/30',
}

function fmt(v: string | number, sym: string) {
  if (typeof v === 'number') return `${sym}${v.toFixed(2)}`
  return v
}

function fmtDate(d: Date | string) {
  if (d instanceof Date) return d.toLocaleDateString()
  return d
}

export function ReceiptCard({
  total,
  title     = 'Receipt',
  from,
  to,
  date,
  items     = [],
  subtotal,
  discount,
  tax,
  currency  = '$',
  status,
  className,
  style,
}: ReceiptCardProps) {
  return (
    <div
      style={style}
      className={cn(
        'rounded-2xl border border-rule bg-raised overflow-hidden w-full max-w-sm font-mono',
        className,
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-dashed border-rule text-center">
        <p className="text-body-callout font-bold text-foreground">{title}</p>
        {date && <p className="text-body-caption text-faint mt-0.5">{fmtDate(date)}</p>}
        {(from || to) && (
          <div className="mt-2 text-body-caption text-faint">
            {from && <p>From: {from}</p>}
            {to && <p>To: {to}</p>}
          </div>
        )}
      </div>

      {/* Items */}
      {items.length > 0 && (
        <div className="px-6 py-3 space-y-2 border-b border-dashed border-rule">
          {items.map((item, i) => (
            <div key={i} className={cn('flex justify-between text-body-caption', item.highlight && 'text-patina font-semibold')}>
              <span>{item.label}</span>
              <span>{fmt(item.value, currency)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Subtotals */}
      {(subtotal !== undefined || discount !== undefined || tax !== undefined) && (
        <div className="px-6 py-3 space-y-1.5 border-b border-dashed border-rule">
          {subtotal !== undefined && (
            <div className="flex justify-between text-body-caption text-faint">
              <span>Subtotal</span>
              <span>{fmt(subtotal, currency)}</span>
            </div>
          )}
          {discount !== undefined && (
            <div className="flex justify-between text-body-caption text-success">
              <span>Discount</span>
              <span>-{fmt(discount, currency)}</span>
            </div>
          )}
          {tax !== undefined && (
            <div className="flex justify-between text-body-caption text-faint">
              <span>Tax</span>
              <span>{fmt(tax, currency)}</span>
            </div>
          )}
        </div>
      )}

      {/* Total + status */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-body-caption text-faint">Total</p>
          <p className="text-xl font-bold text-foreground">{fmt(total, currency)}</p>
        </div>
        {status && (
          <span className={cn('px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wide', STATUS_CLS[status])}>
            {status}
          </span>
        )}
      </div>

      {/* Serrated bottom */}
      <div className="h-3 bg-[repeating-linear-gradient(90deg,var(--background)_0,var(--background)_10px,transparent_10px,transparent_20px)] border-t border-rule" />
    </div>
  )
}
