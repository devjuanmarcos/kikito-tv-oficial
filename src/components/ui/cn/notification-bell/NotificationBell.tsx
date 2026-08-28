"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

import { Badge } from "@/components/ui/cn/badge";
import { cn } from "@/lib/utils";

import type { NotificationBellProps, NotificationIntent } from "./notification-bell.types";

const INTENT_DOT: Record<NotificationIntent, string> = {
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-faint",
};

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" className="w-5 h-5">
    <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XSmIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="w-3 h-3">
    <path d="M12 4L4 12M4 4l8 8" strokeLinecap="round" />
  </svg>
);

export function NotificationBell({
  notifications = [],
  onRead,
  onReadAll,
  onDismiss,
  maxVisible = 20,
  className,
  style,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;
  const visible = notifications.slice(0, maxVisible);

  const calcPos = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const pw = 360;
    const ph = 480;
    const vW = window.innerWidth;
    const vH = window.innerHeight;
    let left = r.right - pw;
    let top = r.bottom + 8;
    if (left < 8) left = 8;
    if (left + pw > vW - 8) left = vW - pw - 8;
    if (top + ph > vH - 8) top = r.top - ph - 8;
    // Achado real: em viewport curto (sem espaço nem abaixo nem acima do gatilho),
    // o fallback "vira pra cima" podia produzir `top` negativo — o painel
    // renderizava com o topo cortado pra fora da tela, sem como rolar até lá
    // (position: fixed não acompanha scroll da página). Clamp final garante que
    // o painel sempre começa dentro da viewport; a lista interna já tem
    // overflow-y-auto pro conteúdo que ainda não couber.
    if (top < 8) top = 8;
    setPos({ top, left });
  }, []);

  useEffect(() => {
    if (!open) return;
    calcPos();
    const handleOutside = (e: MouseEvent) => {
      if (btnRef.current?.contains(e.target as Node) || panelRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, calcPos]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={style}
        className={cn(
          "relative flex items-center justify-center w-9 h-9 rounded-lg",
          "text-faint hover:text-foreground hover:bg-graphite transition-colors duration-[100ms]",
          open && "text-foreground bg-graphite",
          className
        )}
      >
        <BellIcon />
        {unread > 0 && (
          // Badge CN já existe (reaproveitado, mesmo padrão de contador que
          // VerticalNav já usa) em vez de reinventar um <span> customizado
          <Badge
            intent="danger"
            variant="solid"
            size="sm"
            className="absolute top-1 right-1 min-w-[1rem] h-4 px-1 justify-center"
          >
            {unread > 99 ? "99+" : unread}
          </Badge>
        )}
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={panelRef}
            style={{ top: pos.top, left: pos.left, width: 360 }}
            className={cn(
              "fixed z-[950] flex flex-col rounded-xl border border-rule bg-raised shadow-[0_16px_48px_-8px_oklch(0%_0_0/0.5)]",
              "max-h-[480px] overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-rule">
              <span className="text-body-callout font-semibold text-foreground">Notifications</span>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={() => onReadAll?.()}
                  className="text-body-caption text-patina hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {visible.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-faint">
                  <BellIcon />
                  <span className="text-body-callout">All caught up</span>
                </div>
              ) : (
                <ul className="divide-y divide-rule">
                  {visible.map((n) => (
                    <li
                      key={n.id}
                      className={cn(
                        "group flex gap-3",
                        // bg-graphite/40: wash sutil de fundo pra "não lido", não há -soft
                        // equivalente pra graphite (só intents têm -soft) — mesma exceção
                        // já documentada em LogViewer pro wash de linha
                        !n.read && "bg-graphite/40"
                      )}
                    >
                      {/* onClick direto no <li> era mouse-only, e o <li> não é focável —
                          em vez de dar role="button" ao <li> inteiro (criaria um widget
                          aninhado com o botão Dismiss abaixo), a área "marcar como lido"
                          vira um <button> real, irmão do Dismiss, não ancestral dele */}
                      <button
                        type="button"
                        onClick={() => onRead?.(n.id)}
                        className="flex flex-1 min-w-0 gap-3 px-4 py-3 text-left cursor-pointer hover:bg-graphite transition-colors duration-[80ms]"
                      >
                        {/* dot / avatar — título já identifica a notificação como texto */}
                        <div className="flex-shrink-0 pt-0.5" aria-hidden="true">
                          {n.avatar ? (
                            <img src={n.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <span
                              className={cn("mt-1.5 block w-2 h-2 rounded-full", INTENT_DOT[n.intent ?? "neutral"])}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-body-callout truncate",
                              n.read ? "text-faint" : "text-foreground font-medium"
                            )}
                          >
                            {n.title}
                          </p>
                          {n.body && <p className="text-body-caption text-faint line-clamp-2 mt-0.5">{n.body}</p>}
                          {n.time && <p className="text-body-caption text-faint mt-1">{n.time}</p>}
                        </div>
                      </button>
                      {onDismiss && (
                        <button
                          type="button"
                          aria-label="Dismiss"
                          onClick={() => onDismiss(n.id)}
                          className="flex-shrink-0 self-center mr-4 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina flex items-center justify-center w-6 h-6 rounded-(--radius-xs) text-faint hover:text-foreground hover:bg-graphite-2 transition-[opacity,background] duration-[80ms]"
                        >
                          <XSmIcon />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
