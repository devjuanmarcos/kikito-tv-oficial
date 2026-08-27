import React from "react";

import { cn } from "@/lib/utils";

import type { ServiceStatus, StatusPageProps } from "./status-page.types";

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

export function StatusPage({
  groups,
  title = "System Status",
  lastUpdated,
  overallStatus = "operational",
  className,
  style,
}: StatusPageProps) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto px-4 py-8", className)} style={style}>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-body-title font-extrabold text-foreground mb-2">{title}</h2>
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-body-callout font-semibold",
              OVERALL_BG[overallStatus]
            )}
          >
            <span className={cn("w-2 h-2 rounded-full shrink-0", STATUS_DOT_CLS[overallStatus])} />
            {OVERALL_LABELS[overallStatus]}
          </div>
        </div>
        {lastUpdated && (
          <span className="text-body-caption text-faint whitespace-nowrap pt-1">Updated {formatDate(lastUpdated)}</span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          // rounded-[--radius]: var --radius nao existe no projeto (ficava 0px) e bracket cru quebrado — usa token real
          <div key={group.group} className="bg-raised border border-rule rounded-(--radius-md) overflow-hidden">
            <div className="px-5 py-3 border-b border-rule">
              <span className="text-body-callout font-bold text-foreground opacity-60 uppercase tracking-[0.06em]">
                {group.group}
              </span>
            </div>
            {group.services.map((svc, i) => (
              <div
                key={svc.name}
                className={cn("flex items-center justify-between gap-4 px-5 py-3.5", i > 0 && "border-t border-rule")}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-body-callout font-semibold text-foreground">{svc.name}</div>
                  {svc.description && <div className="text-body-caption text-faint mt-0.5">{svc.description}</div>}
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-body-caption font-semibold shrink-0",
                    STATUS_LABEL_CLS[svc.status]
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", STATUS_DOT_CLS[svc.status])} />
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
