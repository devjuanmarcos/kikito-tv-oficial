"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import type { SidePanelProps } from "./side-panel.types";

export function SidePanel({
  panel,
  children,
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
  side = "left",
  panelWidth = 240,
  collapsedWidth = 0,
  className,
  style,
}: SidePanelProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const controlled = controlledOpen !== undefined;
  const isOpen = controlled ? controlledOpen : internalOpen;

  function toggle() {
    const next = !isOpen;
    if (!controlled) setInternalOpen(next);
    onOpenChange?.(next);
  }

  const isLeft = side === "left";

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
