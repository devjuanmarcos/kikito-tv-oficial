interface Props {
  title?: string
  description?: string
  theme?: 'light' | 'dark'
}

export function AcernityCardsDemo3({
  title = 'Damn good card',
  description = 'A card that showcases a set of tools that you use to create your product.',
  theme = 'dark',
}: Props) {
  return (
    <>
      <style>{`
        .acd3-card {
          --card-bg: var(--ks-lacquer-raised);
          --card-shadow: 2px 4px 16px 0 rgba(248,248,248,0.06) inset;
          --stage-bg: var(--ks-graphite);
          --bubble-glow: rgba(248,248,248,0.25);
          --bubble-shadow: rgba(0,0,0,0.4);
          --title-color: var(--ks-champagne, oklch(92% .03 90));
          --desc-color: var(--ks-text-muted);
          width: min(100% - 6px, 384px);
          margin: 0 auto;
          padding: 1.5rem;
          border: 1px solid var(--ks-rule);
          border-radius: 12px;
          background: var(--card-bg);
          box-shadow: var(--card-shadow);
          font-family: 'Albert Sans','Avenir Next','Helvetica Neue',system-ui,sans-serif;
        }
        .acd3-card[data-theme='light'] {
          --card-bg: oklch(98% 0 0);
          --card-shadow: 2px 4px 16px 0 rgba(0,0,0,0.06) inset;
          --stage-bg: oklch(93% 0 0);
          --bubble-glow: rgba(0,0,0,0.08);
          --bubble-shadow: rgba(0,0,0,0.12);
          --title-color: oklch(12% .006 95);
          --desc-color: oklch(42% 0 0);
          border-color: oklch(88% 0 0);
        }
        .acd3-stage {
          position: relative; z-index: 40; height: 240px; overflow: hidden;
          border-radius: 12px; background: var(--stage-bg);
          -webkit-mask-image: radial-gradient(50% 50% at 50% 50%, #fff 0%, transparent 100%);
          mask-image: radial-gradient(50% 50% at 50% 50%, #fff 0%, transparent 100%);
        }
        @media (min-width: 768px) { .acd3-stage { height: 320px; } }
        .acd3-stage-inner {
          position: relative; height: 100%; padding: 1.5rem;
          display: flex; align-items: center; justify-content: center;
        }
        .acd3-icon-row {
          display: flex; flex-direction: row; align-items: center;
          justify-content: center; gap: 0.5rem; flex-shrink: 0;
        }
        .acd3-bubble {
          display: flex; align-items: center; justify-content: center;
          border-radius: 9999px;
          background: rgba(248,248,248,0.01);
          box-shadow: 0 0 8px 0 var(--bubble-glow) inset, 0 32px 24px -16px var(--bubble-shadow);
        }
        .acd3-card[data-theme='light'] .acd3-bubble { background: rgba(255,255,255,0.6); }
        .acd3-bubble-sm { width: 32px; height: 32px; }
        .acd3-bubble-md { width: 48px; height: 48px; }
        .acd3-bubble-lg { width: 64px; height: 64px; }
        .acd3-mark {
          display: grid; place-items: center; border-radius: inherit;
          font-weight: 700; line-height: 1; color: #111;
        }
        .acd3-mark svg { display: block; width: 100%; height: 100%; }
        .acd3-mark-adobe { width: 16px; height: 16px; border-radius: 4px; background: #cc9b7a; font-size: 11px; }
        .acd3-mark-robot  { width: 24px; height: 24px; color: #111827; }
        .acd3-mark-openai { width: 32px; height: 32px; color: #111827; }
        .acd3-mark-meta   { width: 24px; height: 24px; color: #0671e9; }
        .acd3-mark-spark  { width: 16px; height: 16px; }
        .acd3-beam {
          position: absolute; top: 80px; left: 50%; z-index: 40;
          width: 1px; height: 160px;
          background: linear-gradient(to bottom, transparent 0%, var(--ks-patina) 50%, transparent 100%);
          animation: acd3-beam-move 5s linear infinite;
        }
        .acd3-beam::before, .acd3-beam::after {
          content: ''; position: absolute; top: 50%;
          width: 40px; height: 128px; transform: translateY(-50%); pointer-events: none;
        }
        .acd3-beam::before { right: 0; background: linear-gradient(to left, oklch(70% .12 188 / .18), transparent); }
        .acd3-beam::after  { left:  0; background: linear-gradient(to right, oklch(70% .12 188 / .18), transparent); }
        @keyframes acd3-beam-move {
          0%   { transform: translateX(-200px); }
          100% { transform: translateX(200px); }
        }
        @media (prefers-reduced-motion: reduce) { .acd3-beam { animation: none; opacity: 0.55; } }
        .acd3-title {
          margin: 0; padding: 0.5rem 0;
          color: var(--title-color);
          font-size: 1.125rem; font-weight: 700; line-height: 1.4;
        }
        .acd3-desc {
          max-width: 320px; margin: 0;
          color: var(--desc-color);
          font-size: 0.9375rem; font-weight: 400; line-height: 1.5;
        }
      `}</style>
      <article className="acd3-card" data-theme={theme} aria-label={title}>
        <div className="acd3-stage">
          <div className="acd3-stage-inner">
            <div className="acd3-icon-row" aria-hidden="true">
              <div className="acd3-bubble acd3-bubble-sm">
                <span className="acd3-mark acd3-mark-adobe">A</span>
              </div>
              <div className="acd3-bubble acd3-bubble-md">
                <span className="acd3-mark acd3-mark-robot">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9.75 14a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 .75-.75Zm4.5 0a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 .75-.75Z" />
                    <path d="M12 2c2.2 0 4.25.66 5.75 1.76 1.94 1.42 3 3.55 3 6.05v3.69c0 4.38-3.92 7.5-8.75 7.5s-8.75-3.12-8.75-7.5V9.81c0-2.5 1.06-4.63 3-6.05C7.75 2.66 9.8 2 12 2Zm0 3.1c-3.2 0-5.75 1.82-5.75 4.7v3.7c0 2.55 2.43 4.5 5.75 4.5s5.75-1.95 5.75-4.5V9.8c0-2.88-2.55-4.7-5.75-4.7Z" />
                  </svg>
                </span>
              </div>
              <div className="acd3-bubble acd3-bubble-lg">
                <span className="acd3-mark acd3-mark-openai">
                  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path fill="currentColor" d="M26.15 11.46a6.9 6.9 0 0 0-.61-5.73 7.1 7.1 0 0 0-7.7-3.38A7.1 7.1 0 0 0 12.51 0 7.2 7.2 0 0 0 5.7 4.89 7 7 0 0 0 1.85 16.54a6.9 6.9 0 0 0 .61 5.73 7.1 7.1 0 0 0 7.7 3.38A7.1 7.1 0 0 0 15.49 28a7.2 7.2 0 0 0 6.82-4.89 7 7 0 0 0 3.84-11.65Zm-10.6 14.71a5.2 5.2 0 0 1-3.46-1.21l.17-.1 5.65-3.22a.91.91 0 0 0 .46-.79v-7.86l2.39 1.36a.09.09 0 0 1 .05.07v6.51c0 2.95-2.49 5.24-5.26 5.24Zm-9.7-4.8a5.17 5.17 0 0 1-.64-3.52l.17.1 5.65 3.22c.29.17.64.17.93 0l6.9-3.93v2.72a.09.09 0 0 1-.04.07l-5.72 3.25a5.2 5.2 0 0 1-7.25-1.91Zm-3.25-7.87a5.12 5.12 0 0 1 2.83-2.31v6.71c0 .33.18.64.47.8l6.9 3.93-2.39 1.36a.09.09 0 0 1-.08 0L4.61 20.74a5.13 5.13 0 0 1-2.01-7.24Zm19.52 5.31v-6.72a.91.91 0 0 0-.47-.79l-6.9-3.93 2.39-1.36a.09.09 0 0 1 .08 0l5.72 3.25a5.16 5.16 0 0 1-.82 10.55ZM9.63 15.01l-2.39-1.36a.09.09 0 0 1-.05-.07V7.07c0-2.95 2.49-5.24 5.26-5.24 1.41 0 2.5.43 3.46 1.21l-.17.1-5.65 3.22a.91.91 0 0 0-.46.79v7.86Zm1.51-6.97 3.07-1.75 3.07 1.75v3.5l-3.07 1.75-3.07-1.75v-3.5Z" />
                  </svg>
                </span>
              </div>
              <div className="acd3-bubble acd3-bubble-md">
                <span className="acd3-mark acd3-mark-meta">
                  <svg viewBox="0 0 96 64" fill="none" aria-hidden="true">
                    <path fill="currentColor" d="M18.7 52C8.9 52 3 44.6 3 34.4 3 24.3 9 12 19.8 12c7 0 12.5 4.7 18.9 14.2l3.4 5.1 3.5-5.1C52 16.7 57.6 12 64.4 12 75.1 12 93 23.2 93 39.1 93 47 88.7 52 82.2 52c-7.2 0-12.5-4.9-21.6-18.3l-2.8-4.2-7.7 11.8C42.9 52.1 36.5 52 33.6 52c-4.7 0-8.8-2.5-12.1-6.8C20.4 49.6 19.4 52 18.7 52Zm.8-31.4c-5.3 0-9.2 8.5-9.2 14 0 5.4 2.9 9.4 7.1 9.4 3.4 0 6.4-2.6 12-11l3.1-4.7c-4.9-6.8-8.6-7.7-13-7.7Zm44.9 0c-4.4 0-8 1-13 7.7l3.3 5c7.2 10.9 10.8 12.9 15.1 12.9 3.7 0 5.9-2.4 5.9-6.7 0-9.1-7.5-18.9-11.3-18.9Z" />
                  </svg>
                </span>
              </div>
              <div className="acd3-bubble acd3-bubble-sm">
                <span className="acd3-mark acd3-mark-spark">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M16 8.016A8.522 8.522 0 0 0 8.016 16h-.032A8.521 8.521 0 0 0 0 8.016v-.032A8.521 8.521 0 0 0 7.984 0h.032A8.522 8.522 0 0 0 16 7.984v.032Z" fill="url(#acd3-spark-grad)" />
                    <defs>
                      <radialGradient id="acd3-spark-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)">
                        <stop offset=".067" stopColor="#9168C0" />
                        <stop offset=".343" stopColor="#5684D1" />
                        <stop offset=".672" stopColor="#1BA1E3" />
                      </radialGradient>
                    </defs>
                  </svg>
                </span>
              </div>
            </div>
            <div className="acd3-beam" aria-hidden="true" />
          </div>
        </div>
        <h3 className="acd3-title">{title}</h3>
        <p className="acd3-desc">{description}</p>
      </article>
    </>
  )
}
