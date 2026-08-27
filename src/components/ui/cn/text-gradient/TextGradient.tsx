import { cn } from "@/lib/utils";

import type { TextGradientAs, TextGradientProps } from "./text-gradient.types";

export function TextGradient({
  children,
  from = "var(--ks-violet)",
  to = "var(--ks-rose)",
  via,
  direction = "90deg",
  animate = false,
  as: Tag = "span" as TextGradientAs,
  className,
  style,
}: TextGradientProps) {
  const stops = via
    ? `${from}, ${via}, ${to}${animate ? ", " + from : ""}`
    : `${from}, ${to}${animate ? ", " + from : ""}`;
  const gradient = `linear-gradient(${direction}, ${stops})`;

  return (
    <>
      {/* forced-colors (Windows High Contrast): navegador ignora background/gradiente, então o
          fallback abaixo restaura a cor de texto real — sem ele, color:transparent deixaria o
          texto completamente invisível nesse modo */}
      <style>{`
        @media (forced-colors: active) {
          .ks-text-gradient {
            background: none !important;
            -webkit-text-fill-color: currentColor !important;
            color: CanvasText !important;
          }
        }
      `}</style>
      {animate && (
        <style>{`
          @keyframes gradient-flow {
            0%   { background-position: 0% center; }
            100% { background-position: 200% center; }
          }
        `}</style>
      )}
      <Tag
        className={cn("inline ks-text-gradient", className)}
        style={
          {
            background: gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            ...(animate && {
              backgroundSize: "200% auto",
              animation: "gradient-flow 3s linear infinite",
            }),
            ...style,
          } as React.CSSProperties
        }
      >
        {children}
      </Tag>
    </>
  );
}
