"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/cn/button";
import type { ButtonIntent } from "@/components/ui/cn/button";
import { cn } from "@/lib/utils";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

/* ── Absorbed variant types ─────────────────────────────────────────────── */
export type AlertDialogIntent = "danger" | "warning" | "primary";
export type DrawerSide = "right" | "left" | "bottom" | "top";
export type DrawerSize = "sm" | "md" | "lg" | "xl";

export type ModalVariant = "modal" | "alert" | "drawer" | "panel";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  hideClose?: boolean;
  className?: string;
  /** Selects render family. Default `modal`. */
  variant?: ModalVariant;

  /* ── alert variant extras ── */
  intent?: AlertDialogIntent;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  style?: React.CSSProperties;

  /* ── drawer variant extras ── */
  side?: DrawerSide;
  /** Drawer-specific size scale (sm|md|lg|xl). Falls back to `size` semantics. */
  drawerSize?: DrawerSize;
  footer?: React.ReactNode;
  footerAlign?: "left" | "right" | "center" | "between";

  /* ── panel variant extras ── */
  panel?: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  panelSide?: "left" | "right";
  panelWidth?: number;
  collapsedWidth?: number;
}

export interface ModalBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  children?: React.ReactNode;
  align?: "left" | "right" | "center" | "between";
  className?: string;
}

const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

const SIZE_CLS: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]",
};
const FOOTER_ALIGN: Record<NonNullable<ModalFooterProps["align"]>, string> = {
  left: "justify-start",
  right: "justify-end",
  center: "justify-center",
  between: "justify-between",
};

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── modal variant (default, base render verbatim) ───────────────────────── */
function ModalDialog({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeOnOverlay = true,
  closeOnEscape = true,
  hideClose = false,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const el = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    el?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, closeOnEscape, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <style>{`
        .ks-modal-overlay { transition: opacity 0.18s; }
        .ks-modal-overlay[data-open="false"] { opacity: 0; pointer-events: none; }
        .ks-modal-panel { transition: opacity 0.22s, transform 0.22s cubic-bezier(0.4,0,0.2,1); }
        .ks-modal-panel[data-open="false"] { opacity: 0; transform: scale(0.96) translateY(8px); pointer-events: none; }
      `}</style>
      <div>
        <div
          className="fixed inset-0 bg-black/55 z-[1200] ks-modal-overlay"
          data-open={String(open)}
          onClick={closeOnOverlay ? onClose : undefined}
          aria-hidden="true"
        />
        <div className="fixed inset-0 z-[1201] flex items-center justify-center p-4 pointer-events-none">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            data-open={String(open)}
            className={cn(
              "pointer-events-auto bg-base border border-rule rounded-(--radius-md) shadow-[0_20px_60px_-16px_oklch(0%_0_0/0.55)] flex flex-col w-full outline-none ks-modal-panel",
              SIZE_CLS[size],
              size === "full" && "overflow-hidden",
              className
            )}
          >
            {(title || description || !hideClose) && (
              <div className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-rule shrink-0">
                <div className="flex-1 min-w-0">
                  {title && <p className="text-body-paragraph font-bold text-foreground">{title}</p>}
                  {description && <p className="text-body-callout text-faint mt-1 leading-[1.45]">{description}</p>}
                </div>
                {!hideClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 inline-flex bg-transparent border-none cursor-pointer p-1 rounded-sm text-faint hover:text-foreground hover:bg-graphite-2 transition-[color,background] duration-[120ms] [&>svg]:w-[1.125rem] [&>svg]:h-[1.125rem]"
                    aria-label="Close"
                  >
                    <XIcon />
                  </button>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

/* ── alert variant (absorbed from AlertDialog, verbatim render) ──────────── */
const ALERT_ICON_CLS: Record<string, string> = {
  danger: "bg-[color-mix(in_srgb,var(--ks-danger)_12%,transparent)] text-danger",
  warning: "bg-[color-mix(in_srgb,var(--ks-warning)_12%,transparent)] text-warning",
  primary: "bg-[color-mix(in_srgb,var(--ks-primary)_12%,transparent)] text-patina",
};

const AlertDangerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const AlertPrimaryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function ModalAlert({
  open,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  intent = "danger",
  loading = false,
  className,
  style,
}: ModalProps) {
  const onOpenChange = (next: boolean) => {
    if (!next) onClose();
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="alert-dialog-overlay"
          className="fixed inset-0 bg-black/55 flex items-center justify-center z-[9999] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCancel();
          }}
        >
          <motion.div
            key="alert-dialog-panel"
            className={cn(
              "bg-raised border border-rule rounded-[12px] p-6 w-full max-w-[440px] shadow-[0_20px_60px_color-mix(in_srgb,black_35%,transparent)]",
              className
            )}
            style={style}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="ad-title"
            aria-describedby={description ? "ad-desc" : undefined}
            initial={{ opacity: 0, scale: 0.92, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -16 }}
            transition={{ type: "spring", stiffness: 150, damping: 25 }}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-md flex items-center justify-center mb-4 [&>svg]:w-5 [&>svg]:h-5",
                ALERT_ICON_CLS[intent]
              )}
            >
              {intent === "primary" ? <AlertPrimaryIcon /> : <AlertDangerIcon />}
            </div>
            <p className="text-body-paragraph font-bold mb-2 text-foreground" id="ad-title">
              {title}
            </p>
            {description && (
              <p className="text-body-callout leading-relaxed text-muted mb-6" id="ad-desc">
                {description}
              </p>
            )}
            <div className="flex gap-2 justify-end">
              <Button intent="neutral" variant="outline" size="sm" onClick={handleCancel} disabled={loading}>
                {cancelLabel}
              </Button>
              <Button intent={intent as ButtonIntent} variant="solid" size="sm" loading={loading} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ── drawer variant (absorbed from Drawer, verbatim render) ──────────────── */
const DRAWER_SIDE_CLS: Record<DrawerSide, string> = {
  right: "top-0 right-0 bottom-0 border-l border-rule shadow-[-8px_0_40px_-8px_oklch(0%_0_0/0.40)]",
  left: "top-0 left-0 bottom-0 border-r border-rule shadow-[8px_0_40px_-8px_oklch(0%_0_0/0.40)]",
  bottom: "left-0 right-0 bottom-0 border-t border-rule rounded-t-[14px] shadow-[0_-8px_40px_-8px_oklch(0%_0_0/0.40)]",
  top: "left-0 right-0 top-0 border-b border-rule rounded-b-[14px] shadow-[0_8px_40px_-8px_oklch(0%_0_0/0.40)]",
};

const DRAWER_SLIDE_IN: Record<DrawerSide, string> = {
  right: "translate-x-full",
  left: "-translate-x-full",
  bottom: "translate-y-full",
  top: "-translate-y-full",
};

const DRAWER_HORIZONTAL_SIZE: Record<DrawerSize, string> = {
  sm: "w-80",
  md: "w-[420px]",
  lg: "w-[560px]",
  xl: "w-[720px]",
};
const DRAWER_VERTICAL_SIZE: Record<DrawerSize, string> = {
  sm: "max-h-[30vh]",
  md: "max-h-[50vh]",
  lg: "max-h-[70vh]",
  xl: "max-h-[90vh]",
};

function drawerSizeCls(side: DrawerSide, size: DrawerSize) {
  return side === "left" || side === "right" ? DRAWER_HORIZONTAL_SIZE[size] : DRAWER_VERTICAL_SIZE[size];
}

const DRAWER_FOOTER_ALIGN = {
  right: "justify-end",
  left: "justify-start",
  center: "justify-center",
  between: "justify-between",
};

function ModalDrawer({
  open,
  onClose,
  side = "right",
  drawerSize = "md",
  title,
  description,
  hideClose = false,
  closeOnOverlay = true,
  closeOnEscape = true,
  footer,
  footerAlign = "right",
  className,
  children,
}: ModalProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const size: DrawerSize = drawerSize;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const el = drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    el?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, closeOnEscape, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <style>{`
        .dr-overlay { transition: opacity 0.18s; }
        .dr-overlay[data-open="false"] { opacity: 0; pointer-events: none; }
        .dr-panel { transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); }
      `}</style>
      <div>
        <div
          className="fixed inset-0 bg-black/55 z-[1100] dr-overlay"
          data-open={String(open)}
          onClick={closeOnOverlay ? onClose : undefined}
          aria-hidden="true"
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className={cn(
            "fixed z-[1101] bg-base flex flex-col outline-none overflow-hidden dr-panel",
            "transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            DRAWER_SIDE_CLS[side],
            drawerSizeCls(side, size),
            !open && DRAWER_SLIDE_IN[side],
            className
          )}
        >
          {(title || !hideClose) && (
            <div className="flex items-start gap-3 px-6 py-5 border-b border-rule shrink-0">
              <div className="flex-1 min-w-0">
                {title && <p className="text-body-paragraph font-bold text-foreground">{title}</p>}
                {description && <p className="text-body-callout text-faint mt-1 leading-[1.45]">{description}</p>}
              </div>
              {!hideClose && (
                <button
                  type="button"
                  className="inline-flex bg-transparent border-none cursor-pointer p-1 rounded-sm text-faint shrink-0 transition-[color,background] duration-[120ms] hover:text-foreground hover:bg-graphite-2 [&>svg]:w-[1.125rem] [&>svg]:h-[1.125rem]"
                  aria-label="Close"
                  onClick={onClose}
                >
                  <XIcon />
                </button>
              )}
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
          {footer && (
            <div
              className={cn(
                "flex items-center gap-[0.625rem] px-6 py-4 border-t border-rule shrink-0",
                DRAWER_FOOTER_ALIGN[footerAlign]
              )}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

/* ── panel variant (absorbed from SidePanel, verbatim render) ────────────── */
function ModalPanel({
  panel,
  children,
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
  panelSide = "left",
  panelWidth = 240,
  collapsedWidth = 0,
  className,
  style,
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const controlled = controlledOpen !== undefined;
  const isOpen = controlled ? controlledOpen : internalOpen;

  function toggle() {
    const next = !isOpen;
    if (!controlled) setInternalOpen(next);
    onOpenChange?.(next);
  }

  const isLeft = panelSide === "left";

  return (
    <div className={cn("flex overflow-hidden", className)} style={style}>
      {/* Panel */}
      <div
        className={cn(
          "relative shrink-0 overflow-hidden transition-[width] duration-200 ease-in-out border-rule bg-canvas",
          isLeft ? "border-r" : "order-last border-l"
        )}
        style={{ width: isOpen ? panelWidth : collapsedWidth }}
      >
        <div style={{ width: panelWidth }} className="h-full overflow-auto">
          {panel}
        </div>

        {/* Toggle button */}
        <button
          onClick={toggle}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-10 w-5 h-10 flex items-center justify-center rounded-(--radius-sm) border border-rule bg-raised text-muted hover:text-foreground hover:bg-graphite transition-colors text-body-caption",
            isLeft ? "-right-2.5" : "-left-2.5"
          )}
          aria-label={isOpen ? "Collapse panel" : "Expand panel"}
        >
          {isLeft ? (isOpen ? "‹" : "›") : isOpen ? "›" : "‹"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto min-w-0">{children}</div>
    </div>
  );
}

/**
 * Modal — Super component (DIALOG family).
 * `variant` (default `modal`) dispatches to the render family:
 *  - `modal`  centered dialog (base)
 *  - `alert`  confirm preset (intent + confirm/cancel + loading)
 *  - `drawer` edge-sliding panel (side)
 *  - `panel`  inline collapsible side panel
 * Absorbs the former AlertDialog, Drawer and SidePanel (now backward-compat wrappers).
 */
export function Modal(props: ModalProps) {
  switch (props.variant) {
    case "alert":
      return <ModalAlert {...props} />;
    case "drawer":
      return <ModalDrawer {...props} />;
    case "panel":
      return <ModalPanel {...props} />;
    default:
      return <ModalDialog {...props} />;
  }
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return <div className={cn("flex-1 overflow-y-auto px-6 py-5", className)}>{children}</div>;
}

export function ModalFooter({ children, align = "right", className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-[0.625rem] px-6 py-4 border-t border-rule shrink-0",
        FOOTER_ALIGN[align],
        className
      )}
    >
      {children}
    </div>
  );
}
