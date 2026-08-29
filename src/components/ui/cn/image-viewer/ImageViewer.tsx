"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import type { ImageViewerProps } from "./image-viewer.types";

export function ImageViewer({ images, defaultIndex = 0, className, style }: ImageViewerProps) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(defaultIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIdx((i) => Math.min(images.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
      // achado real: role="dialog" aria-modal="true" sem nenhum focus trap — Tab
      // escapava pro conteúdo por trás do overlay (mesmo padrão já corrigido em
      // OnboardingTour, modelado no Modal)
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, images.length]);

  // foco entra no dialog ao abrir, volta pro elemento que abriu ao fechar
  useEffect(() => {
    if (open) {
      closeBtnRef.current?.focus();
    } else {
      lastFocusedRef.current?.focus();
    }
  }, [open]);

  function openAt(i: number, e: React.MouseEvent<HTMLButtonElement>) {
    lastFocusedRef.current = e.currentTarget;
    setIdx(i);
    setOpen(true);
  }

  return (
    <>
      <div className={cn("flex flex-wrap gap-(--spacing-sm)", className)} style={style}>
        {images.map((img, i) => (
          <button
            key={i}
            className="relative overflow-hidden rounded-(--radius-md) cursor-pointer border-2 border-transparent transition-colors duration-150 block hover:border-patina p-0 bg-transparent"
            style={{ width: 120, height: 90 }}
            onClick={(e) => openAt(i, e)}
            type="button"
            aria-label={img.alt ?? `Image ${i + 1}`}
          >
            <img src={img.src} alt={img.alt ?? ""} loading="lazy" className="w-full h-full object-cover block" />
          </button>
        ))}
      </div>

      {open &&
        createPortal(
          // preto/branco literais aqui são deliberados: lightbox de imagem é convenção
          // universal (sempre escuro, invariante ao tema do app hospedeiro) — sem token
          // equivalente que faça sentido nesse contexto
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- fechar ao clicar fora é conveniência de mouse; Escape + botão Close já cobrem teclado
          <div
            ref={dialogRef}
            className="fixed inset-0 bg-black/92 z-[9999] flex items-center justify-center flex-col gap-(--spacing-lg) p-(--spacing-xl) animate-in fade-in duration-150"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <div className="absolute top-(--spacing-lg) right-(--spacing-lg) flex gap-(--spacing-sm)">
              <button
                ref={closeBtnRef}
                className="bg-white/10 border border-white/20 text-white w-9 h-9 rounded-full cursor-pointer text-body-paragraph flex items-center justify-center transition-colors duration-150 hover:bg-white/20"
                onClick={() => setOpen(false)}
                type="button"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {idx > 0 && (
              // left-5 (20px): sem match exato na escala de spacing (entre lg e xl)
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
              // right-5 (20px): sem match exato na escala de spacing (entre lg e xl)
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
              <div className="flex gap-(--spacing-xs)">
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
                    aria-current={i === idx ? "true" : undefined}
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
