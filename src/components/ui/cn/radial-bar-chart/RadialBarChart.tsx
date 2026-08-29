"use client";
/**
 * RadialBarChart — absorvido de shadcn-dashboard-library/variants/radial-chart
 * (decisão registrada em docs/design-system-maintenance/new-components-remaining/PLAN.md:
 * usar `recharts` como a origem, em vez de reimplementar em SVG puro — única
 * exceção entre os 8 tipos de `Chart`, todos os outros são hand-rolled).
 * Cada segmento vira um arco radial concêntrico (raio decrescente por série,
 * ângulo proporcional ao próprio valor) — diferente de `PieChart`/`DonutChart`
 * (fatias de um total único, mesmo raio).
 */
import { RadialBar, RadialBarChart as RechartsRadialBarChart, ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "@/lib/utils";

import type { RadialBarChartProps } from "./radial-bar-chart.types";

const DEFAULT_COLORS = [
  "var(--ks-primary)",
  "var(--ks-kinpaku)",
  "var(--ks-success)",
  "var(--ks-warning)",
  "var(--ks-danger)",
  "var(--ks-info)",
];

export function RadialBarChart({
  segments,
  size = 240,
  showLegend = true,
  showTooltip = true,
  className,
  style,
}: RadialBarChartProps) {
  const data = segments.map((s, i) => ({
    name: s.label,
    value: s.value,
    fill: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
  }));
  const chartSummary = segments.map((s) => `${s.label} ${s.value}`).join(", ");

  return (
    <div className={cn("flex flex-col items-center gap-(--spacing-lg)", className)} style={style}>
      {/* role=img/aria-label: recharts não expõe isso por padrão no SVG, diferente dos outros
          tipos de Chart (hand-rolled) que já têm essa convenção — restaurado aqui pra paridade. */}
      {/* width/height fixos: ResponsiveContainer mede o pai — sem isso, altura 0 */}
      <div role="img" aria-label={`Radial bar chart: ${chartSummary}`} style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadialBarChart data={data} innerRadius="22%" outerRadius="90%" startAngle={90} endAngle={-270}>
            {showTooltip && (
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: "var(--ks-lacquer-raised)",
                  border: "1px solid var(--ks-rule)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--ks-text)",
                  fontSize: "0.75rem",
                }}
                labelStyle={{ color: "var(--ks-text-faint)" }}
              />
            )}
            <RadialBar dataKey="value" background={{ fill: "var(--ks-graphite)" }} cornerRadius={4} />
          </RechartsRadialBarChart>
        </ResponsiveContainer>
      </div>

      {showLegend && (
        <div className="flex flex-col gap-(--spacing-xs) w-full">
          {segments.map((seg, i) => (
            <div key={seg.label} className="flex items-center gap-(--spacing-sm)">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: seg.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length] }}
              />
              <span className="text-body-caption text-muted flex-1">{seg.label}</span>
              <span className="text-body-caption font-semibold text-foreground">{seg.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
