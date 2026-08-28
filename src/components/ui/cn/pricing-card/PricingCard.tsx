"use client";
import { Badge } from "@/components/ui/cn/badge";
import { Button } from "@/components/ui/cn/button";
import { cn } from "@/lib/utils";

import type { PricingCardProps } from "./pricing-card.types";

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
    className="w-4 h-4 text-success flex-shrink-0"
  >
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const XIcon = () => (
  // sem /40 aqui: a opacidade de "não incluído" já vem do `opacity-40` do <li>
  // (tratamento tipo "desabilitado" da linha inteira) — duplicar no ícone só
  // diluía ainda mais um traço que já é fraco por natureza (text-faint)
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
    className="w-4 h-4 text-faint flex-shrink-0"
  >
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

export function PricingCard({
  name,
  price,
  features,
  period = "/month",
  description,
  cta = "Get started",
  onSelect,
  highlighted = false,
  badge,
  className,
  style,
}: PricingCardProps) {
  return (
    <div
      style={style}
      className={cn(
        "relative flex flex-col rounded-2xl border p-(--spacing-xl) h-full transition-[border-color,box-shadow] duration-[200ms]",
        highlighted
          ? "border-patina shadow-[0_0_0_3px_color-mix(in_srgb,var(--ks-primary)_20%,transparent)] bg-raised"
          : "border-rule bg-raised",
        className
      )}
    >
      {badge && (
        // Badge CN já existe — reaproveitado em vez de reinventar o pill
        // (era text-[0.65rem] ad-hoc; Badge usa 0.625rem, a escala real)
        <Badge
          intent="primary"
          variant="solid"
          size="sm"
          className="absolute -top-3 left-1/2 -translate-x-1/2 uppercase tracking-wide whitespace-nowrap"
        >
          {badge}
        </Badge>
      )}

      <div className="mb-(--spacing-lg)">
        <h3 className="text-body-callout font-semibold text-foreground">{name}</h3>
        {description && <p className="text-body-caption text-faint mt-(--spacing-2xs)">{description}</p>}
      </div>

      <div className="flex items-baseline gap-(--spacing-3xs) mb-(--spacing-2xl)">
        <span className="text-heading-04 font-bold text-foreground">{price}</span>
        {period && <span className="text-body-caption text-faint">{period}</span>}
      </div>

      <ul className="flex flex-col gap-(--spacing-md) mb-(--spacing-2xl) flex-1">
        {features.map((f, i) => (
          <li key={i} className={cn("flex items-start gap-(--spacing-sm)", !f.included && "opacity-40")}>
            {f.included ? <CheckIcon /> : <XIcon />}
            <span className="text-body-callout text-foreground">
              {f.label}
              {f.note && <span className="ml-(--spacing-2xs) text-faint text-body-caption">({f.note})</span>}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA era <button> customizado reinventando Button CN — mesmo padrão de
          reaproveitamento já aplicado em OnboardingTour/Modal */}
      <Button
        type="button"
        onClick={onSelect}
        variant={highlighted ? "solid" : "soft"}
        intent={highlighted ? "primary" : "neutral"}
        fullWidth
      >
        {cta}
      </Button>
    </div>
  );
}
