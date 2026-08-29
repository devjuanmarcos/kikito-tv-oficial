"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CnHeader } from "@/components/ui/cn/cn-header";
import { CnSidebar } from "@/components/ui/cn/cn-sidebar";
import { CnStripes } from "@/components/ui/cn/cn-stripes";
import { cn } from "@/lib/utils";

export default function CnLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  // mesmo breakpoint do .cnh-nav/.cnh-menu-btn — usado só pra saber quando o <aside> vira
  // drawer (fixed+translateX), pra poder tirar do tab order via `inert` quando fechado nesse
  // modo. Em desktop (>=860px) o <aside> é sempre visível/focável normalmente
  const [isDrawerMode, setIsDrawerMode] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 859px)");
    setIsDrawerMode(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDrawerMode(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // achado real (pendência 0b da auditoria): sidebar nunca colapsava em mobile — abaixo de
  // 860px (mesmo breakpoint em que a nav principal do header some) o grid de conteúdo ficava
  // espremido a ~0px úteis, quebrando canvas/SVG e sentinels de IntersectionObserver em várias
  // demos. Corrigido virando um drawer: escondida fora da tela por padrão nesse breakpoint,
  // desliza pra dentro sobre um backdrop quando aberta pelo botão de menu no header
  useEffect(() => setMobileNavOpen(false), [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileNavOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <style>{`
        .cn-aside {
          width: 268px; flex-shrink: 0;
          border-right: 1px solid var(--ks-rule);
          background: var(--ks-base);
          display: flex; flex-direction: column;
          position: sticky; top: 3.25rem; height: calc(100vh - 3.25rem);
          overflow: hidden;
        }
        .cn-backdrop { display: none; }
        @media (max-width: 859px) {
          .cn-aside {
            position: fixed; top: 3.25rem; left: 0; z-index: 60;
            height: calc(100vh - 3.25rem);
            transform: translateX(-100%);
            transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
            box-shadow: 8px 0 32px -8px oklch(0% 0 0 / 0.35);
          }
          .cn-aside--open { transform: translateX(0); }
          .cn-backdrop--open {
            display: block; position: fixed; inset: 3.25rem 0 0 0; z-index: 55;
            background: oklch(0% 0 0 / 0.4);
            animation: cn-backdrop-in 180ms ease both;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cn-aside { transition: none; }
        }
        @keyframes cn-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <CnHeader onMenuClick={() => setMobileNavOpen((v) => !v)} />

      <div className="flex flex-1 min-h-0">
        {mobileNavOpen && (
          <div className="cn-backdrop cn-backdrop--open" onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
        )}

        <aside
          className={cn("cn-aside", mobileNavOpen && "cn-aside--open")}
          aria-label="Navegação lateral CN"
          // fora da tela (drawer fechado em mobile) não pode ficar no tab order — sem isso um
          // usuário de teclado tabularia por links invisíveis antes de chegar no conteúdo
          // principal. `inert` é boolean de verdade — `inert=""` faz o React tratar como
          // false (avisa "empty string for boolean attribute") e quebra a hidratação
          inert={isDrawerMode && !mobileNavOpen ? true : undefined}
        >
          <CnSidebar />
        </aside>

        <CnStripes />

        <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
