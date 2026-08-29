"use client";
/**
 * ContextCard — backward-compat wrapper.
 * Absorbed by the Tooltip Super component (`<Tooltip variant="card" />`, the former
 * HoverCard). Kept so existing imports of `ContextCard` keep working; new code should
 * use Tooltip directly.
 *
 * Aposentado na auditoria Kikito CN: a implementação original era uma reimplementação
 * standalone via CSS puro (`:hover`/`:focus-within`), duplicando o que `Tooltip
 * variant="card"` já faz via JS (com a vantagem de funcionar com qualquer trigger, não só
 * elementos nativamente focáveis, e ganhar `openDelay`/`closeDelay` reais — o antigo
 * `delay` daqui era documentado como não implementado).
 */
import type React from "react";

import { Tooltip } from "@/components/ui/cn/tooltip";

import type { ContextCardProps } from "./context-card.types";

export function ContextCard({
  trigger,
  children,
  placement = "top",
  width,
  delay,
  className,
  style,
}: ContextCardProps) {
  return (
    <Tooltip
      variant="card"
      side={placement}
      openDelay={delay}
      closeDelay={delay}
      className={className}
      style={{ width, ...style }}
      content={children}
    >
      {trigger as React.ReactElement}
    </Tooltip>
  );
}
