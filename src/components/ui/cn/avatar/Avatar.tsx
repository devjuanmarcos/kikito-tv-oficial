"use client";
import { useState, Children } from "react";

import { cn } from "@/lib/utils";

import type { AvatarSize, AvatarVariant, AvatarStatus, AvatarProps, AvatarGroupProps } from "./avatar.types";

/* ── size maps ── */
// text-[Nrem] abaixo: escala própria do componente por size, sem match exato na escala de tipografia
// (xs/sm ficam abaixo do mínimo — text-body-caption 12px; md/lg caem entre body-caption e body-callout/paragraph)
const SIZE_DIM: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-[0.5625rem]",
  sm: "w-8 h-8 text-[0.6875rem]",
  md: "w-10 h-10 text-[0.8125rem]",
  lg: "w-12 h-12 text-[0.9375rem]",
  xl: "w-16 h-16 text-body-title",
  "2xl": "w-20 h-20 text-heading-05",
};
const STATUS_DOT_SIZE: Record<AvatarSize, string> = {
  xs: "w-1.5 h-1.5 border",
  sm: "w-2 h-2 border",
  md: "w-2.5 h-2.5 border-[1.5px]",
  lg: "w-3 h-3 border-2",
  xl: "w-3.5 h-3.5 border-2",
  "2xl": "w-4 h-4 border-2",
};
const STATUS_COLOR: Record<Exclude<AvatarStatus, "none">, string> = {
  online: "bg-success",
  offline: "bg-faint",
  away: "bg-warning",
  busy: "bg-danger",
};
const VARIANT_CLS: Record<AvatarVariant, string> = {
  circle: "rounded-full",
  rounded: "rounded-(--radius-sm)",
  square: "rounded-none",
};

// margens negativas por size: escala própria do componente (sobreposição visual por tier), não migra pra spacing genérico
const GROUP_OVERLAP: Record<AvatarSize, string> = {
  xs: "-ml-2",
  sm: "-ml-2.5",
  md: "-ml-3",
  lg: "-ml-4",
  xl: "-ml-5",
  "2xl": "-ml-6",
};

/* deterministic color from name string — precisa de mais matizes distintos do que os tokens
   semânticos oferecem (só ~10) pra diferenciar visualmente muitos avatares por iniciais;
   oklch literal é intencional aqui, não um token esquecido (no token equivalent) */
const BG_PALETTE = [
  ["oklch(42% .12 200)", "oklch(88% .06 200)"], // teal
  ["oklch(42% .12 270)", "oklch(88% .06 270)"], // purple
  ["oklch(42% .12 30)", "oklch(88% .06 30)"], // orange
  ["oklch(38% .12 145)", "oklch(88% .06 145)"], // green
  ["oklch(38% .12 340)", "oklch(88% .06 340)"], // pink
  ["oklch(42% .12 220)", "oklch(88% .06 220)"], // blue
  ["oklch(38% .12 80)", "oklch(88% .06 80)"], // yellow-green
  ["oklch(38% .12 300)", "oklch(88% .06 300)"], // violet
];

function nameToColor(name: string): [string, string] {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return BG_PALETTE[h % BG_PALETTE.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  src,
  alt,
  name,
  icon,
  size = "md",
  variant = "circle",
  status = "none",
  className,
  style,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showImg = src && !imgError;

  const [bgColor, textColor] = name ? nameToColor(name) : ["var(--ks-graphite-2)", "var(--ks-text-faint)"];

  return (
    <span
      className={cn("relative inline-flex shrink-0", SIZE_DIM[size], VARIANT_CLS[variant], className)}
      style={style}
    >
      {showImg ? (
        <img
          src={src}
          alt={alt ?? name ?? ""}
          className={cn("w-full h-full object-cover", VARIANT_CLS[variant])}
          onError={() => setImgError(true)}
        />
      ) : name || icon ? (
        <span
          role="img"
          className={cn(
            "w-full h-full flex items-center justify-center font-semibold select-none",
            VARIANT_CLS[variant]
          )}
          style={{ backgroundColor: bgColor, color: textColor }}
          aria-label={name}
        >
          {icon ?? initials(name!)}
        </span>
      ) : (
        <span
          className={cn(
            "w-full h-full bg-graphite-2 flex items-center justify-center text-faint",
            VARIANT_CLS[variant]
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-1/2 h-1/2"
            aria-hidden="true"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
      )}

      {status !== "none" && (
        <span
          role="img"
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-base",
            STATUS_DOT_SIZE[size],
            STATUS_COLOR[status]
          )}
          aria-label={status}
        />
      )}
    </span>
  );
}

/**
 * AvatarGroup — lightweight children-composition variant (wrap `<Avatar>` elements directly).
 * NOT the same component as `avatar-group/AvatarGroup` (data-driven via an `avatars` prop array,
 * with its own overlap/overflow styling) — the two are separate, parallel implementations with
 * different APIs, kept both on purpose. `cn-registry.tsx` no longer claims one absorbs the other.
 */
export function AvatarGroup({ size = "md", max, children, className }: AvatarGroupProps) {
  const items = Children.toArray(children);
  const shown = max ? items.slice(0, max) : items;
  const extra = max ? Math.max(0, items.length - max) : 0;

  const overlapCls = GROUP_OVERLAP[size];
  const dimCls = SIZE_DIM[size];

  return (
    <span className={cn("inline-flex items-center", className)}>
      {shown.map((child, i) => (
        <span key={i} className={cn("ring-2 ring-base rounded-full", i > 0 && overlapCls)}>
          {child}
        </span>
      ))}
      {extra > 0 && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-graphite-2 text-faint font-semibold ring-2 ring-base select-none",
            dimCls,
            overlapCls
          )}
        >
          +{extra}
        </span>
      )}
    </span>
  );
}
