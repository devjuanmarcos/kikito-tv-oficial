"use client";

import Image from "next/image";

/* Número de fileiras do loader que preenchem a tela inteira */
const ROWS = 28;

export default function Loading() {
  return (
    <div className="kload" role="status" aria-live="polite" aria-label="Carregando">
      <style>{`
        .kload {
          position: fixed; inset: 0; z-index: 9999;
          overflow: hidden;
          background: var(--ks-lacquer, #0b0b0c);
          display: grid; place-items: center;
        }

        /* Camada de fundo: várias fileiras de loaders amarelos translúcidos */
        .kload-field {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem 0;
          pointer-events: none;
        }

        .kload-row {
          display: inline-grid;
          width: 100%;
        }
        .kload-row:before,
        .kload-row:after {
          content: "";
          grid-area: 1/1;
          height: 30px;
          --c: #0000 64%, rgba(245, 197, 24, 0.16) 66% 98%, #0000 101%;
          background:
            radial-gradient(35% 146% at 50% 159%, var(--c)) 0 0,
            radial-gradient(35% 146% at 50% -59%, var(--c)) 25% 100%;
          background-size: calc(100% / 3) 50%;
          background-repeat: repeat-x;
          -webkit-mask: repeating-linear-gradient(90deg, #000 0 15%, #0000 0 50%) 0 0 / 200%;
          mask: repeating-linear-gradient(90deg, #000 0 15%, #0000 0 50%) 0 0 / 200%;
          animation: kload-slide 0.8s infinite linear;
        }
        .kload-row:after { scale: -1; }
        .kload-row:nth-child(even):before,
        .kload-row:nth-child(even):after { animation-direction: reverse; }
        @keyframes kload-slide {
          to { -webkit-mask-position: -100% 0; mask-position: -100% 0; }
        }

        /* Logo girando + texto, no meio para baixo */
        .kload-center {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center; gap: 1.25rem;
          margin-top: 14vh;
        }
        .kload-logo {
          width: 116px; height: 116px;
          border-radius: 9999px;
          overflow: hidden;
          box-shadow: 0 0 0 4px rgba(245, 197, 24, 0.25), 0 12px 40px rgba(0, 0, 0, 0.45);
          animation: kload-spin 1.4s infinite cubic-bezier(0.65, 0, 0.35, 1);
        }
        .kload-logo img { width: 100%; height: 100%; object-fit: cover; }
        @keyframes kload-spin {
          to { transform: rotate(360deg); }
        }

        .kload-text {
          font-size: 0.8125rem; font-weight: 700; letter-spacing: 0.35em;
          text-transform: uppercase; color: rgba(245, 197, 24, 0.9);
          display: inline-flex;
        }
        .kload-text span { animation: kload-blink 1.4s infinite both; }
        .kload-text span:nth-child(2) { animation-delay: 0.2s; }
        .kload-text span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes kload-blink {
          0%, 80%, 100% { opacity: 0.35; }
          40% { opacity: 1; }
        }
      `}</style>

      {/* Campo de loaders amarelos cobrindo a tela */}
      <div className="kload-field" aria-hidden>
        {Array.from({ length: ROWS }).map((_, i) => (
          <span key={i} className="kload-row" />
        ))}
      </div>

      {/* Logo girando ao centro-inferior */}
      <div className="kload-center">
        <span className="kload-logo">
          <Image src="/img/kikito-face.png" alt="Kikito" width={116} height={116} priority />
        </span>
        <span className="kload-text">
          loading<span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    </div>
  );
}
