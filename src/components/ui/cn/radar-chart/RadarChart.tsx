"use client";

import type { EChartsOption } from "echarts";
import { RadarChart as EChartsRadarChart } from "echarts/charts";
import { RadarComponent } from "echarts/components";
import { use as useECharts } from "echarts/core";

import { EChartsContainer, resolveChartColor, resolveChartTheme, type ChartTheme } from "@/lib/echarts";
import { cn } from "@/lib/utils";

import type { RadarAxis, RadarChartProps, RadarSeries } from "./radar-chart.types";

// ECharts registration is global and idempotent; keep the chart module set local.
// eslint-disable-next-line react-hooks/rules-of-hooks
useECharts([EChartsRadarChart, RadarComponent]);

const COLORS = ["var(--ks-primary)", "var(--ks-kinpaku)", "var(--ks-success)", "var(--ks-danger)"];

export function buildRadarOption(
  axes: RadarAxis[],
  series: RadarSeries[],
  levels: number,
  theme: ChartTheme
): EChartsOption {
  const indicator = axes.map((axis, index) => ({
    name: axis.label,
    max: axis.max ?? Math.max(...series.map((item) => item.data[index] ?? 0), 1),
  }));
  return {
    animation: true,
    radar: {
      indicator,
      splitNumber: levels,
      center: ["50%", "50%"] as [string, string],
      radius: "68%",
      axisName: { color: theme.faintTextColor, fontSize: 10 },
      axisLine: { lineStyle: { color: theme.axisColor } },
      splitLine: { lineStyle: { color: theme.axisColor } },
    },
    series: [
      {
        type: "radar",
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { width: 2, join: "round" },
        data: series.map((item, index) => {
          const color = resolveChartColor(item.color ?? COLORS[index % COLORS.length], theme.tokenColors);
          return {
            name: item.label,
            value: axes.map((_, axisIndex) => item.data[axisIndex] ?? 0),
            lineStyle: { color },
            areaStyle: { color, opacity: 0.15 },
            itemStyle: { color, borderColor: theme.surfaceColor, borderWidth: 1.5 },
          };
        }),
      },
    ],
  };
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
  const option = buildRadarOption(axes, series, levels, resolveChartTheme());
  return (
    <div className={cn("flex flex-col items-center gap-(--spacing-md)", className)} style={style}>
      <EChartsContainer
        option={option}
        width={size}
        height={size}
        ariaLabel={`Radar chart: ${series.map((item) => item.label).join(", ")}`}
      />
      {showLegend && series.length > 1 && (
        <div className="flex flex-wrap gap-x-(--spacing-lg) gap-y-(--spacing-2xs) justify-center">
          {series.map((item, index) => (
            <div key={item.label} className="flex items-center gap-(--spacing-xs)">
              <div suppressHydrationWarning
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: item.color ?? COLORS[index % COLORS.length] }}
              />
              <span className="text-body-caption text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
