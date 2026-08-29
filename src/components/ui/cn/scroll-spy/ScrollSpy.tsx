"use client";

import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

import type { ScrollSpyProps } from "./scroll-spy.types";

export function ScrollSpy({ items, offset = 80, className, style }: ScrollSpyProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY + offset + 1;
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActiveId(items[i].id);
          return;
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [items, offset]);

  return (
    // aria-label: sem isso, um leitor de tela não distingue este <nav> de outro na mesma
    // página (ex: header) quando navegando por landmarks
    <nav aria-label="Table of contents" className={cn("flex flex-col gap-(--spacing-3xs)", className)} style={style}>
      {items.map((item) => {
        const isActive = activeId === item.id;
        const isDeep = item.depth === 2;
        return (
          <button
            key={item.id}
            type="button"
            // aria-current="location": token específico do WAI-ARIA pra "elemento
            // representando a localização atual dentro de um contexto" — mais preciso que
            // o "true" genérico pra esse caso de scroll-spy (mesma precisão já usada em
            // aria-current="step" no StepForm/ProgressSteps, "page" seria pra paginação)
            aria-current={isActive ? "location" : undefined}
            onClick={() => {
              setActiveId(item.id);
              // achado real: scrollIntoView({behavior:'smooth'}) nunca checava
              // prefers-reduced-motion — diferente de animação CSS, essa API não respeita
              // a preferência do SO sozinha quando o valor vem direto do JS
              const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              document.getElementById(item.id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
            }}
            className={cn(
              // gap-2.5 (0.625rem): sem match exato na escala de spacing
              "flex items-center gap-2.5 text-left px-(--spacing-md) py-(--spacing-xs) rounded-(--radius-sm) text-body-callout transition-colors duration-150 w-full",
              isDeep && "pl-(--spacing-xl)",
              isActive
                ? "text-patina font-semibold bg-patina-soft"
                : "text-muted hover:text-foreground hover:bg-graphite"
            )}
          >
            {/* w-[3px]/min-h-3: espessura/altura da barra indicadora, escala própria do componente */}
            <span
              className={cn(
                "shrink-0 w-[3px] rounded-full self-stretch min-h-3 transition-all duration-200",
                isActive ? "bg-patina" : "bg-transparent"
              )}
            />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
