"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/cn/button";

import { HERO_STACK } from "./landing-data";
import { LiveDemoPreview } from "./LiveDemoPreview";

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

export function Hero() {
  const router = useRouter();

  return (
    <section className="hero" aria-labelledby="hero-title">
      <style>{`
        .hero { position: relative; overflow: hidden; }
        .hero-art { position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(60% 50% at 78% 18%, color-mix(in oklch, var(--ks-kinpaku) 14%, transparent), transparent 70%),
            radial-gradient(50% 40% at 12% 8%, color-mix(in oklch, var(--ks-patina) 10%, transparent), transparent 70%);
        }
        .hero-inner { position: relative; z-index: 1; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: clamp(2rem, 5vw, 4.5rem); align-items: center; padding-top: clamp(3.5rem, 8vw, 6.5rem); padding-bottom: clamp(3.5rem, 8vw, 6rem); }
        @media (max-width: 940px) { .hero-inner { grid-template-columns: 1fr; } .hero-art { background-position: top right; } }

        .hero-title { margin-top: 1.25rem; }
        .hero-title b { color: var(--kk-accent); font-weight: inherit; }
        .hero-lead { margin-top: 1.5rem; max-width: 52ch; }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 2rem; }

        .hero-stack { margin-top: 2.5rem; }
        .hero-stack-label { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ks-text-faint); }
        .hero-stack-row { display: flex; flex-wrap: wrap; gap: 8px 10px; margin-top: 0.875rem; }
        .hero-chip { padding: 6px 12px; border: 1px solid var(--ks-rule); border-radius: 999px; font-size: 0.75rem; font-weight: 500; color: var(--ks-text-muted); background: color-mix(in oklch, var(--ks-lacquer-raised) 45%, transparent); }
      `}</style>

      <div className="hero-art" aria-hidden />
      <div className="kk-container hero-inner">
        <div>
          <span className="kk-eyebrow">Kikito · Design System</span>
          <h1 id="hero-title" className="kk-display hero-title">
            O kit visual para
            <br />
            construir <b>rápido</b>.
          </h1>
          <p className="kk-lead hero-lead">
            Componentes prontos para copiar, tutoriais em vídeo, dicas e novidades. Testados em produção, com tokens,
            tema claro/escuro e acessibilidade desde o primeiro pixel.
          </p>

          <div className="hero-actions">
            <Button intent="primary" variant="solid" size="lg" iconRight={ArrowIcon} onClick={() => router.push("/cn")}>
              Explorar componentes
            </Button>
            <Button
              intent="neutral"
              variant="outline"
              size="lg"
              iconLeft={GitHubIcon}
              onClick={() => window.open("https://github.com", "_blank", "noopener,noreferrer")}
            >
              Ver no GitHub
            </Button>
          </div>

          <div className="hero-stack">
            <span className="hero-stack-label">Construído com</span>
            <div className="hero-stack-row">
              {HERO_STACK.map((s) => (
                <span className="hero-chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <LiveDemoPreview />
      </div>
    </section>
  );
}
