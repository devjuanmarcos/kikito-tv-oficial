"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

import type { CodeDiffProps, DiffLine } from "./code-diff.types";

function computeDiff(before: string, after: string): DiffLine[] {
  const oldLines = before.split("\n");
  const newLines = after.split("\n");
  const matrix: number[][] = Array.from({ length: oldLines.length + 1 }, () => new Array(newLines.length + 1).fill(0));
  for (let i = 1; i <= oldLines.length; i++) {
    for (let j = 1; j <= newLines.length; j++) {
      matrix[i][j] =
        oldLines[i - 1] === newLines[j - 1]
          ? (matrix[i - 1][j - 1] ?? 0) + 1
          : Math.max(matrix[i - 1][j] ?? 0, matrix[i][j - 1] ?? 0);
    }
  }
  const result: DiffLine[] = [];
  let i = oldLines.length,
    j = newLines.length;
  let oldNum = oldLines.length,
    newNum = newLines.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.unshift({ type: "unchanged", content: oldLines[i - 1] ?? "", oldNum: oldNum--, newNum: newNum-- });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || (matrix[i][j - 1] ?? 0) >= (matrix[i - 1][j] ?? 0))) {
      result.unshift({ type: "added", content: newLines[j - 1] ?? "", newNum: newNum-- });
      j--;
    } else {
      result.unshift({ type: "removed", content: oldLines[i - 1] ?? "", oldNum: oldNum-- });
      i--;
    }
  }
  return result;
}

interface SplitRow {
  left: DiffLine | null;
  right: DiffLine | null;
}

// achado real: splitView renderizava before/after lado a lado a partir do texto cru,
// sem NENHUM highlight de diferença — o próprio propósito do componente ("diff viewer")
// não existia nesse modo, era só duas colunas de texto neutro. Reaproveita o mesmo
// resultado do computeDiff (LCS) já usado no modo unificado, alinhado em pares de coluna
// (linha ausente de um lado vira célula vazia), técnica padrão de diff split (GitHub etc)
function toSplitRows(diff: DiffLine[]): SplitRow[] {
  return diff.map((line) => {
    if (line.type === "unchanged") return { left: line, right: line };
    if (line.type === "removed") return { left: line, right: null };
    return { left: null, right: line };
  });
}

const LINE_BG: Record<DiffLine["type"], string> = {
  added: "bg-success-soft",
  removed: "bg-danger-soft",
  unchanged: "",
};
const LINE_SIGN: Record<DiffLine["type"], string> = {
  added: "text-success",
  removed: "text-danger",
  unchanged: "text-faint",
};
const LINE_SR_LABEL: Record<DiffLine["type"], string> = {
  added: "Added: ",
  removed: "Removed: ",
  unchanged: "",
};

export function CodeDiff({
  before,
  after,
  language,
  filename,
  showLineNumbers = true,
  splitView = false,
  maxHeight = 400,
  className,
  style,
}: CodeDiffProps) {
  const diff = useMemo(() => computeDiff(before, after), [before, after]);
  const splitRows = useMemo(() => toSplitRows(diff), [diff]);

  return (
    <div
      className={cn(
        "rounded-(--radius-md) border border-rule bg-canvas overflow-hidden font-mono text-body-callout",
        className
      )}
      style={style}
    >
      {(filename || language) && (
        <div className="flex items-center gap-(--spacing-sm) px-(--spacing-lg) py-(--spacing-sm) border-b border-rule bg-raised">
          {filename && <span className="text-foreground font-medium">{filename}</span>}
          {language && <span className="text-faint text-body-caption ml-auto">{language}</span>}
        </div>
      )}

      <div style={{ maxHeight, overflow: "auto" }}>
        {splitView ? (
          <div className="grid grid-cols-2 divide-x divide-rule">
            {(["left", "right"] as const).map((side) => (
              <div key={side}>
                <div className="px-(--spacing-lg) py-(--spacing-2xs) bg-raised border-b border-rule text-faint text-body-caption font-semibold uppercase tracking-wide">
                  {side === "left" ? "− Before" : "+ After"}
                </div>
                {/* role="presentation": grade de alinhamento (número + conteúdo), não dado
                    tabular de navegação — sem isso, leitor de tela anuncia "tabela com N linhas"
                    pra um diff de código */}
                <table className="w-full border-collapse" role="presentation">
                  <tbody>
                    {splitRows.map((row, idx) => {
                      const cell = row[side];
                      return (
                        <tr key={idx} className={cell ? LINE_BG[cell.type] : undefined}>
                          {showLineNumbers && (
                            <td
                              aria-hidden="true"
                              className="select-none w-10 text-right pr-(--spacing-md) py-(--spacing-3xs) text-faint text-body-caption border-r border-rule/50"
                            >
                              {cell ? (side === "left" ? cell.oldNum : cell.newNum) : ""}
                            </td>
                          )}
                          <td className="py-(--spacing-3xs) pl-(--spacing-md) whitespace-pre text-foreground">
                            {cell && <span className="sr-only">{LINE_SR_LABEL[cell.type]}</span>}
                            {cell?.content ?? " "}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full border-collapse" role="presentation">
            <tbody>
              {diff.map((line, idx) => (
                <tr key={idx} className={LINE_BG[line.type]}>
                  {showLineNumbers && (
                    <>
                      <td
                        aria-hidden="true"
                        className="select-none w-8 text-right pr-(--spacing-sm) py-(--spacing-3xs) text-faint text-body-caption border-r border-rule/50"
                      >
                        {line.type !== "added" ? line.oldNum ?? "" : ""}
                      </td>
                      <td
                        aria-hidden="true"
                        className="select-none w-8 text-right pr-(--spacing-sm) py-(--spacing-3xs) text-faint text-body-caption border-r border-rule/50"
                      >
                        {line.type !== "removed" ? line.newNum ?? "" : ""}
                      </td>
                    </>
                  )}
                  <td
                    aria-hidden="true"
                    className={cn("select-none w-5 text-center py-(--spacing-3xs) font-bold", LINE_SIGN[line.type])}
                  >
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </td>
                  <td className="py-(--spacing-3xs) pl-(--spacing-sm) whitespace-pre text-foreground">
                    <span className="sr-only">{LINE_SR_LABEL[line.type]}</span>
                    {line.content}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
