"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type ProgressIntent = "primary" | "info" | "success" | "warning" | "danger";
export type ProgressSize = "xs" | "sm" | "md" | "lg";

/* ── Ring (circular) types ───────────────────────────────────────────────── */
export type ProgressRingIntent = "primary" | "secondary" | "success" | "warning" | "danger" | "info";

/* ── Gauge (arc) types ───────────────────────────────────────────────────── */
export type GaugeIntent = "default" | "primary" | "success" | "warning" | "danger";
export type GaugeSize = "sm" | "md" | "lg";

/* ── Skill-list types ────────────────────────────────────────────────────── */
export type SkillBarIntent = "primary" | "success" | "warning" | "danger" | "secondary";

export interface SkillItem {
  label: string;
  value: number;
  max?: number;
  intent?: SkillBarIntent;
  sublabel?: string;
}

/* ── Props (discriminated by shape / mode) ───────────────────────────────── */
export interface ProgressBarProps {
  /** Render shape. Default 'bar' (linear). */
  shape?: "bar";
  mode?: "single";
  value?: number;
  max?: number;
  intent?: ProgressIntent;
  size?: ProgressSize;
  label?: string;
  showValue?: boolean;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface ProgressRingShapeProps {
  shape: "ring";
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  intent?: ProgressRingIntent;
  label?: React.ReactNode;
  showValue?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface ProgressGaugeShapeProps {
  shape: "gauge";
  value: number;
  max?: number;
  size?: GaugeSize;
  intent?: GaugeIntent;
  label?: string;
  showValue?: boolean;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface ProgressSkillListProps {
  mode: "skill-list";
  shape?: "bar";
  skills: SkillItem[];
  animate?: boolean;
  showValues?: boolean;
  height?: number;
  intent?: SkillBarIntent;
  className?: string;
  style?: React.CSSProperties;
}

export type ProgressProps =
  | ProgressBarProps
  | ProgressRingShapeProps
  | ProgressGaugeShapeProps
  | ProgressSkillListProps;

const SIZE_H: Record<ProgressSize, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};
const INTENT_FILL: Record<ProgressIntent, string> = {
  primary: "bg-patina",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

/* ── Linear bar (default) ────────────────────────────────────────────────── */
function ProgressBar({
  value,
  max = 100,
  intent = "primary",
  size = "md",
  label,
  showValue = false,
  animated = false,
  className,
  style,
}: ProgressBarProps) {
  const indeterminate = value === undefined;
  const pct = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex flex-col gap-1", className)} style={style}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2">
          {label && <span className="text-body-callout font-medium text-foreground">{label}</span>}
          {showValue && !indeterminate && (
            <span className="text-body-callout text-faint tabular-nums shrink-0">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className={cn("relative w-full rounded-full bg-graphite-2 overflow-hidden", SIZE_H[size])}
      >
        {indeterminate ? (
          <div
            className={cn(
              "absolute h-full w-2/5 rounded-full animate-[ks-progress-slide_1.4s_ease-in-out_infinite]",
              INTENT_FILL[intent]
            )}
          />
        ) : (
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-[300ms] ease-out",
              INTENT_FILL[intent],
              animated &&
                "bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.18)_8px,rgba(255,255,255,0.18)_16px)] bg-[length:28px_100%] animate-[ks-progress-stripe_0.7s_linear_infinite]"
            )}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
      <style>{`
        @keyframes ks-progress-slide {
          0%   { left: -40%; }
          100% { left: 100%; }
        }
        @keyframes ks-progress-stripe {
          from { background-position: 0 0; }
          to   { background-position: 28px 0; }
        }
      `}</style>
    </div>
  );
}

/* ── Ring (circular) — absorbed from ProgressRing ────────────────────────── */
const RING_INTENT_STROKE: Record<string, string> = {
  primary: "var(--ks-primary)",
  secondary: "var(--ks-kinpaku)",
  success: "var(--ks-success)",
  warning: "var(--ks-warning)",
  danger: "var(--ks-danger)",
  info: "var(--ks-info)",
};

function ProgressRingShape({
  value,
  max = 100,
  size = 80,
  stroke = 6,
  intent = "primary",
  label,
  showValue = true,
  className,
  style,
}: ProgressRingShapeProps) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value / max, 0), 1);
  const dashOffset = circumference * (1 - pct);
  const color = RING_INTENT_STROKE[intent] ?? "var(--ks-primary)";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size, ...style }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="color-mix(in srgb, currentColor 12%, transparent)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className="font-bold tabular-nums leading-none" style={{ fontSize: size * 0.2, color }}>
            {Math.round(pct * 100)}%
          </span>
        )}
        {label && (
          <span className="text-faint leading-none mt-0.5" style={{ fontSize: size * 0.13 }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Gauge (arc) — absorbed from Gauge ───────────────────────────────────── */
const GAUGE_INTENT_COLOR: Record<string, string> = {
  default: "var(--ks-text-muted)",
  primary: "var(--ks-primary)",
  success: "var(--ks-success)",
  warning: "var(--ks-warning)",
  danger: "var(--ks-danger)",
};

const GAUGE_SIZE_VARS: Record<string, { sz: string; fsz: string }> = {
  sm: { sz: "64px", fsz: "12px" },
  md: { sz: "96px", fsz: "16px" },
  lg: { sz: "128px", fsz: "20px" },
};

function ProgressGaugeShape({
  value,
  max = 100,
  size = "md",
  intent = "primary",
  label,
  showValue = true,
  strokeWidth,
  className,
  style,
}: ProgressGaugeShapeProps) {
  const pct = Math.max(0, Math.min(value / max, 1));
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const sw = strokeWidth ?? (size === "sm" ? 6 : size === "lg" ? 10 : 8);
  const offset = circumference * (1 - pct);
  const displayValue = Number.isInteger(value) ? value : value.toFixed(1);
  const displayMax = Number.isInteger(max) ? max : max.toFixed(1);
  const c = GAUGE_INTENT_COLOR[intent] ?? GAUGE_INTENT_COLOR.primary;
  const sz = GAUGE_SIZE_VARS[size] ?? GAUGE_SIZE_VARS.md;

  return (
    <div className={cn("inline-flex flex-col items-center gap-[6px]", className)} style={style}>
      <div className="relative inline-flex items-center justify-center" style={{ width: sz.sz, height: sz.sz }}>
        <svg className="-rotate-90" viewBox="0 0 100 100" style={{ width: sz.sz, height: sz.sz }}>
          <circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={sw}
            style={{ fill: "none", stroke: `color-mix(in srgb, ${c} 15%, transparent)` }}
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ fill: "none", stroke: c, transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        {showValue && (
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-bold text-foreground leading-none" style={{ fontSize: sz.fsz }}>
              {displayValue}
            </span>
            {max !== 100 && <span style={{ fontSize: 10, opacity: 0.4 }}>/{displayMax}</span>}
          </div>
        )}
      </div>
      {label && <span className="text-body-caption text-muted">{label}</span>}
    </div>
  );
}

/* ── Skill list — absorbed from SkillBar ─────────────────────────────────── */
const SKILL_INTENT_COLOR: Record<string, string> = {
  primary: "var(--ks-primary)",
  secondary: "var(--ks-kinpaku)",
  tertiary: "var(--ks-violet)",
  quaternary: "var(--ks-rose)",
  success: "var(--ks-success)",
  warning: "var(--ks-warning)",
  danger: "var(--ks-danger)",
};

function ProgressSkillList({
  skills,
  animate = true,
  showValues = true,
  height = 8,
  intent: rootIntent = "primary",
  className,
  style,
}: ProgressSkillListProps) {
  const [visible, setVisible] = useState(!animate);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animate]);

  return (
    <div ref={ref} className={cn("flex flex-col gap-[14px]", className)} style={style}>
      {skills.map((skill, i) => {
        const max = skill.max ?? 100;
        const pct = Math.min((skill.value / max) * 100, 100);
        const color = SKILL_INTENT_COLOR[skill.intent ?? rootIntent] ?? SKILL_INTENT_COLOR.primary;

        return (
          <div key={i} className="flex flex-col gap-[6px]">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-body-callout font-semibold text-foreground">{skill.label}</span>
                {skill.sublabel && <span className="text-body-caption opacity-40"> — {skill.sublabel}</span>}
              </div>
              {showValues && (
                <span className="text-body-caption font-bold opacity-60 tabular-nums">
                  {skill.value}
                  {max !== 100 ? `/${max}` : "%"}
                </span>
              )}
            </div>
            <div className="rounded-pill bg-sunken overflow-hidden" style={{ height }}>
              <div
                className="rounded-pill transition-[width] duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ width: visible ? `${pct}%` : "0%", height, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Progress — Super component.
 * `shape` (default 'bar') selects linear bar vs 'ring' (circular) vs 'gauge' (arc).
 * `mode='skill-list'` renders an array of labelled bars.
 * Absorbs the former ProgressRing, Gauge and SkillBar (now backward-compat wrappers).
 */
export function Progress(props: ProgressProps) {
  if ("mode" in props && props.mode === "skill-list") return <ProgressSkillList {...props} />;
  if (props.shape === "ring") return <ProgressRingShape {...props} />;
  if (props.shape === "gauge") return <ProgressGaugeShape {...props} />;
  return <ProgressBar {...(props as ProgressBarProps)} />;
}
