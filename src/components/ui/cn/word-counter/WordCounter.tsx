"use client";

import { useState } from "react";

import { Label } from "@/components/ui/cn/label/Label";
import { Textarea } from "@/components/ui/cn/textarea/Textarea";
import { cn } from "@/lib/utils";

import type { WordCounterProps } from "./word-counter.types";

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}
function countSentences(text: string): number {
  return (text.match(/[.!?]+\s/g) || []).length + (text.trim().match(/[.!?]$/) ? 1 : 0);
}
function readTimeMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200));
}

export function WordCounter({
  value: controlled,
  defaultValue = "",
  onChange,
  maxWords,
  maxChars,
  rows = 5,
  placeholder = "Start typing…",
  label,
  showSentences = true,
  showReadTime = true,
  className,
  style,
}: WordCounterProps) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = controlled !== undefined;
  const text = isControlled ? controlled : internal;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };

  const words = countWords(text);
  const chars = text.length;
  const sentences = countSentences(text);
  const readTime = readTimeMinutes(words);

  const wordsOver = maxWords !== undefined && words > maxWords;
  const charsOver = maxChars !== undefined && chars > maxChars;
  const isOver = wordsOver || charsOver;

  const limitPct = maxWords
    ? Math.min((words / maxWords) * 100, 100)
    : maxChars
      ? Math.min((chars / maxChars) * 100, 100)
      : 0;

  return (
    <div className={cn("flex flex-col gap-2", className)} style={style}>
      {label && <Label size="md">{label}</Label>}

      <Textarea
        className="w-full"
        state={isOver ? "error" : "default"}
        resize="vertical"
        value={text}
        onChange={handleChange}
        rows={rows}
        placeholder={placeholder}
      />

      {(maxWords || maxChars) && (
        <div className="h-[3px] rounded-pill bg-sunken overflow-hidden">
          <div
            className={cn(
              "h-full rounded-pill transition-[width,background] duration-[150ms]",
              isOver ? "bg-danger" : "bg-patina"
            )}
            style={{ width: `${limitPct}%` }}
          />
        </div>
      )}

      <div className="flex gap-4 flex-wrap">
        {[
          { value: maxWords ? `${words}/${maxWords}` : String(words), label: "words", over: wordsOver },
          { value: maxChars ? `${chars}/${maxChars}` : String(chars), label: "chars", over: charsOver },
          ...(showSentences ? [{ value: String(sentences), label: "sentences", over: false }] : []),
          ...(showReadTime && words > 0 ? [{ value: String(readTime), label: "min read", over: false }] : []),
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-[2px] min-w-[60px]">
            <span
              className={cn(
                "text-body-title font-bold tabular-nums text-foreground leading-none",
                s.over && "text-danger"
              )}
            >
              {s.value}
            </span>
            <span className="text-body-caption opacity-40 uppercase tracking-[0.05em]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
