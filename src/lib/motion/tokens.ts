/**
 * Kikito CN — tokens de animação (camada 2, espelha `--ks-motion-*` em
 * `src/styles/kikitocn-tokens.css`). Fonte única de duração/easing/spring
 * pra qualquer componente que use `motion` — nunca número mágico solto.
 *
 * Valores ancorados em uso real, não inventados (ver
 * docs/component-import/motion-infrastructure/PLAN.md): 150ms/200ms/80ms
 * são os 3 valores de duração mais frequentes já em produção em
 * src/components/ui/cn/**, e os springs `gentle`/`snappy` foram colhidos
 * de `Modal.tsx`/`Select.tsx`, que já usavam esses dois presets ad-hoc
 * antes deste sistema existir.
 */

/** Segundos — prop `duration` do `motion` espera número em segundos, não string CSS. */
export const MOTION_DURATION = {
  instant: 0.08,
  fast: 0.15,
  standard: 0.2,
  slow: 0.3,
  slower: 0.5,
} as const;

export const MOTION_EASE = {
  standard: [0.22, 1, 0.36, 1],
  decelerate: [0, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1],
  // named easing nativo do motion (nao um cubic-bezier) -- overshoot elastico (passa do
  // alvo e volta), usado pra hovers "squishy"/com bounce. Adicionado pro SquishPricingCard
  // (2026-08-30), primeiro consumidor real; CLAUDE.md regra 1: nao inventar sem uso real.
  squish: "backInOut",
} as const;

/** Pixels — distância de deslocamento em variantes de entrada/saída (slide-in/slide-up). */
export const MOTION_DISTANCE = { sm: 8, md: 16, lg: 24 } as const;

export const MOTION_SPRING = {
  gentle: { stiffness: 150, damping: 25 }, // Modal — elementos maiores/mais pesados
  snappy: { stiffness: 350, damping: 25 }, // Select — elementos menores/mais rápidos
} as const;
