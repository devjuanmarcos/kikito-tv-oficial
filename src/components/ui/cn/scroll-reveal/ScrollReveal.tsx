"use client";

import { useRef, useState, useEffect } from "react";

import { cn } from "@/lib/utils";

import type { ScrollRevealProps } from "./scroll-reveal.types";

const INITIAL_CLASSES: Record<string, string> = {
  fade: "opacity-0",
  "slide-up": "opacity-0 translate-y-8",
  "slide-left": "opacity-0 -translate-x-8",
  "slide-right": "opacity-0 translate-x-8",
  zoom: "opacity-0 scale-95",
};

export function ScrollReveal({
  children,
  animation = "fade",
  duration = 500,
  delay = 0,
  threshold = 0.15,
  once = true,
  className,
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // prefers-reduced-motion: pula o slide/zoom (movimento real) e revela sem transição
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-[opacity,transform]",
        visible || reducedMotion ? "opacity-100 translate-y-0 translate-x-0 scale-100" : INITIAL_CLASSES[animation],
        className
      )}
      style={{
        transition: reducedMotion
          ? "opacity 1ms linear"
          : `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
