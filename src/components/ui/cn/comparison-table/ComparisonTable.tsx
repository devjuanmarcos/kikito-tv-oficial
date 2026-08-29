import React from "react";

import { Badge } from "@/components/ui/cn/badge/Badge";
import { Tooltip } from "@/components/ui/cn/tooltip/Tooltip";
import { cn } from "@/lib/utils";

import type { ComparisonTableProps } from "./comparison-table.types";

function CellValue({ value }: { value: boolean | string | React.ReactNode }) {
  if (value === true)
    return (
      <span className="text-success font-bold text-body-paragraph" aria-label="included">
        ✓
      </span>
    );
  if (value === false)
    return (
      <span className="text-faint font-bold text-body-paragraph" aria-label="not included">
        ✕
      </span>
    );
  return <span>{value as React.ReactNode}</span>;
}

export function ComparisonTable({ columns, rows, stickyHeader = false, className, style }: ComparisonTableProps) {
  let lastGroup: string | undefined;

  return (
    <div className={cn("w-full overflow-x-auto rounded-(--radius-md) border border-rule", className)} style={style}>
      <table className="w-full border-collapse text-body-callout">
        <thead className={cn("bg-raised", stickyHeader && "sticky top-0 z-10")}>
          <tr>
            <th
              scope="col"
              className="text-left px-(--spacing-lg) py-(--spacing-md) text-faint font-medium border-b border-rule"
              style={{ width: "30%" }}
            />
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "text-center px-(--spacing-lg) py-(--spacing-md) font-semibold border-b border-rule",
                  col.highlight ? "text-patina bg-patina-soft" : "text-foreground"
                )}
              >
                <div className="flex items-center justify-center gap-(--spacing-xs)">
                  {col.label}
                  {col.badge && (
                    <Badge intent="primary" variant="solid" size="sm">
                      {col.badge}
                    </Badge>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isNewGroup = row.group && row.group !== lastGroup;
            if (isNewGroup) lastGroup = row.group;
            return (
              <React.Fragment key={i}>
                {isNewGroup && (
                  <tr className="bg-canvas">
                    <td
                      colSpan={columns.length + 1}
                      className="px-(--spacing-lg) py-(--spacing-sm) text-body-caption font-bold uppercase tracking-widest text-faint border-b border-rule"
                    >
                      {row.group}
                    </td>
                  </tr>
                )}
                <tr className="border-b border-rule last:border-0 hover:bg-raised/60 transition-colors">
                  <th scope="row" className="px-(--spacing-lg) py-(--spacing-md) text-foreground font-normal text-left">
                    <div className="flex items-center gap-(--spacing-xs)">
                      {row.feature}
                      {row.tooltip && (
                        <Tooltip content={row.tooltip}>
                          <button
                            type="button"
                            // below scale minimum: glifo "?" decorativo dentro de um badge de 16px,
                            // não conteúdo primário
                            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-graphite text-faint text-[0.5625rem] font-bold cursor-help"
                            aria-label={`More info: ${row.feature}`}
                          >
                            ?
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </th>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "text-center px-(--spacing-lg) py-(--spacing-md)",
                        col.highlight && "bg-patina-soft"
                      )}
                    >
                      <CellValue value={row.values[col.key] ?? false} />
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
