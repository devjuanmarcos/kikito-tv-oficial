"use client";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

import type { ThemeSelectorProps } from "./theme-selector.types";

export function ThemeSelector({ themes, value, defaultValue, onChange, className, style }: ThemeSelectorProps) {
  const [internal, setInternal] = useState(defaultValue ?? themes[0]?.id);
  const controlled = value !== undefined;
  const selected = controlled ? value : internal;

  function select(id: string) {
    if (!controlled) setInternal(id);
    onChange?.(id);
  }

  return (
    <div className={cn("flex flex-wrap gap-(--spacing-sm)", className)} style={style}>
      {themes.map((theme) => {
        const isSelected = selected === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => select(theme.id)}
            className={cn(
              // rounded-[--radius]: var --radius nao existe no projeto (ficava 0px) e bracket cru quebrado — usa token real
              "flex items-center gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-sm) rounded-(--radius-md) border transition-[border-color,background] duration-[150ms] cursor-pointer font-[inherit] bg-raised",
              isSelected ? "border-patina bg-patina-soft" : "border-rule hover:border-patina/60 hover:bg-graphite"
            )}
          >
            {/* Swatch: preview real das cores do tema (dado dinâmico, não paleta do design system) */}
            <div className="grid grid-cols-2 gap-(--spacing-3xs) w-7 h-7 rounded-sm overflow-hidden shrink-0">
              {theme.colors.slice(0, 4).map((c, i) => (
                <div key={i} style={{ background: c }} className="w-full h-full" />
              ))}
            </div>
            <span className="text-body-callout font-medium text-foreground whitespace-nowrap">{theme.label}</span>
            <span
              aria-hidden="true"
              className={cn(
                "text-patina text-body-caption font-bold transition-opacity duration-[150ms]",
                isSelected ? "opacity-100" : "opacity-0"
              )}
            >
              ✓
            </span>
          </button>
        );
      })}
    </div>
  );
}
