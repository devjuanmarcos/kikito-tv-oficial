import { cn } from "@/lib/utils";

import type { ServiceStatus, StatusGroup, StatusPageProps } from "./status-page.types";

const STATUS_LABELS: Record<ServiceStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
  maintenance: "Maintenance",
};

const OVERALL_LABELS: Record<ServiceStatus, string> = {
  operational: "All systems operational",
  degraded: "Some systems degraded",
  outage: "Major outage in progress",
  maintenance: "Scheduled maintenance",
};

const STATUS_DOT_CLS: Record<ServiceStatus, string> = {
  operational: "bg-success",
  degraded: "bg-warning",
  outage: "bg-danger",
  maintenance: "bg-info",
};

const STATUS_LABEL_CLS: Record<ServiceStatus, string> = {
  operational: "text-success",
  degraded: "text-warning",
  outage: "text-danger",
  maintenance: "text-info",
};

const OVERALL_BG: Record<ServiceStatus, string> = {
  operational: "bg-success-soft text-success",
  degraded: "bg-warning-soft text-warning",
  outage: "bg-danger-soft text-danger",
  maintenance: "bg-info-soft text-info",
};

function formatDate(d: Date | string | undefined): string {
  if (!d) return "";
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toLocaleString();
}

// Achado real: registry/tipo documentavam overallStatus como "calculado
// automaticamente se omitido", mas o componente só tinha um default estático
// ("operational") — nenhum cálculo existia. Implementado de verdade: pior
// status entre todos os serviços de todos os grupos, por severidade.
const STATUS_SEVERITY: Record<ServiceStatus, number> = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  outage: 3,
};

function computeOverallStatus(groups: StatusGroup[]): ServiceStatus {
  let worst: ServiceStatus = "operational";
  for (const group of groups) {
    for (const svc of group.services) {
      if (STATUS_SEVERITY[svc.status] > STATUS_SEVERITY[worst]) worst = svc.status;
    }
  }
  return worst;
}

export function StatusPage({
  groups,
  title = "System Status",
  lastUpdated,
  overallStatus,
  className,
  style,
}: StatusPageProps) {
  const effectiveStatus = overallStatus ?? computeOverallStatus(groups);
  return (
    <div className={cn("w-full max-w-2xl mx-auto px-(--spacing-lg) py-(--spacing-2xl)", className)} style={style}>
      <div className="flex items-start justify-between gap-(--spacing-lg) mb-(--spacing-2xl)">
        <div>
          <h2 className="text-body-title font-extrabold text-foreground mb-(--spacing-sm)">{title}</h2>
          <div
            className={cn(
              "inline-flex items-center gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-xs) rounded-full text-body-callout font-semibold",
              OVERALL_BG[effectiveStatus]
            )}
          >
            {/* dot decorativo: o texto ao lado já diz o status por extenso */}
            <span aria-hidden="true" className={cn("w-2 h-2 rounded-full shrink-0", STATUS_DOT_CLS[effectiveStatus])} />
            {OVERALL_LABELS[effectiveStatus]}
          </div>
        </div>
        {lastUpdated && (
          <span className="text-body-caption text-faint whitespace-nowrap pt-(--spacing-2xs)">
            Updated {formatDate(lastUpdated)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-(--spacing-lg)">
        {groups.map((group) => (
          // rounded-[--radius]: var --radius nao existe no projeto (ficava 0px) e bracket cru quebrado — usa token real
          <div key={group.group} className="bg-raised border border-rule rounded-(--radius-md) overflow-hidden">
            {/* px-5/py-3.5 abaixo: sem match exato na escala de spacing */}
            <div className="px-5 py-(--spacing-md) border-b border-rule">
              {/* opacity-60 cru em text-foreground diluía o nome do grupo (informação
                  primária de navegação, não decorativa) — regra de ouro do CLAUDE.md
                  pede text-muted pra esse caso, mesma categoria já corrigida no PriceTable */}
              <span className="text-body-callout font-bold text-muted uppercase tracking-[0.06em]">{group.group}</span>
            </div>
            {group.services.map((svc, i) => (
              <div
                key={svc.name}
                className={cn(
                  "flex items-center justify-between gap-(--spacing-lg) px-5 py-3.5",
                  i > 0 && "border-t border-rule"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-body-callout font-semibold text-foreground">{svc.name}</div>
                  {svc.description && (
                    <div className="text-body-caption text-faint mt-(--spacing-3xs)">{svc.description}</div>
                  )}
                </div>
                <div
                  className={cn(
                    "flex items-center gap-(--spacing-xs) text-body-caption font-semibold shrink-0",
                    STATUS_LABEL_CLS[svc.status]
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn("w-1.5 h-1.5 rounded-full shrink-0", STATUS_DOT_CLS[svc.status])}
                  />
                  {STATUS_LABELS[svc.status]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
