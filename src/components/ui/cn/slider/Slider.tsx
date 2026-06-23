"use client";
import type React from "react";
import { useId, useState, useRef, useCallback, useEffect } from "react";

import { cn } from "@/lib/utils";

export type SliderSize = "sm" | "md" | "lg";
export type SliderIntent = "primary" | "info" | "success" | "warning" | "danger";

export interface SliderMark {
  value: number;
  label?: string;
}

interface SliderCommon {
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  formatValue?: (v: number) => string;
  size?: SliderSize;
  intent?: SliderIntent;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface SliderSingleProps extends SliderCommon {
  /** Dual-thumb range mode. Omit/false for a single-value slider. */
  range?: false;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
  marks?: SliderMark[];
}

export interface SliderRangeProps extends SliderCommon {
  range: true;
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  showValues?: boolean;
}

export type SliderProps = SliderSingleProps | SliderRangeProps;

const SIZE_TRACK: Record<SliderSize, string> = {
  sm: "h-1",
  md: "h-[5px]",
  lg: "h-2",
};
const SIZE_THUMB: Record<SliderSize, string> = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};
const INTENT_CLS: Record<SliderIntent, string> = {
  primary: "bg-patina",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function snapToStep(v: number, min: number, step: number) {
  return Math.round((v - min) / step) * step + min;
}

/* ── Single-value slider (default) ───────────────────────────────────────── */
function SingleSlider({
  value,
  defaultValue = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  formatValue,
  marks,
  size = "md",
  intent = "primary",
  disabled = false,
  className,
  style,
}: SliderSingleProps) {
  const uid = useId();
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? value ?? min : internal;

  const pct = ((current - min) / (max - min)) * 100;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    if (!isControlled) setInternal(v);
    onChange?.(v);
  }

  const displayVal = formatValue ? formatValue(current) : String(current);

  return (
    <div className={cn("flex flex-col gap-1", className)} style={style}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-3">
          {label && (
            <label className="text-body-callout font-semibold text-foreground" htmlFor={uid}>
              {label}
            </label>
          )}
          {showValue && <span className="text-body-callout text-faint tabular-nums shrink-0">{displayVal}</span>}
        </div>
      )}

      <div className={cn("relative flex items-center", marks ? "pb-5" : "", disabled && "opacity-50")}>
        {/* track */}
        <div className={cn("relative w-full rounded-full bg-graphite-2", SIZE_TRACK[size])}>
          {/* fill */}
          <div
            className={cn(
              "absolute left-0 top-0 h-full rounded-full transition-[width] duration-[80ms]",
              INTENT_CLS[intent]
            )}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* native range */}
        <input
          id={uid}
          type="range"
          min={min}
          max={max}
          step={step}
          value={isControlled ? current : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          disabled={disabled}
          onChange={handleChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          style={{ height: "100%" }}
        />

        {/* thumb */}
        <div
          className={cn(
            "absolute rounded-full bg-white border-2 shadow-sm pointer-events-none transition-[left] duration-[80ms]",
            SIZE_THUMB[size],
            INTENT_CLS[intent].replace("bg-", "border-")
          )}
          style={{ left: `calc(${pct}% - ${size === "sm" ? 6 : size === "md" ? 8 : 10}px)` }}
        />

        {/* marks */}
        {marks && (
          <div className="absolute inset-x-0 top-full mt-1 pointer-events-none">
            {marks.map((m) => {
              const mPct = ((m.value - min) / (max - min)) * 100;
              return (
                <div
                  key={m.value}
                  className="absolute flex flex-col items-center gap-0.5"
                  style={{ left: `${mPct}%`, transform: "translateX(-50%)" }}
                >
                  <div className="w-px h-1 bg-rule" />
                  {m.label && <span className="text-[0.625rem] text-faint whitespace-nowrap">{m.label}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Dual-thumb range slider (range) ─────────────────────────────────────── */
function RangeSliderImpl({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = [25, 75],
  onChange,
  formatValue = String,
  label,
  showValues = true,
  disabled = false,
  className,
  style,
}: SliderRangeProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<[number, number]>(defaultValue);
  const [lo, hi] = isControlled ? value! : internal;

  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"lo" | "hi" | null>(null);

  function pct(v: number) {
    return ((v - min) / (max - min)) * 100;
  }

  const updateFromClient = useCallback(
    (clientX: number) => {
      if (!trackRef.current || !dragging.current) return;
      const { left, width } = trackRef.current.getBoundingClientRect();
      const ratio = clamp((clientX - left) / width, 0, 1);
      const raw = min + ratio * (max - min);
      const snapped = clamp(snapToStep(raw, min, step), min, max);

      const [curLo, curHi] = isControlled ? value! : internal;
      let next: [number, number];
      if (dragging.current === "lo") {
        next = [clamp(snapped, min, curHi - step), curHi];
      } else {
        next = [curLo, clamp(snapped, curLo + step, max)];
      }
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [min, max, step, isControlled, value, internal, onChange]
  );

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      updateFromClient(cx);
    }
    function onUp() {
      dragging.current = null;
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    };
  }, [updateFromClient]);

  function startDrag(which: "lo" | "hi") {
    return (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return;
      e.preventDefault();
      dragging.current = which;
    };
  }

  const THUMB =
    "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-patina border-2 border-raised shadow-[0_0_0_2px_var(--ks-primary)] cursor-grab active:cursor-grabbing transition-shadow duration-[80ms] focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--ks-primary)/50]";

  return (
    <div style={style} className={cn("flex flex-col gap-2", disabled && "opacity-50 pointer-events-none", className)}>
      {(label || showValues) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-body-callout font-medium text-foreground">{label}</span>}
          {showValues && (
            <span className="text-body-callout text-faint tabular-nums">
              {formatValue(lo)} – {formatValue(hi)}
            </span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        className="relative h-1.5 rounded-full bg-graphite-2 cursor-pointer"
        onClick={(e) => {
          if (disabled || dragging.current) return;
          const { left, width } = trackRef.current!.getBoundingClientRect();
          const ratio = clamp((e.clientX - left) / width, 0, 1);
          const snapped = clamp(snapToStep(min + ratio * (max - min), min, step), min, max);
          const midPct = (pct(lo) + pct(hi)) / 2;
          const clickPct = ratio * 100;
          const which = clickPct < midPct ? "lo" : "hi";
          const next: [number, number] =
            which === "lo" ? [clamp(snapped, min, hi - step), hi] : [lo, clamp(snapped, lo + step, max)];
          if (!isControlled) setInternal(next);
          onChange?.(next);
        }}
      >
        {/* fill */}
        <div
          className="absolute top-0 h-full bg-patina rounded-full"
          style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }}
        />

        {/* lo thumb */}
        <button
          type="button"
          role="slider"
          tabIndex={0}
          aria-valuemin={min}
          aria-valuemax={hi - step}
          aria-valuenow={lo}
          aria-label="Minimum value"
          className={THUMB}
          style={{ left: `${pct(lo)}%` }}
          onMouseDown={startDrag("lo")}
          onTouchStart={startDrag("lo")}
          onKeyDown={(e) => {
            const delta =
              e.key === "ArrowRight" || e.key === "ArrowUp"
                ? step
                : e.key === "ArrowLeft" || e.key === "ArrowDown"
                  ? -step
                  : 0;
            if (!delta) return;
            const next: [number, number] = [clamp(lo + delta, min, hi - step), hi];
            if (!isControlled) setInternal(next);
            onChange?.(next);
          }}
        />

        {/* hi thumb */}
        <button
          type="button"
          role="slider"
          tabIndex={0}
          aria-valuemin={lo + step}
          aria-valuemax={max}
          aria-valuenow={hi}
          aria-label="Maximum value"
          className={THUMB}
          style={{ left: `${pct(hi)}%` }}
          onMouseDown={startDrag("hi")}
          onTouchStart={startDrag("hi")}
          onKeyDown={(e) => {
            const delta =
              e.key === "ArrowRight" || e.key === "ArrowUp"
                ? step
                : e.key === "ArrowLeft" || e.key === "ArrowDown"
                  ? -step
                  : 0;
            if (!delta) return;
            const next: [number, number] = [lo, clamp(hi + delta, lo + step, max)];
            if (!isControlled) setInternal(next);
            onChange?.(next);
          }}
        />
      </div>
    </div>
  );
}

/**
 * Slider — Super component.
 * `range` (default false) selects single-value vs dual-thumb range mode.
 * Absorbs the former RangeSlider (now a backward-compat wrapper).
 */
export function Slider(props: SliderProps) {
  if (props.range) return <RangeSliderImpl {...props} />;
  return <SingleSlider {...props} />;
}
