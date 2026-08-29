"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

import type { MultiAccordionProps } from "./multi-accordion.types";

const INTENT_OPEN_BORDER: Record<string, string> = {
  primary: "border-l-[3px] border-l-patina",
  secondary: "border-l-[3px] border-l-kinpaku",
  tertiary: "border-l-[3px] border-l-violet",
  quaternary: "border-l-[3px] border-l-rose",
  success: "border-l-[3px] border-l-success",
  warning: "border-l-[3px] border-l-warning",
  danger: "border-l-[3px] border-l-danger",
  info: "border-l-[3px] border-l-info",
};

export function MultiAccordion({
  items,
  type = "multiple",
  value,
  defaultValue = [],
  onChange,
  variant = "default",
  className,
  style,
}: MultiAccordionProps) {
  // prefixa os ids por instância — item.id sozinho colidiria se a mesma lista de items
  // for reaproveitada em múltiplas instâncias de <MultiAccordion> na mesma página
  const instanceId = useId().replace(/:/g, "");
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const open = value !== undefined ? value : internal;

  const toggle = (id: string) => {
    const next =
      type === "single"
        ? open.includes(id)
          ? []
          : [id]
        : open.includes(id)
          ? open.filter((x) => x !== id)
          : [...open, id];
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  const isBordered = variant === "bordered";
  // achado real: "flush" era idêntico a "default" (só isBordered era checado) — o tipo
  // declarava 3 variantes visuais mas só 2 existiam de verdade. "flush" agora separa os
  // itens só por divisor, sem borda/raio por item — mesmo conceito já usado no AccordionGroup
  const isFlush = variant === "flush";

  return (
    <div
      className={cn(
        "flex flex-col",
        isBordered
          ? "border border-rule rounded-(--radius-md) overflow-hidden"
          : isFlush
            ? "divide-y divide-rule"
            : "gap-(--spacing-2xs)",
        className
      )}
      style={style}
    >
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const intent = item.intent ?? "neutral";
        const panelId = `multi-accordion-panel-${instanceId}-${item.id}`;
        const triggerId = `multi-accordion-trigger-${instanceId}-${item.id}`;
        return (
          <div
            key={item.id}
            className={cn(
              isBordered
                ? "border-b border-rule last:border-none"
                : isFlush
                  ? ""
                  : "border border-rule rounded-(--radius-md) overflow-hidden"
            )}
          >
            <button
              type="button"
              id={triggerId}
              className={cn(
                // py-[14px]: sem match exato na escala de spacing
                "w-full flex items-center justify-between gap-(--spacing-md) px-(--spacing-lg) py-[14px] bg-transparent border-none text-foreground text-body-callout font-semibold cursor-pointer text-left transition-[background] duration-[120ms] hover:bg-raised outline-none",
                isOpen && "text-patina",
                isOpen && (INTENT_OPEN_BORDER[intent] ?? ""),
                item.disabled && "opacity-40 cursor-not-allowed"
              )}
              disabled={item.disabled}
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              {item.title}
              <span
                className={cn(
                  "flex-shrink-0 text-body-caption text-faint transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
                aria-hidden
              >
                ▾
              </span>
            </button>
            {/* achado real: o painel só existia no DOM quando aberto (`{isOpen && <div>}`) —
                além de não animar (sem transição possível pra um nó que nem existe), aria-controls
                referenciava um id inexistente enquanto fechado, contra a recomendação WAI-ARIA
                ("hidden, not removed"). Agora sempre montado, alterna via aria-hidden + max-height,
                mesmo padrão já usado no AccordionGroup/Collapsible (siblings desta família) */}
            <div
              id={panelId}
              aria-labelledby={triggerId}
              role="region"
              aria-hidden={!isOpen}
              className={cn(
                "overflow-hidden transition-[max-height,opacity] duration-[220ms] ease-in-out",
                isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              {/* pb-[14px]: sem match exato na escala de spacing */}
              <div className="px-(--spacing-lg) pb-[14px] text-body-callout text-muted leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
