import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import type { DataGridProps } from './data-grid.types'

type SortDir = 'asc' | 'desc' | null

export function DataGrid<T = Record<string, unknown>>({
  columns,
  rows,
  getRowKey,
  selectable    = false,
  selectedKeys: controlledKeys,
  onSelectionChange,
  stickyHeader  = false,
  striped       = false,
  className,
  style,
}: DataGridProps<T>) {
  const [sortKey, setSortKey]             = useState<string | null>(null)
  const [sortDir, setSortDir]             = useState<SortDir>(null)
  const [internalSelected, setInternalSelected] = useState<string[]>([])

  const selected   = controlledKeys ?? internalSelected
  const setSelected = (keys: string[]) => {
    if (!controlledKeys) setInternalSelected(keys)
    onSelectionChange?.(keys)
  }

  const rowKey = (row: T, i: number) => getRowKey ? getRowKey(row, i) : String(i)

  const sorted = [...rows].sort((a, b) => {
    if (!sortKey || !sortDir) return 0
    const av = String((a as Record<string, unknown>)[sortKey] ?? '')
    const bv = String((b as Record<string, unknown>)[sortKey] ?? '')
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  const toggleSort = (key: string) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc') }
    else if (sortDir === 'asc') setSortDir('desc')
    else { setSortKey(null); setSortDir(null) }
  }

  const allKeys     = sorted.map((r, i) => rowKey(r, i))
  const allSelected = allKeys.length > 0 && allKeys.every(k => selected.includes(k))
  const toggleAll   = () => setSelected(allSelected ? [] : allKeys)
  const toggleRow   = (key: string) =>
    setSelected(selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key])

  return (
    <div className={cn('overflow-auto border border-rule rounded-[--radius-md]', className)} style={style}>
      <table className="w-full border-collapse text-[0.8125rem] text-foreground">
        <thead>
          <tr>
            {selectable && (
              <th className={cn('py-[10px] px-[14px] text-left text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-muted bg-sunken border-b border-rule whitespace-nowrap select-none', stickyHeader && 'sticky top-0 z-[2]')} style={{ width: 40, textAlign: 'center' }}>
                <input type="checkbox" className="w-4 h-4 accent-patina cursor-pointer" checked={allSelected} onChange={toggleAll} />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(
                  'py-[10px] px-[14px] text-left text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-muted bg-sunken border-b border-rule whitespace-nowrap select-none',
                  stickyHeader && 'sticky top-0 z-[2]',
                  col.align === 'center' && 'text-center',
                  col.align === 'right'  && 'text-right',
                )}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.sortable ? (
                  <button
                    className="bg-transparent border-none cursor-pointer text-inherit inline-flex items-center gap-1 p-0 font-[inherit] text-[inherit] tracking-[inherit] uppercase hover:text-foreground"
                    onClick={() => toggleSort(col.key)}
                  >
                    {col.header}
                    <span className={cn('text-faint text-[0.625rem]', sortKey === col.key && 'text-patina')}>
                      {sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                    </span>
                  </button>
                ) : col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const key    = rowKey(row, i)
            const isEven = i % 2 === 1
            return (
              <tr
                key={key}
                className={cn(
                  'border-b border-rule last:border-none transition-[background] duration-[100ms] hover:bg-raised',
                  striped && isEven && 'bg-sunken hover:bg-raised',
                  selected.includes(key) && 'bg-patina-soft',
                )}
              >
                {selectable && (
                  <td className="py-[9px] px-[14px] align-middle text-center">
                    <input type="checkbox" className="w-4 h-4 accent-patina cursor-pointer" checked={selected.includes(key)} onChange={() => toggleRow(key)} />
                  </td>
                )}
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={cn(
                      'py-[9px] px-[14px] align-middle',
                      col.align === 'center' && 'text-center',
                      col.align === 'right'  && 'text-right',
                    )}
                  >
                    {col.render ? col.render(row, i) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
