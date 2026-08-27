"use client";

import React, { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { ButtonProps, ButtonVariant, ButtonSize, ButtonIntent, ButtonRounded } from "./button.types";

/* ── Size scale ── */
const SIZE: Record<ButtonSize, string> = {
  xs: "h-6  px-2   gap-1   text-body-caption",
  sm: "h-8  px-3   gap-1.5 text-body-callout",
  md: "h-9  px-4   gap-2   text-body-callout",
  lg: "h-11 px-5   gap-2   text-body-paragraph",
  xl: "h-14 px-6   gap-2.5 text-body-paragraph",
};

const SIZE_ICON_ONLY: Record<ButtonSize, string> = {
  xs: "h-6  w-6",
  sm: "h-8  w-8",
  md: "h-9  w-9",
  lg: "h-11 w-11",
  xl: "h-14 w-14",
};

const ICON_SIZE: Record<ButtonSize, string> = {
  xs: "w-3   h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4   h-4",
  lg: "w-4   h-4",
  xl: "w-5   h-5",
};

const SIZE_RADIUS: Record<ButtonSize, string> = {
  xs: "rounded-(--radius-sm)",
  sm: "rounded-(--radius-sm)",
  md: "rounded-(--radius-base)",
  lg: "rounded-(--radius-md)",
  xl: "rounded-(--radius-lg)",
};

const ROUNDED_MAP: Record<ButtonRounded, string> = {
  none: "rounded-none",
  sm: "rounded-(--radius-sm)",
  md: "rounded-(--radius-base)",
  lg: "rounded-(--radius-md)",
  xl: "rounded-(--radius-lg)",
  "2xl": "rounded-(--radius-xl)",
  full: "rounded-full",
};

/* ── Intent × Variant matrix ── */
type IntentVariantKey = `${ButtonIntent}/${ButtonVariant}`;

const INTENT_VARIANT: Record<IntentVariantKey, string> = {
  /* primary */
  "primary/solid": "bg-patina text-patina-fg hover:bg-patina-hover border-transparent",
  "primary/outline": "bg-transparent text-patina border-patina hover:bg-patina-soft hover:text-patina-soft-fg",
  "primary/ghost": "bg-transparent text-patina border-transparent hover:bg-patina-soft",
  "primary/soft": "bg-patina-soft text-patina-soft-fg border-transparent hover:bg-patina-soft/80",
  "primary/dashed": "bg-transparent text-patina border-patina border-dashed hover:bg-patina-soft",
  "primary/link": "bg-transparent text-patina border-transparent underline-offset-4 hover:underline px-0 h-auto",

  /* secondary */
  "secondary/solid": "bg-kinpaku text-kinpaku-fg hover:bg-kinpaku-hover border-transparent",
  "secondary/outline": "bg-transparent text-kinpaku border-kinpaku hover:bg-kinpaku-soft",
  "secondary/ghost": "bg-transparent text-kinpaku border-transparent hover:bg-kinpaku-soft",
  "secondary/soft": "bg-kinpaku-soft text-kinpaku-soft-fg border-transparent hover:bg-kinpaku-soft/80",
  "secondary/dashed": "bg-transparent text-kinpaku border-kinpaku border-dashed hover:bg-kinpaku-soft",
  "secondary/link": "bg-transparent text-kinpaku border-transparent underline-offset-4 hover:underline px-0 h-auto",

  /* danger */
  "danger/solid": "bg-danger text-danger-fg hover:bg-danger-hover border-transparent",
  "danger/outline": "bg-transparent text-danger border-danger hover:bg-danger-soft",
  "danger/ghost": "bg-transparent text-danger border-transparent hover:bg-danger-soft",
  "danger/soft": "bg-danger-soft text-danger-soft-fg border-transparent hover:bg-danger-soft/80",
  "danger/dashed": "bg-transparent text-danger border-danger border-dashed hover:bg-danger-soft",
  "danger/link": "bg-transparent text-danger border-transparent underline-offset-4 hover:underline px-0 h-auto",

  /* success */
  "success/solid": "bg-success text-success-fg hover:bg-success-hover border-transparent",
  "success/outline": "bg-transparent text-success border-success hover:bg-success-soft",
  "success/ghost": "bg-transparent text-success border-transparent hover:bg-success-soft",
  "success/soft": "bg-success-soft text-success-soft-fg border-transparent hover:bg-success-soft/80",
  "success/dashed": "bg-transparent text-success border-success border-dashed hover:bg-success-soft",
  "success/link": "bg-transparent text-success border-transparent underline-offset-4 hover:underline px-0 h-auto",

  /* warning */
  "warning/solid": "bg-warning text-warning-fg hover:bg-warning-hover border-transparent",
  "warning/outline": "bg-transparent text-warning border-warning hover:bg-warning-soft",
  "warning/ghost": "bg-transparent text-warning border-transparent hover:bg-warning-soft",
  "warning/soft": "bg-warning-soft text-warning-soft-fg border-transparent hover:bg-warning-soft/80",
  "warning/dashed": "bg-transparent text-warning border-warning border-dashed hover:bg-warning-soft",
  "warning/link": "bg-transparent text-warning border-transparent underline-offset-4 hover:underline px-0 h-auto",

  /* info */
  "info/solid": "bg-info text-info-fg hover:bg-info-hover border-transparent",
  "info/outline": "bg-transparent text-info border-info hover:bg-info-soft",
  "info/ghost": "bg-transparent text-info border-transparent hover:bg-info-soft",
  "info/soft": "bg-info-soft text-info-soft-fg border-transparent hover:bg-info-soft/80",
  "info/dashed": "bg-transparent text-info border-info border-dashed hover:bg-info-soft",
  "info/link": "bg-transparent text-info border-transparent underline-offset-4 hover:underline px-0 h-auto",

  /* neutral */
  "neutral/solid": "bg-neutral text-neutral-fg hover:bg-neutral-hover border-transparent",
  "neutral/outline": "bg-transparent text-foreground border-rule hover:bg-raised",
  "neutral/ghost": "bg-transparent text-muted border-transparent hover:bg-raised hover:text-foreground",
  "neutral/soft": "bg-raised text-foreground border-rule hover:bg-graphite",
  "neutral/dashed": "bg-transparent text-muted border-rule border-dashed hover:bg-raised hover:text-foreground",
  "neutral/link":
    "bg-transparent text-muted border-transparent underline-offset-4 hover:underline hover:text-foreground px-0 h-auto",
};

/* ── Status icons ── */
function SpinnerIcon({ cls }: { cls: string }) {
  return (
    <span
      className={cn(
        "border-[1.5px] border-current border-t-transparent rounded-full shrink-0 animate-spin-btn motion-reduce:animate-none",
        cls
      )}
      aria-hidden="true"
    />
  );
}

function CheckIcon({ cls }: { cls: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0 animate-status-in", cls)}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ErrorIcon({ cls }: { cls: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0 animate-status-err", cls)}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}

/* ── State layer: all states stack in one grid cell (stable width) and crossfade ── */
function StateLayer({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span
      aria-hidden={!active}
      className={cn(
        "[grid-area:1/1] inline-flex items-center justify-center gap-[0.45em] whitespace-nowrap",
        "transition-[opacity,transform,filter] duration-200 ease-out motion-reduce:transition-none",
        active ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-[0.4em] blur-[1px] pointer-events-none"
      )}
    >
      {children}
    </span>
  );
}

const BaseButton = React.forwardRef<HTMLButtonElement, ButtonProps>(function BaseButton(
  {
    variant = "solid",
    size = "md",
    intent = "primary",
    loading = false,
    status: statusProp,
    successText,
    errorText,
    loadingText,
    loadingPosition = "left",
    iconLeft,
    iconRight,
    iconOnly = false,
    fullWidth = false,
    rounded,
    disabled,
    className,
    children,
    onClick,
    as: Root = "button",
    // Absorbed-effect props are consumed by the Super dispatcher — strip them here
    // so they never leak onto the DOM element.
    effect: _effect,
    magneticStrength: _magneticStrength,
    magneticRadius: _magneticRadius,
    particleCount: _particleCount,
    spread: _spread,
    confirm: _confirm,
    confirmLabel: _confirmLabel,
    holdDuration: _holdDuration,
    resetDelay: _resetDelay,
    ...props
  }: ButtonProps,
  ref
) {
  const [internalStatus, setInternalStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const status = statusProp ?? internalStatus;
  const isLoading = loading || status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";
  const isIdle = !isLoading && !isSuccess && !isError;
  const isBusy = isLoading || isSuccess || isError;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!onClick || statusProp !== undefined) {
        (onClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
        return;
      }
      const result = (onClick as (e: React.MouseEvent<HTMLButtonElement>) => unknown)(e);
      if (result instanceof Promise) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setInternalStatus("loading");
        result
          .then(() => {
            setInternalStatus("success");
            timeoutRef.current = setTimeout(() => setInternalStatus("idle"), 2000);
          })
          .catch(() => {
            setInternalStatus("error");
            timeoutRef.current = setTimeout(() => setInternalStatus("idle"), 2000);
          });
      }
    },
    [onClick, statusProp]
  );

  const key = `${intent}/${variant}` as IntentVariantKey;
  const intentCls = INTENT_VARIANT[key] ?? INTENT_VARIANT["neutral/solid"];
  const radiusCls = rounded ? ROUNDED_MAP[rounded] : SIZE_RADIUS[size];
  const iconSizeCls = ICON_SIZE[size];

  /* Error state overrides button colors to danger */
  const errorOverrideCls = isError
    ? variant === "outline" || variant === "ghost" || variant === "dashed"
      ? "!bg-danger-soft !border-danger !text-danger"
      : "!bg-danger !border-transparent !text-danger-fg shadow-[0_4px_16px_-3px_color-mix(in_oklch,var(--ks-danger)_45%,transparent)]"
    : "";

  /* Stateful buttons (declared loading/status/success/error) reserve width across
     every state via a grid stack → button size never changes when the label swaps,
     and each state crossfades smoothly. */
  const reserve = loading || statusProp !== undefined || successText !== undefined || errorText !== undefined;

  const rootProps = {
    ...props,
    disabled: disabled || undefined,
    "data-status": status !== "idle" ? status : undefined,
    "aria-busy": isLoading || undefined,
    "aria-disabled": disabled || isBusy || undefined,
    onClick: handleClick,
    className: cn(
      reserve ? "inline-grid place-items-center" : "inline-flex items-center justify-center",
      "font-medium border relative overflow-hidden",
      "transition-[background-color,color,border-color,box-shadow,transform] duration-150 select-none cursor-pointer",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina",
      "active:scale-[0.98]",
      "disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100",
      // status states block interaction WITHOUT dimming — animation stays fully visible
      isBusy && "pointer-events-none active:scale-100",
      iconOnly ? SIZE_ICON_ONLY[size] : SIZE[size],
      radiusCls,
      intentCls,
      errorOverrideCls,
      fullWidth && "w-full",
      className
    ),
  };

  const idleContent = (
    <>
      {iconLeft && (
        <span aria-hidden="true" className={cn("shrink-0", iconSizeCls)}>
          {iconLeft}
        </span>
      )}
      {!iconOnly && children && <span className="truncate">{children}</span>}
      {iconRight && (
        <span aria-hidden="true" className={cn("shrink-0", iconSizeCls)}>
          {iconRight}
        </span>
      )}
    </>
  );

  if (!reserve) {
    return (
      <Root ref={ref} {...rootProps}>
        {idleContent}
      </Root>
    );
  }

  return (
    <Root ref={ref} {...rootProps}>
      <StateLayer active={isIdle}>{idleContent}</StateLayer>

      <StateLayer active={isLoading}>
        <SpinnerIcon cls={iconSizeCls} />
        {!iconOnly && loadingPosition === "left" && <span>{loadingText ?? children}</span>}
      </StateLayer>

      <StateLayer active={isSuccess}>
        <CheckIcon key={isSuccess ? "on" : "off"} cls={iconSizeCls} />
        {!iconOnly && successText && <span>{successText}</span>}
      </StateLayer>

      <StateLayer active={isError}>
        <ErrorIcon key={isError ? "on" : "off"} cls={iconSizeCls} />
        {!iconOnly && errorText && <span>{errorText}</span>}
      </StateLayer>
    </Root>
  );
});

BaseButton.displayName = "Button";

/* ── Absorbed: MagneticButton (effect="magnetic") ──────────────────────────
   Verbatim physics from magnetic-button/MagneticButton.tsx. Wraps BaseButton
   in a <span> that translates the button toward the cursor within `radius`. */
const MagneticImpl = React.forwardRef<HTMLButtonElement, ButtonProps>(function MagneticImpl(
  { magneticStrength = 0.4, magneticRadius = 80, disabled = false, className, style, children, onClick, ...rest },
  ref
) {
  const innerRef = useRef<HTMLButtonElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement);

  const strength = magneticStrength;
  const radius = magneticRadius;

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = innerRef.current;
      if (!el || disabled) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius) {
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      }
    },
    [strength, radius, disabled]
  );

  const onMouseLeave = useCallback(() => {
    if (innerRef.current) innerRef.current.style.transform = "translate(0, 0)";
  }, []);

  return (
    <span className={cn("inline-flex", className)} style={style} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <BaseButton
        ref={innerRef}
        disabled={disabled}
        onClick={onClick}
        className="![transition:background-color,border-color,color,transform_150ms_cubic-bezier(0.2,0.8,0.4,1)]"
        {...rest}
      >
        {children}
      </BaseButton>
    </span>
  );
});
MagneticImpl.displayName = "Button.Magnetic";

/* ── Absorbed: ConfettiButton (effect="confetti") ──────────────────────────
   Verbatim canvas burst from confetti-button/ConfettiButton.tsx. */
// Canvas 2D fillStyle requires raw hex strings — CSS vars not supported in canvas context
const CONFETTI_COLORS = ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#1dd1a1"];

const ConfettiImpl = React.forwardRef<HTMLButtonElement, ButtonProps>(function ConfettiImpl(
  { particleCount = 60, spread = 120, disabled = false, className, style, children, onClick, ...rest },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const fire = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = 200,
      H = 200;
    canvas.width = W;
    canvas.height = H;

    const particles = Array.from({ length: particleCount }, () => ({
      x: W / 2,
      y: H / 2,
      vx: (Math.random() - 0.5) * spread * 0.06,
      vy: -(Math.random() * spread * 0.04 + 2),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 7 + 3,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
      life: 1,
      decay: Math.random() * 0.015 + 0.01,
    }));

    cancelAnimationFrame(animRef.current);

    function draw() {
      const ctx = canvas!.getContext("2d")!;
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.rot += p.rotV;
        p.life -= p.decay;
        if (p.life <= 0) continue;
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.min(p.life, 1);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        ctx.restore();
      }
      if (alive) animRef.current = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, W, H);
    }
    draw();
  }, [particleCount, spread]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      fire();
      (onClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
    },
    [fire, onClick]
  );

  return (
    <span className={cn("relative inline-flex", className)} style={style}>
      <BaseButton ref={ref} disabled={disabled} onClick={handleClick} {...rest}>
        {children}
      </BaseButton>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute -top-[100px] -left-[75px] z-50"
        width={200}
        height={200}
        style={{ mixBlendMode: "normal" }}
      />
    </span>
  );
});
ConfettiImpl.displayName = "Button.Confetti";

/* ── Absorbed: ConfirmButton (confirm="doubleclick" | "hold") ──────────────
   Verbatim interaction from confirm-button/ConfirmButton.tsx, re-skinned onto
   BaseButton so the confirm gesture inherits the full Button visual system.
   The original ConfirmButton uses raw <button> markup; the wrapper preserves
   that exact DOM/visual (see ConfirmButton.tsx). Here we layer the gesture on
   top of BaseButton — onClick only fires after confirmation. */
const ConfirmImpl = React.forwardRef<HTMLButtonElement, ButtonProps>(function ConfirmImpl(
  {
    confirm = "doubleclick",
    confirmLabel = "Click again to confirm",
    holdDuration = 800,
    resetDelay = 2000,
    children,
    onClick,
    className,
    ...rest
  },
  ref
) {
  const mode = confirm;
  const [confirming, setConfirming] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const holdStart = useRef<number | null>(null);

  const clearReset = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  };

  const scheduleReset = useCallback(() => {
    clearReset();
    resetTimer.current = setTimeout(() => setConfirming(false), resetDelay);
  }, [resetDelay]);

  const fire = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      (onClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
    },
    [onClick]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (mode !== "doubleclick") return;
      if (!confirming) {
        setConfirming(true);
        scheduleReset();
      } else {
        clearReset();
        setConfirming(false);
        fire(e);
      }
    },
    [mode, confirming, scheduleReset, fire]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (mode !== "hold") return;
      holdStart.current = performance.now();
      const tick = () => {
        if (holdStart.current === null) return;
        const elapsed = performance.now() - holdStart.current;
        const progress = Math.min(elapsed / holdDuration, 1);
        setHoldProgress(progress);
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          holdStart.current = null;
          setHoldProgress(0);
          fire(e);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [mode, holdDuration, fire]
  );

  const handleMouseUp = useCallback(() => {
    if (mode !== "hold") return;
    holdStart.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setHoldProgress(0);
  }, [mode]);

  const label = mode === "doubleclick" && confirming ? confirmLabel : children;

  return (
    <BaseButton
      ref={ref}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={cn(confirming && "ring-2 ring-current ring-offset-1", className)}
      {...rest}
    >
      {label}
      {mode === "hold" && holdProgress > 0 && (
        <span
          className="absolute inset-y-0 left-0 bg-current/20 pointer-events-none transition-none"
          style={{ width: `${holdProgress * 100}%` }}
        />
      )}
    </BaseButton>
  );
});
ConfirmImpl.displayName = "Button.Confirm";

/**
 * Button — Super component.
 * Renders the base button by default. `effect` selects an absorbed physics/visual
 * behavior (magnetic | confetti) and `confirm` requires a confirmation gesture
 * (doubleclick | hold) before firing onClick. With neither, the original base
 * render path is used unchanged.
 *
 * Absorbs the former MagneticButton, ConfettiButton and ConfirmButton
 * (now backward-compat wrappers).
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  if (props.confirm) return <ConfirmImpl ref={ref} {...props} />;
  if (props.effect === "magnetic") return <MagneticImpl ref={ref} {...props} />;
  if (props.effect === "confetti") return <ConfettiImpl ref={ref} {...props} />;
  return <BaseButton ref={ref} {...props} />;
});
Button.displayName = "Button";
