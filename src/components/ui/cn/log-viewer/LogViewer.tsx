"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { LogEntry, LogViewerProps } from "./log-viewer.types";

const LEVEL_STYLES: Record<string, string> = {
  debug: "bg-graphite text-faint",
  info: "bg-info-soft text-info-soft-fg",
  warn: "bg-warning-soft text-warning-soft-fg",
  error: "bg-danger-soft text-danger-soft-fg",
  success: "bg-success-soft text-success-soft-fg",
};

// bg-X/5: wash bem sutil na linha inteira (não é par bg/texto de contraste — o texto
// da mensagem continua text-foreground independente do nível), sem token -soft
// equivalente pra essa intensidade
const ROW_STYLES: Record<string, string> = {
  debug: "",
  info: "",
  warn: "bg-warning/5",
  error: "bg-danger/5",
  success: "bg-success/5",
};

function formatTs(ts: Date | string | undefined): string {
  if (!ts) return "";
  const d = ts instanceof Date ? ts : new Date(ts);
  return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function LogViewer({
  entries,
  maxHeight = 360,
  searchable = true,
  showTimestamps = true,
  showLevelBadge = true,
  autoScroll = true,
  emptyMessage = "No log entries.",
  className,
  style,
}: LogViewerProps) {
  const [query, setQuery] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query) return entries;
    const q = query.toLowerCase();
    return entries.filter((e) => e.message.toLowerCase().includes(q) || e.level.includes(q));
  }, [entries, query]);

  useEffect(() => {
    if (autoScroll) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries, autoScroll]);

  return (
    <div
      className={cn(
        "rounded-(--radius-md) border border-rule bg-canvas font-mono text-body-callout overflow-hidden",
        className
      )}
      style={{ maxHeight, ...style }}
    >
      {searchable && (
        <div className="flex items-center gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-sm) border-b border-rule bg-raised">
          <span aria-hidden="true" className="text-faint">
            🔍
          </span>
          <input
            aria-label="Filter logs"
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-faint"
            placeholder="Filter logs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-body-caption text-faint">
            {filtered.length} / {entries.length}
          </span>
        </div>
      )}

      <div
        role="log"
        className="overflow-y-auto divide-y divide-rule/50"
        style={{
          maxHeight: searchable
            ? `calc(${typeof maxHeight === "number" ? maxHeight + "px" : maxHeight} - 44px)`
            : maxHeight,
        }}
      >
        {filtered.length === 0 ? (
          <div className="px-(--spacing-lg) py-(--spacing-2xl) text-center text-faint">{emptyMessage}</div>
        ) : (
          filtered.map((entry: LogEntry, i: number) => (
            <div
              key={entry.id ?? i}
              className={cn(
                "flex items-start gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-xs)",
                ROW_STYLES[entry.level]
              )}
            >
              {showLevelBadge && (
                <span
                  // below scale minimum: micro-label decorativo (badge de nível)
                  className={cn(
                    "shrink-0 text-[0.5625rem] font-bold px-(--spacing-xs) py-(--spacing-3xs) rounded-(--radius-xs) uppercase tracking-wide",
                    LEVEL_STYLES[entry.level]
                  )}
                >
                  {entry.level}
                </span>
              )}
              {showTimestamps && entry.timestamp && (
                // mt-px: ajuste fino de alinhamento óptico com o badge, não é spacing genérico
                <span className="shrink-0 text-faint text-body-caption tabular-nums mt-px">
                  {formatTs(entry.timestamp)}
                </span>
              )}
              <span className="text-foreground break-all">{entry.message}</span>
              {entry.meta && <span className="text-faint text-body-caption ml-auto shrink-0">{entry.meta}</span>}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
