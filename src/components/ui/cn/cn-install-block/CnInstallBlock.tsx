"use client";

import { useState } from "react";

interface CnInstallBlockProps {
  filePath: string;
  peerDeps?: string[];
  dependencies?: string[];
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="w-3.5 h-3.5">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
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
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
      className="w-3.5 h-3.5 shrink-0 text-faint"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export function CnInstallBlock({ filePath, peerDeps, dependencies }: CnInstallBlockProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(filePath).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const hasDeps = (dependencies && dependencies.length > 0) || (peerDeps && peerDeps.length > 0);

  return (
    <div data-testid="cn-install-block">
      <div className="mb-2">
        <span className="text-body-caption font-semibold text-foreground">Instalação</span>
      </div>

      <div className="rounded-(--radius-md) border border-rule bg-raised overflow-hidden">
        {/* File path row */}
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <FileIcon />
            <code className="text-[0.8125rem] font-mono text-patina truncate">{filePath}</code>
          </div>
          <button
            type="button"
            data-testid="cn-install-copy"
            onClick={copy}
            aria-label={copied ? "Copiado!" : "Copiar caminho"}
            className="flex items-center gap-1.5 text-faint hover:text-foreground transition-colors text-body-caption shrink-0"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? "Copiado" : "Copiar"}</span>
          </button>
        </div>

        {/* Dependencies */}
        {hasDeps && (
          <div className="px-4 py-2.5 border-t border-rule bg-graphite flex flex-wrap gap-x-6 gap-y-2">
            {peerDeps && peerDeps.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-body-caption text-faint">Interno:</span>
                <div className="flex flex-wrap gap-1.5">
                  {peerDeps.map((d) => (
                    <code
                      key={d}
                      className="text-body-caption font-mono text-muted bg-raised border border-rule rounded-(--radius-xs) px-1.5 py-0.5"
                    >
                      {d}
                    </code>
                  ))}
                </div>
              </div>
            )}
            {dependencies && dependencies.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-body-caption text-faint">npm:</span>
                <div className="flex flex-wrap gap-1.5">
                  {dependencies.map((d) => (
                    <code
                      key={d}
                      className="text-body-caption font-mono text-muted bg-raised border border-rule rounded-(--radius-xs) px-1.5 py-0.5"
                    >
                      {d}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
