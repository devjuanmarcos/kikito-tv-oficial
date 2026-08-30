"use client";

import type { EChartsOption } from "echarts";
import { BarChart as EChartsBarChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import { use as useECharts } from "echarts/core";
import { useEffect, useState } from "react";

import { EChartsContainer } from "@/lib/echarts";
import { resolveChartColor, resolveChartTheme } from "@/lib/echarts/chart-theme";
import { cn } from "@/lib/utils";

import type { BarChartItem, BarChartProps } from "./bar-chart.types";

// ECharts registration is global and idempotent; keep the chart module set local.
// eslint-disable-next-line react-hooks/rules-of-hooks
useECharts([EChartsBarChart, GridComponent]);

interface BarOptionArgs {
  orientation: "vertical" | "horizontal";
  barWidth: number;
  showValues: boolean;
  showBaseline: boolean;
  color?: string;
  theme: ReturnType<typeof resolveChartTheme>;
  height?: number;
  animate?: boolean;
  visible?: boolean;
}

export function buildBarOption(data: BarChartItem[], args: BarOptionArgs): EChartsOption {
  const {
    orientation,
    barWidth,
    showValues,
    showBaseline,
    color,
    theme,
    height = 200,
    animate = false,
    visible = true,
  } = args;
  const max = Math.max(...data.map((item) => item.value), 1);
  const values = data.map((item) => {
    const fill = item.color
      ? resolveChartColor(item.color, theme.tokenColors)
      : color
        ? resolveChartColor(color, theme.tokenColors)
        : theme.primaryColor;
    const rendered = visible ? item.value : 0;
    return {
      value: rendered,
      itemStyle: { color: fill },
      label: {
        show: showValues && visible && (orientation === "horizontal" || (item.value / max) * (height - 32) > 12),
      },
    };
  });
  const axis = {
    axisLine: { show: showBaseline, lineStyle: { color: theme.axisColor } },
    axisTick: { show: false },
    axisLabel: { color: theme.faintTextColor },
  };
  return {
    animation: animate && visible,
    grid: { left: orientation === "horizontal" ? 72 : 8, right: 12, top: 12, bottom: 28, containLabel: true },
    xAxis:
      orientation === "horizontal"
        ? { type: "value", max, ...axis }
        : { type: "category", data: data.map((item) => item.label), ...axis },
    yAxis:
      orientation === "horizontal"
        ? {
            type: "category",
            data: data.map((item) => item.label),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: theme.faintTextColor },
          }
        : { type: "value", max, ...axis },
    series: [
      {
        type: "bar",
        barWidth,
        data: values,
        itemStyle: { borderRadius: 4 },
        label: { show: showValues, formatter: ({ value }: { value: unknown }) => String(value) },
      },
    ],
  };
}

export function BarChart({
  data,
  height = 200,
  width = 320,
  barWidth = 36,
  gap: _gap = 12,
  showValues = true,
  showBaseline = true,
  color,
  animate = true,
  orientation = "vertical",
  className,
  style,
}: BarChartProps) {
  const [visible, setVisible] = useState(!animate);
  useEffect(() => {
    if (!animate || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    const element = document.querySelector(
      `[aria-label="Bar chart: ${data.map((item) => `${item.label} ${item.value}`).join(", ")}"]`
    );
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [animate, data]);
  const theme = resolveChartTheme();
  const summary = data.map((item) => `${item.label} ${item.value}`).join(", ");
  return (
    <EChartsContainer
      className={cn(className)}
      style={style}
      option={buildBarOption(data, {
        orientation,
        barWidth,
        showValues,
        showBaseline,
        color,
        theme,
        height,
        animate,
        visible,
      })}
      width={orientation === "horizontal" ? width : "100%"}
      height={orientation === "horizontal" ? Math.max(data.length * (barWidth + 12) - 12, barWidth) : height}
      ariaLabel={`Bar chart: ${summary}`}
    />
  );
}
