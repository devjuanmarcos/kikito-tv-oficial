"use client";

import { useEffect, useRef } from "react";

interface AnnounceProps {
  /** Mensagem a ser anunciada para leitores de tela */
  message: string;
  /** "polite": aguarda o leitor terminar. "assertive": interrompe imediatamente */
  politeness?: "polite" | "assertive";
}

/**
 * Anuncia mudanças dinâmicas para leitores de tela via aria-live.
 * Ideal para: toasts de sucesso, erros de formulário, loading states.
 *
 * @example
 * <Announce message={submitSuccess ? "Formulário enviado com sucesso!" : ""} />
 */
export function Announce({ message, politeness = "polite" }: AnnounceProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !message) return;
    // Limpar e re-setar para garantir que o anúncio sempre dispare
    ref.current.textContent = "";
    const timeout = setTimeout(() => {
      if (ref.current) ref.current.textContent = message;
    }, 50);
    return () => clearTimeout(timeout);
  }, [message]);

  return <div ref={ref} role="status" aria-live={politeness} aria-atomic="true" className="sr-only" />;
}
