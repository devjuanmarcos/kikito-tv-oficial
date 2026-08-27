"use client";

import { useState, useEffect, useCallback } from "react";

import { cn } from "@/lib/utils";

import type { TableOfContentsProps } from "./table-of-contents.types";

// Escala própria do componente (recuo por nível de heading) — não é spacing genérico de
// layout, é a hierarquia visual do TOC. pl-2 bate exato com --spacing-sm; pl-5/pl-8/pl-11
// não têm match na escala de spacing, mantidos como estão.
const LEVEL_PL: Record<number, string> = {
  1: "pl-(--spacing-sm)",
  2: "pl-5",
  3: "pl-8",
  4: "pl-11",
};

export function TableOfContents({
  items,
  title = "Nesta página",
  activeId: controlledActiveId,
  onItemClick,
  maxDepth = 3,
  sticky = false,
  className,
  style,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(controlledActiveId ?? items[0]?.id ?? "");

  useEffect(() => {
    if (controlledActiveId !== undefined) setActiveId(controlledActiveId);
  }, [controlledActiveId]);

  useEffect(() => {
    if (controlledActiveId !== undefined) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const v = entries.find((e) => e.isIntersecting);
        if (v) setActiveId(v.target.id);
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items, controlledActiveId]);

  const handleClick = useCallback(
    (id: string) => {
      setActiveId(id);
      onItemClick?.(id);
      if (controlledActiveId === undefined)
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [onItemClick, controlledActiveId]
  );

  const filtered = items.filter((item) => item.level <= maxDepth);

  return (
    <nav
      className={cn("w-full text-body-callout", sticky && "sticky top-6", className)}
      style={style}
      aria-label="Table of contents"
    >
      {title && (
        // mb-[10px]: sem match exato na escala de spacing
        <div className="text-body-caption font-bold tracking-[0.08em] uppercase text-faint mb-[10px]">{title}</div>
      )}
      <ul className="list-none m-0 p-0 flex flex-col gap-(--spacing-3xs)">
        {filtered.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id} className="block">
              <button
                type="button"
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "block w-full py-(--spacing-2xs) rounded-(--radius-sm) no-underline leading-snug border-l-2 border-transparent transition-[color,background,border-color] duration-[150ms] cursor-pointer bg-transparent border-t-0 border-r-0 border-b-0 text-left font-[inherit] text-[inherit]",
                  LEVEL_PL[item.level] ?? "pl-(--spacing-sm)",
                  isActive
                    ? "text-patina border-l-patina bg-patina-soft font-medium"
                    : "text-muted hover:text-foreground hover:bg-raised"
                )}
                onClick={() => handleClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
