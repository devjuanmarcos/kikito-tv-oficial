"use client";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useState, useRef, useEffect, useCallback, useId, cloneElement, Children } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import type { MenuPlacement, MenuItem, MenuEntry, DropdownMenuProps } from "./dropdown-menu.types";

export type {
  MenuPlacement,
  MenuItem,
  MenuSeparator,
  MenuGroup,
  MenuEntry,
  DropdownMenuTrigger,
  HoverMenuPlacement,
  DropdownMenuProps,
} from "./dropdown-menu.types";

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

/* Shared item renderer for the click-driven dropdown. */
function renderMenuItem(entry: MenuEntry, i: number, close: () => void): React.ReactNode {
  if (entry.type === "separator") {
    return <div key={i} role="separator" className="my-(--spacing-2xs) -mx-(--spacing-2xs) h-px bg-rule" />;
  }
  if (entry.type === "group") {
    return (
      <div key={i} className="mb-(--spacing-2xs)">
        {/* text-[0.625rem]: below scale minimum, eyebrow de grupo */}
        <div className="px-(--spacing-sm) pb-(--spacing-2xs) text-[0.625rem] font-semibold uppercase tracking-widest text-faint select-none">
          {entry.label}
        </div>
        {entry.items.map((it, j) => renderMenuItem(it, j, close))}
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
        close();
      }}
      className={cn(
        "w-full flex items-center gap-(--spacing-sm) px-(--spacing-sm) py-(--spacing-xs) text-body-callout rounded-(--radius-xs) transition-colors duration-[80ms] text-left select-none",
        entry.danger ? "text-danger hover:bg-danger/10" : "text-foreground hover:bg-graphite",
        entry.disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {entry.icon && (
        <span className="shrink-0 w-3.5 h-3.5 flex items-center justify-center text-faint">{entry.icon}</span>
      )}
      <span className="flex-1 truncate">{entry.label}</span>
      {/* text-[0.6875rem]: below scale minimum, glyph de shortcut */}
      {entry.shortcut && (
        <span className="shrink-0 text-[0.6875rem] text-faint font-mono ml-auto">{entry.shortcut}</span>
      )}
    </button>
  );
}

/* ── Click trigger (default dropdown) ────────────────────────────────────── */
function ClickMenu({ items, placement = "bottom-start", children }: Omit<DropdownMenuProps, "trigger">) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [ready, setReady] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

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

  const triggerEl = cloneElement(Children.only(children), {
    ref: triggerRef,
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": open ? menuId : undefined,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      setOpen((v) => !v);
      children.props.onClick?.(e);
    },
  });

  if (typeof document === "undefined") return triggerEl;

  return (
    <>
      {triggerEl}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            className={cn(
              "fixed z-[1200] min-w-[160px] max-w-[280px] p-(--spacing-2xs)",
              "bg-raised border border-rule rounded-(--radius-md)",
              "shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.35),0_0_0_1px_oklch(0%_0_0/0.06)]",
              "transition-[opacity,transform] duration-[140ms]",
              ready ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
            )}
            style={{ top: pos.top, left: pos.left }}
          >
            {items.map((entry, i) => renderMenuItem(entry, i, () => setOpen(false)))}
          </div>,
          document.body
        )}
    </>
  );
}

/* ── Contextmenu trigger (right-click) — ported verbatim from ContextMenu ── */
function ContextMenuImpl({ items, children }: Omit<DropdownMenuProps, "trigger">) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    const x = Math.min(e.clientX, window.innerWidth - 200);
    const y = Math.min(e.clientY, window.innerHeight - 300);
    setPos({ x, y });
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  if (typeof document === "undefined") return <>{children}</>;

  return (
    <>
      <div className="contents" onContextMenu={handleContextMenu}>
        {children}
      </div>
      {createPortal(
        <>
          <AnimatePresence>
            {open && (
              <>
                <div
                  className="fixed inset-0 z-[9998]"
                  onClick={close}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    close();
                  }}
                />
                <motion.div
                  ref={menuRef}
                  // shadow-[var(--ks-shadow-lg)] usava var indefinida (ver CLAUDE.md) — literal igual ao ClickMenu abaixo
                  className="fixed z-[9999] bg-float border border-rule rounded-(--radius-base) p-(--spacing-2xs) min-w-[180px] shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.35),0_0_0_1px_oklch(0%_0_0/0.06)]"
                  style={{
                    top: pos.y,
                    left: pos.x,
                  }}
                  role="menu"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {items.map((entry, gi) => {
                    if (entry.type === "separator") {
                      return <div key={gi} role="separator" className="h-px bg-rule my-(--spacing-2xs)" />;
                    }
                    if (entry.type === "group") {
                      return (
                        <div
                          key={gi}
                          className={cn(
                            "flex flex-col",
                            gi > 0 &&
                              'before:content-[""] before:block before:h-px before:bg-rule before:my-(--spacing-2xs)'
                          )}
                        >
                          {entry.label && (
                            // text-[0.625rem]: below scale minimum, eyebrow de grupo
                            <div className="text-[0.625rem] font-semibold tracking-[0.06em] uppercase text-muted py-(--spacing-2xs) px-(--spacing-sm)">
                              {entry.label}
                            </div>
                          )}
                          {entry.items.map((item, ii) => (
                            <button
                              key={ii}
                              className={cn(
                                // py-[7px]: sem match exato entre --spacing-xs(6px) e --spacing-sm(8px)
                                "flex items-center gap-(--spacing-sm) py-[7px] px-(--spacing-sm) rounded-(--radius-sm) text-body-callout text-foreground cursor-pointer transition-[background] duration-[100ms] border-none bg-transparent w-full text-left",
                                !item.disabled && !item.danger && "hover:bg-patina-soft hover:text-patina",
                                item.danger && "text-danger",
                                item.danger && !item.disabled && "hover:bg-danger-soft",
                                item.disabled && "opacity-35 cursor-default"
                              )}
                              role="menuitem"
                              disabled={item.disabled}
                              onClick={() => {
                                if (!item.disabled) {
                                  item.onClick?.();
                                  close();
                                }
                              }}
                            >
                              {item.icon && (
                                <span className="flex items-center justify-center w-4 h-4 flex-shrink-0 [&_svg]:w-full [&_svg]:h-full">
                                  {item.icon}
                                </span>
                              )}
                              <span className="flex-1">{item.label}</span>
                              {item.shortcut && (
                                <span className="text-body-caption opacity-45 font-mono">{item.shortcut}</span>
                              )}
                            </button>
                          ))}
                        </div>
                      );
                    }
                    // bare item
                    return (
                      <button
                        key={gi}
                        className={cn(
                          // py-[7px]: sem match exato entre --spacing-xs(6px) e --spacing-sm(8px)
                          "flex items-center gap-(--spacing-sm) py-[7px] px-(--spacing-sm) rounded-(--radius-sm) text-body-callout text-foreground cursor-pointer transition-[background] duration-[100ms] border-none bg-transparent w-full text-left",
                          !entry.disabled && !entry.danger && "hover:bg-patina-soft hover:text-patina",
                          entry.danger && "text-danger",
                          entry.danger && !entry.disabled && "hover:bg-danger-soft",
                          entry.disabled && "opacity-35 cursor-default"
                        )}
                        role="menuitem"
                        disabled={entry.disabled}
                        onClick={() => {
                          if (!entry.disabled) {
                            entry.onClick?.();
                            close();
                          }
                        }}
                      >
                        {entry.icon && (
                          <span className="flex items-center justify-center w-4 h-4 flex-shrink-0 [&_svg]:w-full [&_svg]:h-full">
                            {entry.icon}
                          </span>
                        )}
                        <span className="flex-1">{entry.label}</span>
                        {entry.shortcut && (
                          <span className="text-body-caption opacity-45 font-mono">{entry.shortcut}</span>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </>
  );
}

/* ── Hover trigger — ported verbatim from FloatingMenu ───────────────────── */
function HoverMenu({
  items,
  placement = "bottom-start",
  openOnHover = false,
  children,
}: Omit<DropdownMenuProps, "trigger">) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const flatItems = items.filter((e): e is MenuItem => e.type === "item");

  useEffect(() => {
    setMounted(true);
  }, []);

  const calcPos = useCallback(() => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const mW = 180;
    const mH = flatItems.length * 40 + 16;
    const vW = window.innerWidth;
    const vH = window.innerHeight;
    const gap = 6;

    let top = r.bottom + gap;
    let left = r.left;

    if (placement.startsWith("top")) {
      top = r.top - mH - gap;
    }
    if (placement.startsWith("bottom")) {
      top = r.bottom + gap;
    }
    if (placement === "left") {
      top = r.top;
      left = r.left - mW - gap;
    }
    if (placement === "right") {
      top = r.top;
      left = r.right + gap;
    }
    if (placement.endsWith("end")) {
      left = r.right - mW;
    }
    if (placement === "top" || placement === "bottom") {
      left = r.left + r.width / 2 - mW / 2;
    }

    left = Math.max(8, Math.min(left, vW - mW - 8));
    top = Math.max(8, Math.min(top, vH - mH - 8));
    setPos({ top, left });
  }, [placement, flatItems.length]);

  useEffect(() => {
    if (!open) return;
    calcPos();
    const handleOutside = (e: MouseEvent) => {
      if (wrapRef.current?.contains(e.target as Node) || menuRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, calcPos]);

  const hoverProps = openOnHover
    ? {
        onMouseEnter: () => {
          clearTimeout(hoverTimer.current);
          setOpen(true);
        },
        onMouseLeave: () => {
          hoverTimer.current = setTimeout(() => setOpen(false), 150);
        },
      }
    : {};

  return (
    <div ref={wrapRef} className="relative inline-block" {...hoverProps}>
      <div onClick={() => !openOnHover && setOpen((v) => !v)} className="cursor-pointer">
        {children}
      </div>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: pos.top, left: pos.left, minWidth: 180 }}
            className="fixed z-[950] py-(--spacing-xs) rounded-xl border border-rule bg-raised shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.5)]"
            {...(openOnHover
              ? {
                  onMouseEnter: () => clearTimeout(hoverTimer.current),
                  onMouseLeave: () => {
                    hoverTimer.current = setTimeout(() => setOpen(false), 150);
                  },
                }
              : {})}
          >
            {flatItems.map((item, i) => (
              <button
                key={item.value || i}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={cn(
                  // gap-2.5 (10px): sem match exato entre --spacing-sm(8px) e --spacing-md(12px)
                  "w-full flex items-center gap-2.5 px-(--spacing-md) py-(--spacing-sm) text-body-callout text-left",
                  "transition-colors duration-[80ms] hover:bg-graphite",
                  item.danger ? "text-danger hover:text-danger" : "text-foreground",
                  item.disabled && "opacity-40 pointer-events-none"
                )}
              >
                {item.icon && <span className="text-body-paragraph leading-none">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

/**
 * DropdownMenu — Super component.
 * `trigger` (default `"click"`) selects how the menu opens.
 * Absorbs the former ContextMenu (`trigger="contextmenu"`) and
 * FloatingMenu (`trigger="hover"`), now backward-compat wrappers.
 */
export function DropdownMenu({ trigger = "click", ...props }: DropdownMenuProps) {
  if (trigger === "contextmenu") return <ContextMenuImpl {...props} />;
  if (trigger === "hover") return <HoverMenu {...props} />;
  return <ClickMenu {...props} />;
}
