"use client";

import { useState } from "react";

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

  return (
    <div
      className={cn(
        "flex flex-col",
        isBordered ? "border border-rule rounded-(--radius-md) overflow-hidden" : "gap-1",
        className
      )}
      style={style}
    >
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const intent = item.intent ?? "neutral";
        return (
          <div
            key={item.id}
            className={cn(
              isBordered
                ? "border-b border-rule last:border-none"
                : "border border-rule rounded-(--radius-md) overflow-hidden"
            )}
          >
            <button
              type="button"
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-[14px] bg-transparent border-none text-foreground text-body-callout font-semibold cursor-pointer text-left transition-[background] duration-[120ms] hover:bg-raised outline-none",
                isOpen && "text-patina",
                isOpen && (INTENT_OPEN_BORDER[intent] ?? ""),
                item.disabled && "opacity-40 cursor-not-allowed"
              )}
              disabled={item.disabled}
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
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
            {isOpen && (
              <div className="px-4 pb-[14px] text-body-callout text-muted leading-[1.6]" role="region">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
