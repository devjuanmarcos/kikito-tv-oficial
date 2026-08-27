"use client";
import { useId, useRef, useEffect } from "react";

import { cn } from "@/lib/utils";

import type { CheckboxProps, CheckboxSize, CheckboxVariant, CheckboxIntent } from "./checkbox.types";

export type { CheckboxProps, CheckboxSize, CheckboxVariant, CheckboxIntent } from "./checkbox.types";

const SIZE_CLS: Record<CheckboxSize, { box: string; label: string; desc: string }> = {
  // text-[0.6875rem] (11px): below scale minimum (--body-caption é 12px), tier mais compacto do componente
  sm: { box: "w-3.5 h-3.5", label: "text-body-caption", desc: "text-[0.6875rem]" },
  md: { box: "w-4 h-4", label: "text-body-callout", desc: "text-body-caption" },
  lg: { box: "w-[1.125rem] h-[1.125rem]", label: "text-body-paragraph", desc: "text-body-callout" },
};
const VARIANT_CLS: Record<CheckboxVariant, string> = {
  square: "rounded-none",
  rounded: "rounded-sm",
  circle: "rounded-full",
};
const INTENT_CHECKED: Record<CheckboxIntent, string> = {
  primary: "bg-patina border-patina",
  secondary: "bg-kinpaku border-kinpaku",
  success: "bg-success border-success",
  destructive: "bg-danger border-danger",
  warning: "bg-warning border-warning",
  info: "bg-info border-info",
};
/* Cor do check/traço sobre o fundo solido de cada intent — usa o par -fg pre-validado (WCAG AA). */
const INTENT_CHECK_FG: Record<CheckboxIntent, string> = {
  primary: "text-patina-fg",
  secondary: "text-kinpaku-fg",
  success: "text-success-fg",
  destructive: "text-danger-fg",
  warning: "text-warning-fg",
  info: "text-info-fg",
};

const CheckIcon = () => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <polyline points="2,6 5,9 10,3" />
  </svg>
);
const MinusIcon = () => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    className="w-full h-full"
  >
    <line x1="2" y1="6" x2="10" y2="6" />
  </svg>
);

export function Checkbox({
  checked,
  defaultChecked = false,
  indeterminate = false,
  onChange,
  label,
  description,
  size = "md",
  variant = "rounded",
  intent = "primary",
  disabled = false,
  className,
  style,
}: CheckboxProps) {
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : undefined;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const visualChecked = indeterminate ? true : isChecked ?? defaultChecked;
  const sz = SIZE_CLS[size];

  return (
    <label
      className={cn(
        "inline-flex items-start gap-2 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={style}
      htmlFor={uid}
    >
      <span
        className={cn(
          // mt-[0.1em]: nudge optico pra alinhar a caixa com a primeira linha do label, nao e spacing de layout
          "relative shrink-0 mt-[0.1em] border-2 border-rule bg-raised transition-[background,border] duration-[120ms]",
          // foco visivel: o <input> real fica sr-only (filho deste span, nao irmao — por isso has-[:focus-visible]
          // em vez de peer-focus-visible, que so funciona entre irmaos)
          "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-patina",
          sz.box,
          VARIANT_CLS[variant],
          visualChecked && INTENT_CHECKED[intent]
        )}
      >
        <input
          ref={inputRef}
          id={uid}
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        {(visualChecked || indeterminate) && (
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center p-(--spacing-3xs)",
              INTENT_CHECK_FG[intent]
            )}
          >
            {indeterminate ? <MinusIcon /> : <CheckIcon />}
          </span>
        )}
      </span>
      {(label || description) && (
        // gap-[0.1rem] (1.6px): abaixo do menor token de spacing (--spacing-3xs = 2px), micro-ajuste entre
        // label e description que nenhum token alcança sem abrir espaço demais
        <span className="flex flex-col gap-[0.1rem]">
          {label && <span className={cn("font-medium text-foreground leading-tight", sz.label)}>{label}</span>}
          {description && <span className={cn("text-faint leading-normal", sz.desc)}>{description}</span>}
        </span>
      )}
    </label>
  );
}
