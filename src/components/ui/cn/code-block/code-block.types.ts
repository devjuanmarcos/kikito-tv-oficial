import type React from "react";

/** Um arquivo dentro do modo multi-arquivo (`files`) — cada um vira uma aba. */
export interface CodeBlockFile {
  filename: string;
  code: string;
  language?: string;
}

export interface CodeBlockProps {
  /** Código do arquivo único (modo default). Ignorado quando `files` é passado. */
  code?: string;
  language?: string;
  filename?: string;
  /**
   * Modo multi-arquivo — abas trocando entre arquivos diferentes (ex.: tabs.tsx /
   * hooks.ts / api.ts do mesmo exemplo). Quando presente, `code`/`filename`/`language`
   * únicos são ignorados. Origem: shadcndashboard, aprovado em
   * docs/component-import/variant-intake/DECISIONS.md #7 (abas por arquivo — abas por
   * linguagem tipo curl/JS/Python do mesmo conteúdo NÃO entra nesta rodada).
   */
  files?: CodeBlockFile[];
  /** Aba ativa inicial em modo `files` (uncontrolled). @default 0 */
  defaultFileIndex?: number;
  showLineNumbers?: boolean;
  maxHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}
