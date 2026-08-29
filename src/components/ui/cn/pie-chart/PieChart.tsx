import { cn } from "@/lib/utils";

import type { PieChartProps } from "./pie-chart.types";

/**
 * PieChart — absorvido de shadcn-dashboard-library/variants/pie-chart, mas
 * reescrito do zero (ver docs/design-system-maintenance/new-components-remaining/PLAN.md):
 * a origem usa recharts (`Pie`/`PieChart`), e nenhum outro tipo de `Chart` da
 * Kikito CN usa recharts hoje — mesma técnica hand-rolled em SVG do
 * `DonutChart` (que só desenha um anel via stroke, não serve pra fatia
 * preenchida). Fatias aqui são `<path>` com comando de arco (`A`), não
 * `<circle>` com stroke-dasharray.
 */
const DEFAULT_COLORS = [
  "var(--ks-primary)",
  "var(--ks-kinpaku)",
  "var(--ks-success)",
  "var(--ks-warning)",
  "var(--ks-danger)",
  "var(--ks-info)",
];

// Precisão fixa pra evitar mismatch de hidratação: Math.cos/Math.sin podem
// produzir os últimos dígitos decimais diferentes entre o Node do SSR e o V8
// do browser (mesmo algoritmo, arredondamento de ponto flutuante diferente
// na casa dos ~10 dígitos) — achado real, confirmado via Playwright (o `d`
// do <path> batia até a 10ª casa e divergia na 11ª). Arredondar corta essa
// divergência antes dela aparecer no atributo.
function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** Ponto na borda do círculo pra um ângulo em graus, 0° = topo, sentido horário. */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: round(cx + r * Math.cos(rad)), y: round(cy + r * Math.sin(rad)) };
}

/** Path de uma fatia (setor) do centro até a borda, arco entre startAngle e endAngle. */
function describeSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
}

export function PieChart({ segments, size = 160, showLegend = true, className, style }: PieChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;
  const chartSummary = segments.map((s) => `${s.label} ${s.value}`).join(", ");

  // Fatia única (100%) não dá pra desenhar como arco (start === end, degenerado)
  // — cai pra um círculo cheio comum.
  const singleFullSlice = segments.length === 1 && total > 0;

  let angle = 0;

  return (
    <div className={cn("flex flex-col items-center gap-(--spacing-lg)", className)} style={style}>
      <svg width={size} height={size} role="img" aria-label={`Pie chart: ${chartSummary}`}>
        {total === 0 && <circle cx={cx} cy={cy} r={r} fill="var(--ks-graphite)" />}

        {total > 0 && singleFullSlice && (
          <circle cx={cx} cy={cy} r={r} fill={segments[0]?.color ?? DEFAULT_COLORS[0]} />
        )}

        {total > 0 &&
          !singleFullSlice &&
          segments.map((seg, i) => {
            const pct = seg.value / total;
            const startAngle = angle;
            const endAngle = angle + pct * 360;
            angle = endAngle;
            const color = seg.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
            if (pct <= 0) return null;
            return (
              <path
                key={seg.label}
                d={describeSlice(cx, cy, r, startAngle, endAngle)}
                fill={color}
                stroke="var(--ks-raised)"
                strokeWidth={1}
              />
            );
          })}
      </svg>

      {showLegend && (
        <div className="flex flex-col gap-(--spacing-xs) w-full">
          {segments.map((seg, i) => {
            const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
            const color = seg.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
            return (
              <div key={seg.label} className="flex items-center gap-(--spacing-sm)">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-body-caption text-muted flex-1">{seg.label}</span>
                <span className="text-body-caption font-semibold text-foreground">{pct}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
