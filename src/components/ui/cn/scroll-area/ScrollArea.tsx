import type React from "react";

import { cn } from "@/lib/utils";

import type { ScrollAreaProps } from "./scroll-area.types";

const ORIENTATION_CLS: Record<string, string> = {
  vertical: "overflow-x-hidden overflow-y-auto",
  horizontal: "overflow-x-auto overflow-y-hidden",
  both: "overflow-auto",
};

// mask-image estático (não reage à posição de scroll) — mesma técnica das origens
// (scroll-area-02/03.tsx do shadcndashboard), 8px de fade nas duas pontas do eixo.
const FADE_EDGES_CLS: Record<string, string> = {
  vertical: "[mask-image:linear-gradient(to_bottom,transparent,black_8px,black_calc(100%-8px),transparent)]",
  horizontal: "[mask-image:linear-gradient(to_right,transparent,black_8px,black_calc(100%-8px),transparent)]",
};

export function ScrollArea({
  children,
  orientation = "vertical",
  maxHeight,
  maxWidth,
  fadeEdges = false,
  className,
  style,
}: ScrollAreaProps) {
  const maxStyle: React.CSSProperties = {};
  if (maxHeight) maxStyle.maxHeight = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  if (maxWidth) maxStyle.maxWidth = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;

  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      {/* Sem tabIndex, um viewport com overflow não é alcançável via teclado
          (só scroll de mouse/touch/roda) — padrão recomendado pela WAI-ARIA
          Authoring Practices pra "scrollable region" sem outro descendente
          focável. jsx-a11y não tem exceção nativa pra esse padrão porque
          normalmente pede um `role` interativo, que não se aplica aqui
          (região de scroll genérica, não um widget). */}
      <div
        tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
        className={cn(
          "w-full h-full [scrollbar-width:thin] [scrollbar-color:var(--ks-rule)_transparent]",
          "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-patina",
          "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:h-[6px]",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-rule [&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb:hover]:bg-[color-mix(in_srgb,var(--ks-text-muted)_50%,transparent)]",
          "[&::-webkit-scrollbar-corner]:bg-transparent",
          ORIENTATION_CLS[orientation] ?? ORIENTATION_CLS.vertical,
          fadeEdges && FADE_EDGES_CLS[orientation]
        )}
        style={maxStyle}
      >
        {children}
      </div>
    </div>
  );
}
