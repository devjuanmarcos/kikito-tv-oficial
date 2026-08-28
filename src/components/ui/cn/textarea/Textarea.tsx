"use client";
import type React from "react";
import { useId, useRef, useEffect, useState, forwardRef } from "react";

import { cn } from "@/lib/utils";

import type { TextareaProps, TextareaSize, TextareaState, TextareaVariant } from "./textarea.types";

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

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.RefObject<T | null>).current = node;
    }
  };
}

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
  const feedbackId = `${uid}-feedback`;
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const mergedRef = mergeRefs(ref, innerRef);

  // uncontrolled (sem `value`): o contador precisa acompanhar o DOM real a cada digitação,
  // não só o `defaultValue` do mount — sem isso o contador ficava travado em 0 pra sempre
  const [uncontrolledLength, setUncontrolledLength] = useState(
    typeof defaultValue === "string" ? defaultValue.length : 0
  );
  const charCount = typeof value === "string" ? value.length : uncontrolledLength;

  function adjustHeight() {
    const el = innerRef.current;
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
    <div className={cn("flex flex-col gap-(--spacing-xs)", className)}>
      {label && (
        <label className="text-body-callout font-semibold text-foreground leading-none" htmlFor={uid}>
          {label}
        </label>
      )}

      <textarea
        id={uid}
        ref={mergedRef}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        aria-invalid={effectiveState === "error" || undefined}
        aria-describedby={feedbackText ? feedbackId : undefined}
        onChange={(e) => {
          adjustHeight();
          setUncontrolledLength(e.target.value.length);
          onChange?.(e);
        }}
        className={cn(
          "w-full rounded-(--radius-sm) font-inherit text-foreground placeholder:text-faint outline-none transition-[border-color,box-shadow,background] duration-[140ms]",
          VARIANT_CLS[variant],
          SIZE_CLS[size],
          effectiveState === "error" && "border-danger",
          effectiveState === "success" && "border-success",
          effectiveState === "warning" && "border-warning",
          rest.disabled && "opacity-55 cursor-not-allowed",
          rest.readOnly && "opacity-75"
        )}
        style={{ resize: autoResize ? "none" : resize, ...rest.style }}
        {...rest}
      />

      <div className="flex items-center justify-between gap-(--spacing-sm)">
        {feedbackText && (
          <span id={feedbackId} className={cn("text-body-caption", STATE_TEXT_CLS[effectiveState])}>
            {feedbackText}
          </span>
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
