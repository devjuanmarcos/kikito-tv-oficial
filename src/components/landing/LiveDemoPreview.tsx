/* Mock animado de "preview ao vivo": janela de navegador mostrando um
 * componente do design system trocando de variante. CSS puro, sem JS. */
export function LiveDemoPreview() {
  return (
    <>
      <style>{`
        .ld { position: relative; border: 1px solid var(--ks-rule); border-radius: 14px; overflow: hidden; background: var(--ks-lacquer); box-shadow: 0 30px 80px -30px color-mix(in oklch, #000 50%, transparent); }
        .ld-chrome { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-bottom: 1px solid var(--ks-rule); background: color-mix(in oklch, var(--ks-lacquer-raised) 60%, transparent); }
        .ld-dots { display: flex; gap: 6px; }
        .ld-dots i { width: 10px; height: 10px; border-radius: 50%; background: color-mix(in oklch, var(--ks-text-faint) 40%, transparent); }
        .ld-url { flex: 1; height: 24px; border-radius: 6px; border: 1px solid var(--ks-rule); background: var(--ks-lacquer); display: flex; align-items: center; padding: 0 10px; font-family: ui-monospace, monospace; font-size: 0.6875rem; color: var(--ks-text-faint); }

        .ld-stage { position: relative; padding: clamp(1.5rem, 4vw, 2.75rem); min-height: 280px; display: grid; place-items: center; background-image: radial-gradient(color-mix(in oklch, var(--ks-rule) 70%, transparent) 1px, transparent 1px); background-size: 22px 22px; }

        .ld-card { width: 100%; max-width: 300px; border: 1px solid var(--ks-rule); border-radius: 12px; padding: 22px; background: var(--ks-lacquer-raised); }
        .ld-kicker { font-size: 0.625rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--kk-accent); }
        .ld-title { margin-top: 8px; font-family: var(--kk-font-display); font-size: 1.5rem; line-height: 1.1; color: var(--ks-text); }
        .ld-text { margin-top: 8px; font-size: 0.8125rem; line-height: 1.5; color: var(--ks-text-muted); }

        /* botão demo que cicla variantes */
        .ld-btn { position: relative; margin-top: 18px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: 700; animation: ld-variant 7s var(--kk-ease-out) infinite; }
        @keyframes ld-variant {
          0%, 28%   { background: var(--ks-patina); color: var(--ks-patina-fg); border: 1px solid transparent; }
          33%, 61%  { background: transparent; color: var(--ks-patina); border: 1px solid var(--ks-patina); }
          66%, 94%  { background: var(--ks-patina-soft); color: var(--ks-patina-soft-fg); border: 1px solid transparent; }
          100%      { background: var(--ks-patina); color: var(--ks-patina-fg); border: 1px solid transparent; }
        }

        /* outline de seleção pulsando sobre o card */
        .ld-sel { position: absolute; inset: clamp(1rem, 3vw, 2rem); border: 1.5px dashed color-mix(in oklch, var(--kk-accent) 70%, transparent); border-radius: 14px; pointer-events: none; animation: ld-sel 7s ease-in-out infinite; }
        @keyframes ld-sel { 0%, 92% { opacity: 0; } 4%, 20% { opacity: 1; } }

        .ld-pop { position: absolute; right: clamp(1rem, 3vw, 2rem); bottom: clamp(1rem, 3vw, 2rem); display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; border: 1px solid var(--ks-rule); background: color-mix(in oklch, var(--ks-lacquer) 88%, transparent); backdrop-filter: blur(8px); font-size: 0.6875rem; color: var(--ks-text-muted); animation: ld-pop 7s var(--kk-ease-out) infinite; }
        @keyframes ld-pop { 0%, 96% { opacity: 0; transform: translateY(6px); } 8%, 88% { opacity: 1; transform: translateY(0); } }
        .ld-pop b { color: var(--ks-text); font-weight: 600; }
        .ld-pop i { width: 7px; height: 7px; border-radius: 50%; background: var(--ks-patina); }
      `}</style>

      <div className="ld" aria-hidden>
        <div className="ld-chrome">
          <div className="ld-dots">
            <i />
            <i />
            <i />
          </div>
          <div className="ld-url">kikito.com.br/cn/button</div>
        </div>
        <div className="ld-stage">
          <div className="ld-card">
            <span className="ld-kicker">Componente</span>
            <div className="ld-title">Button</div>
            <p className="ld-text">Variantes, estados e tema prontos. Copie e use.</p>
            <div className="ld-btn">Cadastrar</div>
          </div>
          <div className="ld-sel" />
          <div className="ld-pop">
            <i /> variant <b>solid</b> → <b>outline</b>
          </div>
        </div>
      </div>
    </>
  );
}
