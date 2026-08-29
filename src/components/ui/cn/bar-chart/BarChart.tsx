"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { BarChartProps } from "./bar-chart.types";

// Reservado pro label de categoria em orientation="horizontal" (texto à esquerda da trilha).
const HORIZONTAL_LABEL_AREA = 72;

export function BarChart({
  data,
  height = 200,
  width = 320,
  barWidth = 36,
  gap = 12,
  showValues = true,
  showBaseline = true,
  color,
  animate = true,
  orientation = "vertical",
  className,
  style,
}: BarChartProps) {
  const [visible, setVisible] = useState(!animate);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!animate) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [animate]);

  // fontSize={11} abaixo: atributo numérico de <text> em SVG, sem classe Tailwind aplicável ao viewBox
  const max = Math.max(...data.map((d) => d.value), 1);
  const chartSummary = data.map((d) => `${d.label} ${d.value}`).join(", ");

  if (orientation === "horizontal") {
    const trackW = width - HORIZONTAL_LABEL_AREA - 8;
    const totalH = data.length * (barWidth + gap) - gap;

    return (
      <svg
        ref={ref}
        className={cn("overflow-visible", className)}
        width={width}
        height={totalH}
        style={style}
        role="img"
        aria-label={`Bar chart: ${chartSummary}`}
      >
        {showBaseline && (
          <line
            x1={HORIZONTAL_LABEL_AREA}
            y1={0}
            x2={HORIZONTAL_LABEL_AREA}
            y2={totalH}
            stroke="var(--ks-rule)"
            strokeWidth={1}
          />
        )}

        {data.map((item, i) => {
          const barL = visible ? (item.value / max) * trackW : 0;
          const y = i * (barWidth + gap);
          const cy = y + barWidth / 2;
          const fillColor = item.color ?? color ?? "var(--ks-primary)";

          return (
            <g key={item.label}>
              <text x={HORIZONTAL_LABEL_AREA - 8} y={cy + 4} textAnchor="end" fontSize={11} fill="var(--ks-text-faint)">
                {item.label}
              </text>
              <rect
                x={HORIZONTAL_LABEL_AREA}
                y={y}
                width={visible ? barL : 0}
                height={barWidth}
                rx={4}
                fill={fillColor}
                style={{
                  transition: animate ? "width 0.6s cubic-bezier(0.4,0,0.2,1)" : undefined,
                }}
              />
              {showValues && (
                <text
                  x={HORIZONTAL_LABEL_AREA + barL + 6}
                  y={cy + 4}
                  textAnchor="start"
                  fontSize={11}
                  fontWeight={600}
                  fill="var(--ks-text-muted)"
                >
                  {item.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  const chartH = height - 32;
  const totalW = data.length * (barWidth + gap) - gap + 2;

  return (
    <svg
      ref={ref}
      className={cn("overflow-visible", className)}
      width={totalW}
      height={height}
      style={style}
      role="img"
      aria-label={`Bar chart: ${chartSummary}`}
    >
      {showBaseline && <line x1={0} y1={chartH} x2={totalW} y2={chartH} stroke="var(--ks-rule)" strokeWidth={1} />}

      {data.map((item, i) => {
        const barH = visible ? (item.value / max) * chartH : 0;
        const x = i * (barWidth + gap) + 1;
        const y = chartH - barH;
        const fillColor = item.color ?? color ?? "var(--ks-primary)";

        return (
          <g key={item.label}>
            <rect
              x={x}
              y={visible ? y : chartH}
              width={barWidth}
              height={visible ? barH : 0}
              rx={4}
              fill={fillColor}
              style={{
                transition: animate
                  ? "height 0.6s cubic-bezier(0.4,0,0.2,1), y 0.6s cubic-bezier(0.4,0,0.2,1)"
                  : undefined,
              }}
            />
            {showValues && barH > 12 && (
              <text
                x={x + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="var(--ks-text-muted)"
              >
                {item.value}
              </text>
            )}
            <text x={x + barWidth / 2} y={chartH + 16} textAnchor="middle" fontSize={11} fill="var(--ks-text-faint)">
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
