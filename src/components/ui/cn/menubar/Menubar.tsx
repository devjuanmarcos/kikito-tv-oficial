"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { MenuEntry } from "@/components/ui/cn/dropdown-menu";
import { scaleInVertical, springSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";

import type { MenubarProps } from "./menubar.types";

/**
 * Menubar — barra de menu horizontal estilo desktop (File/Edit/View), absorvido
 * de `shadcn ui/menubar.tsx`. Sem primo real na Kikito CN (`NavigationMenu` é
 * navegação de site, não menu de app).
 *
 * A origem constrói isso em cima de `@base-ui/react` (`Menu`/`Menubar`
 * primitives) + o próprio `DropdownMenu` deles (composição via
 * `<DropdownMenuContent><DropdownMenuItem>` etc., 15 subcomponentes
 * exportados). Nenhuma das duas coisas existe aqui — nem `@base-ui/react`,
 * nem um `DropdownMenu` composable (o da Kikito CN é um Super component
 * dirigido por dados: `<DropdownMenu items={MenuEntry[]} />`, não por
 * children). Reescrito do zero seguindo o padrão de dados da própria Kikito
 * CN em vez de introduzir um paradigma de composição novo só pra este
 * componente — cada `MenubarMenuDef` já é `{ label, items: MenuEntry[] }`.
 *
 * Também não reaproveita o `DropdownMenu` (`trigger="click"`) internamente:
 * o comportamento real de menu de app — passar o mouse por cima de outro
 * trigger enquanto um menu já está aberto troca pro outro sem precisar
 * clicar de novo — exige estado compartilhado entre os triggers
 * (`openIndex` no `Menubar`, não por instância), que o `DropdownMenu` atual
 * não expõe (é 100% não-controlado). Implementado direto aqui, sem tocar no
 * `DropdownMenu` compartilhado.
 */

function renderMenubarEntry(entry: MenuEntry, i: number, close: () => void) {
  if (entry.type === "separator") {
    return <div key={i} role="separator" className="my-(--spacing-2xs) -mx-(--spacing-2xs) h-px bg-rule" />;
  }
  if (entry.type === "group") {
    return (
      <div key={i} className="mb-(--spacing-2xs)">
        {/* text-[0.625rem]: below scale minimum, eyebrow de grupo */}
        <div className="px-(--spacing-sm) pb-(--spacing-2xs) text-[0.625rem] font-semibold uppercase tracking-widest text-faint select-none">
          {entry.label}
        </div>
        {entry.items.map((it, j) => renderMenubarEntry(it, j, close))}
      </div>
    );
  }
  return (
    <button
      key={i}
      type="button"
      disabled={entry.disabled}
      onClick={() => {
        if (entry.disabled) return;
        entry.onClick?.();
        close();
      }}
      className={cn(
        "w-full flex items-center gap-(--spacing-sm) px-(--spacing-sm) py-(--spacing-xs) text-body-callout rounded-(--radius-xs) transition-colors duration-[80ms] text-left select-none",
        entry.danger
          ? "text-danger hover:bg-danger-soft hover:text-danger-soft-fg"
          : "text-foreground hover:bg-graphite",
        entry.disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {entry.icon && (
        <span className="shrink-0 w-3.5 h-3.5 flex items-center justify-center text-faint">{entry.icon}</span>
      )}
      <span className="flex-1 truncate">{entry.label}</span>
      {/* text-[0.6875rem]: below scale minimum, glyph de shortcut */}
      {entry.shortcut && (
        <span className="shrink-0 text-[0.6875rem] text-faint font-mono ml-auto">{entry.shortcut}</span>
      )}
    </button>
  );
}

export function Menubar({ menus, className, style }: MenubarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openIndex === null) return;
    function handleClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpenIndex(null);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openIndex]);

  return (
    <div
      ref={rootRef}
      role="menubar"
      className={cn(
        "inline-flex items-center gap-(--spacing-3xs) rounded-(--radius-md) border border-rule bg-raised p-(--spacing-3xs)",
        className
      )}
      style={style}
    >
      {menus.map((menu, i) => (
        <div key={menu.label} className="relative">
          <button
            type="button"
            role="menuitem"
            disabled={menu.disabled}
            aria-haspopup="menu"
            aria-expanded={openIndex === i}
            onClick={() => !menu.disabled && setOpenIndex((v) => (v === i ? null : i))}
            onMouseEnter={() => {
              // Achado de app menu bar real: se outro menu já está aberto,
              // só passar o mouse por cima troca pra este — não precisa clicar
              // de novo. Só ativa quando *algo* já está aberto (openIndex !== null),
              // senão passar o mouse pela barra abriria menus sem nenhum clique.
              if (!menu.disabled && openIndex !== null && openIndex !== i) setOpenIndex(i);
            }}
            className={cn(
              "flex items-center rounded-(--radius-xs) px-(--spacing-sm) py-(--spacing-2xs) text-body-callout font-medium select-none outline-none",
              "transition-colors duration-[80ms]",
              openIndex === i ? "bg-graphite text-foreground" : "text-muted hover:bg-graphite hover:text-foreground",
              menu.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {menu.label}
          </button>

          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                role="menu"
                className="absolute top-[calc(100%+4px)] left-0 z-[1200] min-w-[180px] max-w-[280px] p-(--spacing-2xs) bg-raised border border-rule rounded-(--radius-md) shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.35),0_0_0_1px_oklch(0%_0_0/0.06)]"
                {...scaleInVertical}
                transition={springSnappy}
                style={{ transformOrigin: "top" }}
              >
                {menu.items.map((entry, j) => renderMenubarEntry(entry, j, () => setOpenIndex(null)))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
