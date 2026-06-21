"use client";

import { useState, useRef, useCallback } from "react";

import { cn } from "@/lib/utils";

import type { FileUploadProps } from "./file-upload.types";

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={40} height={40}>
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={20} height={20}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={18} height={18}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SIZE_PAD: Record<string, string> = {
  sm: "p-6",
  md: "p-10",
  lg: "p-[60px]",
};

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export function FileUpload({
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  onFiles,
  variant = "dropzone",
  size = "md",
  label,
  hint,
  disabled = false,
  className,
  style,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      setError(null);
      const arr = Array.from(incoming);
      if (maxSize) {
        const oversized = arr.find((f) => f.size > maxSize);
        if (oversized) {
          setError(`File too large: ${oversized.name} (max ${formatBytes(maxSize)})`);
          return;
        }
      }
      const next = multiple ? [...files, ...arr] : arr;
      const capped = maxFiles ? next.slice(0, maxFiles) : next;
      setFiles(capped);
      onFiles?.(capped);
    },
    [files, multiple, maxSize, maxFiles, onFiles]
  );

  function removeFile(i: number) {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    onFiles?.(next);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setOver(false);
    if (disabled) return;
    addFiles(e.dataTransfer.files);
  }

  const fileList = files.length > 0 && (
    <div className="flex flex-col gap-2 mt-3">
      {files.map((f, i) => (
        <div
          key={i}
          className="flex items-center gap-[10px] py-[10px] px-3 rounded-(--radius-base) border border-rule bg-raised"
        >
          <span className="text-patina flex-shrink-0">
            <FileIcon />
          </span>
          <span className="flex-1 text-body-callout font-medium overflow-hidden text-ellipsis whitespace-nowrap">
            {f.name}
          </span>
          <span className="text-body-caption text-muted flex-shrink-0">{formatBytes(f.size)}</span>
          <button
            className="w-[18px] h-[18px] flex items-center justify-center border-none bg-transparent cursor-pointer text-muted rounded-[4px] p-0 flex-shrink-0 hover:text-danger"
            onClick={() => removeFile(i)}
          >
            <XIcon />
          </button>
        </div>
      ))}
    </div>
  );

  if (variant === "button") {
    return (
      <div className={className} style={style}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <button
          type="button"
          className="py-2 px-4 rounded-[7px] border border-rule bg-transparent cursor-pointer text-body-callout text-foreground hover:bg-raised disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          {label || "Choose file…"}
        </button>
        {hint && <p className="text-body-caption text-muted mt-[6px]">{hint}</p>}
        {fileList}
        {error && <p className="text-body-caption text-danger mt-[6px]">{error}</p>}
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-[10px] border-2 border-dashed border-rule rounded-[12px] cursor-pointer transition-[border-color,background] duration-[150ms] text-center",
          SIZE_PAD[size] ?? SIZE_PAD.md,
          over && "border-patina bg-[color-mix(in_srgb,var(--ks-primary)_5%,transparent)]",
          !over && "hover:border-patina hover:bg-[color-mix(in_srgb,var(--ks-primary)_5%,transparent)]",
          disabled && "opacity-40 cursor-not-allowed pointer-events-none"
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
      >
        <span className="text-muted opacity-50">
          <UploadIcon />
        </span>
        <p className="text-body-callout font-medium text-foreground">
          {label ?? (
            <>
              <span className="text-patina font-semibold cursor-pointer">Click to upload</span> or drag and drop
            </>
          )}
        </p>
        {hint && <p className="text-body-caption text-muted">{hint}</p>}
        {accept && !hint && <p className="text-body-caption text-muted">{accept.replace(/,/g, ", ")}</p>}
      </div>
      {fileList}
      {error && <p className="text-body-caption text-danger mt-[6px]">{error}</p>}
    </div>
  );
}
