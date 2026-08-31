"use client";
/**
 * Dock — dock de apps estilo macOS com magnificação cosseno por proximidade
 * do cursor (algoritmo real do macOS: escala segue uma curva de cosseno
 * suavizada dentro de uma janela de efeito ao redor do mouse, não um simples
 * "hover = maior"). Adaptado de um componente shadcndashboard/vanilla-React
 * (ver docs/component-import/animation-backport/PLAN.md pro precedente de uso
 * dessa biblioteca vendorizada como base de código externo).
 *
 * O que foi adaptado pro vocabulário Kikito CN:
 * - Cores rgba/hex cruas (fundo, borda, sombra, dot indicador) -> tokens
 *   (bg-float, border-rule, --ks-patina, sombra literal já usada em
 *   DropdownMenu/SplitButton).
 * - `icon: string` (URL de imagem) -> `icon: React.ReactNode` — mais flexível,
 *   consumidor decide se é <img>, <svg> ou emoji, sem hardcode de <img>.
 * - Tooltip nativo (`title=`) -> componente <Tooltip> CN, reaproveitado em vez
 *   de reinventar.
 * - Dependência de `gsap` (só usada se `window.gsap` existisse, nem era
 *   dependência real do projeto) removida -- bounce de clique agora usa
 *   `motion` (springSnappy, já existente, mesmo "feel" rápido/elástico que o
 *   gsap.to(..., ease:'power2.out') tentava simular).
 *
 * O que foi MANTIDO fiel à origem, de propósito:
 * - O algoritmo de magnificação por cosseno inteiro (calculateTargetMagnification)
 *   e o loop de interpolação via requestAnimationFrame (animateToTarget) --
 *   é rastreamento de posição do mouse em tempo real, a mesma categoria de
 *   efeito do glow/tilt do Card.tsx ou do drag do SwipeCard. `motion` não é a
 *   ferramenta certa pra isso (não dá pra "springar" pra uma posição que muda
 *   a cada frame do mousemove com a suavidade certa sem reimplementar o
 *   próprio lerp manual) -- ver regra 4 da skill /import-component.
 * - Configuração responsiva por breakpoint (getResponsiveConfig).
 */
import { motion } from "motion/react";
import { useState, useRef, useCallback, useEffect } from "react";

import { Tooltip } from "@/components/ui/cn/tooltip";
import { springSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";

import type { DockApp, DockProps } from "./dock.types";

function getResponsiveConfig() {
  if (typeof window === "undefined") {
    return { baseIconSize: 64, maxScale: 1.6, effectWidth: 240 };
  }
  const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
  if (smallerDimension < 480) {
    return { baseIconSize: Math.max(40, smallerDimension * 0.08), maxScale: 1.4, effectWidth: smallerDimension * 0.4 };
  } else if (smallerDimension < 768) {
    return {
      baseIconSize: Math.max(48, smallerDimension * 0.07),
      maxScale: 1.5,
      effectWidth: smallerDimension * 0.35,
    };
  } else if (smallerDimension < 1024) {
    return { baseIconSize: Math.max(56, smallerDimension * 0.06), maxScale: 1.6, effectWidth: smallerDimension * 0.3 };
  }
  return { baseIconSize: Math.max(64, Math.min(80, smallerDimension * 0.05)), maxScale: 1.8, effectWidth: 300 };
}

function DockIcon({
  app,
  isOpen,
  scale,
  position,
  baseIconSize,
  onClick,
}: {
  app: DockApp;
  isOpen: boolean;
  scale: number;
  position: number;
  baseIconSize: number;
  onClick: () => void;
}) {
  const scaledSize = baseIconSize * scale;
  const [bounceKey, setBounceKey] = useState(0);

  function handleClick() {
    setBounceKey((k) => k + 1);
    onClick();
  }

  return (
    <Tooltip content={app.name} placement="top">
      <div
        role="button"
        tabIndex={0}
        aria-label={app.name}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        className="absolute bottom-0 flex cursor-pointer flex-col items-center justify-end"
        style={{
          left: `${position - scaledSize / 2}px`,
          width: `${scaledSize}px`,
          height: `${scaledSize}px`,
          transformOrigin: "bottom center",
          zIndex: Math.round(scale * 10),
        }}
      >
        <motion.div
          key={bounceKey}
          className="h-full w-full [&>svg]:h-full [&>svg]:w-full [&>img]:h-full [&>img]:w-full [&>img]:object-contain"
          animate={bounceKey > 0 ? { y: [0, -baseIconSize * (scale > 1.3 ? 0.2 : 0.15), 0] } : undefined}
          transition={springSnappy}
          style={{
            filter: `drop-shadow(0 ${scale > 1.2 ? 2 : 1}px ${scale > 1.2 ? 4 : 2}px oklch(0% 0 0 / ${0.2 + (scale - 1) * 0.15}))`,
          }}
        >
          {app.icon}
        </motion.div>

        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute rounded-full bg-patina"
            style={{
              bottom: `${Math.max(-2, -baseIconSize * 0.05)}px`,
              width: `${Math.max(3, baseIconSize * 0.06)}px`,
              height: `${Math.max(3, baseIconSize * 0.06)}px`,
              boxShadow: "0 0 4px oklch(0% 0 0 / 0.3)",
            }}
          />
        )}
      </div>
    </Tooltip>
  );
}

export function Dock({ apps, openApps = [], onAppClick, className, style }: DockProps) {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [currentScales, setCurrentScales] = useState<number[]>(() => apps.map(() => 1));
  const [currentPositions, setCurrentPositions] = useState<number[]>([]);
  const dockRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMouseMoveTime = useRef(0);

  const [config, setConfig] = useState(getResponsiveConfig);
  const { baseIconSize, maxScale, effectWidth } = config;
  const minScale = 1.0;
  const baseSpacing = Math.max(4, baseIconSize * 0.08);

  useEffect(() => {
    const handleResize = () => setConfig(getResponsiveConfig());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Algoritmo real do macOS: escala segue uma curva de cosseno (nao linear)
  // dentro de uma janela de `effectWidth` centrada no mouse.
  const calculateTargetMagnification = useCallback(
    (mousePosition: number | null) => {
      if (mousePosition === null) return apps.map(() => minScale);
      return apps.map((_, index) => {
        const normalIconCenter = index * (baseIconSize + baseSpacing) + baseIconSize / 2;
        const minX = mousePosition - effectWidth / 2;
        const maxX = mousePosition + effectWidth / 2;
        if (normalIconCenter < minX || normalIconCenter > maxX) return minScale;
        const theta = ((normalIconCenter - minX) / effectWidth) * 2 * Math.PI;
        const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
        const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;
        return minScale + scaleFactor * (maxScale - minScale);
      });
    },
    [apps, baseIconSize, baseSpacing, effectWidth, maxScale]
  );

  const calculatePositions = useCallback(
    (scales: number[]) => {
      let currentXPos = 0;
      return scales.map((scale) => {
        const scaledWidth = baseIconSize * scale;
        const centerX = currentXPos + scaledWidth / 2;
        currentXPos += scaledWidth + baseSpacing;
        return centerX;
      });
    },
    [baseIconSize, baseSpacing]
  );

  useEffect(() => {
    const initialScales = apps.map(() => minScale);
    setCurrentScales(initialScales);
    setCurrentPositions(calculatePositions(initialScales));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apps, config]);

  useEffect(() => {
    function tick() {
      const targetScales = calculateTargetMagnification(mouseX);
      const targetPositions = calculatePositions(targetScales);
      const lerpFactor = mouseX !== null ? 0.2 : 0.12;

      let stillMoving = false;
      setCurrentScales((prev) =>
        prev.map((s, i) => {
          const next = s + (targetScales[i] - s) * lerpFactor;
          if (Math.abs(targetScales[i] - next) > 0.002) stillMoving = true;
          return next;
        })
      );
      setCurrentPositions((prev) =>
        prev.map((p, i) => {
          const next = p + (targetPositions[i] - p) * lerpFactor;
          if (Math.abs(targetPositions[i] - next) > 0.1) stillMoving = true;
          return next;
        })
      );

      if (stillMoving || mouseX !== null) {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    }
    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseX, calculateTargetMagnification, calculatePositions]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseMoveTime.current < 16) return;
      lastMouseMoveTime.current = now;
      if (dockRef.current) {
        const rect = dockRef.current.getBoundingClientRect();
        const padding = Math.max(8, baseIconSize * 0.12);
        setMouseX(e.clientX - rect.left - padding);
      }
    },
    [baseIconSize]
  );

  const contentWidth =
    currentPositions.length > 0
      ? Math.max(...currentPositions.map((pos, i) => pos + (baseIconSize * currentScales[i]) / 2))
      : apps.length * (baseIconSize + baseSpacing) - baseSpacing;
  const padding = Math.max(8, baseIconSize * 0.12);
  // Raio dinâmico proporcional ao tamanho do icone (igual ao padding-left calculado do
  // VerticalNav) -- calculo continuo ligado ao tamanho responsivo, nao valor arbitrario
  // estatico, por isso fica fora da escala fixa de --radius-*.
  const dockRadius = Math.max(12, baseIconSize * 0.4);

  return (
    <div
      ref={dockRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouseX(null)}
      style={{ width: `${contentWidth + padding * 2}px`, borderRadius: `${dockRadius}px`, padding: `${padding}px`, ...style }}
      className={cn(
        "border-(length:--border-width-hairline) border-rule bg-float/90 backdrop-blur-md",
        "shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.4),0_0_0_1px_oklch(0%_0_0/0.06)]",
        className
      )}
    >
      <div className="relative" style={{ height: `${baseIconSize}px`, width: "100%" }}>
        {apps.map((app, index) => (
          <DockIcon
            key={app.id}
            app={app}
            isOpen={openApps.includes(app.id)}
            scale={currentScales[index] ?? 1}
            position={currentPositions[index] ?? 0}
            baseIconSize={baseIconSize}
            onClick={() => onAppClick?.(app.id)}
          />
        ))}
      </div>
    </div>
  );
}
