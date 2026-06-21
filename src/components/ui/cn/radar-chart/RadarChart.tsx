import { cn } from '@/lib/utils'
import type { RadarChartProps } from './radar-chart.types'

const COLORS = ['var(--ks-primary)', 'var(--ks-kinpaku)', 'var(--ks-success)', 'var(--ks-danger)']

function polarToXY(angle: number, r: number, cx: number, cy: number) {
  const rad = (angle - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

export function RadarChart({
  axes,
  series,
  size = 240,
  levels = 4,
  showLegend = true,
  className,
  style,
}: RadarChartProps) {
  const n = axes.length
  const cx = size / 2, cy = size / 2
  const maxR = size / 2 - 28
  const step = 360 / n

  const levelPolygons = Array.from({ length: levels }, (_, l) => {
    const r = ((l + 1) / levels) * maxR
    return axes.map((_, i) => {
      const p = polarToXY(i * step, r, cx, cy)
      return `${p.x},${p.y}`
    }).join(' ')
  })

  return (
    <div className={cn('flex flex-col items-center gap-3', className)} style={style}>
      <svg width={size} height={size}>
        {/* Grid polygons */}
        {levelPolygons.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="var(--ks-rule)" strokeWidth={1} />
        ))}

        {/* Axis lines */}
        {axes.map((_, i) => {
          const end = polarToXY(i * step, maxR, cx, cy)
          return (
            <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y}
              stroke="var(--ks-rule)" strokeWidth={1} />
          )
        })}

        {/* Axis labels */}
        {axes.map((ax, i) => {
          const p = polarToXY(i * step, maxR + 16, cx, cy)
          const anchor = p.x < cx - 2 ? 'end' : p.x > cx + 2 ? 'start' : 'middle'
          return (
            <text key={i} x={p.x} y={p.y} textAnchor={anchor}
              fontSize={10} fill="var(--ks-text-faint)" dominantBaseline="middle">
              {ax.label}
            </text>
          )
        })}

        {/* Series polygons */}
        {series.map((s, si) => {
          const color = s.color ?? COLORS[si % COLORS.length]
          const pts = axes.map((ax, i) => {
            const max = ax.max ?? Math.max(...series.flatMap(s2 => s2.data), 1)
            const r = ((s.data[i] ?? 0) / max) * maxR
            const p = polarToXY(i * step, r, cx, cy)
            return `${p.x},${p.y}`
          }).join(' ')

          return (
            <g key={s.label}>
              <polygon points={pts} fill={color} fillOpacity={0.15} />
              <polygon points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
              {axes.map((ax, i) => {
                const max = ax.max ?? Math.max(...series.flatMap(s2 => s2.data), 1)
                const r = ((s.data[i] ?? 0) / max) * maxR
                const p = polarToXY(i * step, r, cx, cy)
                return (
                  <circle key={i} cx={p.x} cy={p.y} r={3}
                    fill={color} stroke="var(--ks-lacquer)" strokeWidth={1.5} />
                )
              })}
            </g>
          )
        })}
      </svg>

      {showLegend && series.length > 1 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
          {series.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color ?? COLORS[i % COLORS.length] }} />
              <span className="text-body-caption text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
