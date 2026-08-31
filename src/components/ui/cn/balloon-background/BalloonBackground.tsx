"use client";
/**
 * BalloonBackground — balões subindo com física de barbante (spring) que
 * estouram (partículas) ao encostar no cursor. Adaptado de um exemplo
 * canvas puro (ver docs/component-import/animation-backport/PLAN.md pro
 * precedente de uso da biblioteca vendorizada shadcndashboard como base).
 *
 * Mesma categoria dos outros 2 componentes do grupo "Backgrounds":
 * deliberadamente escuro independente do tema — é o próprio efeito visual.
 *
 * Adaptado pro vocabulário Kikito CN:
 * - `fixed inset-0` (sempre viewport inteira, mousemove em `window`) ->
 *   container-relativo (como `ParticleField`, `ResizeObserver` +
 *   coordenadas relativas ao próprio elemento) — reusável embutido em
 *   qualquer lugar, não só tela cheia.
 * - Paleta de 7 cores hex crua mantida como está, exposta via prop `colors`
 *   com esse default — canvas 2D `fillStyle`/gradient não aceita CSS var,
 *   mesma limitação técnica já documentada em `ParticleField`/
 *   `ConfettiButton` (Button.tsx). Também é uma paleta deliberadamente
 *   variada (balões coloridos), não uma cor de intent única.
 * - `bg-zinc-950 bg-[radial-gradient(...)] from-zinc-900...` (Tailwind cru)
 *   -> gradiente radial via style inline com literais near-black (mesma
 *   exceção documentada no `DarkGradientBackground`, componente irmão).
 */
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import type { BalloonBackgroundProps, BalloonColorSet } from "./balloon-background.types";

// canvas 2D fillStyle não aceita CSS var — precisa de string hex literal.
// Paleta deliberadamente variada (balões de festa), não intent único.
const DEFAULT_COLORS: BalloonColorSet[] = [
  { base: "#ff2e63", light: "#ff6b8f", dark: "#9d0b2e" },
  { base: "#00d2ff", light: "#80eaff", dark: "#006a80" },
  { base: "#ffd700", light: "#fff080", dark: "#998100" },
  { base: "#9d50bb", light: "#c089d8", dark: "#4f285e" },
  { base: "#43e97b", light: "#a6f7c1", dark: "#1e6a38" },
  { base: "#ff9a9e", light: "#fecfef", dark: "#cc7a7e" },
  { base: "#00c9ff", light: "#92fe9d", dark: "#00607a" },
];

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  gravity = 0.2;
  opacity = 1;
  color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 12;
    this.speedY = (Math.random() - 0.5) * 12;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.opacity -= 0.025;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Balloon {
  x = 0;
  y = 0;
  r = 0;
  speed = 0;
  angle = 0;
  wobbleSpeed = 0;
  popped = false;
  colorSet: BalloonColorSet;
  tailMidY = 0;
  tailEndY = 0;
  tailVelMid = 0;
  tailVelEnd = 0;
  prevX = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private colors: BalloonColorSet[],
    private onPop: (x: number, y: number, color: string) => void,
    first = true
  ) {
    this.colorSet = colors[0];
    this.init(first);
  }

  init(firstLoad: boolean) {
    this.r = Math.random() * 15 + 30;
    this.x = Math.random() * this.canvas.width;
    this.y = firstLoad ? Math.random() * this.canvas.height : this.canvas.height + this.r + 200;
    this.colorSet = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.speed = Math.random() * 1 + 0.4;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    this.angle = Math.random() * Math.PI * 2;
    this.popped = false;
    this.prevX = this.x;
    this.tailMidY = this.r + 40;
    this.tailEndY = this.r + 120;
    this.tailVelMid = 0;
    this.tailVelEnd = 0;
  }

  drawBalloonPath(ctx: CanvasRenderingContext2D, r: number) {
    ctx.beginPath();
    ctx.moveTo(0, r);
    ctx.bezierCurveTo(-r * 1.2, r * 0.8, -r * 1.3, -r * 1.2, 0, -r * 1.2);
    ctx.bezierCurveTo(r * 1.3, -r * 1.2, r * 1.2, r * 0.8, 0, r);
    ctx.closePath();
  }

  drawString(ctx: CanvasRenderingContext2D) {
    const dx = this.x - this.prevX;
    this.prevX = this.x;
    const stiffness = 0.08;
    const damping = 0.85;
    const gravity = 0.35;

    const midTarget = this.r + 40 + Math.abs(dx) * 8;
    this.tailVelMid += (midTarget - this.tailMidY) * stiffness;
    this.tailVelMid *= damping;
    this.tailMidY += this.tailVelMid;

    const endTarget = this.r + 120 + Math.abs(dx) * 14;
    this.tailVelEnd += (endTarget - this.tailEndY) * stiffness;
    this.tailVelEnd *= damping;
    this.tailVelEnd += gravity;
    this.tailEndY += this.tailVelEnd;

    const sway = Math.sin(this.angle * 1.8) * 6 + dx * 4;

    ctx.beginPath();
    ctx.moveTo(0, this.r + 5);
    ctx.bezierCurveTo(sway, this.tailMidY * 0.5, -sway, this.tailMidY, sway * 0.6, this.tailEndY);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.3;
    ctx.stroke();
  }

  pop() {
    if (this.popped) return;
    this.popped = true;
    this.onPop(this.x, this.y, this.colorSet.base);
    setTimeout(() => this.init(false), 1000 + Math.random() * 1000);
  }

  update(ctx: CanvasRenderingContext2D, mouse: { x: number; y: number }) {
    if (this.popped) return;
    this.y -= this.speed;
    this.angle += this.wobbleSpeed;
    this.x += Math.sin(this.angle * 0.6) * 0.8;

    const dx = this.x - mouse.x;
    const dy = this.y - this.r * 0.2 - mouse.y;
    if (Math.sqrt(dx * dx + dy * dy) < this.r + 10) this.pop();
    if (this.y < -this.r - 200) this.init(false);

    this.draw(ctx);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.sin(this.angle) * 0.06);
    this.drawString(ctx);
    this.drawBalloonPath(ctx, this.r);
    const grad = ctx.createRadialGradient(-this.r * 0.3, -this.r * 0.5, this.r * 0.1, 0, 0, this.r * 1.5);
    grad.addColorStop(0, this.colorSet.light);
    grad.addColorStop(0.4, this.colorSet.base);
    grad.addColorStop(1, this.colorSet.dark);
    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.92;
    ctx.fill();
    ctx.restore();
  }
}

export function BalloonBackground({
  children,
  balloonCount = 30,
  colors = DEFAULT_COLORS,
  width = "100%",
  height = 480,
  className,
  style,
}: BalloonBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let balloons: Balloon[] = [];
    let particles: Particle[] = [];
    const mouse = { x: -2000, y: -2000 };
    let raf: number;

    function spawnBurst(x: number, y: number, color: string) {
      for (let i = 0; i < 20; i++) particles.push(new Particle(x, y, color));
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = wrapper!.offsetWidth;
      const h = wrapper!.offsetHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      balloons = [];
      for (let i = 0; i < balloonCount; i++) {
        balloons.push(new Balloon(canvas!, colors, spawnBurst, true));
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      particles = particles.filter((p) => p.opacity > 0);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx!);
      });
      balloons.forEach((b) => b.update(ctx!, mouse));
      raf = requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = wrapper!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    resize();
    animate();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);
    wrapper.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrapper.removeEventListener("mousemove", onMouseMove);
    };
  }, [balloonCount, colors]);

  return (
    <div
      ref={wrapperRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        width,
        height,
        // gradiente radial near-black -- ver comentario de excecao no topo do
        // arquivo (mesma logica do DarkGradientBackground, componente irmao).
        background: "radial-gradient(circle at center, oklch(20% 0 0) 0%, oklch(8% 0 0) 60%, oklch(0% 0 0) 100%)",
        ...style,
      }}
    >
      {/* animação puramente decorativa — não deve ser exposta a leitores de tela */}
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
