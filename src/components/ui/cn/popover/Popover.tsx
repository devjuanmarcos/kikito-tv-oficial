"use client";
import type React from "react";
import { useState, useRef, useEffect, cloneElement, Children } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export type PopoverPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "right";

export interface PopoverProps {
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

const GAP = 8;

function getPos(trigger: DOMRect, pop: DOMRect, placement: PopoverPlacement) {
  let top = 0,
    left = 0;
  const { top: tT, bottom: tB, left: tL, right: tR, width: tW, height: tH } = trigger;
  const { width: pW, height: pH } = pop;

  switch (placement) {
    case "top":
      top = tT - pH - GAP;
      left = tL + tW / 2 - pW / 2;
      break;
    case "top-start":
      top = tT - pH - GAP;
      left = tL;
      break;
    case "top-end":
      top = tT - pH - GAP;
      left = tR - pW;
      break;
    case "bottom":
      top = tB + GAP;
      left = tL + tW / 2 - pW / 2;
      break;
    case "bottom-start":
      top = tB + GAP;
      left = tL;
      break;
    case "bottom-end":
      top = tB + GAP;
      left = tR - pW;
      break;
    case "left":
      top = tT + tH / 2 - pH / 2;
      left = tL - pW - GAP;
      break;
    case "right":
      top = tT + tH / 2 - pH / 2;
      left = tR + GAP;
      break;
  }

  const vW = window.innerWidth,
    vH = window.innerHeight;
  left = Math.max(8, Math.min(left, vW - pW - 8));
  top = Math.max(8, Math.min(top, vH - pH - 8));
  return { top, left };
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

export function Popover({
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
}: PopoverProps) {
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
  }, [open]);

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
