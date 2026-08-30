"use client";

import type { EChartsOption } from "echarts";
import { LineChart as EChartsLineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { use as useECharts } from "echarts/core";

import { EChartsContainer, resolveChartColor, resolveChartTheme, type ChartTheme } from "@/lib/echarts";
import { cn } from "@/lib/utils";

import type { AreaChartDataPoint, AreaChartProps, AreaChartSeries } from "./area-chart.types";

// ECharts registration is global and idempotent; keep the chart module set local.
// eslint-disable-next-line react-hooks/rules-of-hooks
useECharts([EChartsLineChart, GridComponent, TooltipComponent]);

const SERIES_COLORS = [
  "var(--ks-primary)",
  "var(--ks-kinpaku)",
  "var(--ks-info)",
  "var(--ks-success)",
  "var(--ks-warning)",
  "var(--ks-danger)",
];

export function buildAreaOption(
  data: AreaChartDataPoint[],
  series: AreaChartSeries[],
  options: Pick<AreaChartProps, "showGrid" | "showDots" | "showTooltip" | "stacked" | "gradient" | "height"> & {
    theme: ChartTheme;
  }
): EChartsOption {
  const values = series.map((item) => data.map((point) => Number(point[item.key]) || 0));
  const max = options.stacked
    ? Math.max(...data.map((_, index) => values.reduce((sum, item) => sum + (item[index] ?? 0), 0)), 1)
    : Math.max(...values.flat(), 1);
  return {
    animation: true,
    grid: { left: 44, right: 16, top: 16, bottom: 32, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((point) => String(point.label)),
      axisLine: { lineStyle: { color: options.theme.axisColor } },
      axisTick: { show: false },
      axisLabel: { color: options.theme.faintTextColor, fontSize: 10 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max,
      splitNumber: 4,
      axisLabel: { color: options.theme.faintTextColor, fontSize: 10 },
      splitLine: { show: options.showGrid, lineStyle: { color: options.theme.axisColor } },
      axisLine: { show: false },
    },
    tooltip: { show: options.showTooltip, trigger: "axis" },
    series: series.map((item, index) => {
      const color = resolveChartColor(
        item.color ?? SERIES_COLORS[index % SERIES_COLORS.length],
        options.theme.tokenColors
      );
      return {
        name: item.label ?? item.key,
        type: "line",
        data: values[index],
        stack: options.stacked ? "total" : undefined,
        symbol: options.showDots ? "circle" : "none",
        symbolSize: options.showDots ? 6 : 0,
        showSymbol: options.showDots,
        lineStyle: { color, width: 2, join: "round", cap: "round" },
        itemStyle: { color, borderColor: options.theme.surfaceColor, borderWidth: 1.5 },
        areaStyle: { color, opacity: options.gradient ? 1 : 0.15 },
      };
    }),
  };
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
  const option = buildAreaOption(data, series, {
    showGrid,
    showDots,
    showTooltip,
    stacked,
    gradient,
    height,
    theme: resolveChartTheme(),
  });
  return (
    <div className={cn(className)} style={style}>
      <EChartsContainer
        option={option}
        height={height}
        ariaLabel={`Area chart: ${series.map((item) => item.label ?? item.key).join(", ")}`}
      />
      {showLegend && (
        <div className="flex flex-wrap gap-x-(--spacing-lg) gap-y-(--spacing-2xs) px-(--spacing-2xs)">
          {series.map((item, index) => (
            <div key={item.key} className="flex items-center gap-(--spacing-xs)">
              <div
                suppressHydrationWarning
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: item.color ?? SERIES_COLORS[index % SERIES_COLORS.length] }}
              />
              <span className="text-body-caption text-muted">{item.label ?? item.key}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
