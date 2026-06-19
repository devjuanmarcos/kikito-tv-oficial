import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface UseFocusTrapOptions {
  /** Ativar/desativar a trap dinamicamente */
  enabled?: boolean;
  /** Retornar foco ao elemento que estava ativo antes da trap */
  returnFocusOnUnmount?: boolean;
}

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Prende o foco dentro de um container — essencial para modais e overlays (WCAG 2.1.2).
 *
 * @example
 * const containerRef = useFocusTrap<HTMLDivElement>({ enabled: isOpen, returnFocusOnUnmount: true })
 * <div ref={containerRef} role="dialog" aria-modal="true">...</div>
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  options: UseFocusTrapOptions = {}
): RefObject<T | null> {
  const { enabled = true, returnFocusOnUnmount = true } = options;
  const containerRef = useRef<T>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    // Guardar elemento focado antes de ativar a trap
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Focar o primeiro elemento focável do container
    const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    focusable[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableList = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
      if (focusableList.length === 0) return;

      const first = focusableList[0];
      const last = focusableList[focusableList.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: ciclo reverso
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: ciclo normal
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (returnFocusOnUnmount && previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [enabled, returnFocusOnUnmount]);

  return containerRef;
}
