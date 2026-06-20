"use client";

import React, { useState, useRef, useCallback } from "react";

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
        const sc = dragRef.current.startCrop;
        const next = { ...sc };

        if (dragRef.current.type === "move") {
          next.x = clamp(sc.x + dx, 0, 100 - sc.width);
          next.y = clamp(sc.y + dy, 0, 100 - sc.height);
        } else if (dragRef.current.type === "br") {
          next.width = clamp(sc.width + dx, 10, 100 - sc.x);
          next.height = aspect ? next.width / aspect : clamp(sc.height + dy, 10, 100 - sc.y);
        } else if (dragRef.current.type === "tl") {
          const nw = clamp(sc.width - dx, 10, sc.x + sc.width);
          const nh = aspect ? nw / aspect : clamp(sc.height - dy, 10, sc.y + sc.height);
          next.x = sc.x + sc.width - nw;
          next.y = sc.y + sc.height - nh;
          next.width = nw;
          next.height = nh;
        } else if (dragRef.current.type === "tr") {
          next.width = clamp(sc.width + dx, 10, 100 - sc.x);
          const nh = aspect ? next.width / aspect : clamp(sc.height - dy, 10, sc.y + sc.height);
          next.y = sc.y + sc.height - nh;
          next.height = nh;
        } else if (dragRef.current.type === "bl") {
          const nw = clamp(sc.width - dx, 10, sc.x + sc.width);
          next.x = sc.x + sc.width - nw;
          next.width = nw;
          next.height = aspect ? nw / aspect : clamp(sc.height + dy, 10, 100 - sc.y);
        }

        setCrop(next);
        onCrop?.(next);
      };
      const onUp = () => {
        dragRef.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [crop, aspect, onCrop]
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
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
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
        className="absolute border-2 border-patina cursor-move"
        style={{
          left: `${crop.x}%`,
          top: `${crop.y}%`,
          width: `${crop.width}%`,
          height: `${crop.height}%`,
          boxShadow: "0 0 0 9999px color-mix(in srgb, var(--ks-lacquer-deep) 50%, transparent)",
        }}
        onMouseDown={(e) => onMouseDown(e, "move")}
      >
        <div
          className="absolute w-[10px] h-[10px] bg-patina rounded-[2px] -top-[5px] -left-[5px] cursor-nwse-resize"
          onMouseDown={(e) => onMouseDown(e, "tl")}
        />
        <div
          className="absolute w-[10px] h-[10px] bg-patina rounded-[2px] -top-[5px] -right-[5px] cursor-nesw-resize"
          onMouseDown={(e) => onMouseDown(e, "tr")}
        />
        <div
          className="absolute w-[10px] h-[10px] bg-patina rounded-[2px] -bottom-[5px] -left-[5px] cursor-nesw-resize"
          onMouseDown={(e) => onMouseDown(e, "bl")}
        />
        <div
          className="absolute w-[10px] h-[10px] bg-patina rounded-[2px] -bottom-[5px] -right-[5px] cursor-nwse-resize"
          onMouseDown={(e) => onMouseDown(e, "br")}
        />
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-canvas/70 text-foreground text-body-caption px-[10px] py-[3px] rounded-pill whitespace-nowrap pointer-events-none">
        {Math.round(crop.width)}% × {Math.round(crop.height)}%
      </div>
    </div>
  );
}
