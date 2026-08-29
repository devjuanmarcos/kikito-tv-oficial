"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import type { MarkdownRendererProps } from "./markdown-renderer.types";

// Célula de tabela: remove pipe líder/final e separa pelo resto
function splitTableRow(row: string): string[] {
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function renderTableRow(cells: string[], tag: "th" | "td"): string {
  const wrapped = cells.map((c) => `<${tag}>${c}</${tag}>`);
  return `<tr>${wrapped.join("")}</tr>`;
}

function renderTable(header: string, bodyBlock: string): string {
  const thead = `<thead>${renderTableRow(splitTableRow(header), "th")}</thead>`;
  const rows = bodyBlock.split("\n").filter((l) => l.trim());
  const bodyRows = rows.map((r) => renderTableRow(splitTableRow(r), "td"));
  const tbody = rows.length ? `<tbody>${bodyRows.join("")}</tbody>` : "";
  return `<table>${thead}${tbody}</table>`;
}

function parseMarkdown(md: string): string {
  return (
    md
      .replace(/```[\w]*\n?([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      // Tabela GFM: linha de cabeçalho + linha separadora (---|---|---) + linhas de corpo.
      // A estilização (`[&_table]`/`[&_th]`/`[&_td]`) já existia, mas nunca havia parser —
      // registry chegava a anunciar suporte a tabelas sem nenhum código que o implementasse.
      .replace(
        /^(\|.+\|)[ \t]*\n(\|[ \t]*:?-+:?[ \t]*(?:\|[ \t]*:?-+:?[ \t]*)*\|?)[ \t]*\n((?:\|.*\|[ \t]*\n?)*)/gm,
        (_match, header: string, _sep: string, body: string) => renderTable(header, body)
      )
      .replace(/^#{6}\s(.+)$/gm, "<h6>$1</h6>")
      .replace(/^#{5}\s(.+)$/gm, "<h5>$1</h5>")
      .replace(/^#{4}\s(.+)$/gm, "<h4>$1</h4>")
      .replace(/^###\s(.+)$/gm, "<h3>$1</h3>")
      .replace(/^##\s(.+)$/gm, "<h2>$1</h2>")
      .replace(/^#\s(.+)$/gm, "<h1>$1</h1>")
      .replace(/^---$/gm, "<hr/>")
      .replace(/^>\s(.+)$/gm, "<blockquote>$1</blockquote>")
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // Imagem — precisa rodar ANTES do regex de link, senão `![alt](src)` vira `!<a>alt</a>`
      // (mesmo padrão `[]()`, distinguido só pelo `!` líder). Estilização `[&_img]` já
      // existia sem parser nenhum, mesmo achado da tabela.
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^\s*[-*+]\s(.+)$/gm, "<li>$1</li>")
      .replace(/^\d+\.\s(.+)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
      .replace(/^(?!<[a-z]).+$/gm, (line) => (!line.trim() ? "" : `<p>${line}</p>`))
      .replace(/\n{2,}/g, "\n")
  );
}

export function MarkdownRenderer({ content, className, style }: MarkdownRendererProps) {
  // O parser abaixo é regex ingênuo: não escapa HTML bruto do input antes de
  // transformar a sintaxe markdown, então `content` com HTML/script arbitrário
  // passava direto pro DOM via dangerouslySetInnerHTML (XSS real, achado grave).
  // Sanitiza a saída com o mesmo helper já usado pra rich text confiável no
  // resto do projeto (src/lib/sanitize.ts), que permite exatamente o conjunto
  // de tags que este parser produz e bloqueia script/on*/etc.
  //
  // Import dinâmico (não top-level): `sanitize.ts` importa `isomorphic-dompurify`,
  // que inicializa jsdom no módulo assim que é importado — nesse projeto essa
  // inicialização quebra em SSR (ENOENT em jsdom/.../default-stylesheet.css,
  // problema de resolução de asset do jsdom sob o bundler, não deste componente).
  // Import dinâmico dentro de useEffect garante que o módulo só é avaliado no
  // client, onde isomorphic-dompurify usa o DOMPurify real do browser (sem jsdom).
  const [html, setHtml] = useState("");
  useEffect(() => {
    let cancelled = false;
    import("@/lib/sanitize").then(({ sanitizeRichText }) => {
      if (!cancelled) setHtml(sanitizeRichText(parseMarkdown(content)));
    });
    return () => {
      cancelled = true;
    };
  }, [content]);

  return (
    <div
      className={cn(
        "text-foreground leading-[1.7] text-body-callout",
        // Tamanhos/espaçamentos em `em` abaixo (headings, code inline, listas): escala
        // proporcional ao font-size do próprio elemento (padrão de "prose" content),
        // não valor fixo fora da escala de tokens — mesma exceção já usada em Tabs
        // pros ícones que herdam tamanho do texto pai.
        "[&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-(--spacing-2xl) [&_h1]:mb-(--spacing-sm) [&_h1]:leading-snug [&_h1]:text-[2em]",
        "[&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-(--spacing-2xl) [&_h2]:mb-(--spacing-sm) [&_h2]:leading-snug [&_h2]:text-[1.5em] [&_h2]:border-b [&_h2]:border-rule [&_h2]:pb-[0.3em]",
        "[&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-(--spacing-2xl) [&_h3]:mb-(--spacing-sm) [&_h3]:leading-snug [&_h3]:text-[1.25em]",
        "[&_h4]:font-bold [&_h4]:text-foreground [&_h4]:mt-(--spacing-2xl) [&_h4]:mb-(--spacing-sm) [&_h4]:leading-snug [&_h4]:text-[1em]",
        "[&_p]:my-(--spacing-md)",
        "[&_a]:text-patina [&_a]:underline [&_a:hover]:text-patina-deep",
        "[&_strong]:font-bold [&_strong]:text-foreground",
        "[&_em]:italic [&_em]:text-muted",
        "[&_code]:font-mono [&_code]:text-[0.85em] [&_code]:bg-sunken [&_code]:border [&_code]:border-rule [&_code]:rounded-xs [&_code]:px-[0.4em] [&_code]:py-[0.1em] [&_code]:text-patina",
        "[&_pre]:bg-sunken [&_pre]:border [&_pre]:border-rule [&_pre]:rounded-(--radius-md) [&_pre]:p-(--spacing-lg) [&_pre]:overflow-x-auto [&_pre]:my-(--spacing-lg)",
        "[&_pre_code]:bg-transparent [&_pre_code]:border-none [&_pre_code]:p-0 [&_pre_code]:text-foreground [&_pre_code]:text-body-caption",
        // rounded-r-[--radius-sm] (bracket cru, direcional) confirmado quebrado — usa sintaxe de parenteses
        "[&_blockquote]:border-l-(length:--border-width-thick) [&_blockquote]:border-l-patina [&_blockquote]:my-(--spacing-lg) [&_blockquote]:py-(--spacing-sm) [&_blockquote]:px-(--spacing-lg) [&_blockquote]:text-muted [&_blockquote]:bg-raised [&_blockquote]:rounded-r-(--radius-sm)",
        "[&_ul]:my-(--spacing-md) [&_ul]:pl-[1.6em] [&_ol]:my-(--spacing-md) [&_ol]:pl-[1.6em]",
        "[&_li]:my-[0.3em] [&_li::marker]:text-faint",
        "[&_hr]:border-none [&_hr]:border-t [&_hr]:border-rule [&_hr]:my-(--spacing-xl)",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:my-(--spacing-lg) [&_table]:text-body-callout",
        "[&_th]:px-(--spacing-md) [&_th]:py-(--spacing-sm) [&_th]:bg-sunken [&_th]:border [&_th]:border-rule [&_th]:font-bold [&_th]:text-muted [&_th]:text-left",
        "[&_td]:px-(--spacing-md) [&_td]:py-(--spacing-sm) [&_td]:border [&_td]:border-rule [&_td]:text-foreground",
        "[&_img]:max-w-full [&_img]:rounded-(--radius-md)",
        className
      )}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }} // eslint-disable-line react/no-danger
    />
  );
}
