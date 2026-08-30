import { cn } from "@/lib/utils";

import type { TextShineAs, TextShineProps } from "./text-shine.types";

export function TextShine({
  children,
  duration = 4,
  as: Tag = "span" as TextShineAs,
  className,
  style,
}: TextShineProps) {
  return (
    <>
      {/* forced-colors (Windows High Contrast): navegador ignora background/gradiente, então o
          fallback abaixo restaura a cor de texto real — mesmo padrão do TextGradient, sem ele
          color:transparent deixaria o texto invisível nesse modo */}
      <style>{`
        @media (forced-colors: active) {
          .ks-text-shine {
            background: none !important;
            -webkit-text-fill-color: currentColor !important;
            color: CanvasText !important;
          }
        }
        @keyframes ks-text-shine-sweep {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
      <Tag
        className={cn("inline ks-text-shine", className)}
        style={
          {
            backgroundImage:
              "linear-gradient(110deg, var(--ks-text-muted) 35%, var(--ks-foreground) 50%, var(--ks-text-muted) 65%)",
            backgroundSize: "250% 100%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            animation: `ks-text-shine-sweep ${duration}s linear infinite`,
            ...style,
          } as React.CSSProperties
        }
      >
        {children}
      </Tag>
    </>
  );
}
