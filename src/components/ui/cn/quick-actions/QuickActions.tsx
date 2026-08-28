"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import type { QuickActionsProps } from "./quick-actions.types";

// hover:bg-X/90 (opacidade ad-hoc) -> bg-X-hover, token que já existe pra
// exatamente esse caso — mesma classe de bug já vista em vários componentes
const INTENT_CLS: Record<string, string> = {
  primary: "bg-patina text-patina-fg hover:bg-patina-hover",
  success: "bg-success text-success-fg hover:bg-success-hover",
  warning: "bg-warning text-warning-fg hover:bg-warning-hover",
  danger: "bg-danger text-danger-fg hover:bg-danger-hover",
  neutral: "bg-raised border border-rule text-foreground hover:bg-graphite",
};

const PLACEMENT_CLS: Record<string, string> = {
  top: "bottom-full mb-(--spacing-sm) flex-col-reverse",
  bottom: "top-full mt-(--spacing-sm) flex-col",
  left: "right-full mr-(--spacing-sm) flex-row-reverse",
  right: "left-full ml-(--spacing-sm) flex-row",
};

export function QuickActions({ actions, triggerIcon = "+", placement = "top", className, style }: QuickActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative inline-flex", className)} style={style}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Quick actions"
        className={cn(
          "w-12 h-12 rounded-full bg-patina text-patina-fg flex items-center justify-center shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)] text-body-title transition-transform duration-200 hover:bg-patina-hover z-10",
          open && "rotate-45"
        )}
      >
        {triggerIcon}
      </button>

      <div
        className={cn(
          "absolute flex items-center gap-(--spacing-sm) z-20",
          PLACEMENT_CLS[placement] ?? PLACEMENT_CLS.top,
          !open && "pointer-events-none"
        )}
      >
        {actions.map((action, i) => (
          <div key={action.id} className="relative group">
            <button
              type="button"
              // Menu fechado: botão fica invisível (opacity-0) e sem clique
              // (pointer-events-none no pai), mas continuava alcançável por
              // Tab — mesma categoria de "elemento escondido ainda focável"
              // já resolvida em Modal/OnboardingTour, aqui só via tabIndex.
              tabIndex={open ? 0 : -1}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)] text-body-paragraph transition-all duration-200",
                INTENT_CLS[action.intent ?? "neutral"],
                open ? "opacity-100 scale-100" : "opacity-0 scale-75"
              )}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              onClick={() => {
                action.onClick?.();
                setOpen(false);
              }}
              title={action.label}
              aria-label={action.label}
            >
              {action.icon}
            </button>
            {/* Tooltip — group-focus-within cobre navegação por teclado, antes só
                aparecia no :hover (mouse), deixando quem chega por Tab sem o rótulo visual */}
            <span
              className={cn(
                "absolute text-body-caption font-medium bg-graphite text-foreground px-(--spacing-sm) py-(--spacing-3xs) rounded-(--radius-sm) whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none transition-opacity",
                ["top", "bottom"].includes(placement)
                  ? "left-1/2 -translate-x-1/2 -top-7"
                  : "top-1/2 -translate-y-1/2 left-12"
              )}
            >
              {action.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
