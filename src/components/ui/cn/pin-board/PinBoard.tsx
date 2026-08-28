"use client";

import { useState, useRef, useCallback } from "react";

import { cn } from "@/lib/utils";

import type { PinNote, PinBoardProps } from "./pin-board.types";

// Paleta decorativa de post-it: cor é o próprio conteúdo escolhido por nota
// (como um marca-texto), não chrome de UI — sem token semântico equivalente,
// mesma categoria de exceção documentada pro scrim de overlay do Modal.
const COLORS = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fecaca", "#e9d5ff", "#fed7aa"];
const ROTATIONS = [-3, -2, -1, 0, 1, 2, 3];
const KEYBOARD_STEP = 10;

let idCounter = 1000;

export function PinBoard({
  notes: controlledNotes,
  defaultNotes,
  onChange,
  width = "100%",
  height = 400,
  className,
  style,
}: PinBoardProps) {
  // `notes` era documentado no registry como "modo controlado" mas nunca era
  // lido — o componente ficava sempre não-controlado, ignorando por completo
  // qualquer valor passado em `notes` pelo consumidor.
  const isControlled = controlledNotes !== undefined;
  const [internalNotes, setInternalNotes] = useState<PinNote[]>(
    () =>
      defaultNotes ?? [
        { id: 1, content: "Drag me around!", color: COLORS[0], x: 24, y: 24, rotate: -2 },
        { id: 2, content: "Click + to add notes", color: COLORS[2], x: 180, y: 60, rotate: 1 },
        { id: 3, content: "Double-click to delete", color: COLORS[4], x: 80, y: 160, rotate: -1 },
      ]
  );
  const notes = isControlled ? controlledNotes : internalNotes;

  const boardRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ id: string | number; offX: number; offY: number } | null>(null);

  // Único ponto de escrita: em modo controlado só notifica o consumidor (que
  // decide o novo estado); em não-controlado atualiza o estado interno.
  const commit = useCallback(
    (updater: (prev: PinNote[]) => PinNote[]) => {
      if (isControlled) {
        onChange?.(updater(controlledNotes));
        return;
      }
      setInternalNotes((prev) => {
        const next = updater(prev);
        onChange?.(next);
        return next;
      });
    },
    [isControlled, controlledNotes, onChange]
  );

  const onMouseDown = useCallback((e: React.MouseEvent, id: string | number) => {
    e.preventDefault();
    const card = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const board = boardRef.current?.getBoundingClientRect();
    if (!board) return;
    dragState.current = {
      id,
      offX: e.clientX - card.left,
      offY: e.clientY - card.top,
    };
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const ds = dragState.current;
      if (!ds || !boardRef.current) return;
      const board = boardRef.current.getBoundingClientRect();
      const x = e.clientX - board.left - ds.offX;
      const y = e.clientY - board.top - ds.offY;
      // Durante o arraste contínuo do mouse, onChange só dispara no mouseup
      // (abaixo) — igual ao comportamento original, evita spam de callback.
      if (isControlled) {
        onChange?.(controlledNotes.map((n) => (n.id === ds.id ? { ...n, x, y } : n)));
      } else {
        setInternalNotes((prev) => prev.map((n) => (n.id === ds.id ? { ...n, x, y } : n)));
      }
    },
    [isControlled, controlledNotes, onChange]
  );

  const onMouseUp = useCallback(() => {
    dragState.current = null;
  }, []);

  // Mover com mouse era a única forma de reposicionar uma nota — sem
  // alternativa de teclado. Cada seta é um passo discreto já "commitado"
  // (onChange dispara na hora, diferente do drag contínuo do mouse).
  const moveByKeyboard = useCallback(
    (id: string | number, dx: number, dy: number) => {
      commit((prev) => prev.map((n) => (n.id === id ? { ...n, x: (n.x ?? 0) + dx, y: (n.y ?? 0) + dy } : n)));
    },
    [commit]
  );

  function addNote() {
    idCounter++;
    const note: PinNote = {
      id: idCounter,
      content: "New note",
      color: COLORS[idCounter % COLORS.length],
      x: 40 + Math.random() * 120,
      y: 40 + Math.random() * 100,
      rotate: ROTATIONS[idCounter % ROTATIONS.length],
    };
    commit((prev) => [...prev, note]);
  }

  function deleteNote(id: string | number) {
    commit((prev) => prev.filter((n) => n.id !== id));
  }

  function handleNoteKeyDown(e: React.KeyboardEvent, id: string | number) {
    const step = KEYBOARD_STEP;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveByKeyboard(id, step, 0);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveByKeyboard(id, -step, 0);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      moveByKeyboard(id, 0, step);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveByKeyboard(id, 0, -step);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      deleteNote(id);
    }
  }

  return (
    // Board é só a superfície de arraste (o mousemove/up rastreia a nota já
    // focável abaixo, não é ele mesmo um alvo de interação) — mesmo padrão já
    // documentado em ImageCropper/ImageCompare pro container de drag.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cn("relative overflow-hidden rounded-(--radius-lg) border border-rule bg-canvas", className)}
      style={{ width, height, ...style }}
      ref={boardRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {notes.map((note) => (
        <div
          key={note.id}
          role="button"
          tabIndex={0}
          aria-label={`Nota: ${note.content}. Use as setas pra mover, Delete pra remover.`}
          onMouseDown={(e) => onMouseDown(e, note.id)}
          onDoubleClick={() => deleteNote(note.id)}
          onKeyDown={(e) => handleNoteKeyDown(e, note.id)}
          style={{
            position: "absolute",
            left: note.x ?? 0,
            top: note.y ?? 0,
            transform: `rotate(${note.rotate ?? 0}deg)`,
            background: note.color ?? COLORS[0],
            // color-mix literal: par com o `background` também literal da nota,
            // mesma exceção da paleta acima — não é texto de UI, é conteúdo
            color: "color-mix(in srgb, black 80%, transparent)",
            cursor: "grab",
            userSelect: "none",
            zIndex: dragState.current?.id === note.id ? 10 : 1,
          }}
          className="w-32 min-h-[7rem] p-(--spacing-md) shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)] rounded-(--radius-sm) text-body-callout leading-snug focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina"
          title="Double-click to delete"
        >
          {note.content}
        </div>
      ))}

      <button
        type="button"
        onClick={addNote}
        aria-label="Add note"
        className="absolute bottom-(--spacing-md) right-(--spacing-md) w-9 h-9 rounded-full bg-patina text-patina-fg flex items-center justify-center text-body-title shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)] hover:bg-patina-hover transition-colors"
        title="Add note"
      >
        +
      </button>
    </div>
  );
}
