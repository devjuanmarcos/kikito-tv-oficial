"use client";
import { useRef, useState, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/cn/button";
import { cn } from "@/lib/utils";

import type { SignaturePadProps } from "./signature-pad.types";

export function SignaturePad({
  width = 400,
  height = 160,
  lineWidth = 2,
  color,
  backgroundColor = "transparent",
  onSave,
  onClear,
  saveLabel = "Save",
  clearLabel = "Clear",
  placeholder = "Sign here",
  readOnly = false,
  className,
  style,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return null;
    // canvas 2D strokeStyle exige string literal (var() do CSS não funciona aqui) —
    // achado real: um literal fixo tipo `oklch(95% 0.01 0)` (quase-branco) fica
    // invisível no modo claro quando `backgroundColor` é "transparent" (default),
    // porque a tinta clara cai sobre o fundo claro da própria página por trás.
    // Lê `--ks-text` computado em tempo real a cada traço, então acompanha o tema.
    ctx.strokeStyle = color ?? (getComputedStyle(canvas).getPropertyValue("--ks-text") || "currentColor");
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    return ctx;
  }, [color, lineWidth]);

  function clientPos(e: MouseEvent | TouchEvent) {
    const r = canvasRef.current!.getBoundingClientRect();
    const src = "touches" in e ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }

  const onStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (readOnly) return;
      e.preventDefault();
      drawing.current = true;
      lastPos.current = clientPos(e);
      setIsEmpty(false);
    },
    [readOnly]
  );

  const onMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!drawing.current || readOnly) return;
      e.preventDefault();
      const ctx = getCtx();
      const curr = clientPos(e);
      if (!ctx || !lastPos.current) return;
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.stroke();
      lastPos.current = curr;
    },
    [readOnly, getCtx]
  );

  const onEnd = useCallback(() => {
    drawing.current = false;
    lastPos.current = null;
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener("mousedown", onStart, { passive: false });
    el.addEventListener("mousemove", onMove, { passive: false });
    el.addEventListener("mouseup", onEnd);
    el.addEventListener("touchstart", onStart, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("mousedown", onStart);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseup", onEnd);
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [onStart, onMove, onEnd]);

  function clear() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    setIsEmpty(true);
    onClear?.();
  }

  function save() {
    if (!canvasRef.current || isEmpty) return;
    onSave?.(canvasRef.current.toDataURL("image/png"));
  }

  return (
    <div style={style} className={cn("inline-flex flex-col gap-(--spacing-sm)", className)}>
      <div
        className="relative rounded-xl border border-rule overflow-hidden"
        style={{ width, height, background: backgroundColor }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          role="img"
          aria-label={isEmpty ? "Signature pad, empty" : "Signature pad, signature drawn"}
          className={cn("block", !readOnly && "cursor-crosshair")}
        />
        {isEmpty && (
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none text-body-callout text-faint/30 select-none"
          >
            {placeholder}
          </span>
        )}
      </div>
      {!readOnly && (
        <div className="flex items-center gap-(--spacing-sm) justify-end">
          <Button type="button" variant="outline" intent="neutral" size="sm" onClick={clear}>
            {clearLabel}
          </Button>
          <Button type="button" variant="solid" intent="primary" size="sm" disabled={isEmpty} onClick={save}>
            {saveLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
