"use client";

import { useState, useRef, useCallback } from "react";

import { cn } from "@/lib/utils";

import type { ImageCropperProps, CropArea } from "./image-cropper.types";

export function ImageCropper({ src, aspect, onCrop, className, style }: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [crop, setCrop] = useState<CropArea>({ x: 10, y: 10, width: 80, height: 80 });
  const dragRef = useRef<{
    type: "move" | "tl" | "tr" | "bl" | "br";
    startX: number;
    startY: number;
    startCrop: CropArea;
  } | null>(null);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  // Extraído do handler de mousemove pra ser reaproveitado pelo teclado também
  // (ver handleHandleKeyDown) — mesma matemática, sem duplicar.
  const applyDelta = useCallback(
    (type: "move" | "tl" | "tr" | "bl" | "br", sc: CropArea, dx: number, dy: number): CropArea => {
      const next = { ...sc };
      if (type === "move") {
        next.x = clamp(sc.x + dx, 0, 100 - sc.width);
        next.y = clamp(sc.y + dy, 0, 100 - sc.height);
      } else if (type === "br") {
        next.width = clamp(sc.width + dx, 10, 100 - sc.x);
        next.height = aspect ? next.width / aspect : clamp(sc.height + dy, 10, 100 - sc.y);
      } else if (type === "tl") {
        const nw = clamp(sc.width - dx, 10, sc.x + sc.width);
        const nh = aspect ? nw / aspect : clamp(sc.height - dy, 10, sc.y + sc.height);
        next.x = sc.x + sc.width - nw;
        next.y = sc.y + sc.height - nh;
        next.width = nw;
        next.height = nh;
      } else if (type === "tr") {
        next.width = clamp(sc.width + dx, 10, 100 - sc.x);
        const nh = aspect ? next.width / aspect : clamp(sc.height - dy, 10, sc.y + sc.height);
        next.y = sc.y + sc.height - nh;
        next.height = nh;
      } else if (type === "bl") {
        const nw = clamp(sc.width - dx, 10, sc.x + sc.width);
        next.x = sc.x + sc.width - nw;
        next.width = nw;
        next.height = aspect ? nw / aspect : clamp(sc.height + dy, 10, 100 - sc.y);
      }
      return next;
    },
    [aspect]
  );

  // Compartilhado entre onMouseDown (mover/redimensionar alça existente) e
  // onContainerMouseDown (desenhar área nova) — evita duplicar o par onMove/onUp.
  const attachDragListeners = useCallback((onMove: (e: MouseEvent) => void) => {
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  const onMouseDown = useCallback(
    (e: React.MouseEvent, type: "move" | "tl" | "tr" | "bl" | "br") => {
      e.stopPropagation();
      e.preventDefault();
      dragRef.current = { type, startX: e.clientX, startY: e.clientY, startCrop: { ...crop } };

      const onMove = (me: MouseEvent) => {
        if (!dragRef.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const dx = ((me.clientX - dragRef.current.startX) / rect.width) * 100;
        const dy = ((me.clientY - dragRef.current.startY) / rect.height) * 100;
        const next = applyDelta(dragRef.current.type, dragRef.current.startCrop, dx, dy);
        setCrop(next);
        onCrop?.(next);
      };
      attachDragListeners(onMove);
    },
    [crop, applyDelta, onCrop, attachDragListeners]
  );

  // Toda a interação (mover + redimensionar pelos 4 cantos) era só mouse/touch, sem
  // nenhuma alternativa de teclado. Cada alça (área central + 4 cantos) agora é
  // focável e responde às setas, reaproveitando o mesmo applyDelta do mouse.
  const KEYBOARD_STEP = 2;
  const handleHandleKeyDown = useCallback(
    (e: React.KeyboardEvent, type: "move" | "tl" | "tr" | "bl" | "br") => {
      let dx = 0;
      let dy = 0;
      if (e.key === "ArrowRight") dx = KEYBOARD_STEP;
      else if (e.key === "ArrowLeft") dx = -KEYBOARD_STEP;
      else if (e.key === "ArrowDown") dy = KEYBOARD_STEP;
      else if (e.key === "ArrowUp") dy = -KEYBOARD_STEP;
      else return;
      e.preventDefault();
      const next = applyDelta(type, crop, dx, dy);
      setCrop(next);
      onCrop?.(next);
    },
    [crop, applyDelta, onCrop]
  );

  const onContainerMouseDown = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const px = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100);
    const py = clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100);
    const newCrop: CropArea = { x: px, y: py, width: 20, height: aspect ? 20 / aspect : 20 };
    setCrop(newCrop);
    dragRef.current = { type: "br", startX: e.clientX, startY: e.clientY, startCrop: newCrop };
    const onMove = (me: MouseEvent) => {
      if (!dragRef.current || !containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const dx = ((me.clientX - dragRef.current.startX) / r.width) * 100;
      const dy = ((me.clientY - dragRef.current.startY) / r.height) * 100;
      const sc = dragRef.current.startCrop;
      const w = clamp(sc.width + dx, 5, 100 - sc.x);
      const h = aspect ? w / aspect : clamp(sc.height + dy, 5, 100 - sc.y);
      setCrop({ ...sc, width: w, height: h });
    };
    attachDragListeners(onMove);
  };

  return (
    // Superfície de desenho de uma nova área via drag de mouse; o controle acessível
    // real é a área de crop e as 4 alças de resize abaixo (todas focáveis, role="button")
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-canvas rounded-(--radius-md) border border-rule cursor-crosshair select-none",
        className
      )}
      style={style}
      onMouseDown={onContainerMouseDown}
    >
      <img src={src} alt="Crop" className="block w-full h-auto pointer-events-none" draggable={false} />

      <div
        role="button"
        aria-label="Crop area"
        tabIndex={0}
        className="absolute border-2 border-patina cursor-move focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina"
        style={{
          left: `${crop.x}%`,
          top: `${crop.y}%`,
          width: `${crop.width}%`,
          height: `${crop.height}%`,
          boxShadow: "0 0 0 9999px color-mix(in srgb, var(--ks-lacquer-deep) 50%, transparent)",
        }}
        onMouseDown={(e) => onMouseDown(e, "move")}
        onKeyDown={(e) => handleHandleKeyDown(e, "move")}
      >
        <div
          role="button"
          tabIndex={0}
          aria-label="Resize crop area from top-left"
          className="absolute w-[10px] h-[10px] bg-patina rounded-xs -top-[5px] -left-[5px] cursor-nwse-resize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina"
          onMouseDown={(e) => onMouseDown(e, "tl")}
          onKeyDown={(e) => handleHandleKeyDown(e, "tl")}
        />
        <div
          role="button"
          tabIndex={0}
          aria-label="Resize crop area from top-right"
          className="absolute w-[10px] h-[10px] bg-patina rounded-xs -top-[5px] -right-[5px] cursor-nesw-resize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina"
          onMouseDown={(e) => onMouseDown(e, "tr")}
          onKeyDown={(e) => handleHandleKeyDown(e, "tr")}
        />
        <div
          role="button"
          tabIndex={0}
          aria-label="Resize crop area from bottom-left"
          className="absolute w-[10px] h-[10px] bg-patina rounded-xs -bottom-[5px] -left-[5px] cursor-nesw-resize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina"
          onMouseDown={(e) => onMouseDown(e, "bl")}
          onKeyDown={(e) => handleHandleKeyDown(e, "bl")}
        />
        <div
          role="button"
          tabIndex={0}
          aria-label="Resize crop area from bottom-right"
          className="absolute w-[10px] h-[10px] bg-patina rounded-xs -bottom-[5px] -right-[5px] cursor-nwse-resize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina"
          onMouseDown={(e) => onMouseDown(e, "br")}
          onKeyDown={(e) => handleHandleKeyDown(e, "br")}
        />
      </div>

      {/* px-[10px]/py-[3px]: sem match exato na escala de spacing */}
      <div className="absolute bottom-(--spacing-sm) left-1/2 -translate-x-1/2 bg-canvas/70 text-foreground text-body-caption px-[10px] py-[3px] rounded-pill whitespace-nowrap pointer-events-none">
        {Math.round(crop.width)}% × {Math.round(crop.height)}%
      </div>
    </div>
  );
}
