"use client";

import { EChartsContainer } from "@/lib/echarts";
import { resolveChartColor, resolveChartTheme } from "@/lib/echarts/chart-theme";
import { cn } from "@/lib/utils";

import type { DonutChartProps, DonutSegment } from "./donut-chart.types";

const COLORS = [
  "var(--ks-primary)",
  "var(--ks-kinpaku)",
  "var(--ks-success)",
  "var(--ks-warning)",
  "var(--ks-danger)",
  "var(--ks-info)",
];

export function buildDonutOption(
  segments: DonutSegment[],
  strokeWidth: number,
  centerLabel?: string,
  centerValue?: string | number,
  theme = resolveChartTheme()
) {
  const inner = Math.max(0, 50 - (strokeWidth / 2 / 160) * 100);
  return {
    animation: true,
    color: theme.palette,
    title: {
      show: centerLabel !== undefined || centerValue !== undefined,
      text: centerValue === undefined ? "" : String(centerValue),
      subtext: centerLabel ?? "",
      left: "center",
      top: "center",
      textStyle: { color: theme.textColor, fontSize: 22, fontWeight: 800 },
      subtextStyle: { color: theme.faintTextColor, fontSize: 11 },
    },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: [`${inner}%`, "100%"],
        label: { show: false },
        itemStyle: { borderColor: theme.surfaceColor, borderWidth: 1, borderRadius: 4 },
        data: segments.map((segment, index) => ({
          name: segment.label,
          value: segment.value,
          itemStyle: {
            color: segment.color
              ? resolveChartColor(segment.color, theme.tokenColors)
              : theme.palette[index % theme.palette.length],
          },
        })),
      },
    ],
  };
}

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
  const theme = resolveChartTheme();
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const summary = segments.map((segment) => `${segment.label} ${segment.value}`).join(", ");
  return (
    <div className={cn("flex flex-col items-center gap-(--spacing-lg)", className)} style={style}>
      <EChartsContainer
        option={buildDonutOption(segments, strokeWidth, centerLabel, centerValue, theme)}
        width={size}
        height={size}
        ariaLabel={`Donut chart: ${summary}`}
      />
      {showLegend && (
        <div className="flex flex-col gap-(--spacing-xs) w-full">
          {segments.map((segment, index) => (
            <div key={segment.label} className="flex items-center gap-(--spacing-sm)">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: segment.color ?? COLORS[index % COLORS.length] }}
              />
              <span className="text-body-caption text-muted flex-1">{segment.label}</span>
              <span className="text-body-caption font-semibold text-foreground">
                {total > 0 ? Math.round((segment.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
