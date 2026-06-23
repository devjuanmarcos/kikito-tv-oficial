"use client";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useState, useRef, useEffect, useId, useMemo } from "react";

import { cn } from "@/lib/utils";

export type SelectSize = "sm" | "md" | "lg";
export type SelectVariant = "outline" | "filled" | "ghost";
export type SelectState = "default" | "error" | "success" | "warning";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
export interface SelectGroup {
  label: string;
  options: SelectOption[];
}
export type SelectItem = SelectOption | SelectGroup;

export interface SelectProps {
  options?: SelectItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option?: SelectOption) => void;
  placeholder?: string;
  variant?: SelectVariant;
  size?: SelectSize;
  state?: SelectState;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  warningText?: string;
  iconLeft?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function isGroup(item: SelectItem): item is SelectGroup {
  return "options" in item;
}

function flatOptions(items: SelectItem[]): SelectOption[] {
  return items.flatMap((i) => (isGroup(i) ? i.options : [i]));
}

/* ── size tokens ── */
const SIZE_H: Record<SelectSize, string> = {
  sm: "h-8 text-body-caption",
  md: "h-9 text-body-callout",
  lg: "h-11 text-body-paragraph",
};
const SIZE_PX: Record<SelectSize, string> = {
  sm: "px-2.5",
  md: "px-3",
  lg: "px-4",
};

/* ── variant tokens ── */
const VARIANT_CLS: Record<SelectVariant, string> = {
  outline: "bg-raised border border-rule hover:border-foreground/40",
  filled: "bg-graphite border border-transparent hover:bg-graphite-2",
  ghost: "bg-transparent border-b border-rule rounded-none hover:border-foreground/40",
};
const VARIANT_OPEN: Record<SelectVariant, string> = {
  outline: "border-patina shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-primary)_18%,transparent)]",
  filled: "bg-graphite-2",
  ghost: "border-b-patina",
};

/* ── state feedback text ── */
const STATE_TEXT_CLS: Record<SelectState, string> = {
  default: "text-faint",
  error: "text-danger",
  success: "text-success",
  warning: "text-warning",
};

const ChevronDown = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3 h-3"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function Select({
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder = "Select…",
  variant = "outline",
  size = "md",
  state = "default",
  disabled = false,
  clearable = false,
  searchable = false,
  label,
  helperText,
  errorText,
  successText,
  warningText,
  iconLeft,
  className,
  style,
}: SelectProps) {
  const uid = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = isControlled ? value ?? "" : internal;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const flat = useMemo(() => flatOptions(options), [options]);
  const selectedOption = flat.find((o) => o.value === current);

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  /* focus search on open */
  useEffect(() => {
    if (open && searchable) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open, searchable]);

  function select(opt: SelectOption) {
    if (opt.disabled) return;
    if (!isControlled) setInternal(opt.value);
    onChange?.(opt.value, opt);
    setOpen(false);
    setSearch("");
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isControlled) setInternal("");
    onChange?.("", undefined);
  }

  function toggle() {
    if (disabled) return;
    setOpen((o) => !o);
    if (!open) setSearch("");
  }

  /* filtered options */
  const filtered: SelectItem[] = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options
      .map((item) => {
        if (isGroup(item)) {
          const opts = item.options.filter((o) => o.label.toLowerCase().includes(q));
          return opts.length ? { ...item, options: opts } : null;
        }
        return item.label.toLowerCase().includes(q) ? item : null;
      })
      .filter(Boolean) as SelectItem[];
  }, [options, search]);

  const feedbackText =
    state === "error" ? errorText : state === "success" ? successText : state === "warning" ? warningText : helperText;

  const effectiveState: SelectState = errorText ? "error" : successText ? "success" : warningText ? "warning" : state;

  return (
    <div ref={wrapRef} className={cn("relative flex flex-col gap-[0.375rem]", className)} style={style}>
      {label && (
        <label className="text-body-callout font-semibold text-foreground leading-none" htmlFor={uid}>
          {label}
        </label>
      )}

      <button
        id={uid}
        type="button"
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative flex items-center w-full rounded-(--radius-sm) cursor-pointer font-inherit transition-[border-color,box-shadow,background] duration-[140ms] outline-none",
          SIZE_H[size],
          VARIANT_CLS[variant],
          open && VARIANT_OPEN[variant],
          effectiveState === "error" && "border-danger/60",
          effectiveState === "success" && "border-success/60",
          effectiveState === "warning" && "border-warning/60",
          disabled && "opacity-55 cursor-not-allowed"
        )}
      >
        {iconLeft && <span className="shrink-0 pl-3 text-faint [&>svg]:w-4 [&>svg]:h-4">{iconLeft}</span>}
        <span className={cn("flex-1 text-left truncate", SIZE_PX[size], iconLeft && "pl-2")}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon && <span className="shrink-0">{selectedOption.icon}</span>}
              <span className="text-foreground">{selectedOption.label}</span>
            </span>
          ) : (
            <span className="text-faint">{placeholder}</span>
          )}
        </span>
        {clearable && current && (
          <span
            className="shrink-0 px-2 text-faint hover:text-foreground cursor-pointer"
            onClick={clear}
            role="button"
            aria-label="Clear"
          >
            <XIcon />
          </span>
        )}
        <span className="shrink-0 pr-3 flex items-center">
          <span className={cn("text-faint transition-transform duration-[140ms]", open && "rotate-180")}>
            <ChevronDown />
          </span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-[calc(100%+4px)] left-0 right-0 z-[300] bg-lacquer border border-rule rounded-(--radius-sm) shadow-[0_8px_24px_-8px_oklch(0%_0_0/0.45)] overflow-hidden"
            initial={{ opacity: 0, scaleY: 0.9 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{ transformOrigin: "top" }}
          >
            {searchable && (
              <div className="p-2 border-b border-rule">
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full bg-graphite border border-rule rounded-[4px] px-2.5 py-1.5 text-body-callout text-foreground placeholder:text-faint outline-none focus:border-patina"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
            <div className="max-h-[240px] overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-body-callout text-faint">No options found</div>
              ) : (
                filtered.map((item, gi) =>
                  isGroup(item) ? (
                    <div key={gi}>
                      <p className="px-3 pt-3 pb-1 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-faint">
                        {item.label}
                      </p>
                      {item.options.map((opt) => (
                        <OptionRow key={opt.value} opt={opt} current={current} onSelect={select} />
                      ))}
                    </div>
                  ) : (
                    <OptionRow
                      key={(item as SelectOption).value}
                      opt={item as SelectOption}
                      current={current}
                      onSelect={select}
                    />
                  )
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {feedbackText && <span className={cn("text-body-caption", STATE_TEXT_CLS[effectiveState])}>{feedbackText}</span>}
    </div>
  );
}

function OptionRow({
  opt,
  current,
  onSelect,
}: {
  opt: SelectOption;
  current: string;
  onSelect: (o: SelectOption) => void;
}) {
  const selected = opt.value === current;
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-2.5 w-full text-left px-3 py-2 text-body-callout font-inherit border-none bg-transparent cursor-pointer transition-[background,color] duration-[80ms]",
        selected ? "text-patina" : "text-foreground",
        opt.disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-graphite"
      )}
      onClick={() => onSelect(opt)}
      disabled={opt.disabled}
    >
      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
      <span className="flex-1 truncate">{opt.label}</span>
      {selected && <CheckIcon />}
    </button>
  );
}
