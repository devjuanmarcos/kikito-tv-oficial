import React from 'react'
import { cn } from '@/lib/utils'
import type { ComparisonTableProps } from './comparison-table.types'

function CellValue({ value }: { value: boolean | string | React.ReactNode }) {
  if (value === true)
    return <span className="text-success font-bold text-body-paragraph" aria-label="included">✓</span>
  if (value === false)
    return <span className="text-faint font-bold text-body-paragraph" aria-label="not included">✕</span>
  return <span>{value as React.ReactNode}</span>
}

export function ComparisonTable({
  columns,
  rows,
  stickyHeader = false,
  className,
  style,
}: ComparisonTableProps) {
  let lastGroup: string | undefined

  return (
    <div className={cn('w-full overflow-x-auto rounded-[--radius-md] border border-rule', className)} style={style}>
      <table className="w-full border-collapse text-body-callout">
        <thead className={cn('bg-raised', stickyHeader && 'sticky top-0 z-10')}>
          <tr>
            <th className="text-left px-4 py-3 text-faint font-medium border-b border-rule" style={{ width: '30%' }} />
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(
                  'text-center px-4 py-3 font-semibold border-b border-rule',
                  col.highlight ? 'text-patina bg-patina/5' : 'text-foreground'
                )}
              >
                <div className="flex items-center justify-center gap-1.5">
                  {col.label}
                  {col.badge && (
                    <span className="text-[0.625rem] font-bold px-1.5 py-0.5 rounded-full bg-patina text-patina-fg">
                      {col.badge}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isNewGroup = row.group && row.group !== lastGroup
            if (isNewGroup) lastGroup = row.group
            return (
              <React.Fragment key={i}>
                {isNewGroup && (
                  <tr className="bg-canvas">
                    <td
                      colSpan={columns.length + 1}
                      className="px-4 py-2 text-body-caption font-bold uppercase tracking-widest text-faint border-b border-rule"
                    >
                      {row.group}
                    </td>
                  </tr>
                )}
                <tr className="border-b border-rule last:border-0 hover:bg-raised/60 transition-colors">
                  <td className="px-4 py-3 text-foreground">
                    <div className="flex items-center gap-1.5">
                      {row.feature}
                      {row.tooltip && (
                        <span
                          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-graphite text-faint text-[0.5625rem] font-bold cursor-help"
                          title={row.tooltip}
                        >
                          ?
                        </span>
                      )}
                    </div>
                  </td>
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={cn(
                        'text-center px-4 py-3',
                        col.highlight && 'bg-patina/5'
                      )}
                    >
                      <CellValue value={row.values[col.key] ?? false} />
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
