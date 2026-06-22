"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, useRef, useEffect, useId, type KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[], options: ComboboxOption[]) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  state?: "default" | "error" | "success";
  disabled?: boolean;
  maxSelected?: number;
  className?: string;
}

const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={14}
    height={14}
  >
    <polyline points="6 9 12 15 18 9" />
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
    width={12}
    height={12}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XSmall = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={10}
    height={10}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function Combobox({
  options,
  value,
  defaultValue = [],
  onChange,
  placeholder = "Select…",
  label,
  helperText,
  errorText,
  state = "default",
  disabled = false,
  maxSelected,
  className,
}: ComboboxProps) {
  useId();
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const selected = isControlled ? value! : internal;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);

  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  function commit(opt: ComboboxOption) {
    if (opt.disabled) return;
    if (maxSelected && selected.length >= maxSelected && !selected.includes(opt.value)) return;
    const next = selected.includes(opt.value) ? selected.filter((v) => v !== opt.value) : [...selected, opt.value];
    if (!isControlled) setInternal(next);
    onChange?.(
      next,
      options.filter((o) => next.includes(o.value))
    );
  }

  function removeTag(val: string, e: React.MouseEvent) {
    e.stopPropagation();
    const next = selected.filter((v) => v !== val);
    if (!isControlled) setInternal(next);
    onChange?.(
      next,
      options.filter((o) => next.includes(o.value))
    );
  }

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (activeIdx < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx='${activeIdx}']`) as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && filtered[activeIdx]) commit(filtered[activeIdx]);
    }
    if (e.key === "Backspace" && !query && selected.length > 0) {
      const next = selected.slice(0, -1);
      if (!isControlled) setInternal(next);
      onChange?.(
        next,
        options.filter((o) => next.includes(o.value))
      );
    }
  }

  const hasError = !!errorText;
  const helper = errorText
    ? { text: errorText, isError: true }
    : helperText
      ? { text: helperText, isError: false }
      : null;

  return (
    <div ref={wrapRef} className={cn("flex flex-col gap-[0.375rem] w-full relative", className)}>
      {label && (
        <label
          className="text-body-callout font-semibold text-foreground leading-none"
          onClick={() => inputRef.current?.focus()}
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "flex flex-wrap gap-[0.3rem] py-[0.375rem] px-[0.625rem] pr-8 border border-rule rounded-(--radius-sm) bg-raised cursor-text min-h-[2.375rem] transition-[border-color,box-shadow] duration-[140ms] relative",
          "focus-within:border-patina focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-primary)_18%,transparent)]",
          hasError &&
            "border-[color-mix(in_oklch,var(--ks-danger)_55%,transparent)] focus-within:border-danger focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-danger)_18%,transparent)]",
          state === "success" && !hasError && "border-[color-mix(in_oklch,var(--ks-success)_55%,transparent)]",
          disabled && "opacity-55 cursor-not-allowed"
        )}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        {selected.map((val) => {
          const opt = options.find((o) => o.value === val);
          if (!opt) return null;
          return (
            <span
              key={val}
              className="inline-flex items-center gap-1 py-[0.125rem] px-[0.375rem] bg-patina-soft text-patina rounded-[4px] text-body-callout font-medium max-w-[200px]"
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">{opt.label}</span>
              <button
                type="button"
                className="inline-flex bg-none border-none cursor-pointer text-inherit p-0 opacity-70 hover:opacity-100 flex-shrink-0 leading-none"
                onClick={(e) => removeTag(val, e)}
              >
                <XSmall />
              </button>
            </span>
          );
        })}
        <input
          ref={inputRef}
          type="text"
          className="flex-1 min-w-[80px] border-none outline-none bg-transparent font-inherit text-body-callout text-foreground py-[0.125rem] placeholder:text-faint"
          placeholder={selected.length === 0 ? placeholder : ""}
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIdx(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          aria-autocomplete="list"
          aria-controls="combobox-listbox"
          aria-expanded={open}
          aria-haspopup="listbox"
          role="combobox"
        />
        <span
          className={cn(
            "absolute right-[0.625rem] top-1/2 -translate-y-1/2 text-faint pointer-events-none transition-transform duration-[180ms]",
            open && "rotate-180"
          )}
        >
          <ChevronIcon />
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-[calc(100%+4px)] left-0 right-0 z-[200] bg-lacquer border border-rule rounded-(--radius-base) shadow-[0_4px_24px_-4px_oklch(0%_0_0/0.4),0_2px_8px_-2px_oklch(0%_0_0/0.25)] overflow-hidden"
            initial={{ opacity: 0, scaleY: 0.9 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{ transformOrigin: "top" }}
          >
            <div
              ref={listRef}
              className="max-h-[220px] overflow-y-auto p-1 [scrollbar-width:thin]"
              role="listbox"
              aria-multiselectable="true"
            >
              {filtered.length === 0 ? (
                <div className="py-5 px-4 text-center text-body-callout text-faint">
                  No results for &quot;{query}&quot;
                </div>
              ) : (
                filtered.map((opt, idx) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    data-idx={idx}
                    aria-selected={selected.includes(opt.value)}
                    className={cn(
                      "flex items-center gap-2 w-full py-[0.4375rem] px-[0.625rem] rounded-[5px] text-body-callout text-foreground bg-transparent border-none cursor-pointer text-left transition-[background] duration-[100ms]",
                      activeIdx === idx && "bg-graphite",
                      selected.includes(opt.value) && "bg-patina-soft text-patina",
                      opt.disabled && "opacity-40 cursor-not-allowed"
                    )}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => commit(opt)}
                    tabIndex={-1}
                  >
                    {opt.label}
                    {selected.includes(opt.value) && (
                      <span className="ml-auto text-patina">
                        <CheckIcon />
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {helper && (
        <span className={cn("text-body-caption leading-snug", helper.isError ? "text-danger" : "text-faint")}>
          {helper.text}
        </span>
      )}
    </div>
  );
}
