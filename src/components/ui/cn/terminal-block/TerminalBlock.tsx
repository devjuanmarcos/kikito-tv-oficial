"use client";
import type React from "react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

export type TerminalLineType = "command" | "output" | "error" | "info" | "success";

export interface TerminalLine {
  text: string;
  type?: TerminalLineType;
  prompt?: string;
}

export interface TerminalBlockProps {
  lines: TerminalLine[];
  title?: string;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const LINE_CLS: Record<TerminalLineType, string> = {
  command: "text-foreground",
  output: "text-faint/80",
  error: "text-danger",
  info: "text-info",
  success: "text-success",
};

function TrafficDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-full bg-danger/70" />
      <span className="w-3 h-3 rounded-full bg-warning/70" />
      <span className="w-3 h-3 rounded-full bg-success/70" />
    </div>
  );
}

export function TerminalBlock({ lines, title = "Terminal", animate = false, className, style }: TerminalBlockProps) {
  const [visibleCount, setVisibleCount] = useState(animate ? 0 : lines.length);

  useEffect(() => {
    if (!animate) {
      setVisibleCount(lines.length);
      return;
    }
    setVisibleCount(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= lines.length) clearInterval(id);
    }, 180);
    return () => clearInterval(id);
  }, [animate, lines]);

  return (
    <div
      style={style}
      className={cn("rounded-xl border border-rule overflow-hidden font-mono text-body-callout", className)}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-graphite-2 border-b border-rule">
        <TrafficDots />
        <span className="text-body-caption text-faint">{title}</span>
        <div className="w-[3.75rem]" />
      </div>

      {/* Lines — bg-[#0d1117] intencional: corpo do terminal precisa ficar mais escuro que
          qualquer superfície do tema (bg-graphite-2 usado na title bar não é escuro o
          suficiente pra imitar um terminal real), independente de light/dark — sem token
          equivalente. */}
      <div className="bg-[#0d1117] px-4 py-4 space-y-1 min-h-[80px]">
        {lines.slice(0, visibleCount).map((line, i) => (
          <div key={i} className={cn("leading-relaxed", LINE_CLS[line.type ?? "output"])}>
            {line.type === "command" && <span className="text-patina mr-1.5 select-none">{line.prompt ?? "$"}</span>}
            {line.text || <span>&nbsp;</span>}
          </div>
        ))}
        {animate && visibleCount < lines.length && (
          <span className="inline-block w-[6px] h-4 bg-foreground/60 animate-pulse" />
        )}
      </div>
    </div>
  );
}
