import type React from "react";

import { cn } from "@/lib/utils";

import type { ContextCardProps } from "./context-card.types";

/**
 * ContextCard — revela `children` num popup flutuante quando o usuário faz hover
 * ou dá foco em `trigger` (100% via CSS, `:hover`/`:focus-within`, sem JS).
 *
 * ⚠️ Acessibilidade: como a revelação depende de `:focus-within` no wrapper, `trigger`
 * PRECISA ser (ou conter) um elemento nativamente focável (botão, link, input) — caso
 * contrário usuários de teclado não conseguem abrir o popup. Se o trigger não for
 * naturalmente focável, prefira `<Tooltip variant="card">` (absorve o antigo HoverCard),
 * que implementa a mesma revelação via JS e funciona com qualquer trigger.
 */
export function ContextCard({ trigger, children, placement = "top", width = 280, className, style }: ContextCardProps) {
  return (
    <>
      <style>{`
        .cc-root { position: relative; display: inline-block; }
        .cc-popup {
          position: absolute; z-index: 50;
          pointer-events: none; opacity: 0;
          transform: scale(0.95);
          transition: opacity 0.15s, transform 0.15s;
        }
        .cc-root:hover .cc-popup, .cc-root:focus-within .cc-popup {
          opacity: 1; transform: scale(1); pointer-events: auto;
        }
        .cc-popup[data-placement="top"]    { bottom: calc(100% + 8px); left: 50%; translate: -50% 0; }
        .cc-popup[data-placement="bottom"] { top: calc(100% + 8px); left: 50%; translate: -50% 0; }
        .cc-popup[data-placement="left"]   { right: calc(100% + 8px); top: 50%; translate: 0 -50%; }
        .cc-popup[data-placement="right"]  { left: calc(100% + 8px); top: 50%; translate: 0 -50%; }
      `}</style>
      <div className={cn("cc-root", className)} style={style}>
        {trigger}
        <div
          // rounded-[--radius] usava var --radius que nao existe no projeto (ficava 0px)
          // shadow: mesmo literal usado nos outros paineis flutuantes do CN (Select/Command/DropdownMenu)
          className="cc-popup bg-raised border border-rule rounded-(--radius-md) shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.35),0_0_0_1px_oklch(0%_0_0/0.06)]"
          data-placement={placement}
          style={{ width }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
