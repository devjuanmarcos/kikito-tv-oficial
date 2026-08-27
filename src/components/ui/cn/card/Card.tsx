"use client";
import React, { useCallback, useRef } from "react";

import { cn } from "@/lib/utils";

import type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  CardVariant,
  CardPadding,
  CardRadius,
  CardGradientBorderVariant,
} from "./card.types";

export type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  CardVariant,
  CardPadding,
  CardRadius,
  CardEffect,
  CardGradientBorderVariant,
} from "./card.types";

const VARIANT_CLS: Record<CardVariant, string> = {
  default: "bg-raised border border-rule",
  outlined: "bg-transparent border border-rule",
  elevated: "bg-raised border border-rule shadow-[0_2px_12px_-4px_oklch(0%_0_0/0.30)]",
  filled: "bg-graphite border border-transparent",
  ghost: "bg-transparent border border-transparent",
};
const PADDING_CLS: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};
const RADIUS_CLS: Record<CardRadius, string> = {
  sm: "rounded-(--radius-sm)",
  md: "rounded-(--radius-md)",
  lg: "rounded-(--radius-lg)",
  xl: "rounded-[24px]", // above scale maximum: no token past --radius-xl (20px)
};
const FOOTER_ALIGN: Record<NonNullable<CardFooterProps["align"]>, string> = {
  left: "justify-start",
  right: "justify-end",
  center: "justify-center",
  between: "justify-between",
};

/* ── Standard card (effect=none, default) ────────────────────────────────── */
function StandardCard({
  variant = "default",
  padding = "none",
  radius = "md",
  hoverable = false,
  clickable = false,
  href,
  onClick,
  className,
  style,
  children,
}: CardProps) {
  const base = cn(
    "flex flex-col overflow-hidden transition-[border-color,box-shadow,transform] duration-[180ms]",
    VARIANT_CLS[variant],
    RADIUS_CLS[radius],
    padding !== "none" && PADDING_CLS[padding],
    hoverable &&
      "cursor-pointer hover:-translate-y-px hover:border-patina hover:shadow-[0_4px_20px_-6px_oklch(0%_0_0/0.35)]",
    clickable && "cursor-pointer active:scale-[0.985]",
    className
  );

  if (href) {
    return (
      <a href={href} className={base} style={style} onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}>
        {children}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" className={cn(base, "text-left w-full")} style={style} onClick={onClick}>
        {children}
      </button>
    );
  }
  return (
    <div className={base} style={style}>
      {children}
    </div>
  );
}

/* ── effect=glass (absorbed from GlassCard) ──────────────────────────────── */
function GlassCardImpl({ children, blur = 12, opacity = 0.1, border = true, className, style }: CardProps) {
  return (
    <div
      className={cn("rounded-(--radius-lg) overflow-hidden", className)}
      style={{
        background: `color-mix(in srgb, var(--ks-lacquer-raised) ${Math.round(opacity * 100)}%, transparent)`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: border ? "1px solid color-mix(in srgb, var(--ks-lacquer-raised) 20%, transparent)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── effect=glow (absorbed from GlowCard) ────────────────────────────────── */
function GlowCardImpl({
  children,
  glowColor = "var(--ks-primary)",
  glowSize = 400,
  glowOpacity = 0.14,
  effectRadius = 16,
  effectPadding = 20,
  className,
  style,
}: CardProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--_x", `${x}%`);
    el.style.setProperty("--_y", `${y}%`);
  }, []);

  return (
    <>
      <style>{`
        .gc-root {
          position: relative;
          border-radius: var(--_r, 16px);
          border: 1px solid var(--ks-rule);
          background: var(--ks-lacquer-raised);
          overflow: hidden;
          isolation: isolate;
        }
        .gc-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle var(--_glow-size, 400px) at var(--_x, 50%) var(--_y, 50%),
            var(--_glow-color) 0%,
            transparent 70%
          );
          opacity: var(--_glow-opacity, 0.14);
          pointer-events: none;
          z-index: 0;
        }
        .gc-content { position: relative; z-index: 1; }
      `}</style>
      <div
        ref={rootRef}
        className={cn("gc-root", className)}
        onMouseMove={onMouseMove}
        style={
          {
            "--_r": `${effectRadius}px`,
            "--_glow-color": glowColor,
            "--_glow-size": `${glowSize}px`,
            "--_glow-opacity": glowOpacity,
            ...style,
          } as React.CSSProperties
        }
      >
        <div className="gc-content" style={{ padding: effectPadding }}>
          {children}
        </div>
      </div>
    </>
  );
}

/* ── effect=tilt (absorbed from TiltCard) ────────────────────────────────── */
function TiltCardImpl({
  children,
  maxTilt = 15,
  scale = 1.04,
  perspective = 800,
  glare = true,
  className,
  style,
}: CardProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotX = y * -maxTilt * 2;
    const rotY = x * maxTilt * 2;
    if (innerRef.current) {
      innerRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
    }
    if (glareRef.current) {
      glareRef.current.style.setProperty("--_gx", `${(x + 0.5) * 100}%`);
      glareRef.current.style.setProperty("--_gy", `${(y + 0.5) * 100}%`);
      glareRef.current.style.opacity = "1";
    }
  }

  function handleMouseLeave() {
    if (innerRef.current) innerRef.current.style.transform = "rotateX(0) rotateY(0) scale(1)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  }

  return (
    <div
      className={cn("inline-block cursor-pointer", className)}
      style={{ perspective: `${perspective}px`, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={innerRef}
        className="relative [transform-style:preserve-3d] transition-[transform] duration-100 ease-out rounded-[inherit] overflow-hidden"
      >
        {children}
        {glare && (
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 transition-opacity duration-200"
            style={{
              // no token equivalent: glare highlight must render white regardless of theme, mimicking a light reflection
              background:
                "radial-gradient(circle at var(--_gx,50%) var(--_gy,50%), color-mix(in srgb, white 18%, transparent) 0%, transparent 65%)",
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ── effect=spotlight (absorbed from Spotlight) ──────────────────────────── */
function SpotlightImpl({ children, color = "var(--ks-violet-soft)", size = 300, className, style }: CardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const root = rootRef.current;
    const glow = glowRef.current;
    if (!root || !glow) return;
    const rect = root.getBoundingClientRect();
    glow.style.left = `${e.clientX - rect.left}px`;
    glow.style.top = `${e.clientY - rect.top}px`;
    glow.style.opacity = "1";
  }

  function onMouseLeave() {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }

  return (
    <div
      ref={rootRef}
      className={cn("relative overflow-hidden", className)}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute opacity-0 transition-opacity duration-200 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

/* ── effect=gradient-border (absorbed from GradientBorder) ───────────────── */
const GB_DEFAULT_COLORS = ["var(--ks-violet)", "var(--ks-primary)", "var(--ks-kinpaku)", "var(--ks-rose)"];

function GradientBorderImpl({
  children,
  colors = GB_DEFAULT_COLORS,
  borderWidth = 2,
  borderRadius = 12,
  speed = 3,
  gradientVariant = "spin",
  className,
  style,
}: CardProps) {
  const gradient =
    gradientVariant === "spin"
      ? `conic-gradient(from var(--_angle, 0deg), ${colors.join(", ")})`
      : `linear-gradient(135deg, ${colors.join(", ")})`;

  return (
    <>
      <style>{`
        .gb-wrap { position: relative; display: inline-flex; }
        .gb-border {
          position: absolute; inset: calc(-1 * var(--_bw, 2px));
          border-radius: calc(var(--_r, 12px) + var(--_bw, 2px));
          background: var(--_gradient);
          z-index: 0;
        }
        .gb-border[data-variant="spin"] {
          animation: gb-spin var(--_speed, 3s) linear infinite;
        }
        .gb-border[data-variant="pulse"] {
          animation: gb-pulse var(--_speed, 3s) ease-in-out infinite;
        }
        @keyframes gb-spin { to { --_angle: 360deg; } }
        @property --_angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes gb-pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        .gb-content { position: relative; z-index: 1; background: var(--ks-lacquer-raised); }
      `}</style>
      <div className={cn("gb-wrap", className)} style={{ borderRadius, ...style }}>
        <div
          className="gb-border"
          data-variant={gradientVariant}
          style={
            {
              "--_bw": `${borderWidth}px`,
              "--_r": `${borderRadius}px`,
              "--_gradient": gradient,
              "--_speed": `${speed}s`,
            } as React.CSSProperties
          }
        />
        <div className="gb-content" style={{ borderRadius: borderRadius - borderWidth }}>
          {children}
        </div>
      </div>
    </>
  );
}

/**
 * Card — Super component.
 * `effect` (default `none`) dispatches to the standard card or an absorbed
 * visual effect (glass, glow, tilt, spotlight, gradient-border). The former
 * GlassCard/GlowCard/TiltCard/Spotlight/GradientBorder are now backward-compat
 * wrappers over this component. CardHeader/CardBody/CardFooter are unchanged.
 */
export function Card(props: CardProps) {
  switch (props.effect) {
    case "glass":
      return <GlassCardImpl {...props} />;
    case "glow":
      return <GlowCardImpl {...props} />;
    case "tilt":
      return <TiltCardImpl {...props} />;
    case "spotlight":
      return <SpotlightImpl {...props} />;
    case "gradient-border":
      return <GradientBorderImpl {...props} />;
    default:
      return <StandardCard {...props} />;
  }
}

export function CardHeader({ title, description, icon, badge, action, className }: CardHeaderProps) {
  return (
    // px-5/pt-5 (1.25rem) sit between --spacing-lg (1rem) and --spacing-xl (1.5rem) — no exact token match
    <div className={cn("flex items-start gap-(--spacing-md) px-5 pt-5 pb-0", className)}>
      {icon && (
        <span className="shrink-0 mt-0.5 w-[1.125rem] h-[1.125rem] text-faint [&>svg]:w-full [&>svg]:h-full">
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        {title && <p className="text-body-paragraph font-semibold text-foreground leading-tight">{title}</p>}
        {description && <p className="text-body-callout text-faint mt-[0.2rem] leading-normal">{description}</p>}
      </div>
      {badge && <span className="shrink-0 ml-1">{badge}</span>}
      {action && <span className="shrink-0 ml-1">{action}</span>}
    </div>
  );
}

export function CardBody({ noPadding = false, className, children, style }: CardBodyProps) {
  return (
    <div className={cn(!noPadding && "px-5 py-(--spacing-lg)", className)} style={style}>
      {children}
    </div>
  );
}

export function CardFooter({ align = "right", separator = true, className, style, children }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-(--spacing-sm) px-5 py-(--spacing-lg)",
        separator && "border-t border-rule",
        FOOTER_ALIGN[align],
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
