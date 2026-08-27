"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import type { NumberPadProps } from "./number-pad.types";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"] as const;

export function NumberPad({
  value: controlled,
  onChange,
  maxLength = 4,
  showValue = true,
  masked = true,
  onComplete,
  onClear,
  className,
  style,
}: NumberPadProps) {
  const [internal, setInternal] = useState("");
  const isControlled = controlled !== undefined;
  const val = isControlled ? controlled! : internal;

  function press(key: string) {
    if (key === "⌫") {
      const next = val.slice(0, -1);
      if (!isControlled) setInternal(next);
      onChange?.(next);
      if (next === "") onClear?.();
      return;
    }
    if (key === "" || val.length >= maxLength) return;
    const next = val + key;
    if (!isControlled) setInternal(next);
    onChange?.(next);
    if (next.length === maxLength) onComplete?.(next);
  }

  return (
    <div className={cn("flex flex-col items-center gap-(--spacing-lg)", className)} style={style}>
      {showValue && (
        <div className="flex items-center justify-center gap-(--spacing-md) h-10">
          {masked ? (
            Array.from({ length: maxLength }, (_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className={cn(
                  "w-3 h-3 rounded-full border-2 transition-all duration-150",
                  i < val.length ? "bg-patina border-patina scale-110" : "bg-transparent border-rule"
                )}
              />
            ))
          ) : (
            <div
              aria-hidden="true"
              className="text-heading-05 font-bold text-foreground tracking-[0.3em] min-w-[4rem] text-center"
            >
              {val || "·".repeat(maxLength)}
            </div>
          )}
          {/* feedback pra leitor de tela: os pontos/dígitos acima são puramente visuais */}
          <span className="sr-only" role="status" aria-live="polite">
            {val.length} of {maxLength} digits entered
          </span>
        </div>
      )}

      <div role="group" aria-label="Number pad" className="grid grid-cols-3 gap-(--spacing-sm)">
        {KEYS.map((key, i) => (
          <button
            key={i}
            type="button"
            disabled={key === ""}
            aria-label={key === "⌫" ? "Backspace" : undefined}
            onClick={() => press(key)}
            className={cn(
              "w-16 h-16 rounded-full text-body-title font-semibold transition-all duration-100",
              key === ""
                ? "invisible pointer-events-none"
                : key === "⌫"
                  ? "bg-graphite text-muted hover:bg-rule hover:text-foreground active:scale-95"
                  : "bg-raised border border-rule text-foreground hover:bg-graphite hover:border-patina/40 active:scale-95 active:bg-patina/10"
            )}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
