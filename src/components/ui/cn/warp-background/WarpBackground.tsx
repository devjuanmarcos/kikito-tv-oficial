"use client";
/**
 * WarpBackground — grade 3D com feixes de luz animados subindo pelas 4
 * bordas (efeito "hyperspace"/"warp speed"). Adaptado do componente
 * `warp-background` (biblioteca vendorizada shadcndashboard local, ver
 * docs/component-import/animation-backport/PLAN.md pro precedente de uso).
 *
 * Igual ao DarkGradientBackground: componente do grupo "Backgrounds",
 * deliberadamente independente do tema da pagina (a grade 3D e os feixes
 * sao o efeito visual em si, nao decoracao que deveria clarear no light mode).
 *
 * Adaptado pro vocabulario Kikito CN:
 * - `gridColor` default `hsl(var(--border))` (variavel do dashboard shadcn,
 *   nao existe neste projeto) -> `var(--ks-rule)`.
 * - `p-20` (5rem): fora da escala de spacing coberta (steps 0.5-12, teto
 *   3rem) -- mantido como Tailwind nativo, documentado aqui.
 * - Motion ja vinha de `motion/react` (mesma lib do projeto), sem mudanca de
 *   import. `duration`/`delay` sao PROPS do proprio componente (beamDuration/
 *   beamDelayMin/Max), nao numero magico escondido -- nao precisam de preset
 *   de @/lib/motion porque o ponto do componente e o consumidor poder
 *   configurar a velocidade.
 * - Matiz aleatoria por feixe (`Math.random() * 360`) mantida de proposito:
 *   e um efeito arco-iris tipo hyperspace, nao uma cor de intent -- reduzir
 *   pra uma cor fixa destruiria o efeito (mesma categoria de excecao das
 *   cores da paleta do BalloonBackground/confete do Button.tsx).
 */
import { motion } from "motion/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import type { WarpBackgroundProps } from "./warp-background.types";

const Beam = ({
  width,
  x,
  delayMin,
  delayMax,
  duration,
}: {
  width: string | number;
  x: string | number;
  delayMin: number;
  delayMax: number;
  duration: number;
}) => {
  // achado real: Math.random() direto no corpo do render (hue/aspect-ratio E o
  // delay, que antes vinha pronto de generateBeams()) sorteia um valor no
  // servidor e OUTRO na hidratacao do cliente -- React detecta mismatch e
  // avisa (erro no overlay de dev). Valor fixo na primeira renderizacao
  // (identica em servidor/cliente) + randomiza so depois de montar (client-only).
  const [{ hue, ar, delay }, setRandom] = useState({ hue: 200, ar: 5, delay: delayMin });
  useEffect(() => {
    setRandom({
      hue: Math.floor(Math.random() * 360),
      ar: Math.floor(Math.random() * 10) + 1,
      delay: Math.random() * (delayMax - delayMin) + delayMin,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      style={
        {
          "--x": `${x}`,
          "--width": `${width}`,
          "--aspect-ratio": `${ar}`,
          "--background": `linear-gradient(hsl(${hue} 80% 60%), transparent)`,
        } as React.CSSProperties
      }
      className="absolute left-[var(--x)] top-0 [aspect-ratio:1/var(--aspect-ratio)] [background:var(--background)] [width:var(--width)]"
      initial={{ y: "100cqmax", x: "-50%" }}
      animate={{ y: "-100%", x: "-50%" }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
};

export function WarpBackground({
  children,
  perspective = 100,
  className,
  beamsPerSide = 3,
  beamSize = 5,
  beamDelayMax = 3,
  beamDelayMin = 0,
  beamDuration = 3,
  gridColor = "var(--ks-rule)",
  ...props
}: WarpBackgroundProps) {
  // so posicoes (deterministico, index-based) -- delay e sorteado dentro de
  // cada <Beam> apos montar, ver comentario la (evita mismatch de hidratacao).
  const generateBeams = useCallback(() => {
    const beams = [];
    const cellsPerSide = Math.floor(100 / beamSize);
    const step = cellsPerSide / beamsPerSide;
    for (let i = 0; i < beamsPerSide; i++) {
      beams.push({ x: Math.floor(i * step) });
    }
    return beams;
  }, [beamsPerSide, beamSize]);

  const topBeams = useMemo(() => generateBeams(), [generateBeams]);
  const rightBeams = useMemo(() => generateBeams(), [generateBeams]);
  const bottomBeams = useMemo(() => generateBeams(), [generateBeams]);
  const leftBeams = useMemo(() => generateBeams(), [generateBeams]);

  const gridBg =
    "[background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)]";

  return (
    // p-20: fora da escala de spacing coberta (teto 3rem) -- ver comentario no topo do arquivo.
    <div
      className={cn("relative rounded-(--radius-md) border-(length:--border-width-hairline) border-rule p-20", className)}
      {...props}
    >
      <div
        style={
          {
            "--perspective": `${perspective}px`,
            "--grid-color": gridColor,
            "--beam-size": `${beamSize}%`,
          } as React.CSSProperties
        }
        className="pointer-events-none absolute left-0 top-0 size-full overflow-hidden [clip-path:inset(0)] [container-type:size] [perspective:var(--perspective)] [transform-style:preserve-3d]"
      >
        {/* top */}
        <div
          className={cn(
            "absolute [container-type:inline-size] [height:100cqmax] [transform-origin:50%_0%] [transform-style:preserve-3d] [transform:rotateX(-90deg)] [width:100cqi] [background-size:var(--beam-size)_var(--beam-size)]",
            gridBg
          )}
        >
          {topBeams.map((beam, index) => (
            <Beam key={`top-${index}`} width={`${beamSize}%`} x={`${beam.x * beamSize}%`} delayMin={beamDelayMin} delayMax={beamDelayMax} duration={beamDuration} />
          ))}
        </div>
        {/* bottom */}
        <div
          className={cn(
            "absolute top-full [container-type:inline-size] [height:100cqmax] [transform-origin:50%_0%] [transform-style:preserve-3d] [transform:rotateX(-90deg)] [width:100cqi] [background-size:var(--beam-size)_var(--beam-size)]",
            gridBg
          )}
        >
          {bottomBeams.map((beam, index) => (
            <Beam key={`bottom-${index}`} width={`${beamSize}%`} x={`${beam.x * beamSize}%`} delayMin={beamDelayMin} delayMax={beamDelayMax} duration={beamDuration} />
          ))}
        </div>
        {/* left */}
        <div
          className={cn(
            "absolute left-0 top-0 [container-type:inline-size] [height:100cqmax] [transform-origin:0%_0%] [transform-style:preserve-3d] [transform:rotate(90deg)_rotateX(-90deg)] [width:100cqh] [background-size:var(--beam-size)_var(--beam-size)]",
            gridBg
          )}
        >
          {leftBeams.map((beam, index) => (
            <Beam key={`left-${index}`} width={`${beamSize}%`} x={`${beam.x * beamSize}%`} delayMin={beamDelayMin} delayMax={beamDelayMax} duration={beamDuration} />
          ))}
        </div>
        {/* right */}
        <div
          className={cn(
            "absolute right-0 top-0 [container-type:inline-size] [height:100cqmax] [width:100cqh] [transform-origin:100%_0%] [transform-style:preserve-3d] [transform:rotate(-90deg)_rotateX(-90deg)] [background-size:var(--beam-size)_var(--beam-size)]",
            gridBg
          )}
        >
          {rightBeams.map((beam, index) => (
            <Beam key={`right-${index}`} width={`${beamSize}%`} x={`${beam.x * beamSize}%`} delayMin={beamDelayMin} delayMax={beamDelayMax} duration={beamDuration} />
          ))}
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
