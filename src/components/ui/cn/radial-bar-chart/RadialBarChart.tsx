"use client";

import type { EChartsOption } from "echarts";
import { BarChart as EChartsBarChart } from "echarts/charts";
import { PolarComponent, TooltipComponent } from "echarts/components";
import { use as useECharts } from "echarts/core";

import { EChartsContainer } from "@/lib/echarts";
import { resolveChartColor, resolveChartTheme } from "@/lib/echarts/chart-theme";
import { cn } from "@/lib/utils";

import type { RadialBarChartProps, RadialBarSegment } from "./radial-bar-chart.types";

// ECharts registration is global and idempotent; keep the chart module set local.
// eslint-disable-next-line react-hooks/rules-of-hooks
useECharts([EChartsBarChart, PolarComponent, TooltipComponent]);

const COLORS = [
  "var(--ks-primary)",
  "var(--ks-kinpaku)",
  "var(--ks-success)",
  "var(--ks-warning)",
  "var(--ks-danger)",
  "var(--ks-info)",
];

export function buildRadialBarOption(segments: RadialBarSegment[], theme = resolveChartTheme()): EChartsOption {
  return {
    animation: true,
    tooltip: { trigger: "item" },
    polar: { radius: ["22%", "90%"] },
    angleAxis: { max: Math.max(...segments.map((segment) => segment.value), 1), startAngle: 90, show: false },
    radiusAxis: { type: "category", data: segments.map((segment) => segment.label), show: false },
    series: segments.map((segment, index) => ({
      type: "bar",
      coordinateSystem: "polar",
      roundCap: true,
      barGap: "-100%",
      data: [{ value: segment.value }],
      itemStyle: {
        color: segment.color
          ? resolveChartColor(segment.color, theme.tokenColors)
          : theme.palette[index % theme.palette.length],
      },
    })),
  };
}

export function RadialBarChart({
  segments,
  size = 240,
  showLegend = true,
  showTooltip = true,
  className,
  style,
}: RadialBarChartProps) {
  const theme = resolveChartTheme();
  const summary = segments.map((segment) => `${segment.label} ${segment.value}`).join(", ");
  const option = buildRadialBarOption(segments, theme);
  if (!showTooltip) option.tooltip = { show: false };
  return (
    <div className={cn("flex flex-col items-center gap-(--spacing-lg)", className)} style={style}>
      <EChartsContainer option={option} width={size} height={size} ariaLabel={`Radial bar chart: ${summary}`} />
      {showLegend && (
        <div className="flex flex-col gap-(--spacing-xs) w-full">
          {segments.map((segment, index) => (
            <div key={segment.label} className="flex items-center gap-(--spacing-sm)">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: segment.color ?? COLORS[index % COLORS.length] }}
              />
              <span className="text-body-caption text-muted flex-1">{segment.label}</span>
              <span className="text-body-caption font-semibold text-foreground">{segment.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
