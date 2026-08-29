import type { SparklineProps } from "./sparkline.types";

// var(--ks-*) direto no atributo fill/stroke do SVG (não classe Tailwind): intent é
// resolvido em runtime, Tailwind não alcança um valor dinâmico desses no atributo SVG
const INTENT_COLORS: Record<string, string> = {
  primary: "var(--ks-primary)",
  success: "var(--ks-success)",
  warning: "var(--ks-warning)",
  danger: "var(--ks-danger)",
  neutral: "var(--ks-text-muted)",
};

function defaultLabel(data: number[]): string {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const trend = data[data.length - 1] >= data[0] ? "up" : "down";
  return `Sparkline chart, trending ${trend}, values from ${min} to ${max}`;
}

export function Sparkline({
  data,
  type = "line",
  width = 80,
  height = 32,
  color,
  intent = "primary",
  strokeWidth = 1.5,
  filled = false,
  ariaLabel,
  className,
  style,
}: SparklineProps) {
  if (data.length < 2) return null;

  const resolvedColor = color ?? INTENT_COLORS[intent] ?? "currentColor";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;
  // achado real: nenhum tipo de gráfico tinha nome acessível — um SVG sem role/aria-label
  // é invisível ou anunciado sem informação nenhuma pra leitor de tela; resumo genérico
  // (tendência + faixa de valores) cobre o caso sem exigir uma prop obrigatória nova
  const label = ariaLabel ?? defaultLabel(data);

  function x(i: number) {
    return pad + (i / (data.length - 1)) * (width - pad * 2);
  }
  function y(v: number) {
    return pad + ((max - v) / range) * (height - pad * 2);
  }

  if (type === "bar") {
    const barW = Math.max(1, (width - pad * 2) / data.length - 2);
    return (
      <svg width={width} height={height} className={className} style={style} role="img" aria-label={label}>
        {data.map((v, i) => {
          const bh = ((v - min) / range) * (height - pad * 2);
          return (
            <rect
              key={i}
              x={pad + i * ((width - pad * 2) / data.length)}
              y={y(v)}
              width={barW}
              height={bh}
              fill={resolvedColor}
              opacity={0.8}
              rx={1}
            />
          );
        })}
      </svg>
    );
  }

  const points = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const linePath = `M ${data.map((v, i) => `${x(i)} ${y(v)}`).join(" L ")}`;
  const areaPath = `${linePath} L ${x(data.length - 1)} ${height - pad} L ${x(0)} ${height - pad} Z`;

  return (
    <svg width={width} height={height} className={className} style={style} role="img" aria-label={label}>
      {(type === "area" || filled) && <path d={areaPath} fill={resolvedColor} opacity={0.15} />}
      <polyline
        points={points}
        fill="none"
        stroke={resolvedColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
