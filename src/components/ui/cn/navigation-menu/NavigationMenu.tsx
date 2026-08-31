"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState, useRef, useEffect } from "react";

import { Badge } from "@/components/ui/cn/badge/Badge";
import { scaleIn, transitionStandard } from "@/lib/motion";
import { cn } from "@/lib/utils";

import type { NavigationMenuItem, NavigationMenuOrientation, NavigationMenuProps } from "./navigation-menu.types";

const ChevronIcon = ({ open, vertical }: { open: boolean; vertical?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    className={cn(
      "w-3 h-3 flex-shrink-0 transition-transform duration-[160ms]",
      open && "rotate-180",
      vertical && !open && "-rotate-90"
    )}
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// achado real: itens com href renderizavam <button onClick> em vez de <a href> — sem
// suporte a ctrl/cmd/shift-click (abrir em nova aba), botão do meio, "copiar link", ou
// navegação nativa quando `onNavigate` não é passado. handleLinkClick preserva o callback
// SPA (preventDefault só quando não é um clique modificado) sem perder nenhum desses casos
function handleLinkClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string | undefined,
  onNavigate: ((href: string) => void) | undefined
) {
  if (!onNavigate || !href) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  onNavigate(href);
}

function ItemBadge({ badge }: { badge: string | number }) {
  return (
    <Badge intent="danger" variant="solid" size="sm">
      {badge}
    </Badge>
  );
}

function NavItem({
  item,
  activeHref,
  onNavigate,
  orientation,
}: {
  item: NavigationMenuItem;
  activeHref?: string;
  onNavigate?: (href: string) => void;
  orientation: NavigationMenuOrientation;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isHorizontal = orientation === "horizontal";
  const hasChildren = !!item.children?.length;
  const isActive = item.href === activeHref;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    // achado real: dropdown fechava clicando fora, mas não tinha Escape nenhum — todo outro
    // widget flutuante desta biblioteca (Tooltip/ImageViewer/OnboardingTour/NotificationBell)
    // já fecha com Escape, esse era o único que não fechava
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerContent = (
    <>
      {item.icon && (
        <span aria-hidden="true" className="leading-none">
          {item.icon}
        </span>
      )}
      {item.label}
      {item.badge !== undefined && <ItemBadge badge={item.badge} />}
      {hasChildren && <ChevronIcon open={open} vertical={!isHorizontal} />}
    </>
  );

  const triggerClassName = cn(
    "flex items-center gap-(--spacing-xs) px-(--spacing-md) py-(--spacing-sm) rounded-lg text-body-callout font-medium whitespace-nowrap",
    "transition-[background,color] duration-[80ms]",
    isActive ? "bg-patina-soft text-patina" : "text-foreground hover:bg-graphite",
    item.disabled && "opacity-40 pointer-events-none"
  );

  return (
    <div ref={ref} className="relative">
      {!hasChildren && item.href ? (
        <a
          href={item.href}
          aria-disabled={item.disabled || undefined}
          onClick={(e) => (item.disabled ? e.preventDefault() : handleLinkClick(e, item.href, onNavigate))}
          className={triggerClassName}
        >
          {triggerContent}
        </a>
      ) : (
        <button
          type="button"
          disabled={item.disabled}
          aria-expanded={hasChildren ? open : undefined}
          onClick={() => {
            if (hasChildren) setOpen((v) => !v);
          }}
          className={triggerClassName}
        >
          {triggerContent}
        </button>
      )}

      {/* {open && <div>} cru sem AnimatePresence antes -- mesmo bug ja corrigido no
          DropdownMenu/SplitButton (ver docs/component-import/animation-backport/PLAN.md),
          mesmo par scaleIn+transitionStandard (mesma forma de widget: menu ancorado no
          trigger). Achado na varredura de showcase, 2026-08-30. */}
      <AnimatePresence>
        {hasChildren && open && (
          <motion.div
            {...scaleIn}
            transition={transitionStandard}
            className={cn(
              "z-50 py-(--spacing-3xs) rounded-xl border border-rule bg-raised shadow-[0_8px_24px_-8px_oklch(0%_0_0/0.4)]",
              isHorizontal ? "absolute top-full left-0 mt-(--spacing-3xs) min-w-[160px]" : "ml-(--spacing-lg) mt-0.5"
            )}
          >
            {item.children!.map((child, i) =>
              child.href ? (
                <a
                  key={i}
                  href={child.href}
                  aria-disabled={child.disabled || undefined}
                  onClick={(e) => {
                    if (child.disabled) {
                      e.preventDefault();
                      return;
                    }
                    handleLinkClick(e, child.href, onNavigate);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-sm) text-body-callout text-left",
                    "transition-colors duration-[80ms] hover:bg-graphite",
                    child.href === activeHref ? "text-patina" : "text-foreground",
                    child.disabled && "opacity-40 pointer-events-none"
                  )}
                >
                  <span>{child.label}</span>
                  {child.badge !== undefined && <ItemBadge badge={child.badge} />}
                </a>
              ) : null
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NavigationMenu({
  items,
  activeHref,
  orientation = "horizontal",
  onNavigate,
  className,
  style,
}: NavigationMenuProps) {
  return (
    <nav
      style={style}
      aria-label="Navigation"
      className={cn(
        "flex gap-(--spacing-3xs)",
        orientation === "horizontal" ? "flex-row items-center" : "flex-col",
        className
      )}
    >
      {items.map((item, i) => (
        <NavItem key={i} item={item} activeHref={activeHref} onNavigate={onNavigate} orientation={orientation} />
      ))}
    </nav>
  );
}
