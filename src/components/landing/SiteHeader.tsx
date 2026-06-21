"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/cn/button";
import { CnThemeToggle } from "@/components/ui/cn/cn-theme-toggle";
import { SpotlightSearch } from "@/components/ui/cn/spotlight-search";
import type { SpotlightAction } from "@/components/ui/cn/spotlight-search";
import { CN_GROUPS, CN_REGISTRY } from "@/lib/cn-registry";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Componentes", href: "/cn" },
  { label: "Tutoriais", href: "#tutoriais" },
  { label: "Dicas", href: "#comunidade" },
  { label: "Novidades", href: "#comunidade" },
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

export function SiteHeader() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        description: "Página principal",
        group: "Páginas",
        icon: "🏠",
        onSelect: () => router.push("/"),
      },
      {
        id: "cn",
        label: "Componentes",
        description: "Catálogo do design system",
        group: "Páginas",
        icon: "🧩",
        onSelect: () => router.push("/cn"),
      },
      ...CN_REGISTRY.map((c) => ({
        id: `${c.group}/${c.name}`,
        label: c.title,
        description: c.description,
        group: groupLabel(c.group),
        icon: "🧩",
        onSelect: () => router.push(`/cn/${c.group}/${c.name}`),
      })),
    ],
    [router]
  );

  return (
    <>
      <style>{`
        .sh {
          position: sticky; top: 0; z-index: 60;
          display: flex; align-items: center; gap: 0.75rem;
          height: 3.5rem; padding: 0 clamp(1rem, 4vw, 2.5rem);
          border-bottom: 1px solid var(--ks-rule);
          background: color-mix(in oklch, var(--ks-lacquer) 78%, transparent);
          backdrop-filter: blur(18px) saturate(1.25);
          -webkit-backdrop-filter: blur(18px) saturate(1.25);
        }
        .sh-brand { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; flex-shrink: 0; }
        .sh-brand-logo { width: 1.75rem; height: 1.75rem; border-radius: 9999px; object-fit: cover; flex-shrink: 0; }
        .sh-brand-mark { font-family: var(--kk-font-display); font-size: 1.375rem; font-weight: 700; letter-spacing: -0.01em; color: var(--ks-text); line-height: 1; }
        .sh-brand-mark b { color: var(--ks-primary); font-weight: 700; }
        .sh-brand-tag { font-size: 0.5625rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ks-text-faint); }

        .sh-nav { display: none; align-items: center; gap: 0.125rem; margin-left: 0.75rem; }
        @media (min-width: 900px) { .sh-nav { display: flex; } }
        .sh-link { padding: 0.4375rem 0.75rem; border-radius: var(--ks-radius-sm); font-size: 0.875rem; font-weight: 500; color: var(--ks-text-muted); text-decoration: none; transition: color 120ms, background 120ms; }
        .sh-link:hover { color: var(--ks-text); background: color-mix(in oklch, var(--ks-lacquer-raised) 70%, transparent); }

        .sh-spacer { flex: 1; }
        .sh-rule { width: 1px; height: 1.25rem; background: var(--ks-rule); flex-shrink: 0; }
        .sh-kbd { font-size: 0.625rem; font-weight: 700; line-height: 1; margin-left: 0.125rem; padding: 0.1875rem 0.3125rem; border-radius: 4px; border: 1px solid var(--ks-rule); color: var(--ks-text-faint); background: color-mix(in oklch, var(--ks-lacquer) 60%, transparent); }
        .sh-desktop { display: none; } @media (min-width: 520px) { .sh-desktop { display: inline-flex; } }
        .sh-auth-desktop { display: none; } @media (min-width: 680px) { .sh-auth-desktop { display: inline-flex; } }

        /* mobile menu button */
        .sh-burger { display: inline-flex; flex-direction: column; justify-content: center; gap: 5px; width: 1.75rem; height: 1.75rem; padding: 0 4px; background: none; border: none; cursor: pointer; flex-shrink: 0; }
        @media (min-width: 900px) { .sh-burger { display: none; } }
        .sh-burger span { display: block; height: 1.5px; width: 100%; background: var(--ks-text); border-radius: 2px; transition: transform 240ms cubic-bezier(.22,1,.36,1), opacity 180ms; }
        .sh-burger[data-open="true"] span:nth-child(1) { transform: translateY(3.25px) rotate(45deg); }
        .sh-burger[data-open="true"] span:nth-child(2) { opacity: 0; }
        .sh-burger[data-open="true"] span:nth-child(3) { transform: translateY(-3.25px) rotate(-45deg); }

        .sh-panel { position: fixed; inset: 3.5rem 0 auto 0; z-index: 55; display: grid; grid-template-rows: 0fr; transition: grid-template-rows 280ms cubic-bezier(.22,1,.36,1); }
        .sh-panel[data-open="true"] { grid-template-rows: 1fr; }
        .sh-panel-inner { overflow: hidden; min-height: 0; background: var(--ks-lacquer); border-bottom: 1px solid var(--ks-rule); }
        .sh-panel-list { display: flex; flex-direction: column; padding: 0.5rem clamp(1rem, 4vw, 2.5rem) 1rem; }
        .sh-panel-list a { padding: 0.75rem 0; font-size: 1rem; font-weight: 500; color: var(--ks-text); text-decoration: none; border-bottom: 1px solid color-mix(in oklch, var(--ks-rule) 60%, transparent); }
      `}</style>

      <header className="sh">
        <Link href="/" className="sh-brand" aria-label="Kikito — início">
          <Image src="/img/kikito-face.png" alt="" className="sh-brand-logo" width={28} height={28} aria-hidden />
          <span className="sh-brand-mark">
            Kiki<b>to</b>
          </span>
          <span className="sh-brand-tag">CN</span>
        </Link>

        <nav className="sh-nav" aria-label="Navegação principal">
          {NAV.map((item) => (
            <Link key={item.label} href={item.href} className="sh-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sh-spacer" />

        <Button
          variant="outline"
          intent="neutral"
          size="sm"
          iconLeft={SearchIcon}
          onClick={() => setSearchOpen(true)}
          className="sh-desktop font-normal text-faint"
          aria-label="Buscar componentes"
        >
          Buscar
          <kbd className="sh-kbd">⌘K</kbd>
        </Button>

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

        <span className="sh-rule sh-auth-desktop" aria-hidden />

        <Button variant="ghost" intent="neutral" size="sm" disabled title="Em breve" className="sh-auth-desktop">
          Entrar
        </Button>
        <Button variant="solid" intent="primary" size="sm" disabled title="Em breve" className="sh-auth-desktop">
          Cadastrar
        </Button>

        <button
          className="sh-burger"
          data-open={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className={cn("sh-panel")} data-open={menuOpen} aria-hidden={!menuOpen}>
        <div className="sh-panel-inner">
          <nav className="sh-panel-list">
            {NAV.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

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
