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
    <nav className={cn("flex flex-col gap-(--spacing-3xs)", className)} style={style}>
      {items.map((item) => {
        const isActive = activeId === item.id;
        const isDeep = item.depth === 2;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={isActive ? "true" : undefined}
            onClick={() => {
              setActiveId(item.id);
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
            }}
            className={cn(
              // gap-2.5 (0.625rem): sem match exato na escala de spacing
              "flex items-center gap-2.5 text-left px-(--spacing-md) py-(--spacing-xs) rounded-(--radius-sm) text-body-callout transition-colors duration-150 w-full",
              isDeep && "pl-(--spacing-xl)",
              isActive ? "text-patina font-semibold bg-patina/8" : "text-muted hover:text-foreground hover:bg-graphite"
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
