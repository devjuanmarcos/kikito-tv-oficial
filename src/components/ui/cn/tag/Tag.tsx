"use client";

import { cn } from "@/lib/utils";

import type { TagIntent, TagAppearance, TagSize, TagProps } from "./tag.types";

// Escala própria do componente (dimensão/tipografia por size), não migra pra spacing
// genérico. text-[0.6875rem] (11px, tier sm): below scale minimum.
const SIZE: Record<TagSize, string> = {
  sm: "h-5  px-1.5 gap-1   text-[0.6875rem] rounded-(--radius-xs)",
  md: "h-6  px-2   gap-1   text-body-caption rounded-(--radius-xs)",
  lg: "h-7  px-2.5 gap-1.5 text-body-callout rounded-(--radius-sm)",
};

type IntentAppKey = `${TagIntent}/${TagAppearance}`;

const INTENT_APP: Record<IntentAppKey, string> = {
  "primary/soft": "bg-patina-soft text-patina-soft-fg border-transparent",
  "primary/solid": "bg-patina text-patina-fg border-transparent",
  "primary/outline": "bg-transparent text-patina border-patina",

  "info/soft": "bg-info-soft text-info-soft-fg border-transparent",
  "info/solid": "bg-info text-info-fg border-transparent",
  "info/outline": "bg-transparent text-info border-info",

  "success/soft": "bg-success-soft text-success-soft-fg border-transparent",
  "success/solid": "bg-success text-success-fg border-transparent",
  "success/outline": "bg-transparent text-success border-success",

  "warning/soft": "bg-warning-soft text-warning-soft-fg border-transparent",
  "warning/solid": "bg-warning text-warning-fg border-transparent",
  "warning/outline": "bg-transparent text-warning border-warning",

  "danger/soft": "bg-danger-soft text-danger-soft-fg border-transparent",
  "danger/solid": "bg-danger text-danger-fg border-transparent",
  "danger/outline": "bg-transparent text-danger border-danger",

  // neutral: mesma convenção do Badge já validado (graphite/foreground pro soft,
  // bg-neutral/text-neutral-fg pro solid — não usa o par neutral-soft/-fg genérico)
  "neutral/soft": "bg-graphite text-foreground border-transparent",
  "neutral/solid": "bg-neutral text-neutral-fg border-transparent",
  "neutral/outline": "bg-transparent text-foreground border-rule",
};

export function Tag({
  intent = "neutral",
  appearance = "soft",
  size = "md",
  icon,
  removable,
  onRemove,
  onClick,
  className,
  style,
  children,
}: TagProps) {
  const key = `${intent}/${appearance}` as IntentAppKey;
  const cls = INTENT_APP[key] ?? INTENT_APP["neutral/soft"];
  const isClick = !!onClick;
  const hasRemove = !!(removable || onRemove);
  const removeLabel = typeof children === "string" ? `Remove ${children}` : "Remove";

  // achado real: Root era <button> quando isClick, e o botão de remover é sempre um
  // <button> aninhado -> <button> dentro de <button> é HTML inválido (o browser fecha o
  // outer cedo, quebrando clique/foco) sempre que removable+onClick coexistem. Root vira
  // <span role="button" tabIndex> em vez de <button> nativo pra suportar os dois casos
  // sem aninhar interativo dentro de interativo; teclado fica igual via onKeyDown (Enter/Espaço)
  return (
    <span
      role={isClick ? "button" : undefined}
      tabIndex={isClick ? 0 : undefined}
      onClick={isClick ? onClick : undefined}
      onKeyDown={
        isClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      style={style}
      className={cn(
        "inline-flex items-center font-medium border select-none whitespace-nowrap",
        SIZE[size],
        cls,
        isClick &&
          "cursor-pointer hover:brightness-110 transition-[filter] duration-[100ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina",
        className
      )}
    >
      {icon && (
        <span aria-hidden="true" className="shrink-0 w-3 h-3 flex items-center justify-center">
          {icon}
        </span>
      )}
      {children}
      {hasRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="shrink-0 -mr-0.5 w-3 h-3 flex items-center justify-center rounded-full opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}
