"use client";

import React, { useState, useRef, useId } from "react";

import { cn } from "@/lib/utils";

import type {
  InputProps,
  InputBaseProps,
  InputDefaultProps,
  InputSize,
  InputVariant,
  InputStatus,
  NumberModeProps,
  NumberInputVariant,
  CurrencyModeProps,
  PhoneModeProps,
} from "./input.types";

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
const FOCUS_RING = "focus:border-patina focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-primary)_18%,transparent)]";

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

/* ──────────────────────────────────────────────────────────────────────────
 * TextInputImpl — the default text Input (former Input body, verbatim).
 * ─────────────────────────────────────────────────────────────────────── */
function TextInputImpl({
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
  floatingLabel: _floatingLabel,
  ...props
}: InputBaseProps) {
  const uid = useId();
  const id = idProp ?? uid;
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
      <div className={cn("flex flex-col gap-(--spacing-2xs)", fullWidth ? "w-full" : "w-auto")}>
        {labelEl}
        <div
          className={cn(
            "flex items-stretch w-full overflow-hidden bg-raised border border-rule",
            "transition-[border-color,box-shadow] duration-150",
            "focus-within:border-patina focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-primary)_18%,transparent)]",
            GROUP_BOX[size],
            STATUS_BORDER[resolvedStatus],
            disabled && "opacity-50"
          )}
        >
          {hasPrefix && (
            <span className="flex items-center px-(--spacing-md) text-muted bg-graphite border-r border-rule select-none whitespace-nowrap text-body-callout">
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
              "flex-1 min-w-0 bg-transparent outline-none px-(--spacing-md) text-foreground placeholder:text-faint",
              "disabled:cursor-not-allowed",
              SIZE_TEXT[size],
              className
            )}
          />
          {hasSuffix && (
            <span className="flex items-center px-(--spacing-md) text-muted bg-graphite border-l border-rule select-none whitespace-nowrap text-body-callout">
              {suffix}
            </span>
          )}
        </div>
        {hintEl}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-(--spacing-2xs)", fullWidth ? "w-full" : "w-auto")}>
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

/* ──────────────────────────────────────────────────────────────────────────
 * FloatingLabelImpl — floatingLabel variant (former FloatingLabelInput).
 * Logic ported verbatim; maps Input's `status`/`error` onto invalid state.
 * ─────────────────────────────────────────────────────────────────────── */
type FloatingLabelVariant = "outline" | "filled" | "underline";
type FloatingLabelSize = "sm" | "md" | "lg";

const FL_SIZE_WRAP: Record<FloatingLabelSize, string> = {
  sm: "h-10",
  md: "h-12",
  lg: "h-14",
};
const FL_SIZE_INPUT: Record<FloatingLabelSize, string> = {
  sm: "text-body-callout px-3",
  md: "text-body-callout px-3",
  lg: "text-body-paragraph px-4",
};
const FL_SIZE_LABEL_RESTING: Record<FloatingLabelSize, string> = {
  sm: "text-body-callout top-[50%] -translate-y-1/2 left-3",
  md: "text-body-callout top-[50%] -translate-y-1/2 left-3",
  lg: "text-body-paragraph top-[50%] -translate-y-1/2 left-4",
};
/* below scale minimum: floated micro-label is intentionally smaller than
   text-body-caption (0.75rem) to fit the compact floating-label affordance */
const FL_SIZE_LABEL_FLOAT: Record<FloatingLabelSize, string> = {
  sm: "text-[0.65rem] top-1.5 left-3",
  md: "text-[0.65rem] top-1.5 left-3",
  lg: "text-[0.65rem] top-1.5 left-4",
};
const FL_SIZE_INPUT_PT: Record<FloatingLabelSize, string> = {
  sm: "pt-4 pb-1",
  md: "pt-5 pb-1",
  lg: "pt-6 pb-1",
};
const FL_VARIANT_WRAP: Record<FloatingLabelVariant, string> = {
  outline: "border border-rule rounded-lg bg-transparent",
  filled: "bg-graphite rounded-lg border border-transparent",
  underline: "border-b border-rule rounded-none bg-transparent",
};
const FL_VARIANT_FOCUS: Record<FloatingLabelVariant, string> = {
  outline: "focus-within:border-patina",
  filled: "focus-within:border-patina focus-within:bg-graphite-2",
  underline: "focus-within:border-patina",
};
const FL_VARIANT_ERROR: Record<FloatingLabelVariant, string> = {
  outline: "border-danger",
  filled: "border-danger",
  underline: "border-danger",
};

/** Maps the Super Input `variant` (outline|filled|flushed|ghost) onto the
 *  floating-label variant scale (outline|filled|underline). */
function toFloatingVariant(v: InputVariant | undefined): FloatingLabelVariant {
  if (v === "filled") return "filled";
  if (v === "flushed" || v === "ghost") return "underline";
  return "outline";
}

function FloatingLabelImpl({
  size = "md",
  variant,
  state,
  status = "default",
  label,
  id: idProp,
  value,
  defaultValue,
  onChange,
  type = "text",
  disabled = false,
  error,
  errorText,
  hint,
  helperText,
  className,
  style,
  fullWidth: _fullWidth,
  floatingLabel: _floatingLabel,
  iconLeft: _iconLeft,
  iconRight: _iconRight,
  prefix: _prefix,
  suffix: _suffix,
  clearable: _clearable,
  onClear: _onClear,
  revealable: _revealable,
  successText: _successText,
  warningText: _warningText,
  ...inputProps
}: InputBaseProps) {
  const uid = useId();
  const inputId = idProp ?? uid;

  const flVariant = toFloatingVariant(variant);
  const flSize = size as FloatingLabelSize;

  const errorMessage = error ?? errorText;
  const resolvedStatus: InputStatus = errorMessage ? "error" : state ?? status;
  const invalid = resolvedStatus === "error";
  const resolvedHint = hint ?? helperText;

  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState((defaultValue as string) ?? "");
  const currentVal = isControlled ? (value as string) : internalVal;

  const [focused, setFocused] = useState(false);
  const floated = focused || (typeof currentVal === "string" && currentVal.length > 0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternalVal(e.target.value);
    onChange?.(e);
  }

  const hasError = invalid || !!errorMessage;
  const labelText = label ?? "";

  return (
    <div style={style} className={cn("flex flex-col gap-(--spacing-2xs)", className)}>
      <div
        className={cn(
          "relative w-full transition-[border-color,background] duration-[120ms]",
          FL_SIZE_WRAP[flSize],
          FL_VARIANT_WRAP[flVariant],
          !hasError && FL_VARIANT_FOCUS[flVariant],
          hasError && FL_VARIANT_ERROR[flVariant],
          disabled && "opacity-50"
        )}
      >
        <input
          {...inputProps}
          id={inputId}
          type={type}
          value={isControlled ? (value as string) : internalVal}
          defaultValue={undefined}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={errorMessage ? `${inputId}-err` : resolvedHint ? `${inputId}-hint` : undefined}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          className={cn(
            "w-full h-full bg-transparent outline-none text-foreground placeholder-transparent",
            FL_SIZE_INPUT[flSize],
            floated && FL_SIZE_INPUT_PT[flSize]
          )}
          placeholder={labelText}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute pointer-events-none text-faint transition-all duration-[120ms] ease-in-out",
            floated ? [FL_SIZE_LABEL_FLOAT[flSize], "text-patina"] : FL_SIZE_LABEL_RESTING[flSize],
            hasError && floated && "text-danger"
          )}
        >
          {labelText}
        </label>
      </div>
      {hasError && errorMessage ? (
        <p
          id={`${inputId}-err`}
          role="alert"
          className="flex items-center gap-(--spacing-2xs) text-body-caption text-danger"
        >
          <span aria-hidden="true">⚠</span>
          {errorMessage}
        </p>
      ) : resolvedHint ? (
        <p id={`${inputId}-hint`} className="text-body-caption text-faint">
          {resolvedHint}
        </p>
      ) : null}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * NumberInputImpl — type="number" (former NumberInput, verbatim logic).
 * ─────────────────────────────────────────────────────────────────────── */
const NUM_SIZE: Record<InputSize, string> = {
  sm: "h-7  text-body-caption",
  md: "h-9  text-body-callout",
  lg: "h-11 text-body-paragraph",
};
const NUM_SIZE_BTN: Record<InputSize, string> = {
  sm: "w-6",
  md: "w-7",
  lg: "w-8",
};
const NUM_VARIANT_WRAP: Record<NumberInputVariant, string> = {
  default: "border border-rule bg-raised",
  ghost: "border border-transparent bg-transparent hover:bg-graphite",
  filled: "border border-transparent bg-graphite-2",
};

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-3 h-3">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const MinusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-3 h-3">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

function round(v: number, precision: number) {
  const f = Math.pow(10, precision);
  return Math.round(v * f) / f;
}

function NumberInputImpl({
  value,
  defaultValue = 0,
  onChange,
  min,
  max,
  step = 1,
  precision = 0,
  allowDecimal = false,
  format,
  parse,
  size = "md",
  variant = "default",
  label,
  helperText,
  error = false,
  errorMessage,
  disabled = false,
  readOnly = false,
  prefix,
  suffix,
  id,
  className,
  style,
}: Omit<NumberModeProps, "type">) {
  const uid = useId();
  const inputId = id ?? uid;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const [inputStr, setInputStr] = useState(String(isControlled ? value : defaultValue));
  const [focused, setFocused] = useState(false);

  const current = isControlled ? value! : internal;

  function clampVal(v: number) {
    let n = round(v, precision);
    if (min !== undefined) n = Math.max(min, n);
    if (max !== undefined) n = Math.min(max, n);
    return n;
  }

  function set(n: number) {
    const clamped = clampVal(n);
    if (!isControlled) setInternal(clamped);
    setInputStr(format ? format(clamped) : String(clamped));
    onChange?.(clamped);
  }

  function increment() {
    set(current + step);
  }
  function decrement() {
    set(current - step);
  }

  function handleFocus() {
    setFocused(true);
    setInputStr(String(current));
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setFocused(false);
    const parsed = parse ? parse(e.target.value) : parseFloat(e.target.value);
    if (!isNaN(parsed)) set(parsed);
    else setInputStr(format ? format(current) : String(current));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputStr(e.target.value);
  }

  const displayValue = focused ? inputStr : format ? format(current) : String(current);

  const atMin = min !== undefined && current <= min;
  const atMax = max !== undefined && current >= max;

  return (
    <div style={style} className={cn("flex flex-col gap-(--spacing-2xs)", className)}>
      {label && (
        <label htmlFor={inputId} className="text-body-callout font-medium text-foreground">
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-center rounded-(--radius-md) overflow-hidden transition-[border-color] duration-[120ms] focus-within:border-patina",
          NUM_SIZE[size],
          NUM_VARIANT_WRAP[variant],
          error ? "!border-danger" : "",
          disabled ? "opacity-50 pointer-events-none" : ""
        )}
      >
        {prefix && <span className="flex items-center px-(--spacing-sm) text-faint shrink-0">{prefix}</span>}
        <input
          id={inputId}
          type="text"
          inputMode={allowDecimal ? "decimal" : "numeric"}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={readOnly}
          disabled={disabled}
          aria-invalid={error || undefined}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              increment();
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              decrement();
            }
          }}
          className="flex-1 min-w-0 h-full bg-transparent outline-none text-foreground text-center tabular-nums px-(--spacing-2xs)"
        />
        {suffix && <span className="flex items-center px-(--spacing-sm) text-faint shrink-0">{suffix}</span>}
        <div className={cn("flex flex-col h-full border-l border-rule shrink-0", NUM_SIZE_BTN[size])}>
          <button
            type="button"
            aria-label="Increment"
            onClick={increment}
            disabled={disabled || readOnly || atMax}
            className="flex-1 flex items-center justify-center text-faint hover:text-foreground hover:bg-graphite transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <PlusIcon />
          </button>
          <div className="h-px bg-rule" />
          <button
            type="button"
            aria-label="Decrement"
            onClick={decrement}
            disabled={disabled || readOnly || atMin}
            className="flex-1 flex items-center justify-center text-faint hover:text-foreground hover:bg-graphite transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <MinusIcon />
          </button>
        </div>
      </div>
      {error && errorMessage && <p className="text-body-caption text-danger">{errorMessage}</p>}
      {!error && helperText && <p className="text-body-caption text-faint">{helperText}</p>}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * CurrencyInputImpl — type="currency" (former CurrencyInput, verbatim logic).
 * ─────────────────────────────────────────────────────────────────────── */
function getSymbol(currency: string, locale: string) {
  try {
    return (0)
      .toLocaleString(locale, { style: "currency", currency, minimumFractionDigits: 0 })
      .replace(/[\d\s,.']+/g, "")
      .trim();
  } catch {
    return currency;
  }
}

function CurrencyInputImpl({
  value,
  onChange,
  currency = "USD",
  locale = "en-US",
  min,
  max,
  step = 0.01,
  placeholder = "0.00",
  disabled = false,
  label,
  className,
  style,
}: Omit<CurrencyModeProps, "type">) {
  const uid = useId();
  const inputId = uid;
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const symbol = getSymbol(currency, locale);

  const formatted =
    value !== undefined && value !== null ? value.toLocaleString(locale, { style: "currency", currency }) : "";

  function onFocus() {
    setRaw(value !== undefined && value !== null ? String(value) : "");
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.select());
  }

  function commit() {
    const parsed = parseFloat(raw.replace(/[^0-9.\-]/g, ""));
    if (!isNaN(parsed)) {
      let clamped = parsed;
      if (min !== undefined) clamped = Math.max(min, clamped);
      if (max !== undefined) clamped = Math.min(max, clamped);
      onChange?.(clamped);
    }
    setEditing(false);
  }

  return (
    <div className={cn("flex flex-col gap-(--spacing-2xs)", className)} style={style}>
      {label && (
        <label htmlFor={inputId} className="text-body-callout font-medium text-muted">
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-center gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-sm) rounded-(--radius-sm) border border-rule bg-canvas transition-colors",
          !disabled && "focus-within:border-patina/60",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <span className="text-faint text-body-callout shrink-0">{symbol}</span>
        {editing ? (
          <input
            ref={inputRef}
            id={inputId}
            type="number"
            step={step}
            min={min}
            max={max}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
            }}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none text-foreground text-body-callout [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        ) : (
          <input
            id={inputId}
            type="text"
            readOnly={!editing}
            value={formatted}
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none text-foreground text-body-callout cursor-text placeholder:text-faint"
          />
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * PhoneInputImpl — type="phone" (former PhoneInput, verbatim logic).
 * ─────────────────────────────────────────────────────────────────────── */
const PHONE_COUNTRIES = [
  { code: "BR", dial: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "US", dial: "+1", flag: "🇺🇸", name: "United States" },
  { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "DE", dial: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "FR", dial: "+33", flag: "🇫🇷", name: "France" },
  { code: "JP", dial: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "CA", dial: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "AU", dial: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "IN", dial: "+91", flag: "🇮🇳", name: "India" },
  { code: "MX", dial: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "PT", dial: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "ES", dial: "+34", flag: "🇪🇸", name: "Spain" },
];

const PHONE_SIZE_CLS: Record<string, string> = {
  sm: "text-body-callout h-8",
  md: "text-body-callout h-10",
  lg: "text-body-paragraph h-12",
};

function PhoneInputImpl({
  value,
  defaultValue = "",
  onChange,
  placeholder = "(00) 00000-0000",
  size = "md",
  disabled = false,
  defaultCountry = "BR",
  className,
  style,
}: Omit<PhoneModeProps, "type">) {
  const [internal, setInternal] = useState(defaultValue);
  const [country, setCountry] = useState(PHONE_COUNTRIES.find((c) => c.code === defaultCountry) ?? PHONE_COUNTRIES[0]);
  const phone = value !== undefined ? value : internal;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/[^0-9\s()\-+]/g, "");
    if (value === undefined) setInternal(v);
    onChange?.(`${country.dial} ${v}`);
  }

  return (
    <div
      className={cn(
        "flex items-stretch rounded-(--radius-sm) border border-rule bg-canvas overflow-hidden focus-within:border-patina/60 transition-colors",
        disabled && "opacity-60 cursor-not-allowed",
        PHONE_SIZE_CLS[size] ?? PHONE_SIZE_CLS.md,
        className
      )}
      style={style}
    >
      {/* Country selector */}
      {/* px-2.5 (0.625rem) sits between --spacing-sm (0.5rem) and --spacing-md (0.75rem) — no exact token match */}
      <div className="relative flex items-center gap-(--spacing-xs) px-2.5 border-r border-rule bg-graphite/40 shrink-0">
        <span className="text-body-paragraph leading-none">{country.flag}</span>
        <span className="text-body-callout text-muted font-medium tabular-nums">{country.dial}</span>
        <select
          className="absolute inset-0 opacity-0 cursor-pointer w-full"
          value={country.code}
          disabled={disabled}
          onChange={(e) => {
            const c = PHONE_COUNTRIES.find((c) => c.code === e.target.value);
            if (c) setCountry(c);
          }}
          aria-label="Country"
        >
          {PHONE_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name} ({c.dial})
            </option>
          ))}
        </select>
      </div>

      <input
        type="tel"
        aria-label="Phone number"
        value={phone}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleChange}
        className="flex-1 px-(--spacing-md) bg-transparent outline-none text-foreground placeholder:text-faint"
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Input — Super component.
 * Dispatches by the `type` discriminator (number | currency | phone) and the
 * `floatingLabel` flag. All other types fall through to the text Input.
 * Absorbs NumberInput / CurrencyInput / PhoneInput / FloatingLabelInput
 * (each now a backward-compat wrapper).
 * ─────────────────────────────────────────────────────────────────────── */
export function Input(props: InputProps) {
  if (props.type === "number") {
    const { type: _t, ...rest } = props as NumberModeProps;
    return <NumberInputImpl {...rest} />;
  }
  if (props.type === "currency") {
    const { type: _t, ...rest } = props as CurrencyModeProps;
    return <CurrencyInputImpl {...rest} />;
  }
  if (props.type === "phone") {
    const { type: _t, ...rest } = props as PhoneModeProps;
    return <PhoneInputImpl {...rest} />;
  }
  if ((props as InputDefaultProps).floatingLabel) {
    return <FloatingLabelImpl {...(props as InputBaseProps)} />;
  }
  return <TextInputImpl {...(props as InputBaseProps)} />;
}

Input.displayName = "Input";
