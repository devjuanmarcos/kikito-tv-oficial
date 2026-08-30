"use client";
/**
 * SquishPricingCard — pricing tier spotlight card com fundo animado (elastico,
 * "squishy") revelado no hover. Adaptado de um card do shadcndashboard
 * (biblioteca vendorizada local, ver docs/component-import/animation-backport/PLAN.md)
 * pro vocabulario de tokens/motion da Kikito CN: cores solidas raw (indigo-500,
 * purple-500, pink-500) viraram intents semanticos (violet/rose/info/primary/secondary),
 * numeros magicos de transition viraram `transitionSquish` (@/lib/motion), e a escala
 * tipografica/spacing arbitraria virou os tokens correspondentes mais proximos.
 *
 * Diferente do `PricingCard` existente (tabela comparativa com lista de features) --
 * este e um card de destaque unico (marketing/landing), sem lista, preco grande e
 * fundo ilustrativo. Casos de uso distintos o suficiente pra nao forcar no mesmo
 * componente.
 */
import { motion } from "motion/react";

import { transitionSquish } from "@/lib/motion";
import { cn } from "@/lib/utils";

import type { SquishPricingCardProps, SquishPricingIntent, SquishPricingShape } from "./squish-pricing-card.types";

const INTENT_BG: Record<SquishPricingIntent, string> = {
  primary: "bg-patina",
  secondary: "bg-kinpaku",
  violet: "bg-violet",
  rose: "bg-rose",
  info: "bg-info",
};

const INTENT_FG: Record<SquishPricingIntent, string> = {
  primary: "text-patina-fg",
  secondary: "text-kinpaku-fg",
  violet: "text-violet-fg",
  rose: "text-rose-fg",
  info: "text-info-fg",
};

/* Overlay das formas de fundo: precisa ser um "glare" escuro/claro independente do
 * intent (mesmo efeito de sombra/luz por cima de qualquer cor solida), nao um token de
 * cor -- exceção documentada (CLAUDE.md §Cores, "glare que precisa ser literal"). */
const SHAPE_OVERLAY = "rgba(0, 0, 0, 0.2)";
const SHAPE_OVERLAY_DARK_CLASS = "dark:fill-white/10";

function OrbitShape() {
  return (
    <motion.svg
      viewBox="0 0 320 384"
      fill="none"
      aria-hidden="true"
      variants={{ hover: { scale: 1.5 } }}
      transition={transitionSquish}
      className="absolute inset-0 z-0 h-full w-full"
    >
      <motion.circle
        variants={{ hover: { scaleY: 0.5, y: -25 } }}
        transition={{ ...transitionSquish, delay: 0.2 }}
        cx="160.5"
        cy="114.5"
        r="101.5"
        fill={SHAPE_OVERLAY}
        className={SHAPE_OVERLAY_DARK_CLASS}
      />
      <motion.ellipse
        variants={{ hover: { scaleY: 2.25, y: -25 } }}
        transition={{ ...transitionSquish, delay: 0.2 }}
        cx="160.5"
        cy="265.5"
        rx="101.5"
        ry="43.5"
        fill={SHAPE_OVERLAY}
        className={SHAPE_OVERLAY_DARK_CLASS}
      />
    </motion.svg>
  );
}

function DominoShape() {
  return (
    <motion.svg
      viewBox="0 0 320 384"
      fill="none"
      aria-hidden="true"
      variants={{ hover: { scale: 1.05 } }}
      transition={transitionSquish}
      className="absolute inset-0 z-0 h-full w-full"
    >
      <motion.rect
        x="14"
        width="153"
        height="153"
        rx="15"
        fill={SHAPE_OVERLAY}
        className={SHAPE_OVERLAY_DARK_CLASS}
        variants={{ hover: { y: 219, rotate: "90deg", scaleX: 2 } }}
        style={{ y: 12 }}
        transition={{ ...transitionSquish, delay: 0.2 }}
      />
      <motion.rect
        x="155"
        width="153"
        height="153"
        rx="15"
        fill={SHAPE_OVERLAY}
        className={SHAPE_OVERLAY_DARK_CLASS}
        variants={{ hover: { y: 12, rotate: "90deg", scaleX: 2 } }}
        style={{ y: 219 }}
        transition={{ ...transitionSquish, delay: 0.2 }}
      />
    </motion.svg>
  );
}

function HiveShape() {
  const hexagons = [
    "M148.893 157.531C154.751 151.673 164.249 151.673 170.107 157.531L267.393 254.818C273.251 260.676 273.251 270.173 267.393 276.031L218.75 324.674C186.027 357.397 132.973 357.397 100.25 324.674L51.6068 276.031C45.7489 270.173 45.7489 260.676 51.6068 254.818L148.893 157.531Z",
    "M148.893 99.069C154.751 93.2111 164.249 93.2111 170.107 99.069L267.393 196.356C273.251 202.213 273.251 211.711 267.393 217.569L218.75 266.212C186.027 298.935 132.973 298.935 100.25 266.212L51.6068 217.569C45.7489 211.711 45.7489 202.213 51.6068 196.356L148.893 99.069Z",
    "M148.893 40.6066C154.751 34.7487 164.249 34.7487 170.107 40.6066L267.393 137.893C273.251 143.751 273.251 153.249 267.393 159.106L218.75 207.75C186.027 240.473 132.973 240.473 100.25 207.75L51.6068 159.106C45.7489 153.249 45.7489 143.751 51.6068 137.893L148.893 40.6066Z",
  ];
  return (
    <motion.svg
      viewBox="0 0 320 384"
      fill="none"
      aria-hidden="true"
      variants={{ hover: { scale: 1.25 } }}
      transition={transitionSquish}
      className="absolute inset-0 z-0 h-full w-full"
    >
      {hexagons.map((d, i) => (
        <motion.path
          key={d.slice(0, 12)}
          variants={{ hover: { y: -50 } }}
          transition={{ ...transitionSquish, delay: 0.3 - i * 0.1 }}
          d={d}
          fill={SHAPE_OVERLAY}
          className={SHAPE_OVERLAY_DARK_CLASS}
        />
      ))}
    </motion.svg>
  );
}

const SHAPES: Record<SquishPricingShape, React.ComponentType> = {
  orbit: OrbitShape,
  domino: DominoShape,
  hive: HiveShape,
};

export function SquishPricingCard({
  label,
  price,
  period = "Month",
  description,
  cta,
  onCtaClick,
  intent = "primary",
  shape = "orbit",
  className,
  style,
}: SquishPricingCardProps) {
  const Shape = SHAPES[shape];
  const fg = INTENT_FG[intent];

  return (
    <motion.div
      whileHover="hover"
      variants={{ hover: { scale: 1.05 } }}
      transition={transitionSquish}
      className={cn(
        "relative h-96 w-80 shrink-0 overflow-hidden rounded-(--radius-lg) p-(--spacing-2xl) shadow-lg transition-shadow hover:shadow-xl",
        INTENT_BG[intent],
        className
      )}
      style={style}
    >
      <div className={cn("relative z-10 flex h-full flex-col", fg)}>
        <span
          className={cn(
            "mb-(--spacing-md) block w-fit rounded-pill border px-(--spacing-md) py-(--spacing-3xs) text-body-callout font-medium backdrop-blur-sm",
            fg,
            "border-current/20 bg-current/20"
          )}
        >
          {label}
        </span>
        <motion.span
          initial={{ scale: 0.85 }}
          variants={{ hover: { scale: 1 } }}
          transition={transitionSquish}
          className="my-(--spacing-2xs) block origin-top-left font-mono text-display-02 font-black leading-[1.2]"
        >
          ${price}
          <br />
          {period}
        </motion.span>
        {description && <p className="text-body-paragraph opacity-90">{description}</p>}
      </div>
      {/* outline por padrao (nao o "branco solido -> inverte no hover" da origem --
          fg do intent ja e quase-branco em qualquer tema, texto escuro fixo sobre ele
          exigiria um token que nao existe; outline elimina o problema sem perder legibilidade) */}
      <button
        type="button"
        onClick={onCtaClick}
        className={cn(
          "absolute inset-x-(--spacing-lg) bottom-(--spacing-lg) z-20 rounded-(--radius-md) border-(length:--border-width-base) border-current bg-current/10 py-(--spacing-sm) text-center font-mono font-black uppercase backdrop-blur-sm transition-colors duration-150 hover:bg-current/25",
          fg
        )}
      >
        {cta}
      </button>
      <Shape />
    </motion.div>
  );
}
