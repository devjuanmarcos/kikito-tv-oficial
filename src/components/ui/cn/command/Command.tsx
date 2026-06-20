"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import type { CommandProps, CommandItem } from "./command.types";

export type { CommandProps, CommandItem, CommandGroup } from "./command.types";

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={16}
    height={16}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function normalize(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

export function Command({
  groups,
  placeholder = "Search…",
  open,
  defaultOpen = false,
  onOpenChange,
  keybinding = "k",
  emptyMessage = "No results found.",
}: CommandProps) {
  const isControlled = open !== undefined;
  const [internal, setInternal] = useState(defaultOpen);
  const visible = isControlled ? open! : internal;

  const [query, setQuery] = useState("");
  const [activeIdx, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  function show(v: boolean) {
    if (!isControlled) setInternal(v);
    onOpenChange?.(v);
    if (!v) setQuery("");
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === keybinding) {
        e.preventDefault();
        show(!visible);
      }
      if (e.key === "Escape" && visible) show(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, keybinding]);

  useEffect(() => {
    if (visible) setTimeout(() => inputRef.current?.focus(), 10);
  }, [visible]);

  const flat = useMemo<CommandItem[]>(() => {
    const q = normalize(query.trim());
    return groups
      .flatMap((g) => g.items)
      .filter((item) => {
        if (!q) return true;
        return (
          normalize(item.label).includes(q) ||
          (item.description && normalize(item.description).includes(q)) ||
          item.keywords?.some((kw) => normalize(kw).includes(q))
        );
      });
  }, [groups, query]);

  const filteredGroups = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (item) =>
            normalize(item.label).includes(q) ||
            (item.description && normalize(item.description).includes(q)) ||
            item.keywords?.some((kw) => normalize(kw).includes(q))
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-cmd-idx='${activeIdx}']`) as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  function select(item: CommandItem) {
    if (item.disabled) return;
    item.onSelect();
    show(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[activeIdx];
      if (item) select(item);
    }
  }

  let globalIdx = -1;
  if (!visible) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-[color-mix(in_oklch,var(--ks-lacquer)_60%,transparent)] backdrop-blur-[4px] flex items-start justify-center pt-[12vh] z-[9999] animate-[--animate-fade-in]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) show(false);
      }}
    >
      <div
        className="w-full max-w-[560px] bg-raised border border-rule rounded-(--radius-lg) shadow-[0_4px_6px_-1px_oklch(0%_0_0/0.14),0_20px_40px_-4px_oklch(0%_0_0/0.28)] overflow-hidden flex flex-col max-h-[72vh]"
        style={{
          animationName: "ks-cmd-in",
          animationDuration: "140ms",
          animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
          animationFillMode: "both",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-[0.625rem] px-4 border-b border-rule flex-shrink-0">
          <span className="flex items-center text-faint flex-shrink-0">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            className="flex-1 h-12 bg-transparent border-none outline-none text-body-paragraph text-foreground caret-patina placeholder:text-faint"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              className="flex items-center justify-center bg-graphite border border-rule rounded-(--radius-sm) px-[0.3125rem] py-[0.125rem] text-[0.625rem] text-faint cursor-pointer hover:opacity-70 flex-shrink-0"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ESC
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-[0.375rem]" ref={listRef} role="listbox">
          {filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 px-4 text-faint text-body-callout text-center">
              {emptyMessage}
            </div>
          ) : (
            filteredGroups.map((group, gi) => (
              <div key={gi} className="[&+div]:border-t [&+div]:border-rule [&+div]:mt-1 [&+div]:pt-1">
                {group.heading && (
                  <div className="text-[0.625rem] font-bold tracking-[0.1em] uppercase text-faint px-[0.625rem] py-[0.375rem] pb-1">
                    {group.heading}
                  </div>
                )}
                {group.items.map((item) => {
                  globalIdx++;
                  const fi = globalIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      className={cn(
                        "flex items-center gap-[0.625rem] py-[0.5625rem] px-[0.625rem] rounded-(--radius-sm) cursor-pointer bg-transparent border-none w-full text-left transition-[background] duration-[80ms] text-foreground",
                        activeIdx === fi && "bg-[color-mix(in_oklch,var(--ks-patina)_12%,transparent)]",
                        item.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
                      )}
                      data-cmd-idx={fi}
                      aria-selected={activeIdx === fi}
                      aria-disabled={item.disabled}
                      onMouseEnter={() => setActive(fi)}
                      onClick={() => select(item)}
                    >
                      {item.icon && (
                        <span className="flex items-center justify-center w-6 h-6 rounded-(--radius-sm) bg-graphite border border-rule text-faint flex-shrink-0 [&_svg]:w-[0.875rem] [&_svg]:h-[0.875rem]">
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-1 min-w-0 flex flex-col gap-[0.125rem]">
                        <span className="text-body-callout font-medium text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="text-body-caption text-faint whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.description}
                          </span>
                        )}
                      </span>
                      {item.shortcut && (
                        <span className="flex gap-1 flex-shrink-0" aria-label={`Shortcut: ${item.shortcut}`}>
                          {item.shortcut.split("+").map((k, ki) => (
                            <kbd
                              key={ki}
                              className="inline-flex items-center justify-center min-w-5 h-5 px-[0.3125rem] bg-graphite border border-rule border-b-2 rounded-(--radius-sm) text-body-caption font-medium text-faint"
                            >
                              {k}
                            </kbd>
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 py-2 px-[0.875rem] border-t border-rule flex-shrink-0">
          {[
            ["↑↓", "navigate"],
            ["↵", "select"],
            ["Esc", "close"],
          ].map(([key, hint]) => (
            <span key={hint} className="flex items-center gap-[0.3125rem] text-body-caption text-faint">
              <kbd className="inline-flex items-center justify-center min-w-5 h-5 px-[0.3125rem] bg-graphite border border-rule border-b-2 rounded-(--radius-sm) text-body-caption font-medium text-faint">
                {key}
              </kbd>
              {hint}
            </span>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function useCommand() {
  const [open, setOpen] = useState(false);
  return { open, show: () => setOpen(true), hide: () => setOpen(false), toggle: () => setOpen((o) => !o), setOpen };
}
