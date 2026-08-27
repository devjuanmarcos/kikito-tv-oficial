"use client";
import type React from "react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

export type TagCloudIntent = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral";

export interface TagCloudItem {
  label: string;
  weight: number;
  intent?: TagCloudIntent;
  href?: string;
}

export interface TagCloudProps {
  items: TagCloudItem[];
  minSize?: number;
  maxSize?: number;
  randomRotate?: boolean;
  onClick?: (item: TagCloudItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

const INTENT_CLS: Record<TagCloudIntent, string> = {
  primary: "text-patina hover:bg-patina/10",
  secondary: "text-kinpaku hover:bg-kinpaku/10",
  success: "text-success hover:bg-success/10",
  warning: "text-warning hover:bg-warning/10",
  danger: "text-danger hover:bg-danger/10",
  info: "text-info hover:bg-info/10",
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

  function fontSize(w: number) {
    return minSize + ((w - min) / range) * (maxSize - minSize);
  }

  return (
    <div style={style} className={cn("flex flex-wrap gap-2 items-center", className)}>
      {items.map((item, i) => {
        const sz = fontSize(item.weight);
        const rot = randomRotate ? ROTATIONS[i % ROTATIONS.length] : 0;
        const Tag = item.href ? "a" : onClick ? "button" : "span";
        return (
          <Tag
            key={item.label}
            {...(item.href ? { href: item.href } : {})}
            {...(onClick && !item.href ? { type: "button" as const, onClick: () => onClick(item) } : {})}
            style={{ fontSize: sz, transform: `rotate(${rot}deg)` }}
            className={cn(
              "px-1.5 py-0.5 rounded-(--radius-xs) transition-[background,transform] duration-[100ms]",
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
