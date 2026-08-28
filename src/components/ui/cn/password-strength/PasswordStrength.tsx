"use client";
import { cn } from "@/lib/utils";

import type { PasswordStrengthProps } from "./password-strength.types";

const RULES = [
  { id: "len", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "digit", label: "Number", test: (p: string) => /\d/.test(p) },
  { id: "special", label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_COLORS = ["bg-danger", "bg-warning", "bg-warning", "bg-success", "bg-success"];
const STRENGTH_LABELS = ["Empty", "Weak", "Fair", "Good", "Strong"];

function getStrength(pwd: string): number {
  return RULES.filter((r) => r.test(pwd)).length;
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className="w-3 h-3">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className="w-3 h-3">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

export function PasswordStrength({ value, showRules = true, className, style }: PasswordStrengthProps) {
  const strength = value.length === 0 ? 0 : getStrength(value);

  return (
    <div style={style} className={cn("flex flex-col gap-(--spacing-sm)", className)}>
      {/* Bars — role=progressbar + aria-live: sem isso, a força mudava visualmente a
          cada tecla digitada mas nenhum leitor de tela era avisado (o foco fica no
          campo de senha, não aqui, então precisa de aria-live pra anunciar sozinho) */}
      <div
        role="progressbar"
        aria-label="Password strength"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={strength}
        aria-valuetext={STRENGTH_LABELS[strength]}
        aria-live="polite"
        className="flex items-center gap-(--spacing-xs)"
      >
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            aria-hidden="true"
            className={cn(
              "flex-1 h-1.5 rounded-full transition-[background] duration-[200ms]",
              value.length > 0 && n <= strength ? STRENGTH_COLORS[strength] : "bg-graphite-2"
            )}
          />
        ))}
        {value.length > 0 && strength > 0 && (
          <span
            aria-hidden="true"
            className={cn(
              "text-body-caption font-medium ml-(--spacing-2xs) whitespace-nowrap",
              strength >= 4 ? "text-success" : strength >= 3 ? "text-warning" : "text-danger"
            )}
          >
            {STRENGTH_LABELS[strength]}
          </span>
        )}
      </div>

      {/* Rules checklist — antes o pass/fail só era transmitido pelo ícone (aria-hidden),
          então o item nunca dizia se a regra tinha sido cumprida ou não pra quem usa
          leitor de tela. Agora o aria-label do <li> inclui o estado. */}
      {showRules && (
        <ul className="flex flex-col gap-(--spacing-2xs)">
          {RULES.map((rule) => {
            const ok = value.length > 0 && rule.test(value);
            return (
              <li
                key={rule.id}
                aria-label={`${rule.label}: ${ok ? "met" : "not met"}`}
                className={cn(
                  "flex items-center gap-(--spacing-xs) text-body-caption",
                  ok ? "text-success" : "text-faint"
                )}
              >
                {ok ? <CheckIcon /> : <XIcon />}
                <span aria-hidden="true">{rule.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
