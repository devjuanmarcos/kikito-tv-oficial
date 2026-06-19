import React from 'react'
import { cn } from '@/lib/utils'
import type { PriceTableProps } from './price-table.types'

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <span className="text-success font-bold">✓</span>
  if (value === false) return <span className="text-faint">✕</span>
  return <span className="text-foreground text-[0.875rem]">{value}</span>
}

export function PriceTable({ plans, features, className, style }: PriceTableProps) {
  return (
    <div className={cn('w-full overflow-x-auto', className)} style={style}>
      <table className="w-full border-collapse text-[0.875rem]">
        <thead>
          <tr>
            <td className="w-[30%]" />
            {plans.map(plan => (
              <th
                key={plan.id}
                className={cn(
                  'text-center px-4 pb-6 pt-4 align-top',
                  plan.highlight && 'bg-patina/5 rounded-t-[--radius-md]'
                )}
              >
                {plan.badge && (
                  <div className="inline-block text-[0.625rem] font-bold px-2 py-0.5 rounded-full bg-patina text-patina-fg mb-2">
                    {plan.badge}
                  </div>
                )}
                <div className="font-semibold text-foreground text-base">{plan.name}</div>
                <div className="mt-1">
                  {typeof plan.price === 'number' ? (
                    <span className="text-2xl font-bold text-foreground">
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      {plan.period && <small className="text-sm font-normal text-muted">/{plan.period}</small>}
                    </span>
                  ) : (
                    <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                  )}
                </div>
                {plan.description && (
                  <div className="text-[0.75rem] text-muted mt-1">{plan.description}</div>
                )}
                <button
                  onClick={plan.onCta}
                  className={cn(
                    'mt-3 w-full py-2 rounded-[--radius-sm] text-[0.8125rem] font-medium transition-colors',
                    plan.highlight
                      ? 'bg-patina text-patina-fg hover:bg-patina/90'
                      : 'border border-rule text-foreground hover:bg-graphite'
                  )}
                >
                  {plan.ctaLabel ?? 'Get started'}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <tr key={i} className="border-t border-rule">
              <td className="py-3 px-2 text-muted">{feature.label}</td>
              {plans.map(plan => (
                <td
                  key={plan.id}
                  className={cn('text-center py-3 px-4', plan.highlight && 'bg-patina/5')}
                >
                  <CellValue value={feature.plans[plan.id] ?? false} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
