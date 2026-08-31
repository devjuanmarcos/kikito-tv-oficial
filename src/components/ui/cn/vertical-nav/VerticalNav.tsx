"use client";
import { useState } from "react";

import { Badge } from "@/components/ui/cn/badge";
import { cn } from "@/lib/utils";

import type { NavItem, VerticalNavProps } from "./vertical-nav.types";

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    className={cn("w-3.5 h-3.5 flex-shrink-0 transition-transform duration-[160ms]", open && "rotate-180")}
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function NavItemRow({
  item,
  activeId,
  onSelect,
  depth = 0,
}: {
  item: NavItem;
  activeId?: string;
  onSelect?: (id: string) => void;
  depth?: number;
}) {
  const hasChildren = !!item.children?.length;
  const isActive = item.id === activeId;
  const [expanded, setExpanded] = useState(() =>
    hasChildren ? !!item.children?.some((c) => c.id === activeId || c.children?.some((g) => g.id === activeId)) : false
  );

  function handleClick() {
    if (item.disabled) return;
    if (hasChildren) setExpanded((v) => !v);
    else onSelect?.(item.id);
  }

  return (
    <li>
      <button
        type="button"
        disabled={item.disabled}
        aria-current={isActive ? "page" : undefined}
        aria-expanded={hasChildren ? expanded : undefined}
        onClick={handleClick}
        // indent dinâmico por profundidade: base 0.75rem (--spacing-md) + 1rem
        // (--spacing-lg) por nível — cálculo, não valor arbitrário estático
        style={{ paddingLeft: `${0.75 + depth * 1}rem` }}
        className={cn(
          "w-full flex items-center gap-2.5 pr-(--spacing-md) py-(--spacing-sm) rounded-lg text-body-callout text-left",
          "transition-[background,color] duration-[80ms]",
          isActive ? "bg-patina-soft text-patina-soft-fg font-semibold" : "text-foreground hover:bg-graphite",
          item.disabled && "opacity-40 pointer-events-none"
        )}
      >
        {item.icon && (
          <span
            aria-hidden="true"
            className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-body-paragraph leading-none"
          >
            {item.icon}
          </span>
        )}
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge !== undefined && (
          <Badge size="sm" intent={typeof item.badge === "number" ? "danger" : "neutral"}>
            {item.badge}
          </Badge>
        )}
        {hasChildren && <ChevronIcon open={expanded} />}
      </button>

      {/* {expanded && <ul>} cru antes escondia/mostrava sem nenhuma transicao -- mesmo
          padrao max-height+opacity ja usado pelo Accordion pra conteudo aninhado de
          tamanho variavel (nao motion: altura "auto" e o mesmo tipo de conteudo variavel
          que o Accordion ja resolveu assim). Achado na varredura de showcase, 2026-08-30. */}
      {hasChildren && (
        <ul
          className={cn(
            "overflow-hidden space-y-(--spacing-3xs) transition-[max-height,opacity] duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            expanded ? "max-h-[1000px] opacity-100 mt-(--spacing-3xs)" : "max-h-0 opacity-0"
          )}
        >
          {item.children!.map((child) => (
            <NavItemRow key={child.id} item={child} activeId={activeId} onSelect={onSelect} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function VerticalNav({ items, activeId, onSelect, className, style }: VerticalNavProps) {
  return (
    <nav
      style={style}
      aria-label="Sidebar navigation"
      className={cn(
        "flex flex-col gap-(--spacing-3xs) p-(--spacing-sm) bg-raised border-r border-rule overflow-y-auto",
        className
      )}
    >
      <ul className="space-y-(--spacing-3xs)">
        {items.map((item) => (
          <NavItemRow key={item.id} item={item} activeId={activeId} onSelect={onSelect} />
        ))}
      </ul>
    </nav>
  );
}
