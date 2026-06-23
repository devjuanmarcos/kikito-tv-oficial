"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import type {
  CommandProps,
  CommandItem,
  CommandPaletteProps,
  CommandBarProps,
  CommandSpotlightProps,
} from "./command.types";

export type {
  CommandProps,
  CommandItem,
  CommandGroup,
  CommandVariant,
  CommandPaletteProps,
  CommandBarProps,
  CommandBarAction,
  CommandSpotlightProps,
  SpotlightAction,
} from "./command.types";

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

/* ── Palette (default) — full command palette dialog ─────────────────────── */
function CommandPalette({
  groups,
  placeholder = "Search…",
  open,
  defaultOpen = false,
  onOpenChange,
  keybinding = "k",
  emptyMessage = "No results found.",
}: CommandPaletteProps) {
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
                        activeIdx === fi && "bg-[color-mix(in_oklch,var(--ks-primary)_12%,transparent)]",
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

/* ── Bar — inline command bar (absorbed from CommandBar) ─────────────────── */
function CommandBarImpl({ actions, placeholder = "Search commands…", className, style }: CommandBarProps) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return q ? actions.filter((a) => a.label.toLowerCase().includes(q)) : actions;
  }, [actions, query]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((a) => {
      const g = a.group ?? "Actions";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(a);
    });
    return map;
  }, [filtered]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(filtered.length - 1, c + 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    }
    if (e.key === "Enter" && filtered[cursor]) {
      filtered[cursor].onSelect?.();
    }
  }

  let flatIdx = 0;

  return (
    <div
      className={cn("rounded-(--radius-lg) border border-rule bg-raised overflow-hidden shadow-lg", className)}
      style={style}
    >
      {/* Search row */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-rule">
        <span className="text-faint text-body-title">⌕</span>
        <input
          className="flex-1 bg-transparent outline-none text-foreground text-body-callout placeholder:text-faint"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onKeyDown={onKeyDown}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </div>

      {/* Results list */}
      <div className="max-h-64 overflow-auto py-1">
        {groups.size === 0 && (
          <div className="px-4 py-6 text-center text-body-callout text-faint">No commands found</div>
        )}
        {Array.from(groups.entries()).map(([group, items]) => (
          <div key={group}>
            <div className="px-3 pt-2 pb-1 text-body-caption font-semibold text-faint uppercase tracking-[0.08em]">
              {group}
            </div>
            {items.map((item) => {
              const idx = flatIdx++;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors",
                    cursor === idx ? "bg-patina/10 text-patina" : "text-foreground hover:bg-graphite"
                  )}
                  onClick={() => item.onSelect?.()}
                  onMouseEnter={() => setCursor(idx)}
                >
                  {item.icon && <span className="text-body-paragraph shrink-0">{item.icon}</span>}
                  <span className="flex-1 text-body-callout font-medium">{item.label}</span>
                  {item.shortcut && (
                    <span className="flex items-center gap-1">
                      {item.shortcut.map((k, i) => (
                        <kbd
                          key={i}
                          className="text-[0.625rem] font-bold bg-graphite px-[5px] py-[2px] rounded text-faint"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Spotlight — fullscreen search (absorbed from SpotlightSearch) ───────── */
function CommandSpotlight({
  actions,
  isOpen,
  onClose,
  placeholder = "Buscar ações…",
  maxResults = 8,
  className,
}: CommandSpotlightProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setFocused(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = actions
    .filter(
      (a) =>
        !query ||
        a.label.toLowerCase().includes(query.toLowerCase()) ||
        a.description?.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, maxResults);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocused((f) => Math.min(f + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocused((f) => Math.max(f - 1, 0));
      }
      if (e.key === "Enter" && filtered[focused]) {
        filtered[focused].onSelect();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  if (!isOpen) return null;

  const groups = Array.from(new Set(filtered.map((a) => a.group ?? "")));

  return createPortal(
    <div
      className="fixed inset-0 bg-black/55 backdrop-blur-[4px] flex items-start justify-center pt-[10vh] z-[1000]"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-float border border-rule rounded-(--radius-xl) w-[580px] max-w-[calc(100vw-32px)] max-h-[70vh] flex flex-col shadow-[var(--ks-shadow-xl)] overflow-hidden",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Busca rápida"
      >
        <div className="flex items-center gap-[10px] px-[18px] py-[14px] border-b border-rule flex-shrink-0">
          <span className="text-body-title text-faint flex-shrink-0" aria-hidden>
            🔍
          </span>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none text-foreground text-body-paragraph placeholder:text-faint"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFocused(0);
            }}
          />
        </div>

        <div className="overflow-y-auto flex-1 py-2" role="listbox">
          {filtered.length === 0 ? (
            <div className="py-8 px-4 text-center text-muted text-body-callout">
              Nenhuma ação encontrada para &quot;{query}&quot;
            </div>
          ) : (
            groups.map((group) => {
              const groupActions = filtered.filter((a) => (a.group ?? "") === group);
              const globalOffset = filtered.indexOf(groupActions[0]);
              return (
                <div key={group}>
                  {group && (
                    <div className="px-4 py-2 pb-1 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-faint">
                      {group}
                    </div>
                  )}
                  {groupActions.map((action, i) => (
                    <button
                      key={action.id}
                      type="button"
                      className={cn(
                        "w-full flex items-center gap-3 px-[18px] py-[10px] bg-transparent border-none cursor-pointer text-left transition-[background] duration-[100ms] hover:bg-raised",
                        focused === globalOffset + i && "bg-raised"
                      )}
                      onMouseEnter={() => setFocused(globalOffset + i)}
                      onClick={() => {
                        action.onSelect();
                        onClose();
                      }}
                      role="option"
                      aria-selected={focused === globalOffset + i}
                    >
                      <span className="w-8 h-8 bg-graphite rounded-(--radius-sm) flex items-center justify-center text-body-paragraph flex-shrink-0">
                        {action.icon ?? "⚡"}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-body-callout text-foreground font-medium">{action.label}</span>
                        {action.description && (
                          <span className="block text-body-caption text-muted whitespace-nowrap overflow-hidden text-ellipsis">
                            {action.description}
                          </span>
                        )}
                      </span>
                      {action.shortcut && (
                        <span className="flex gap-[3px] flex-shrink-0">
                          {action.shortcut.map((k, ki) => (
                            <kbd
                              key={ki}
                              className="px-[6px] py-[2px] border border-rule bg-raised rounded-[4px] text-body-caption text-muted font-mono"
                            >
                              {k}
                            </kbd>
                          ))}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </div>

        <div className="px-[18px] py-2 border-t border-rule flex items-center gap-3 flex-shrink-0">
          {[
            ["↑↓", "navegar"],
            ["↵", "selecionar"],
            ["Esc", "fechar"],
          ].map(([key, hint]) => (
            <span key={hint} className="flex items-center gap-[5px] text-body-caption text-faint">
              <kbd className="px-[6px] py-[2px] border border-rule bg-raised rounded-[4px] text-body-caption text-muted font-mono">
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

/**
 * Command — Super component.
 * `variant` (default 'palette') dispatches the rendering family:
 *  - 'palette'   → full command palette dialog (keybinding-triggered)
 *  - 'bar'       → inline command bar (absorbs former CommandBar)
 *  - 'spotlight' → fullscreen spotlight search (absorbs former SpotlightSearch)
 *
 * Sibling components (CommandBar, SpotlightSearch) are now backward-compat wrappers.
 */
export function Command(props: CommandProps) {
  if (props.variant === "bar") {
    const { variant: _v, ...rest } = props;
    return <CommandBarImpl {...rest} />;
  }
  if (props.variant === "spotlight") {
    const { variant: _v, ...rest } = props;
    return <CommandSpotlight {...rest} />;
  }
  const { variant: _v, ...rest } = props;
  return <CommandPalette {...rest} />;
}

export function useCommand() {
  const [open, setOpen] = useState(false);
  return { open, show: () => setOpen(true), hide: () => setOpen(false), toggle: () => setOpen((o) => !o), setOpen };
}
