"use client";

import { useState } from "react";

import { INSTALL_PRIMARY, INSTALL_ALT, EXTRAS, type InstallCmd } from "./landing-data";

function CmdRow({ item }: { item: InstallCmd }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard indisponível */
    }
  };

  return (
    <div className="dl-cmd">
      <span className="dl-cmd-label">{item.label}</span>
      <div className="dl-cmd-line">
        <code className="dl-prompt">{item.prompt}</code>
        <code className="dl-code">{item.cmd}</code>
        <button
          className="dl-copy"
          data-copied={copied}
          onClick={copy}
          aria-label={copied ? "Copiado" : "Copiar comando"}
        >
          {copied ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export function DownloadsSection() {
  return (
    <section className="kk-section" id="downloads" aria-labelledby="dl-title">
      <style>{`
        .dl-card { max-width: 880px; margin: 0 auto; padding: clamp(1.75rem, 4vw, 3rem); border: 1px solid var(--ks-rule); border-radius: 14px; background: color-mix(in oklch, var(--ks-lacquer-raised) 55%, transparent); }
        .dl-head { text-align: center; margin-bottom: 2rem; }
        .dl-head h2 { margin-top: 0.75rem; }
        .dl-head p { margin: 0.875rem auto 0; max-width: 48ch; }

        .dl-install { display: flex; flex-direction: column; gap: 10px; }
        .dl-cmd { display: flex; flex-direction: column; gap: 6px; }
        .dl-cmd-label { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ks-text-faint); }
        .dl-cmd-line { display: flex; align-items: center; gap: 10px; padding: 0 8px 0 14px; height: 48px; border: 1px solid var(--ks-rule); border-radius: 10px; background: var(--ks-lacquer); }
        .dl-prompt { color: var(--ks-primary); font-family: ui-monospace, monospace; font-size: 0.875rem; flex-shrink: 0; }
        .dl-code { flex: 1; min-width: 0; overflow-x: auto; white-space: nowrap; font-family: ui-monospace, monospace; font-size: 0.8125rem; color: var(--ks-text); scrollbar-width: none; }
        .dl-code::-webkit-scrollbar { display: none; }
        .dl-copy { display: grid; place-items: center; width: 36px; height: 36px; flex-shrink: 0; border-radius: 8px; border: 1px solid var(--ks-rule); background: transparent; color: var(--ks-text-faint); cursor: pointer; transition: color .15s, border-color .15s, background .15s, transform .15s; }
        .dl-copy:hover { color: var(--ks-text); border-color: var(--ks-text-faint); }
        .dl-copy[data-copied="true"] { color: var(--ks-primary); border-color: color-mix(in oklch, var(--ks-primary) 50%, var(--ks-rule)); }

        .dl-alts { margin-top: 1.25rem; border-top: 1px solid color-mix(in oklch, var(--ks-rule) 60%, transparent); }
        .dl-alts summary { display: flex; align-items: center; gap: 8px; padding: 1rem 0 0.5rem; cursor: pointer; list-style: none; font-size: 0.875rem; font-weight: 600; color: var(--ks-text-muted); }
        .dl-alts summary::-webkit-details-marker { display: none; }
        .dl-alts summary .dl-chev { transition: transform .24s var(--kk-ease-quint); }
        .dl-alts[open] summary .dl-chev { transform: rotate(180deg); }
        .dl-alts-body { display: flex; flex-direction: column; gap: 10px; padding-top: 0.5rem; }

        .dl-extras { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 1.75rem; }
        @media (max-width: 560px) { .dl-extras { grid-template-columns: 1fr; } }
        .dl-extra { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; border: 1px solid var(--ks-rule); border-radius: 10px; text-decoration: none; background: color-mix(in oklch, var(--ks-lacquer) 60%, transparent); transition: border-color .2s, transform .2s var(--kk-ease-out); }
        .dl-extra:hover { border-color: color-mix(in oklch, var(--kk-accent) 45%, var(--ks-rule)); transform: translateY(-2px); }
        .dl-extra strong { font-size: 0.875rem; color: var(--ks-text); display: flex; align-items: center; gap: 6px; }
        .dl-extra span { font-size: 0.75rem; color: var(--ks-text-faint); }
        .dl-extra strong::after { content: "↗"; color: var(--ks-text-faint); font-weight: 400; }
      `}</style>

      <div className="kk-container">
        <div className="dl-card">
          <div className="dl-head">
            <span className="kk-eyebrow">Instalação</span>
            <h2 id="dl-title" className="kk-headline">
              Comece em segundos.
            </h2>
            <p className="kk-lead">Copie o comando, cole no terminal e o componente entra com tokens e tema prontos.</p>
          </div>

          <div className="dl-install">
            {INSTALL_PRIMARY.map((c) => (
              <CmdRow key={c.label} item={c} />
            ))}
          </div>

          <details className="dl-alts">
            <summary>
              Métodos alternativos
              <svg
                className="dl-chev"
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
                <path d="m4 6 4 4 4-4" />
              </svg>
            </summary>
            <div className="dl-alts-body">
              {INSTALL_ALT.map((c) => (
                <CmdRow key={c.label} item={c} />
              ))}
            </div>
          </details>

          <div className="dl-extras">
            {EXTRAS.map((e) => (
              <a
                key={e.title}
                className="dl-extra"
                href={e.href}
                target={e.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer noopener"
              >
                <strong>{e.title}</strong>
                <span>{e.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
