import type { ResolvedVariant } from "@/lib/cn-registry";

/**
 * Quick-link bar for a Super component's docs page. Lists each absorbed sibling
 * as a chip that smooth-scrolls to that sibling's real demo, rendered inline
 * further down the page (section id `cn-v-<name>`). Pure in-page navigation.
 */
export function CnVariantBar({ siblings }: { siblings: ResolvedVariant[] }) {
  if (!siblings.length) return null;

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
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
        .cnvb-chip:hover {
          color: var(--ks-primary);
          border-color: color-mix(in oklch, var(--ks-primary) 55%, transparent);
          background: color-mix(in oklch, var(--ks-primary) 12%, transparent);
        }
        .cnvb-chip svg { opacity: 0.6; }
      `}</style>

      <div className="cnvb" role="group" aria-label="Componentes unificados">
        <span className="cnvb-label">Unificados</span>
        {siblings.map((s) => (
          <a key={s.name} href={`#cn-v-${s.name}`} className="cnvb-chip">
            {s.label}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width={11}
              height={11}
              aria-hidden
            >
              <path d="M8 3v10M4 9l4 4 4-4" />
            </svg>
          </a>
        ))}
      </div>
    </>
  );
}
