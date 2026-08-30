"use client";

import type { EChartsOption } from "echarts";

import { EChartsContainer, resolveChartColor, resolveChartTheme, type ChartTheme } from "@/lib/echarts";
import { cn } from "@/lib/utils";

import type { LineChartProps, LineChartSeries } from "./line-chart.types";

const DEFAULT_COLORS = ["var(--ks-primary)", "var(--ks-kinpaku)", "var(--ks-success)", "var(--ks-danger)"];

export function buildLineOption(
  series: LineChartSeries[],
  labels: string[] | undefined,
  options: Pick<LineChartProps, "showArea" | "showDots" | "showGrid"> & { theme: ChartTheme }
): EChartsOption {
  const categories = labels ?? series[0]?.data.map((_, index) => String(index)) ?? [];
  const values = series.flatMap((item) => item.data);
  const palette = DEFAULT_COLORS.map((color) => resolveChartColor(color, options.theme.tokenColors));
  return {
    animation: true,
    grid: { left: 8, right: 8, top: 12, bottom: labels ? 24 : 12, containLabel: Boolean(labels) },
    xAxis: {
      type: "category",
      data: categories,
      axisLine: { lineStyle: { color: options.theme.axisColor } },
      axisTick: { show: false },
      axisLabel: { show: Boolean(labels), color: options.theme.faintTextColor, fontSize: 10 },
    },
    yAxis: {
      type: "value",
      min: Math.min(...values, 0),
      max: Math.max(...values, 1),
      splitNumber: 4,
      axisLabel: { color: options.theme.faintTextColor, fontSize: 10 },
      splitLine: { show: options.showGrid, lineStyle: { color: options.theme.axisColor } },
      axisLine: { show: false },
    },
    tooltip: { trigger: "axis" },
    legend: { show: false },
    series: series.map((item, index) => {
      const color = resolveChartColor(item.color ?? palette[index % palette.length], options.theme.tokenColors);
      return {
        name: item.label,
        type: "line",
        data: item.data,
        symbol: options.showDots ? "circle" : "none",
        symbolSize: options.showDots ? 6 : 0,
        showSymbol: options.showDots,
        lineStyle: { color, width: 2, join: "round" },
        itemStyle: { color },
        areaStyle: options.showArea ? { color, opacity: 0.12 } : undefined,
      };
    }),
  };
}

export function LineChart({
  series,
  labels,
  height = 200,
  width = "100%",
  showArea = true,
  showDots = true,
  showGrid = true,
  showLegend = true,
  className,
  style,
}: LineChartProps) {
  const option = buildLineOption(series, labels, { showArea, showDots, showGrid, theme: resolveChartTheme() });
  return (
    <div className={cn(className)} style={{ ...style, width }}>
      <EChartsContainer
        option={option}
        height={height}
        ariaLabel={`Line chart: ${series.map((item) => item.label).join(", ")}`}
      />
      {showLegend && series.length > 1 && (
        <div className="flex flex-wrap gap-x-(--spacing-lg) gap-y-(--spacing-2xs) mt-(--spacing-sm) px-(--spacing-2xs)">
          {series.map((item, index) => (
            <div key={item.label} className="flex items-center gap-(--spacing-xs)">
              <div
                className="w-6 h-[2px] rounded-full"
                style={{ background: resolveChartColor(item.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]) }}
              />
              <span className="text-body-caption text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
