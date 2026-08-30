"use client";
import { useId } from "react";

import { cn } from "@/lib/utils";

import type { RadioGroupProps, RadioProps, RadioSize } from "./radio.types";

// variant="card": borda de ênfase de seleção — --border-width-base (2px) é o token
// semântico certo aqui (CLAUDE.md §Bordas: "ênfase — foco, seleção, badge").
const CARD_SIZE: Record<RadioSize, { padding: string; icon: string; label: string; desc: string; price: string }> = {
  sm: {
    padding: "p-(--spacing-md)",
    icon: "w-6 h-6",
    label: "text-body-callout",
    desc: "text-body-caption",
    price: "text-body-callout",
  },
  md: {
    padding: "p-(--spacing-lg)",
    icon: "w-7 h-7",
    label: "text-body-callout",
    desc: "text-body-caption",
    price: "text-body-title",
  },
  lg: {
    padding: "p-(--spacing-xl)",
    icon: "w-8 h-8",
    label: "text-body-title",
    desc: "text-body-callout",
    price: "text-heading-05",
  },
};

const SIZE_DOT: Record<RadioSize, { outer: string; inner: string; label: string; helper: string }> = {
  sm: { outer: "w-3.5 h-3.5 border", inner: "w-[5px] h-[5px]", label: "text-body-caption", helper: "text-[0.6875rem]" },
  md: {
    outer: "w-4 h-4 border-(length:--border-width-thin)",
    inner: "w-[6px] h-[6px]",
    label: "text-body-callout",
    helper: "text-body-caption",
  },
  lg: {
    outer: "w-[1.125rem] h-[1.125rem] border-(length:--border-width-base)",
    inner: "w-2 h-2",
    label: "text-body-paragraph",
    helper: "text-body-callout",
  },
};

export function Radio({
  value = "",
  checked,
  defaultChecked,
  onChange,
  label,
  helperText,
  size = "md",
  disabled = false,
  name,
  className,
  style,
  variant = "default",
  icon,
  description,
  price,
}: RadioProps) {
  const uid = useId();
  const helperId = `${uid}-helper`;
  const sz = SIZE_DOT[size];
  const isControlled = checked !== undefined;

  if (variant === "card") {
    const csz = CARD_SIZE[size];
    return (
      <label
        className={cn(
          "relative flex flex-col gap-(--spacing-xs) rounded-(--radius-md) border-(length:--border-width-base) border-rule bg-raised cursor-pointer transition-colors duration-[120ms] hover:border-foreground/30",
          "has-[:checked]:border-patina has-[:checked]:bg-patina-soft",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          csz.padding,
          className
        )}
        style={style}
        htmlFor={uid}
      >
        <input
          id={uid}
          type="radio"
          name={name}
          value={value}
          checked={isControlled ? checked : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          disabled={disabled}
          aria-describedby={helperText || description ? helperId : undefined}
          onChange={(e) => {
            if (e.target.checked) onChange?.(value);
          }}
          className="sr-only peer"
        />
        {icon && (
          <span className={cn("shrink-0 text-patina [&>svg]:w-full [&>svg]:h-full", csz.icon)} aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="flex items-start justify-between gap-(--spacing-sm)">
          <span className={cn("font-semibold text-foreground leading-tight", csz.label)}>{label}</span>
          {/* sem shrink-0: preço curto ("$19") nunca precisa encolher; preço longo
              ("Custom", "Sob consulta") quebra linha em vez de estourar a largura
              do card — achado real na varredura de showcase, 2026-08-30. */}
          {price && <span className={cn("font-bold text-patina text-right", csz.price)}>{price}</span>}
        </div>
        {(description || helperText) && (
          <span id={helperId} className={cn("text-muted leading-normal", csz.desc)}>
            {description ?? helperText}
          </span>
        )}
      </label>
    );
  }

  return (
    <label
      className={cn(
        "inline-flex items-start gap-(--spacing-sm) cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={style}
      htmlFor={uid}
    >
      <span
        className={cn(
          "relative shrink-0 mt-[0.1em] rounded-full border-rule bg-raised transition-[border-color,background] duration-[120ms] flex items-center justify-center",
          sz.outer
        )}
      >
        <input
          id={uid}
          type="radio"
          name={name}
          value={value}
          checked={isControlled ? checked : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          disabled={disabled}
          aria-describedby={helperText ? helperId : undefined}
          onChange={(e) => {
            if (e.target.checked) onChange?.(value);
          }}
          className="sr-only peer"
        />
        <span
          className={cn(
            "rounded-full bg-patina opacity-0 transition-[opacity,transform] duration-[120ms] scale-50 peer-checked:opacity-100 peer-checked:scale-100 peer-checked:[&~span]:border-patina",
            sz.inner
          )}
        />
        <span
          className={cn(
            "absolute inset-0 rounded-full border border-rule transition-[border-color] duration-[120ms] peer-checked:border-patina"
          )}
          aria-hidden="true"
        />
      </span>
      {(label || helperText) && (
        <span className="flex flex-col gap-[0.1rem]">
          {label && <span className={cn("font-medium text-foreground leading-tight", sz.label)}>{label}</span>}
          {helperText && (
            // text-[0.6875rem]: below scale minimum, micro-caption sob o dot no tier "sm"
            <span id={helperId} className={cn("text-faint leading-[1.4]", sz.helper)}>
              {helperText}
            </span>
          )}
        </span>
      )}
    </label>
  );
}

export function RadioGroup({
  label,
  helperText,
  options,
  value,
  defaultValue,
  onChange,
  orientation = "vertical",
  size = "md",
  disabled = false,
  name,
  className,
  variant = "default",
}: RadioGroupProps) {
  const uid = useId();
  const groupName = name ?? uid;
  const helperId = `${uid}-group-helper`;
  const isControlled = value !== undefined;
  const isCard = variant === "card";

  return (
    <fieldset className={cn("border-none p-0 m-0", className)} aria-describedby={helperText ? helperId : undefined}>
      {label && (
        <legend className="text-body-callout font-semibold text-foreground mb-(--spacing-sm) float-none">
          {label}
        </legend>
      )}
      <div
        className={cn(
          "flex",
          orientation === "horizontal"
            ? cn("flex-row flex-wrap", isCard ? "gap-(--spacing-md) items-stretch" : "gap-(--spacing-lg)")
            : "flex-col gap-(--spacing-md)"
        )}
      >
        {options.map((opt) => (
          <Radio
            key={opt.value}
            value={opt.value}
            name={groupName}
            label={opt.label}
            helperText={opt.helperText}
            checked={isControlled ? value === opt.value : undefined}
            defaultChecked={!isControlled ? defaultValue === opt.value : undefined}
            disabled={disabled || opt.disabled}
            size={size}
            onChange={onChange}
            variant={variant}
            icon={opt.icon}
            description={opt.description}
            price={opt.price}
            className={isCard && orientation === "horizontal" ? "flex-1 min-w-[10rem]" : undefined}
          />
        ))}
      </div>
      {helperText && (
        <p id={helperId} className="text-body-caption text-faint mt-(--spacing-sm)">
          {helperText}
        </p>
      )}
    </fieldset>
  );
}
