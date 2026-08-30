"use client";

import type { EChartsOption } from "echarts";
import * as echarts from "echarts/core";
import type { ECharts } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { useEffect, useRef } from "react";

import { resolveChartColor, withMotionPreference } from "./chart-theme";

echarts.use([SVGRenderer]);

function resolveOptionTokens(value: unknown): unknown {
  if (typeof value === "string") return resolveChartColor(value);
  if (Array.isArray(value)) return value.map(resolveOptionTokens);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, resolveOptionTokens(entry)]));
  }
  return value;
}

export interface EChartsContainerProps {
  option: EChartsOption;
  width?: number | string;
  height: number | string;
  ariaLabel: string;
  className?: string;
  style?: React.CSSProperties;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function EChartsContainer({
  option,
  width = "100%",
  height,
  ariaLabel,
  className,
  style,
}: EChartsContainerProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;
    const chart = echarts.init(elementRef.current, undefined, { renderer: "svg" });
    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(elementRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const resolvedOption = resolveOptionTokens(option) as Record<string, unknown>;
    chart.setOption(withMotionPreference(resolvedOption, prefersReducedMotion()) as EChartsOption, true);
  }, [option]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const chart = chartRef.current;
      if (chart) {
        const resolvedOption = resolveOptionTokens(option) as Record<string, unknown>;
        chart.setOption(withMotionPreference(resolvedOption, media.matches) as EChartsOption, true);
      }
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [option]);

  return (
    <div ref={elementRef} className={className} style={{ width, height, ...style }} role="img" aria-label={ariaLabel} />
  );
}
