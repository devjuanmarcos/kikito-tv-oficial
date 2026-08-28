"use client";
import { cn } from "@/lib/utils";

import type { AspectRatioProps } from "./aspect-ratio.types";

/**
 * `children` é posicionado num wrapper `absolute inset-0` — ele PRECISA ocupar 100% de
 * largura/altura pra realmente exibir a proporção (`h-full w-full`, ou `<img>`/`<video>`
 * com `className="h-full w-full object-cover"`). Sem isso, o filho só ocupa a altura do
 * próprio conteúdo (ex: uma `<div>` com texto fica do tamanho do texto, não da proporção).
 */
export function AspectRatio({ children, ratio = 16 / 9, className, style }: AspectRatioProps) {
  return (
    <div
      style={{ paddingBottom: `${(1 / ratio) * 100}%`, position: "relative", ...style }}
      className={cn("w-full", className)}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
