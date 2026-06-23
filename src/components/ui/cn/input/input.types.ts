import type React from "react";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "outline" | "filled" | "flushed" | "ghost";
export type InputStatus = "default" | "error" | "success" | "warning";

/* ── Base text input (the default Input) ──────────────────────────────────── */
export interface InputBaseProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  variant?: InputVariant;
  /** Visual validation state. */
  status?: InputStatus;
  /** Alias for `status` (old API compat). */
  state?: InputStatus;
  label?: string;
  /** Generic helper text below the input. */
  hint?: string;
  /** Alias for `hint` (old API compat). */
  helperText?: string;
  /** Error message (also forces status=error when provided). */
  error?: string;
  /** Alias for `error`. */
  errorText?: string;
  /** Text shown when status/state === 'success'. */
  successText?: string;
  /** Text shown when status/state === 'warning'. */
  warningText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  fullWidth?: boolean;
  /** Shows a ×-button when input has value to clear it. */
  clearable?: boolean;
  onClear?: () => void;
  /** For type="password" — adds a show/hide toggle button. */
  revealable?: boolean;
  /** Renders a floating label that animates above the field on focus/value. */
  floatingLabel?: boolean;
}

/**
 * Default Input (text and the various native types except the absorbed
 * discriminators `number` | `currency` | `phone`).
 */
export type InputDefaultProps = InputBaseProps & {
  type?: Exclude<React.HTMLInputTypeAttribute, "number"> | "number";
  floatingLabel?: false;
};

/* ── number (absorbs NumberInput — stepper ± with min/max/step/precision) ─── */
export type NumberInputVariant = "default" | "ghost" | "filled";

export interface NumberModeProps {
  type: "number";
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  allowDecimal?: boolean;
  format?: (value: number) => string;
  parse?: (value: string) => number;
  size?: InputSize;
  /** NumberInput visual style. Note: different scale than the text Input `variant`. */
  variant?: NumberInputVariant;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  readOnly?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

/* ── currency (absorbs CurrencyInput — symbol + locale) ───────────────────── */
export interface CurrencyModeProps {
  type: "currency";
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  currency?: string;
  locale?: string;
  placeholder?: string;
  size?: InputSize;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

/* ── phone (absorbs PhoneInput — country selector + mask) ─────────────────── */
export interface PhoneModeProps {
  type: "phone";
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: InputSize;
  disabled?: boolean;
  defaultCountry?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Discriminated union dispatched by `type` (and `floatingLabel`). */
export type InputProps = NumberModeProps | CurrencyModeProps | PhoneModeProps | InputDefaultProps;
