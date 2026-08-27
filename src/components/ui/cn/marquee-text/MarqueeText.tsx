import { cn } from "@/lib/utils";

import type { MarqueeTextProps } from "./marquee-text.types";

const SIZE_CLASSES = {
  sm: "text-body-callout",
  md: "text-body-title",
  lg: "text-heading-03",
  xl: "text-heading-02",
};

export function MarqueeText({ text, speed = 30, size = "md", repeat = 8, className, style }: MarqueeTextProps) {
  const duration = `${(text.length * repeat) / speed}s`;
  const items = Array(repeat * 2).fill(text);

  return (
    <>
      <style>{`
        .mq-root { overflow: hidden; white-space: nowrap; width: 100%; }
        .mq-track {
          display: inline-flex;
          gap: 2em;
          animation: mq-scroll linear infinite;
          will-change: transform;
        }
        @keyframes mq-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .mq-item { display: inline-block; padding-right: 2em; }
        /* prefers-reduced-motion: rolagem infinita é movimento contínuo — pausa em vez de forçar animação */
        @media (prefers-reduced-motion: reduce) {
          .mq-track { animation: none; }
        }
      `}</style>
      <div className={cn("mq-root", SIZE_CLASSES[size], className)} style={style}>
        {/* conteúdo real, lido uma única vez por leitor de tela — a faixa visual abaixo repete o texto
            várias vezes só pra criar o efeito de rolagem contínua, por isso fica aria-hidden */}
        <span className="sr-only">{text}</span>
        <div className="mq-track" style={{ animationDuration: duration }} aria-hidden="true">
          {items.map((t, i) => (
            <span key={i} className="mq-item">
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
