import Link from "next/link";

const COLS = [
  {
    title: "Produto",
    links: [
      { label: "Componentes", href: "/cn" },
      { label: "Por que Kikito", href: "#why" },
      { label: "Instalação", href: "#downloads" },
    ],
  },
  {
    title: "Conteúdo",
    links: [
      { label: "Tutoriais em vídeo", href: "#tutoriais" },
      { label: "Dicas & novidades", href: "#comunidade" },
      { label: "Portfólio", href: "#why" },
    ],
  },
  {
    title: "Comunidade",
    links: [
      { label: "GitHub", href: "https://github.com" },
      { label: "Changelog", href: "/cn#changelog" },
      { label: "Contato", href: "mailto:ola@kikito.com.br" },
    ],
  },
];

export function SiteFooter() {
  return (
    <>
      <style>{`
        .ft { border-top: 1px solid var(--ks-rule); background: color-mix(in oklch, var(--ks-lacquer-raised) 55%, var(--ks-lacquer)); }
        .ft-inner { max-width: var(--kk-width-max); margin: 0 auto; padding: clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 2.5rem) 2rem; }
        .ft-top { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
        @media (min-width: 760px) { .ft-top { grid-template-columns: 1.4fr repeat(3, 1fr); } }
        .ft-brand-mark { font-family: var(--kk-font-display); font-size: 1.5rem; font-weight: 700; letter-spacing: -0.01em; color: var(--ks-text); line-height: 1; }
        .ft-brand-mark b { color: var(--ks-primary); }
        .ft-brand-desc { margin-top: 0.875rem; max-width: 32ch; color: var(--ks-text-muted); font-size: 0.875rem; line-height: 1.7; }
        .ft-col h4 { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ks-text-faint); margin-bottom: 0.875rem; }
        .ft-col a { display: block; padding: 0.3125rem 0; color: var(--ks-text-muted); text-decoration: none; font-size: 0.875rem; transition: color 120ms; }
        .ft-col a:hover { color: var(--ks-primary); }
        .ft-credit { display: flex; flex-wrap: wrap; gap: 0.75rem 1.5rem; justify-content: space-between; align-items: center; margin-top: clamp(2rem, 5vw, 3rem); padding-top: 1.5rem; border-top: 1px solid color-mix(in oklch, var(--ks-rule) 60%, transparent); color: var(--ks-text-faint); font-size: 0.8125rem; }
        .ft-social { display: flex; gap: 1.25rem; }
        .ft-social a { color: var(--ks-text-faint); text-decoration: none; transition: color 120ms; }
        .ft-social a:hover { color: var(--ks-text); }
      `}</style>

      <footer className="ft" id="site-footer">
        <div className="ft-inner">
          <div className="ft-top">
            <div>
              <span className="ft-brand-mark">
                Kiki<b>to</b>
              </span>
              <p className="ft-brand-desc">
                Design system, componentes copy-paste, tutoriais e novidades para construir interfaces com qualidade de
                produto.
              </p>
            </div>
            {COLS.map((col) => (
              <nav className="ft-col" key={col.title} aria-label={col.title}>
                <h4>{col.title}</h4>
                {col.links.map((l) => (
                  <Link key={l.label} href={l.href}>
                    {l.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>

          <div className="ft-credit">
            <span>© 2026 Kikito. Feito com cuidado no Brasil.</span>
            <div className="ft-social">
              <a href="https://github.com" target="_blank" rel="noreferrer noopener">
                GitHub
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer noopener">
                YouTube
              </a>
              <a href="mailto:ola@kikito.com.br">E-mail</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
