import { cn } from "@/lib/utils";

import type { StatusBadgeProps } from "./status-badge.types";

const LABELS: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  busy: "Busy",
  away: "Away",
  idle: "Idle",
};

// classes estáticas (não CSS var + inline style) — status é um enum fixo de 5 valores,
// não uma cor dinâmica arbitrária, Tailwind alcança direto. Mesmo padrão já usado no
// dot de status do Avatar.tsx (STATUS_COLOR ali também são classes bg-* literais)
const DOT_COLOR: Record<string, string> = {
  online: "bg-success",
  offline: "bg-faint",
  busy: "bg-danger",
  away: "bg-warning",
  idle: "bg-info",
};

const SIZE_DOT: Record<string, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
};

const SIZE_LABEL: Record<string, string> = {
  sm: "text-body-caption",
  md: "text-body-callout",
  lg: "text-body-callout",
};

export function StatusBadge({
  status,
  size = "md",
  showLabel = false,
  pulse = false,
  className,
  style,
}: StatusBadgeProps) {
  const isOffline = status === "offline";

  return (
    <span className={cn("inline-flex items-center gap-(--spacing-xs)", className)} style={style}>
      <span
        // achado real: a cor sozinha comunicava o status (Online/Busy/...) sem nenhuma
        // alternativa textual quando showLabel=false (default) — mesmo padrão já
        // resolvido no dot de status do Avatar.tsx (role="img" + aria-label). Quando
        // showLabel=true, o texto visível ao lado já cobre isso — dot vira decorativo
        // pra não duplicar o anúncio
        role={showLabel ? undefined : "img"}
        aria-label={showLabel ? undefined : LABELS[status]}
        aria-hidden={showLabel || undefined}
        className={cn("rounded-full shrink-0 relative", SIZE_DOT[size], DOT_COLOR[status], isOffline && "opacity-40")}
      >
        {pulse && status === "online" && (
          <span aria-hidden="true" className="absolute -inset-[3px] rounded-full opacity-40 animate-ping bg-success" />
        )}
      </span>
      {showLabel && <span className={cn("font-medium text-muted capitalize", SIZE_LABEL[size])}>{LABELS[status]}</span>}
    </span>
  );
}
