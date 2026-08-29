"use client";
import { useState } from "react";

import { Button } from "@/components/ui/cn/button/Button";
import { cn } from "@/lib/utils";

import type { CodeBlockProps } from "./code-block.types";

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="w-3.5 h-3.5">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
    className="w-3.5 h-3.5 text-success"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
  maxHeight,
  className,
  style,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      style={style}
      className={cn(
        // text-body-callout: sem match exato na escala pro tamanho original (13px, entre
        // caption e callout) — alinhado ao mesmo tamanho já usado no TerminalBlock (componente
        // irmão de exibição de código)
        "group relative rounded-(--radius-md) border border-rule bg-graphite overflow-hidden text-body-callout font-mono",
        className
      )}
    >
      {(filename || language) && (
        <div className="flex items-center justify-between px-(--spacing-lg) py-(--spacing-sm) border-b border-rule bg-graphite-2">
          <div className="flex items-center gap-(--spacing-sm)">
            {filename && <span className="text-body-caption text-foreground font-medium">{filename}</span>}
            {language && !filename && (
              <span className="text-body-caption text-faint uppercase tracking-wide">{language}</span>
            )}
            {language && filename && <span className="text-body-caption text-faint">{language}</span>}
          </div>
          <Button
            type="button"
            variant="ghost"
            intent="neutral"
            size="xs"
            aria-label={copied ? "Copied!" : "Copy code"}
            aria-live="polite"
            onClick={copy}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </Button>
        </div>
      )}

      <div className="relative overflow-auto" style={maxHeight ? { maxHeight } : undefined}>
        {!filename && !language && (
          <button
            type="button"
            aria-label={copied ? "Copied!" : "Copy code"}
            aria-live="polite"
            onClick={copy}
            className={cn(
              "absolute top-(--spacing-sm) right-(--spacing-sm) z-10 flex items-center gap-(--spacing-2xs)",
              "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 transition-opacity",
              "text-faint hover:text-foreground bg-graphite-2 border border-rule rounded-(--radius-sm) px-(--spacing-sm) py-(--spacing-2xs) text-body-caption"
            )}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        )}
        {/* role="presentation": usado só pra alinhar número da linha com o código, não é
            dado tabular de verdade — sem isso, leitor de tela anunciava "tabela com N linhas"
            pra um simples bloco de código */}
        <table className="w-full border-collapse" role="presentation">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-foreground/[0.03]">
                {showLineNumbers && (
                  <td
                    aria-hidden="true"
                    className="select-none text-right text-faint pr-(--spacing-lg) pl-(--spacing-lg) py-0 leading-6 w-px align-top border-r border-rule"
                  >
                    {i + 1}
                  </td>
                )}
                <td
                  className={cn(
                    "py-0 leading-6 text-foreground",
                    showLineNumbers ? "pl-(--spacing-lg) pr-(--spacing-lg)" : "px-(--spacing-lg)"
                  )}
                >
                  <pre className="m-0 whitespace-pre">{line || " "}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
