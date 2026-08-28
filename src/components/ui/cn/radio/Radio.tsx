"use client";
import { useId } from "react";

import { cn } from "@/lib/utils";

import type { RadioGroupProps, RadioProps, RadioSize } from "./radio.types";

const SIZE_DOT: Record<RadioSize, { outer: string; inner: string; label: string; helper: string }> = {
  sm: { outer: "w-3.5 h-3.5 border", inner: "w-[5px] h-[5px]", label: "text-body-caption", helper: "text-[0.6875rem]" },
  md: {
    outer: "w-4 h-4 border-[1.5px]",
    inner: "w-[6px] h-[6px]",
    label: "text-body-callout",
    helper: "text-body-caption",
  },
  lg: {
    outer: "w-[1.125rem] h-[1.125rem] border-2",
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
}: RadioProps) {
  const uid = useId();
  const helperId = `${uid}-helper`;
  const sz = SIZE_DOT[size];
  const isControlled = checked !== undefined;

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
}: RadioGroupProps) {
  const uid = useId();
  const groupName = name ?? uid;
  const helperId = `${uid}-group-helper`;
  const isControlled = value !== undefined;

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
          orientation === "horizontal" ? "flex-row flex-wrap gap-(--spacing-lg)" : "flex-col gap-(--spacing-md)"
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
