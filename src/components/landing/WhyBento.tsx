import { BENTO, type BentoTile } from "./landing-data";

/* ── Mini visuais por tipo de tile (fundo levemente elevado p/ ler na célula) ── */
function TileViz({ kind }: { kind: BentoTile["kind"] }) {
  switch (kind) {
    case "terminal":
      return (
        <div className="bt-term" aria-hidden>
          <div className="bt-term-bar">
            <i />
            <i />
            <i />
          </div>
          <pre className="bt-term-body">
            <span className="bt-c-muted">$ npx shadcn add @kikito/button</span>
            {"\n"}
            <span className="bt-c-ok">✓</span> Button adicionado
            {"\n"}
            <span className="bt-c-ok">✓</span> tokens detectados
            {"\n"}
            <span className="bt-c-muted">›</span> 190 componentes disponíveis
          </pre>
        </div>
      );
    case "tokens":
      return (
        <div className="bt-tokens" aria-hidden>
          {["--primary", "--raised", "--rule", "--text"].map((t, i) => (
            <span key={t} className={`bt-swatch bt-swatch--${i}`}>
              <i /> {t}
            </span>
          ))}
        </div>
      );
    case "video":
      return (
        <div className="bt-video" aria-hidden>
          <div className="bt-play">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="bt-scrub">
            <i />
          </div>
        </div>
      );
    case "registry":
      return (
        <div className="bt-grid" aria-hidden>
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${(i % 6) * 90}ms` }} />
          ))}
        </div>
      );
    case "news":
      return (
        <div className="bt-news" aria-hidden>
          {["Novo: Kanban acessível", "Dica: tokens em OKLCH", "Release v0.4"].map((n) => (
            <span key={n} className="bt-news-row">
              <i /> {n}
            </span>
          ))}
        </div>
      );
    case "diff":
      return (
        <pre className="bt-diff" aria-hidden>
          <span className="bt-add">
            + import {"{"} Button {"}"} from &quot;@/cn/button&quot;
          </span>
          {"\n"}
          <span className="bt-del">- &lt;button className=&quot;...&quot;&gt;</span>
          {"\n"}
          <span className="bt-add">+ &lt;Button intent=&quot;primary&quot;&gt;</span>
        </pre>
      );
    case "live":
      return (
        <div className="bt-live" aria-hidden>
          <span className="bt-live-tag">LIVE</span>
          <div className="bt-live-btns">
            <span className="bt-live-btn bt-live-btn--a" />
            <span className="bt-live-btn bt-live-btn--b" />
          </div>
        </div>
      );
    case "card":
    default:
      return (
        <div className="bt-plate" aria-hidden>
          <span className="bt-plate-bar" />
          <span className="bt-plate-bar bt-plate-bar--sm" />
          <span className="bt-plate-chip" />
        </div>
      );
  }
}

export function WhyBento() {
  return (
    <section className="kk-section" id="why" aria-labelledby="why-title">
      <style>{`
        .why-wrap { --kk-partition: color-mix(in oklch, var(--ks-text-faint) 20%, var(--ks-lacquer)); }
        .why-head { max-width: 56ch; margin-bottom: clamp(2rem, 4vw, 3rem); }
        .why-head h2 { margin-top: 0.75rem; }
        .why-head p { margin-top: 1rem; }

        /* grade-partição: células coladas no fundo, divisórias aparecem no gap */
        .ks-bento {
          display: grid; grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 8px; background: var(--kk-partition);
          border-top: 8px solid var(--kk-partition);
          border-bottom: 8px solid var(--kk-partition);
        }
        @media (max-width: 980px) { .ks-bento { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 560px) { .ks-bento { grid-template-columns: 1fr; } }

        .bt {
          grid-column: span var(--bt-span, 4);
          position: relative; display: flex; flex-direction: column; gap: 14px;
          padding: clamp(1.75rem, 3.5vw, 3rem);
          background: var(--ks-lacquer); border: 0; border-radius: 0;
          overflow: hidden; min-height: 280px;
        }
        .bt--8 { --bt-span: 8; min-height: 340px; } .bt--6 { --bt-span: 6; } .bt--4 { --bt-span: 4; }
        @media (max-width: 980px) { .bt { grid-column: span 1 !important; min-height: 240px; } }

        .bt-num { font-family: ui-monospace, monospace; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--kk-accent); }
        .bt-title { font-family: var(--kk-font-display); font-size: clamp(1.5rem, 2.6vw, 2.15rem); font-weight: 300; line-height: 1.12; letter-spacing: -0.01em; color: var(--ks-text); }
        .bt-body { font-size: 1.0625rem; line-height: 1.65; color: var(--ks-text-muted); max-width: 52ch; }
        .bt-viz { margin-top: auto; padding-top: 0.5rem; }

        /* terminal */
        .bt-term { border: 1px solid var(--ks-rule); border-radius: 8px; overflow: hidden; background: var(--ks-lacquer-raised); }
        .bt-term-bar { display: flex; gap: 6px; padding: 8px 10px; border-bottom: 1px solid var(--ks-rule); }
        .bt-term-bar i { width: 9px; height: 9px; border-radius: 50%; background: color-mix(in oklch, var(--ks-text-faint) 40%, transparent); }
        .bt-term-body { margin: 0; padding: 12px 14px; font-family: ui-monospace, monospace; font-size: 0.78rem; line-height: 1.7; color: var(--ks-text); white-space: pre-wrap; }
        .bt-c-muted { color: var(--ks-text-faint); } .bt-c-ok { color: var(--ks-primary); }

        /* tokens */
        .bt-tokens { display: flex; flex-direction: column; gap: 8px; }
        .bt-swatch { display: flex; align-items: center; gap: 10px; font-family: ui-monospace, monospace; font-size: 0.78rem; color: var(--ks-text-muted); }
        .bt-swatch i { width: 22px; height: 22px; border-radius: 6px; border: 1px solid var(--ks-rule); }
        .bt-swatch--0 i { background: var(--ks-primary); } .bt-swatch--1 i { background: var(--ks-lacquer-raised); }
        .bt-swatch--2 i { background: var(--ks-rule); } .bt-swatch--3 i { background: var(--ks-text); }

        /* video */
        .bt-video { position: relative; height: 104px; border-radius: 8px; border: 1px solid var(--ks-rule); background: linear-gradient(135deg, color-mix(in oklch, var(--kk-accent) 14%, transparent), var(--ks-lacquer-raised)); display: grid; place-items: center; }
        .bt-play { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; color: var(--ks-primary-fg); background: var(--ks-primary); padding-left: 2px; }
        .bt-scrub { position: absolute; left: 12px; right: 12px; bottom: 12px; height: 3px; border-radius: 999px; background: color-mix(in oklch, var(--ks-text-faint) 30%, transparent); }
        .bt-scrub i { display: block; width: 38%; height: 100%; border-radius: 999px; background: var(--ks-primary); }

        /* registry grid */
        .bt-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
        .bt-grid span { aspect-ratio: 1; border-radius: 4px; border: 1px solid var(--ks-rule); background: var(--ks-lacquer-raised); animation: bt-pop 2.6s var(--kk-ease-out) infinite; }
        @keyframes bt-pop { 0%, 70%, 100% { background: var(--ks-lacquer-raised); } 35% { background: color-mix(in oklch, var(--kk-accent) 35%, var(--ks-lacquer-raised)); } }

        /* news */
        .bt-news { display: flex; flex-direction: column; gap: 8px; }
        .bt-news-row { display: flex; align-items: center; gap: 10px; padding: 10px 13px; border: 1px solid var(--ks-rule); border-radius: 8px; font-size: 0.85rem; color: var(--ks-text-muted); background: var(--ks-lacquer-raised); }
        .bt-news-row i { width: 6px; height: 6px; border-radius: 50%; background: var(--ks-primary); flex-shrink: 0; }

        /* diff */
        .bt-diff { margin: 0; padding: 14px; border: 1px solid var(--ks-rule); border-radius: 8px; background: var(--ks-lacquer-raised); font-family: ui-monospace, monospace; font-size: 0.76rem; line-height: 1.7; white-space: pre-wrap; }
        .bt-add { color: var(--ks-primary); } .bt-del { color: var(--ks-text-faint); }

        /* live */
        .bt-live { position: relative; height: 104px; border-radius: 8px; border: 1px solid var(--ks-rule); display: grid; place-items: center; gap: 10px; background: var(--ks-lacquer-raised); }
        .bt-live-tag { position: absolute; top: 10px; left: 10px; font-size: 0.5625rem; font-weight: 800; letter-spacing: 0.1em; color: var(--ks-primary); }
        .bt-live-btns { display: flex; gap: 10px; }
        .bt-live-btn { width: 64px; height: 22px; border-radius: 6px; }
        .bt-live-btn--a { background: var(--ks-primary); } .bt-live-btn--b { background: transparent; border: 1px solid var(--ks-rule); }

        /* plate */
        .bt-plate { display: flex; flex-direction: column; gap: 8px; padding: 14px; border: 1px solid var(--ks-rule); border-radius: 8px; background: var(--ks-lacquer-raised); }
        .bt-plate-bar { height: 10px; border-radius: 4px; background: color-mix(in oklch, var(--ks-text-faint) 35%, transparent); }
        .bt-plate-bar--sm { width: 60%; }
        .bt-plate-chip { width: 80px; height: 24px; border-radius: 6px; background: var(--ks-primary); margin-top: 4px; }
      `}</style>

      <div className="kk-container why-wrap">
        <header className="why-head">
          <span className="kk-eyebrow">Por que Kikito</span>
          <h2 id="why-title" className="kk-headline">
            Tudo para construir, num lugar só.
          </h2>
          <p className="kk-lead">
            Componentes prontos, tutoriais, dicas e novidades. Cada peça testada em produção, com tema, tokens e
            acessibilidade desde o começo.
          </p>
        </header>

        <div className="ks-bento">
          {BENTO.map((tile, i) => (
            <article key={tile.id} className={`bt bt--${tile.span}`}>
              <span className="bt-num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="bt-title">{tile.title}</h3>
              <p className="bt-body">{tile.body}</p>
              <div className="bt-viz">
                <TileViz kind={tile.kind} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
