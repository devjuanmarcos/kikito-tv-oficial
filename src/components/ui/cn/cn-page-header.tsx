import Link from 'next/link'

interface CnPageHeaderProps {
  group: string
  groupLabel: string
  title: string
  description: string
}

export function CnPageHeader({ group, groupLabel, title, description }: CnPageHeaderProps) {
  return (
    <header className="mb-8">
      {/* ── Breadcrumbs ─────────────────────────────────────────────── */}
      <nav
        className="flex items-center gap-1 text-body-callout text-muted mb-5"
        aria-label="Navegação"
      >
        <Link href="/cn" className="hover:text-foreground transition-colors duration-100">
          CN
        </Link>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor"
          strokeWidth="1.75" className="text-faint flex-shrink-0" aria-hidden>
          <path d="M3.5 1.5L6.5 5L3.5 8.5"/>
        </svg>
        <Link
          href={`/cn/${group}`}
          className="hover:text-foreground transition-colors duration-100"
        >
          {groupLabel}
        </Link>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor"
          strokeWidth="1.75" className="text-faint flex-shrink-0" aria-hidden>
          <path d="M3.5 1.5L6.5 5L3.5 8.5"/>
        </svg>
        <span className="text-foreground font-medium">{title}</span>
      </nav>

      {/* ── Title row ───────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 mb-2.5">
        <h1 className="text-heading-04 font-bold text-foreground leading-tight tracking-tight">
          {title}
        </h1>
        <span className="mt-[0.4375rem] inline-flex items-center px-2 py-0.5 text-[0.5625rem] font-bold tracking-[0.07em] uppercase rounded-pill bg-patina-soft text-patina shrink-0">
          {groupLabel}
        </span>
      </div>

      {/* ── Description ─────────────────────────────────────────────── */}
      <p className="text-body-paragraph leading-relaxed text-muted max-w-2xl">
        {description}
      </p>
    </header>
  )
}
