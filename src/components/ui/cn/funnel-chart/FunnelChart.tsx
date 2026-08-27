import React from "react";

import { cn } from "@/lib/utils";

import type { FunnelChartProps } from "./funnel-chart.types";

const STAGE_COLORS = [
  "var(--ks-primary)",
  "var(--ks-info)",
  "var(--ks-kinpaku)",
  "var(--ks-success)",
  "var(--ks-warning)",
  "var(--ks-danger)",
];
// texto de contraste pareado 1:1 com STAGE_COLORS (mesmos índices)
const STAGE_FG_CLS = [
  "text-patina-fg",
  "text-info-fg",
  "text-kinpaku-fg",
  "text-success-fg",
  "text-warning-fg",
  "text-danger-fg",
];

export function FunnelChart({
  stages,
  showValues = true,
  showPercent = true,
  showConversion = true,
  className,
  style,
}: FunnelChartProps) {
  if (stages.length === 0) return null;
  const maxVal = stages[0].value;

  return (
    <div className={cn("flex flex-col gap-(--spacing-xs) w-full", className)} style={style}>
      {stages.map((stage, i) => {
        const widthPct = maxVal > 0 ? (stage.value / maxVal) * 100 : 100;
        const color = stage.color ?? STAGE_COLORS[i % STAGE_COLORS.length];
        const prevVal = stages[i - 1]?.value;
        const convRate = prevVal && prevVal > 0 ? (stage.value / prevVal) * 100 : null;

        return (
          <React.Fragment key={stage.label}>
            {showConversion && i > 0 && convRate !== null && (
              <div className="flex items-center gap-(--spacing-xs) justify-center text-body-caption text-faint">
                <span aria-hidden="true">▼</span>
                <span>{convRate.toFixed(1)}% conversion</span>
              </div>
            )}
            <div className="flex items-center gap-(--spacing-md)">
              <div
                className="rounded-(--radius-sm) h-11 flex items-center justify-center transition-all duration-500"
                style={{ width: `${widthPct}%`, background: color, marginInline: `${(100 - widthPct) / 2}%` }}
              >
                <span
                  className={cn(
                    // text-white: exceção só quando stage.color é uma cor customizada arbitrária do
                    // consumidor (sem token de contraste garantido); pro default (STAGE_COLORS) usa o -fg pareado
                    stage.color ? "text-white" : STAGE_FG_CLS[i % STAGE_FG_CLS.length],
                    "font-medium text-body-callout px-(--spacing-sm) truncate"
                  )}
                >
                  {stage.label}
                </span>
              </div>
              {(showValues || showPercent) && (
                <div className="shrink-0 flex gap-(--spacing-xs) text-body-caption">
                  {showValues && <span className="font-semibold text-foreground">{stage.value.toLocaleString()}</span>}
                  {showPercent && (
                    <span className="text-faint">
                      ({maxVal > 0 ? ((stage.value / maxVal) * 100).toFixed(1) : 100}%)
                    </span>
                  )}
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
