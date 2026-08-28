"use client";

import { useState, useRef } from "react";

import { cn } from "@/lib/utils";

import type { DraggableProps, DraggableItem } from "./draggable.types";

export function Draggable({
  items: initialItems,
  onChange,
  direction = "vertical",
  handle = false,
  className,
  style,
}: DraggableProps) {
  const [items, setItems] = useState<DraggableItem[]>(initialItems);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const dragIndex = useRef<number>(-1);

  const reorder = (from: number, to: number) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    onChange?.(next);
  };

  const isHoriz = direction === "horizontal";

  // Reordenação por teclado — sem isso a lista só era reordenável via drag-and-drop
  // de mouse (draggable nativo), sem alternativa nenhuma pra quem navega por teclado.
  // Mesmo padrão já usado no SortableList CN.
  function move(index: number, to: number) {
    const clamped = Math.max(0, Math.min(items.length - 1, to));
    if (clamped === index) return;
    reorder(index, clamped);
    setAnnouncement(`Item movido para a posição ${clamped + 1} de ${items.length}`);
  }

  const forwardKey = isHoriz ? "ArrowRight" : "ArrowDown";
  const backKey = isHoriz ? "ArrowLeft" : "ArrowUp";

  function handleReorderKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === backKey) {
      e.preventDefault();
      move(index, index - 1);
    } else if (e.key === forwardKey) {
      e.preventDefault();
      move(index, index + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(index, 0);
    } else if (e.key === "End") {
      e.preventDefault();
      move(index, items.length - 1);
    }
  }

  return (
    <div role="list" className={cn("flex", isHoriz ? "flex-row" : "flex-col", className)} style={style}>
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
      {items.map((item, idx) => (
        <div
          key={item.id}
          role="listitem"
          // below scale minimum: sem match exato pro padding do card de item (14px/10px)
          className={cn(
            "flex items-center gap-(--spacing-sm) px-[14px] py-[10px] bg-raised border border-rule rounded-(--radius-md) select-none transition-[box-shadow,background,opacity] duration-[150ms] text-foreground text-body-callout active:cursor-grabbing",
            isHoriz ? "mr-(--spacing-2xs) last:mr-0 flex-shrink-0" : "mb-(--spacing-2xs) last:mb-0",
            !handle && "cursor-grab",
            draggingId === item.id && "opacity-40",
            overId === item.id && "bg-float border-patina shadow-[0_0_0_2px_var(--ks-primary-soft)]"
          )}
          draggable={!handle}
          tabIndex={!handle ? 0 : undefined}
          aria-label={!handle ? `Reordenar item ${idx + 1} de ${items.length} (setas para mover)` : undefined}
          onKeyDown={!handle ? (e) => handleReorderKeyDown(e, idx) : undefined}
          onDragStart={() => {
            setDraggingId(item.id);
            dragIndex.current = idx;
          }}
          onDragEnd={() => {
            setDraggingId(null);
            setOverId(null);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setOverId(item.id);
          }}
          onDrop={() => {
            if (dragIndex.current !== -1 && dragIndex.current !== idx) reorder(dragIndex.current, idx);
            setDraggingId(null);
            setOverId(null);
            dragIndex.current = -1;
          }}
        >
          {handle && (
            <button
              type="button"
              aria-label={`Reordenar item ${idx + 1} de ${items.length} (setas para mover)`}
              // gap-[3px]: below scale minimum, espaçamento decorativo entre as barras do grip
              className="text-faint cursor-grab active:cursor-grabbing flex flex-col gap-[3px] px-(--spacing-2xs) py-(--spacing-3xs) flex-shrink-0"
              draggable
              onKeyDown={(e) => handleReorderKeyDown(e, idx)}
              onDragStart={(e) => {
                e.stopPropagation();
                setDraggingId(item.id);
                dragIndex.current = idx;
              }}
            >
              {/* below scale minimum: barra decorativa do ícone de grip */}
              <span className="block w-[14px] h-[2px] bg-current rounded-[1px]" />
              <span className="block w-[14px] h-[2px] bg-current rounded-[1px]" />
              <span className="block w-[14px] h-[2px] bg-current rounded-[1px]" />
            </button>
          )}
          {item.content}
        </div>
      ))}
    </div>
  );
}
