"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/cn/button";

import type { OnboardingTourProps, TourPlacement } from "./onboarding-tour.types";

const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-4 h-4">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

function getTooltipPos(rect: DOMRect, placement: TourPlacement, tw: number, th: number) {
  const gap = 12;
  const vW = window.innerWidth;
  const vH = window.innerHeight;
  let top = 0,
    left = 0;

  if (placement === "bottom") {
    top = rect.bottom + gap;
    left = rect.left + rect.width / 2 - tw / 2;
  }
  if (placement === "top") {
    top = rect.top - th - gap;
    left = rect.left + rect.width / 2 - tw / 2;
  }
  if (placement === "right") {
    top = rect.top + rect.height / 2 - th / 2;
    left = rect.right + gap;
  }
  if (placement === "left") {
    top = rect.top + rect.height / 2 - th / 2;
    left = rect.left - tw - gap;
  }

  return {
    top: Math.max(8, Math.min(top, vH - th - 8)),
    left: Math.max(8, Math.min(left, vW - tw - 8)),
  };
}

export function OnboardingTour({ steps, isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = "onboarding-tour-title";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Overlay fixed cobre a tela inteira, mas sem isso os elementos por trás
  // continuavam focáveis por Tab (invisíveis atrás do scrim, mas alcançáveis
  // por teclado) — mesmo problema de foco que o Modal já resolve, adaptado
  // aqui pra não travar o scroll da página (o tour depende de rolar até o
  // próximo alvo, diferente do Modal que trava o body inteiro).
  //
  // `mounted` entra nas deps de propósito: no primeiro render `mounted` ainda
  // é false e o componente retorna null (painelRef.current é null), então o
  // efeito preso só a `[isOpen]` rodava cedo demais e nunca de novo (isOpen
  // não muda entre o render nulo e o render real do portal) — o foco nunca
  // chegava a cair em lugar nenhum.
  useEffect(() => {
    if (!isOpen || !mounted) return;
    const el = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    el?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const container = panelRef.current;
      if (!container) return;
      const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  const resolveTarget = useCallback(() => {
    if (!isOpen) return;
    const step = steps[index];
    const el = document.querySelector(step.target);
    if (el) setRect(el.getBoundingClientRect());
  }, [isOpen, index, steps]);

  useEffect(() => {
    resolveTarget();
    window.addEventListener("resize", resolveTarget);
    window.addEventListener("scroll", resolveTarget);
    return () => {
      window.removeEventListener("resize", resolveTarget);
      window.removeEventListener("scroll", resolveTarget);
    };
  }, [resolveTarget]);

  useEffect(() => {
    if (!isOpen) {
      setIndex(0);
    }
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }
  function next() {
    if (index < steps.length - 1) setIndex((i) => i + 1);
    else {
      onComplete?.();
      onClose();
    }
  }

  if (!mounted || !isOpen) return null;

  const step = steps[index];
  const tw = 280;
  const th = 120;
  const pos = rect ? getTooltipPos(rect, step.placement ?? "bottom", tw, th) : { top: 100, left: 100 };

  return createPortal(
    <>
      {/* bg-black literal: scrim de overlay, deliberadamente independente de
          tema — mesmo padrão/comentário já usado no Modal */}
      <div className="fixed inset-0 z-[990] bg-black/50" aria-hidden="true" />

      {/* Highlight ring — puramente visual, pointer-events-none já a tira do fluxo de clique */}
      {rect && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            zIndex: 992,
          }}
          className="rounded-xl ring-2 ring-patina ring-offset-2 ring-offset-transparent pointer-events-none"
        />
      )}

      {/* Tooltip */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{ top: pos.top, left: pos.left, width: tw, zIndex: 993 }}
        className="fixed rounded-xl border border-rule bg-raised shadow-[0_16px_48px_-8px_oklch(0%_0_0/0.5)] p-(--spacing-lg) outline-none"
      >
        <div className="flex items-start justify-between gap-(--spacing-sm) mb-(--spacing-sm)">
          <h3 id={titleId} className="text-body-callout font-semibold text-foreground">
            {step.title}
          </h3>
          <button
            type="button"
            aria-label="Close tour"
            onClick={onClose}
            className="flex-shrink-0 text-faint hover:text-foreground"
          >
            <XIcon />
          </button>
        </div>
        <p className="text-body-caption text-faint mb-(--spacing-md)">{step.content}</p>
        <div className="flex items-center justify-between gap-(--spacing-sm)">
          <span className="text-body-caption text-faint">
            {index + 1} / {steps.length}
          </span>
          {/* Botões viravam <button> customizado reinventando o Button CN — Modal
              (mesma categoria de componente: dialog com ações) já reaproveita
              Button pros próprios botões de rodapé */}
          <div className="flex items-center gap-(--spacing-xs)">
            {index > 0 && (
              <Button type="button" variant="outline" intent="neutral" size="sm" onClick={prev}>
                Back
              </Button>
            )}
            <Button type="button" variant="solid" intent="primary" size="sm" onClick={next}>
              {index === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
