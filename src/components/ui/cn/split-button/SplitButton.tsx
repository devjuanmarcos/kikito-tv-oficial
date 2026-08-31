"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import { scaleIn, transitionStandard } from "@/lib/motion";
import { cn } from "@/lib/utils";

import type { SplitButtonIntent, SplitButtonSize, SplitButtonProps } from "./split-button.types";

// Escala própria do componente (dimensão/padding por tier de size), não migra pra spacing
// genérico. text-[0.8125rem] (tier sm): abaixo do mínimo da escala de tipografia.
const SIZE_BTN: Record<SplitButtonSize, string> = {
  sm: "h-7  px-2.5 text-[0.8125rem]",
  md: "h-9  px-3.5 text-body-callout",
  lg: "h-11 px-4   text-body-paragraph",
};
const SIZE_CHEVRON: Record<SplitButtonSize, string> = {
  sm: "h-7  px-1.5",
  md: "h-9  px-2",
  lg: "h-11 px-2.5",
};

const INTENT_CLS: Record<SplitButtonIntent, string> = {
  primary: "bg-patina text-patina-fg hover:brightness-110 border-patina",
  secondary: "bg-kinpaku text-kinpaku-fg hover:brightness-110 border-kinpaku",
  success: "bg-success text-success-fg hover:brightness-110 border-success",
  danger: "bg-danger text-danger-fg hover:brightness-110 border-danger",
  neutral: "bg-raised text-foreground hover:bg-graphite border-rule",
};

// bg-current/20 + a mesma cor de texto usada pelo INTENT_CLS (o divider é um <div> irmão,
// não filho do botão, então currentColor precisa ser setado nele mesmo) — em vez de
// branco/preto fixo assumindo qual intent é "claro" ou "escuro" por cima. Mesma cor-fonte
// do token já usado pelos botões, então acompanha qualquer mudança de tema.
const DIVIDER_CLS: Record<SplitButtonIntent, string> = {
  primary: "bg-current/20 text-patina-fg",
  secondary: "bg-current/20 text-kinpaku-fg",
  success: "bg-current/20 text-success-fg",
  danger: "bg-current/20 text-danger-fg",
  neutral: "bg-rule",
};

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-3 h-3">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export function SplitButton({
  label,
  onClick,
  options,
  intent = "primary",
  size = "md",
  disabled = false,
  className,
  style,
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    if (wrapRef.current) {
      const r = wrapRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    function handleClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node) && !wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const base = cn(
    "inline-flex items-center justify-center font-semibold border transition-[filter,background] duration-[100ms] select-none",
    INTENT_CLS[intent],
    disabled && "opacity-50 pointer-events-none"
  );

  return (
    <div ref={wrapRef} style={style} className={cn("inline-flex rounded-(--radius-md) overflow-hidden", className)}>
      <button type="button" onClick={onClick} disabled={disabled} className={cn(base, SIZE_BTN[size], "rounded-none")}>
        {label}
      </button>

      <div className={cn("w-px self-stretch shrink-0", DIVIDER_CLS[intent])} />

      <button
        type="button"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(base, SIZE_CHEVRON[size], "rounded-none", open && "brightness-90")}
      >
        <ChevronIcon />
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          // {open && ...} cru sem AnimatePresence/motion -- mesmo bug ja corrigido no
          // DropdownMenu/Autocomplete (ver docs/component-import/animation-backport/PLAN.md),
          // achado aqui tambem na varredura de showcase. Mesmo par scaleIn+transitionStandard
          // do DropdownMenu (mesma forma de widget: menu de opcoes ancorado no trigger).
          <AnimatePresence>
            {open && (
              <motion.div
                ref={menuRef}
                role="menu"
                aria-label="More options"
                className="fixed z-[1200] p-(--spacing-2xs) bg-raised border border-rule rounded-(--radius-md) shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.35)]"
                style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
                {...scaleIn}
                transition={transitionStandard}
              >
                {options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={opt.disabled}
                    role="menuitem"
                    onClick={() => {
                      opt.onClick();
                      setOpen(false);
                    }}
                    className="w-full text-left px-(--spacing-md) py-(--spacing-xs) text-body-callout text-foreground rounded-(--radius-xs) hover:bg-graphite transition-colors disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
