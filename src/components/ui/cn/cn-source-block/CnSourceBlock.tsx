"use client";

import { useState } from "react";

import { CodeBlock } from "@/components/ui/cn/code-block";

interface CnSourceBlockProps {
  source: string;
  filename?: string;
}

const PREVIEW_LINES = 18;

export function CnSourceBlock({ source, filename }: CnSourceBlockProps) {
  const [expanded, setExpanded] = useState(false);

  const lines = source.split("\n");
  const isLong = lines.length > PREVIEW_LINES;
  const displaySource = expanded || !isLong ? source : lines.slice(0, PREVIEW_LINES).join("\n");

  return (
    <div data-testid="cn-source-block" className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-body-caption font-semibold text-foreground">Código-fonte</span>
        {filename && <span className="text-body-caption font-mono text-faint">{filename}</span>}
      </div>

      <div className="relative">
        <CodeBlock code={displaySource} filename={filename} language="tsx" showLineNumbers />

        {isLong && !expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-graphite to-transparent rounded-b-(--radius-md) pointer-events-none" />
        )}
      </div>

      {isLong && (
        <button
          type="button"
          data-testid="cn-source-toggle"
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-(--radius-sm) border border-rule bg-graphite hover:bg-raised text-faint hover:text-foreground transition-colors text-body-caption"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
            className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          {expanded ? `Recolher (${lines.length} linhas)` : `Ver código completo (${lines.length} linhas)`}
        </button>
      )}
    </div>
  );
}
