"use client";
import { cn } from "@/lib/utils";

import type { FeatureListProps, FeatureListIntent } from "./feature-list.types";

const INTENT_CLS: Record<FeatureListIntent, string> = {
  primary: "text-patina-soft-fg bg-patina-soft",
  success: "text-success-soft-fg bg-success-soft",
  warning: "text-warning-soft-fg bg-warning-soft",
  danger: "text-danger-soft-fg bg-danger-soft",
  info: "text-info-soft-fg bg-info-soft",
  neutral: "text-neutral-soft-fg bg-neutral-soft",
};

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

export function FeatureList({ items, variant = "check", intent = "primary", className, style }: FeatureListProps) {
  return (
    <ul style={style} className={cn("flex flex-col gap-(--spacing-md)", className)}>
      {items.map((item, i) => {
        const available = item.available !== false;
        return (
          <li key={i} className={cn("flex items-start gap-(--spacing-md)", !available && "opacity-40")}>
            {/* Indicator */}
            {variant === "check" && (
              <span
                aria-hidden="true"
                className={cn(
                  "flex-shrink-0 mt-(--spacing-3xs) flex items-center justify-center w-5 h-5 rounded-full",
                  available ? INTENT_CLS[intent] : "bg-graphite text-faint"
                )}
              >
                {available ? <CheckIcon /> : <XIcon />}
              </span>
            )}
            {variant === "numbered" && (
              <span
                aria-hidden="true"
                className={cn(
                  // below scale minimum: numeral em badge circular pequeno (indicador decorativo,
                  // a ordem real já é comunicada pela posição do <li> na lista pro leitor de tela)
                  "flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-[0.65rem] font-bold",
                  INTENT_CLS[intent]
                )}
              >
                {i + 1}
              </span>
            )}
            {variant === "icon" && (
              <span
                aria-hidden="true"
                className={cn(
                  "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-body-title",
                  INTENT_CLS[intent]
                )}
              >
                {item.icon}
              </span>
            )}

            <div>
              <p className="text-body-callout font-medium text-foreground">
                {!available && <span className="sr-only">Não disponível: </span>}
                {item.title}
              </p>
              {item.description && (
                <p className="text-body-caption text-faint mt-(--spacing-3xs)">{item.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
