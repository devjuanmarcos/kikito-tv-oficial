"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import { cn } from "@/lib/utils";

import type { CarouselProps } from "./carousel.types";

const ChevronLeft = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    width={16}
    height={16}
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    width={16}
    height={16}
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronUp = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    width={16}
    height={16}
    aria-hidden="true"
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);
const ChevronDown = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    width={16}
    height={16}
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export function Carousel({
  items,
  autoPlay = false,
  autoPlayInterval = 3000,
  loop = true,
  showDots = true,
  indicator = "dots",
  showArrows = true,
  orientation = "horizontal",
  className,
  style,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const n = items.length;
  const isVertical = orientation === "vertical";

  const go = useCallback(
    (idx: number) => {
      if (loop) {
        setCurrent(((idx % n) + n) % n);
      } else {
        setCurrent(Math.max(0, Math.min(idx, n - 1)));
      }
    },
    [loop, n]
  );

  const next = useCallback(() => go(current + 1), [go, current]);
  const prev = useCallback(() => go(current - 1), [go, current]);

  useEffect(() => {
    if (!autoPlay) return;
    timerRef.current = setTimeout(next, autoPlayInterval);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoPlay, autoPlayInterval, next]);

  const canPrev = loop || current > 0;
  const canNext = loop || current < n - 1;
  const offset = isVertical ? `translateY(-${current * 100}%)` : `translateX(-${current * 100}%)`;

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={style}
      role="region"
      aria-roledescription="carousel"
      aria-label="Carousel"
    >
      <div
        className={cn(
          "flex transition-[transform] duration-[350ms] [transition-timing-function:cubic-bezier(0.25,0.1,0.25,1)] will-change-transform",
          // achado real: sem `h-full` aqui, a orientação vertical não tinha como funcionar —
          // um bloco nunca preenche a altura do pai sozinho (diferente da largura, que
          // preenche por padrão), então a trilha ficava do tamanho da soma de TODOS os
          // slides empilhados, sem clipping nenhum. O pai (este componente) precisa de
          // altura explícita via className/style pra vertical funcionar (documentado no tipo)
          isVertical ? "flex-col h-full" : undefined
        )}
        style={{ transform: offset }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            className={cn("flex-[0_0_100%]", isVertical ? "h-full" : "w-full")}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${n}`}
            aria-hidden={i !== current}
          >
            {item.content}
          </div>
        ))}
      </div>

      {showArrows && n > 1 && (
        <div
          className={cn(
            "absolute flex pointer-events-none box-border",
            isVertical
              ? "left-1/2 -translate-x-1/2 flex-col justify-between h-full py-(--spacing-md)"
              : "top-1/2 -translate-y-1/2 justify-between w-full px-(--spacing-md)"
          )}
        >
          <button
            className="w-9 h-9 rounded-full border border-rule bg-float text-foreground flex items-center justify-center cursor-pointer pointer-events-auto transition-[background,transform] duration-[150ms] backdrop-blur-[8px] hover:bg-raised hover:scale-[1.05] disabled:opacity-25 disabled:cursor-default"
            onClick={prev}
            disabled={!canPrev}
            aria-label="Previous"
          >
            {isVertical ? <ChevronUp /> : <ChevronLeft />}
          </button>
          <button
            className="w-9 h-9 rounded-full border border-rule bg-float text-foreground flex items-center justify-center cursor-pointer pointer-events-auto transition-[background,transform] duration-[150ms] backdrop-blur-[8px] hover:bg-raised hover:scale-[1.05] disabled:opacity-25 disabled:cursor-default"
            onClick={next}
            disabled={!canNext}
            aria-label="Next"
          >
            {isVertical ? <ChevronDown /> : <ChevronRight />}
          </button>
        </div>
      )}

      {showDots &&
        n > 1 &&
        (indicator === "counter" ? (
          <div
            className={cn(
              "flex justify-center",
              isVertical ? "absolute right-(--spacing-sm) top-1/2 -translate-y-1/2" : "pt-(--spacing-md)"
            )}
          >
            <span
              className="text-body-caption text-faint bg-float border border-rule rounded-pill px-(--spacing-sm) py-(--spacing-3xs) tabular-nums"
              aria-live="polite"
            >
              {current + 1} / {n}
            </span>
          </div>
        ) : (
          <div
            className={cn(
              "flex justify-center gap-(--spacing-xs)",
              isVertical ? "absolute right-(--spacing-sm) top-1/2 -translate-y-1/2 flex-col" : "pt-(--spacing-md)"
            )}
          >
            {items.map((_, i) => (
              <button
                key={i}
                className={cn(
                  "h-[6px] rounded-full border-none bg-rule cursor-pointer p-0 transition-[background,width] duration-200",
                  i === current ? "bg-patina w-[18px] rounded-pill" : "w-[6px]"
                )}
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
              />
            ))}
          </div>
        ))}
    </div>
  );
}
