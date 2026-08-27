"use client";
import React from "react";

import { cn } from "@/lib/utils";

import type { PaginationProps } from "./pagination.types";

const ChevFirst = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="11 17 6 12 11 7" />
    <polyline points="18 17 13 12 18 7" />
  </svg>
);
const ChevLast = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="13 17 18 12 13 7" />
    <polyline points="6 17 11 12 6 7" />
  </svg>
);
const ChevLeft = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function buildPages(page: number, total: number, siblings: number): (number | "…left" | "…right")[] {
  if (total <= 1) return [0];
  const pages: (number | "…left" | "…right")[] = [];
  const left = Math.max(1, page - siblings);
  const right = Math.min(total - 2, page + siblings);
  pages.push(0);
  if (left > 1) pages.push("…left");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 2) pages.push("…right");
  if (total > 1) pages.push(total - 1);
  return pages;
}

const SIZE_VARS: Record<string, string> = {
  sm: "[--pg-h:1.75rem] [--pg-fs:0.75rem] [--pg-min:1.75rem] [--pg-px:0.5rem]",
  md: "[--pg-h:2rem] [--pg-fs:0.8125rem] [--pg-min:2rem] [--pg-px:0.625rem]",
};

// h-[--pg-h] etc (bracket cru) confirmado quebrado em 2026-08-27 — usa sintaxe de parenteses
const BTN_BASE =
  "inline-flex items-center justify-center h-(--pg-h) min-w-(--pg-min) px-(--pg-px) text-(length:--pg-fs) font-medium font-[inherit] text-faint bg-transparent border border-transparent rounded-(--radius-sm) cursor-pointer leading-none whitespace-nowrap shrink-0 transition-[background,color,border-color] duration-[120ms] [&>svg]:w-[calc(var(--pg-fs)+0.125rem)] [&>svg]:h-[calc(var(--pg-fs)+0.125rem)] hover:not-disabled:bg-graphite hover:not-disabled:text-foreground hover:not-disabled:border-rule active:not-disabled:bg-[color-mix(in_oklch,var(--ks-graphite)_80%,var(--ks-primary)_20%)] disabled:opacity-35 disabled:cursor-not-allowed";

export function Pagination({
  page,
  totalPages,
  onChange,
  size = "md",
  showEdges = true,
  siblings = 1,
  totalItems,
  pageSize,
  className,
  style,
}: PaginationProps) {
  const pages = buildPages(page, totalPages, siblings);

  const rangeLabel = (() => {
    if (totalItems === undefined || !pageSize) return null;
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, totalItems);
    return `${start}–${end} of ${totalItems}`;
  })();

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-1 flex-wrap", SIZE_VARS[size], className)}
      style={style}
    >
      {rangeLabel && (
        <>
          <span className="text-[length:--pg-fs] text-faint whitespace-nowrap px-[0.375rem] shrink-0">
            {rangeLabel}
          </span>
          <span className="flex-1" />
        </>
      )}

      {showEdges && (
        <button
          type="button"
          className={BTN_BASE}
          onClick={() => onChange(0)}
          disabled={page === 0}
          aria-label="First page"
        >
          <ChevFirst />
        </button>
      )}

      <button
        type="button"
        className={BTN_BASE}
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        aria-label="Previous page"
      >
        <ChevLeft />
      </button>

      {pages.map((p) =>
        p === "…left" || p === "…right" ? (
          <span
            key={p}
            className="inline-flex items-center justify-center h-(--pg-h) min-w-(--pg-min) text-(length:--pg-fs) text-faint tracking-[0.05em] shrink-0 pointer-events-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={cn(
              BTN_BASE,
              p === page && "bg-patina! text-patina-fg! border-transparent! hover:bg-patina! hover:brightness-[1.08]"
            )}
            onClick={() => onChange(p as number)}
            aria-label={`Page ${(p as number) + 1}`}
            aria-current={p === page ? "page" : undefined}
          >
            {(p as number) + 1}
          </button>
        )
      )}

      <button
        type="button"
        className={BTN_BASE}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Next page"
      >
        <ChevRight />
      </button>

      {showEdges && (
        <button
          type="button"
          className={BTN_BASE}
          onClick={() => onChange(totalPages - 1)}
          disabled={page >= totalPages - 1}
          aria-label="Last page"
        >
          <ChevLast />
        </button>
      )}
    </nav>
  );
}
