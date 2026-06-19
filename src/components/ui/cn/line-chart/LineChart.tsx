import { cn } from '@/lib/utils'
import type { LineChartProps } from './line-chart.types'

const DEFAULT_COLORS = ['var(--ks-patina)', 'var(--ks-kinpaku)', 'var(--ks-success)', 'var(--ks-danger)']
const GRID_LINES = 4

export function LineChart({
  series,
  labels,
  height = 200,
  width = '100%',
  showArea = true,
  showDots = true,
  showGrid = true,
  showLegend = true,
  className,
  style,
}: LineChartProps) {
  const allValues = series.flatMap(s => s.data)
  const max = Math.max(...allValues, 1)
  const min = Math.min(...allValues, 0)
  const range = max - min || 1
  const n = series[0]?.data.length ?? 0
  const padX = 8
  const padY = 12
  const chartH = height - padY * 2 - 20

  const toX = (i: number) => padX + (i / Math.max(n - 1, 1)) * (400 - padX * 2)
  const toY = (v: number) => padY + chartH - ((v - min) / range) * chartH

  return (
    <div className={cn(className)} style={{ ...style, width }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 400 ${height}`}
        preserveAspectRatio="none"
      >
        {showGrid && Array.from({ length: GRID_LINES + 1 }, (_, i) => {
          const y = padY + (i / GRID_LINES) * chartH
          return (
            <line key={i} x1={padX} y1={y} x2={400 - padX} y2={y}
              stroke="var(--ks-rule)" strokeWidth={1} />
          )
        })}

        {series.map((s, si) => {
          const color = s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length]
          const pts = s.data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')

          const areaPath = n > 0
            ? `M ${toX(0)},${toY(min)} ` +
              s.data.map((v, i) => `L ${toX(i)},${toY(v)}`).join(' ') +
              ` L ${toX(n - 1)},${toY(min)} Z`
            : ''

          return (
            <g key={s.label}>
              {showArea && (
                <path d={areaPath} fill={color} opacity={0.12} />
              )}
              <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
              {showDots && s.data.map((v, i) => (
                <circle key={i} cx={toX(i)} cy={toY(v)} r={3} fill={color} />
              ))}
            </g>
          )
        })}

        {labels && labels.map((lbl, i) => (
          <text key={i} x={toX(i)} y={height - 4} textAnchor="middle"
            fontSize={10} fill="var(--ks-text-faint)">
            {lbl}
          </text>
        ))}
      </svg>

      {showLegend && series.length > 1 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 px-1">
          {series.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div
                className="w-6 h-[2px] rounded-full"
                style={{ background: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length] }}
              />
              <span className="text-[0.6875rem] text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
