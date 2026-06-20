"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";

import type { TreeTableProps, TreeTableRow } from "./tree-table.types";

function Row<T>({
  row,
  columns,
  depth,
  defaultExpanded,
}: {
  row: TreeTableRow<T>;
  columns: TreeTableProps<T>["columns"];
  depth: number;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <tr className="border-b border-rule transition-colors duration-100 last:border-b-0 hover:bg-raised">
        {columns.map((col, ci) => (
          <td key={col.key} className="px-[14px] py-[9px] align-middle text-body-callout text-foreground">
            {ci === 0 ? (
              <span className="inline-flex items-center gap-[6px]" style={{ paddingLeft: depth * 20 }}>
                {hasChildren ? (
                  <button
                    className="w-[18px] h-[18px] bg-transparent border border-rule rounded cursor-pointer inline-flex items-center justify-center text-muted text-body-caption flex-shrink-0 transition-colors duration-[120ms] hover:bg-float hover:border-patina"
                    onClick={() => setExpanded((e) => !e)}
                    aria-label={expanded ? "Recolher" : "Expandir"}
                  >
                    {expanded ? "−" : "+"}
                  </button>
                ) : (
                  <span className="inline-block w-[18px] h-[18px] flex-shrink-0" />
                )}
                {col.render ? col.render(row.data) : String((row.data as Record<string, unknown>)[col.key] ?? "")}
              </span>
            ) : col.render ? (
              col.render(row.data)
            ) : (
              String((row.data as Record<string, unknown>)[col.key] ?? "")
            )}
          </td>
        ))}
      </tr>
      {hasChildren &&
        expanded &&
        row.children!.map((child) => (
          <Row key={child.id} row={child} columns={columns} depth={depth + 1} defaultExpanded={defaultExpanded} />
        ))}
    </>
  );
}

export function TreeTable<T = Record<string, unknown>>({
  columns,
  rows,
  defaultExpanded = false,
  className,
  style,
}: TreeTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto border border-rule rounded-(--radius-md)", className)} style={style}>
      <table className="w-full border-collapse text-body-callout text-foreground">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-[14px] py-[10px] text-left text-body-caption font-bold uppercase tracking-[0.06em] text-muted border-b border-rule bg-sunken whitespace-nowrap"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <Row key={row.id} row={row} columns={columns} depth={0} defaultExpanded={defaultExpanded} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
