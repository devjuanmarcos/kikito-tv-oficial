# Levantamento — itens 7 e 8 (2026-08-29)

Investigação completa antes de qualquer plano, per pedido explícito. Cobre dois itens independentes que sobraram da rodada de "sanar tudo pro mesmo padrão": (7) gap real no empacotamento do CLI publicado, (8) os 4 candidatos de `new-components/PLAN.md` que ainda dependiam de checar sobreposição/escopo antes de decidir.

---

## Item 7 — `npx kikitocn add` não empacota `@/lib/utils`/`@/lib/motion`

### Escala real do problema (maior do que a nota original sugeria)

- **149 dos 209 componentes** (`grep -rl '@/lib/utils' src/components/ui/cn/`) importam `cn()` de `@/lib/utils`.
- **9 componentes** importam de `@/lib/motion` (Autocomplete, Avatar, DropdownMenu, FileUpload, Menubar, Modal, Pagination, Select, Tabs).
- Ou seja: instalar **qualquer um desses 149** via `npx kikitocn add <nome>` hoje entrega um arquivo que faz `import { cn } from "@/lib/utils"` apontando pra um arquivo que **não existe** no projeto do consumidor, a menos que ele já tenha um `lib/utils.ts` de outra fonte (comum em projetos shadcn, mas não garantido — e nunca garantido pra `@/lib/motion`, que é 100% específico da Kikito CN).

### Causa raiz (confirmada lendo o código, não suposição)

`scripts/build-registry.mjs` escaneia **só** `src/components/ui/cn/**` (`CN_DIR`) — `src/lib/utils.ts` e `src/lib/motion/**` vivem fora dessa árvore e nunca são varridos.

`parseImports()` (mesmo arquivo) classifica cada import em 3 baldes:

1. npm dep conhecido (via `NPM_DEP_MAP` em `scripts/registry-meta.mjs`) — ex. `motion/react` → pacote npm `motion`.
2. dep interno CN (`@/components/ui/cn/<nome>`).
3. import relativo pra um componente-irmão (`../<nome>`).

`@/lib/utils` e `@/lib/motion` não batem em **nenhum** dos 3 padrões — não é um pacote npm, não é `@/components/ui/cn/*`, não é `../*`. O import é **silenciosamente descartado**, nunca vira `dependencies` nem `registryDependencies`. Confirmado gerando o registry: nenhum `registry/r/*.json` lista `utils` ou `motion` como registryDependency, mesmo pros 149/9 arquivos que precisam deles.

### Achado extra: existe um mecanismo morto que quase resolve `utils` (mas não `motion`)

`packages/cli/src/utils/writer.ts` já tem uma função `ensureUtils()` que escreve um `utils.ts` com `cn()` hardcoded se o arquivo não existir no projeto do consumidor. **Mas ela nunca é chamada** — `packages/cli/src/commands/add.ts` não a importa nem invoca em nenhum ponto do fluxo (`resolveComponents` → `writeComponentFiles` → `installPackages`, sem `ensureUtils` no meio). Código morto, e mesmo se fosse religado só cobriria `utils`, não `motion` (que não tem equivalente hardcoded nenhum).

### Achado extra 2: `registry-meta.mjs` e `src/lib/cn-registry.tsx` são duas fontes de metadata que podem divergir

`scripts/registry-meta.mjs` tem seu próprio `COMPONENT_META` (título/grupo/descrição) **separado** do `CN_REGISTRY` real em `src/lib/cn-registry.tsx` (o que a página `/cn/[group]/[component]` de fato lê). Componentes adicionados só em `cn-registry.tsx` (ex.: `item`, `menubar`, adicionados nesta sessão) **não têm entrada em `registry-meta.mjs`** — o build cai no fallback genérico (`toTitleCase(name)`, descrição `"${title} component."`, grupo `"display"` sempre). Confirmado: `registry/r/item.json` e `registry/r/menubar.json` **não** têm a descrição rica que escrevi em `cn-registry.tsx` — têm a genérica. Não é o foco do item 7, mas é o mesmo tipo de "duas fontes de verdade que driftam" — documentado aqui, plano de correção separado (mais simples: ou o build lê direto de `cn-registry.tsx`, ou todo componente novo precisa lembrar de atualizar os dois arquivos).

### Por que a resolução recursiva do CLI já funciona (boa notícia)

`packages/cli/src/utils/resolver.ts` → `resolveComponents()` já resolve `registryDependencies` **recursivamente e de forma agnóstica ao tipo** — ele só chama `fetchComponent(dep, registryBase)` pra cada nome listado em `registryDependencies`, não importa se é um "componente" de verdade ou um "lib" compartilhado. **Isso significa que a correção é 100% do lado do registry (script de build) — o CLI não precisa de nenhuma mudança de código pra reconhecer um novo tipo de item.**

### Conclusão do levantamento

O fix é cirúrgico e de baixo risco: ensinar `parseImports` a reconhecer `@/lib/utils`/`@/lib/motion` como uma nova categoria de dependência ("lib compartilhada"), gerar `registry/r/utils.json` e `registry/r/motion.json` a partir de `src/lib/utils.ts`/`src/lib/motion/**`, e declarar essas duas libs como `registryDependencies` nos componentes que as importam. Plano detalhado em [`registry-shared-libs/PLAN.md`](./registry-shared-libs/PLAN.md).

---

## Item 8 — os 4 candidatos restantes de `new-components/PLAN.md`

Recomendação original (2026-08-29, antes deste levantamento) deixava 3 dos 4 como "avaliar/verificar sobreposição" sem checar de fato. Aqui está a checagem real.

### `input-mask` — na verdade não é candidato a componente novo

Origem tem 3 variantes (`variants/input-mask/input-mask-0{1,2,3}.tsx`), todas formatadores **específicos**, não uma máscara genérica configurável:

- `input-mask-01`: número de cartão de crédito (agrupamento de 4 dígitos)
- `input-mask-02`: validade de cartão (MM/YY)
- `input-mask-03`: endereço MAC

Nenhuma é uma "máscara de padrão arbitrário" (tipo `000.000.000-00` configurável) — são 3 funções de formatação de ~10 linhas cada, aplicadas ao `Input` genérico já existente. Não justificam um componente novo; um usuário implementa isso direto com `Input` + uma função local em minutos. **Recomendação revisada: descartar, não é candidato — mover pra "descartados explicitamente" no `new-components/PLAN.md`.**

### `pie-chart` — candidato real, mas não é o prop trivial que a nota original sugeria

`Chart.tsx` (Super component) despacha pra componentes-irmãos hand-rolled em SVG puro (`DonutChart`, etc.) — **nenhum tipo de gráfico da Kikito CN usa `recharts`** apesar do pacote estar mapeado em `NPM_DEP_MAP` (dependência declarada, zero uso real hoje). `DonutChart.tsx` desenha o anel via `<circle>` com `stroke-dasharray`/`stroke` (técnica de anel vazado) — **não dá pra virar pizza preenchida só tirando o buraco** (`innerRadius=0` é conceito de biblioteca tipo recharts/d3, não existe nessa técnica de stroke). Pizza de verdade precisa de `<path>` com comandos de arco (`M`/`L`/`A`), uma técnica de SVG genuinamente diferente. **Recomendação revisada: é um componente novo de verdade (`PieChart`, mesmo padrão dos irmãos existentes — SVG próprio, sem recharts), não um prop novo em cima do `DonutChart`.** Esforço comparável a qualquer outro tipo de `Chart` (donut/radar/funnel já levaram o mesmo trabalho).

### `radial-chart` — não está coberto, é um gap real (a checagem pedida na nota original)

A origem (`variants/radial-chart/radial-chart-0{1..N}.tsx`) é um **radial bar chart multi-série** (`recharts` `RadialBarChart`+`RadialBar`, 5 categorias como barras radiais concêntricas) — categoricamente diferente de `ProgressRing`/`Gauge` (ambos de **valor único**, sem múltiplas séries). Não está coberto pelo que já existe. **Recomendação revisada: candidato real a `ChartType` novo (`"radial-bar"` ou nome similar), mesmo raciocínio do `pie-chart` — precisa de implementação SVG própria (arcos concêntricos por série) pra manter consistência com o resto do `Chart`, já que a origem usa `recharts` e a Kikito CN não usa recharts em nenhum lugar hoje.**

**Decisão de arquitetura que fica pro usuário**: aceitar `recharts` como dependência nova (só pros tipos `pie`/`radial-bar`, mas via `registryDependencies`/`dependencies` do `Chart.tsx` inteiro, que despacha todos os tipos de um arquivo só — instalar QUALQUER tipo de `Chart` traria `recharts` no bundle a menos que os tipos virem import dinâmico por tipo) **vs.** manter a consistência de 100% SVG hand-rolled pros novos tipos também (mais trabalho, zero dependência nova, sem inconsistência architectural). Ver recomendação no PLAN.md do item.

### `shine-border` — achado extra: usa CSS puro, escapou da varredura de `animation-backport`

Origem é um wrapper `<div>` com uma camada de gradiente cônico rotativo (`animate-spin` do Tailwind + `bg-conic` + `blur-sm`) atrás do conteúdo — **CSS puro, sem `motion`/`framer-motion`**. A varredura original de `animation-backport/PLAN.md` grepava especificamente por imports de `motion`/`framer-motion`, então este arquivo nunca apareceu naquela lista — **achado de passagem, não um erro da varredura anterior, só um limite do critério de busca usado (import de `motion`, não "qualquer coisa animada")**.

Visualmente é **genuinamente distinto** dos 5 efeitos que `Card` já tem (`glass`/`glow`/`tilt`/`spotlight`/`gradient-border`) — nenhum deles tem uma borda **rotativa** (o mais próximo, `gradient-border`, é presumivelmente estático). **Recomendação revisada: candidato real a 6º efeito do `CardEffect` (`shine`), implementável com CSS puro (`@keyframes` + `conic-gradient`, mesmo padrão dos keyframes `-ks` já existentes em `kikitocn-tokens.css`) — sem dependência nova, sem `motion`.**

---

## Resumo executivo

| Item           | Era...                                                 | Virou...                                                                                                             |
| -------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `input-mask`   | "avaliar como componente novo"                         | **Descartar** — não é componente, são 3 formatters de ~10 linhas                                                     |
| `pie-chart`    | "prop novo `type=pie` no Chart, provavelmente trivial" | **Componente novo de verdade** (SVG próprio), mesmo esforço de qualquer outro tipo de Chart                          |
| `radial-chart` | "verificar sobreposição, pode já estar coberto"        | **Gap real, não coberto** — candidato real a novo `ChartType`, decisão de recharts-vs-SVG-próprio em aberto          |
| `shine-border` | "baixa prioridade"                                     | **Candidato real** a 6º efeito do Card, achado extra: é CSS-only (nunca apareceu na varredura de animation-backport) |

Plano detalhado de cada um: [`new-components-remaining/PLAN.md`](./new-components-remaining/PLAN.md).
