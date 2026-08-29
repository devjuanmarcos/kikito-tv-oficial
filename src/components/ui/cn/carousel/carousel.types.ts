import type React from "react";

export type CarouselOrientation = "horizontal" | "vertical";

export interface CarouselItem {
  id: string;
  content: React.ReactNode;
}

export interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  showDots?: boolean;
  /** Visual do indicador de posição quando `showDots` está ativo. @default "dots" */
  indicator?: "dots" | "counter";
  showArrows?: boolean;
  /** Vertical requires an explicit height on the carousel itself (`className`/`style`) —
   *  a block element never auto-fills its parent's height, only its width. */
  orientation?: CarouselOrientation;
  className?: string;
  style?: React.CSSProperties;
}
