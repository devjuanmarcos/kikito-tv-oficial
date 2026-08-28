"use client";
import { cn } from "@/lib/utils";

import type { RibbonProps, RibbonIntent } from "./ribbon.types";

const INTENT_CLS: Record<RibbonIntent, string> = {
  primary: "bg-patina text-patina-fg",
  secondary: "bg-kinpaku text-kinpaku-fg",
  success: "bg-success text-success-fg",
  warning: "bg-warning text-warning-fg",
  danger: "bg-danger text-danger-fg",
  neutral: "bg-raised text-foreground border border-rule",
};

export function Ribbon({ children, label, position = "top-right", intent = "primary", className, style }: RibbonProps) {
  const isRight = position === "top-right";
  return (
    <div style={style} className={cn("relative overflow-hidden inline-block", className)}>
      {children}
      <span
        className={cn(
          // below scale minimum: rótulo curto de faixa diagonal (ex: "Novo"), decorativo por natureza
          "absolute top-[14px] text-[0.6rem] font-bold tracking-wider uppercase select-none pointer-events-none",
          // w-[90px]/py-[3px]/top-[14px]/±22px: constantes geométricas da técnica de faixa
          // diagonal a 45° (largura precisa cobrir a diagonal do canto, offset centraliza o
          // texto na rotação) — não são espaçamento genérico, não têm token da escala aplicável
          "w-[90px] text-center py-[3px]",
          isRight ? "right-[-22px] rotate-45 origin-top-right" : "left-[-22px] -rotate-45 origin-top-left",
          INTENT_CLS[intent]
        )}
      >
        {label}
      </span>
    </div>
  );
}
