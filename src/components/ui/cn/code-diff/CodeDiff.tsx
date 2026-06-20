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

const LINE_BG: Record<string, string> = {
  added: "bg-success/10",
  removed: "bg-danger/10",
  unchanged: "",
};
const LINE_SIGN: Record<string, string> = {
  added: "text-success",
  removed: "text-danger",
  unchanged: "text-faint",
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
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");

  return (
    <div
      className={cn(
        "rounded-(--radius-md) border border-rule bg-canvas overflow-hidden font-mono text-body-callout",
        className
      )}
      style={style}
    >
      {(filename || language) && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-rule bg-raised">
          {filename && <span className="text-foreground font-medium">{filename}</span>}
          {language && <span className="text-faint text-body-caption ml-auto">{language}</span>}
        </div>
      )}

      <div style={{ maxHeight, overflow: "auto" }}>
        {splitView ? (
          <div className="grid grid-cols-2 divide-x divide-rule">
            {(["before", "after"] as const).map((side) => {
              const lines = side === "before" ? beforeLines : afterLines;
              return (
                <div key={side}>
                  <div className="px-4 py-1 bg-raised border-b border-rule text-faint text-body-caption font-semibold uppercase tracking-wide">
                    {side === "before" ? "− Before" : "+ After"}
                  </div>
                  <table className="w-full border-collapse">
                    <tbody>
                      {lines.map((content, idx) => (
                        <tr key={idx} className="hover:bg-raised/50">
                          {showLineNumbers && (
                            <td className="select-none w-10 text-right pr-3 py-0.5 text-faint text-body-caption border-r border-rule/50">
                              {idx + 1}
                            </td>
                          )}
                          <td className="py-0.5 pl-3 whitespace-pre text-foreground">{content}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        ) : (
          <table className="w-full border-collapse">
            <tbody>
              {diff.map((line, idx) => (
                <tr key={idx} className={LINE_BG[line.type]}>
                  {showLineNumbers && (
                    <>
                      <td className="select-none w-8 text-right pr-2 py-0.5 text-faint text-body-caption border-r border-rule/50">
                        {line.type !== "added" ? line.oldNum ?? "" : ""}
                      </td>
                      <td className="select-none w-8 text-right pr-2 py-0.5 text-faint text-body-caption border-r border-rule/50">
                        {line.type !== "removed" ? line.newNum ?? "" : ""}
                      </td>
                    </>
                  )}
                  <td className={cn("select-none w-5 text-center py-0.5 font-bold", LINE_SIGN[line.type])}>
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </td>
                  <td className="py-0.5 pl-2 whitespace-pre text-foreground">{line.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
