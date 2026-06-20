"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import type { ImageViewerProps } from "./image-viewer.types";

export function ImageViewer({ images, defaultIndex = 0, className, style }: ImageViewerProps) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(defaultIndex);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIdx((i) => Math.min(images.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, images.length]);

  function openAt(i: number) {
    setIdx(i);
    setOpen(true);
  }

  return (
    <>
      <div className={cn("flex flex-wrap gap-2", className)} style={style}>
        {images.map((img, i) => (
          <button
            key={i}
            className="relative overflow-hidden rounded-(--radius-md) cursor-pointer border-2 border-transparent transition-colors duration-150 block hover:border-patina p-0 bg-transparent"
            style={{ width: 120, height: 90 }}
            onClick={() => openAt(i)}
            type="button"
            aria-label={img.alt ?? `Image ${i + 1}`}
          >
            <img src={img.src} alt={img.alt ?? ""} loading="lazy" className="w-full h-full object-cover block" />
          </button>
        ))}
      </div>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/92 z-[9999] flex items-center justify-center flex-col gap-4 p-6 animate-in fade-in duration-150"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                className="bg-white/10 border border-white/20 text-white w-9 h-9 rounded-full cursor-pointer text-body-paragraph flex items-center justify-center transition-colors duration-150 hover:bg-white/20"
                onClick={() => setOpen(false)}
                type="button"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {idx > 0 && (
              <button
                className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/10 border border-white/20 text-white w-11 h-11 rounded-full cursor-pointer text-body-title flex items-center justify-center transition-colors duration-150 hover:bg-white/20"
                onClick={() => setIdx((i) => i - 1)}
                type="button"
                aria-label="Previous"
              >
                ‹
              </button>
            )}

            <img
              className="max-w-[90vw] max-h-[75vh] object-contain rounded-(--radius-base) shadow-[0_24px_80px_color-mix(in_srgb,black_50%,transparent)]"
              src={images[idx].src}
              alt={images[idx].alt ?? ""}
            />

            {idx < images.length - 1 && (
              <button
                className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/10 border border-white/20 text-white w-11 h-11 rounded-full cursor-pointer text-body-title flex items-center justify-center transition-colors duration-150 hover:bg-white/20"
                onClick={() => setIdx((i) => i + 1)}
                type="button"
                aria-label="Next"
              >
                ›
              </button>
            )}

            {images[idx].caption && (
              <p className="text-white/60 text-body-callout text-center">{images[idx].caption}</p>
            )}

            {images.length > 1 && (
              <div className="flex gap-[6px]">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-[7px] h-[7px] rounded-full cursor-pointer border-0 transition-colors duration-150",
                      i === idx ? "bg-white" : "bg-white/30"
                    )}
                    onClick={() => setIdx(i)}
                    type="button"
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
