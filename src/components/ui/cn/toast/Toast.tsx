"use client";

import { createContext, useCallback, useContext, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import type { ToastContextValue, ToastItem, ToastOptions, ToastProviderProps } from "./toast.types";

const InfoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const SuccessIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const WarningIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const DangerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const NeutralIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);
const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3 h-3"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ICONS = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  danger: <DangerIcon />,
  neutral: <NeutralIcon />,
};

const INTENT_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  info: { bg: "var(--ks-info)", text: "var(--ks-info-fg)", bar: "var(--ks-info)" },
  success: { bg: "var(--ks-success)", text: "var(--ks-success-fg)", bar: "var(--ks-success)" },
  warning: { bg: "var(--ks-warning)", text: "var(--ks-warning-fg)", bar: "var(--ks-warning)" },
  danger: { bg: "var(--ks-danger)", text: "var(--ks-danger-fg)", bar: "var(--ks-danger)" },
  // --ks-foreground nunca existiu (var indefinida) — o token real de texto principal é --ks-text
  neutral: { bg: "var(--ks-graphite)", text: "var(--ks-text)", bar: "var(--ks-text-faint)" },
};

const REGION_CLS: Record<string, string> = {
  "top-left": "top-0 left-0 items-start",
  "top-center": "top-0 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-0 right-0 items-end",
  "bottom-left": "bottom-0 left-0 items-start flex-col-reverse",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center flex-col-reverse",
  "bottom-right": "bottom-0 right-0 items-end flex-col-reverse",
};

const ToastCtx = createContext<ToastContextValue | null>(null);
let _counter = 0;
function uid() {
  return `toast-${++_counter}`;
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const [barW, setBarW] = useState(100);
  const startRef = useRef(Date.now());
  const rafRef = useRef<number>();
  const colors = INTENT_COLORS[item.intent] ?? INTENT_COLORS.neutral;
  const isSolid = item.variant === "solid";
  const resolvedIcon = item.icon !== undefined ? item.icon : ICONS[item.intent as keyof typeof ICONS];

  useEffect(() => {
    if (!item.duration) return;
    const total = item.duration;
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / total) * 100);
      setBarW(pct);
      if (pct > 0) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [item.duration]);

  return (
    <>
      <style>{`
        @keyframes toast-in  { from { opacity:0; transform:translateY(6px) scale(.97); } to { opacity:1; transform:none; } }
        @keyframes toast-out { from { opacity:1; transform:none; } to { opacity:0; transform:translateY(6px) scale(.97); } }
        .toast-enter { animation: toast-in  .18s ease both; }
        .toast-exit  { animation: toast-out .18s ease both; }
      `}</style>
      <div
        className={cn(
          // gap-2.5: sem match exato na escala de spacing
          "flex items-start gap-2.5 px-(--spacing-lg) py-(--spacing-md) rounded-(--radius-md) pointer-events-auto w-full relative overflow-hidden",
          item.exiting ? "toast-exit" : "toast-enter",
          // pl-5: sem match exato na escala de spacing
          isSolid ? "border border-transparent shadow-lg" : "bg-raised border border-rule shadow-lg pl-5"
        )}
        style={isSolid ? { background: colors.bg, color: colors.text } : undefined}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {!isSolid && (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "var(--spacing-sm)",
              bottom: "var(--spacing-sm)",
              width: 3,
              borderRadius: 999,
              background: colors.bar,
            }}
          />
        )}

        {resolvedIcon && (
          // colors.text (não branco fixo): warning-fg costuma ser escuro pra manter contraste
          // sobre o fundo amarelo sólido — um branco fixo ficaria ilegível nesse intent
          <span
            className="inline-flex items-center shrink-0 pt-[1px]"
            style={{ color: isSolid ? colors.text : colors.bar }}
          >
            {resolvedIcon}
          </span>
        )}

        <div className="flex-1 min-w-0 flex flex-col gap-(--spacing-3xs)">
          {item.title && <p className="text-body-callout font-semibold leading-snug">{item.title}</p>}
          {item.message && <p className="text-body-callout leading-normal opacity-85">{item.message}</p>}
          {item.action && (
            <button
              className="bg-transparent border-none cursor-pointer text-body-callout font-semibold p-0 mt-(--spacing-xs) text-left transition-opacity hover:opacity-75"
              style={{ color: isSolid ? colors.text : colors.bar }}
              onClick={() => {
                item.action!.onClick();
                onDismiss(item.id);
              }}
            >
              {item.action.label}
            </button>
          )}
        </div>

        {item.dismissible && (
          <button
            className="inline-flex items-center bg-transparent border-none cursor-pointer p-(--spacing-3xs) rounded-(--radius-xs) opacity-50 shrink-0 self-start transition-opacity hover:opacity-100"
            aria-label="Dismiss"
            onClick={() => onDismiss(item.id)}
          >
            <XIcon />
          </button>
        )}

        {!!item.duration && (
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-[2px] opacity-50"
            style={{ width: `${barW}%`, background: isSolid ? colors.text : colors.bar }}
          />
        )}
      </div>
    </>
  );
}

export function ToastProvider({ children, placement = "bottom-right", maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((ts) => ts.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 220);
  }, []);

  const toast = useCallback(
    (opts: ToastOptions | string): string => {
      const options: ToastOptions = typeof opts === "string" ? { message: opts } : opts;
      const id = options.id ?? uid();
      const duration = options.duration ?? 4500;
      const intent = options.intent ?? "neutral";
      const variant = options.variant ?? "soft";
      const dismissible = options.dismissible ?? true;

      const item: ToastItem = {
        id,
        intent,
        variant,
        duration,
        dismissible,
        title: options.title ?? "",
        message: options.message ?? "",
        icon: options.icon,
        action: options.action,
        exiting: false,
      };

      setToasts((ts) => [...ts.filter((t) => t.id !== id), item].slice(-maxToasts));

      if (duration > 0) {
        clearTimeout(timers.current.get(id));
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration)
        );
      }
      return id;
    },
    [dismiss, maxToasts]
  );

  const clear = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current.clear();
    setToasts([]);
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach((t) => clearTimeout(t));
    },
    []
  );

  return (
    <ToastCtx.Provider value={{ toast, dismiss, clear }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            className={cn(
              "fixed z-[9999] flex flex-col gap-(--spacing-sm) pointer-events-none p-(--spacing-lg) w-[360px] max-w-[calc(100vw-2rem)]",
              REGION_CLS[placement]
            )}
            aria-label="Notifications"
          >
            {toasts.map((item) => (
              <ToastCard key={item.id} item={item} onDismiss={dismiss} />
            ))}
          </div>,
          document.body
        )}
    </ToastCtx.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
