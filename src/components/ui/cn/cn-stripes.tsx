/* ── CnStripes ────────────────────────────────────────────────────────────
 * Decorative full-height hatched column (diagonal -45deg pattern), bordered
 * left + right by rules. Mirrors the Aceternity grid divider that sits
 * between the sidebar and the content. Purely ornamental — aria-hidden.
 * ─────────────────────────────────────────────────────────────────────── */
export function CnStripes({ className }: { className?: string }) {
  return (
    <>
      <style>{`
        .cn-stripes {
          width: 1.5rem; flex-shrink: 0; align-self: stretch;
          border-left: 1px solid var(--ks-rule);
          border-right: 1px solid var(--ks-rule);
          background-image: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 4px,
            color-mix(in oklch, var(--ks-text) 7%, transparent) 4px,
            color-mix(in oklch, var(--ks-text) 7%, transparent) 5px
          );
        }
        @media (max-width: 859px) { .cn-stripes { display: none; } }
      `}</style>
      <div className={`cn-stripes ${className ?? ""}`} aria-hidden />
    </>
  );
}
