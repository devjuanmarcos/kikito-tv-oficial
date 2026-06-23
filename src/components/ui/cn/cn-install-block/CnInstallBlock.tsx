"use client";

import { useState } from "react";

interface CnInstallBlockProps {
  name?: string;
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

export function CnInstallBlock({ name, peerDeps, dependencies }: CnInstallBlockProps) {
  const [copied, setCopied] = useState(false);
  const cmd = name ? `npx kikitocn add ${name}` : "npx kikitocn add <component>";
  const hasDeps = (dependencies && dependencies.length > 0) || (peerDeps && peerDeps.length > 0);

  function copy() {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div data-testid="cn-install-block">
      <div className="mb-2">
        <span className="text-body-caption font-semibold text-foreground">Instalação via CLI</span>
      </div>

      <div className="rounded-(--radius-md) border border-rule bg-[#0d1117] overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
              className="w-3.5 h-3.5 shrink-0 text-[#8b949e]"
            >
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <code className="text-[0.8125rem] font-mono truncate">
              <span className="text-[#7ee787] select-none">$ </span>
              <span className="text-[#e6edf3]">{cmd}</span>
            </code>
          </div>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copiado!" : "Copiar comando"}
            className="flex items-center gap-1.5 text-[#8b949e] hover:text-[#e6edf3] transition-colors text-body-caption shrink-0"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? "Copiado" : "Copiar"}</span>
          </button>
        </div>

        {hasDeps && (
          <div className="px-4 py-2.5 border-t border-[#30363d] bg-[#161b22] flex flex-wrap gap-x-6 gap-y-2">
            {peerDeps && peerDeps.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-body-caption text-[#8b949e]">Interno:</span>
                <div className="flex flex-wrap gap-1.5">
                  {peerDeps.map((d) => (
                    <code
                      key={d}
                      className="text-body-caption font-mono text-[#79c0ff] bg-[#0d1117] border border-[#30363d] rounded px-1.5 py-0.5"
                    >
                      {d}
                    </code>
                  ))}
                </div>
              </div>
            )}
            {dependencies && dependencies.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-body-caption text-[#8b949e]">npm:</span>
                <div className="flex flex-wrap gap-1.5">
                  {dependencies.map((d) => (
                    <code
                      key={d}
                      className="text-body-caption font-mono text-[#d2a8ff] bg-[#0d1117] border border-[#30363d] rounded px-1.5 py-0.5"
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
