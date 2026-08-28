"use client";
import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";

import { cn } from "@/lib/utils";

import type { MediaPlayerProps } from "./media-player.types";

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
    <polygon points="5 3 19 12 5 21" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);
const PrevIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
    <polygon points="19 20 9 12 19 4" />
    <rect x="5" y="4" width="2" height="16" />
  </svg>
);
const NextIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
    <polygon points="5 4 15 12 5 20" />
    <rect x="17" y="4" width="2" height="16" />
  </svg>
);
const VolumeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="w-4 h-4">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19" />
    <path d="M15.54 8.46a5 5 0 010 7.07" />
  </svg>
);

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function MediaPlayer({
  title = "Unknown Track",
  artist = "Unknown Artist",
  cover,
  src,
  type = "audio",
  className,
  style,
}: MediaPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(80);
  // HTMLMediaElement cobre <audio> e <video> — `type` decide qual dos dois é
  // montado (ver bug corrigido abaixo), o ref precisa aceitar ambos.
  const mediaRef = useRef<HTMLMediaElement | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const isVideo = type === "video" && !!src;

  const togglePlay = useCallback(() => {
    if (src && mediaRef.current) {
      if (playing) mediaRef.current.pause();
      else mediaRef.current.play();
    } else {
      setPlaying((v) => !v);
    }
  }, [src, playing]);

  // Seek pra um instante absoluto (clamp em [0, duration]) — compartilhado
  // pelo clique na barra de progresso e pela navegação por teclado.
  const seekTo = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), duration);
      setProgress(clamped);
      if (mediaRef.current) mediaRef.current.currentTime = clamped;
    },
    [duration]
  );

  const handleSeekKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = 5;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        seekTo(progress + step);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        seekTo(progress - step);
      } else if (e.key === "Home") {
        e.preventDefault();
        seekTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        seekTo(duration);
      }
    },
    [progress, duration, seekTo]
  );

  useEffect(() => {
    if (!src) {
      if (playing) {
        tickRef.current = setInterval(() => {
          setProgress((p) => {
            if (p >= duration) {
              setPlaying(false);
              return 0;
            }
            return p + 1;
          });
        }, 1000);
      }
      return () => clearInterval(tickRef.current);
    }
  }, [playing, src, duration]);

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  const mediaEvents = {
    onPlay: () => setPlaying(true),
    onPause: () => setPlaying(false),
    onTimeUpdate: () => {
      if (mediaRef.current) setProgress(mediaRef.current.currentTime);
    },
    onLoadedMetadata: () => {
      if (mediaRef.current) setDuration(mediaRef.current.duration);
    },
  };

  return (
    <div
      style={style}
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border border-rule bg-raised",
        "w-full max-w-md",
        className
      )}
    >
      {/* Cover / vídeo — título e artista já aparecem como texto ao lado, então
          a arte/vídeo aqui é decorativa pro leitor de tela (aria-hidden) */}
      <div
        className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-graphite-2 flex items-center justify-center"
        aria-hidden="true"
      >
        {isVideo ? (
          // `type="video"` era documentado no registry mas nunca implementado —
          // o componente sempre montava um <audio> escondido, mesmo pra vídeo.
          <video
            ref={mediaRef as React.Ref<HTMLVideoElement>}
            src={src}
            className="w-full h-full object-cover"
            {...mediaEvents}
          />
        ) : cover ? (
          <img src={cover} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-heading-05">🎵</span>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Track info */}
        <div className="mb-2">
          <p className="text-body-callout font-semibold text-foreground truncate">{title}</p>
          <p className="text-body-caption text-faint truncate">{artist}</p>
        </div>

        {/* Progress — clique/arraste era mouse-only, sem alternativa de teclado.
            Vira role="slider" focável com Arrow/Home/End chamando o mesmo
            `seekTo` do clique */}
        <div className="flex items-center gap-2 mb-2">
          {/* text-[0.6rem] abaixo do mínimo da escala (0.75rem): micro-label
              numérico de tempo decorrido, não conteúdo primário */}
          <span className="text-[0.6rem] text-faint tabular-nums w-6">{fmt(progress)}</span>
          <div
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={Math.round(progress)}
            aria-valuetext={`${fmt(progress)} de ${fmt(duration)}`}
            className="flex-1 relative h-1 bg-graphite-2 rounded-full overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - r.left) / r.width;
              seekTo(ratio * duration);
            }}
            onKeyDown={handleSeekKeyDown}
          >
            <div
              className="h-full bg-patina rounded-full transition-[width] duration-[400ms]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[0.6rem] text-faint tabular-nums w-6 text-right">{fmt(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* setProgress(0) direto nunca atualizava mediaRef.currentTime quando
                havia `src` real — usava seekTo (mesma correção do Next) */}
            <button
              type="button"
              aria-label="Previous"
              className="text-faint hover:text-foreground transition-colors"
              onClick={() => seekTo(0)}
            >
              <PrevIcon />
            </button>
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={togglePlay}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-patina text-patina-fg hover:brightness-110 transition-[filter] duration-[100ms]"
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              type="button"
              aria-label="Next"
              className="text-faint hover:text-foreground transition-colors"
              onClick={() => seekTo(duration)}
            >
              <NextIcon />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1.5">
            <VolumeIcon />
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              aria-label="Volume"
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                if (mediaRef.current) mediaRef.current.volume = v / 100;
              }}
              className="w-16 accent-patina h-1 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* `type="video"` monta o <video> visível no slot de cover acima — esse
          <audio> escondido só serve pro caso 'audio' (evita 2 elementos de
          mídia tocando o mesmo `src` ao mesmo tempo) */}
      {!isVideo && src && <audio ref={mediaRef as React.Ref<HTMLAudioElement>} src={src} {...mediaEvents} />}
    </div>
  );
}
