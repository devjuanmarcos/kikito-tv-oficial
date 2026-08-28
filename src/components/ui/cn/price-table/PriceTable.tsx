"use client";

import React from "react";

import { Badge } from "@/components/ui/cn/badge";
import { Button } from "@/components/ui/cn/button";
import { cn } from "@/lib/utils";

import type { PriceTableProps } from "./price-table.types";

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <span className="text-success font-bold">✓</span>;
  // text-faint era usado aqui, mas "recurso não incluído" é informação
  // essencial pra decisão de compra, não decorativa/secundária — regra de
  // ouro do text-faint (CLAUDE.md) pede text-muted pra conteúdo primário
  if (value === false) return <span className="text-muted">✕</span>;
  return <span className="text-foreground text-body-callout">{value}</span>;
}

export function PriceTable({ plans, features, className, style }: PriceTableProps) {
  return (
    <div className={cn("w-full overflow-x-auto", className)} style={style}>
      <table className="w-full border-collapse text-body-callout">
        <thead>
          <tr>
            <td className="w-[30%]" />
            {plans.map((plan) => (
              <th
                key={plan.id}
                scope="col"
                className={cn(
                  "text-center px-(--spacing-lg) pb-(--spacing-xl) pt-(--spacing-lg) align-top",
                  // rounded-t-[--radius-md] (bracket cru, direcional) confirmado quebrado — usa sintaxe de parenteses
                  // bg-patina/5 (opacidade ad-hoc) -> bg-patina-soft, mesma classe de bug já vista em vários componentes
                  plan.highlight && "bg-patina-soft rounded-t-(--radius-md)"
                )}
              >
                {plan.badge && (
                  // Badge CN já existe — reaproveitado em vez de reinventar o pill
                  <Badge intent="primary" variant="solid" size="sm" className="mb-2">
                    {plan.badge}
                  </Badge>
                )}
                <div className="font-semibold text-foreground text-body-paragraph">{plan.name}</div>
                <div className="mt-(--spacing-2xs)">
                  {typeof plan.price === "number" ? (
                    <span className="text-heading-05 font-bold text-foreground">
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                      {plan.period && (
                        <small className="text-body-callout font-normal text-muted">/{plan.period}</small>
                      )}
                    </span>
                  ) : (
                    <span className="text-heading-05 font-bold text-foreground">{plan.price}</span>
                  )}
                </div>
                {plan.description && (
                  <div className="text-body-caption text-muted mt-(--spacing-2xs)">{plan.description}</div>
                )}
                <div className="mt-(--spacing-md)">
                  <Button
                    onClick={plan.onCta}
                    intent={plan.highlight ? "primary" : "neutral"}
                    variant={plan.highlight ? "solid" : "outline"}
                    size="sm"
                    fullWidth
                  >
                    {plan.ctaLabel ?? "Get started"}
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <tr key={i} className="border-t border-rule">
              <td className="py-(--spacing-md) px-(--spacing-sm) text-muted">{feature.label}</td>
              {plans.map((plan) => (
                <td
                  key={plan.id}
                  className={cn("text-center py-(--spacing-md) px-(--spacing-lg)", plan.highlight && "bg-patina-soft")}
                >
                  <CellValue value={feature.plans[plan.id] ?? false} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
