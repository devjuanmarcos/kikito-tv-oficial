import type React from "react";

import { cn } from "@/lib/utils";

import type { AudioWaveformProps } from "./audio-waveform.types";

// achado real: a tabela fixa de 20 alturas cortava silenciosamente qualquer `bars` > 20
// (Array.slice não estende um array, só encurta) — gerador determinístico substitui,
// funciona pra qualquer contagem de barras sem limite escondido
function heightAt(i: number): number {
  return 0.3 + 0.65 * Math.abs(Math.sin(i * 0.7 + 1));
}

function BarsVisual({ count, height, color }: { count: number; height: number; color: string }) {
  return (
    <div className="flex items-end gap-(--spacing-3xs)" style={{ height }} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const h = heightAt(i);
        const barH = Math.max(4, h * height);
        const dur = `${(0.5 + (i % 5) * 0.12).toFixed(2)}s`;
        const delay = `${((i * 0.05) % 0.5).toFixed(2)}s`;
        return (
          <div
            key={i}
            className="aw-bar rounded-full w-[3px] shrink-0"
            style={
              {
                height: barH,
                background: color,
                "--_h": h,
                "--_dur": dur,
                "--_delay": delay,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

function WaveVisual({ count, height, color }: { count: number; height: number; color: string }) {
  const points = Array.from({ length: count }, (_, i) => {
    const x = (i / Math.max(count - 1, 1)) * 100;
    const y = 50 - heightAt(i) * 45;
    return `${x},${y}`;
  }).join(" ");
  const pointsBottom = Array.from({ length: count }, (_, i) => {
    const x = (i / Math.max(count - 1, 1)) * 100;
    const y = 50 + heightAt(i) * 45;
    return `${x},${y}`;
  })
    .reverse()
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height, width: "100%" }} aria-hidden="true">
      <polygon className="aw-wave" points={`${points} ${pointsBottom}`} fill={color} />
    </svg>
  );
}

function PulseVisual({ height, color }: { height: number; color: string }) {
  const size = Math.max(12, height * 0.6);
  return (
    <div className="relative flex items-center justify-center" style={{ height, width: size }} aria-hidden="true">
      <span className="aw-pulse-ring absolute rounded-full" style={{ width: size, height: size, background: color }} />
      <span className="relative rounded-full" style={{ width: size * 0.5, height: size * 0.5, background: color }} />
    </div>
  );
}

export function AudioWaveform({
  playing = false,
  bars = 20,
  color = "var(--ks-primary)",
  height = 40,
  variant = "bars",
  className,
  style,
}: AudioWaveformProps) {
  const count = Math.min(bars, 40);

  return (
    <>
      {/* @keyframes/classes globais injetadas — nome com prefixo aw- pra evitar colisão com
          outros componentes; múltiplas instâncias na página duplicam a mesma tag <style>,
          inofensivo (mesmo CSS, sem custo real). prefers-reduced-motion desliga as 3
          animações (achado real: nenhuma delas checava isso antes) */}
      <style>{`
        @keyframes aw-bounce {
          0%, 100% { transform: scaleY(0.3); }
          50%       { transform: scaleY(1); }
        }
        @keyframes aw-wave-shift {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes aw-pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        .aw-bar { transform-origin: bottom; transform: scaleY(var(--_h, 0.3)); }
        [data-playing="true"] .aw-bar {
          animation: aw-bounce var(--_dur, 0.6s) ease-in-out var(--_delay, 0s) infinite;
        }
        [data-playing="true"] .aw-wave {
          animation: aw-wave-shift 1.1s ease-in-out infinite;
        }
        [data-playing="true"] .aw-pulse-ring {
          animation: aw-pulse-ring 1.4s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          [data-playing="true"] .aw-bar,
          [data-playing="true"] .aw-wave,
          [data-playing="true"] .aw-pulse-ring { animation: none; }
        }
      `}</style>
      <div
        className={cn("inline-flex items-end", className)}
        style={{ height, ...style }}
        data-playing={playing}
        role="img"
        aria-label={playing ? "Playing" : "Paused"}
      >
        {variant === "wave" ? (
          <WaveVisual count={count} height={height} color={color} />
        ) : variant === "pulse" ? (
          <PulseVisual height={height} color={color} />
        ) : (
          <BarsVisual count={count} height={height} color={color} />
        )}
      </div>
    </>
  );
}
