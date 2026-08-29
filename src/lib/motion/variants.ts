/**
 * Kikito CN — vocabulário próprio de variantes de animação (`Variants` do
 * `motion`). Em vez de cada componente inventar seu `initial`/`animate`/
 * `exit`, importa um preset nomeado daqui — é isto que vira "nosso" de
 * verdade, não um detalhe de implementação escondido em cada componente.
 *
 * Se um padrão novo aparecer (ex. ao portar um item de
 * docs/component-import/animation-backport/PLAN.md) e nenhum preset daqui
 * servir, adicionar aqui primeiro, depois consumir — é assim que o
 * vocabulário cresce organizado em vez de fragmentar de novo.
 */
import type { Variants } from "motion/react";

import { MOTION_DISTANCE } from "./tokens";

/** Fade puro — sem deslocamento nem escala. Ex.: backdrop de overlay. */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/** Escala uniforme a partir do centro — menus/dropdowns que "brotam" do trigger (padrão DropdownMenu). */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

/** Escala + desliza a partir de cima — painéis maiores (padrão Modal, distância = --ks-motion-distance-md). */
export const scaleInDown: Variants = {
  initial: { opacity: 0, scale: 0.92, y: -MOTION_DISTANCE.md },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.92, y: -MOTION_DISTANCE.md },
};

/** Escala só no eixo vertical (sem translate) — painéis que "desenrolam" de cima pra baixo (padrão Select). */
export const scaleInVertical: Variants = {
  initial: { opacity: 0, scaleY: 0.9 },
  animate: { opacity: 1, scaleY: 1 },
  exit: { opacity: 0, scaleY: 0.9 },
};

/** Desliza a partir de baixo, sem escala — listas/toasts entrando de baixo pra cima. */
export const slideInUp: Variants = {
  initial: { opacity: 0, y: MOTION_DISTANCE.sm },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: MOTION_DISTANCE.sm },
};
