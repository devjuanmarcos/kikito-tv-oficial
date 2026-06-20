import { cn } from '@/lib/utils'
import type { DonutChartProps } from './donut-chart.types'

const DEFAULT_COLORS = [
  'var(--ks-patina)', 'var(--ks-kinpaku)', 'var(--ks-success)',
  'var(--ks-warning)', 'var(--ks-danger)', 'var(--ks-info)',
]

export function DonutChart({
  segments,
  size = 160,
  strokeWidth = 28,
  showLegend = true,
  centerLabel,
  centerValue,
  className,
  style,
}: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  const r = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r

  let offset = 0

  return (
    <div className={cn('flex flex-col items-center gap-4', className)} style={style}>
      <svg width={size} height={size}>
        {/* track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="var(--ks-rule)"
          strokeWidth={strokeWidth}
        />

        {segments.map((seg, i) => {
          const pct = total > 0 ? seg.value / total : 0
          const dash = pct * circumference
          const gap = circumference - dash
          const color = seg.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
          const el = (
            <circle
              key={seg.label}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-(offset * circumference)}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="round"
            />
          )
          offset += pct
          return el
        })}

        {(centerLabel || centerValue !== undefined) && (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
            {centerValue !== undefined && (
              <tspan x={cx} dy={centerLabel ? '-0.5em' : 0} fontSize={22} fontWeight={800} fill="currentColor">
                {centerValue}
              </tspan>
            )}
            {centerLabel && (
              <tspan x={cx} dy={centerValue !== undefined ? '1.4em' : 0} fontSize={11} opacity={0.4} fill="currentColor">
                {centerLabel}
              </tspan>
            )}
          </text>
        )}
      </svg>

      {showLegend && (
        <div className="flex flex-col gap-1.5 w-full">
          {segments.map((seg, i) => {
            const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0
            const color = seg.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
            return (
              <div key={seg.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-body-caption text-muted flex-1">{seg.label}</span>
                <span className="text-body-caption font-semibold text-foreground">{pct}%</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
