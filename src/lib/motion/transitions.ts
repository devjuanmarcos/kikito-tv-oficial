/**
 * Kikito CN — presets de `Transition` do `motion`, nomeados em vez de
 * `{ duration: 0.2 }` solto repetido em cada componente. Ver ./tokens.ts
 * pra origem dos números.
 */
import type { Transition } from "motion/react";

import { MOTION_DURATION, MOTION_EASE, MOTION_SPRING } from "./tokens";

export const transitionInstant: Transition = { duration: MOTION_DURATION.instant, ease: MOTION_EASE.standard };
export const transitionFast: Transition = { duration: MOTION_DURATION.fast, ease: MOTION_EASE.standard };
export const transitionStandard: Transition = { duration: MOTION_DURATION.standard, ease: MOTION_EASE.standard };
export const transitionSlow: Transition = { duration: MOTION_DURATION.slow, ease: MOTION_EASE.standard };

/** Entrada (decelera até parar) e saída (acelera até sumir) — pra AnimatePresence com curvas assimétricas. */
export const transitionEnter: Transition = { duration: MOTION_DURATION.standard, ease: MOTION_EASE.decelerate };
export const transitionExit: Transition = { duration: MOTION_DURATION.fast, ease: MOTION_EASE.accelerate };

/** Springs — colhidos de Modal.tsx (gentle) e Select.tsx (snappy), ver ./tokens.ts. */
export const springGentle: Transition = { type: "spring", ...MOTION_SPRING.gentle };
export const springSnappy: Transition = { type: "spring", ...MOTION_SPRING.snappy };

/** Hover elastico ("squish") — usa `slower` (teto da escala) em vez do 1s da origem
 * (SquishPricingCard, adaptado de shadcndashboard) pra nao introduzir um degrau novo
 * de duracao so pra um componente. */
export const transitionSquish: Transition = { duration: MOTION_DURATION.slower, ease: MOTION_EASE.squish };
