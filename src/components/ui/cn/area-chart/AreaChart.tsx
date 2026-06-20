"use client";

import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { AreaChartProps } from "./area-chart.types";

const SERIES_COLORS = [
  "var(--ks-patina)",
  "var(--ks-kinpaku)",
  "var(--ks-info)",
  "var(--ks-success)",
  "var(--ks-warning)",
  "var(--ks-danger)",
];

interface TooltipState {
  x: number;
  y: number;
  index: number;
}

export function AreaChart({
  data,
  series,
  height = 240,
  showGrid = true,
  showDots = true,
  showLegend = true,
  showTooltip = true,
  stacked = false,
  gradient = true,
  className,
  style,
}: AreaChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const PAD = { top: 16, right: 16, bottom: 32, left: 44 };
  const W = 560;
  const H = height;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const numericData = data.map((d) => series.map((s) => Number(d[s.key]) || 0));

  const stackedData = stacked
    ? numericData.map((row) =>
        row.reduce<number[]>((acc, val, i) => {
          acc.push((acc[i - 1] ?? 0) + val);
          return acc;
        }, [])
      )
    : numericData;

  const maxVal = stacked
    ? Math.max(...stackedData.map((row) => row[row.length - 1] ?? 0), 1)
    : Math.max(...numericData.flat(), 1);

  const xStep = data.length > 1 ? innerW / (data.length - 1) : innerW;
  const xOf = (i: number) => PAD.left + i * xStep;
  const yOf = (v: number) => PAD.top + innerH - (v / maxVal) * innerH;

  const makeAreaPath = (si: number) => {
    const topPts = data.map((_, i) => {
      const v = stacked ? stackedData[i]?.[si] ?? 0 : numericData[i]?.[si] ?? 0;
      return { x: xOf(i), y: yOf(v) };
    });
    const bottom = stacked && si > 0 ? data.map((_, i) => yOf(stackedData[i]?.[si - 1] ?? 0)) : data.map(() => yOf(0));

    const top = topPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const bot = bottom.map((y, i) => `L${xOf(data.length - 1 - i)},${bottom[data.length - 1 - i] ?? 0}`).join(" ");
    return `${top} ${bot} Z`;
  };

  const makeLinePath = (si: number) =>
    data
      .map((_, i) => {
        const v = stacked ? stackedData[i]?.[si] ?? 0 : numericData[i]?.[si] ?? 0;
        return `${i === 0 ? "M" : "L"}${xOf(i)},${yOf(v)}`;
      })
      .join(" ");

  const yTicks = 4;
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => (maxVal * i) / yTicks);
  const getColor = (i: number) => series[i]?.color ?? SERIES_COLORS[i % SERIES_COLORS.length];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!showTooltip) return;
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const svgX = ((e.clientX - rect.left) / rect.width) * W - PAD.left;
      const idx = Math.max(0, Math.min(data.length - 1, Math.round(svgX / xStep)));
      setTooltip({ x: e.clientX, y: e.clientY, index: idx });
    },
    [showTooltip, data.length, xStep]
  );

  return (
    <div className={cn("relative", className)} style={style}>
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s.key} id={`ag-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={getColor(i)} stopOpacity="0.3" />
              <stop offset="100%" stopColor={getColor(i)} stopOpacity="0.02" />
            </linearGradient>
          ))}
        </defs>

        {showGrid &&
          yTickVals.map((v, i) => (
            <line
              key={i}
              x1={PAD.left}
              x2={PAD.left + innerW}
              y1={yOf(v)}
              y2={yOf(v)}
              stroke="var(--ks-rule)"
              strokeWidth={1}
            />
          ))}

        {yTickVals.map((v, i) => (
          <text key={i} x={PAD.left - 6} y={yOf(v) + 4} textAnchor="end" fontSize={10} fill="var(--ks-text-faint)">
            {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}
          </text>
        ))}

        {data.map((d, i) => (
          <text
            key={i}
            x={xOf(i)}
            y={H - PAD.bottom + 16}
            textAnchor="middle"
            fontSize={10}
            fill="var(--ks-text-faint)"
          >
            {String(d.label)}
          </text>
        ))}

        {[...series].reverse().map((s, ri) => {
          const i = series.length - 1 - ri;
          return (
            <path
              key={s.key + "-area"}
              d={makeAreaPath(i)}
              fill={gradient ? `url(#ag-${s.key})` : getColor(i)}
              fillOpacity={gradient ? 1 : 0.15}
            />
          );
        })}

        {series.map((s, i) => (
          <path
            key={s.key + "-line"}
            d={makeLinePath(i)}
            fill="none"
            stroke={getColor(i)}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {showDots &&
          series.map((s, si) =>
            data.map((_, di) => {
              const v = stacked ? stackedData[di]?.[si] ?? 0 : numericData[di]?.[si] ?? 0;
              return (
                <circle
                  key={`${s.key}-${di}`}
                  cx={xOf(di)}
                  cy={yOf(v)}
                  r={3}
                  fill={getColor(si)}
                  stroke="var(--ks-lacquer)"
                  strokeWidth={1.5}
                />
              );
            })
          )}

        {tooltip && (
          <line
            x1={xOf(tooltip.index)}
            x2={xOf(tooltip.index)}
            y1={PAD.top}
            y2={PAD.top + innerH}
            stroke="var(--ks-rule)"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
        )}
      </svg>

      {showLegend && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 px-1">
          {series.map((s, i) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: getColor(i) }} />
              <span className="text-body-caption text-muted">{s.label ?? s.key}</span>
            </div>
          ))}
        </div>
      )}

      {tooltip && showTooltip && data[tooltip.index] && (
        <div
          className="fixed z-50 pointer-events-none bg-raised border border-rule rounded-(--radius-sm) px-3 py-2 shadow-lg text-body-caption"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          <div className="font-semibold text-foreground mb-1">{data[tooltip.index].label}</div>
          {series.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: getColor(i) }} />
              <span className="text-muted">{s.label ?? s.key}:</span>
              <strong className="text-foreground">{data[tooltip.index][s.key]}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
