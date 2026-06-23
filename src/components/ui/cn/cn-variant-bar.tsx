"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import type { CnVariantMeta } from "@/lib/cn-registry";
import { cn } from "@/lib/utils";

/**
 * Variant selector shown on a Super component's docs page.
 * Renders one chip per variant; chips deep-link to `?<prop>=<value>`.
 * Variants with status "dev" carry an "Em desenvolvimento" badge.
 * Display + navigation only — per-family demo switching is wired separately.
 */
export function CnVariantBar({ variants }: { variants: CnVariantMeta[] }) {
  const pathname = usePathname();
  const params = useSearchParams();

  if (!variants.length) return null;

  const activeFor = (v: CnVariantMeta) => params.get(v.prop) === v.value;

  return (
    <>
      <style>{`
        .cnvb { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; align-items: center; }
        .cnvb-label {
          font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--ks-text-faint); margin-right: 0.25rem;
        }
        .cnvb-chip {
          display: inline-flex; align-items: center; gap: 0.375rem;
          padding: 0.3125rem 0.625rem; border-radius: 999px;
          font-size: 0.75rem; font-weight: 600; line-height: 1; text-decoration: none;
          border: 1px solid var(--ks-rule); color: var(--ks-text-faint);
          background: color-mix(in oklch, var(--ks-lacquer-raised) 70%, transparent);
          transition: border-color 120ms ease, color 120ms ease, background 120ms ease;
        }
        .cnvb-chip:hover { color: var(--ks-text); border-color: var(--ks-text-faint); }
        .cnvb-chip--active {
          color: var(--ks-primary);
          border-color: color-mix(in oklch, var(--ks-primary) 55%, transparent);
          background: color-mix(in oklch, var(--ks-primary) 12%, transparent);
        }
        .cnvb-dev {
          font-size: 0.5625rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase;
          padding: 0.0625rem 0.3125rem; border-radius: 999px; line-height: 1.5;
          background: color-mix(in oklch, var(--ks-warning, #b8860b) 20%, transparent);
          color: var(--ks-warning, #b8860b);
        }
      `}</style>

      <div className="cnvb" role="group" aria-label="Variantes do componente">
        <span className="cnvb-label">Variantes</span>
        {variants.map((v) => {
          const active = activeFor(v);
          const href = `${pathname}?${encodeURIComponent(v.prop)}=${encodeURIComponent(v.value)}`;
          return (
            <Link
              key={`${v.prop}:${v.value}`}
              href={href}
              className={cn("cnvb-chip", active && "cnvb-chip--active")}
              title={v.note}
              aria-current={active ? "true" : undefined}
            >
              {v.label}
              {v.status === "dev" && <span className="cnvb-dev">Em desenvolvimento</span>}
            </Link>
          );
        })}
      </div>
    </>
  );
}
