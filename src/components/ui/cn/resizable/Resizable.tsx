"use client";

import { useState, useRef, useCallback } from "react";

import { cn } from "@/lib/utils";

import type { ResizableProps } from "./resizable.types";

export function Resizable({
  children,
  direction = "horizontal",
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  onResize,
  className,
  style,
}: ResizableProps) {
  const [size, setSize] = useState(defaultSize);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clamp + set + notificar num único lugar, reaproveitado pelo drag de
  // mouse e pelo teclado (mesmo padrão de `seekTo`/`applyDelta` já usado
  // em MediaPlayer/ImageCropper).
  const resizeTo = useCallback(
    (next: number) => {
      const clamped = Math.min(maxSize, Math.max(minSize, next));
      setSize(clamped);
      onResize?.(clamped);
      return clamped;
    },
    [minSize, maxSize, onResize]
  );

  const startDrag = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setDragging(true);

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const startPos = direction === "horizontal" ? e.clientX : e.clientY;
      const startSize = size;

      const onMove = (moveEvent: MouseEvent) => {
        const currentPos = direction === "horizontal" ? moveEvent.clientX : moveEvent.clientY;
        const containerSize = direction === "horizontal" ? rect.width : rect.height;
        const delta = ((currentPos - startPos) / containerSize) * 100;
        resizeTo(startSize + delta);
      };

      const onUp = () => {
        setDragging(false);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [direction, size, resizeTo]
  );

  // Arrastar com mouse era a única forma de redimensionar — zero alternativa
  // de teclado. Arrow(← →/↑ ↓ conforme direction) em passos de 5%, Home/End
  // pros extremos — mesma categoria de fix já aplicada em ImageCompare/MediaPlayer.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = 5;
      const growKey = direction === "horizontal" ? "ArrowRight" : "ArrowDown";
      const shrinkKey = direction === "horizontal" ? "ArrowLeft" : "ArrowUp";
      if (e.key === growKey) {
        e.preventDefault();
        resizeTo(size + step);
      } else if (e.key === shrinkKey) {
        e.preventDefault();
        resizeTo(size - step);
      } else if (e.key === "Home") {
        e.preventDefault();
        resizeTo(minSize);
      } else if (e.key === "End") {
        e.preventDefault();
        resizeTo(maxSize);
      }
    },
    [direction, size, minSize, maxSize, resizeTo]
  );

  const isHoriz = direction === "horizontal";
  const paneStyle = isHoriz ? { width: `${size}%`, height: "100%" } : { height: `${size}%`, width: "100%" };

  return (
    <div
      ref={containerRef}
      className={cn("flex overflow-hidden w-full h-full", !isHoriz && "flex-col", className)}
      style={style}
    >
      <div className="overflow-auto flex-shrink-0" style={paneStyle}>
        {children[0]}
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Resize"
        aria-orientation={direction}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        aria-valuenow={Math.round(size)}
        className={cn(
          "flex-shrink-0 relative flex items-center justify-center transition-colors duration-150 z-[1]",
          "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-patina",
          isHoriz ? "w-[5px] cursor-col-resize flex-col" : "h-[5px] cursor-row-resize flex-row",
          // bg-patina/opacity: realce translúcido da barra de arraste, não um wash
          // atrás de texto — sem equivalente em -soft (feito pra pills/badges,
          // ficaria claro demais pra essa barra fina) — sem token melhor, mantido
          dragging ? "bg-patina opacity-60" : "hover:bg-patina hover:opacity-60"
        )}
        onMouseDown={startDrag}
        onKeyDown={handleKeyDown}
      >
        <span
          className={cn(
            // rounded-[1px]: abaixo do mínimo da escala (--radius-xs = 2px) —
            // grip decorativo de 2px de espessura, arredondamento maior ficaria
            // visualmente errado nesse traço
            "rounded-[1px] bg-rule pointer-events-none",
            isHoriz ? "w-[2px] h-6" : "w-6 h-[2px]"
          )}
        />
      </div>
      <div className="flex-1 overflow-auto">{children[1]}</div>
    </div>
  );
}
