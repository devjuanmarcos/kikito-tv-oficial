/**
 * Kikito CN — helpers de orquestração (sequenciar entrada de filhos). Pensado
 * pra portar o padrão `staggerChildren` visto em vários arquivos de
 * docs/component-import/animation-backport/PLAN.md (animated-table,
 * animated-list) sem reescrever a lógica de stagger a cada componente novo.
 */
import type { Variants } from "motion/react";

/**
 * Variants pro elemento PAI de uma lista — cada filho precisa ter sua própria
 * `Variants` de entrada (ex. `fadeIn`/`slideInUp` de ./variants) com
 * `initial`/`animate` compatíveis; o pai só controla o *timing* entre eles.
 */
export function staggerContainer(staggerDelay = 0.05, delayChildren = 0): Variants {
  return {
    initial: {},
    animate: { transition: { staggerChildren: staggerDelay, delayChildren } },
    exit: { transition: { staggerChildren: staggerDelay / 2, staggerDirection: -1 } },
  };
}
