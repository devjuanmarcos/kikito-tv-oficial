"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/cn/button";
import { CnThemeToggle } from "@/components/ui/cn/cn-theme-toggle";
import { SpotlightSearch } from "@/components/ui/cn/spotlight-search";
import type { SpotlightAction } from "@/components/ui/cn/spotlight-search";
import { CN_GROUPS, buildSearchIndex } from "@/lib/cn-registry";
import { cn } from "@/lib/utils";

/* ── Top nav links ────────────────────────────────────────────────────── */
const NAV = [
  { label: "Componentes", href: "/cn" },
  { label: "Blocos", href: "/cn#blocos" },
  { label: "Templates", href: "/cn#templates" },
  { label: "Changelog", href: "/cn#changelog" },
];

const SearchIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <circle cx="7" cy="7" r="5" />
    <path d="m12.5 12.5-3-3" />
  </svg>
);

const GitHubIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.31-.54-1.53.12-3.19 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.19.77.84 1.24 1.92 1.24 3.23 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
  </svg>
);

const ArrowIcon = (
  <svg
    width="14"
    height="14"
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
);

const MenuIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
  </svg>
);

/* ── CnHeader ─────────────────────────────────────────────────────────── */
export function CnHeader({ onMenuClick }: { onMenuClick?: () => void } = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  /* ⌘K / Ctrl+K opens the spotlight search */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const groupLabel = (id: string) => CN_GROUPS.find((g) => g.id === id)?.label ?? id;

  const actions = useMemo<SpotlightAction[]>(
    () => [
      {
        id: "home",
        label: "Início",
        description: "Visão geral do design system",
        group: "Páginas",
        icon: "🏠",
        onSelect: () => router.push("/cn"),
      },
      {
        id: "theme",
        label: "Alternar tema",
        description: "Modo claro / escuro",
        group: "Ações",
        icon: "🌓",
        onSelect: () => setTheme(theme === "dark" ? "light" : "dark"),
      },
      ...buildSearchIndex().map((e) => ({
        id: `${e.kind}:${e.href}`,
        label: e.kind === "variant" && e.status === "dev" ? `${e.label} — Em desenvolvimento` : e.label,
        description:
          e.kind === "variant"
            ? e.variant?.note ?? `Variante ${e.variant?.prop}="${e.variant?.value}"`
            : e.component.description,
        group: groupLabel(e.component.group),
        icon: e.kind === "variant" ? "🔹" : "🧩",
        onSelect: () => router.push(e.href),
      })),
    ],
    [router, setTheme, theme]
  );

  return (
    <>
      <style>{`
        .cnh {
          position: sticky; top: 0; z-index: 50;
          height: 3.25rem; flex-shrink: 0;
          display: flex; align-items: center; gap: 0.625rem;
          padding: 0 0.875rem 0 1rem;
          border-bottom: 1px solid var(--ks-rule);
          background: color-mix(in oklch, var(--ks-lacquer) 82%, transparent);
          backdrop-filter: saturate(150%) blur(10px);
          -webkit-backdrop-filter: saturate(150%) blur(10px);
        }

        .cnh-brand {
          display: flex; align-items: center; gap: 0.4375rem;
          text-decoration: none; flex-shrink: 0;
        }
        .cnh-brand-logo {
          width: 1.5rem; height: 1.5rem; border-radius: 9999px;
          object-fit: cover; flex-shrink: 0;
        }
        .cnh-brand-mark {
          font-size: 0.9375rem; font-weight: 800; letter-spacing: -0.02em;
          color: var(--ks-text); line-height: 1;
        }
        .cnh-brand-mark span { color: var(--ks-primary); }
        .cnh-brand-tag {
          font-size: 0.5625rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ks-text-faint);
          padding: 0.125rem 0.375rem; line-height: 1;
          border: 1px solid var(--ks-rule); border-radius: 999px;
        }

        .cnh-nav { display: none; align-items: center; gap: 0.125rem; margin-left: 0.5rem; }
        @media (min-width: 860px) { .cnh-nav { display: flex; } }

        .cnh-menu-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 2rem; height: 2rem; flex-shrink: 0; margin-right: -0.125rem;
          background: none; border: none; border-radius: var(--ks-radius-sm);
          color: var(--ks-text-faint); cursor: pointer;
          transition: color 120ms ease, background 120ms ease;
        }
        .cnh-menu-btn:hover { color: var(--ks-text); background: color-mix(in oklch, var(--ks-lacquer-raised) 70%, transparent); }
        /* mesmo breakpoint do .cnh-nav — sidebar vira drawer exatamente quando a nav principal
           some, pendência 0b da auditoria (sidebar não colapsava, squeeze a ~0px útil em mobile) */
        @media (min-width: 860px) { .cnh-menu-btn { display: none; } }
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
          height: 2px; border-radius: 999px; background: var(--ks-primary);
        }

        .cnh-spacer { flex: 1; }
        .cnh-rule { width: 1px; height: 1.25rem; background: var(--ks-rule); flex-shrink: 0; }
        .cnh-kbd {
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 0.625rem; font-weight: 700; line-height: 1;
          padding: 0.1875rem 0.3125rem; border-radius: 4px;
          border: 1px solid var(--ks-rule); color: var(--ks-text-faint);
          background: color-mix(in oklch, var(--ks-lacquer) 60%, transparent);
        }
      `}</style>

      <header className="cnh">
        {/* Menu (mobile) — abre a sidebar como drawer abaixo do breakpoint onde a nav principal some */}
        {onMenuClick && (
          <button type="button" className="cnh-menu-btn" onClick={onMenuClick} aria-label="Abrir navegação">
            {MenuIcon}
          </button>
        )}

        {/* Brand */}
        <Link href="/cn" className="cnh-brand" aria-label="Kikito CN — início">
          <Image src="/img/kikito-face.png" alt="" className="cnh-brand-logo" width={24} height={24} aria-hidden />
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

        {/* Spotlight search trigger */}
        <Button
          variant="outline"
          intent="neutral"
          size="sm"
          iconLeft={SearchIcon}
          onClick={() => setSearchOpen(true)}
          className="hidden sm:inline-flex font-normal text-faint"
          aria-label="Buscar componentes"
        >
          <span className="inline-flex items-center gap-(--spacing-2xs)">
            Buscar
            <kbd className="cnh-kbd">⌘K</kbd>
          </span>
        </Button>

        {/* GitHub */}
        <Button
          variant="ghost"
          intent="neutral"
          size="sm"
          iconOnly
          iconLeft={GitHubIcon}
          onClick={() => window.open("https://github.com", "_blank", "noopener,noreferrer")}
          aria-label="Repositório no GitHub"
        />

        <CnThemeToggle />

        <span className="cnh-rule" aria-hidden />

        {/* Auth — placeholder até religar o fluxo de login */}
        <Button
          variant="ghost"
          intent="neutral"
          size="sm"
          disabled
          title="Em breve"
          className="hidden min-[520px]:inline-flex"
        >
          Entrar
        </Button>
        <Button variant="solid" intent="primary" size="sm" iconRight={ArrowIcon} disabled title="Em breve">
          Cadastrar
        </Button>
      </header>

      <SpotlightSearch
        actions={actions}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        placeholder="Buscar componentes, páginas e ações…"
        maxResults={10}
      />
    </>
  );
}
