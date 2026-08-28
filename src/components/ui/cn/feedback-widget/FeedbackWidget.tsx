"use client";

import { useState } from "react";

import { Button } from "@/components/ui/cn/button";
import { Textarea } from "@/components/ui/cn/textarea/Textarea";
import { cn } from "@/lib/utils";

import type { FeedbackWidgetProps } from "./feedback-widget.types";

const EMOJIS = [
  { label: "Terrible", icon: "😡" },
  { label: "Bad", icon: "😕" },
  { label: "Okay", icon: "😐" },
  { label: "Good", icon: "😊" },
  { label: "Great", icon: "🤩" },
];

export function FeedbackWidget({
  type = "stars",
  title = "How are we doing?",
  placeholder = "Tell us more (optional)…",
  onSubmit,
  className,
  style,
}: FeedbackWidgetProps) {
  const [score, setScore] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (score === null) return;
    onSubmit?.(score, comment);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className={cn(
          "rounded-(--radius-lg) border border-rule bg-raised p-(--spacing-2xl) flex flex-col items-center gap-(--spacing-2xs)",
          className
        )}
        style={style}
      >
        <span className="text-heading-02">🎉</span>
        <p className="font-bold text-foreground">Thank you!</p>
        <p className="text-muted text-body-callout">Your feedback means a lot to us.</p>
      </div>
    );
  }

  return (
    <div
      // p-5 (1.25rem): sem match exato na escala de spacing
      className={cn(
        "rounded-(--radius-lg) border border-rule bg-raised p-5 flex flex-col gap-(--spacing-lg)",
        className
      )}
      style={style}
    >
      <p className="font-semibold text-foreground text-body-paragraph">{title}</p>

      {type === "nps" && (
        <>
          <div className="flex flex-wrap gap-(--spacing-2xs)">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => setScore(i)}
                aria-pressed={score === i}
                aria-label={`Score ${i}`}
                className={cn(
                  "w-8 h-8 rounded-(--radius-sm) border text-body-callout font-medium transition-colors",
                  score === i
                    ? "bg-patina text-patina-fg border-transparent"
                    : "border-rule text-muted hover:border-patina/50 hover:text-foreground"
                )}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-body-caption text-faint">
            <span>Not likely</span>
            <span>Very likely</span>
          </div>
        </>
      )}

      {type === "stars" && (
        <div className="flex gap-(--spacing-2xs)">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setScore(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(null)}
              aria-pressed={score !== null && n <= score}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className={cn(
                "text-heading-04 transition-transform hover:scale-110",
                n <= (hovered ?? score ?? 0) ? "text-kinpaku" : "text-faint"
              )}
            >
              {n <= (hovered ?? score ?? 0) ? "★" : "☆"}
            </button>
          ))}
        </div>
      )}

      {type === "emoji" && (
        <div className="flex gap-(--spacing-sm)">
          {EMOJIS.map((e, i) => (
            <button
              key={i}
              onClick={() => setScore(i)}
              aria-pressed={score === i}
              aria-label={e.label}
              title={e.label}
              className={cn(
                "text-heading-05 p-(--spacing-sm) rounded-(--radius-sm) border transition-all hover:scale-110",
                score === i ? "border-patina bg-patina-soft" : "border-transparent hover:border-rule"
              )}
            >
              {e.icon}
            </button>
          ))}
        </div>
      )}

      <Textarea
        className="w-full"
        rows={3}
        resize="none"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={placeholder}
      />

      <Button intent="primary" variant="solid" fullWidth onClick={handleSubmit} disabled={score === null}>
        Submit feedback
      </Button>
    </div>
  );
}
