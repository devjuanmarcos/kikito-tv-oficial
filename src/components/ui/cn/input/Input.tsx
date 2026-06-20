"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";

import type { InputProps, InputSize, InputVariant, InputStatus } from "./input.types";

const SIZE_INPUT: Record<InputSize, string> = {
  sm: "h-8  px-3   text-body-callout   rounded-(--radius-sm)",
  md: "h-9  px-3.5 text-body-callout   rounded-(--radius-base)",
  lg: "h-11 px-4   text-body-paragraph rounded-(--radius-md)",
};

/* Group (prefix/suffix) — height + radius on the wrapper, text on the input */
const GROUP_BOX: Record<InputSize, string> = {
  sm: "h-8  rounded-(--radius-sm)",
  md: "h-9  rounded-(--radius-base)",
  lg: "h-11 rounded-(--radius-md)",
};

const SIZE_TEXT: Record<InputSize, string> = {
  sm: "text-body-callout",
  md: "text-body-callout",
  lg: "text-body-paragraph",
};

const SIZE_ICON: Record<InputSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4   h-4",
  lg: "w-4   h-4",
};

const SIZE_PADDING_LEFT: Record<InputSize, string> = {
  sm: "pl-8",
  md: "pl-9",
  lg: "pl-10",
};

const SIZE_PADDING_RIGHT: Record<InputSize, string> = {
  sm: "pr-8",
  md: "pr-9",
  lg: "pr-10",
};

const SIZE_PADDING_RIGHT_2: Record<InputSize, string> = {
  sm: "pr-14",
  md: "pr-16",
  lg: "pr-18",
};

const FLUSHED_CLS = "bg-transparent border-0 border-b border-rule rounded-none focus:border-patina px-0";

/* Focus ring shared across Input / Select / Textarea for a consistent form look */
const FOCUS_RING = "focus:border-patina focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-patina)_18%,transparent)]";

const VARIANT: Record<InputVariant, string> = {
  outline: `bg-raised border border-rule hover:border-foreground/40 ${FOCUS_RING}`,
  filled: `bg-graphite border border-transparent hover:bg-graphite-2 focus:bg-graphite-2 ${FOCUS_RING}`,
  flushed: FLUSHED_CLS,
  ghost: FLUSHED_CLS,
};

const STATUS_BORDER: Record<InputStatus, string> = {
  default: "",
  error: "border-danger focus:border-danger focus-within:border-danger",
  success: "border-success focus:border-success focus-within:border-success",
  warning: "border-warning focus:border-warning focus-within:border-warning",
};

const STATUS_HINT: Record<InputStatus, string> = {
  default: "text-muted",
  error: "text-danger",
  success: "text-success",
  warning: "text-warning",
};

/* Centered, fixed-size icon box — keeps the SVG from stretching to the input height */
const ICON_BOX =
  "pointer-events-none absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-muted [&>svg]:w-full [&>svg]:h-full";
const ICON_BTN =
  "absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-muted hover:text-foreground transition-colors [&>svg]:w-full [&>svg]:h-full";

let _uid = 0;
const uniqueId = (prefix: string) => `${prefix}-${++_uid}`;

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

export function Input({
  size = "md",
  variant = "outline",
  status = "default",
  state,
  label,
  hint,
  helperText,
  error,
  errorText,
  successText,
  warningText,
  iconLeft,
  iconRight,
  prefix,
  suffix,
  fullWidth = false,
  clearable = false,
  onClear,
  revealable = false,
  id: idProp,
  className,
  disabled,
  type,
  value,
  onChange,
  ...props
}: InputProps) {
  const [id] = useState(() => idProp ?? uniqueId("ks-input"));
  const [revealed, setRevealed] = useState(false);

  const resolvedError = error ?? errorText;
  const resolvedHint = hint ?? helperText;
  const resolvedStatus: InputStatus = resolvedError ? "error" : state ?? status;

  const displayHint =
    resolvedStatus === "error"
      ? resolvedError
      : resolvedStatus === "success"
        ? successText ?? resolvedHint
        : resolvedStatus === "warning"
          ? warningText ?? resolvedHint
          : resolvedHint;

  const hintId = displayHint ? `${id}-hint` : undefined;

  const hasIconLeft = !!iconLeft;
  const hasPrefix = !!prefix;
  const hasSuffix = !!suffix;
  const hasAddon = hasPrefix || hasSuffix;

  /* Right-side slot: iconRight, clearable, or revealable */
  const hasRightSlot = !!iconRight || (clearable && !hasSuffix) || (revealable && !hasSuffix);
  /* Double right slot: both clearable and revealable */
  const hasDoubleRight = clearable && revealable && !hasSuffix;

  const inputType = revealable ? (revealed ? "text" : "password") : type;

  const hasValue = typeof value === "string" ? value.length > 0 : value !== undefined;

  const describedBy = hintId;
  const invalid = resolvedStatus === "error" || undefined;

  const labelEl = label && (
    <label htmlFor={id} className="text-body-callout font-medium text-foreground">
      {label}
    </label>
  );

  const hintEl = displayHint && (
    <p id={hintId} className={cn("text-body-caption", STATUS_HINT[resolvedStatus])}>
      {displayHint}
    </p>
  );

  /* ── Prefix / suffix: in-flow group so the addon never overlaps the placeholder ── */
  if (hasAddon) {
    return (
      <div className={cn("flex flex-col gap-1", fullWidth ? "w-full" : "w-auto")}>
        {labelEl}
        <div
          className={cn(
            "flex items-stretch w-full overflow-hidden bg-raised border border-rule",
            "transition-[border-color,box-shadow] duration-150",
            "focus-within:border-patina focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-patina)_18%,transparent)]",
            GROUP_BOX[size],
            STATUS_BORDER[resolvedStatus],
            disabled && "opacity-50"
          )}
        >
          {hasPrefix && (
            <span className="flex items-center px-3 text-muted bg-graphite border-r border-rule select-none whitespace-nowrap text-body-callout">
              {prefix}
            </span>
          )}
          <input
            {...props}
            id={id}
            type={inputType}
            disabled={disabled}
            value={value}
            onChange={onChange}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={cn(
              "flex-1 min-w-0 bg-transparent outline-none px-3 text-foreground placeholder:text-faint",
              "disabled:cursor-not-allowed",
              SIZE_TEXT[size],
              className
            )}
          />
          {hasSuffix && (
            <span className="flex items-center px-3 text-muted bg-graphite border-l border-rule select-none whitespace-nowrap text-body-callout">
              {suffix}
            </span>
          )}
        </div>
        {hintEl}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", fullWidth ? "w-full" : "w-auto")}>
      {labelEl}

      <div className="relative flex items-center">
        {hasIconLeft && <span className={cn(ICON_BOX, "left-3", SIZE_ICON[size])}>{iconLeft}</span>}

        <input
          {...props}
          id={id}
          type={inputType}
          disabled={disabled}
          value={value}
          onChange={onChange}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={cn(
            "w-full outline-none transition-[border-color,box-shadow,background] duration-150",
            "text-foreground placeholder:text-faint",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            SIZE_INPUT[size],
            VARIANT[variant],
            STATUS_BORDER[resolvedStatus],
            hasIconLeft && SIZE_PADDING_LEFT[size],
            hasDoubleRight ? SIZE_PADDING_RIGHT_2[size] : hasRightSlot ? SIZE_PADDING_RIGHT[size] : null,
            className
          )}
        />

        {/* Right icon (static, no clearable/revealable) */}
        {iconRight && !clearable && !revealable && (
          <span className={cn(ICON_BOX, "right-3", SIZE_ICON[size])}>{iconRight}</span>
        )}

        {/* Clearable × button */}
        {clearable && hasValue && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="Limpar"
            onClick={() => onClear?.()}
            className={cn(ICON_BTN, revealable ? "right-8" : "right-3", SIZE_ICON[size])}
          >
            <XCircleIcon />
          </button>
        )}

        {/* Revealable eye toggle */}
        {revealable && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={revealed ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setRevealed((r) => !r)}
            className={cn(ICON_BTN, "right-3", SIZE_ICON[size])}
          >
            <EyeIcon open={revealed} />
          </button>
        )}
      </div>

      {hintEl}
    </div>
  );
}

Input.displayName = "Input";
