"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--ks-lacquer,#0b0b0c)]"
      role="status"
      aria-live="polite"
      aria-label="Carregando"
    >
      <style>{`
        .cnload-logo {
          width: 84px; height: 84px; border-radius: 9999px; overflow: hidden;
          box-shadow: 0 0 0 3px rgba(245, 197, 24, 0.25), 0 10px 32px rgba(0, 0, 0, 0.45);
          animation: cnload-spin 1.4s infinite cubic-bezier(0.65, 0, 0.35, 1);
        }
        .cnload-logo img { width: 100%; height: 100%; object-fit: cover; }
        @keyframes cnload-spin { to { transform: rotate(360deg); } }
        .cnload-text {
          font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(245, 197, 24, 0.9);
          animation: cnload-blink 1s linear infinite alternate;
        }
        @keyframes cnload-blink { to { opacity: 0.35; } }
      `}</style>

      <div className="flex flex-col items-center gap-4">
        <span className="cnload-logo">
          <Image src="/img/kikito-face.png" alt="Kikito" width={84} height={84} priority />
        </span>
        <span className="cnload-text">Carregando…</span>
      </div>
    </div>
  );
}
