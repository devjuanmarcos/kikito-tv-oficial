"use client";
import { cn } from "@/lib/utils";

import type { KbdSize, KbdVariant, KbdProps, KbdSequenceProps } from "./kbd.types";

/** Special key-name → symbol map (used when `symbols` is enabled). */
const KBD_SPECIAL: Record<string, string> = {
  cmd: "⌘",
  meta: "⌘",
  ctrl: "⌃",
  control: "⌃",
  alt: "⌥",
  opt: "⌥",
  option: "⌥",
  shift: "⇧",
  enter: "↵",
  return: "↵",
  delete: "⌫",
  backspace: "⌫",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
  esc: "Esc",
  escape: "Esc",
  tab: "⇥",
  space: "␣",
};

export function formatKbdKey(k: string): string {
  return KBD_SPECIAL[k.toLowerCase()] ?? k.toUpperCase();
}

// text-[Nrem]/rounded-[Npx]: escala própria do componente por size, sem match exato nas escalas
// de tipografia (sm/md abaixo do mínimo de 12px) e radius (entre --radius-xs 2px e --radius-sm 6px)
const SIZE: Record<KbdSize, string> = {
  sm: "h-4 min-w-[1rem] px-1   text-[0.6rem]  rounded-[3px]",
  md: "h-5 min-w-[1.25rem] px-1.5 text-[0.7rem]  rounded-[4px]",
  lg: "h-6 min-w-[1.5rem] px-2   text-[0.8rem]  rounded-[4px]",
};

const VARIANT: Record<KbdVariant, string> = {
  default: "bg-graphite border border-rule text-foreground shadow-[0_1px_0_0_var(--ks-rule)]",
  ghost: "bg-transparent border border-rule text-faint",
  // text-[color:var(--color-base)] (não `text-base`): achado real — `text-base` nesta base
  // é AMBÍGUO, o Tailwind gera tanto a cor (`--color-base` do tema) quanto o font-size nativo
  // (1rem) sob o mesmo nome. `tailwind-merge` (dentro do `cn()`) só reconhece a face
  // font-size (não sabe da customização de cor) e por isso descartava o `text-[Nrem]` de
  // `SIZE[size]` como "conflito" — todo Kbd `variant="solid"` renderizava sempre a 16px,
  // ignorando a prop `size`. Forma explícita `color:` evita a ambiguidade nas duas pontas.
  solid: "bg-foreground text-[color:var(--color-base)] border border-foreground",
};

export function Kbd({ size = "md", variant = "default", className, children, ...props }: KbdProps) {
  return (
    <kbd
      {...props}
      className={cn(
        "inline-flex items-center justify-center font-mono font-medium select-none leading-none",
        SIZE[size],
        VARIANT[variant],
        className
      )}
    >
      {children}
    </kbd>
  );
}

export function KbdSequence({
  keys,
  separator = "⌘",
  size = "md",
  variant = "default",
  symbols = false,
}: KbdSequenceProps) {
  return (
    <span className="inline-flex items-center gap-(--spacing-2xs)">
      {keys.map((k, i) => (
        <span key={i} className="inline-flex items-center gap-(--spacing-2xs)">
          {i > 0 && (
            // text-[0.7rem]: below scale minimum, glifo separador decorativo
            <span aria-hidden="true" className="text-faint text-[0.7rem] select-none">
              {separator ?? "+"}
            </span>
          )}
          <Kbd size={size} variant={variant}>
            {symbols ? formatKbdKey(k) : k}
          </Kbd>
        </span>
      ))}
    </span>
  );
}
