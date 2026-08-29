"use client";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

import type { AccordionGroupType, AccordionGroupVariant, AccordionGroupProps } from "./accordion-group.types";

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    className={cn("w-4 h-4 flex-shrink-0 transition-transform duration-[180ms]", open && "rotate-180")}
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function normalizeOpen(v: string | string[] | undefined, type: AccordionGroupType): string[] {
  if (v === undefined) return [];
  if (Array.isArray(v)) return type === "single" ? [v[0]].filter(Boolean) : v;
  return [v];
}

export function AccordionGroup({
  items,
  type = "single",
  variant = "default",
  defaultOpen,
  value,
  onChange,
  className,
  style,
}: AccordionGroupProps) {
  // prefixa os ids por instância — item.id sozinho colidiria se a mesma lista de items
  // for reaproveitada em múltiplas instâncias de <AccordionGroup> na mesma página
  const instanceId = useId().replace(/:/g, "");
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(() => normalizeOpen(defaultOpen, type));
  const open = isControlled ? normalizeOpen(value, type) : internal;

  function toggle(id: string) {
    let next: string[];
    if (type === "single") {
      next = open[0] === id ? [] : [id];
    } else {
      next = open.includes(id) ? open.filter((v) => v !== id) : [...open, id];
    }
    if (!isControlled) setInternal(next);
    onChange?.(type === "single" ? next[0] ?? "" : next);
  }

  const WRAP_CLS: Record<AccordionGroupVariant, string> = {
    default: "divide-y divide-rule border border-rule rounded-xl overflow-hidden",
    card: "flex flex-col gap-(--spacing-sm)",
    flush: "divide-y divide-rule",
  };
  const ITEM_CLS: Record<AccordionGroupVariant, string> = {
    default: "",
    card: "border border-rule rounded-xl overflow-hidden",
    flush: "",
  };

  return (
    <div style={style} className={cn(WRAP_CLS[variant], className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id} className={ITEM_CLS[variant]}>
            <button
              type="button"
              id={`acc-trigger-${instanceId}-${item.id}`}
              disabled={item.disabled}
              aria-expanded={isOpen}
              aria-controls={`acc-${instanceId}-${item.id}`}
              onClick={() => toggle(item.id)}
              className={cn(
                // py-3.5 (14px): sem match exato na escala de spacing
                "w-full flex items-center justify-between gap-(--spacing-md) px-(--spacing-lg) py-3.5",
                "text-left text-body-callout font-medium text-foreground",
                "hover:bg-graphite transition-colors duration-[80ms]",
                item.disabled && "opacity-40 pointer-events-none"
              )}
            >
              <span>{item.trigger}</span>
              <ChevronIcon open={isOpen} />
            </button>
            <div
              id={`acc-${instanceId}-${item.id}`}
              role="region"
              aria-labelledby={`acc-trigger-${instanceId}-${item.id}`}
              aria-hidden={!isOpen}
              className={cn(
                "overflow-hidden transition-[max-height,opacity] duration-[220ms] ease-in-out",
                isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="px-(--spacing-lg) pb-(--spacing-lg) text-body-paragraph text-muted">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
