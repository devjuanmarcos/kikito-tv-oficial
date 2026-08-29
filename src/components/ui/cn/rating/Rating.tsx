"use client";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

import type { RatingProps } from "./rating.types";

function StarIcon({ filled, half }: { filled: boolean; half: boolean }) {
  if (half) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <defs>
          <linearGradient id="half-fill" x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill="url(#half-fill)"
          stroke="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

// gap/textSz: escala própria do componente por size, sem match exato na escala de spacing (sm/md)
const SIZE_CLS: Record<string, { gap: string; sz: string; textSz: string }> = {
  sm: { gap: "gap-[2px]", sz: "w-4 h-4", textSz: "text-body-paragraph" },
  md: { gap: "gap-[3px]", sz: "w-[22px] h-[22px]", textSz: "text-body-title" },
  lg: { gap: "gap-1", sz: "w-[30px] h-[30px]", textSz: "text-heading-05" },
};

export function Rating({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  size = "md",
  readOnly = false,
  disabled = false,
  allowHalf = false,
  toggleOff = false,
  showValue = false,
  label,
  icon,
  emptyIcon,
  className,
  style,
}: RatingProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);

  const current = controlled ? value ?? 0 : internal;
  const display = hover ?? current;

  const hasCustomIcon = icon !== undefined || emptyIcon !== undefined;

  function handleClick(star: number) {
    if (readOnly || disabled) return;
    const next = toggleOff && current === star ? 0 : star;
    if (!controlled) setInternal(next);
    onChange?.(next);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>, star: number) {
    if (readOnly || disabled) return;
    if (allowHalf && !hasCustomIcon) {
      const rect = e.currentTarget.getBoundingClientRect();
      const half = e.clientX - rect.left < rect.width / 2;
      setHover(half ? star - 0.5 : star);
    } else {
      setHover(star);
    }
  }

  function isFilled(star: number) {
    return display >= star;
  }
  function isHalf(star: number) {
    return display >= star - 0.5 && display < star;
  }

  const sz = SIZE_CLS[size];

  return (
    <div className={cn("inline-flex flex-col gap-(--spacing-2xs)", className)} style={style}>
      {label && <span className="text-body-callout text-faint font-medium">{label}</span>}
      <div
        className={cn(
          "inline-flex items-center select-none",
          sz.gap,
          disabled && "opacity-40 pointer-events-none",
          readOnly && "pointer-events-none"
        )}
        onMouseLeave={() => setHover(null)}
        // read-only não é interativo — anuncia o valor como uma unidade em vez de N botões "Rate" enganosos
        role={readOnly ? "img" : undefined}
        aria-label={readOnly ? `${display} out of ${max}` : undefined}
      >
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
          const filled = isFilled(star);
          const half = isHalf(star);
          const active = filled || half;

          return (
            <button
              key={star}
              type="button"
              tabIndex={readOnly ? -1 : undefined}
              aria-hidden={readOnly || undefined}
              className={cn(
                "relative cursor-pointer transition-transform duration-[100ms] border-none bg-transparent p-0",
                sz.sz,
                hasCustomIcon
                  ? cn("flex items-center justify-center leading-none", sz.textSz)
                  : "text-rule [&>svg]:w-full [&>svg]:h-full [&>svg]:block",
                active ? "text-kinpaku" : "text-rule",
                !readOnly && "hover:scale-[1.15]"
              )}
              onClick={() => handleClick(!hasCustomIcon && allowHalf ? hover ?? star : star)}
              onMouseMove={(e) => handleMouseMove(e, star)}
              disabled={disabled}
              aria-label={readOnly ? undefined : `Rate ${star} of ${max}`}
            >
              {hasCustomIcon ? (
                active ? (
                  icon ?? emptyIcon
                ) : (
                  emptyIcon ?? icon
                )
              ) : (
                <StarIcon filled={filled} half={half} />
              )}
            </button>
          );
        })}
        {showValue && (
          <span className="ml-(--spacing-sm) text-body-callout text-faint tabular-nums">
            {display} / {max}
          </span>
        )}
      </div>
    </div>
  );
}
