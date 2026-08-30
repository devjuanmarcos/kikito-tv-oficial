"use client";

import { PieChart as EChartsPieChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { use as useECharts } from "echarts/core";

import { EChartsContainer } from "@/lib/echarts";
import { resolveChartColor, resolveChartTheme } from "@/lib/echarts/chart-theme";
import { cn } from "@/lib/utils";

import type { PieChartProps, PieSegment } from "./pie-chart.types";

// ECharts registration is global and idempotent; keep the chart module set local.
// eslint-disable-next-line react-hooks/rules-of-hooks
useECharts([EChartsPieChart, TooltipComponent]);

const COLORS = [
  "var(--ks-primary)",
  "var(--ks-kinpaku)",
  "var(--ks-success)",
  "var(--ks-warning)",
  "var(--ks-danger)",
  "var(--ks-info)",
];

export function buildPieOption(segments: PieSegment[], theme = resolveChartTheme()) {
  return {
    animation: true,
    color: theme.palette,
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "90%",
        label: { show: false },
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

export function PieChart({ segments, size = 160, showLegend = true, className, style }: PieChartProps) {
  const theme = resolveChartTheme();
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const summary = segments.map((segment) => `${segment.label} ${segment.value}`).join(", ");
  return (
    <div className={cn("flex flex-col items-center gap-(--spacing-lg)", className)} style={style}>
      <EChartsContainer
        option={buildPieOption(segments, theme)}
        width={size}
        height={size}
        ariaLabel={`Pie chart: ${summary}`}
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
