"use client";
import { motion } from "motion/react";
import { useId, useRef, useState } from "react";

import { transitionEnter } from "@/lib/motion";
import { cn } from "@/lib/utils";

import type { TabsProps, TabPanelProps, TabItem } from "./tabs.types";

const SIZE_CLS: Record<string, { tab: string; font: string }> = {
  sm: { tab: "h-8 px-3", font: "text-body-caption" },
  md: { tab: "h-10 px-4", font: "text-body-callout" },
  lg: { tab: "h-12 px-5", font: "text-body-paragraph" },
};

const ALIGN_CLS: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  stretch: "flex",
};

/* line variant — absorvido de docs/component-import/animation-backport/PLAN.md (tabs-01.tsx):
   sublinhado desliza entre abas via motion `layoutId` em vez de trocar de posição instantâneo.
   `layoutId` precisa ser único por instância de Tabs (useId no componente pai) — sem isso, duas
   <Tabs> na mesma página tentariam sincronizar a animação uma com a outra. */
function LineTab({ item, active, size, layoutId }: { item: TabItem; active: boolean; size: string; layoutId: string }) {
  const sz = SIZE_CLS[size];
  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-1.5 shrink-0 font-medium transition-colors duration-[120ms] -mb-px",
        sz.tab,
        sz.font,
        active ? "text-patina" : "text-muted hover:text-foreground",
        item.disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {/* text-[1em] herda o tamanho do texto pai (já vem de token via SIZE_CLS), não é valor fixo fora da escala */}
      {item.icon && <span className="text-[1em] [&>svg]:w-[1em] [&>svg]:h-[1em]">{item.icon}</span>}
      {item.label}
      {item.badge && <span>{item.badge}</span>}
      {active ? (
        <motion.span
          layoutId={layoutId}
          transition={transitionEnter}
          className="absolute inset-x-0 -bottom-px h-0.5 bg-patina"
        />
      ) : (
        <span className="absolute inset-x-0 -bottom-px h-0.5 bg-transparent" aria-hidden="true" />
      )}
    </span>
  );
}

/* pill variant — mesmo padrão layoutId, fundo desliza entre abas em vez de trocar instantâneo */
function PillTab({ item, active, size, layoutId }: { item: TabItem; active: boolean; size: string; layoutId: string }) {
  const sz = SIZE_CLS[size];
  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-1.5 shrink-0 font-medium rounded-(--radius-sm) transition-colors duration-[120ms]",
        sz.tab,
        sz.font,
        active ? "text-patina-fg" : "text-muted hover:bg-graphite hover:text-foreground",
        item.disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          transition={transitionEnter}
          className="absolute inset-0 bg-patina rounded-(--radius-sm) -z-10"
        />
      )}
      {/* text-[1em] herda o tamanho do texto pai (já vem de token via SIZE_CLS), não é valor fixo fora da escala */}
      {item.icon && <span className="text-[1em] [&>svg]:w-[1em] [&>svg]:h-[1em]">{item.icon}</span>}
      {item.label}
      {item.badge && <span>{item.badge}</span>}
    </span>
  );
}

/* card variant */
function CardTab({ item, active, size }: { item: TabItem; active: boolean; size: string }) {
  const sz = SIZE_CLS[size];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 shrink-0 font-medium border border-b-0 transition-[background,color] duration-[120ms] rounded-t-(--radius-sm)",
        sz.tab,
        sz.font,
        active
          ? "bg-base border-rule text-foreground"
          : "bg-graphite border-transparent text-muted hover:text-foreground",
        item.disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {/* text-[1em] herda o tamanho do texto pai (já vem de token via SIZE_CLS), não é valor fixo fora da escala */}
      {item.icon && <span className="text-[1em] [&>svg]:w-[1em] [&>svg]:h-[1em]">{item.icon}</span>}
      {item.label}
      {item.badge && <span>{item.badge}</span>}
    </span>
  );
}

/* enclosed variant */
function EnclosedTab({
  item,
  active,
  size,
  stretch,
}: {
  item: TabItem;
  active: boolean;
  size: string;
  stretch?: boolean;
}) {
  const sz = SIZE_CLS[size];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-medium transition-[background,color] duration-[120ms] rounded-(--radius-sm)",
        sz.tab,
        sz.font,
        stretch ? "flex-1" : "shrink-0",
        active ? "bg-raised shadow-sm text-foreground" : "text-muted hover:text-foreground",
        item.disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {/* text-[1em] herda o tamanho do texto pai (já vem de token via SIZE_CLS), não é valor fixo fora da escala */}
      {item.icon && <span className="text-[1em] [&>svg]:w-[1em] [&>svg]:h-[1em]">{item.icon}</span>}
      {item.label}
      {item.badge && <span>{item.badge}</span>}
    </span>
  );
}

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  variant = "line",
  size = "md",
  align = "start",
  className,
  children,
}: TabsProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value ?? "");
  const active = isControlled ? value ?? "" : internal;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // layoutId único por instância — sem isso, duas <Tabs> na mesma página tentariam
  // sincronizar a animação do indicador deslizante uma com a outra
  const groupId = useId();
  const indicatorId = `${groupId}-indicator`;

  function select(v: string) {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  }

  // Navegação por teclado padrão WAI-ARIA APG (tablist, ativação automática): setas
  // movem foco e já ativam o tab; Home/End vão pro primeiro/último habilitado.
  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    const enabled = items.map((it, i) => ({ it, i })).filter(({ it }) => !it.disabled);
    if (enabled.length === 0) return;
    const enabledIndexes = enabled.map(({ i }) => i);
    const pos = enabledIndexes.indexOf(index);

    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") {
      nextIndex = enabledIndexes[(pos + 1) % enabledIndexes.length];
    } else if (e.key === "ArrowLeft") {
      nextIndex = enabledIndexes[(pos - 1 + enabledIndexes.length) % enabledIndexes.length];
    } else if (e.key === "Home") {
      nextIndex = enabledIndexes[0];
    } else if (e.key === "End") {
      nextIndex = enabledIndexes[enabledIndexes.length - 1];
    }

    if (nextIndex !== null) {
      e.preventDefault();
      tabRefs.current[nextIndex]?.focus();
      select(items[nextIndex].value);
    }
  }

  const isStretch = align === "stretch";

  const tabListCls = cn(
    "flex",
    variant === "line" && cn("border-b border-rule gap-1", isStretch ? "" : ALIGN_CLS[align]),
    variant === "pill" && cn("p-1 rounded-(--radius-sm)", isStretch ? "" : ALIGN_CLS[align], "gap-1"),
    variant === "card" && cn("border-b border-rule gap-0", isStretch ? "" : ALIGN_CLS[align]),
    variant === "enclosed" && cn("p-1 bg-graphite rounded-(--radius-sm) gap-1", isStretch ? "" : ALIGN_CLS[align])
  );

  return (
    <div className={cn("flex flex-col", className)}>
      <div role="tablist" className={tabListCls}>
        {items.map((item, index) => (
          <button
            key={item.value}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active === item.value}
            tabIndex={active === item.value ? 0 : -1}
            disabled={item.disabled}
            onClick={() => !item.disabled && select(item.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "bg-transparent border-none p-0 cursor-pointer font-inherit rounded-(--radius-xs)",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina",
              item.disabled && "cursor-not-allowed",
              isStretch && variant === "enclosed" && "flex-1"
            )}
          >
            {variant === "line" && (
              <LineTab item={item} active={active === item.value} size={size} layoutId={indicatorId} />
            )}
            {variant === "pill" && (
              <PillTab item={item} active={active === item.value} size={size} layoutId={indicatorId} />
            )}
            {variant === "card" && <CardTab item={item} active={active === item.value} size={size} />}
            {variant === "enclosed" && (
              <EnclosedTab item={item} active={active === item.value} size={size} stretch={isStretch} />
            )}
          </button>
        ))}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function TabPanel({ value, activeTab, children, className }: TabPanelProps) {
  if (value !== activeTab) return null;
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}
