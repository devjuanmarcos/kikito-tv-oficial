"use client";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

import type { AccordionVariant, AccordionProps } from "./accordion.types";

const ChevronDown = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[0.9rem] h-[0.9rem]"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const VARIANT_WRAP: Record<AccordionVariant, string> = {
  default: "border border-rule rounded-(--radius-sm) divide-y divide-rule overflow-hidden",
  separated: "flex flex-col gap-(--spacing-sm)",
  ghost: "flex flex-col",
};
const VARIANT_ITEM_EXTRA: Record<AccordionVariant, string> = {
  default: "",
  separated: "border border-rule rounded-(--radius-sm) overflow-hidden",
  ghost: "border-b border-rule last:border-b-0",
};
const TRIGGER_CLS: Record<AccordionVariant, string> = {
  default: "px-(--spacing-lg) py-(--spacing-md) hover:bg-graphite",
  separated: "px-(--spacing-lg) py-(--spacing-md) hover:bg-graphite",
  ghost: "px-0 py-(--spacing-md) hover:text-foreground",
};

export function Accordion({
  items,
  value,
  defaultValue,
  multiple = false,
  onChange,
  variant = "default",
  className,
}: AccordionProps) {
  // prefixa os ids por instância — `item.value` sozinho colidiria se a mesma lista de items
  // for reaproveitada em múltiplas instâncias de <Accordion> na mesma página (ids devem ser únicos).
  // useId() inclui `:` (inválido em seletor CSS tipo #id sem escape) — removido pra manter o id seguro
  const instanceId = useId().replace(/:/g, "");
  const isControlled = value !== undefined;

  const [internal, setInternal] = useState<string[]>(() => {
    if (defaultValue === undefined) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const openSet = new Set(isControlled ? (Array.isArray(value) ? value : value ? [value] : []) : internal);

  function toggle(v: string) {
    let next: string[];
    if (openSet.has(v)) {
      next = [...openSet].filter((x) => x !== v);
    } else {
      next = multiple ? [...openSet, v] : [v];
    }
    if (!isControlled) setInternal(next);
    if (multiple) onChange?.(next);
    else onChange?.(next[0] ?? "");
  }

  return (
    <div className={cn(VARIANT_WRAP[variant], className)}>
      {items.map((item) => {
        const isOpen = openSet.has(item.value);
        return (
          <div key={item.value} className={cn(VARIANT_ITEM_EXTRA[variant])}>
            <button
              type="button"
              id={`accordion-trigger-${instanceId}-${item.value}`}
              onClick={() => !item.disabled && toggle(item.value)}
              disabled={item.disabled}
              className={cn(
                "flex w-full items-center gap-(--spacing-md) text-left font-inherit bg-transparent border-none cursor-pointer text-foreground transition-[background,color] duration-[120ms]",
                TRIGGER_CLS[variant],
                item.disabled && "opacity-40 cursor-not-allowed"
              )}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${instanceId}-${item.value}`}
            >
              {item.icon && (
                <span className="shrink-0 w-4 h-4 text-faint [&>svg]:w-full [&>svg]:h-full">{item.icon}</span>
              )}
              <span className="flex-1 text-body-callout font-medium">{item.label}</span>
              <span className={cn("shrink-0 text-faint transition-transform duration-[200ms]", isOpen && "rotate-180")}>
                <ChevronDown />
              </span>
            </button>

            <div
              id={`accordion-panel-${instanceId}-${item.value}`}
              role="region"
              aria-labelledby={`accordion-trigger-${instanceId}-${item.value}`}
              aria-hidden={!isOpen}
              className={cn(
                "overflow-hidden transition-[max-height,opacity] duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div
                className={cn(
                  variant === "ghost"
                    ? "py-(--spacing-sm) text-body-callout text-muted"
                    : "px-(--spacing-lg) pb-(--spacing-lg) text-body-callout text-muted"
                )}
              >
                {item.children}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
