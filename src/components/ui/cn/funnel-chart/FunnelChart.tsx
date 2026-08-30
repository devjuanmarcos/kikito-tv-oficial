"use client";

import type { EChartsOption } from "echarts";

import { EChartsContainer, resolveChartColor, resolveChartTheme, type ChartTheme } from "@/lib/echarts";
import { cn } from "@/lib/utils";

import type { FunnelChartProps, FunnelStage } from "./funnel-chart.types";

const STAGE_COLORS = [
  "var(--ks-primary)",
  "var(--ks-info)",
  "var(--ks-kinpaku)",
  "var(--ks-success)",
  "var(--ks-warning)",
  "var(--ks-danger)",
];

export function buildFunnelOption(
  stages: FunnelStage[],
  theme: ChartTheme,
  display: Pick<FunnelChartProps, "showValues" | "showPercent" | "showConversion"> = {}
): EChartsOption {
  const showValues = display.showValues ?? true;
  const showPercent = display.showPercent ?? true;
  const showConversion = display.showConversion ?? true;
  const max = stages[0]?.value ?? 0;
  return {
    animation: true,
    tooltip: { trigger: "item" },
    legend: { show: false },
    series: [
      {
        type: "funnel",
        sort: "none",
        min: 0,
        max: stages[0]?.value ?? 0,
        minSize: "0%",
        maxSize: "100%",
        gap: 4,
        left: "8%",
        right: "8%",
        top: "4%",
        bottom: "4%",
        label: {
          color: theme.textColor,
          fontSize: 12,
          formatter: (params) => {
            const data = params.data as { conversion?: number; percent?: number } | undefined;
            const parts = [params.name];
            if (showValues) parts.push(String(params.value));
            if (showPercent) parts.push(`(${data?.percent?.toFixed(1) ?? "0.0"}%)`);
            if (showConversion && data?.conversion !== undefined)
              parts.push(`${data.conversion.toFixed(1)}% conversion`);
            return parts.join(" ");
          },
        },
        labelLine: { show: false },
        itemStyle: { borderColor: theme.surfaceColor, borderWidth: 1 },
        data: stages.map((stage, index) => ({
          name: stage.label,
          value: stage.value,
          percent: max > 0 ? (stage.value / max) * 100 : 100,
          conversion:
            index > 0 && stages[index - 1].value > 0 ? (stage.value / stages[index - 1].value) * 100 : undefined,
          itemStyle: {
            color: resolveChartColor(stage.color ?? STAGE_COLORS[index % STAGE_COLORS.length], theme.tokenColors),
          },
        })),
      },
    ],
  };
}

export function FunnelChart({
  stages,
  height = 320,
  showValues = true,
  showPercent = true,
  showConversion = true,
  className,
  style,
}: FunnelChartProps) {
  if (stages.length === 0) return null;
  const option = buildFunnelOption(stages, resolveChartTheme(), { showValues, showPercent, showConversion });
  const summary = stages.map((stage) => `${stage.label} ${stage.value}`).join(", ");
  return (
    <div className={cn("w-full", className)} style={style}>
      <EChartsContainer option={option} height={height} ariaLabel={`Funnel chart: ${summary}`} />
    </div>
  );
}
