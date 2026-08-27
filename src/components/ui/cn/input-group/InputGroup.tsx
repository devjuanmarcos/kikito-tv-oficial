"use client";
import { cn } from "@/lib/utils";

import type { InputGroupSize, InputGroupProps } from "./input-group.types";

// Escala própria do componente (padding/dimensão por tier de size). text-[0.75rem] (tier
// sm) bate exato com o token text-body-caption (12px) — corrigido abaixo, os demais ficam
// como estão (dimensão contínua por tier).
const SIZE_ADDON: Record<InputGroupSize, string> = {
  sm: "px-2.5 text-body-caption min-h-[1.875rem]",
  md: "px-3   text-body-callout min-h-[2.25rem]",
  lg: "px-3.5 text-body-paragraph min-h-[2.625rem]",
};

function isTextAddon(node: React.ReactNode): boolean {
  return typeof node === "string" || typeof node === "number";
}

function AddonWrap({
  children,
  size,
  side,
}: {
  children: React.ReactNode;
  size: InputGroupSize;
  side: "left" | "right";
}) {
  const isText = isTextAddon(children);
  if (!isText) {
    return (
      <span
        className={cn(
          "shrink-0 flex items-center justify-center text-faint",
          // pl-2.5/pr-2.5 (0.625rem): sem match exato na escala de spacing
          side === "left" ? "pl-2.5 pr-(--spacing-xs)" : "pl-(--spacing-xs) pr-2.5"
        )}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "shrink-0 flex items-center bg-graphite border-rule text-faint font-medium select-none whitespace-nowrap",
        SIZE_ADDON[size],
        side === "left" ? "border-r" : "border-l"
      )}
    >
      {children}
    </span>
  );
}

/**
 * `disabled`/`invalid` só afetam a aparência e o `pointer-events` do wrapper — o `<input>`
 * real passado como `children` continua focável/editável por teclado a menos que o
 * consumidor também passe `disabled`/`aria-invalid` pra ele diretamente. Isso é intencional
 * (o wrapper não tenta clonar/injetar props no filho), mas documentado aqui pra não passar
 * despercebido: sempre espelhar `disabled`/`invalid` no input real também.
 */
export function InputGroup({
  children,
  prefix,
  suffix,
  size = "md",
  disabled = false,
  invalid = false,
  className,
  style,
}: InputGroupProps) {
  return (
    <div
      style={style}
      className={cn(
        "flex items-stretch w-full rounded-(--radius-md) border overflow-hidden",
        "bg-raised transition-[border-color] duration-[120ms]",
        "focus-within:border-patina",
        invalid ? "border-danger" : "border-rule",
        disabled ? "opacity-50 pointer-events-none bg-graphite" : "",
        className
      )}
    >
      {prefix !== undefined && (
        <AddonWrap size={size} side="left">
          {prefix}
        </AddonWrap>
      )}
      <div className="flex-1 min-w-0 flex items-stretch [&>*]:w-full [&>*]:border-0 [&>*]:outline-none [&>*]:bg-transparent [&>*]:text-foreground">
        {children}
      </div>
      {suffix !== undefined && (
        <AddonWrap size={size} side="right">
          {suffix}
        </AddonWrap>
      )}
    </div>
  );
}
