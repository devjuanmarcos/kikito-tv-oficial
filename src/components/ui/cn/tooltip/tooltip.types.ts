import type React from "react";

export type TooltipPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "right";

/** Trigger interaction mode for the Super Tooltip. */
export type TooltipTrigger = "hover" | "click" | "focus";
/** Visual variant for the Super Tooltip. */
export type TooltipVariant = "simple" | "rich" | "card";

/* ── Rich-tooltip placement (subset, anchored CSS positioning) ───────────── */
export type RichTooltipPlacement = "top" | "bottom" | "left" | "right";
/* ── Hover/context card placement primitives ─────────────────────────────── */
export type HoverCardSide = "top" | "bottom" | "left" | "right";
export type HoverCardAlign = "start" | "center" | "end";
/* ── Popover placement (full 8-way) ──────────────────────────────────────── */
export type PopoverPlacement = TooltipPlacement;

interface TooltipBase {
  /** Element that triggers the floating content (must forward ref). */
  children: React.ReactElement;
}

export interface TooltipSimpleProps extends TooltipBase {
  variant?: "simple";
  /** 'hover' (default) and 'focus' share the same hover-tooltip behavior; 'click' dispatches to the Popover render. */
  trigger?: "hover" | "focus" | "click";
  /** Required for trigger='hover'/'focus'; optional for trigger='click' (Popover render can rely on title/description/footer alone). */
  content?: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  disabled?: boolean;

  /* ── Popover-only fields (trigger='click') ─────────────────────────────── */
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  showClose?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface TooltipRichProps extends TooltipBase {
  variant: "rich";
  title?: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
  placement?: RichTooltipPlacement;
  maxWidth?: number;
  className?: string;
}

export interface TooltipCardProps extends TooltipBase {
  variant: "card";
  content: React.ReactNode;
  side?: HoverCardSide;
  align?: HoverCardAlign;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export type TooltipProps = TooltipSimpleProps | TooltipRichProps | TooltipCardProps;
