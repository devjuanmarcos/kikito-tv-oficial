import type React from "react";

export type SquishPricingIntent = "primary" | "secondary" | "violet" | "rose" | "info";

/** Cada shape e um SVG diferente que reage ao hover do card. */
export type SquishPricingShape = "orbit" | "domino" | "hive";

export interface SquishPricingCardProps {
  /** Nome do tier (ex: "Individual", "Company"). */
  label: string;
  /** Valor numerico do preco, sem simbolo de moeda (ex: "299", "4,999"). */
  price: string;
  /** Sufixo apos o preco. @default "Month" */
  period?: string;
  description?: string;
  /** Texto do botao de call-to-action. */
  cta: string;
  onCtaClick?: () => void;
  /** Cor solida do card. @default "primary" */
  intent?: SquishPricingIntent;
  /** Forma animada de fundo revelada no hover. @default "orbit" */
  shape?: SquishPricingShape;
  className?: string;
  style?: React.CSSProperties;
}
