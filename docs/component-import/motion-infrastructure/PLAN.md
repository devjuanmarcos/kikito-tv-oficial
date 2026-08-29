# Infra de animação — pré-requisito antes de portar qualquer componente

Isto precisa ser resolvido **antes** do primeiro item de `../animation-backport/PLAN.md`, porque toda porta subsequente vai depender dessas decisões pra não reinventar padrão a cada componente.

**Decisão do usuário (reforçada)**: isto não é só um helper solto pra destravar o backport — é pra virar um **token de primeira classe do design system Kikito CN**, no mesmo nível de Cores/Tipografia/Radius/Spacing que já existem em `CLAUDE.md`. O objetivo é que animação vire algo **nosso** (vocabulário próprio, não "colado" do shadcn), reusável de forma organizada em qualquer componente futuro — não só nos 43 arquivos do backport.

## 1. Dependência

Instalar `motion` (não `framer-motion` — decisão tomada, ver `../00-INVENTORY.md`). Componentes que usarem `motion` declaram no `peerDeps` do registry (`cn-registry.tsx`), mesmo padrão já usado pra `@/lib/utils`.

```bash
npm install motion
```

## 2. Sistema de Animação Kikito CN — 6ª categoria de token

Hoje `CLAUDE.md` documenta 5 categorias de token: Cores, Tipografia, Radius, Spacing (+ Bordas, ainda não iniciado). Animação vira a 6ª, com a mesma estrutura de 3 camadas que Radius/Spacing já usam: **CSS var → classe/prop consumível → documentação em CLAUDE.md**.

### 2.1 Camada 1 — CSS vars no token bridge (`src/styles/kikitocn-tokens.css`)

Primitivos crus, mesma convenção `--ks-*` já usada por radius/spacing:

```css
/* Duração */
--ks-motion-instant: 100ms;
--ks-motion-fast: 150ms;
--ks-motion-standard: 300ms;
--ks-motion-slow: 500ms;
--ks-motion-slower: 700ms;

/* Easing — cubic-bezier já usado em vários componentes CN (Stepper/AccordionGroup/NavigationMenu),
   promovido a token único em vez de literal repetido arquivo a arquivo */
--ks-motion-ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
--ks-motion-ease-decelerate: cubic-bezier(0, 0, 0.2, 1); /* entrada — objeto desacelera até parar */
--ks-motion-ease-accelerate: cubic-bezier(0.4, 0, 1, 1); /* saída — objeto acelera até sumir */

/* Distância padrão de deslocamento em transições de entrada/saída (slide-in/slide-up) */
--ks-motion-distance-sm: 8px;
--ks-motion-distance-md: 16px;
--ks-motion-distance-lg: 24px;
```

### 2.2 Camada 2 — Presets TS (`src/lib/motion/` — novo subsistema, não um arquivo solto)

Estrutura de arquivos (cresce o suficiente pra merecer pasta própria, não um único `motion-presets.ts`):

```
src/lib/motion/
  tokens.ts      # espelha os --ks-motion-* em segundos/número, pra props do `motion`
  variants.ts    # objetos `Variants` reusáveis (entrance/exit nomeados)
  transitions.ts # presets de transition (tween/spring nomeados)
  orchestration.ts # helpers de stagger/sequência
  index.ts       # barrel export — import único: `import { motionVariants, staggerContainer } from "@/lib/motion"`
```

**`tokens.ts`** — espelha a camada 1 (fonte única: se o valor mudar, muda os dois lugares juntos, igual já é regra pra spacing/radius):

```ts
export const MOTION_DURATION = {
  instant: 0.1,
  fast: 0.15,
  standard: 0.3,
  slow: 0.5,
  slower: 0.7,
} as const;

export const MOTION_EASE = {
  standard: [0.22, 1, 0.36, 1],
  decelerate: [0, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1],
} as const;

export const MOTION_DISTANCE = { sm: 8, md: 16, lg: 24 } as const;
```

**`variants.ts`** — o vocabulário de animação **próprio** do Kikito CN. Em vez de cada componente portado inventar seu `initial`/`animate`/`exit`, ele importa um preset nomeado — é isto que vira "nosso" de verdade, não um detalhe de implementação escondido em cada componente:

```ts
import { MOTION_DISTANCE } from "./tokens";
import type { Variants } from "motion/react";

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: MOTION_DISTANCE.md },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: MOTION_DISTANCE.sm },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const slideInFromRight: Variants = {
  /* ...mesma forma, eixo x */
};
// + slideInFromLeft/Top/Bottom conforme os componentes do backport precisarem
```

**`transitions.ts`** — pareia duração/easing em objetos `Transition` prontos, pros dois estilos de animação que o `motion` suporta (tween determinístico vs spring físico — o `tooltip-03.tsx` do backport usa `useSpring`, por exemplo):

```ts
import { MOTION_DURATION, MOTION_EASE } from "./tokens";
import type { Transition } from "motion/react";

export const transitionStandard: Transition = { duration: MOTION_DURATION.standard, ease: MOTION_EASE.standard };
export const transitionFast: Transition = { duration: MOTION_DURATION.fast, ease: MOTION_EASE.standard };
export const springStandard: Transition = { type: "spring", stiffness: 300, damping: 30 };
```

**`orchestration.ts`** — é aqui que mora a parte de "orquestração" que o usuário pediu: um helper pra sequenciar entrada de filhos (o padrão `staggerChildren` que aparece em `animated-table.tsx`/`animated-list-*` do backport), reusável em qualquer lista futura sem reescrever a lógica de stagger cada vez:

```ts
import type { Variants } from "motion/react";

export function staggerContainer(staggerDelay = 0.05, delayChildren = 0): Variants {
  return {
    animate: { transition: { staggerChildren: staggerDelay, delayChildren } },
  };
}
```

### 2.3 Camada 3 — documentar em `CLAUDE.md` (fazer isto quando implementar de verdade, não antes)

Quando a camada 1+2 acima for implementada e usada em pelo menos um componente real do backport (não antes — `CLAUDE.md` documenta o que existe, não o planejado), adicionar uma seção **"Animação"** em `CLAUDE.md` no mesmo formato de Radius/Spacing: tabela de tokens CSS + tabela dos presets de `variants.ts`/`transitions.ts` + regra de "nunca duração/easing/distância cru fora da escala, documentar exceção com comentário quando genuinamente fora" — mesmo padrão de exceção documentada já usado nas outras 5 categorias.

## 3. `prefers-reduced-motion` — achado importante, não é automático

A auditoria da Kikito CN (ver `docs/AUDITORIA-CN-STATUS.md`, pendência 4) já resolveu reduced-motion **globalmente para CSS** — um reset em `kikitocn-tokens.css` zera `animation-duration`/`transition-duration` de qualquer `@keyframes`/`transition` Tailwind.

**Isso não cobre `motion`.** A lib anima via WAAPI/JS, escrevendo transform/opacity direto no elemento — não passa pelas propriedades CSS que o reset intercepta. Se um componente portado usar `motion` sem tratamento, ele ignora a preferência de acessibilidade do usuário mesmo com o reset global já existente.

**Duas opções, escolher uma como padrão do projeto antes do primeiro port:**

1. **`useReducedMotion()` por componente** — hook do próprio `motion`, cada componente checa e reduz/pula a animação condicionalmente. Mais controle por componente, mais código repetido.
2. **`<MotionConfig reducedMotion="user">` global** — um único wrapper (candidato: `ThemeProvider` em `src/app/[locale]/layout.tsx`, já envolve a árvore inteira) faz o `motion` inteiro respeitar a preferência do SO automaticamente, sem cada componente precisar lembrar. **Recomendado** — mesma filosofia do reset CSS global já escolhido pra pendência 4 (rede de segurança automática, não depende de disciplina componente a componente).

**Verificar ao implementar**: `reducedMotion="user"` do `motion` reduz automaticamente animações de `layout`/`layoutId` (o padrão usado em `tabs-01.tsx`/`pagination-01.tsx` do backport) pra uma troca instantânea, sem física de mola nem deslizamento — conferir na doc oficial do pacote se isso é 100% automático ou se `layoutId` precisa de tratamento manual adicional, já que é o preset mais usado nos itens de maior prioridade do backport.

## 4. Convenção de import

Sempre `import { motion, AnimatePresence } from "motion/react"` (é o caminho do pacote `motion`, não `"motion"` puro nem `"framer-motion"`) — conferir contra a doc oficial do pacote antes do primeiro componente, a superfície mudou entre major versions.

Presets do sistema próprio sempre de `@/lib/motion` (barrel export do item 2.2), nunca duração/easing/variant cru repetido componente a componente — mesmo princípio de "nunca hex cru, sempre token" já aplicado a cor/tipografia/radius/spacing.

## 5. Checklist pra cada componente portado (usar em `animation-backport/PLAN.md`)

- [ ] Import de `motion`/`AnimatePresence` de `motion/react`.
- [ ] Variant/transition vêm de `@/lib/motion` (item 2.2) — nunca objeto de animação solto inventado no componente; se o padrão do arquivo de origem não existir ainda no preset, **adicionar ao preset primeiro** (`variants.ts`/`transitions.ts`), depois consumir — é assim que o vocabulário cresce de forma organizada em vez de fragmentar de novo.
- [ ] Cor/token trocado pro vocabulário Kikito CN (nunca `bg-primary`/`text-muted-foreground` do shadcn cru — ver CLAUDE.md).
- [ ] Reduced-motion coberto pela decisão do item 3 (confirmar que o wrapper global já resolve, ou adicionar o hook se o componente tiver uma animação que o `MotionConfig` global não alcança, ex. gesto de drag).
- [ ] `peerDeps: ["motion"]` adicionado na entrada do registry.
- [ ] 9 gates completos (mesmo pipeline de sempre) antes de considerar terminado.
- [ ] Se este for o primeiro componente do backport a ir pra produção: seção "Animação" adicionada em `CLAUDE.md` (item 2.3 acima).
