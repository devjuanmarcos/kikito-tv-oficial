"use client";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/cn/badge/Badge";
import { cn } from "@/lib/utils";

import type { VideoCardProps } from "./video-card.types";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function VideoCard({
  src,
  poster,
  title = "Untitled Video",
  description,
  duration,
  category,
  views,
  href,
  className,
  style,
}: VideoCardProps) {
  const El = href ? "a" : "div";
  const [hovering, setHovering] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  // achado real: `src` (documentado como "URL do vídeo" no registry) nunca era usado em
  // lugar nenhum — o card nunca reproduzia nada, era só um link estático pro poster.
  // Implementado como preview em hover (silenciado, sem som), padrão comum de video-card;
  // não roda se o usuário pediu prefers-reduced-motion
  const showPreview = !!src && hovering && !reducedMotion;

  return (
    <El
      className={cn(
        "group rounded-(--radius-lg) border border-rule bg-raised overflow-hidden transition-shadow",
        "hover:shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)]",
        href && "cursor-pointer",
        className
      )}
      style={style}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      {...(href ? { href } : {})}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-graphite overflow-hidden">
        {showPreview ? (
          <video
            src={src}
            muted
            autoPlay
            loop
            playsInline
            aria-hidden="true"
            tabIndex={-1}
            className="w-full h-full object-cover"
          />
        ) : poster ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          // sem poster: glifo de preenchimento decorativo (não transmite nenhuma informação
          // que o título ao lado já não transmita) — sem -soft equivalente pra esse tamanho
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center text-heading-02 text-foreground/20"
          >
            ▶
          </div>
        )}
        {/* Play overlay */}
        {!showPreview && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-canvas/50"
          >
            <div className="w-12 h-12 rounded-full bg-raised flex items-center justify-center text-body-title translate-x-0.5 text-foreground">
              ▶
            </div>
          </div>
        )}
        {duration && (
          <div className="absolute bottom-(--spacing-sm) right-(--spacing-sm) bg-canvas/80 text-foreground text-body-caption font-mono px-(--spacing-xs) py-(--spacing-3xs) rounded-(--radius-xs)">
            {duration}
          </div>
        )}
        {category && (
          <Badge intent="primary" variant="solid" size="sm" className="absolute top-(--spacing-sm) left-(--spacing-sm)">
            {category}
          </Badge>
        )}
      </div>

      {/* Body */}
      <div className="p-(--spacing-md) flex flex-col gap-(--spacing-2xs)">
        <p className="font-semibold text-foreground text-body-paragraph leading-snug line-clamp-2">{title}</p>
        {description && <p className="text-body-callout text-muted leading-snug line-clamp-2">{description}</p>}
        {views !== undefined && (
          <p className="text-body-caption text-faint mt-(--spacing-3xs)">
            {typeof views === "number" ? `${views.toLocaleString()} views` : views}
          </p>
        )}
      </div>
    </El>
  );
}
