"use client";
import type React from "react";
import { useId, useState, useRef, useCallback, useEffect } from "react";

import { cn } from "@/lib/utils";

import type { SliderSize, SliderIntent, SliderSingleProps, SliderRangeProps, SliderProps } from "./slider.types";

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
  previewOnHover = false,
  className,
  style,
}: SliderSingleProps) {
  const uid = useId();
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? value ?? min : internal;
  const trackWrapRef = useRef<HTMLDivElement>(null);
  const [hoverPct, setHoverPct] = useState<number | null>(null);

  const pct = ((current - min) / (max - min)) * 100;

  function handlePreviewMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!previewOnHover || !trackWrapRef.current) return;
    const { left, width } = trackWrapRef.current.getBoundingClientRect();
    setHoverPct(clamp(((e.clientX - left) / width) * 100, 0, 100));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    if (!isControlled) setInternal(v);
    onChange?.(v);
  }

  const displayVal = formatValue ? formatValue(current) : String(current);

  return (
    <div className={cn("flex flex-col gap-(--spacing-2xs)", className)} style={style}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-(--spacing-md)">
          {label && (
            <label className="text-body-callout font-semibold text-foreground" htmlFor={uid}>
              {label}
            </label>
          )}
          {showValue && <span className="text-body-callout text-faint tabular-nums shrink-0">{displayVal}</span>}
        </div>
      )}

      {/* pb-5 (20px): sem match exato na escala de spacing */}
      <div
        ref={trackWrapRef}
        className={cn("relative flex items-center", marks ? "pb-5" : "", disabled && "opacity-50")}
        onMouseMove={handlePreviewMove}
        onMouseLeave={() => setHoverPct(null)}
      >
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
          {/* preview: segmento entre o valor atual e a posição do cursor, antes de soltar/clicar —
              técnica das origens slider-01/02/03.tsx (volume/reação/temperatura), sem lib nova */}
          {previewOnHover && !disabled && hoverPct !== null && (
            <div
              className={cn("absolute top-0 h-full rounded-full opacity-30 pointer-events-none", INTENT_CLS[intent])}
              style={{
                left: `${Math.min(pct, hoverPct)}%`,
                width: `${Math.abs(hoverPct - pct)}%`,
              }}
            />
          )}
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
            "absolute rounded-full bg-canvas border-2 shadow-sm pointer-events-none transition-[left] duration-[80ms]",
            SIZE_THUMB[size],
            INTENT_CLS[intent].replace("bg-", "border-")
          )}
          style={{ left: `calc(${pct}% - ${size === "sm" ? 6 : size === "md" ? 8 : 10}px)` }}
        />

        {/* marks */}
        {marks && (
          <div className="absolute inset-x-0 top-full mt-(--spacing-2xs) pointer-events-none">
            {marks.map((m) => {
              const mPct = ((m.value - min) / (max - min)) * 100;
              return (
                <div
                  key={m.value}
                  className="absolute flex flex-col items-center gap-(--spacing-3xs)"
                  style={{ left: `${mPct}%`, transform: "translateX(-50%)" }}
                >
                  <div className="w-px h-1 bg-rule" />
                  {/* text-[0.625rem]: below scale minimum, micro-label de marca no slider */}
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
  size = "md",
  intent = "primary",
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

  // focus-visible:shadow-[...var(--x)/50]: sintaxe de opacidade inválida dentro de var() —
  // CSS descarta o box-shadow inteiro (confirmado via getComputedStyle: foco não mudava nada
  // visualmente). Trocado por color-mix() pra opacidade real de verdade.
  //
  // Achado real: `size`/`intent` são props reais de SliderCommon (herdadas por
  // SliderRangeProps), mas o THUMB/track/fill abaixo ignoravam as duas por
  // completo (sempre w-4 h-4 + bg-patina/--ks-primary, não importa o que o
  // consumidor passasse) — mesma categoria de "prop declarada, nunca lida"
  // já vista em vários componentes. `--ks-${intent}` é seguro porque bate 1:1
  // com os 5 valores de SliderIntent (primary/info/success/warning/danger),
  // todos confirmados como variáveis CSS reais.
  const THUMB = cn(
    "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-raised cursor-grab active:cursor-grabbing transition-shadow duration-[80ms] focus:outline-none",
    "shadow-[0_0_0_2px_var(--thumb-ring)] focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--thumb-ring)_50%,transparent)]",
    SIZE_THUMB[size],
    INTENT_CLS[intent]
  );
  // Custom property em vez de var(--ks-${intent}) cru dentro da classe: permite
  // que a MESMA classe estática sirva os 5 intents, com o valor real resolvido
  // por elemento via style inline (Tailwind arbitrary value não interpola JS).
  const thumbStyle = { "--thumb-ring": `var(--ks-${intent})` } as React.CSSProperties;

  return (
    <div
      style={style}
      className={cn("flex flex-col gap-(--spacing-sm)", disabled && "opacity-50 pointer-events-none", className)}
    >
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
        className={cn("relative rounded-full bg-graphite-2 cursor-pointer", SIZE_TRACK[size])}
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
          className={cn("absolute top-0 h-full rounded-full", INTENT_CLS[intent])}
          style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }}
        />

        {/* lo thumb */}
        <button
          type="button"
          role="slider"
          tabIndex={0}
          disabled={disabled}
          aria-valuemin={min}
          aria-valuemax={hi - step}
          aria-valuenow={lo}
          aria-label="Minimum value"
          className={THUMB}
          style={{ left: `${pct(lo)}%`, ...thumbStyle }}
          onMouseDown={startDrag("lo")}
          onTouchStart={startDrag("lo")}
          onKeyDown={(e) => {
            if (disabled) return;
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
          disabled={disabled}
          aria-valuemin={lo + step}
          aria-valuemax={max}
          aria-valuenow={hi}
          aria-label="Maximum value"
          className={THUMB}
          style={{ left: `${pct(hi)}%`, ...thumbStyle }}
          onMouseDown={startDrag("hi")}
          onTouchStart={startDrag("hi")}
          onKeyDown={(e) => {
            if (disabled) return;
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
