"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type {
  ProgressProps,
  ProgressIntent,
  ProgressSize,
  ProgressBarProps,
  ProgressRingShapeProps,
  ProgressGaugeShapeProps,
  ProgressSkillListProps,
  ProgressFakeProps,
} from "./progress.types";

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
    <div className={cn("flex flex-col gap-(--spacing-2xs)", className)} style={style}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-(--spacing-sm)">
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
              // glare listrado sobre o preenchimento: precisa ser branco translúcido literal, independente do tema (no token equivalent)
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
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={typeof label === "string" ? label : `${Math.round(pct * 100)}%`}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size, ...style }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
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
          // fontSize proporcional ao `size` (número livre em px, não enum) — sem token de tipografia possível
          <span className="font-bold tabular-nums leading-none" style={{ fontSize: size * 0.2, color }}>
            {Math.round(pct * 100)}%
          </span>
        )}
        {label && (
          <span className="text-faint leading-none mt-(--spacing-3xs)" style={{ fontSize: size * 0.13 }}>
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

const GAUGE_SIZE_VARS: Record<string, { sz: string }> = {
  sm: { sz: "64px" },
  md: { sz: "96px" },
  lg: { sz: "128px" },
};
// fsz mapeado pra token de tipografia (12px/16px/20px batem exato com body-caption/body-paragraph/body-title)
const GAUGE_VALUE_TEXT_CLS: Record<string, string> = {
  sm: "text-body-caption",
  md: "text-body-paragraph",
  lg: "text-body-title",
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
  const valueTextCls = GAUGE_VALUE_TEXT_CLS[size] ?? GAUGE_VALUE_TEXT_CLS.md;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label ?? `${Math.round(pct * 100)}%`}
      className={cn("inline-flex flex-col items-center gap-(--spacing-xs)", className)}
      style={style}
    >
      <div className="relative inline-flex items-center justify-center" style={{ width: sz.sz, height: sz.sz }}>
        <svg className="-rotate-90" viewBox="0 0 100 100" style={{ width: sz.sz, height: sz.sz }} aria-hidden="true">
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
            <span className={cn("font-bold text-foreground leading-none", valueTextCls)}>{displayValue}</span>
            {max !== 100 && (
              // text-[10px]: below scale minimum, micro-label de unidade (/max)
              <span className="text-[10px] opacity-40">/{displayMax}</span>
            )}
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
    <div
      ref={ref}
      // gap-[14px]: sem match exato na escala de spacing (entre --spacing-md 12px e --spacing-lg 16px)
      className={cn("flex flex-col gap-[14px]", className)}
      style={style}
    >
      {skills.map((skill, i) => {
        const max = skill.max ?? 100;
        const pct = Math.min((skill.value / max) * 100, 100);
        const color = SKILL_INTENT_COLOR[skill.intent ?? rootIntent] ?? SKILL_INTENT_COLOR.primary;

        return (
          <div key={i} className="flex flex-col gap-(--spacing-xs)">
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
            <div
              role="progressbar"
              aria-valuenow={skill.value}
              aria-valuemin={0}
              aria-valuemax={max}
              aria-label={skill.label}
              className="rounded-pill bg-sunken overflow-hidden"
              style={{ height }}
            >
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

/* ── "Loading fake" — auto-incrementa com jitter, nunca fecha sozinho ───── */
function ProgressFake({
  messages,
  duration = 4000,
  ceiling = 92,
  intent = "primary",
  size = "md",
  showValue = false,
  className,
  style,
}: ProgressFakeProps) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function tick() {
      setPct((p) => {
        if (p >= ceiling) return p;
        // jitter: passo proporcional ao que falta (curva desacelerando), com variação
        // aleatória — nunca uma reta perfeita, mesma sensação de "loading fake" real
        const remaining = ceiling - p;
        const step = Math.max(0.5, remaining * 0.08) * (0.5 + Math.random());
        return Math.min(ceiling, p + step);
      });
      timer = setTimeout(tick, duration / 40);
    }
    timer = setTimeout(tick, duration / 40);
    return () => clearTimeout(timer);
  }, [ceiling, duration]);

  const message =
    messages && messages.length > 0
      ? messages[Math.min(messages.length - 1, Math.floor((pct / ceiling) * messages.length))]
      : undefined;

  return (
    <div className={cn("flex flex-col gap-(--spacing-2xs)", className)} style={style}>
      {message && (
        <div className="flex items-center justify-between gap-(--spacing-sm)">
          <span className="text-body-callout font-medium text-foreground">{message}</span>
          {showValue && <span className="text-body-callout text-faint tabular-nums shrink-0">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={message}
        className={cn("relative w-full rounded-full bg-graphite-2 overflow-hidden", SIZE_H[size])}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-[300ms] ease-out", INTENT_FILL[intent])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Progress — Super component.
 * `shape` (default 'bar') selects linear bar vs 'ring' (circular) vs 'gauge' (arc).
 * `mode='skill-list'` renders an array of labelled bars.
 * `mode='fake'` renders a self-driven "loading fake" bar (auto-increment + jitter +
 * rotating status messages) that never completes on its own.
 * Absorbs the former ProgressRing, Gauge and SkillBar (now backward-compat wrappers).
 */
export function Progress(props: ProgressProps) {
  if ("mode" in props && props.mode === "skill-list") return <ProgressSkillList {...props} />;
  if ("mode" in props && props.mode === "fake") return <ProgressFake {...props} />;
  if (props.shape === "ring") return <ProgressRingShape {...props} />;
  if (props.shape === "gauge") return <ProgressGaugeShape {...props} />;
  return <ProgressBar {...(props as ProgressBarProps)} />;
}
