# Infra de animação — pré-requisito antes de portar qualquer componente

Isto precisa ser resolvido **antes** do primeiro item de `../animation-backport/PLAN.md`, porque toda porta subsequente vai depender dessas decisões pra não reinventar padrão a cada componente.

**Decisão do usuário (reforçada)**: isto não é só um helper solto pra destravar o backport — é pra virar um **token de primeira classe do design system Kikito CN**, no mesmo nível de Cores/Tipografia/Radius/Spacing que já existem em `CLAUDE.md`. O objetivo é que animação vire algo **nosso** (vocabulário próprio, não "colado" do shadcn), reusável de forma organizada em qualquer componente futuro — não só nos 43 arquivos do backport.

## 1. Dependência — **correção: já está instalada**

`motion@^12.23.12` e `framer-motion@^11.2.13` já estão no `package.json` daqui (achado ao começar a implementar — a afirmação original neste plano de que nenhum dos dois existia estava errada). Nada a instalar. **3 componentes Kikito CN já usam `motion/react`**: `Modal.tsx`, `DropdownMenu.tsx`, `Select.tsx` — todos com `AnimatePresence` + duração/spring ad-hoc diferente em cada arquivo (é exatamente o problema que este plano resolve). `grep -rl "from ['\"]motion` em `src/` mostra 37 usos de `motion/react` no projeto todo (dashboard + CN) contra 5 de `framer-motion` — confirma `motion/react` como caminho de import dominante, igual já decidido.

Componentes que usarem `motion` declaram `peerDeps: ["motion"]` no registry (`cn-registry.tsx`), mesmo padrão já usado pra `@/lib/utils`.

## 2. Sistema de Animação Kikito CN — 6ª categoria de token

Hoje `CLAUDE.md` documenta 5 categorias de token: Cores, Tipografia, Radius, Spacing (+ Bordas, ainda não iniciado). Animação vira a 6ª, com a mesma estrutura de 3 camadas que Radius/Spacing já usam: **CSS var → classe/prop consumível → documentação em CLAUDE.md**.

### 2.1 Camada 1 — CSS vars no token bridge (`src/styles/kikitocn-tokens.css`)

**Valores ancorados em uso real, não inventados** (mesma metodologia já usada pra migrar spacing — "auditoria de frequência real", ver CLAUDE.md). Frequência de `duration-[Nms]`/`duration-N` em `src/components/ui/cn/**` (bracket + classe nativa do Tailwind somados):

| Valor | Ocorrências | Tier escolhido                                                                 |
| ----: | ----------: | ------------------------------------------------------------------------------ |
| 150ms |          37 | `--ks-motion-fast`                                                             |
| 100ms |          34 | (entre instant e fast — não vira tier próprio, é o "quase-instant" mais comum) |
| 120ms |          32 | (idem — muito próximo de 100/150, não justifica tier extra)                    |
| 200ms |          27 | `--ks-motion-standard`                                                         |
|  80ms |          21 | `--ks-motion-instant`                                                          |
| 300ms |           5 | `--ks-motion-slow`                                                             |
| 500ms |           1 | `--ks-motion-slower` (raro, mas é o teto real já usado)                        |

```css
/* Duração — 3 dos 5 tiers batem EXATO com os valores mais frequentes já em produção (150/200/80) */
--ks-motion-instant: 80ms;
--ks-motion-fast: 150ms;
--ks-motion-standard: 200ms;
--ks-motion-slow: 300ms;
--ks-motion-slower: 500ms;

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

**Springs (`motion` puro, não CSS)** — `Modal.tsx` e `Select.tsx` já têm dois presets de spring reais e diferentes em produção; viram nomeados em vez de número mágico repetido:

| Componente real                         | `stiffness` | `damping` | Nome do preset                                      |
| --------------------------------------- | ----------: | --------: | --------------------------------------------------- |
| `Modal.tsx` (painel)                    |         150 |        25 | `springGentle` — pra elementos maiores/mais pesados |
| `Select.tsx` (dropdown, ×2 ocorrências) |         350 |        25 | `springSnappy` — pra elementos menores/mais rápidos |

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
} as const;

export const MOTION_DISTANCE = { sm: 8, md: 16, lg: 24 } as const;

// harvested de Modal.tsx/Select.tsx, que já usavam esses dois springs ad-hoc antes deste
// sistema existir — nomeados aqui em vez de número mágico repetido em cada componente novo
export const MOTION_SPRING = {
  gentle: { stiffness: 150, damping: 25 }, // Modal — elementos maiores/mais pesados
  snappy: { stiffness: 350, damping: 25 }, // Select — elementos menores/mais rápidos
} as const;
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
import { MOTION_DURATION, MOTION_EASE, MOTION_SPRING } from "./tokens";
import type { Transition } from "motion/react";

export const transitionStandard: Transition = { duration: MOTION_DURATION.standard, ease: MOTION_EASE.standard };
export const transitionFast: Transition = { duration: MOTION_DURATION.fast, ease: MOTION_EASE.standard };
export const springGentle: Transition = { type: "spring", ...MOTION_SPRING.gentle };
export const springSnappy: Transition = { type: "spring", ...MOTION_SPRING.snappy };
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

## 2.4 Primeiro consumidor real: `Modal`/`DropdownMenu`/`Select` — ✅ FEITO

Migrados pra consumir os presets novos (`springGentle`/`transitionStandard`/`scaleInDown`/`scaleIn`/`scaleInVertical`/`fadeIn` em vez do número solto que cada um tinha antes). Comportamento visual idêntico, só a fonte do número mudou — mesma filosofia "componente a componente, não em massa" já estabelecida pra spacing em CLAUDE.md. `peerDeps` dos 3 corrigido pra incluir `@/lib/motion`/`motion` (achado de passagem: nenhum dos 3 tinha isso documentado antes, apesar de já usar `motion` em produção — `dropdown-menu` nem tinha `peerDeps` nenhum). Verificado: `npm run build` limpo, `tsc --noEmit` limpo, `eslint` 0 erros, Playwright (`modal`/`dropdown-menu`/`context-menu`/`floating-menu`/`select`/`multi-select`/`rich-select`/`combobox` specs) verde nos dois projetos. Seção "Animação" já adicionada em `CLAUDE.md` (item 2.3) — consumidor real existe, não é mais hipotético.

## 3. `prefers-reduced-motion` — achado importante, não é automático

A auditoria da Kikito CN (ver `docs/AUDITORIA-CN-STATUS.md`, pendência 4) já resolveu reduced-motion **globalmente para CSS** — um reset em `kikitocn-tokens.css` zera `animation-duration`/`transition-duration` de qualquer `@keyframes`/`transition` Tailwind.

**Isso não cobre `motion`.** A lib anima via WAAPI/JS, escrevendo transform/opacity direto no elemento — não passa pelas propriedades CSS que o reset intercepta. Se um componente portado usar `motion` sem tratamento, ele ignora a preferência de acessibilidade do usuário mesmo com o reset global já existente.

**Duas opções, escolher uma como padrão do projeto antes do primeiro port:**

1. **`useReducedMotion()` por componente** — hook do próprio `motion`, cada componente checa e reduz/pula a animação condicionalmente. Mais controle por componente, mais código repetido.
2. **`<MotionConfig reducedMotion="user">` global** — um único wrapper (candidato: `ThemeProvider` em `src/app/[locale]/layout.tsx`, já envolve a árvore inteira) faz o `motion` inteiro respeitar a preferência do SO automaticamente, sem cada componente precisar lembrar. **Recomendado** — mesma filosofia do reset CSS global já escolhido pra pendência 4 (rede de segurança automática, não depende de disciplina componente a componente).

**Verificar ao implementar**: `reducedMotion="user"` do `motion` reduz automaticamente animações de `layout`/`layoutId` (o padrão usado em `tabs-01.tsx`/`pagination-01.tsx` do backport) pra uma troca instantânea, sem física de mola nem deslizamento — conferir na doc oficial do pacote se isso é 100% automático ou se `layoutId` precisa de tratamento manual adicional, já que é o preset mais usado nos itens de maior prioridade do backport.

## 3.5. ✅ RESOLVIDO (2026-08-29) — `@/lib/motion` (e `@/lib/utils`) agora são empacotados

Era um achado real: `npm run registry:build` detectava `motion` como `dependencies` automaticamente, mas os arquivos de `src/lib/motion/**` não entravam no `files[]` de nenhum componente — `scripts/build-registry.mjs`/`registry-meta.mjs` não tinham conceito de "lib compartilhada" (mesmo problema já existente e nunca resolvido pra `@/lib/utils`). Efeito prático: `npx kikitocn add modal` entregava um `Modal.tsx` cujo `@/lib/motion`/`@/lib/utils` não existiam no projeto de destino — instalação quebrada pra **149 dos 209 componentes** (`@/lib/utils`) e 9 componentes (`@/lib/motion`).

Corrigido — ver levantamento completo, plano e critério de aceite em `docs/design-system-maintenance/registry-shared-libs/PLAN.md`. Resumo: `scripts/build-registry.mjs` ganhou uma `buildLib()` que gera `registry/r/utils.json`/`registry/r/motion.json` (`type: "registry:lib"`) a partir de `src/lib/utils.ts`/`src/lib/motion/**`, e `parseImports()` passou a reconhecer esses dois imports como `registryDependencies`. Achado extra durante a correção: `packages/cli/src/utils/writer.ts` também precisou de ajuste — o mapeamento de path assumia que todo `file.target` começava com `"components/ui/"`, então os novos arquivos `"lib/..."` cairiam no lugar errado (`<componentsDir>/lib/...` em vez de `src/lib/...`) até eu corrigir. Testado end-to-end de verdade (CLI local deste repo contra um projeto de teste, sem publicar nada): `Modal.tsx` instalado com `@/lib/motion` e `@/lib/utils` resolvendo corretamente.

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
