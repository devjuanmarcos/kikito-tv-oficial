"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CnThemeToggle } from "@/components/ui/cn/cn-theme-toggle";
import { cn } from "@/lib/utils";

/* ── Top nav links ────────────────────────────────────────────────────── */
const NAV = [
  { label: "Componentes", href: "/cn" },
  { label: "Blocos", href: "/cn#blocos" },
  { label: "Templates", href: "/cn#templates" },
  { label: "Changelog", href: "/cn#changelog" },
];

/* ── CnHeader ─────────────────────────────────────────────────────────── */
export function CnHeader() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        .cnh {
          position: sticky; top: 0; z-index: 50;
          height: 3.25rem; flex-shrink: 0;
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0 0.875rem 0 1rem;
          border-bottom: 1px solid var(--ks-rule);
          background: color-mix(in oklch, var(--ks-lacquer) 82%, transparent);
          backdrop-filter: saturate(150%) blur(10px);
          -webkit-backdrop-filter: saturate(150%) blur(10px);
        }

        .cnh-brand {
          display: flex; align-items: baseline; gap: 0.4375rem;
          text-decoration: none; flex-shrink: 0;
        }
        .cnh-brand-mark {
          font-size: 0.9375rem; font-weight: 800; letter-spacing: -0.02em;
          color: var(--ks-text); line-height: 1;
        }
        .cnh-brand-mark span { color: var(--ks-patina); }
        .cnh-brand-tag {
          font-size: 0.5625rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ks-text-faint);
          padding: 0.125rem 0.375rem; line-height: 1;
          border: 1px solid var(--ks-rule); border-radius: 999px;
        }

        .cnh-nav { display: none; align-items: center; gap: 0.125rem; margin-left: 0.5rem; }
        @media (min-width: 860px) { .cnh-nav { display: flex; } }
        .cnh-nav-link {
          position: relative; padding: 0.375rem 0.6875rem; border-radius: var(--ks-radius-sm);
          font-size: 0.8125rem; font-weight: 500; color: var(--ks-text-faint);
          text-decoration: none; line-height: 1;
          transition: color 120ms ease, background 120ms ease;
        }
        .cnh-nav-link:hover {
          color: var(--ks-text);
          background: color-mix(in oklch, var(--ks-lacquer-raised) 70%, transparent);
        }
        .cnh-nav-link--active { color: var(--ks-text); }
        .cnh-nav-link--active::after {
          content: ''; position: absolute; left: 0.6875rem; right: 0.6875rem; bottom: -0.0625rem;
          height: 2px; border-radius: 999px; background: var(--ks-patina);
        }

        .cnh-spacer { flex: 1; }

        .cnh-search {
          display: none; align-items: center; gap: 0.5rem;
          height: 1.875rem; padding: 0 0.5rem 0 0.625rem;
          border: 1px solid var(--ks-rule); border-radius: var(--ks-radius-base);
          background: color-mix(in oklch, var(--ks-lacquer-raised) 70%, transparent);
          color: var(--ks-text-faint); font-size: 0.8125rem; cursor: text;
          transition: border-color 140ms ease, color 140ms ease;
        }
        @media (min-width: 640px) { .cnh-search { display: inline-flex; } }
        .cnh-search:hover { border-color: var(--ks-text-faint); color: var(--ks-text); }
        .cnh-kbd {
          font-size: 0.625rem; font-weight: 600; line-height: 1;
          padding: 0.1875rem 0.3125rem; border-radius: 4px;
          border: 1px solid var(--ks-rule); color: var(--ks-text-faint);
          background: var(--ks-lacquer);
        }

        .cnh-rule { width: 1px; height: 1.25rem; background: var(--ks-rule); flex-shrink: 0; }

        .cnh-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 1.75rem; height: 1.75rem; border-radius: var(--ks-radius-sm);
          border: 1px solid var(--ks-rule); background: transparent;
          color: var(--ks-text-faint); flex-shrink: 0;
          transition: color 140ms ease, border-color 140ms ease, background 140ms ease;
        }
        .cnh-icon:hover {
          color: var(--ks-text); border-color: var(--ks-text-faint);
          background: var(--ks-lacquer-raised);
        }

        .cnh-login {
          display: none; padding: 0.375rem 0.6875rem; border-radius: var(--ks-radius-sm);
          font-size: 0.8125rem; font-weight: 600; color: var(--ks-text-faint);
          text-decoration: none; line-height: 1; white-space: nowrap;
          transition: color 120ms ease, background 120ms ease;
        }
        @media (min-width: 520px) { .cnh-login { display: inline-flex; align-items: center; } }
        .cnh-login:hover {
          color: var(--ks-text);
          background: color-mix(in oklch, var(--ks-lacquer-raised) 70%, transparent);
        }

        .cnh-signup {
          display: inline-flex; align-items: center; gap: 0.375rem;
          padding: 0.40625rem 0.8125rem; border-radius: var(--ks-radius-sm);
          font-size: 0.8125rem; font-weight: 700; line-height: 1; white-space: nowrap;
          color: var(--ks-patina-fg); background: var(--ks-patina);
          text-decoration: none; border: 1px solid transparent;
          box-shadow: 0 1px 0 color-mix(in oklch, var(--ks-patina) 60%, black) inset;
          transition: background 140ms ease, transform 120ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cnh-signup:hover { background: var(--ks-patina-hover); transform: translateY(-1px); }
        .cnh-signup:active { transform: translateY(0); }
      `}</style>

      <header className="cnh">
        {/* Brand */}
        <Link href="/cn" className="cnh-brand" aria-label="Kikito CN — início">
          <span className="cnh-brand-mark">
            Kikito<span>CN</span>
          </span>
          <span className="cnh-brand-tag">Design System</span>
        </Link>

        {/* Primary nav */}
        <nav className="cnh-nav" aria-label="Navegação principal">
          {NAV.map((item) => {
            const active = item.href === "/cn" && pathname.includes("/cn");
            return (
              <Link key={item.label} href={item.href} className={cn("cnh-nav-link", active && "cnh-nav-link--active")}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="cnh-spacer" />

        {/* Search hint */}
        <button
          type="button"
          className="cnh-search"
          onClick={() => {
            const ev = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true });
            window.dispatchEvent(ev);
          }}
          aria-label="Buscar componentes"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="7" cy="7" r="5" />
            <path d="m12.5 12.5-3-3" />
          </svg>
          Buscar
          <span className="cnh-kbd">⌘K</span>
        </button>

        {/* GitHub */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer noopener"
          className="cnh-icon"
          aria-label="Repositório no GitHub"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.31-.54-1.53.12-3.19 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.19.77.84 1.24 1.92 1.24 3.23 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
          </svg>
        </a>

        <CnThemeToggle />

        <span className="cnh-rule" aria-hidden />

        {/* Auth */}
        <Link href="/auth" className="cnh-login">
          Entrar
        </Link>
        <Link href="/auth" className="cnh-signup">
          Cadastrar
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 3l5 5-5 5" />
          </svg>
        </Link>
      </header>
    </>
  );
}
