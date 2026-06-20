"use client";
import type React from "react";
import { useState, useRef, type KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

export type TagInputSize = "sm" | "md" | "lg";

export interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  allowDuplicates?: boolean;
  delimiter?: string | RegExp;
  size?: TagInputSize;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_WRAP: Record<TagInputSize, string> = {
  sm: "min-h-[1.875rem] px-2 py-1 gap-1 text-[0.8125rem]",
  md: "min-h-[2.25rem]  px-2.5 py-1.5 gap-1.5 text-body-callout",
  lg: "min-h-[2.625rem] px-3 py-2 gap-2 text-body-paragraph",
};
const SIZE_TAG: Record<TagInputSize, string> = {
  sm: "h-4 px-1.5 text-[0.625rem]",
  md: "h-5 px-2   text-[0.6875rem]",
  lg: "h-6 px-2.5 text-body-caption",
};

const DEFAULT_DELIMITER = /[,;\s]+/;

export function TagInput({
  value,
  defaultValue = [],
  onChange,
  placeholder = "Add tag…",
  max,
  allowDuplicates = false,
  delimiter = DEFAULT_DELIMITER,
  size = "md",
  disabled = false,
  className,
  style,
}: TagInputProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const tags = isControlled ? value! : internal;

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function setTags(next: string[]) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  function addTag(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (max && tags.length >= max) return;
    if (!allowDuplicates && tags.includes(trimmed)) return;
    setTags([...tags, trimmed]);
    setInput("");
  }

  function removeTag(i: number) {
    setTags(tags.filter((_, idx) => idx !== i));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const parts = pasted.split(delimiter instanceof RegExp ? delimiter : new RegExp(delimiter));
    parts.forEach((p) => addTag(p));
  }

  const atMax = max !== undefined && tags.length >= max;

  return (
    <div
      style={style}
      onClick={() => inputRef.current?.focus()}
      className={cn(
        "flex flex-wrap w-full rounded-(--radius-md) border border-rule bg-raised cursor-text",
        "transition-[border-color] duration-[120ms] focus-within:border-patina",
        SIZE_WRAP[size],
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {tags.map((tag, i) => (
        <span
          key={i}
          className={cn(
            "inline-flex items-center gap-1 bg-patina/10 text-patina rounded-(--radius-xs) font-medium select-none whitespace-nowrap",
            SIZE_TAG[size]
          )}
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={(e) => {
              e.stopPropagation();
              removeTag(i);
            }}
            className="w-3 h-3 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="w-full h-full"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </span>
      ))}
      {!atMax && (
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={tags.length === 0 ? placeholder : undefined}
          disabled={disabled}
          className="flex-1 min-w-[6rem] bg-transparent outline-none text-foreground placeholder:text-faint"
        />
      )}
    </div>
  );
}
