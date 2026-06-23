"use client";

import { useState } from "react";

export function KkCodeBlockCopy({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copiado!" : "Copiar código"}
      className="flex items-center gap-1.5 text-faint hover:text-foreground transition-colors text-body-caption"
    >
      {copied ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden
          className="w-3.5 h-3.5 text-success"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="w-3.5 h-3.5">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      <span>{copied ? "Copiado" : "Copiar"}</span>
    </button>
  );
}
