"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { CN_GROUPS, CN_REGISTRY } from "@/lib/cn-registry";
import type { CnComponentMeta } from "@/lib/cn-registry";
import { cn } from "@/lib/utils";

function symbolOf(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return title.slice(0, 2).toUpperCase();
}

export function CatalogSection() {
  const router = useRouter();
  const [view, setView] = useState<"magazine" | "periodic">("magazine");
  const [activeIdx, setActiveIdx] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const items = CN_REGISTRY;
  const active = items[activeIdx];

  const grouped = useMemo(
    () =>
      CN_GROUPS.map((g) => ({ group: g, comps: items.filter((c) => c.group === g.id) })).filter((x) => x.comps.length),
    [items]
  );

  const go = (c: CnComponentMeta) => router.push(`/cn/${c.group}/${c.name}`);

  /* magazine: item mais próximo do centro vira ativo no scroll */
  const onScroll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = listRef.current;
      if (!el) return;
      const mid = el.scrollTop + el.clientHeight / 2;
      const children = Array.from(el.querySelectorAll<HTMLElement>("[data-mi]"));
      let best = 0;
      let bestDist = Infinity;
      children.forEach((c, i) => {
        const center = c.offsetTop + c.offsetHeight / 2;
        const d = Math.abs(center - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActiveIdx(best);
    });
  };

  const scrollTo = (i: number) => {
    const el = listRef.current;
    const target = el?.querySelector<HTMLElement>(`[data-mi="${i}"]`);
    if (el && target) {
      el.scrollTo({ top: target.offsetTop - el.clientHeight / 2 + target.offsetHeight / 2, behavior: "smooth" });
    }
    setActiveIdx(i);
  };

  useEffect(() => () => void (rafRef.current && cancelAnimationFrame(rafRef.current)), []);

  const groupLabel = (id: string) => CN_GROUPS.find((g) => g.id === id)?.label ?? id;

  return (
    <section className="kk-section ct" id="catalogo" aria-labelledby="ct-title">
      <style>{`
        .ct-head { max-width: 60ch; }
        .ct-head h2 { margin-top: 0.75rem; }
        .ct-head p { margin-top: 1rem; }

        .ct-tabs { display: inline-flex; gap: 4px; margin: 1.75rem 0 0; padding: 4px; border: 1px solid var(--ks-rule); border-radius: 999px; background: color-mix(in oklch, var(--ks-lacquer-raised) 50%, transparent); }
        .ct-tab { padding: 7px 18px; border: none; border-radius: 999px; background: transparent; color: var(--ks-text-muted); font: inherit; font-size: 0.8125rem; font-weight: 600; cursor: pointer; transition: color .15s, background .15s; }
        .ct-tab[data-on="true"] { color: var(--ks-kinpaku-fg); background: var(--ks-kinpaku); }

        /* ── Magazine ── */
        .mag { display: grid; grid-template-columns: clamp(180px, 22vw, 220px) minmax(0, 1fr); gap: clamp(24px, 4vw, 64px); margin-top: 2rem; }
        @media (max-width: 900px) { .mag { grid-template-columns: 1fr; gap: 1.5rem; } }
        .mag-list { height: 460px; overflow-y: auto; scrollbar-width: none; -webkit-mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent); mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent); scroll-snap-type: y proximity; }
        .mag-list::-webkit-scrollbar { display: none; }
        @media (max-width: 900px) { .mag-list { height: auto; max-height: none; display: flex; gap: 8px; overflow-x: auto; overflow-y: hidden; -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent); mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent); scroll-snap-type: x proximity; padding-bottom: 4px; } }
        .mi { display: block; width: 100%; text-align: left; padding: 7px 4px; background: none; border: none; cursor: pointer; font: inherit; font-size: 0.95rem; color: var(--ks-text-faint); scroll-snap-align: center; transition: color .2s var(--kk-ease-out), transform .2s var(--kk-ease-out), opacity .2s; opacity: .6; white-space: nowrap; }
        .mi:hover { color: var(--ks-text-muted); opacity: .85; }
        .mi[data-on="true"] { color: var(--ks-text); opacity: 1; font-weight: 600; transform: translateX(3px); }
        @media (max-width: 900px) { .mi { width: auto; flex-shrink: 0; padding: 7px 12px; border: 1px solid var(--ks-rule); border-radius: 999px; opacity: 1; } .mi[data-on="true"] { transform: none; border-color: var(--ks-kinpaku); } }

        .mag-view { min-height: 460px; border: 1px solid var(--ks-rule); border-radius: 14px; background: color-mix(in oklch, var(--ks-lacquer-raised) 45%, transparent); overflow: hidden; }
        .spread { display: grid; grid-template-columns: 38% 1fr; height: 100%; }
        @media (max-width: 760px) { .spread { grid-template-columns: 1fr; } }
        .spread-id { padding: clamp(1.5rem, 3vw, 2.5rem); border-right: 1px solid var(--ks-rule); display: flex; flex-direction: column; }
        @media (max-width: 760px) { .spread-id { border-right: none; border-bottom: 1px solid var(--ks-rule); } }
        .spread-cat { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--kk-accent); }
        .spread-name { margin-top: 0.5rem; font-family: var(--kk-font-display); font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 400; line-height: 1.05; color: var(--ks-text); }
        .spread-desc { margin-top: 0.875rem; font-size: 0.875rem; line-height: 1.6; color: var(--ks-text-muted); }
        .spread-link { margin-top: auto; padding-top: 1.25rem; display: inline-flex; align-items: center; gap: 6px; font-size: 0.8125rem; font-weight: 600; color: var(--ks-kinpaku); background: none; border: none; cursor: pointer; align-self: flex-start; }
        .spread-demo { padding: clamp(1.5rem, 3vw, 2.5rem); display: grid; place-items: center; background-image: radial-gradient(color-mix(in oklch, var(--ks-rule) 70%, transparent) 1px, transparent 1px); background-size: 20px 20px; }
        .spread-chip { display: grid; place-items: center; width: clamp(90px, 16vw, 132px); height: clamp(90px, 16vw, 132px); border-radius: 18px; border: 1px solid var(--ks-rule); background: var(--ks-lacquer-deep); font-family: ui-monospace, monospace; font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 700; color: var(--kk-accent); }

        /* ── Periodic ── */
        .pt { margin-top: 2rem; display: flex; flex-direction: column; gap: clamp(1.5rem, 3vw, 2.5rem); }
        .pt-group-label { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ks-text-faint); margin-bottom: 0.75rem; }
        .pt-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: clamp(8px, 1.4vw, 14px); }
        .pe { position: relative; aspect-ratio: 64 / 76; min-height: 76px; padding: 6px; border: 1px solid var(--ks-rule); border-radius: 6px; background: var(--ks-lacquer-deep); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; transition: transform .18s var(--kk-ease-out), border-color .18s, background .18s; }
        .pe:hover, .pe:focus-visible { transform: translateY(-3px); border-color: var(--kk-accent); background: var(--ks-lacquer-raised); outline: none; }
        .pe-num { position: absolute; top: 5px; left: 6px; font-size: 0.5rem; color: var(--ks-text-faint); }
        .pe-sym { font-family: var(--kk-font-display); font-size: 1.25rem; font-weight: 600; color: var(--ks-text); line-height: 1; }
        .pe-name { font-size: 0.5625rem; color: var(--ks-text-faint); max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pe:hover .pe-sym, .pe:focus-visible .pe-sym { color: var(--kk-accent); }
      `}</style>

      <div className="kk-container">
        <header className="ct-head">
          <span className="kk-eyebrow">Catálogo</span>
          <h2 id="ct-title" className="kk-headline">
            {items.length} componentes, dois jeitos de navegar.
          </h2>
          <p className="kk-lead">
            Folheie como uma revista ou explore a tabela periódica. Clique em qualquer um para ver o preview e copiar o
            código.
          </p>

          <div className="ct-tabs" role="tablist" aria-label="Modo de navegação">
            <button
              className="ct-tab"
              role="tab"
              aria-selected={view === "magazine"}
              data-on={view === "magazine"}
              onClick={() => setView("magazine")}
            >
              Revista
            </button>
            <button
              className="ct-tab"
              role="tab"
              aria-selected={view === "periodic"}
              data-on={view === "periodic"}
              onClick={() => setView("periodic")}
            >
              Tabela
            </button>
          </div>
        </header>

        {view === "magazine" ? (
          <div className="mag">
            <div className="mag-list" ref={listRef} onScroll={onScroll} role="listbox" aria-label="Componentes">
              {items.map((c, i) => (
                <button
                  key={c.name}
                  data-mi={i}
                  data-on={i === activeIdx}
                  className="mi"
                  onClick={() => scrollTo(i)}
                  role="option"
                  aria-selected={i === activeIdx}
                >
                  {c.title}
                </button>
              ))}
            </div>

            <div className="mag-view">
              {active && (
                <div className="spread">
                  <div className="spread-id">
                    <span className="spread-cat">{groupLabel(active.group)}</span>
                    <h3 className="spread-name">{active.title}</h3>
                    <p className="spread-desc">{active.description}</p>
                    <button className="spread-link" onClick={() => go(active)}>
                      Ver componente
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
                    </button>
                  </div>
                  <div className="spread-demo">
                    <div className="spread-chip">{symbolOf(active.title)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="pt">
            {grouped.map(({ group, comps }) => (
              <div key={group.id}>
                <div className="pt-group-label">
                  {group.icon} {group.label} · {comps.length}
                </div>
                <div className="pt-row">
                  {comps.map((c, i) => (
                    <button
                      key={c.name}
                      className={cn("pe")}
                      onClick={() => go(c)}
                      title={`${c.title} — ${c.description}`}
                      aria-label={`${c.title}: ${c.description}`}
                    >
                      <span className="pe-num">{i + 1}</span>
                      <span className="pe-sym">{symbolOf(c.title)}</span>
                      <span className="pe-name">{c.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
