"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";

import { cn } from "@/lib/utils";

export interface InlineEditProps {
  value: string;
  onConfirm: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
    className="w-3.5 h-3.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
    className="w-3.5 h-3.5"
  >
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);
const PenIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    className="w-3 h-3 opacity-40"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export function InlineEdit({
  value,
  onConfirm,
  placeholder = "Click to edit…",
  multiline = false,
  disabled = false,
  className,
  style,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  function confirm() {
    const trimmed = draft.trim();
    onConfirm(trimmed || value);
    setEditing(false);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      confirm();
    }
    if (e.key === "Enter" && multiline && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      confirm();
    }
  }

  if (editing) {
    const sharedProps = {
      ref: inputRef as React.RefObject<never>,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onKeyDown: handleKeyDown,
      onBlur: (e: React.FocusEvent) => {
        if ((e.relatedTarget as HTMLElement)?.dataset?.inlineeditbtn) return;
        confirm();
      },
      className: "flex-1 min-w-0 bg-transparent outline-none text-foreground text-inherit font-inherit resize-none",
    };

    return (
      <div style={style} className={cn("flex items-start gap-1.5 group", className)}>
        <div className="flex-1 flex rounded-(--radius-xs) border border-patina bg-raised px-2 py-1 focus-within:shadow-[0_0_0_2px_var(--ks-primary)/20]">
          {multiline ? <textarea {...sharedProps} rows={3} /> : <input {...sharedProps} type="text" />}
        </div>
        <div className="flex flex-col gap-1 pt-1">
          <button
            type="button"
            data-inlineeditbtn="true"
            aria-label="Confirm"
            onClick={confirm}
            className="p-0.5 rounded-(--radius-xs) text-success hover:bg-success/10 transition-colors"
          >
            <CheckIcon />
          </button>
          <button
            type="button"
            data-inlineeditbtn="true"
            aria-label="Cancel"
            onClick={cancel}
            className="p-0.5 rounded-(--radius-xs) text-faint hover:text-foreground hover:bg-graphite transition-colors"
          >
            <XIcon />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      style={style}
      className={cn(
        "group inline-flex items-center gap-1.5 px-2 py-1 rounded-(--radius-xs) text-left text-inherit font-inherit leading-inherit",
        "border border-transparent hover:border-rule hover:bg-graphite transition-colors duration-[80ms]",
        disabled ? "pointer-events-none" : "",
        className
      )}
    >
      <span className={cn("min-w-[4ch]", !value && "text-faint italic")}>{value || placeholder}</span>
      {!disabled && <PenIcon />}
    </button>
  );
}
