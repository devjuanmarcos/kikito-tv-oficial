import React from "react";

import { cn } from "@/lib/utils";

import type { FunnelChartProps } from "./funnel-chart.types";

const STAGE_COLORS = [
  "var(--ks-patina)",
  "var(--ks-info)",
  "var(--ks-kinpaku)",
  "var(--ks-success)",
  "var(--ks-warning)",
  "var(--ks-danger)",
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
    <div className={cn("flex flex-col gap-1.5 w-full", className)} style={style}>
      {stages.map((stage, i) => {
        const widthPct = maxVal > 0 ? (stage.value / maxVal) * 100 : 100;
        const color = stage.color ?? STAGE_COLORS[i % STAGE_COLORS.length];
        const prevVal = stages[i - 1]?.value;
        const convRate = prevVal && prevVal > 0 ? (stage.value / prevVal) * 100 : null;

        return (
          <React.Fragment key={stage.label}>
            {showConversion && i > 0 && convRate !== null && (
              <div className="flex items-center gap-1.5 justify-center text-body-caption text-faint">
                <span>▼</span>
                <span>{convRate.toFixed(1)}% conversion</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div
                className="rounded-(--radius-sm) h-11 flex items-center justify-center transition-all duration-500"
                style={{ width: `${widthPct}%`, background: color, marginInline: `${(100 - widthPct) / 2}%` }}
              >
                <span className="text-white font-medium text-body-callout px-2 truncate">{stage.label}</span>
              </div>
              {(showValues || showPercent) && (
                <div className="shrink-0 flex gap-1.5 text-body-caption">
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
