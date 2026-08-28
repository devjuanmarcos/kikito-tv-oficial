"use client";
import { useState, useId } from "react";

import { cn } from "@/lib/utils";

import type { PasswordInputProps, PasswordInputSize } from "./password-input.types";

const SIZE: Record<PasswordInputSize, string> = {
  sm: "h-7  px-2.5 pr-9  text-body-callout",
  md: "h-9  px-3   pr-10 text-body-callout",
  lg: "h-11 px-3.5 pr-11 text-body-paragraph",
};
const SIZE_BTN: Record<PasswordInputSize, string> = {
  sm: "right-2   w-5 h-5",
  md: "right-2.5 w-5 h-5",
  lg: "right-3   w-6 h-6",
};

function getStrength(pwd: string): number {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["bg-rule", "bg-danger", "bg-warning", "bg-info", "bg-success"];
const STRENGTH_TEXT = ["text-faint", "text-danger", "text-warning", "text-info", "text-success"];

const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    className="w-full h-full"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    className="w-full h-full"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export function PasswordInput({
  value,
  defaultValue = "",
  onChange,
  placeholder = "Enter password",
  size = "md",
  disabled = false,
  invalid = false,
  showStrength = false,
  hint,
  errorMessage,
  id,
  className,
  style,
}: PasswordInputProps) {
  const uid = useId();
  const inputId = id ?? uid;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const [show, setShow] = useState(false);
  const [internal, setInternal] = useState(defaultValue);

  const isControlled = value !== undefined;
  const current = isControlled ? value ?? "" : internal;
  const strength = getStrength(current);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternal(e.target.value);
    onChange?.(e);
  }

  const describedBy = invalid && errorMessage ? errorId : hint ? hintId : undefined;

  return (
    <div style={style} className={cn("flex flex-col gap-(--spacing-xs)", className)}>
      <div className="relative flex items-center">
        <input
          id={inputId}
          type={show ? "text" : "password"}
          value={isControlled ? value : internal}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-(--radius-md) border bg-raised text-foreground placeholder:text-faint",
            "transition-[border-color] duration-[120ms] focus:outline-none focus:border-patina",
            SIZE[size],
            invalid ? "border-danger" : "border-rule",
            disabled ? "opacity-50 pointer-events-none" : ""
          )}
        />
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
          className={cn(
            "absolute flex items-center justify-center text-faint hover:text-foreground transition-colors",
            SIZE_BTN[size]
          )}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {showStrength && current.length > 0 && (
        <div className="flex flex-col gap-(--spacing-2xs)">
          {/* role=progressbar + aria-live: sem isso, a força mudava visualmente a cada tecla
              digitada mas nenhum leitor de tela era avisado (o foco fica no campo de senha,
              não aqui) — mesmo padrão já usado em PasswordStrength */}
          <div
            role="progressbar"
            aria-label="Password strength"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={strength}
            aria-valuetext={STRENGTH_LABELS[strength]}
            aria-live="polite"
            className="flex gap-(--spacing-2xs)"
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                aria-hidden="true"
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-[200ms]",
                  strength >= i ? STRENGTH_COLORS[strength] : "bg-rule"
                )}
              />
            ))}
          </div>
          {/* below scale minimum: micro-label de suporte sob a barra de força */}
          <p className={cn("text-[0.6875rem]", STRENGTH_TEXT[strength])} aria-hidden="true">
            {STRENGTH_LABELS[strength]}
          </p>
        </div>
      )}

      {invalid && errorMessage && (
        <p id={errorId} className="text-body-caption text-danger">
          {errorMessage}
        </p>
      )}
      {!invalid && hint && (
        <p id={hintId} className="text-body-caption text-faint">
          {hint}
        </p>
      )}
    </div>
  );
}
