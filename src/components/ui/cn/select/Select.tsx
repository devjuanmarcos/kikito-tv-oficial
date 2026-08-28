"use client";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useState, useRef, useEffect, useId, useMemo, type KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

import type {
  SelectSize,
  SelectVariant,
  SelectState,
  SelectOption,
  SelectGroup,
  SelectItem,
  MultiSelectSize,
  MultiSelectOption,
  RichSelectOption,
  ComboboxOption,
  SelectSingleProps,
  MultiSelectProps,
  RichSelectProps,
  ComboboxProps,
  SelectProps,
} from "./select.types";

export type {
  SelectSize,
  SelectVariant,
  SelectState,
  SelectOption,
  SelectGroup,
  SelectItem,
  MultiSelectSize,
  MultiSelectOption,
  RichSelectOption,
  ComboboxOption,
  SelectSingleProps,
  MultiSelectProps,
  RichSelectProps,
  ComboboxProps,
  SelectProps,
} from "./select.types";

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

/* ── Single-value select (default) ─────────────────────────────────────── */
function SingleSelectImpl({
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
}: SelectSingleProps) {
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
    <div ref={wrapRef} className={cn("relative flex flex-col gap-(--spacing-xs)", className)} style={style}>
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
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${uid}-listbox`}
        className={cn(
          "relative flex items-center w-full rounded-(--radius-sm) cursor-pointer font-inherit transition-[border-color,box-shadow,background] duration-[140ms] outline-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina",
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
              <div className="p-(--spacing-sm) border-b border-rule">
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full bg-graphite border border-rule rounded-(--radius-xs) px-2.5 py-1.5 text-body-callout text-foreground placeholder:text-faint outline-none focus:border-patina"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
            <div id={`${uid}-listbox`} role="listbox" className="max-h-[240px] overflow-y-auto py-(--spacing-2xs)">
              {filtered.length === 0 ? (
                <div className="px-(--spacing-md) py-(--spacing-xl) text-center text-body-callout text-faint">
                  No options found
                </div>
              ) : (
                filtered.map((item, gi) =>
                  isGroup(item) ? (
                    <div key={gi}>
                      {/* below scale minimum: uppercase group-header eyebrow, smaller than text-body-caption by design */}
                      <p className="px-(--spacing-md) pt-(--spacing-md) pb-(--spacing-2xs) text-[0.625rem] font-bold uppercase tracking-[0.1em] text-faint">
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
      role="option"
      aria-selected={selected}
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

/* ── Multi-select with chips (mode="multi") ────────────────────────────── */
function MultiSelectImpl({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  placeholder = "Select options…",
  size = "md",
  disabled = false,
  maxSelected,
  searchable = true,
  clearable = true,
  className,
  style,
}: MultiSelectProps) {
  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selected = isControlled ? controlledValue ?? [] : internal;

  const update = (next: string[]) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const addItem = (val: string) => {
    if (selected.includes(val)) return removeItem(val);
    if (maxSelected && selected.length >= maxSelected) return;
    update([...selected, val]);
    setQuery("");
  };

  const removeItem = (val: string) => update(selected.filter((v) => v !== val));

  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  function handleKey(e: KeyboardEvent<HTMLElement>) {
    if (disabled) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setHighlighted((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setHighlighted((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && open) {
      e.preventDefault();
      const opt = filtered[highlighted];
      if (opt && !opt.disabled) addItem(opt.value);
    }
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    }
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className={cn("relative flex flex-col gap-(--spacing-2xs)", className)} style={style}>
      <div
        className={cn(
          "flex items-center flex-wrap gap-1 min-h-[38px] px-2 py-1 border border-rule bg-raised rounded-(--radius-base) cursor-pointer transition-colors duration-150 relative focus-within:border-patina",
          open && "border-patina",
          disabled && "opacity-50 cursor-not-allowed",
          size === "sm" && "min-h-[30px] px-[6px] py-[3px]",
          size === "lg" && "min-h-[46px] px-[10px] py-[6px]"
        )}
        onClick={() => !disabled && setOpen((o) => !o)}
        role={searchable ? undefined : "combobox"}
        tabIndex={searchable || disabled ? undefined : 0}
        onKeyDown={searchable ? undefined : handleKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
      >
        {selected.map((v) => {
          const opt = options.find((o) => o.value === v);
          return opt ? (
            <span
              key={v}
              className="flex items-center gap-1 pl-2 pr-1 py-[2px] rounded-(--radius-xs) bg-patina-soft text-patina-soft-fg text-body-caption font-medium"
            >
              {opt.label}
              <button
                className="flex items-center justify-center w-[14px] h-[14px] bg-transparent text-current cursor-pointer p-0 rounded-(--radius-xs) opacity-70 hover:opacity-100 border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(v);
                }}
                type="button"
                aria-label={`Remove ${opt.label}`}
              >
                ×
              </button>
            </span>
          ) : null;
        })}
        {searchable && !disabled ? (
          <input
            className="flex-1 min-w-[80px] border-0 bg-transparent outline-none text-body-callout py-[2px] text-foreground placeholder:text-muted placeholder:opacity-60"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setHighlighted(0);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKey}
            placeholder={selected.length === 0 ? placeholder : ""}
            onClick={(e) => e.stopPropagation()}
            role="combobox"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
          />
        ) : (
          selected.length === 0 && (
            <span className="text-body-callout text-muted opacity-60 px-[2px]">{placeholder}</span>
          )
        )}
        {clearable && selected.length > 0 && (
          <button
            className="flex items-center justify-center w-4 h-4 border-0 bg-transparent cursor-pointer opacity-40 hover:opacity-100 flex-shrink-0 p-0 text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              update([]);
            }}
            type="button"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <svg
          className={cn(
            "w-4 h-4 ml-auto flex-shrink-0 opacity-40 transition-transform duration-150",
            open && "rotate-180"
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          className="absolute top-[calc(100%+4px)] left-0 right-0 bg-raised border border-rule rounded-(--radius-base) shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)] z-[200] overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100"
        >
          {filtered.length === 0 ? (
            <p className="px-(--spacing-md) py-(--spacing-md) text-body-callout text-center opacity-40">
              No options found
            </p>
          ) : (
            filtered.map((opt, i) => (
              <div
                key={opt.value}
                role="option"
                aria-selected={selected.includes(opt.value)}
                aria-disabled={opt.disabled || undefined}
                className={cn(
                  "px-3 py-2 text-body-callout cursor-pointer flex items-center gap-2 transition-colors duration-100 text-foreground hover:bg-sunken",
                  selected.includes(opt.value) && "text-patina",
                  highlighted === i && "bg-sunken",
                  opt.disabled && "opacity-40 cursor-not-allowed"
                )}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => !opt.disabled && addItem(opt.value)}
              >
                <svg
                  className={cn(
                    "w-[14px] h-[14px] flex-shrink-0 transition-opacity",
                    selected.includes(opt.value) ? "opacity-100" : "opacity-0"
                  )}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ── Rich select with icon/description/badge (mode="rich") ─────────────── */
function RichSelectImpl({
  options,
  value,
  defaultValue = "",
  onChange,
  placeholder = "Selecionar…",
  label,
  disabled,
  searchable = false,
  size = "md",
  className,
  style,
}: RichSelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const controlled = value !== undefined;
  const selected = controlled ? value : internalValue;

  const groups = Array.from(new Set(options.map((o) => o.group ?? "")));
  const filtered = options.filter(
    (o) =>
      !search ||
      o.label.toLowerCase().includes(search.toLowerCase()) ||
      o.description?.toLowerCase().includes(search.toLowerCase())
  );

  function handleTriggerKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setHighlighted((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setHighlighted((i) => Math.max(i - 1, 0));
    }
    if ((e.key === "Enter" || e.key === " ") && open) {
      e.preventDefault();
      const opt = filtered[highlighted];
      if (opt && !opt.disabled) select(opt.value);
    }
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    }
  }

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const select = (v: string) => {
    if (!controlled) setInternalValue(v);
    onChange?.(v);
    setOpen(false);
    setSearch("");
  };

  const selectedOpt = options.find((o) => o.value === selected);

  return (
    <div ref={rootRef} className={cn("relative flex flex-col gap-(--spacing-2xs)", className)} style={style}>
      {label && <label className="text-body-caption font-semibold text-muted">{label}</label>}
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 px-3 py-[9px] bg-sunken border border-rule rounded-(--radius-md) cursor-pointer text-foreground text-body-callout transition-colors duration-150 text-left hover:border-patina",
          open && "border-patina",
          disabled && "opacity-50 cursor-not-allowed",
          size === "sm" && "py-[5px] px-[10px] text-body-caption",
          size === "lg" && "py-[11px] px-[14px] text-body-paragraph"
        )}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleTriggerKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
      >
        {selectedOpt?.icon && <span className="flex-shrink-0">{selectedOpt.icon}</span>}
        {selectedOpt ? (
          <span className="flex-1">{selectedOpt.label}</span>
        ) : (
          <span className="flex-1 text-faint">{placeholder}</span>
        )}
        {/* below scale minimum: chevron glyph sized as icon, not content text */}
        <span
          className="ml-auto text-[0.625rem] text-faint flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : undefined }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-[calc(100%+4px)] left-0 right-0 bg-float border border-rule rounded-(--radius-md) shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)] z-[100] overflow-hidden max-h-[280px] flex flex-col animate-in fade-in slide-in-from-top-1 duration-100"
        >
          {searchable && (
            <input
              className="px-(--spacing-md) py-(--spacing-sm) border-b border-rule border-t-0 border-l-0 border-r-0 bg-transparent text-foreground text-body-callout outline-none flex-shrink-0 placeholder:text-faint"
              placeholder="Buscar…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlighted(0);
              }}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          )}
          <div className="overflow-y-auto flex-1 py-(--spacing-2xs)">
            {groups.map((group) => {
              const groupOpts = filtered.filter((o) => (o.group ?? "") === group);
              if (groupOpts.length === 0) return null;
              const gOffset = filtered.indexOf(groupOpts[0]);
              return (
                <div key={group}>
                  {group && (
                    // below scale minimum: uppercase group-header eyebrow, smaller than text-body-caption by design
                    <div className="px-(--spacing-md) pt-(--spacing-xs) pb-(--spacing-3xs) text-[0.625rem] font-bold uppercase tracking-[0.1em] text-faint">
                      {group}
                    </div>
                  )}
                  {groupOpts.map((opt, i) => (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={opt.value === selected}
                      aria-disabled={opt.disabled || undefined}
                      className={cn(
                        "flex items-center gap-[10px] px-3 py-[9px] cursor-pointer transition-colors duration-100",
                        highlighted === gOffset + i || opt.value === selected ? "bg-raised" : "hover:bg-raised",
                        opt.disabled && "opacity-40 pointer-events-none"
                      )}
                      onMouseEnter={() => setHighlighted(gOffset + i)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        if (!opt.disabled) select(opt.value);
                      }}
                    >
                      {opt.icon && <span className="flex-shrink-0 text-body-title text-muted">{opt.icon}</span>}
                      <span className="flex-1 min-w-0">
                        <span
                          className={cn(
                            "block text-body-callout font-medium text-foreground",
                            opt.value === selected && "text-patina font-semibold"
                          )}
                        >
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className="block text-body-caption text-muted truncate">{opt.description}</span>
                        )}
                      </span>
                      {opt.badge && (
                        // below scale minimum: inline micro-badge, matches Badge's sm-size scale
                        <span className="px-[7px] py-[1px] rounded-pill bg-patina-soft text-patina-soft-fg text-[0.625rem] font-bold flex-shrink-0">
                          {opt.badge}
                        </span>
                      )}
                      {opt.value === selected && (
                        <span aria-hidden="true" className="ml-auto text-patina text-body-callout">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Combobox: multi + keyboard nav (mode="combobox") ──────────────────── */
const ComboboxChevronIcon = () => (
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
const ComboboxCheckIcon = () => (
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
const ComboboxXSmall = () => (
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

function ComboboxImpl({
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
  const listboxId = useId();

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
    <div ref={wrapRef} className={cn("flex flex-col gap-(--spacing-xs) w-full relative", className)}>
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
              className="inline-flex items-center gap-1 py-[0.125rem] px-[0.375rem] bg-patina-soft text-patina-soft-fg rounded-(--radius-xs) text-body-callout font-medium max-w-[200px]"
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">{opt.label}</span>
              <button
                type="button"
                className="inline-flex bg-none border-none cursor-pointer text-inherit p-0 opacity-70 hover:opacity-100 flex-shrink-0 leading-none"
                onClick={(e) => removeTag(val, e)}
              >
                <ComboboxXSmall />
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
          aria-controls={listboxId}
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
          <ComboboxChevronIcon />
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
              id={listboxId}
              className="max-h-[220px] overflow-y-auto p-(--spacing-2xs) [scrollbar-width:thin]"
              role="listbox"
              aria-multiselectable="true"
            >
              {filtered.length === 0 ? (
                <div className="py-5 px-(--spacing-lg) text-center text-body-callout text-faint">
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
                      "flex items-center gap-2 w-full py-[0.4375rem] px-[0.625rem] rounded-(--radius-sm) text-body-callout text-foreground bg-transparent border-none cursor-pointer text-left transition-[background] duration-[100ms]",
                      activeIdx === idx && "bg-graphite",
                      selected.includes(opt.value) && "bg-patina-soft text-patina-soft-fg",
                      opt.disabled && "opacity-40 cursor-not-allowed"
                    )}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => commit(opt)}
                    tabIndex={-1}
                  >
                    {opt.label}
                    {selected.includes(opt.value) && (
                      <span className="ml-auto text-patina-soft-fg">
                        <ComboboxCheckIcon />
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

/**
 * Select — Super component.
 * `mode` (default "single") selects the rendering family:
 *  - "single"   → single-value dropdown (default)
 *  - "multi"    → chips multi-select (absorbed MultiSelect)
 *  - "rich"     → icon/description/badge options (absorbed RichSelect)
 *  - "combobox" → multi + keyboard navigation (absorbed Combobox)
 * The former MultiSelect/RichSelect/Combobox are now backward-compat wrappers.
 */
export function Select(props: SelectProps) {
  switch (props.mode) {
    case "multi":
      return <MultiSelectImpl {...props} />;
    case "rich":
      return <RichSelectImpl {...props} />;
    case "combobox":
      return <ComboboxImpl {...props} />;
    default:
      return <SingleSelectImpl {...props} />;
  }
}
