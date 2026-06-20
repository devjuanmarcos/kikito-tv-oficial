"use client";
import type React from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type AccordionVariant = "default" | "separated" | "ghost";

export interface AccordionItemDef {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItemDef[];
  value?: string | string[];
  defaultValue?: string | string[];
  multiple?: boolean;
  onChange?: (value: string | string[]) => void;
  variant?: AccordionVariant;
  className?: string;
}

const ChevronDown = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[0.9rem] h-[0.9rem]"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const VARIANT_WRAP: Record<AccordionVariant, string> = {
  default: "border border-rule rounded-(--radius-sm) divide-y divide-rule overflow-hidden",
  separated: "flex flex-col gap-2",
  ghost: "flex flex-col",
};
const VARIANT_ITEM_EXTRA: Record<AccordionVariant, string> = {
  default: "",
  separated: "border border-rule rounded-(--radius-sm) overflow-hidden",
  ghost: "border-b border-rule last:border-b-0",
};
const TRIGGER_CLS: Record<AccordionVariant, string> = {
  default: "px-4 py-3 hover:bg-graphite",
  separated: "px-4 py-3 hover:bg-graphite",
  ghost: "px-0 py-3 hover:text-foreground",
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
              onClick={() => !item.disabled && toggle(item.value)}
              disabled={item.disabled}
              className={cn(
                "flex w-full items-center gap-3 text-left font-inherit bg-transparent border-none cursor-pointer text-foreground transition-[background,color] duration-[120ms]",
                TRIGGER_CLS[variant],
                item.disabled && "opacity-40 cursor-not-allowed"
              )}
              aria-expanded={isOpen}
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
              className={cn(
                "overflow-hidden transition-[max-height,opacity] duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div
                className={cn(
                  variant === "ghost" ? "py-2 text-body-callout text-muted" : "px-4 pb-4 text-body-callout text-muted"
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
