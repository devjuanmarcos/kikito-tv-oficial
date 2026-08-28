"use client";
import { useRef, useEffect, useCallback, useState } from "react";

import { Button } from "@/components/ui/cn/button/Button";
import { cn } from "@/lib/utils";

import type { TextEditorProps } from "./text-editor.types";

type Cmd =
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "formatBlock";

/** Comandos que o browser reporta via `queryCommandState` — usados pro aria-pressed
 * do botão. `formatBlock` não é um toggle real (não tem estado on/off consistente
 * entre browsers), por isso fica de fora. */
const TOGGLE_CMDS: Cmd[] = ["bold", "italic", "underline", "strikeThrough", "insertUnorderedList", "insertOrderedList"];

const TOOLBAR: Array<{ cmd: Cmd; label: string; arg?: string; title: string }> = [
  { cmd: "bold", label: "B", title: "Bold" },
  { cmd: "italic", label: "I", title: "Italic" },
  { cmd: "underline", label: "U", title: "Underline" },
  { cmd: "strikeThrough", label: "S̶", title: "Strikethrough" },
  { cmd: "insertUnorderedList", label: "• ≡", title: "Unordered list" },
  { cmd: "insertOrderedList", label: "1 ≡", title: "Ordered list" },
  { cmd: "formatBlock", label: "H2", arg: "h2", title: "Heading 2" },
];

export function TextEditor({
  value,
  defaultValue = "",
  onChange,
  placeholder = "Start typing…",
  ariaLabel,
  minHeight = 140,
  disabled = false,
  className,
  style,
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const [activeStates, setActiveStates] = useState<Partial<Record<Cmd, boolean>>>({});

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = isControlled ? value! : defaultValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isControlled && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value!;
    }
  }, [value, isControlled]);

  // Achado real: nenhum feedback visual/aria indicava se o cursor estava dentro de
  // um trecho em negrito/itálico/etc — o toolbar parecia todo "inativo" o tempo
  // inteiro. queryCommandState reflete o estado real do comando na seleção atual.
  const refreshActiveStates = useCallback(() => {
    if (typeof document === "undefined") return;
    setActiveStates((prev) => {
      const next: Partial<Record<Cmd, boolean>> = {};
      let changed = false;
      for (const cmd of TOGGLE_CMDS) {
        let state = false;
        try {
          state = document.queryCommandState(cmd);
        } catch {
          state = false;
        }
        next[cmd] = state;
        if (prev[cmd] !== state) changed = true;
      }
      return changed ? next : prev;
    });
  }, []);

  const exec = useCallback(
    (cmd: Cmd, arg?: string) => {
      document.execCommand(cmd, false, arg);
      editorRef.current?.focus();
      onChange?.(editorRef.current?.innerHTML ?? "");
      refreshActiveStates();
    },
    [onChange, refreshActiveStates]
  );

  return (
    <div
      style={style}
      className={cn(
        "flex flex-col rounded-xl border border-rule overflow-hidden bg-raised transition-[border-color,box-shadow] duration-150",
        "focus-within:border-patina focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-primary)_18%,transparent)]",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-(--spacing-3xs) px-(--spacing-sm) py-(--spacing-xs) border-b border-rule bg-graphite-2">
        {TOOLBAR.map((btn) => {
          const pressed = TOGGLE_CMDS.includes(btn.cmd) ? activeStates[btn.cmd] ?? false : undefined;
          return (
            <Button
              key={btn.cmd + (btn.arg ?? "")}
              type="button"
              variant="ghost"
              intent="neutral"
              size="xs"
              title={btn.title}
              aria-label={btn.title}
              aria-pressed={pressed}
              disabled={disabled}
              onMouseDown={(e) => {
                e.preventDefault();
                exec(btn.cmd, btn.arg);
              }}
              className={cn(
                "text-body-caption font-medium",
                pressed && "bg-patina-soft text-patina-soft-fg hover:bg-patina-soft/80"
              )}
            >
              {btn.label}
            </Button>
          );
        })}
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        role="textbox"
        tabIndex={disabled ? -1 : 0}
        aria-multiline="true"
        aria-label={ariaLabel ?? placeholder}
        aria-disabled={disabled || undefined}
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={() => onChange?.(editorRef.current?.innerHTML ?? "")}
        onKeyUp={refreshActiveStates}
        onMouseUp={refreshActiveStates}
        onFocus={refreshActiveStates}
        style={{ minHeight }}
        className={cn(
          "px-(--spacing-lg) py-(--spacing-md) text-body-paragraph text-foreground outline-none max-w-none",
          "[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-faint",
          // Sem plugin de tipografia instalado — o conteúdo rico (h2/listas/strong/em/s)
          // gerado pelo execCommand herdava só o UA stylesheet padrão do browser
          // (fora da escala de tokens). Mapeado explicitamente pro design system:
          "[&_h2]:text-heading-05 [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-(--spacing-lg) [&_h2]:mb-(--spacing-sm) [&_h2]:first:mt-0",
          "[&_p]:mb-(--spacing-sm) [&_p]:last:mb-0",
          "[&_ul]:list-disc [&_ul]:pl-(--spacing-lg) [&_ul]:my-(--spacing-sm)",
          "[&_ol]:list-decimal [&_ol]:pl-(--spacing-lg) [&_ol]:my-(--spacing-sm)",
          "[&_li]:mb-(--spacing-3xs)",
          "[&_strong]:font-semibold [&_em]:italic [&_s]:line-through",
          disabled && "opacity-50 select-none"
        )}
      />
    </div>
  );
}
