"use client";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { SortableListProps } from "./sortable-list.types";

const GripIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="w-4 h-4">
    <circle cx="9" cy="7" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="9" cy="12" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="9" cy="17" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="15" cy="7" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="15" cy="17" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export function SortableList({ items: initialItems, onChange, disabled = false, className, style }: SortableListProps) {
  const [items, setItems] = useState(initialItems);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const dragId = useRef<string | null>(null);

  function handleDragStart(id: string) {
    dragId.current = id;
    setDragging(id);
  }

  function handleDrop(targetId: string) {
    if (!dragId.current || dragId.current === targetId) return;
    const from = items.findIndex((i) => i.id === dragId.current);
    const to = items.findIndex((i) => i.id === targetId);
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    onChange?.(next);
    setDragging(null);
    setOver(null);
    dragId.current = null;
  }

  // Reordenação por teclado (ArrowUp/ArrowDown/Home/End no grip) — sem isso a lista só
  // era reordenável via drag-and-drop de mouse (draggable nativo), sem alternativa
  // nenhuma pra quem navega por teclado. O <li> mantém o mesmo key={item.id}, então o
  // React reusa a mesma instância de DOM/foco ao reordenar — não precisa refocar manualmente.
  function move(index: number, to: number) {
    const clamped = Math.max(0, Math.min(items.length - 1, to));
    if (clamped === index) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(clamped, 0, moved);
    setItems(next);
    onChange?.(next);
    setAnnouncement(`Item movido para a posição ${clamped + 1} de ${items.length}`);
  }

  function handleGripKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      move(index, index - 1);
    } else if (e.key === "ArrowDown") {
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
    <ul role="list" style={style} className={cn("flex flex-col gap-(--spacing-2xs)", className)}>
      <li role="status" aria-live="polite" className="sr-only">
        {announcement}
      </li>
      {items.map((item, i) => (
        <li
          key={item.id}
          draggable={!disabled}
          onDragStart={() => handleDragStart(item.id)}
          onDragEnd={() => {
            setDragging(null);
            setOver(null);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(item.id);
          }}
          onDrop={() => handleDrop(item.id)}
          className={cn(
            "flex items-center gap-(--spacing-md) px-3 py-2.5 rounded-lg border border-rule bg-raised",
            "transition-[opacity,border-color,background] duration-[100ms]",
            !disabled && "cursor-default",
            dragging === item.id && "opacity-40",
            over === item.id && dragging !== item.id && "border-patina bg-patina/5"
          )}
        >
          {!disabled && (
            <button
              type="button"
              aria-label={`Reordenar item ${i + 1} de ${items.length} (setas para cima/baixo)`}
              onKeyDown={(e) => handleGripKeyDown(e, i)}
              className="flex-shrink-0 text-faint hover:text-foreground cursor-grab active:cursor-grabbing rounded-(--radius-xs)"
            >
              <GripIcon />
            </button>
          )}
          <div className="flex-1 min-w-0">{item.content}</div>
        </li>
      ))}
    </ul>
  );
}
