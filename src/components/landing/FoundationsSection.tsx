import { FOUNDATIONS, type Foundation } from "./landing-data";

const PLINTH_HEIGHTS = ["4%", "12%", "20%", "28%", "36%", "44%", "52%"];

/* line-art por fundamento, animação por classe */
function Viz({ anim }: { anim: Foundation["anim"] }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (anim) {
    case "draw":
      return (
        <svg viewBox="0 0 64 40" className="fc-svg fc-draw" {...common}>
          <path d="M8 30 L8 12 L20 12 M14 12 L14 30" />
          <path d="M30 30 L40 12 L50 30 M34 24 L46 24" />
        </svg>
      );
    case "fade":
      return (
        <svg viewBox="0 0 64 40" className="fc-svg fc-fade" {...common}>
          <rect x="8" y="10" width="20" height="20" rx="3" className="fc-fade-a" />
          <rect x="36" y="10" width="20" height="20" rx="3" className="fc-fade-b" />
        </svg>
      );
    case "move-x":
      return (
        <svg viewBox="0 0 64 40" className="fc-svg" {...common}>
          <line x1="6" y1="14" x2="58" y2="14" className="fc-mx fc-mx-1" />
          <line x1="6" y1="26" x2="44" y2="26" className="fc-mx fc-mx-2" />
        </svg>
      );
    case "res":
      return (
        <svg viewBox="0 0 64 40" className="fc-svg fc-res" {...common}>
          <rect x="10" y="8" width="44" height="26" rx="3" className="fc-res-frame" />
          <line x1="18" y1="20" x2="46" y2="20" />
        </svg>
      );
    case "toggle":
      return (
        <svg viewBox="0 0 64 40" className="fc-svg" {...common}>
          <rect x="14" y="14" width="36" height="14" rx="7" />
          <circle cx="22" cy="21" r="4" className="fc-toggle-knob" fill="currentColor" />
        </svg>
      );
    case "ball":
      return (
        <svg viewBox="0 0 64 40" className="fc-svg" {...common}>
          <circle cx="32" cy="14" r="6" className="fc-ball" fill="currentColor" />
          <line x1="14" y1="32" x2="50" y2="32" />
        </svg>
      );
    case "blink":
    default:
      return (
        <svg viewBox="0 0 64 40" className="fc-svg" {...common}>
          <line x1="12" y1="14" x2="40" y2="14" />
          <line x1="12" y1="22" x2="34" y2="22" />
          <line x1="40" y1="22" x2="44" y2="22" className="fc-caret" />
        </svg>
      );
  }
}

export function FoundationsSection() {
  return (
    <section className="kk-section fs" aria-labelledby="fs-title">
      <style>{`
        .fs-head { max-width: 60ch; }
        .fs-head h2 { margin-top: 0.75rem; }
        .fs-head p { margin-top: 1rem; }
        .fs-cli { display: inline-flex; align-items: center; gap: 10px; margin-top: 1.5rem; padding: 10px 16px; border: 1px solid var(--ks-rule); border-radius: 8px; background: var(--ks-lacquer); font-family: ui-monospace, monospace; font-size: 0.8125rem; color: var(--ks-text); }
        .fs-cli b { color: var(--ks-primary); font-weight: 400; }

        /* grid de plinths (desktop > 1280) */
        .fs-grid { display: flex; align-items: flex-end; gap: 16px; height: 600px; margin-top: clamp(2rem, 4vw, 3rem); }
        .fs-col { flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; cursor: default; }
        .fc { height: 280px; padding: 24px; border: 1px solid var(--ks-rule); border-radius: 12px; margin-bottom: 8px; background: color-mix(in oklch, var(--ks-lacquer-raised) 55%, transparent); display: flex; flex-direction: column; z-index: 2; transition: transform .3s var(--kk-ease-out), border-color .3s, box-shadow .3s; }
        .fs-col:hover .fc { transform: translateY(-12px); border-color: var(--kk-accent); box-shadow: 0 20px 40px color-mix(in oklch, #000 8%, transparent); }
        .fc-num { font-size: 0.6875rem; font-weight: 700; color: var(--ks-text-faint); }
        .fc-label { margin-top: 0.5rem; font-size: 1rem; font-weight: 600; color: var(--ks-text); }
        .fc-detail { margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.55; color: var(--ks-text-muted); }
        .fc-viz { margin-top: auto; color: var(--ks-text-faint); transition: color .3s; }
        .fs-col:hover .fc-viz { color: var(--kk-accent); }
        .fc-svg { width: 64px; height: 40px; display: block; }

        .fc-plinth { border-radius: 8px 8px 0 0; background-image: repeating-linear-gradient(45deg, transparent, transparent 5px, color-mix(in oklch, var(--ks-text) 8%, transparent) 5px, color-mix(in oklch, var(--ks-text) 8%, transparent) 6px); opacity: .5; transition: background .3s, opacity .3s; }
        .fs-col:hover .fc-plinth { background-color: color-mix(in oklch, var(--kk-accent) 14%, transparent); opacity: .7; }

        /* SVG animações (loop sutil) */
        .fc-draw path { stroke-dasharray: 80; stroke-dashoffset: 0; animation: fc-respire 3.2s var(--kk-ease-out) infinite; }
        @keyframes fc-respire { 0%,100% { opacity: .85; } 50% { opacity: 1; } }
        .fc-fade-a { animation: fc-bf 2.8s ease-in-out infinite; } .fc-fade-b { animation: fc-bf 2.8s ease-in-out infinite reverse; }
        @keyframes fc-bf { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
        .fc-mx-1 { animation: fc-slide 2.6s var(--kk-ease-out) infinite; } .fc-mx-2 { animation: fc-slide 2.6s var(--kk-ease-out) infinite .3s; }
        @keyframes fc-slide { 0%,100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
        .fc-res-frame { animation: fc-res 3s ease-in-out infinite; transform-origin: center; }
        @keyframes fc-res { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(.82); } }
        .fc-toggle-knob { animation: fc-toggle 2.4s var(--kk-ease-quint) infinite; }
        @keyframes fc-toggle { 0%,100% { transform: translateX(0); } 50% { transform: translateX(20px); } }
        .fc-ball { animation: fc-bob 1.6s cubic-bezier(.5,0,.5,1) infinite; }
        @keyframes fc-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(10px) scaleY(.86); } }
        .fc-caret { animation: fc-blink 1.1s steps(1) infinite; }
        @keyframes fc-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

        /* responsivo */
        @media (max-width: 1280px) {
          .fs-grid { display: grid; grid-template-columns: repeat(3, 1fr); height: auto; align-items: stretch; }
          .fc { height: auto; min-height: 200px; transform: none; }
          .fs-col:hover .fc { transform: translateY(-4px); }
          .fc-plinth { display: none; }
        }
        @media (max-width: 768px) { .fs-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) {
          .fs-grid { grid-template-columns: 1fr; }
          .fc { min-height: 0; flex-direction: row; align-items: center; gap: 16px; padding: 18px; }
          .fc-text { flex: 1; } .fc-viz { margin: 0; flex-shrink: 0; }
          .fc-detail { display: none; }
        }
      `}</style>

      <div className="kk-container">
        <header className="fs-head">
          <span className="kk-eyebrow">Fundamentos</span>
          <h2 id="fs-title" className="kk-headline">
            Os 7 pilares por trás de cada componente.
          </h2>
          <p className="kk-lead">
            Nada de slop. Cada peça do Kikito respeita os mesmos fundamentos de design, do espaçamento ao texto, para
            tudo parecer feito pela mesma mão.
          </p>
          <div className="fs-cli">
            <span>$</span>
            <span>
              npx <b>kikito</b> detect ./src
            </span>
          </div>
        </header>

        <div className="fs-grid">
          {FOUNDATIONS.map((f, i) => (
            <div className="fs-col" key={f.label}>
              <article className="fc" style={{ marginTop: 0 }}>
                <span className="fc-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="fc-text">
                  <h3 className="fc-label">{f.label}</h3>
                  <p className="fc-detail">{f.detail}</p>
                </div>
                <div className="fc-viz">
                  <Viz anim={f.anim} />
                </div>
              </article>
              <div className="fc-plinth" style={{ height: PLINTH_HEIGHTS[i] }} aria-hidden />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
