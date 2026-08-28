"use client";
import type React from "react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

import type { SwitchIntent, SwitchProps, SwitchSize } from "./switch.types";

const SIZE_TRACK: Record<SwitchSize, string> = {
  sm: "w-7 h-4",
  md: "w-9 h-5",
  lg: "w-12 h-6",
};
const SIZE_THUMB_OFF: Record<SwitchSize, string> = {
  sm: "w-2.5 h-2.5 translate-x-[3px]",
  md: "w-3.5 h-3.5 translate-x-[3px]",
  lg: "w-4 h-4 translate-x-1",
};
const SIZE_THUMB_ON: Record<SwitchSize, string> = {
  sm: "translate-x-[15px]",
  md: "translate-x-[19px]",
  lg: "translate-x-7",
};
const INTENT_CLS: Record<SwitchIntent, string> = {
  primary: "bg-patina",
  secondary: "bg-kinpaku",
  success: "bg-success",
  destructive: "bg-danger",
  warning: "bg-warning",
  info: "bg-info",
};

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  label,
  description,
  size = "md",
  intent = "primary",
  labelPosition = "right",
  disabled = false,
  className,
  style,
}: SwitchProps) {
  const uid = useId();
  const descId = `${uid}-description`;
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const isOn = isControlled ? checked ?? false : internal;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternal(e.target.checked);
    onChange?.(e.target.checked);
  }

  const labelEl = (label || description) && (
    <span className="flex flex-col gap-[0.1rem]">
      {label && <span className="text-body-callout font-medium text-foreground leading-tight">{label}</span>}
      {description && (
        <span id={descId} className="text-body-caption text-faint leading-[1.4]">
          {description}
        </span>
      )}
    </span>
  );

  return (
    <label
      className={cn(
        "inline-flex items-center gap-(--spacing-md) cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={style}
      htmlFor={uid}
    >
      {labelPosition === "left" && labelEl}

      <span
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-[160ms]",
          SIZE_TRACK[size],
          isOn ? INTENT_CLS[intent] : "bg-graphite-2"
        )}
      >
        <input
          id={uid}
          type="checkbox"
          role="switch"
          className="sr-only"
          checked={isControlled ? checked : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          disabled={disabled}
          aria-checked={isOn}
          aria-describedby={description ? descId : undefined}
          onChange={handleChange}
        />
        <span
          className={cn(
            // bg-canvas: thumb precisa ser opaco/neutro em qualquer intent/tema — bg-white
            // hardcoded quebrava em light mode (mesmo achado já corrigido no Slider)
            "absolute rounded-full bg-canvas shadow-sm transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            SIZE_THUMB_OFF[size],
            isOn && SIZE_THUMB_ON[size]
          )}
          aria-hidden="true"
        />
      </span>

      {labelPosition === "right" && labelEl}
    </label>
  );
}
