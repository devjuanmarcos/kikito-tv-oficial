"use client";

import { useEffect, useState, useRef } from "react";

import { cn } from "@/lib/utils";

import type { SwipeCardProps } from "./swipe-card.types";

export function SwipeCard({ items, onSwipeLeft, onSwipeRight, threshold = 100, className, style }: SwipeCardProps) {
  const [stack, setStack] = useState(items);
  const [drag, setDrag] = useState<{ x: number; startX: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Achado real, o mais grave desta auditoria: este componente estava
  // reescrito internamente pra um modelo de dados (item.title/subtitle/image/
  // content, onSwipe/onEmpty) completamente diferente do que
  // swipe-card.types.ts, o registry publicado (`npx kikitocn add swipe-card`)
  // e o próprio showcase já documentavam/consumiam (`{id, children}`,
  // onSwipeLeft/onSwipeRight, threshold). Um consumidor seguindo a API
  // documentada via qualquer um desses três lugares tinha cards vazios
  // (children nunca era renderizado) e onSwipeLeft/onSwipeRight que nunca
  // disparavam. Nem tsc nem eslint acusaram — desestruturar props ausentes
  // do tipo declarado num parâmetro de função não gera erro nesta config,
  // achado só por leitura de código e checagem cruzada com registry/demo.
  //
  // `items` também não era resincronizado se a prop mudasse depois do mount
  // (useState(items) só roda a inicialização uma vez) — o botão "Reset
  // stack" da própria demo nunca conseguia reabastecer o baralho. Corrigido
  // com um efeito que resincroniza quando a referência de `items` muda.
  useEffect(() => {
    setStack(items);
  }, [items]);

  function dismiss(dir: "left" | "right") {
    const item = stack[0];
    if (!item) return;
    setStack((s) => s.slice(1));
    if (dir === "left") onSwipeLeft?.(item.id);
    else onSwipeRight?.(item.id);
    setDrag(null);
  }

  function onMouseDown(e: React.MouseEvent) {
    setDrag({ x: 0, startX: e.clientX });
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!drag) return;
    setDrag((d) => (d ? { ...d, x: e.clientX - d.startX } : null));
  }

  function onMouseUp() {
    if (!drag) return;
    if (drag.x > threshold) dismiss("right");
    else if (drag.x < -threshold) dismiss("left");
    else setDrag(null);
  }

  if (stack.length === 0) {
    return (
      <div
        className={cn("flex items-center justify-center h-48 text-faint text-body-callout", className)}
        style={style}
      >
        No more cards
      </div>
    );
  }

  const rotate = drag ? drag.x * 0.1 : 0;
  const opacity = drag ? Math.max(0.3, 1 - Math.abs(drag.x) / 300) : 1;

  return (
    // Superfície de arraste — a interação real (Skip/Keep) já tem botões reais
    // e totalmente acessíveis por teclado abaixo, mesmo padrão de exceção já
    // documentado em ImageCropper/ImageCompare/PinBoard pro container de drag
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cn("relative select-none", className)}
      style={{ height: 320, ...style }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {stack.slice(0, 3).map((item, i) => {
        const isTop = i === 0;
        const scale = 1 - i * 0.04;
        const translateY = i * 12;

        return (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- superfície de arraste, ver comentário acima
          <div
            key={item.id}
            ref={isTop ? cardRef : undefined}
            // Cards de trás ficam visualmente obscurecidos pelo topo, mas sem
            // isso o conteúdo deles (arbitrário, via `children`) continuava
            // alcançável fora de ordem — mesma categoria de "elemento escondido
            // ainda no fluxo" já tratada em outros componentes
            aria-hidden={!isTop}
            onMouseDown={isTop ? onMouseDown : undefined}
            style={{
              position: "absolute",
              inset: 0,
              transform:
                isTop && drag
                  ? `translate(${drag.x}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`
                  : `translateY(${translateY}px) scale(${scale})`,
              opacity: isTop ? opacity : 1,
              zIndex: 3 - i,
              cursor: isTop ? "grab" : "default",
              transition: isTop && drag ? "none" : "all 0.3s ease",
            }}
            className="rounded-(--radius-lg) border border-rule bg-raised shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)] overflow-hidden"
          >
            {item.children}

            {isTop && drag && drag.x > 20 && (
              <div className="absolute top-(--spacing-lg) left-(--spacing-lg) px-(--spacing-sm) py-(--spacing-3xs) rounded-(--radius-sm) border-2 border-success text-success font-bold text-body-callout rotate-[-15deg]">
                KEEP
              </div>
            )}
            {isTop && drag && drag.x < -20 && (
              <div className="absolute top-(--spacing-lg) right-(--spacing-lg) px-(--spacing-sm) py-(--spacing-3xs) rounded-(--radius-sm) border-2 border-danger text-danger font-bold text-body-callout rotate-[15deg]">
                SKIP
              </div>
            )}
          </div>
        );
      })}

      {/* hover:bg-X/10 abaixo: realce sutil de hover num botão circular pequeno,
          não um par bg/texto de contraste — mais claro que qualquer -soft
          existente ficaria nesse tamanho, sem token melhor pro caso */}
      <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-(--spacing-lg)">
        <button
          type="button"
          onClick={() => dismiss("left")}
          aria-label="Skip"
          className="w-10 h-10 rounded-full bg-raised border border-rule text-danger hover:bg-danger/10 transition-colors flex items-center justify-center"
        >
          ✕
        </button>
        <button
          type="button"
          onClick={() => dismiss("right")}
          aria-label="Keep"
          className="w-10 h-10 rounded-full bg-raised border border-rule text-success hover:bg-success/10 transition-colors flex items-center justify-center"
        >
          ✓
        </button>
      </div>
    </div>
  );
}
