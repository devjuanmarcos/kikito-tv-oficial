# Infra de animação — pré-requisito antes de portar qualquer componente

Isto precisa ser resolvido **antes** do primeiro item de `../animation-backport/PLAN.md`, porque toda porta subsequente vai depender dessas decisões pra não reinventar padrão a cada componente.

## 1. Dependência

Instalar `motion` (não `framer-motion` — decisão tomada, ver `../00-INVENTORY.md`). Componentes que usarem `motion` declaram no `peerDeps` do registry (`cn-registry.tsx`), mesmo padrão já usado pra `@/lib/utils`.

```bash
npm install motion
```

## 2. Tokens de easing/duração no token bridge

O template de origem tinha isto em `shadcn-dashboard-library/tokens.ts`:

```ts
motion: {
  fast: 'duration-150',
  standard: 'duration-300',
  slow: 'duration-700',
  easing: 'ease-out',
},
```

Pra Kikito CN, a mesma ideia vira tokens `--ks-motion-*` em `src/styles/kikitocn-tokens.css` (mesma convenção de `--ks-radius-*`/`--ks-spacing-*`), consumidos tanto por classes Tailwind (`transition-*`) quanto por props do `motion` (duração em segundos, não string CSS):

```css
--ks-motion-fast: 150ms;
--ks-motion-standard: 300ms;
--ks-motion-slow: 700ms;
--ks-motion-easing: cubic-bezier(
  0.22,
  1,
  0.36,
  1
); /* mesma curva já usada em vários componentes CN (ver Stepper/AccordionGroup) */
```

E um pequeno helper TS com os mesmos valores em segundos, pra passar direto nas props do `motion` sem repetir número mágico em cada componente:

```ts
// src/lib/motion-presets.ts (novo arquivo)
export const MOTION_DURATION = { fast: 0.15, standard: 0.3, slow: 0.7 } as const;
export const MOTION_EASING = [0.22, 1, 0.36, 1] as const; // mesma curva do --ks-motion-easing
```

## 3. `prefers-reduced-motion` — achado importante, não é automático

A auditoria da Kikito CN (ver `docs/AUDITORIA-CN-STATUS.md`, pendência 4) já resolveu reduced-motion **globalmente para CSS** — um reset em `kikitocn-tokens.css` zera `animation-duration`/`transition-duration` de qualquer `@keyframes`/`transition` Tailwind.

**Isso não cobre `motion`.** A lib anima via WAAPI/JS, escrevendo transform/opacity direto no elemento — não passa pelas propriedades CSS que o reset intercepta. Se um componente portado usar `motion` sem tratamento, ele ignora a preferência de acessibilidade do usuário mesmo com o reset global já existente.

**Duas opções, escolher uma como padrão do projeto antes do primeiro port:**

1. **`useReducedMotion()` por componente** — hook do próprio `motion`, cada componente checa e reduz/pula a animação condicionalmente. Mais controle por componente, mais código repetido.
2. **`<MotionConfig reducedMotion="user">` global** — um único wrapper (candidato: `ThemeProvider` em `src/app/[locale]/layout.tsx`, já envolve a árvore inteira) faz o `motion` inteiro respeitar a preferência do SO automaticamente, sem cada componente precisar lembrar. **Recomendado** — mesma filosofia do reset CSS global já escolhido pra pendência 4 (rede de segurança automática, não depende de disciplina componente a componente).

## 4. Convenção de import

Sempre `import { motion, AnimatePresence } from "motion/react"` (é o caminho do pacote `motion`, não `"motion"` puro nem `"framer-motion"`) — conferir contra a doc oficial do pacote antes do primeiro componente, a superfície mudou entre major versions.

## 5. Checklist pra cada componente portado (usar em `animation-backport/PLAN.md`)

- [ ] Import de `motion`/`AnimatePresence` de `motion/react`.
- [ ] Duração/easing vêm de `MOTION_DURATION`/`MOTION_EASING` (item 2), nunca número mágico solto igual ao arquivo de origem.
- [ ] Cor/token trocado pro vocabulário Kikito CN (nunca `bg-primary`/`text-muted-foreground` do shadcn cru — ver CLAUDE.md).
- [ ] Reduced-motion coberto pela decisão do item 3 (confirmar que o wrapper global já resolve, ou adicionar o hook se o componente tiver uma animação que o `MotionConfig` global não alcança, ex. gesto de drag).
- [ ] `peerDeps: ["motion"]` adicionado na entrada do registry.
- [ ] 9 gates completos (mesmo pipeline de sempre) antes de considerar terminado.
