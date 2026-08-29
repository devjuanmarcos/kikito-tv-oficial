"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { CardStackProps } from "./card-stack.types";

export function CardStack({
  cards,
  offset = 10,
  scaleFactor = 0.06,
  autoPlay = false,
  interval = 3000,
  className,
  style,
}: CardStackProps) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = () => {
    if (cards.length === 0) return;
    setActive((a) => (a + 1) % cards.length);
  };

  useEffect(() => {
    if (!autoPlay || cards.length === 0) return;
    timerRef.current = setTimeout(advance, interval);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, autoPlay, interval, cards.length]);

  return (
    <div className={cn("relative w-full", className)} style={style}>
      {/* achado real: clique era o único jeito de avançar o stack — zero alternativa de
          teclado. role="button" + tabIndex + Enter/Space, mesmo padrão já corrigido em
          outros componentes de interação por clique/drag nesta auditoria */}
      <div
        className="relative w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina"
        role="button"
        tabIndex={0}
        aria-label="Show next card"
        onClick={advance}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            advance();
          }
        }}
      >
        {cards.map((card, i) => {
          const idx = (i - active + cards.length) % cards.length;
          const isTop = idx === 0;
          return (
            <div
              key={card.id}
              // achado real: cards obscurecidos atrás do topo não eram aria-hidden — leitor
              // de tela alcançava o conteúdo de todos igualmente, fora de ordem visual
              // (mesmo padrão já corrigido no SwipeCard)
              aria-hidden={!isTop}
              style={{
                position: isTop ? "relative" : "absolute",
                top: isTop ? undefined : 0,
                left: isTop ? undefined : 0,
                width: "100%",
                transformOrigin: "top center",
                transform: `translateY(${idx * offset}px) scale(${1 - idx * scaleFactor})`,
                opacity: Math.max(0, 1 - idx * 0.25),
                zIndex: cards.length - idx,
                pointerEvents: isTop ? "auto" : "none",
                transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s",
              }}
            >
              {card.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
