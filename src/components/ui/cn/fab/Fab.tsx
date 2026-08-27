"use client";
import type React from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type FabIntent = "primary" | "secondary" | "success" | "danger" | "neutral";
export type FabSize = "sm" | "md" | "lg";
export type FabPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export interface FabAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface FabProps {
  icon: React.ReactNode;
  actions?: FabAction[];
  position?: FabPosition;
  intent?: FabIntent;
  size?: FabSize;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_BTN: Record<FabSize, string> = {
  sm: "w-10 h-10 text-sm shadow-[0_4px_16px_-4px_oklch(0%_0_0/0.4)]",
  md: "w-14 h-14 text-lg shadow-[0_6px_24px_-6px_oklch(0%_0_0/0.4)]",
  lg: "w-16 h-16 text-xl shadow-[0_8px_28px_-6px_oklch(0%_0_0/0.4)]",
};
const SIZE_ACTION: Record<FabSize, string> = {
  sm: "w-8  h-8  text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

const INTENT_CLS: Record<FabIntent, string> = {
  primary: "bg-patina text-patina-fg hover:brightness-110",
  secondary: "bg-kinpaku text-kinpaku-fg hover:brightness-110",
  success: "bg-success text-success-fg hover:brightness-110",
  danger: "bg-danger text-danger-fg hover:brightness-110",
  neutral: "bg-raised text-foreground hover:bg-graphite border border-rule",
};

const POSITION_CLS: Record<FabPosition, string> = {
  "bottom-right": "fixed bottom-6 right-6",
  "bottom-left": "fixed bottom-6 left-6",
  "top-right": "fixed top-6 right-6",
  "top-left": "fixed top-6 left-6",
};

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-5 h-5">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

export function Fab({
  icon,
  actions = [],
  position = "bottom-right",
  intent = "primary",
  size = "md",
  tooltip,
  onClick,
  className,
  style,
}: FabProps) {
  const [open, setOpen] = useState(false);
  const hasActions = actions.length > 0;

  const isBottom = position === "bottom-right" || position === "bottom-left";
  const actionsDir = isBottom ? "flex-col-reverse" : "flex-col";

  return (
    <div
      style={style}
      className={cn("z-[900] flex items-center", actionsDir, "gap-3", POSITION_CLS[position], className)}
    >
      {/* Speed-dial actions */}
      {hasActions && open && (
        <div className={cn("flex", actionsDir, "gap-2")}>
          {actions.map((action, i) => (
            <div key={i} className="flex items-center gap-2 group">
              <span className="text-body-caption text-foreground bg-raised border border-rule rounded-(--radius-sm) px-2 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none">
                {action.label}
              </span>
              <button
                type="button"
                aria-label={action.label}
                disabled={action.disabled}
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-center rounded-full bg-raised border border-rule text-foreground",
                  "hover:bg-graphite transition-[background,box-shadow] duration-[100ms]",
                  "shadow-[0_4px_16px_-4px_oklch(0%_0_0/0.3)]",
                  SIZE_ACTION[size],
                  action.disabled && "opacity-40 pointer-events-none"
                )}
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main button */}
      <button
        type="button"
        aria-label={tooltip ?? (hasActions ? (open ? "Close" : "Open menu") : undefined)}
        title={tooltip}
        onClick={() => {
          if (hasActions) setOpen((v) => !v);
          else onClick?.();
        }}
        className={cn(
          "flex items-center justify-center rounded-full transition-[filter,transform] duration-[120ms] active:scale-95 select-none",
          INTENT_CLS[intent],
          SIZE_BTN[size]
        )}
      >
        {hasActions && open ? <CloseIcon /> : icon}
      </button>
    </div>
  );
}
