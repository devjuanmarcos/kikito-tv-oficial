"use client";

import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { ImageCompareProps } from "./image-compare.types";

export function ImageCompare({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  direction = "horizontal",
  initialPosition = 50,
  width = "100%",
  height = 300,
  className,
  style,
}: ImageCompareProps) {
  const [position, setPosition] = useState(initialPosition);
  const dragging = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const getPos = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const pct =
        direction === "horizontal"
          ? ((clientX - rect.left) / rect.width) * 100
          : ((clientY - rect.top) / rect.height) * 100;
      setPosition(Math.min(Math.max(pct, 0), 100));
    },
    [direction]
  );

  const onMouseDown = useCallback(() => {
    dragging.current = true;
    const move = (ev: MouseEvent | TouchEvent) => {
      if (dragging.current) getPos(ev);
    };
    const up = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
  }, [getPos]);

  // Alça só era arrastável via mouse/touch — sem alternativa nenhuma de teclado.
  // Handle agora é focável e é um role="slider" de verdade (widget certo pra essa
  // interação), movido com Arrow keys.
  const step = 5;
  function handleKeyDown(e: React.KeyboardEvent) {
    const forwardKey = direction === "horizontal" ? "ArrowRight" : "ArrowDown";
    const backKey = direction === "horizontal" ? "ArrowLeft" : "ArrowUp";
    if (e.key === forwardKey) {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + step));
    } else if (e.key === backKey) {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPosition(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPosition(100);
    }
  }

  const clipBefore = direction === "horizontal" ? `inset(0 ${100 - position}% 0 0)` : `inset(0 0 ${100 - position}% 0)`;

  const handleStyle =
    direction === "horizontal"
      ? { left: `${position}%`, top: 0, bottom: 0, width: 2, cursor: "col-resize" }
      : { top: `${position}%`, left: 0, right: 0, height: 2, cursor: "row-resize" };

  const knobStyle =
    direction === "horizontal"
      ? { left: "50%", top: "50%", transform: "translate(-50%,-50%)" }
      : { top: "50%", left: "50%", transform: "translate(-50%,-50%)" };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- superfície de
    // drag por mouse/touch em qualquer ponto da imagem; o controle acessível real é a
    // alça abaixo (role="slider", focável, com Arrow keys)
    <div
      ref={rootRef}
      className={cn("relative overflow-hidden select-none rounded-(--radius-md)", className)}
      style={{ width, height, ...style }}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
    >
      {/* After (bottom layer, full width) */}
      <img
        src={after}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      {/* Before (top layer, clipped) */}
      <img
        src={before}
        alt={beforeLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ clipPath: clipBefore }}
        draggable={false}
      />

      {/* Handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Comparison position"
        aria-orientation={direction}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onKeyDown={handleKeyDown}
        className="absolute bg-raised/80 backdrop-blur-sm"
        style={{ ...handleStyle, position: "absolute" }}
      >
        <div
          className="absolute w-8 h-8 rounded-full bg-raised shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)] flex items-center justify-center text-body-caption font-bold text-foreground"
          style={knobStyle}
        >
          {direction === "horizontal" ? "⇔" : "⇕"}
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-(--spacing-sm) left-(--spacing-sm) bg-canvas/70 text-foreground text-body-caption font-medium px-(--spacing-sm) py-(--spacing-3xs) rounded-(--radius-sm) pointer-events-none">
        {beforeLabel}
      </span>
      <span className="absolute top-(--spacing-sm) right-(--spacing-sm) bg-canvas/70 text-foreground text-body-caption font-medium px-(--spacing-sm) py-(--spacing-3xs) rounded-(--radius-sm) pointer-events-none">
        {afterLabel}
      </span>
    </div>
  );
}
