"use client";
import { useState } from "react";

import { cn } from "@/lib/utils";

import type {
  ToggleGroupProps,
  ToggleGroupSize,
  ToggleGroupVariant,
  ToggleGroupSegmentedProps,
  ChipGroupSize,
  ChipGroupIntent,
  ToggleGroupChipProps,
  ToggleGroupFilterProps,
  ToggleGroupAllProps,
} from "./toggle-group.types";

export type {
  ToggleGroupProps,
  ToggleGroupItem,
  ToggleGroupType,
  ToggleGroupVariant,
  ToggleGroupSize,
  ToggleGroupAllProps,
  ToggleGroupSegmentedProps,
  ToggleGroupChipProps,
  ToggleGroupFilterProps,
  SegmentedControlOption,
  SegmentedControlSize,
  ChipGroupChip,
  ChipGroupIntent,
  ChipGroupSize,
  FilterBarOption,
} from "./toggle-group.types";

const SIZE_BTN: Record<ToggleGroupSize, string> = {
  sm: "h-6 px-2   text-[0.6875rem]", // below scale minimum: tier mais compacto do componente
  md: "h-7 px-2.5 text-body-caption",
  lg: "h-8 px-3   text-body-callout",
};

const VARIANT_WRAP: Record<ToggleGroupVariant, string> = {
  outline: "border border-rule rounded-(--radius-sm) p-0.5 gap-0.5 bg-graphite-2",
  solid: "gap-1",
  ghost: "gap-0.5",
};

const VARIANT_BTN_BASE: Record<ToggleGroupVariant, string> = {
  outline: "rounded-[calc(var(--radius-sm)-2px)]",
  solid: "rounded-(--radius-sm) border border-rule",
  ghost: "rounded-(--radius-sm)",
};

const VARIANT_BTN_ACTIVE: Record<ToggleGroupVariant, string> = {
  outline: "bg-raised text-foreground shadow-[0_1px_3px_-1px_oklch(0%_0_0/0.25),0_0_0_1px_var(--ks-rule)]",
  solid: "bg-patina text-patina-fg border-patina",
  ghost: "bg-graphite text-foreground",
};

const VARIANT_BTN_INACTIVE: Record<ToggleGroupVariant, string> = {
  outline: "text-faint hover:text-foreground",
  solid: "bg-raised text-faint hover:text-foreground hover:bg-graphite",
  ghost: "text-faint hover:text-foreground hover:bg-graphite-2",
};

/* ── Base toggle group (outline | solid | ghost) ─────────────────────────── */
function BaseToggleGroup({
  items,
  type = "single",
  variant = "outline",
  size = "md",
  value,
  defaultValue,
  onChange,
  className,
  style,
}: ToggleGroupProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | string[]>(defaultValue ?? (type === "multiple" ? [] : ""));
  const active = isControlled ? value : internal;

  function toggle(v: string) {
    if (type === "multiple") {
      const arr = Array.isArray(active) ? active : [];
      const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
      if (!isControlled) setInternal(next);
      onChange?.(next);
    } else {
      const next = active === v ? "" : v;
      if (!isControlled) setInternal(next);
      onChange?.(next);
    }
  }

  function isActive(v: string) {
    if (Array.isArray(active)) return active.includes(v);
    return active === v;
  }

  return (
    <div role="group" style={style} className={cn("inline-flex items-center", VARIANT_WRAP[variant], className)}>
      {items.map((item) => {
        const on = isActive(item.value);
        return (
          <button
            key={item.value}
            type="button"
            disabled={item.disabled}
            onClick={() => !item.disabled && toggle(item.value)}
            aria-pressed={on}
            className={cn(
              "inline-flex items-center justify-center font-medium transition-[background,color,box-shadow] duration-[120ms] select-none",
              SIZE_BTN[size],
              VARIANT_BTN_BASE[variant],
              on ? VARIANT_BTN_ACTIVE[variant] : VARIANT_BTN_INACTIVE[variant],
              item.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Segmented control (absorbed from SegmentedControl) ───────────────────── */
const SEG_SIZE_WRAP: Record<string, string> = {
  sm: "p-0.5 gap-0.5 rounded-(--radius-sm)",
  md: "p-[3px] gap-[3px] rounded-(--radius-md)",
  lg: "p-1 gap-1 rounded-(--radius-md)",
};
const SEG_SIZE_BTN: Record<string, string> = {
  sm: "h-6  px-2.5 text-[0.6875rem] rounded-[calc(var(--radius-sm)-2px)]", // below scale minimum: tier compacto
  md: "h-7  px-3   text-body-caption rounded-[calc(var(--radius-md)-3px)]",
  lg: "h-8  px-4   text-body-callout rounded-[calc(var(--radius-md)-4px)]",
};

function SegmentedToggleGroup<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  size = "md",
  fullWidth = false,
  className,
  style,
}: ToggleGroupSegmentedProps<T>) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<T | undefined>(defaultValue);
  const active = isControlled ? value : internal;

  function select(v: T) {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  }

  return (
    <div
      role="group"
      style={style}
      className={cn(
        "inline-flex bg-graphite-2 border border-rule",
        SEG_SIZE_WRAP[size],
        fullWidth && "flex w-full",
        className
      )}
    >
      {options.map((opt) => {
        const isActive = active === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={opt.disabled}
            onClick={() => !opt.disabled && select(opt.value)}
            className={cn(
              "inline-flex items-center justify-center font-medium transition-[background,color,box-shadow] duration-[120ms] select-none",
              SEG_SIZE_BTN[size],
              fullWidth && "flex-1",
              isActive
                ? "bg-raised text-foreground shadow-[0_1px_3px_-1px_oklch(0%_0_0/0.25),0_0_0_1px_var(--ks-rule)]"
                : "text-faint hover:text-foreground",
              opt.disabled && "opacity-40 cursor-not-allowed"
            )}
            aria-pressed={isActive}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Chip group (absorbed from ChipGroup) ────────────────────────────────── */
const CHIP_SIZE_CLS: Record<ChipGroupSize, string> = {
  sm: "h-7  px-2.5 text-[0.7rem] gap-1   rounded-md", // below scale minimum: tier compacto
  md: "h-8  px-3   text-body-caption gap-1.5 rounded-lg",
  lg: "h-10 px-4   text-body-callout gap-2  rounded-lg",
};

const CHIP_INTENT_ACTIVE: Record<ChipGroupIntent, string> = {
  primary: "bg-patina text-patina-fg border-patina",
  secondary: "bg-kinpaku text-kinpaku-fg border-kinpaku",
  success: "bg-success text-success-fg border-success",
  warning: "bg-warning text-warning-fg border-warning",
  danger: "bg-danger text-danger-fg border-danger",
  info: "bg-info text-info-fg border-info",
  neutral: "bg-raised text-foreground border-foreground/30",
};

function ChipToggleGroup({
  chips,
  value,
  defaultValue = [],
  onChange,
  multiSelect = true,
  intent = "primary",
  size = "md",
  className,
  style,
}: ToggleGroupChipProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const selected = isControlled ? value! : internal;

  function toggle(id: string) {
    let next: string[];
    if (multiSelect) {
      next = selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id];
    } else {
      next = selected[0] === id ? [] : [id];
    }
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  return (
    <div style={style} role="group" className={cn("flex flex-wrap gap-(--spacing-sm)", className)}>
      {chips.map((chip) => {
        const active = selected.includes(chip.id);
        return (
          <button
            key={chip.id}
            type="button"
            disabled={chip.disabled}
            aria-pressed={active}
            onClick={() => toggle(chip.id)}
            className={cn(
              "inline-flex items-center border font-medium select-none",
              "transition-[background,color,border-color,opacity] duration-[100ms]",
              CHIP_SIZE_CLS[size],
              active
                ? CHIP_INTENT_ACTIVE[intent]
                : "bg-transparent text-faint border-rule hover:border-foreground/30 hover:text-foreground",
              chip.disabled && "opacity-40 pointer-events-none"
            )}
          >
            {chip.icon && <span className="leading-none">{chip.icon}</span>}
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Filter bar (absorbed from FilterBar) ────────────────────────────────── */
function FilterToggleGroup({
  options,
  value: controlled,
  defaultValue,
  onChange,
  multiSelect = true,
  clearable = true,
  className,
  style,
}: ToggleGroupFilterProps) {
  const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
  const selected = controlled !== undefined ? controlled : internal;

  function toggle(v: string) {
    const next = !multiSelect
      ? selected.includes(v)
        ? []
        : [v]
      : selected.includes(v)
        ? selected.filter((s) => s !== v)
        : [...selected, v];
    if (controlled === undefined) setInternal(next);
    onChange?.(next);
  }

  function clear() {
    if (controlled === undefined) setInternal([]);
    onChange?.([]);
  }

  return (
    <div role="group" className={cn("flex flex-wrap gap-(--spacing-xs) items-center", className)} style={style}>
      {options.map((opt) => {
        const isActive = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isActive}
            className={cn(
              // gap-[5px]/py-[5px]: sem match exato na escala de spacing
              "inline-flex items-center gap-[5px] py-[5px] px-(--spacing-md) rounded-pill text-body-callout font-medium cursor-pointer border border-rule bg-transparent text-muted transition-[border-color,background,color] duration-[150ms] select-none",
              "hover:border-patina hover:text-foreground hover:bg-[color-mix(in_srgb,var(--ks-primary)_8%,transparent)]",
              isActive &&
                "border-patina bg-[color-mix(in_srgb,var(--ks-primary)_15%,transparent)] text-patina font-semibold"
            )}
            onClick={() => toggle(opt.value)}
          >
            {opt.label}
            {opt.count !== undefined && (
              <span
                className={cn(
                  "bg-raised rounded-pill px-[6px] py-[1px] text-body-caption font-bold text-muted min-w-[18px] text-center",
                  isActive && "bg-[color-mix(in_srgb,var(--ks-primary)_25%,transparent)] text-patina"
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
      {clearable && selected.length > 0 && (
        <button
          type="button"
          // py-[5px]/px-[10px]: sem match exato na escala de spacing
          className="inline-flex items-center gap-(--spacing-2xs) py-[5px] px-[10px] rounded-pill text-body-caption cursor-pointer border border-dashed border-rule bg-transparent text-muted transition-[color,border-color] hover:text-danger hover:border-danger"
          onClick={clear}
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}

/**
 * ToggleGroup — Super component.
 * Dispatches on `variant`:
 *  - "outline" | "solid" | "ghost" (default): the base segmented toggle (items[]).
 *  - "segmented": sliding-style segmented control (options[]).
 *  - "chip": selectable chips (chips[]).
 *  - "filter": filter bar with counts + clear (options[]).
 * Absorbs the former SegmentedControl, ChipGroup and FilterBar (now backward-compat wrappers).
 */

export function ToggleGroup(props: ToggleGroupAllProps) {
  switch (props.variant) {
    case "segmented":
      return <SegmentedToggleGroup {...props} />;
    case "chip":
      return <ChipToggleGroup {...props} />;
    case "filter":
      return <FilterToggleGroup {...props} />;
    default:
      return <BaseToggleGroup {...(props as ToggleGroupProps)} />;
  }
}
