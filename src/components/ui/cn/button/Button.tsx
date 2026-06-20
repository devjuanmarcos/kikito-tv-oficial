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

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
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

Button.displayName = "Button";
