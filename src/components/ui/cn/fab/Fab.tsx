"use client";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import type { FabProps, FabIntent, FabPosition, FabSize } from "./fab.types";

/* Sem token de shadow/elevação no design system ainda (pendência #2 do audit doc) —
   literal oklch ad-hoc, mesmo padrão já usado em Select/Autocomplete/Command/DropdownMenu. */
const SIZE_BTN: Record<FabSize, string> = {
  sm: "w-10 h-10 text-body-callout shadow-[0_4px_16px_-4px_oklch(0%_0_0/0.4)]",
  md: "w-14 h-14 text-body-paragraph shadow-[0_6px_24px_-6px_oklch(0%_0_0/0.4)]",
  lg: "w-16 h-16 text-body-title shadow-[0_8px_28px_-6px_oklch(0%_0_0/0.4)]",
};
const SIZE_ACTION: Record<FabSize, string> = {
  sm: "w-8 h-8 text-body-caption",
  md: "w-10 h-10 text-body-callout",
  lg: "w-12 h-12 text-body-paragraph",
};

const INTENT_CLS: Record<FabIntent, string> = {
  primary: "bg-patina text-patina-fg hover:brightness-110",
  secondary: "bg-kinpaku text-kinpaku-fg hover:brightness-110",
  success: "bg-success text-success-fg hover:brightness-110",
  danger: "bg-danger text-danger-fg hover:brightness-110",
  neutral: "bg-raised text-foreground hover:bg-graphite border border-rule",
};

const POSITION_CLS: Record<FabPosition, string> = {
  "bottom-right": "fixed bottom-(--spacing-xl) right-(--spacing-xl)",
  "bottom-left": "fixed bottom-(--spacing-xl) left-(--spacing-xl)",
  "top-right": "fixed top-(--spacing-xl) right-(--spacing-xl)",
  "top-left": "fixed top-(--spacing-xl) left-(--spacing-xl)",
};

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-5 h-5">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

/**
 * Botões circulares/tamanho fora da escala do `<Button>` CN (`rounded-full`, `lg` chega a 64px)
 * são específicos deste componente (floating action button + speed-dial) — não reusam `<Button>`
 * pelo mesmo motivo que o chevron do SplitButton não reusa: forma e escala bespoke, não um botão
 * retangular padrão.
 */
export function Fab({
  icon,
  actions = [],
  position = "bottom-right",
  intent = "primary",
  size = "md",
  tooltip,
  onClick,
  className,
  style,
}: FabProps) {
  const [open, setOpen] = useState(false);
  const hasActions = actions.length > 0;

  useEffect(() => {
    if (!hasActions || !open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [hasActions, open]);

  const isBottom = position === "bottom-right" || position === "bottom-left";
  const actionsDir = isBottom ? "flex-col-reverse" : "flex-col";

  const mainLabel = tooltip ?? (hasActions ? (open ? "Fechar" : "Abrir menu") : "Ação");

  return (
    <div
      style={style}
      className={cn("z-[900] flex items-center", actionsDir, "gap-(--spacing-md)", POSITION_CLS[position], className)}
    >
      {/* Speed-dial actions */}
      {hasActions && open && (
        <div className={cn("flex", actionsDir, "gap-(--spacing-sm)")} role="group" aria-label="Ações rápidas">
          {actions.map((action, i) => (
            <div key={i} className="flex items-center gap-(--spacing-sm) group">
              <span className="text-body-caption text-foreground bg-raised border border-rule rounded-(--radius-sm) px-(--spacing-sm) py-(--spacing-3xs) whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none">
                {action.label}
              </span>
              <button
                type="button"
                aria-label={action.label}
                disabled={action.disabled}
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-center rounded-full bg-raised border border-rule text-foreground",
                  "hover:bg-graphite transition-[background,box-shadow] duration-[100ms]",
                  "shadow-[0_4px_16px_-4px_oklch(0%_0_0/0.3)]",
                  SIZE_ACTION[size],
                  action.disabled && "opacity-40 pointer-events-none"
                )}
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main button */}
      <button
        type="button"
        aria-label={mainLabel}
        aria-haspopup={hasActions ? "true" : undefined}
        aria-expanded={hasActions ? open : undefined}
        title={tooltip}
        onClick={() => {
          if (hasActions) setOpen((v) => !v);
          else onClick?.();
        }}
        className={cn(
          "flex items-center justify-center rounded-full transition-[filter,transform] duration-[120ms] active:scale-95 select-none",
          INTENT_CLS[intent],
          SIZE_BTN[size]
        )}
      >
        {hasActions && open ? <CloseIcon /> : icon}
      </button>
    </div>
  );
}
