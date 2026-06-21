"use client";
import type React from "react";
import { useId, useRef, useEffect, forwardRef } from "react";

import { cn } from "@/lib/utils";

export type TextareaVariant = "outline" | "filled" | "ghost";
export type TextareaSize = "sm" | "md" | "lg";
export type TextareaState = "default" | "error" | "success" | "warning";
export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  state?: TextareaState;
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  warningText?: string;
  showCount?: boolean;
  autoResize?: boolean;
  maxRows?: number;
  resize?: TextareaResize;
  className?: string;
}

const VARIANT_CLS: Record<TextareaVariant, string> = {
  outline:
    "bg-raised border border-rule hover:border-foreground/40 focus:border-patina focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-primary)_18%,transparent)]",
  filled:
    "bg-graphite border border-transparent hover:bg-graphite-2 focus:bg-graphite-2 focus:border-patina focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-primary)_18%,transparent)]",
  ghost:
    "bg-transparent border-0 border-b border-rule rounded-none hover:border-foreground/40 focus:border-b-patina outline-none",
};
const SIZE_CLS: Record<TextareaSize, string> = {
  sm: "px-2.5 py-1.5 text-body-caption",
  md: "px-3 py-2 text-body-callout",
  lg: "px-4 py-3 text-body-paragraph",
};
const STATE_TEXT_CLS: Record<TextareaState, string> = {
  default: "text-faint",
  error: "text-danger",
  success: "text-success",
  warning: "text-warning",
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    variant = "outline",
    size = "md",
    state = "default",
    label,
    helperText,
    errorText,
    successText,
    warningText,
    showCount = false,
    autoResize = false,
    maxRows,
    resize = "vertical",
    className,
    maxLength,
    value,
    defaultValue,
    onChange,
    ...rest
  },
  ref
) {
  const uid = useId();
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const taRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? innerRef;

  const charCount =
    typeof value === "string" ? value.length : typeof defaultValue === "string" ? defaultValue.length : 0;

  function adjustHeight() {
    const el = taRef.current;
    if (!el || !autoResize) return;
    el.style.height = "auto";
    let h = el.scrollHeight;
    if (maxRows) {
      const lineH = parseInt(getComputedStyle(el).lineHeight) || 20;
      const pad = parseInt(getComputedStyle(el).paddingTop) + parseInt(getComputedStyle(el).paddingBottom);
      h = Math.min(h, maxRows * lineH + pad);
    }
    el.style.height = `${h}px`;
  }

  useEffect(() => {
    adjustHeight();
  }, [value, defaultValue]);

  const effectiveState: TextareaState = errorText ? "error" : successText ? "success" : warningText ? "warning" : state;
  const feedbackText =
    effectiveState === "error"
      ? errorText
      : effectiveState === "success"
        ? successText
        : effectiveState === "warning"
          ? warningText
          : helperText;

  return (
    <div className={cn("flex flex-col gap-[0.375rem]", className)}>
      {label && (
        <label className="text-body-callout font-semibold text-foreground leading-none" htmlFor={uid}>
          {label}
        </label>
      )}

      <textarea
        id={uid}
        ref={taRef}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={(e) => {
          adjustHeight();
          onChange?.(e);
        }}
        className={cn(
          "w-full rounded-(--radius-sm) font-inherit text-foreground placeholder:text-faint outline-none transition-[border-color,box-shadow,background] duration-[140ms]",
          VARIANT_CLS[variant],
          SIZE_CLS[size],
          effectiveState === "error" && "border-danger/60",
          effectiveState === "success" && "border-success/60",
          effectiveState === "warning" && "border-warning/60",
          rest.disabled && "opacity-55 cursor-not-allowed",
          rest.readOnly && "opacity-75"
        )}
        style={{ resize: autoResize ? "none" : resize, ...rest.style }}
        {...rest}
      />

      <div className="flex items-center justify-between gap-2">
        {feedbackText && (
          <span className={cn("text-body-caption", STATE_TEXT_CLS[effectiveState])}>{feedbackText}</span>
        )}
        {showCount && (
          <span
            className={cn(
              "text-body-caption ml-auto tabular-nums",
              maxLength && charCount >= maxLength * 0.9 ? "text-warning" : "text-faint"
            )}
          >
            {charCount}
            {maxLength ? ` / ${maxLength}` : ""}
          </span>
        )}
      </div>
    </div>
  );
});
