"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import type { KanbanCard, KanbanColumn, KanbanProps } from "./kanban.types";

const INTENT_COLORS: Record<string, string> = {
  primary: "var(--ks-primary)",
  success: "var(--ks-success)",
  warning: "var(--ks-warning)",
  danger: "var(--ks-danger)",
  neutral: "var(--ks-rule)",
};

function KanbanCardItem({
  card,
  dragging,
  columnLabel,
  onDragStart,
  onDragEnd,
  onKeyDown,
}: {
  card: KanbanCard;
  dragging: boolean;
  columnLabel: string;
  onDragStart: () => void;
  onDragEnd: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div
      draggable
      tabIndex={0}
      role="button"
      aria-label={`${card.title} — em ${columnLabel}. Setas esquerda/direita movem entre colunas.`}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onKeyDown={onKeyDown}
      className={cn(
        "rounded-(--radius-sm) border border-rule bg-base p-(--spacing-md) cursor-grab active:cursor-grabbing select-none",
        "transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina",
        dragging && "opacity-40 scale-95"
      )}
    >
      {card.label && (
        <div
          // below scale minimum: micro-label decorativo (chip de categoria)
          className="inline-block text-[0.625rem] font-bold px-(--spacing-xs) py-(--spacing-3xs) rounded-full mb-(--spacing-sm)"
          style={{
            background: card.labelColor
              ? card.labelColor + "22"
              : "color-mix(in srgb, var(--ks-primary) 15%, transparent)",
            color: card.labelColor ?? "var(--ks-primary)",
          }}
        >
          {card.label}
        </div>
      )}
      <div className="text-body-callout font-medium text-foreground">{card.title}</div>
      {card.description && (
        <div className="text-body-caption text-muted mt-(--spacing-2xs) leading-relaxed">{card.description}</div>
      )}
      {card.assignee && (
        <div className="mt-(--spacing-sm) flex justify-end">
          <div
            // below scale minimum: iniciais do avatar, não é conteúdo primário
            className="w-6 h-6 rounded-full bg-patina text-patina-fg text-[0.625rem] font-bold flex items-center justify-center"
            title={card.assignee}
          >
            {card.assignee.slice(0, 2).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
}

export function Kanban({ columns: initial, onChange, className, style }: KanbanProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initial);
  const [dragging, setDragging] = useState<{ colId: string; cardId: string | number } | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  const update = (next: KanbanColumn[]) => {
    setColumns(next);
    onChange?.(next);
  };

  // Reaproveitado pelo drop de mouse e pela navegação por teclado (ver moveCardByKeyboard)
  const moveCard = (fromColId: string, cardId: string | number, toColId: string) => {
    if (fromColId === toColId) return;
    const next = columns.map((col) => {
      if (col.id === fromColId) return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
      if (col.id === toColId) {
        const card = columns.find((c) => c.id === fromColId)?.cards.find((c) => c.id === cardId);
        return card ? { ...col, cards: [...col.cards, card] } : col;
      }
      return col;
    });
    update(next);
  };

  const onDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setOverCol(colId);
  };

  const onDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    if (dragging) moveCard(dragging.colId, dragging.cardId, targetColId);
    setOverCol(null);
    setDragging(null);
  };

  // Mover um card entre colunas era só drag-and-drop de mouse/touch — sem nenhuma
  // alternativa de teclado. Cada card agora é focável e ArrowLeft/ArrowRight movem
  // pra coluna anterior/seguinte (mesma ordem visual esquerda→direita).
  const moveCardByKeyboard = (e: React.KeyboardEvent, colId: string, cardId: string | number) => {
    const colIndex = columns.findIndex((c) => c.id === colId);
    if (e.key === "ArrowRight" && colIndex < columns.length - 1) {
      e.preventDefault();
      moveCard(colId, cardId, columns[colIndex + 1].id);
    } else if (e.key === "ArrowLeft" && colIndex > 0) {
      e.preventDefault();
      moveCard(colId, cardId, columns[colIndex - 1].id);
    }
  };

  return (
    <div className={cn("flex gap-(--spacing-lg) overflow-x-auto pb-(--spacing-sm)", className)} style={style}>
      {columns.map((col) => {
        const dotColor = INTENT_COLORS[col.intent ?? "neutral"];
        return (
          <div
            key={col.id}
            className={cn(
              "flex flex-col gap-(--spacing-sm) min-w-[220px] max-w-[240px] rounded-(--radius-md) border p-(--spacing-md) transition-colors duration-150",
              overCol === col.id ? "border-patina bg-patina-soft" : "border-rule bg-canvas"
            )}
            onDragOver={(e) => onDragOver(e, col.id)}
            onDrop={(e) => onDrop(e, col.id)}
          >
            <div className="flex items-center justify-between mb-(--spacing-2xs)">
              <div className="flex items-center gap-(--spacing-sm)">
                <div className="w-2 h-2 rounded-full" style={{ background: dotColor }} />
                <span className="text-body-callout font-semibold text-foreground">{col.title}</span>
              </div>
              <span className="text-body-caption font-bold text-faint bg-graphite px-(--spacing-xs) py-(--spacing-3xs) rounded-full">
                {col.cards.length}
              </span>
            </div>
            {col.cards.map((card) => (
              <KanbanCardItem
                key={card.id}
                card={card}
                dragging={dragging?.cardId === card.id}
                columnLabel={col.title}
                onDragStart={() => setDragging({ colId: col.id, cardId: card.id })}
                onDragEnd={() => {
                  setDragging(null);
                  setOverCol(null);
                }}
                onKeyDown={(e) => moveCardByKeyboard(e, col.id, card.id)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
