"use client";
import type React from "react";
import { useState, useRef, useEffect, cloneElement, Children } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export type MenuPlacement = "bottom-start" | "bottom" | "bottom-end" | "top-start" | "top" | "top-end";

export interface MenuItem {
  type: "item";
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface MenuSeparator {
  type: "separator";
}

export interface MenuGroup {
  type: "group";
  label: string;
  items: MenuItem[];
}

export type MenuEntry = MenuItem | MenuSeparator | MenuGroup;

export interface DropdownMenuProps {
  items: MenuEntry[];
  placement?: MenuPlacement;
  children: React.ReactElement;
}

const GAP = 4;

function getMenuPos(trigger: DOMRect, menu: DOMRect, placement: MenuPlacement) {
  let top = 0,
    left = 0;
  const { top: tT, bottom: tB, left: tL, right: tR, width: tW } = trigger;
  const { width: mW, height: mH } = menu;

  switch (placement) {
    case "bottom-start":
      top = tB + GAP;
      left = tL;
      break;
    case "bottom":
      top = tB + GAP;
      left = tL + tW / 2 - mW / 2;
      break;
    case "bottom-end":
      top = tB + GAP;
      left = tR - mW;
      break;
    case "top-start":
      top = tT - mH - GAP;
      left = tL;
      break;
    case "top":
      top = tT - mH - GAP;
      left = tL + tW / 2 - mW / 2;
      break;
    case "top-end":
      top = tT - mH - GAP;
      left = tR - mW;
      break;
  }

  const vW = window.innerWidth,
    vH = window.innerHeight;
  left = Math.max(8, Math.min(left, vW - mW - 8));
  top = Math.max(8, Math.min(top, vH - mH - 8));
  return { top, left };
}

export function DropdownMenu({ items, placement = "bottom-start", children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [ready, setReady] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function openMenu() {
    setReady(false);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) {
      setReady(false);
      return;
    }
    requestAnimationFrame(() => {
      if (!triggerRef.current || !menuRef.current) return;
      const tRect = triggerRef.current.getBoundingClientRect();
      const mRect = menuRef.current.getBoundingClientRect();
      setPos(getMenuPos(tRect, mRect, placement));
      setReady(true);
    });
  }, [open, placement]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
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
      setOpen((v) => !v);
      children.props.onClick?.(e);
    },
  });

  function renderItem(entry: MenuEntry, i: number): React.ReactNode {
    if (entry.type === "separator") {
      return <div key={i} role="separator" className="my-1 -mx-1 h-px bg-rule" />;
    }
    if (entry.type === "group") {
      return (
        <div key={i} className="mb-1">
          <div className="px-2 pb-1 text-[0.625rem] font-semibold uppercase tracking-widest text-faint select-none">
            {entry.label}
          </div>
          {entry.items.map((it, j) => renderItem(it, j))}
        </div>
      );
    }
    return (
      <button
        key={i}
        type="button"
        disabled={entry.disabled}
        onClick={() => {
          if (entry.disabled) return;
          entry.onClick?.();
          setOpen(false);
        }}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 text-body-callout rounded-(--radius-xs) transition-colors duration-[80ms] text-left select-none",
          entry.danger ? "text-danger hover:bg-danger/10" : "text-foreground hover:bg-graphite",
          entry.disabled && "opacity-40 cursor-not-allowed"
        )}
      >
        {entry.icon && (
          <span className="shrink-0 w-3.5 h-3.5 flex items-center justify-center text-faint">{entry.icon}</span>
        )}
        <span className="flex-1 truncate">{entry.label}</span>
        {entry.shortcut && (
          <span className="shrink-0 text-[0.6875rem] text-faint font-mono ml-auto">{entry.shortcut}</span>
        )}
      </button>
    );
  }

  if (typeof document === "undefined") return trigger;

  return (
    <>
      {trigger}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className={cn(
              "fixed z-[1200] min-w-[160px] max-w-[280px] p-1",
              "bg-raised border border-rule rounded-(--radius-md)",
              "shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.35),0_0_0_1px_oklch(0%_0_0/0.06)]",
              "transition-[opacity,transform] duration-[140ms]",
              ready ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
            )}
            style={{ top: pos.top, left: pos.left }}
          >
            {items.map((entry, i) => renderItem(entry, i))}
          </div>,
          document.body
        )}
    </>
  );
}
