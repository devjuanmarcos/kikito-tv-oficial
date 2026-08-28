"use client";
import { cn } from "@/lib/utils";

import type { IconBoxIntent, IconBoxProps, IconBoxSize, IconBoxVariant } from "./icon-box.types";

const SIZE_BOX: Record<IconBoxSize, string> = {
  // sm/md/lg: escala própria do componente (dimensão + radius + tamanho do ícone calibrados
  // juntos por tier) — não migrar pro token de spacing genérico, ver CLAUDE.md.
  // sm: text-[1.125rem] sem match exato na escala tipográfica; md/xl e lg/2xl batem exato
  // com text-body-title(1.25rem)/text-heading-05(1.5rem) — usados os tokens diretos
  sm: "w-8  h-8  rounded-(--radius-sm) text-[1.125rem]",
  md: "w-10 h-10 rounded-(--radius-md) text-body-title",
  lg: "w-14 h-14 rounded-(--radius-lg) text-heading-05",
};

const SIZE_TITLE: Record<IconBoxSize, string> = {
  sm: "text-body-callout",
  // md bate exato com text-body-paragraph (1rem); lg (1.125rem) sem match exato na escala
  md: "text-body-paragraph font-semibold",
  lg: "text-[1.125rem] font-semibold",
};

type IntentVariantKey = `${IconBoxIntent}/${IconBoxVariant}`;

// bg-*-soft / text-*-soft-fg: par canônico pré-validado AA, no lugar da opacidade ad-hoc
// (bg-X/10 text-X) que estava aqui antes pra cada intent colorido
const INTENT_VARIANT: Record<IntentVariantKey, string> = {
  "primary/soft": "bg-patina-soft text-patina-soft-fg",
  "primary/solid": "bg-patina text-patina-fg",
  "primary/outline": "border border-patina text-patina",

  "secondary/soft": "bg-kinpaku-soft text-kinpaku-soft-fg",
  "secondary/solid": "bg-kinpaku text-kinpaku-fg",
  "secondary/outline": "border border-kinpaku text-kinpaku",

  "success/soft": "bg-success-soft text-success-soft-fg",
  "success/solid": "bg-success text-success-fg",
  "success/outline": "border border-success text-success",

  "warning/soft": "bg-warning-soft text-warning-soft-fg",
  "warning/solid": "bg-warning text-warning-fg",
  "warning/outline": "border border-warning text-warning",

  "danger/soft": "bg-danger-soft text-danger-soft-fg",
  "danger/solid": "bg-danger text-danger-fg",
  "danger/outline": "border border-danger text-danger",

  "info/soft": "bg-info-soft text-info-soft-fg",
  "info/solid": "bg-info text-info-fg",
  "info/outline": "border border-info text-info",

  "neutral/soft": "bg-neutral-soft text-neutral-soft-fg",
  "neutral/solid": "bg-neutral text-neutral-fg",
  "neutral/outline": "border border-rule text-foreground",
};

export function IconBox({
  icon,
  intent = "primary",
  variant = "soft",
  size = "md",
  title,
  description,
  className,
  style,
}: IconBoxProps) {
  const key = `${intent}/${variant}` as IntentVariantKey;
  const boxCls = INTENT_VARIANT[key] ?? INTENT_VARIANT["neutral/soft"];

  const box = <div className={cn("flex items-center justify-center shrink-0", SIZE_BOX[size], boxCls)}>{icon}</div>;

  if (!title && !description) {
    return (
      <div style={style} className={cn(className)}>
        {box}
      </div>
    );
  }

  return (
    <div style={style} className={cn("flex flex-col gap-(--spacing-md)", className)}>
      {box}
      <div className="flex flex-col gap-(--spacing-2xs)">
        {title && <p className={cn("text-foreground m-0", SIZE_TITLE[size])}>{title}</p>}
        {description && <p className="text-body-callout text-faint leading-[1.5] m-0">{description}</p>}
      </div>
    </div>
  );
}
