import Image from "next/image";

/* Loader padrão das telas internas: logo girando + "Carregando…" */
export function KikitoSpinner() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--ks-lacquer,#0b0b0c)]"
      role="status"
      aria-live="polite"
      aria-label="Carregando"
    >
      <style>{`
        .ksp-logo {
          width: 84px; height: 84px; border-radius: 9999px; overflow: hidden;
          box-shadow: 0 0 0 3px rgba(245, 197, 24, 0.25), 0 10px 32px rgba(0, 0, 0, 0.45);
          animation: ksp-spin 1.4s infinite cubic-bezier(0.65, 0, 0.35, 1);
        }
        .ksp-logo img { width: 100%; height: 100%; object-fit: cover; }
        @keyframes ksp-spin { to { transform: rotate(360deg); } }
        .ksp-text {
          font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(245, 197, 24, 0.9);
          animation: ksp-blink 1s linear infinite alternate;
        }
        @keyframes ksp-blink { to { opacity: 0.35; } }
      `}</style>

      <div className="flex flex-col items-center gap-4">
        <span className="ksp-logo">
          <Image src="/img/kikito-face.png" alt="Kikito" width={84} height={84} priority />
        </span>
        <span className="ksp-text">Carregando…</span>
      </div>
    </div>
  );
}

export default KikitoSpinner;
