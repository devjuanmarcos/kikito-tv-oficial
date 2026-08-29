"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, useRef, useCallback } from "react";

import { Button } from "@/components/ui/cn/button";
import { slideInUp, transitionEnter } from "@/lib/motion";
import { cn } from "@/lib/utils";

import type { FileUploadProps } from "./file-upload.types";

const UploadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    width={40}
    height={40}
    aria-hidden="true"
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={20} height={20} aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    width={18}
    height={18}
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Escala própria do componente (padding por tier de size), não migra pra spacing genérico.
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
    <div className="flex flex-col gap-(--spacing-sm) mt-(--spacing-md)">
      {/* absorvido de docs/component-import/animation-backport/PLAN.md (file-upload-01.tsx):
          linha de arquivo entra/sai da lista animada em vez de aparecer/sumir instantâneo.
          key por conteúdo (não índice) — achado real: key={i} fazia o AnimatePresence
          animar a linha ERRADA ao remover um arquivo do meio da lista (React reaproveita o
          nó do índice deslocado em vez de detectar que o item específico saiu) */}
      <AnimatePresence initial={false}>
        {files.map((f, i) => (
          <motion.div
            key={`${f.name}-${f.size}-${f.lastModified}`}
            {...slideInUp}
            transition={transitionEnter}
            // gap-[10px]/py-[10px]: sem match exato na escala de spacing
            className="flex items-center gap-[10px] py-[10px] px-(--spacing-md) rounded-(--radius-base) border border-rule bg-raised"
          >
            <span className="text-patina flex-shrink-0">
              <FileIcon />
            </span>
            <span className="flex-1 text-body-callout font-medium overflow-hidden text-ellipsis whitespace-nowrap">
              {f.name}
            </span>
            <span className="text-body-caption text-muted flex-shrink-0">{formatBytes(f.size)}</span>
            <button
              type="button"
              aria-label={`Remove ${f.name}`}
              className="w-[18px] h-[18px] flex items-center justify-center border-none bg-transparent cursor-pointer text-muted rounded-(--radius-xs) p-0 flex-shrink-0 hover:text-danger"
              onClick={() => removeFile(i)}
            >
              <XIcon />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
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
        <Button
          type="button"
          variant="outline"
          intent="neutral"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          {label || "Choose file…"}
        </Button>
        {hint && <p className="text-body-caption text-muted mt-(--spacing-xs)">{hint}</p>}
        {fileList}
        {error && <p className="text-body-caption text-danger mt-(--spacing-xs)">{error}</p>}
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
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={typeof label === "string" ? label : "Click to upload or drag and drop"}
        className={cn(
          // gap-[10px]: sem match exato na escala de spacing
          "flex flex-col items-center justify-center gap-[10px] border-2 border-dashed border-rule rounded-(--radius-md) cursor-pointer transition-[border-color,background] duration-[150ms] text-center",
          SIZE_PAD[size] ?? SIZE_PAD.md,
          over && "border-patina bg-patina-soft",
          !over && "hover:border-patina hover:bg-patina-soft",
          disabled && "opacity-40 cursor-not-allowed pointer-events-none"
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
      >
        <span className="text-muted opacity-50" aria-hidden="true">
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
      {error && <p className="text-body-caption text-danger mt-(--spacing-xs)">{error}</p>}
    </div>
  );
}
