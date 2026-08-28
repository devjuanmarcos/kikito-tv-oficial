"use client";
import { cn } from "@/lib/utils";

import type { NoteCardColor, NoteCardProps } from "./note-card.types";

/* no token equivalent: cores de "papel de nota adesiva" (post-it) são deliberadamente
   fixas e independentes do tema claro/escuro — representam papel físico colorido, não
   um acento de marca que deveria se adaptar ao tema (mesmo raciocínio já documentado
   pro terminal escuro do CnInstallBlock/TerminalBlock). Pares de contraste conferidos
   manualmente (ratio alto em todos os 6, tons claros de fundo + tons escuros de texto). */
const COLOR_CLS: Record<NoteCardColor, string> = {
  yellow: "bg-[#fef08a] text-[#713f12]",
  blue: "bg-[#bfdbfe] text-[#1e3a5f]",
  green: "bg-[#bbf7d0] text-[#14532d]",
  pink: "bg-[#fbcfe8] text-[#831843]",
  purple: "bg-[#ddd6fe] text-[#4c1d95]",
  orange: "bg-[#fed7aa] text-[#7c2d12]",
};

export function NoteCard({ children, color = "yellow", rotate = 0, author, date, className, style }: NoteCardProps) {
  return (
    <div
      style={{ transform: rotate !== 0 ? `rotate(${rotate}deg)` : undefined, ...style }}
      className={cn(
        "relative p-(--spacing-lg) rounded-(--radius-md) shadow-[2px_4px_12px_oklch(0%_0_0/0.2)] min-w-[120px]",
        COLOR_CLS[color],
        className
      )}
    >
      {/* Pin decoration — bg-white/border-white literais: glare/reflexo de luz do pino
          metálico, deliberadamente branco independente da cor da nota ou do tema (mesma
          exceção documentada no CLAUDE.md pra gradientes/glares) */}
      <div
        aria-hidden="true"
        className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/60 shadow-[0_1px_3px_oklch(0%_0_0/0.3)] border border-white/40"
      />

      {/* div, não <p>: children é arbitrário e frequentemente contém blocos (<p>, <h*>) —
          um <p> aninhando outro <p> é HTML inválido, o browser corrige sozinho e quebra a
          estrutura do DOM real (achado via warning "cannot be a descendant of" no console) */}
      <div className="text-body-callout font-medium leading-snug mt-(--spacing-2xs)">{children}</div>

      {(author || date) && (
        // text-[0.65rem]: below scale minimum, metadado secundário (autor/data), não conteúdo primário
        <div className="flex items-center justify-between mt-(--spacing-md) pt-(--spacing-sm) border-t border-current/20 text-[0.65rem] font-medium opacity-60">
          {author && <span>{author}</span>}
          {date && <span>{date}</span>}
        </div>
      )}
    </div>
  );
}
