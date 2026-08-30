"use client";

import type { EChartsOption, MarkLineComponentOption } from "echarts";
import { LineChart as EChartsLineChart } from "echarts/charts";
import { GridComponent, MarkLineComponent, TooltipComponent } from "echarts/components";
import { use as useECharts } from "echarts/core";

import { EChartsContainer, resolveChartColor, resolveChartTheme, type ChartTheme } from "@/lib/echarts";
import { cn } from "@/lib/utils";

import type { LineChartProps, LineChartReferenceLine, LineChartSeries } from "./line-chart.types";

// ECharts registration is global and idempotent; keep the chart module set local.
// eslint-disable-next-line react-hooks/rules-of-hooks
useECharts([EChartsLineChart, GridComponent, TooltipComponent, MarkLineComponent]);

const DEFAULT_COLORS = ["var(--ks-primary)", "var(--ks-kinpaku)", "var(--ks-success)", "var(--ks-danger)"];

export function buildLineOption(
  series: LineChartSeries[],
  labels: string[] | undefined,
  options: Pick<LineChartProps, "showArea" | "showDots" | "showGrid" | "referenceLine" | "step"> & {
    theme: ChartTheme;
  }
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
        step: options.step,
        markLine: index === 0 ? buildReferenceMarkLine(options.referenceLine, options.theme) : undefined,
      };
    }),
  };
}

/** markLine nativo do ECharts pra desenhar a linha de meta/media com rotulo. */
function buildReferenceMarkLine(
  referenceLine: LineChartReferenceLine | undefined,
  theme: ChartTheme
): MarkLineComponentOption | undefined {
  if (!referenceLine) return undefined;
  const color = referenceLine.color ? resolveChartColor(referenceLine.color, theme.tokenColors) : theme.mutedTextColor;
  return {
    silent: true,
    symbol: "none",
    lineStyle: { color, type: "dashed", width: 1.5 },
    label: {
      show: !!referenceLine.label,
      formatter: referenceLine.label ?? "",
      position: "end",
      color,
      fontSize: 10,
    },
    data: [{ yAxis: referenceLine.value }],
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
  referenceLine,
  step,
  className,
  style,
}: LineChartProps) {
  const option = buildLineOption(series, labels, {
    showArea,
    showDots,
    showGrid,
    referenceLine,
    step,
    theme: resolveChartTheme(),
  });
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
                suppressHydrationWarning
                className="w-6 h-[2px] rounded-full"
                style={{ background: item.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length] }}
              />
              <span className="text-body-caption text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
