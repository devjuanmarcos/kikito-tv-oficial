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

## `avatar` — ✅ modo clicável/selecionável com `whileHover`/`whileTap` portado

| Origem                                                   | Feature                  | Nota                                    |
| -------------------------------------------------------- | ------------------------ | --------------------------------------- |
| `shadcn-dashboard-library/variants/avatar/avatar-07.tsx` | `whileHover`, `whileTap` | ✅ Portado — ver o que foi feito abaixo |

**O que foi feito**: a origem é um `SelectableAvatar` inteiro (avatar+label+badge+seleção, sempre clicável). O `Avatar` da Kikito CN é **puramente decorativo** (`<span>`, sem `onClick`) — colar `whileHover`/`whileTap` incondicionalmente seria uma afordância falsa num elemento não-interativo. Em vez disso, `onClick`/`selected`/`label` viraram props opcionais novas: sem `onClick`, o `Avatar` continua exatamente como antes (`<span>`, zero mudança de comportamento pros usos existentes); com `onClick`, vira `motion.button` com `whileHover={{scale:1.05}}`/`whileTap={{scale:0.95}}` + anel de destaque quando `selected`. Spring reusa `springSnappy` (350/25) de `@/lib/motion` — a origem usa 400/25, visualmente indistinguível, não vale criar um 3º preset só pra bater exato. `e2e/cn/display/avatar.spec.ts` +2 testes (onClick vira `<button>` real com `aria-pressed` correto; sem `onClick` continua sem `role=button`) — 16/16 chromium-desktop + mobile-chrome (rodado com `--workers=1` pra evitar flakiness de contenção de workers em rota fria, já visto antes nesta sessão — não é bug real), incluindo os 5 já existentes (zero regressão).

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

## `file-upload` — ✅ animação de entrada/saída da lista de arquivos portada (adaptada, não `layoutId`)

| Origem                                                             | Feature                  | Nota                                                                                                                                                                                               |
| ------------------------------------------------------------------ | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shadcn-dashboard-library/adapted/file-upload/file-upload-01.tsx`  | `layoutId`, `whileHover` | Não portado como está — depende de `react-dropzone` (dep nova, fora de escopo) e de um efeito "peek/hover" bespoke que não combina com o dropzone simples da Kikito CN. Ver o que foi feito abaixo |
| `shadcn-dashboard-library/variants/file-upload/file-upload-01.tsx` | `layoutId`, `whileHover` | Idem — mesma implementação, mesmo motivo                                                                                                                                                           |
| `animated-components/file-uploadmotion.tsx`                        | `layoutId`, `whileHover` | Idem — terceira cópia do mesmo conceito                                                                                                                                                            |

**O que foi feito (adaptado, não portado literal)**: as 3 origens compartilham `react-dropzone` + um efeito de "peek" no hover do dropzone via `layoutId`/`whileHover`, específico da estrutura deles (card único que se desloca). A Kikito CN já tem seu próprio drag-and-drop sem lib externa e uma lista de arquivos simples — em vez de portar o efeito de peek (exigiria trocar a estrutura toda + nova dependência), a animação real e reusável dali era **linha de arquivo entrando/saindo da lista** (padrão `FileItem`/`motion.p` da origem), aplicado via `AnimatePresence` + preset `slideInUp` de `@/lib/motion`.

**Achado real corrigido de passagem**: a lista usava `key={i}` (índice) — ao remover um arquivo do meio da lista, o `AnimatePresence` animava a linha ERRADA (React reaproveita o nó do índice deslocado em vez de detectar que o item específico saiu, bug clássico de lista com key por índice + animação de saída). Corrigido pra key por conteúdo (`nome-tamanho-data`). `e2e/cn/inputs/file-upload.spec.ts` +1 teste (remove arquivo do meio de 3, não o último — é o caso que expõe o bug) — 12/12 chromium-desktop + mobile-chrome, incluindo os 4 já existentes (zero regressão).

## `otp-input`

| Origem                                                         | Feature                       | Nota                                                             |
| -------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/input-otp/input-otp-09.tsx` | `AnimatePresence`, `layoutId` | Célula ativa provavelmente com indicador deslizante (`layoutId`) |

## `label`

| Origem                                                 | Feature    | Nota               |
| ------------------------------------------------------ | ---------- | ------------------ |
| `shadcn-dashboard-library/variants/label/label-06.tsx` | (sem flag) | Checar o que anima |

## `pagination` — ✅ `layoutId` (versão `adapted/pagination-01`) portado

| Origem                                                           | Feature           | Nota                                                       |
| ---------------------------------------------------------------- | ----------------- | ---------------------------------------------------------- |
| `shadcn-dashboard-library/adapted/pagination/pagination-01.tsx`  | `layoutId`        | ✅ Portado — indicador de página ativa deslizante          |
| `shadcn-dashboard-library/variants/pagination/pagination-01.tsx` | `layoutId`        | Não portado — versão não-adaptada do mesmo, já coberta     |
| `shadcn-dashboard-library/variants/pagination/pagination-02.tsx` | `layoutId`        | Não portado — variante alternativa do indicador deslizante |
| `shadcn-dashboard-library/variants/pagination/pagination-03.tsx` | `AnimatePresence` | Não portado — variante com enter/exit em vez de deslizante |

**O que foi feito**: mesmo padrão já estabelecido no `Tabs` (`layoutId` + `useId()` por instância) — a página ativa em `Pagination.tsx` tinha `bg-patina!`/`text-patina-fg!` estáticos, virou `motion.span` com `layoutId` atrás do número (`-z-10`, igual ao `PillTab`). `hover:brightness-[1.08]` (só no ativo) virou `hover:brightness-110` no botão inteiro em vez de só no fundo — efeito mais uniforme, já que o fundo agora é um elemento separado. Demo do showcase tem 2 instâncias de `<Pagination>` compartilhando o mesmo `page` (estado) mas com `layoutId` independente (`useId`) — testado que não colidem mesmo mostrando a mesma página ativa simultaneamente. `e2e/cn/data/pagination.spec.ts` +2 testes, e um achado de teste corrigido de passagem: `getByRole("button", {name:"Page 1"})` sem `exact` colidia com "Page 10/11/12" (substring) — corrigido nos 2 testes novos e no já existente que mascarava isso com `.first()` — 14/14 chromium-desktop + mobile-chrome.

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

## `tabs` — ✅ `layoutId` (tabs-01) portado

| Origem                                               | Feature                       | Nota                                                                                                   |
| ---------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `shadcn-dashboard-library/variants/tabs/tabs-01.tsx` | `layoutId`                    | ✅ Portado — indicador deslizante nas variantes `line`/`pill` do `Tabs.tsx`, ver detalhe abaixo        |
| `shadcn-dashboard-library/variants/tabs/tabs-02.tsx` | `AnimatePresence`             | Não portado — transição de conteúdo ao trocar de aba, fica pra próxima rodada                          |
| `shadcn-dashboard-library/variants/tabs/tabs-05.tsx` | `AnimatePresence`, `layoutId` | Não portado — combina os dois padrões acima                                                            |
| `shadcn-dashboard-library/variants/tabs/tabs-06.tsx` | `layoutId`                    | Não portado — outra variante do indicador deslizante, comparar com a já portada antes de mexer de novo |
| `shadcn-dashboard-library/variants/tabs/tabs-07.tsx` | `AnimatePresence`, `layoutId` | Não portado — combinação, variante 2                                                                   |

**O que foi feito**: `LineTab`/`PillTab` em `Tabs.tsx` ganharam um `motion.span` com `layoutId` — a origem tinha só uma versão "pill circular" sem foco em acessibilidade; adaptado pras 2 variantes que fazem sentido pra indicador deslizante (`line`: barra embaixo; `pill`: fundo atrás do texto), variantes `card`/`enclosed` não mexidas (visual não pede indicador deslizante). `layoutId` gerado via `useId()` do próprio componente — **achado real, não estava no arquivo de origem** (que só tinha 1 instância na página de demo deles): sem isso, múltiplas `<Tabs>` na mesma página (a própria página de showcase da Kikito CN tem 9) tentariam sincronizar a animação umas com as outras. `focus-visible` conferido: o anel de foco fica no `<button>` externo, fora do `z-index` do indicador — não tem conflito de camada.

`e2e/cn/display/tabs.spec.ts` +2 testes (indicador aparece só na aba ativa da variante `pill`, sem vazar pra outra instância; 4 instâncias simultâneas de `line` — 1 barra cada, sem colisão de `layoutId`) — 16/16 chromium-desktop + mobile-chrome, incluindo os 5 testes já existentes (zero regressão).

## `tooltip`

| Origem                                                     | Feature     | Nota                                                                                                                                                                                                         |
| ---------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `shadcn-dashboard-library/variants/tooltip/tooltip-03.tsx` | `useSpring` | Posição do tooltip com física de mola em vez de `transition-[opacity,transform]` CSS que o `Tooltip` atual usa — mudança de abordagem (JS contínuo vs CSS discreto), avaliar custo/benefício antes de portar |

---

## Prioridade sugerida (não obrigatória — reordenar como preferir)

1. ✅ **Tabs** (`layoutId`) — feito, ver seção `tabs` acima.
2. ✅ **Pagination** (`layoutId`) — feito, ver seção `pagination` acima.
3. ✅ **File-upload** — feito (adaptado, não `layoutId` literal), ver seção `file-upload` acima.
4. ✅ **Avatar** (`whileHover`/`whileTap`) — feito, ver seção `avatar` acima.
5. Resto por ordem de aparição, ou pela ordem que fizer sentido no roadmap do produto.
