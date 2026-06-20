"use client";
import type React from "react";
import { useState, useRef } from "react";

import { cn } from "@/lib/utils";

export type SearchInputSize = "sm" | "md" | "lg";

export interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  size?: SearchInputSize;
  shortcut?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_WRAP: Record<SearchInputSize, string> = {
  sm: "h-7  text-[0.8125rem]",
  md: "h-9  text-body-callout",
  lg: "h-11 text-body-paragraph",
};
const SIZE_ICON: Record<SearchInputSize, string> = {
  sm: "w-3.5 h-3.5 left-2.5",
  md: "w-4   h-4   left-3",
  lg: "w-[1.125rem] h-[1.125rem] left-3.5",
};

const SIZE_ICON_SZ: Record<SearchInputSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4   h-4",
  lg: "w-[1.125rem] h-[1.125rem]",
};
const SIZE_PAD: Record<SearchInputSize, string> = {
  sm: "pl-7  pr-7",
  md: "pl-9  pr-9",
  lg: "pl-11 pr-11",
};

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    className="w-full h-full"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
    className="w-full h-full"
  >
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

const SpinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="w-full h-full animate-spin">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export function SearchInput({
  value,
  defaultValue = "",
  onChange,
  onSearch,
  placeholder = "Search…",
  size = "md",
  shortcut,
  loading = false,
  disabled = false,
  className,
  style,
}: SearchInputProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const query = isControlled ? value : internal;
  const hasQuery = query.length > 0;
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (!isControlled) setInternal(v);
    onChange?.(v);
  }

  function clear() {
    if (!isControlled) setInternal("");
    onChange?.("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") onSearch?.(query);
  }

  return (
    <div
      style={style}
      className={cn(
        "relative flex items-center w-full rounded-(--radius-md) border border-rule bg-raised",
        "transition-[border-color] duration-[120ms] focus-within:border-patina",
        disabled && "opacity-50 pointer-events-none",
        SIZE_WRAP[size],
        className
      )}
    >
      <span className={cn("absolute pointer-events-none text-faint", SIZE_ICON[size])}>
        {loading ? <SpinIcon /> : <SearchIcon />}
      </span>

      <input
        ref={inputRef}
        type="search"
        value={isControlled ? value : internal}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full h-full bg-transparent border-none outline-none text-foreground placeholder:text-faint",
          "[&::-webkit-search-decoration]:hidden [&::-webkit-search-cancel-button]:hidden",
          SIZE_PAD[size]
        )}
      />

      {shortcut && !hasQuery && (
        <span className="absolute right-2.5 pointer-events-none text-faint text-[0.6875rem] font-mono select-none">
          {shortcut}
        </span>
      )}

      {hasQuery && !loading && (
        <button
          type="button"
          aria-label="Clear"
          onClick={clear}
          className={cn("absolute right-2.5 text-faint hover:text-foreground transition-colors", SIZE_ICON_SZ[size])}
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}
