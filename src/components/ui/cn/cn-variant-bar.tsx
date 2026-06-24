"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { ResolvedVariant } from "@/lib/cn-registry";
import { cn } from "@/lib/utils";

/**
 * Variant selector shown on a Super component's docs page.
 * One chip for the base component + one per absorbed component. Selecting a
 * chip deep-links to `?v=<name>`; the page then renders that variant's real
 * demo and props. Pure navigation — state lives in the URL.
 */
export function CnVariantBar({ chips, active }: { chips: ResolvedVariant[]; active: string }) {
  const pathname = usePathname();

  if (chips.length <= 1) return null;

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
          padding: 0.3125rem 0.6875rem; border-radius: 999px;
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
        .cnvb-base { font-style: italic; }
      `}</style>

      <div className="cnvb" role="group" aria-label="Variantes do componente">
        <span className="cnvb-label">Variantes</span>
        {chips.map((c) => {
          const isActive = c.isBase ? active === "" : active === c.name;
          const href = c.isBase ? pathname : `${pathname}?v=${encodeURIComponent(c.name)}`;
          return (
            <Link
              key={c.isBase ? "__base__" : c.name}
              href={href}
              scroll={false}
              className={cn("cnvb-chip", c.isBase && "cnvb-base", isActive && "cnvb-chip--active")}
              aria-current={isActive ? "true" : undefined}
            >
              {c.isBase ? `${c.label} (base)` : c.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
