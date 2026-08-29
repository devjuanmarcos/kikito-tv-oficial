"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useState, useRef, useEffect, useId } from "react";

import { scaleInVertical, springSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";

import type { AutocompleteProps } from "./autocomplete.types";

// escala propria do componente por size (px por tier) — nao migra pra token de spacing generico (ver CLAUDE.md)
const SIZE_INPUT: Record<string, string> = {
  sm: "h-8 px-[10px] text-body-caption",
  md: "h-9 px-[12px] text-body-callout",
  lg: "h-11 px-[14px] text-body-paragraph",
};

export function Autocomplete({
  options,
  value,
  defaultValue = "",
  onChange,
  onInputChange,
  placeholder,
  label,
  disabled,
  size = "md",
  maxResults = 8,
  emptyMessage = "Nenhum resultado",
  className,
  style,
}: AutocompleteProps) {
  const [inputVal, setInputVal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const controlled = value !== undefined;
  const display = controlled ? value : inputVal;
  const rootRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const inputId = `${uid}-input`;
  const listboxId = `${uid}-listbox`;

  const filtered = options
    .filter((o) => !display || o.label.toLowerCase().includes(display.toLowerCase()))
    .slice(0, maxResults);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!controlled) setInputVal(v);
    onInputChange?.(v);
    setOpen(true);
    setHighlighted(0);
  };

  const select = (v: string, lbl: string) => {
    if (!controlled) setInputVal(lbl);
    onChange?.(v);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && e.key === "ArrowDown") {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    if (e.key === "ArrowUp") setHighlighted((h) => Math.max(h - 1, 0));
    if (e.key === "Enter" && filtered[highlighted]) {
      select(filtered[highlighted].value, filtered[highlighted].label);
    }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative flex flex-col gap-(--spacing-2xs)", className)} style={style}>
      {label && (
        <label htmlFor={inputId} className="text-body-callout font-medium text-foreground leading-none">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full bg-sunken border border-rule rounded-(--radius-md) text-foreground outline-none transition-[border-color,box-shadow] duration-[150ms] placeholder:text-faint focus:border-patina focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-primary)_18%,transparent)] box-border",
          SIZE_INPUT[size] ?? SIZE_INPUT.md,
          disabled && "opacity-50 cursor-not-allowed"
        )}
        value={display}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-activedescendant={open && filtered[highlighted] ? `${listboxId}-opt-${highlighted}` : undefined}
        autoComplete="off"
      />
      <AnimatePresence>
        {open && (
          <motion.div
            id={listboxId}
            // shadow-[var(--ks-shadow-md)] usava var indefinida (ver CLAUDE.md) — literal igual aos outros dropdowns
            className="absolute top-[calc(100%+4px)] left-0 right-0 bg-float border border-rule rounded-(--radius-md) shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)] z-[100] overflow-hidden max-h-[240px] overflow-y-auto"
            role="listbox"
            {...scaleInVertical}
            transition={springSnappy}
            style={{ transformOrigin: "top" }}
          >
            {filtered.length === 0 ? (
              <div className="py-(--spacing-md) px-(--spacing-lg) text-body-callout text-muted text-center">
                {emptyMessage}
              </div>
            ) : (
              filtered.map((opt, i) => (
                <div
                  key={opt.value}
                  id={`${listboxId}-opt-${i}`}
                  className={cn(
                    // gap-[10px]/py-[9px]: sem match exato entre --spacing-sm(8px) e --spacing-md(12px)
                    "flex items-center gap-[10px] py-[9px] px-(--spacing-md) cursor-pointer transition-[background] duration-[100ms] text-body-callout text-foreground",
                    i === highlighted && "bg-raised",
                    opt.disabled && "opacity-40 pointer-events-none"
                  )}
                  onMouseEnter={() => setHighlighted(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (!opt.disabled) select(opt.value, opt.label);
                  }}
                  role="option"
                  aria-selected={display === opt.label}
                >
                  {opt.icon && <span className="text-body-paragraph flex-shrink-0 text-muted">{opt.icon}</span>}
                  <span className="flex-1 min-w-0">
                    <span className="font-medium">{opt.label}</span>
                    {opt.description && (
                      <span className="block text-body-caption text-muted whitespace-nowrap overflow-hidden text-ellipsis">
                        {opt.description}
                      </span>
                    )}
                  </span>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
