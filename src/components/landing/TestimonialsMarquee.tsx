import { TESTIMONIALS, type Testimonial } from "./landing-data";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="tm-card">
      <blockquote className="tm-quote">{t.quote}</blockquote>
      <figcaption className="tm-meta">
        <span className="tm-coin" aria-hidden>
          {initials(t.name)}
        </span>
        <span className="tm-author">
          <strong>{t.name}</strong>
          <em>{t.role}</em>
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse }: { items: Testimonial[]; reverse?: boolean }) {
  // duplicado para loop contínuo
  const loop = [...items, ...items];
  return (
    <div className="tm-row">
      <div className={reverse ? "tm-track tm-track--rev" : "tm-track"}>
        {loop.map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsMarquee() {
  const mid = Math.ceil(TESTIMONIALS.length / 2);
  const rowA = TESTIMONIALS.slice(0, mid);
  const rowB = TESTIMONIALS.slice(mid);

  return (
    <section className="tm" aria-label="Depoimentos da comunidade">
      <style>{`
        .tm { padding: clamp(2rem, 5vw, 3.5rem) 0; overflow: hidden; border-block: 1px solid color-mix(in oklch, var(--ks-rule) 60%, transparent); }
        .tm-rows { display: flex; flex-direction: column; gap: 14px; }
        .tm-row { display: flex; overflow: hidden; -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent); }
        .tm-track { display: flex; gap: 14px; width: max-content; animation: tm-fwd 110s linear infinite; }
        .tm-track--rev { animation-name: tm-rev; }
        .tm:hover .tm-track { animation-play-state: paused; }
        @keyframes tm-fwd { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes tm-rev { from { transform: translateX(-50%); } to { transform: translateX(0); } }

        .tm-card { width: 320px; height: 168px; flex-shrink: 0; box-sizing: border-box; padding: 18px 18px 14px; border-radius: 10px; border: 1px solid var(--ks-rule); background: color-mix(in oklch, var(--ks-lacquer-raised) 60%, transparent); display: flex; flex-direction: column; justify-content: space-between; transition: transform .2s var(--kk-ease-out), border-color .2s, background .2s; }
        .tm-card:hover { transform: translateY(-2px); border-color: color-mix(in oklch, var(--ks-text-faint) 45%, transparent); background: var(--ks-lacquer-raised); }
        .tm-quote { margin: 0; color: var(--ks-text); font-size: 0.9375rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .tm-meta { display: flex; align-items: center; gap: 10px; }
        .tm-coin { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; font-size: 0.625rem; font-weight: 700; color: var(--ks-patina-fg); background: var(--ks-patina); }
        .tm-author { display: flex; flex-direction: column; min-width: 0; line-height: 1.25; }
        .tm-author strong { font-size: 0.8125rem; font-weight: 600; color: var(--ks-text); }
        .tm-author em { font-size: 0.75rem; font-style: normal; color: var(--ks-text-faint); }
      `}</style>

      <div className="tm-rows">
        <Row items={rowA} />
        <Row items={rowB} reverse />
      </div>
    </section>
  );
}
