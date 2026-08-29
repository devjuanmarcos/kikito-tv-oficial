# Backport de animação — 43 arquivos de origem → componentes Kikito CN existentes

Pré-requisito: `../motion-infrastructure/PLAN.md` resolvido primeiro (dependência, tokens, `prefers-reduced-motion`).

Cada linha é um arquivo de origem real que importa `motion`/`framer-motion`. "Feature" vem de grep automático (`AnimatePresence`, `whileHover`, `whileTap`, `layoutId`, `staggerChildren`, `useSpring`) — confirmar lendo o arquivo antes de portar, o grep só aponta onde olhar primeiro. Caminhos relativos a `shadcndashboard/src/components/`.

## `accordion`

| Origem                                                         | Feature                                 | Nota                                                                                                             |
| -------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/accordion/accordion-07.tsx` | (sem flag — checar transição de altura) | Provável `height: auto` animado no expand, alternativa ao `grid-template-rows` CSS que o `AccordionGroup` já usa |

## `animated-list`

| Origem                                                                 | Feature           | Nota                                                                                                              |
| ---------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/animated-list/animated-list-01.tsx` | `AnimatePresence` | Enter/exit de item de lista                                                                                       |
| `shadcn-dashboard-library/variants/animated-list/animated-list-02.tsx` | `AnimatePresence` | Variante 2 do mesmo padrão — comparar as duas antes de escolher                                                   |
| `shadcn-dashboard-library/variants/animated-list/animated-list-03.tsx` | `AnimatePresence` | Variante 3                                                                                                        |
| `animated-components/list-animation.tsx`                               | (sem flag)        | Candidato a stagger simples — já existe `AnimatedList` na Kikito CN, comparar se agrega algo novo antes de portar |

## `table` / `data-grid` / `data-list`

| Origem                                   | Feature           | Nota                                                                                                               |
| ---------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `animated-components/animated-table.tsx` | `staggerChildren` | Linhas da tabela entrando em sequência — decidir se vai pra `Table` base ou fica restrito a um exemplo de showcase |

## `input` / `floating-label-input`

| Origem                                                 | Feature           | Nota                                                                                              |
| ------------------------------------------------------ | ----------------- | ------------------------------------------------------------------------------------------------- |
| `animated-components/animatedinput-placeholder.tsx`    | `AnimatePresence` | Placeholder/label animado — provável candidato ao `floating-label-input` (já existe na Kikito CN) |
| `shadcn-dashboard-library/variants/input/input-19.tsx` | (sem flag)        | Checar o que anima — provável foco/validação                                                      |

## `autocomplete`

| Origem                                                               | Feature    | Nota                                                                                                                                      |
| -------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/autocomplete/autocomplete-03.tsx` | (sem flag) | 4 variantes seguidas sem feature marcante no grep — provável transição simples de abrir/fechar o painel; ler antes de escolher qual porta |
| `shadcn-dashboard-library/variants/autocomplete/autocomplete-04.tsx` | (sem flag) | —                                                                                                                                         |
| `shadcn-dashboard-library/variants/autocomplete/autocomplete-05.tsx` | (sem flag) | —                                                                                                                                         |
| `shadcn-dashboard-library/variants/autocomplete/autocomplete-06.tsx` | (sem flag) | —                                                                                                                                         |

## `avatar`

| Origem                                                   | Feature                  | Nota                                                                      |
| -------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/avatar/avatar-07.tsx` | `whileHover`, `whileTap` | Micro-interação de hover/press — candidato de baixo risco, visual isolado |

## `badge` / `tag` / `status-badge`

| Origem                                                 | Feature    | Nota                                                                   |
| ------------------------------------------------------ | ---------- | ---------------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/badge/badge-07.tsx` | (sem flag) | 3 variantes sem feature marcante — checar se é só transição de entrada |
| `shadcn-dashboard-library/variants/badge/badge-08.tsx` | (sem flag) | —                                                                      |
| `shadcn-dashboard-library/variants/badge/badge-09.tsx` | (sem flag) | —                                                                      |

## `context-menu`

| Origem                                                               | Feature                                     | Nota                              |
| -------------------------------------------------------------------- | ------------------------------------------- | --------------------------------- |
| `shadcn-dashboard-library/variants/context-menu/context-menu-01.tsx` | `AnimatePresence`, `whileHover`             | Abertura do menu + hover de item  |
| `shadcn-dashboard-library/variants/context-menu/context-menu-02.tsx` | `AnimatePresence`, `whileHover`, `whileTap` | Variante com press também animado |

## `file-upload`

| Origem                                                             | Feature                  | Nota                                                                                                                         |
| ------------------------------------------------------------------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `shadcn-dashboard-library/adapted/file-upload/file-upload-01.tsx`  | `layoutId`, `whileHover` | **Já adaptado a tokens shadcn** (`adapted/`) — menor trabalho de tradução de cor, ainda precisa ir pro vocabulário Kikito CN |
| `shadcn-dashboard-library/variants/file-upload/file-upload-01.tsx` | `layoutId`, `whileHover` | Versão não-adaptada do mesmo arquivo — usar a de `adapted/` como referência de tradução                                      |
| `animated-components/file-uploadmotion.tsx`                        | `layoutId`, `whileHover` | Terceira implementação do mesmo conceito — comparar as 3 antes de escolher qual portar                                       |

## `otp-input`

| Origem                                                         | Feature                       | Nota                                                             |
| -------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/input-otp/input-otp-09.tsx` | `AnimatePresence`, `layoutId` | Célula ativa provavelmente com indicador deslizante (`layoutId`) |

## `label`

| Origem                                                 | Feature    | Nota               |
| ------------------------------------------------------ | ---------- | ------------------ |
| `shadcn-dashboard-library/variants/label/label-06.tsx` | (sem flag) | Checar o que anima |

## `pagination`

| Origem                                                           | Feature           | Nota                                                   |
| ---------------------------------------------------------------- | ----------------- | ------------------------------------------------------ |
| `shadcn-dashboard-library/adapted/pagination/pagination-01.tsx`  | `layoutId`        | **Já adaptado** — indicador de página ativa deslizante |
| `shadcn-dashboard-library/variants/pagination/pagination-01.tsx` | `layoutId`        | Versão não-adaptada do mesmo                           |
| `shadcn-dashboard-library/variants/pagination/pagination-02.tsx` | `layoutId`        | Variante alternativa do indicador deslizante           |
| `shadcn-dashboard-library/variants/pagination/pagination-03.tsx` | `AnimatePresence` | Variante com enter/exit em vez de indicador deslizante |

## `progress` / `progress-ring` / `gauge`

| Origem                                                       | Feature           | Nota                                                |
| ------------------------------------------------------------ | ----------------- | --------------------------------------------------- |
| `shadcn-dashboard-library/adapted/progress/progress-04.tsx`  | `AnimatePresence` | **Já adaptado** — provável transição de valor/label |
| `shadcn-dashboard-library/variants/progress/progress-04.tsx` | `AnimatePresence` | Versão não-adaptada                                 |

## `skeleton`

| Origem                                                       | Feature    | Nota                                                                                                                                                           |
| ------------------------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/skeleton/skeleton-03.tsx` | (sem flag) | 3 variantes de shimmer/pulse via `motion` em vez do `@keyframes shimmer` que o token bridge já tem — comparar qualidade visual antes de decidir se vale trocar |
| `shadcn-dashboard-library/variants/skeleton/skeleton-04.tsx` | (sem flag) | —                                                                                                                                                              |
| `shadcn-dashboard-library/variants/skeleton/skeleton-05.tsx` | (sem flag) | —                                                                                                                                                              |

## `toast` (origem chama `sonner`)

| Origem                                                   | Feature           | Nota                 |
| -------------------------------------------------------- | ----------------- | -------------------- |
| `shadcn-dashboard-library/variants/sonner/sonner-06.tsx` | `AnimatePresence` | Enter/exit do toast  |
| `shadcn-dashboard-library/variants/sonner/sonner-07.tsx` | `AnimatePresence` | Variante alternativa |

## `spinner`

| Origem                                                     | Feature    | Nota                                                                                    |
| ---------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/spinner/spinner-07.tsx` | (sem flag) | Checar o que anima — provável rotação/pulso via `motion` em vez de `@keyframes spin-ks` |

## `tabs`

| Origem                                               | Feature                       | Nota                                                                                                      |
| ---------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/tabs/tabs-01.tsx` | `layoutId`                    | Indicador deslizante entre abas — **candidato de alto valor**, padrão clássico e muito pedido visualmente |
| `shadcn-dashboard-library/variants/tabs/tabs-02.tsx` | `AnimatePresence`             | Transição de conteúdo ao trocar de aba                                                                    |
| `shadcn-dashboard-library/variants/tabs/tabs-05.tsx` | `AnimatePresence`, `layoutId` | Combina os dois padrões acima                                                                             |
| `shadcn-dashboard-library/variants/tabs/tabs-06.tsx` | `layoutId`                    | Outra variante do indicador deslizante                                                                    |
| `shadcn-dashboard-library/variants/tabs/tabs-07.tsx` | `AnimatePresence`, `layoutId` | Combinação, variante 2                                                                                    |

**Nota**: a Kikito CN já corrigiu o `focus-visible` do `Tabs` nesta auditoria (ver `AUDITORIA-CN-STATUS.md`) — ao portar o indicador `layoutId`, confirmar que o anel de foco continua visível por cima da animação (`z-index`/ordem de camadas).

## `tooltip`

| Origem                                                     | Feature     | Nota                                                                                                                                                                                                         |
| ---------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `shadcn-dashboard-library/variants/tooltip/tooltip-03.tsx` | `useSpring` | Posição do tooltip com física de mola em vez de `transition-[opacity,transform]` CSS que o `Tooltip` atual usa — mudança de abordagem (JS contínuo vs CSS discreto), avaliar custo/benefício antes de portar |

---

## Prioridade sugerida (não obrigatória — reordenar como preferir)

1. **Tabs** (`layoutId`) — maior impacto visual, padrão bem conhecido, componente já validado na auditoria.
2. **Pagination** (`layoutId`, já tem versão `adapted/`) — menor esforço de tradução de token.
3. **File-upload** (`layoutId`+`whileHover`, já tem versão `adapted/`) — 3 implementações pra comparar, escolher a melhor.
4. **Avatar** (`whileHover`/`whileTap`) — baixo risco, isolado.
5. Resto por ordem de aparição, ou pela ordem que fizer sentido no roadmap do produto.
