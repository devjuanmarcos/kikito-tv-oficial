"use client";
import type React from "react";

import { cn } from "@/lib/utils";

export type IconBoxIntent = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral";
export type IconBoxVariant = "soft" | "solid" | "outline";
export type IconBoxSize = "sm" | "md" | "lg";

export interface IconBoxProps {
  icon: React.ReactNode;
  intent?: IconBoxIntent;
  variant?: IconBoxVariant;
  size?: IconBoxSize;
  title?: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_BOX: Record<IconBoxSize, string> = {
  sm: "w-8  h-8  rounded-(--radius-sm) text-lg",
  md: "w-10 h-10 rounded-(--radius-md) text-xl",
  lg: "w-14 h-14 rounded-(--radius-lg) text-2xl",
};

const SIZE_TITLE: Record<IconBoxSize, string> = {
  sm: "text-body-callout",
  md: "text-[1rem] font-semibold",
  lg: "text-[1.125rem] font-semibold",
};

type IntentVariantKey = `${IconBoxIntent}/${IconBoxVariant}`;

const INTENT_VARIANT: Record<IntentVariantKey, string> = {
  "primary/soft": "bg-patina/10 text-patina",
  "primary/solid": "bg-patina text-patina-fg",
  "primary/outline": "border border-patina text-patina",

  "secondary/soft": "bg-kinpaku/10 text-kinpaku",
  "secondary/solid": "bg-kinpaku text-kinpaku-fg",
  "secondary/outline": "border border-kinpaku text-kinpaku",

  "success/soft": "bg-success/10 text-success",
  "success/solid": "bg-success text-success-fg",
  "success/outline": "border border-success text-success",

  "warning/soft": "bg-warning/10 text-warning",
  "warning/solid": "bg-warning text-warning-fg",
  "warning/outline": "border border-warning text-warning",

  "danger/soft": "bg-danger/10 text-danger",
  "danger/solid": "bg-danger text-danger-fg",
  "danger/outline": "border border-danger text-danger",

  "info/soft": "bg-info/10 text-info",
  "info/solid": "bg-info text-info-fg",
  "info/outline": "border border-info text-info",

  "neutral/soft": "bg-graphite text-foreground",
  "neutral/solid": "bg-foreground text-base",
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
    <div style={style} className={cn("flex flex-col gap-3", className)}>
      {box}
      <div className="flex flex-col gap-1">
        {title && <p className={cn("text-foreground font-semibold m-0", SIZE_TITLE[size])}>{title}</p>}
        {description && <p className="text-body-callout text-faint leading-[1.5] m-0">{description}</p>}
      </div>
    </div>
  );
}
