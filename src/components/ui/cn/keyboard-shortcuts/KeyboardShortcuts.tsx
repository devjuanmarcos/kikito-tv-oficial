"use client";
import type React from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Input } from "@/components/ui/cn/input";
import { cn } from "@/lib/utils";

import type { KeyboardShortcutsProps } from "./keyboard-shortcuts.types";

const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-4 h-4">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

/** Escape-to-close + Tab focus trap padrão WAI-ARIA pra dialog — mesmo padrão do Modal.tsx
 * (replicado aqui em vez de importado pq KeyboardShortcuts é standalone, não uma variante do Super). */
function useFocusTrap(ref: React.RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const container = ref.current;
      if (!container) return;
      const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled")
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [ref, open, onClose]);
}

export function KeyboardShortcuts({ groups, isOpen, onClose, title = "Keyboard Shortcuts" }: KeyboardShortcutsProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useFocusTrap(panelRef, isOpen, onClose);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // foco inicial no campo de busca (não no primeiro focusable genérico, que seria o
    // botão de fechar) — é o controle mais útil pra um dialog de busca/paleta, e sem
    // nenhum foco automático o teclado continuava na página de trás (bug de a11y real).
    // Query por seletor em vez de ref: <Input> CN não usa forwardRef.
    panelRef.current?.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const filtered = groups
    .map((g) => ({
      ...g,
      shortcuts: g.shortcuts.filter((s) => !query || s.label.toLowerCase().includes(query.toLowerCase())),
    }))
    .filter((g) => g.shortcuts.length > 0);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* bg-black literal: scrim de overlay, deliberadamente independente de tema (mesmo padrão do Modal.tsx) */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md mx-(--spacing-lg) rounded-2xl border border-rule bg-raised shadow-[0_24px_64px_-16px_oklch(0%_0_0/0.6)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-(--spacing-lg) border-b border-rule">
          <span id={titleId} className="text-body-callout font-semibold text-foreground">
            {title}
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-faint hover:text-foreground hover:bg-graphite transition-colors"
          >
            <XIcon />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-(--spacing-md) border-b border-rule">
          <Input
            type="search"
            size="md"
            placeholder="Search shortcuts…"
            aria-label="Search shortcuts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Groups */}
        <div className="max-h-[420px] overflow-y-auto divide-y divide-rule">
          {filtered.length === 0 ? (
            <p className="px-5 py-8 text-center text-body-callout text-faint">No shortcuts found.</p>
          ) : (
            filtered.map((group) => (
              <div key={group.title} className="px-5 py-(--spacing-md)">
                <p className="text-body-caption font-semibold text-faint uppercase tracking-wide mb-(--spacing-sm)">
                  {group.title}
                </p>
                <ul className="space-y-(--spacing-sm)">
                  {group.shortcuts.map((s, i) => (
                    <li key={i} className="flex items-center justify-between gap-(--spacing-lg)">
                      <span className="text-body-callout text-foreground">{s.label}</span>
                      <div className="flex items-center gap-(--spacing-2xs)">
                        {s.keys.map((k, j) => (
                          <kbd
                            key={j}
                            className={cn(
                              "inline-flex items-center justify-center min-w-(--spacing-xl) h-6 px-(--spacing-xs)",
                              // below scale minimum: rótulo de tecla individual (kbd), não conteúdo primário
                              "rounded-md text-[0.65rem] font-medium bg-graphite border border-rule text-foreground",
                              "shadow-[0_1px_0_oklch(0%_0_0/0.3)]"
                            )}
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
