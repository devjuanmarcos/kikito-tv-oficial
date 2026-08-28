"use client";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

import type { TerminalLineType, TerminalBlockProps } from "./terminal-block.types";

// text-faint/80 diluía ainda mais um tom já fraco no texto de "output" — mas
// output é o conteúdo primário de um transcript de terminal, não decoração.
// Regra de ouro do text-faint (CLAUDE.md) pede text-muted pra esse caso.
const LINE_CLS: Record<TerminalLineType, string> = {
  command: "text-foreground",
  output: "text-muted",
  error: "text-danger",
  info: "text-info",
  success: "text-success",
};

function TrafficDots() {
  return (
    <div className="flex items-center gap-(--spacing-xs)">
      {/* bg-X/70: pontos decorativos imitando os controles de janela do macOS —
          sem equivalente -soft real pro caso (feito pra pills/badges, ficaria
          claro demais nesses pontos pequenos), mesma categoria de exceção já
          documentada em outros componentes */}
      <span className="w-3 h-3 rounded-full bg-danger/70" />
      <span className="w-3 h-3 rounded-full bg-warning/70" />
      <span className="w-3 h-3 rounded-full bg-success/70" />
    </div>
  );
}

// Achado real: a animação de "digitação" via setInterval nunca checava
// prefers-reduced-motion — além de ser puramente visual, ela também atrasava
// a chegada do conteúdo completo no DOM pra quem usa leitor de tela (as linhas
// além de `visibleCount` não existiam ainda, então o texto só ficava
// integralmente presente depois de `lines.length * 180ms`, mesmo sendo um
// transcript já conhecido de antemão, não dado ao vivo).
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function TerminalBlock({ lines, title = "Terminal", animate = false, className, style }: TerminalBlockProps) {
  const reducedMotion = usePrefersReducedMotion();
  const shouldAnimate = animate && !reducedMotion;
  const [visibleCount, setVisibleCount] = useState(shouldAnimate ? 0 : lines.length);

  useEffect(() => {
    if (!shouldAnimate) {
      setVisibleCount(lines.length);
      return;
    }
    setVisibleCount(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= lines.length) clearInterval(id);
    }, 180);
    return () => clearInterval(id);
  }, [shouldAnimate, lines]);

  return (
    <div
      style={style}
      className={cn("rounded-xl border border-rule overflow-hidden font-mono text-body-callout", className)}
    >
      {/* Title bar — py-2.5 (0.625rem): sem match exato na escala de spacing */}
      <div className="flex items-center justify-between px-(--spacing-lg) py-2.5 bg-graphite-2 border-b border-rule">
        <TrafficDots />
        <span className="text-body-caption text-faint">{title}</span>
        <div className="w-[3.75rem]" />
      </div>

      {/* Lines — bg-[#0d1117] intencional: corpo do terminal precisa ficar mais escuro que
          qualquer superfície do tema (bg-graphite-2 usado na title bar não é escuro o
          suficiente pra imitar um terminal real), independente de light/dark — sem token
          equivalente. */}
      <div className="bg-[#0d1117] px-(--spacing-lg) py-(--spacing-lg) space-y-(--spacing-2xs) min-h-[80px]">
        {lines.slice(0, visibleCount).map((line, i) => (
          <div key={i} className={cn("leading-relaxed", LINE_CLS[line.type ?? "output"])}>
            {line.type === "command" && (
              <span className="text-patina mr-(--spacing-xs) select-none">{line.prompt ?? "$"}</span>
            )}
            {line.text || <span>&nbsp;</span>}
          </div>
        ))}
        {shouldAnimate && visibleCount < lines.length && (
          // Cursor decorativo — opacidade aqui é um detalhe de UI (pisca-pisca),
          // não conteúdo, diferente do achado do text-faint/80 acima
          <span aria-hidden="true" className="inline-block w-[6px] h-4 bg-foreground/60 animate-pulse" />
        )}
      </div>
    </div>
  );
}
