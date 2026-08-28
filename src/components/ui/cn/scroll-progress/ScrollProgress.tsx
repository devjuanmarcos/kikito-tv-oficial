"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import type { ScrollProgressProps } from "./scroll-progress.types";

export function ScrollProgress({
  target = "page",
  height = 3,
  color,
  position = "top",
  zIndex = 9999,
  className,
  style,
}: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const getEl = () =>
      target === "page" ? document.documentElement : (target as React.RefObject<HTMLElement>).current;

    const update = () => {
      const el = getEl();
      if (!el) return;
      if (target === "page") {
        const total = el.scrollHeight - window.innerHeight;
        setProgress(total > 0 ? Math.min(window.scrollY / total, 1) * 100 : 0);
      } else {
        const total = el.scrollHeight - el.clientHeight;
        setProgress(total > 0 ? Math.min(el.scrollTop / total, 1) * 100 : 0);
      }
    };

    const eventTarget = target === "page" ? window : (target as React.RefObject<HTMLElement>).current;
    eventTarget?.addEventListener("scroll", update, { passive: true });
    update();
    return () => eventTarget?.removeEventListener("scroll", update);
  }, [target]);

  return (
    <div
      // Barra de progresso sem nenhuma semântica ARIA — mesmo padrão de
      // role="progressbar"/aria-value* já usado no `Progress` (Super component
      // real, não absorção falsa)
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      className={cn("transition-all duration-100", className)}
      style={{
        position: "fixed",
        [position]: 0,
        left: 0,
        height,
        width: `${progress}%`,
        background: color ?? "var(--ks-primary)",
        zIndex,
        ...style,
      }}
    />
  );
}
