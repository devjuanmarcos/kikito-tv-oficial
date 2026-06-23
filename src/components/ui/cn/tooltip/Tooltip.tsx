"use client";
import type React from "react";
import { useState, useRef, cloneElement, useEffect, Children } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

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
  content: React.ReactNode;
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

/* ════════════════════════════════════════════════════════════════════════
 * Shared positioning (absorbed verbatim from Tooltip + Popover)
 * ════════════════════════════════════════════════════════════════════════ */
function getPos(trigger: DOMRect, tip: DOMRect, placement: TooltipPlacement, gap = 8) {
  let top = 0,
    left = 0;
  const { top: tT, bottom: tB, left: tL, right: tR, width: tW, height: tH } = trigger;
  const { width: pW, height: pH } = tip;

  switch (placement) {
    case "top":
      top = tT - pH - gap;
      left = tL + tW / 2 - pW / 2;
      break;
    case "top-start":
      top = tT - pH - gap;
      left = tL;
      break;
    case "top-end":
      top = tT - pH - gap;
      left = tR - pW;
      break;
    case "bottom":
      top = tB + gap;
      left = tL + tW / 2 - pW / 2;
      break;
    case "bottom-start":
      top = tB + gap;
      left = tL;
      break;
    case "bottom-end":
      top = tB + gap;
      left = tR - pW;
      break;
    case "left":
      top = tT + tH / 2 - pH / 2;
      left = tL - pW - gap;
      break;
    case "right":
      top = tT + tH / 2 - pH / 2;
      left = tR + gap;
      break;
  }

  // keep in viewport
  const vW = window.innerWidth,
    vH = window.innerHeight;
  left = Math.max(8, Math.min(left, vW - pW - 8));
  top = Math.max(8, Math.min(top, vH - pH - 8));

  return { top, left };
}

/* Hover/context-card positioning (side + align), absorbed verbatim from HoverCard. */
function getCardPos(trigger: DOMRect, card: DOMRect, side: HoverCardSide, align: HoverCardAlign) {
  const GAP = 8;
  let top = 0,
    left = 0;
  const { top: tT, bottom: tB, left: tL, right: tR, width: tW, height: tH } = trigger;
  const { width: cW, height: cH } = card;

  if (side === "top" || side === "bottom") {
    top = side === "top" ? tT - cH - GAP : tB + GAP;
    left = align === "start" ? tL : align === "end" ? tR - cW : tL + tW / 2 - cW / 2;
  } else {
    left = side === "left" ? tL - cW - GAP : tR + GAP;
    top = align === "start" ? tT : align === "end" ? tB - cH : tT + tH / 2 - cH / 2;
  }

  const vW = window.innerWidth,
    vH = window.innerHeight;
  return {
    top: Math.max(8, Math.min(top, vH - cH - 8)),
    left: Math.max(8, Math.min(left, vW - cW - 8)),
  };
}

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
    className="w-3.5 h-3.5"
  >
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

/* ════════════════════════════════════════════════════════════════════════
 * Simple hover/focus tooltip — base render (absorbed verbatim from Tooltip)
 * ════════════════════════════════════════════════════════════════════════ */
function SimpleTooltip({ content, placement = "top", delay = 300, disabled = false, children }: TooltipSimpleProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<Element>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  function show() {
    if (disabled) return;
    timer.current = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => {
        if (!triggerRef.current || !tipRef.current) return;
        const tRect = triggerRef.current.getBoundingClientRect();
        const pRect = tipRef.current.getBoundingClientRect();
        setPos(getPos(tRect, pRect, placement));
      });
    }, delay);
  }

  function hide() {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  }

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const trigger = cloneElement(Children.only(children), {
    ref: triggerRef,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
  });

  if (typeof document === "undefined") return trigger;

  return (
    <>
      {trigger}
      {createPortal(
        <div
          ref={tipRef}
          role="tooltip"
          className={cn(
            "fixed z-[2000] pointer-events-none",
            "max-w-[260px] px-2.5 py-1.5 text-body-caption",
            "bg-foreground text-base rounded-[5px] shadow-[0_4px_16px_-4px_oklch(0%_0_0/0.5)]",
            "transition-[opacity,transform] duration-[140ms]",
            visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.95]"
          )}
          style={{ top: pos.top, left: pos.left }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * Rich tooltip — title/icon/action (absorbed verbatim from RichTooltip)
 * ════════════════════════════════════════════════════════════════════════ */
function RichTooltipImpl({
  title,
  content,
  icon,
  action,
  placement = "top",
  maxWidth = 240,
  children,
  className,
}: TooltipRichProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`
        .rt-wrap { position: relative; display: inline-flex; }
        .rt-bubble {
          position: absolute; z-index: 50;
          pointer-events: none; opacity: 0;
          transform: scale(0.95) translateY(4px);
          transition: opacity 0.15s, transform 0.15s;
        }
        .rt-bubble[data-open="true"] {
          opacity: 1; transform: scale(1) translateY(0); pointer-events: auto;
        }
        .rt-bubble[data-placement="top"]    { bottom: calc(100% + 8px); left: 50%; translate: -50% 0; }
        .rt-bubble[data-placement="bottom"] { top: calc(100% + 8px); left: 50%; translate: -50% 0; }
        .rt-bubble[data-placement="left"]   { right: calc(100% + 8px); top: 50%; translate: 0 -50%; }
        .rt-bubble[data-placement="right"]  { left: calc(100% + 8px); top: 50%; translate: 0 -50%; }
      `}</style>
      <span
        className={cn("rt-wrap", className)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {cloneElement(children)}
        <span
          className="rt-bubble bg-raised border border-rule rounded-[--radius] shadow-lg p-3 flex flex-col gap-2"
          data-open={open}
          data-placement={placement}
          style={{ maxWidth }}
          role="tooltip"
        >
          {(title || icon) && (
            <div className="flex items-center gap-2">
              {icon && <span className="text-patina shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>}
              {title && <span className="text-body-callout font-semibold text-foreground leading-snug">{title}</span>}
            </div>
          )}
          <div className="text-body-callout text-muted leading-relaxed">{content}</div>
          {action && (
            <button
              className="text-body-callout text-patina font-semibold text-left hover:underline bg-transparent border-none p-0 cursor-pointer font-[inherit]"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          )}
        </span>
      </span>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * Popover — click trigger, title/description/footer/close
 *   (absorbed verbatim from Popover)
 * ════════════════════════════════════════════════════════════════════════ */
interface PopoverImplProps {
  content?: React.ReactNode;
  placement?: PopoverPlacement;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  showClose?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactElement;
}

function PopoverImpl({
  content,
  placement = "bottom",
  title,
  description,
  footer,
  showClose = true,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: PopoverImplProps) {
  const isControlled = openProp !== undefined;
  const [internal, setInternal] = useState(defaultOpen);
  const open = isControlled ? openProp : internal;
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [ready, setReady] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  function setOpen(v: boolean) {
    if (!isControlled) setInternal(v);
    onOpenChange?.(v);
  }

  useEffect(() => {
    if (!open) {
      setReady(false);
      return;
    }
    requestAnimationFrame(() => {
      if (!triggerRef.current || !popRef.current) return;
      const tRect = triggerRef.current.getBoundingClientRect();
      const pRect = popRef.current.getBoundingClientRect();
      setPos(getPos(tRect, pRect, placement));
      setReady(true);
    });
  }, [open, placement]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        popRef.current &&
        !popRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      )
        setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const trigger = cloneElement(Children.only(children), {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      setOpen(!open);
      children.props.onClick?.(e);
    },
  });

  const hasHeader = title || description;

  if (typeof document === "undefined") return trigger;

  return (
    <>
      {trigger}
      {open &&
        createPortal(
          <div
            ref={popRef}
            role="dialog"
            aria-modal="false"
            className={cn(
              "fixed z-[1100] min-w-[200px] max-w-[340px]",
              "bg-raised border border-rule rounded-(--radius-lg)",
              "shadow-[0_12px_40px_-8px_oklch(0%_0_0/0.35),0_0_0_1px_oklch(0%_0_0/0.06)]",
              "transition-[opacity,transform] duration-[140ms]",
              ready ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
            )}
            style={{ top: pos.top, left: pos.left }}
          >
            {hasHeader && (
              <div className={cn("flex items-start gap-2 px-4 pt-4", content || footer ? "pb-2" : "pb-4")}>
                <div className="flex-1 min-w-0">
                  {title && <p className="text-body-callout font-semibold text-foreground leading-tight">{title}</p>}
                  {description && <p className="text-body-caption text-faint mt-0.5 leading-[1.5]">{description}</p>}
                </div>
                {showClose && (
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                    className="shrink-0 mt-0.5 p-0.5 rounded text-faint hover:text-foreground hover:bg-graphite transition-colors"
                  >
                    <XIcon />
                  </button>
                )}
              </div>
            )}

            {content && (
              <div className={cn("px-4", hasHeader ? "pt-0 pb-3" : "pt-4 pb-3", !footer && "pb-4")}>{content}</div>
            )}

            {footer && (
              <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-rule">{footer}</div>
            )}

            {!hasHeader && !content && !footer && (
              <div className="relative px-4 py-4">
                {showClose && (
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                    className="absolute top-2 right-2 p-0.5 rounded text-faint hover:text-foreground hover:bg-graphite transition-colors"
                  >
                    <XIcon />
                  </button>
                )}
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * Hover/context preview card — hover trigger, portal, side/align + delays
 *   (absorbed verbatim from HoverCard)
 * ════════════════════════════════════════════════════════════════════════ */
function HoverCardImpl({
  content,
  side = "bottom",
  align = "center",
  openDelay = 300,
  closeDelay = 150,
  children,
  className,
  style,
}: TooltipCardProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [ready, setReady] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(null);

  function scheduleOpen() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => {
      setVisible(true);
      setReady(false);
      requestAnimationFrame(() => {
        if (!triggerRef.current || !cardRef.current) return;
        const tRect = triggerRef.current.getBoundingClientRect();
        const cRect = cardRef.current.getBoundingClientRect();
        setPos(getCardPos(tRect, cRect, side, align));
        setReady(true);
      });
    }, openDelay);
  }

  function scheduleClose() {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setVisible(false), closeDelay);
  }

  useEffect(
    () => () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  const trigger = cloneElement(Children.only(children), {
    ref: triggerRef,
    onMouseEnter: scheduleOpen,
    onMouseLeave: scheduleClose,
    onFocus: scheduleOpen,
    onBlur: scheduleClose,
  });

  if (typeof document === "undefined") return trigger;

  return (
    <>
      {trigger}
      {visible &&
        createPortal(
          <div
            ref={cardRef}
            role="tooltip"
            className={cn(
              "fixed z-[1050] min-w-[160px] max-w-[300px] p-3",
              "bg-raised border border-rule rounded-(--radius-md)",
              "shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.35),0_0_0_1px_oklch(0%_0_0/0.06)]",
              "transition-[opacity,transform] duration-[140ms]",
              ready ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
            )}
            style={{ top: pos.top, left: pos.left, ...style }}
            onMouseEnter={scheduleOpen}
            onMouseLeave={scheduleClose}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}

/**
 * Tooltip — Super component.
 * Dispatches by discriminators:
 *  - `variant='rich'`            → rich tooltip (title/icon/action), hover anchored.
 *  - `variant='card'`            → hover/context preview card (portal, side/align, delays).
 *  - `variant='simple'` (default):
 *      - `trigger='click'`       → popover panel (title/description/footer/close).
 *      - `trigger='hover'|'focus'` (default) → simple hover/focus tooltip.
 * Absorbs the former RichTooltip, Popover, HoverCard and ContextCard
 * (now backward-compat wrappers).
 */
export function Tooltip(props: TooltipProps) {
  if (props.variant === "rich") return <RichTooltipImpl {...props} />;
  if (props.variant === "card") return <HoverCardImpl {...props} />;
  if (props.trigger === "click") {
    const { content, placement, title, description, footer, showClose, open, defaultOpen, onOpenChange, children } =
      props;
    return (
      <PopoverImpl
        content={content}
        placement={placement}
        title={title}
        description={description}
        footer={footer}
        showClose={showClose}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        {children}
      </PopoverImpl>
    );
  }
  return <SimpleTooltip {...props} />;
}
