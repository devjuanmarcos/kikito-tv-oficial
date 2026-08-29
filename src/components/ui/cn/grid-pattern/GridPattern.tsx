import { cn } from "@/lib/utils";

import type { GridPatternProps } from "./grid-pattern.types";

function buildPattern(type: string, size: number, color: string): string {
  const c = encodeURIComponent(color);
  const s = size;
  if (type === "dots") {
    return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'%3E%3Ccircle cx='${s / 2}' cy='${s / 2}' r='1' fill='${c}'/%3E%3C/svg%3E")`;
  }
  if (type === "lines") {
    return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'%3E%3Cline x1='0' y1='0' x2='0' y2='${s}' stroke='${c}' stroke-width='1'/%3E%3C/svg%3E")`;
  }
  if (type === "cross") {
    return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'%3E%3Cline x1='${s / 2}' y1='0' x2='${s / 2}' y2='${s}' stroke='${c}' stroke-width='1'/%3E%3Cline x1='0' y1='${s / 2}' x2='${s}' y2='${s / 2}' stroke='${c}' stroke-width='1'/%3E%3C/svg%3E")`;
  }
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'%3E%3Crect width='${s}' height='${s}' fill='none' stroke='${c}' stroke-width='0.5'/%3E%3C/svg%3E")`;
}

export function GridPattern({
  type = "dots",
  size = 24,
  // currentColor: cor é embutida numa data-URI de SVG gerada em runtime — não dá pra usar
  // classe Tailwind aí. Herdar de currentColor deixa o consumidor controlar via text-* no
  // pai, sem precisar de valor cru hardcoded
  color = "currentColor",
  opacity = 0.15,
  className,
  style,
  children,
}: GridPatternProps) {
  const bgImage = buildPattern(type, size, color);

  return (
    <div className={cn("relative", className)} style={style}>
      {/* camada puramente decorativa — não deve ser exposta a leitores de tela */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: bgImage, backgroundSize: `${size}px ${size}px`, opacity }}
      />
      {children && <div className="relative z-[1]">{children}</div>}
    </div>
  );
}
