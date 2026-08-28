"use client";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

import type { TagCloudIntent, TagCloudProps } from "./tag-cloud.types";

const INTENT_CLS: Record<TagCloudIntent, string> = {
  primary: "text-patina hover:bg-patina-soft",
  secondary: "text-kinpaku hover:bg-kinpaku-soft",
  success: "text-success hover:bg-success-soft",
  warning: "text-warning hover:bg-warning-soft",
  danger: "text-danger hover:bg-danger-soft",
  info: "text-info hover:bg-info-soft",
  neutral: "text-foreground hover:bg-graphite",
};

const ROTATIONS = [-6, -3, 0, 3, 6, -5, 5, -2, 2, 0];

export function TagCloud({
  items,
  minSize = 12,
  maxSize = 28,
  randomRotate = false,
  onClick,
  className,
  style,
}: TagCloudProps) {
  const weights = useMemo(() => items.map((i) => i.weight), [items]);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;

  // fonte contínua proporcional ao peso — não é escala de tokens (o próprio conceito
  // de nuvem de tags exige interpolação contínua, não passos discretos)
  function fontSize(w: number) {
    return minSize + ((w - min) / range) * (maxSize - minSize);
  }

  return (
    <div style={style} className={cn("flex flex-wrap gap-(--spacing-sm) items-center", className)}>
      {items.map((item, i) => {
        const sz = fontSize(item.weight);
        const rot = randomRotate ? ROTATIONS[i % ROTATIONS.length] : 0;
        const Tag = item.href ? "a" : onClick ? "button" : "span";
        return (
          <Tag
            key={item.label}
            {...(item.href ? { href: item.href } : {})}
            // bug real corrigido: antes, quando item.href E onClick coexistiam, o onClick
            // era silenciosamente ignorado (Tag virava "a" e a condição do spread excluía
            // explicitamente qualquer item com href) — agora onClick dispara em qualquer
            // tag clicável, com ou sem href
            {...(onClick ? { onClick: () => onClick(item) } : {})}
            {...(Tag === "button" ? { type: "button" as const } : {})}
            style={{ fontSize: sz, transform: `rotate(${rot}deg)` }}
            className={cn(
              "px-(--spacing-xs) py-(--spacing-3xs) rounded-(--radius-xs) transition-[background,transform] duration-[100ms]",
              "font-medium leading-tight select-none",
              INTENT_CLS[item.intent ?? "neutral"],
              (onClick || item.href) && "cursor-pointer"
            )}
          >
            {item.label}
          </Tag>
        );
      })}
    </div>
  );
}
