# Migração da família `Chart` pra Apache ECharts

Decisão do usuário (2026-08-29): migrar todos os tipos de chart do Kikito CN pra **Apache ECharts**, aceitando a dependência nova pro projeto inteiro. Substitui o modelo atual (8 SVG hand-rolled + 1 `recharts` no `radial-bar-chart`, ver `docs/component-import/variant-intake/`) por uma base única.

**Somente planejamento — nenhum código migrado ainda.**

---

## Escopo

### Dentro do escopo — os 9 membros do `Chart` (super componente, `src/components/ui/cn/chart/`)

| Tipo (`type=`)   | Componente                        | Props hoje                                                                                                                                                                           | Implementação hoje                                                                                                   |
| ---------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `line` (default) | `line-chart/LineChart`            | `series[]`, `labels?`, `height?`, `width?`, `showArea?`, `showDots?`, `showGrid?`, `showLegend?`                                                                                     | SVG hand-rolled                                                                                                      |
| `area`           | `area-chart/AreaChart`            | `data[]` (wide format, `{label, [série]: number}`), `series[]` (`key/label/color`), `height?`, `showGrid?/showDots?/showLegend?/showTooltip?`, `stacked?`, `gradient?`               | SVG hand-rolled                                                                                                      |
| `bar`            | `bar-chart/BarChart`              | `data[]` (`{label,value,color?}`), `height?`, `width?` (só horizontal), `barWidth?`, `gap?`, `showValues?`, `showBaseline?`, `color?`, `animate?`, `orientation?` (recém-adicionado) | SVG hand-rolled                                                                                                      |
| `donut`          | `donut-chart/DonutChart`          | `segments[]`, `size?`, `strokeWidth?`, `showLegend?`, `centerLabel?`, `centerValue?`                                                                                                 | SVG hand-rolled                                                                                                      |
| `pie`            | `pie-chart/PieChart`              | `segments[]`, `size?`, `showLegend?`                                                                                                                                                 | SVG hand-rolled                                                                                                      |
| `radar`          | `radar-chart/RadarChart`          | `axes[]` (`label,max?`), `series[]`, `size?`, `levels?`, `showLegend?`                                                                                                               | SVG hand-rolled                                                                                                      |
| `radial-bar`     | `radial-bar-chart/RadialBarChart` | `segments[]`, `size?`, `showLegend?`, `showTooltip?`                                                                                                                                 | **já usa `recharts`** (única exceção — ver `variant-intake/DECISIONS.md` #1)                                         |
| `funnel`         | `funnel-chart/FunnelChart`        | `stages[]`, `showValues?/showPercent?/showConversion?`, `height?`                                                                                                                    | **HTML/divs**, não SVG (única exceção estrutural — `e2e/cn/charts/chart.spec.ts` já exclui do teste `svg[role=img]`) |
| `sparkline`      | `sparkline/Sparkline`             | `data: number[]`, `type? (line/bar/area)`, `width?/height?`, `color?/intent?`, `strokeWidth?`, `filled?`, `ariaLabel?`                                                               | SVG hand-rolled, minúsculo (uso inline, ex. dentro de tabela)                                                        |

### Fora do escopo (confirmar antes de começar, não presumido)

- **`gauge`** e **`skill-bar`** — vivem no grupo `charts` do registry mas **não são absorvidos pelo `Chart`** (`ChartType` não inclui nem um nem outro). São widgets de valor único (mais parecidos com `Progress` shape=`ring`/`gauge`), categoria diferente de "chart multi-série". Ficam de fora desta migração a menos que o usuário peça explicitamente.
- **`Sparkline` pode não valer a pena** — ver seção própria abaixo, candidato a ficar hand-rolled mesmo depois da migração dos outros 8.

---

## Achados técnicos que mudam o formato da migração (levantados antes de planejar, não presumidos)

### 1. ECharts não é declarativo por padrão — precisa de wrapper próprio

Ao contrário de `recharts` (componentes React nativos), `echarts` é uma lib vanilla JS: `echarts.init(domNode)` numa `<div>`, depois `chart.setOption(option)`. **Decisão de arquitetura**: não usar o wrapper da comunidade `echarts-for-react` (mais uma camada de dependência indireta, pouco controle) — escrever um wrapper fino próprio:

- `src/lib/echarts/EChartsContainer.tsx` — `useRef` numa `<div>`, `echarts.init` no mount, `chart.setOption(option, true)` a cada mudança de `option` (via `useEffect`), `ResizeObserver` chamando `chart.resize()`, `chart.dispose()` no unmount. Cada `*Chart.tsx` vira só uma função que monta o `option` object a partir das props existentes (API pública 100% preservada) e passa pro container.
- Import modular (`echarts/core` + `echarts/charts` + `echarts/components` + `echarts/renderers`, registrando só o necessário por arquivo via `echarts.use([...])`) em vez do pacote `echarts` inteiro — ECharts completo é pesado (~1MB+ minificado); modular reduz bastante. Cada `*Chart.tsx` registra só os módulos que usa (`LineChart`+`GridComponent`+`TooltipComponent` pro line-chart, etc.) — `echarts.use()` é idempotente, sem problema em registrar o mesmo módulo em vários arquivos.

### 2. Cor: tokens `--ks-*` não chegam prontos no `option` do ECharts

O `option` do ECharts é um objeto JS avaliado uma vez (não CSS) — passar `"var(--ks-primary)"` como string funciona pra CSS mas não é resolvido pelo canvas/SVG interno do ECharts do jeito que os hand-rolled SVGs faziam (`fill="var(--ks-primary)"` funciona em SVG real porque é atributo CSS-aware; o `option.color` do ECharts espera hex/rgb concreto, não uma CSS var).

**Necessário**: uma função `resolveKsColor(varName)` que lê `getComputedStyle(document.documentElement).getPropertyValue(varName)` e devolve o valor concreto, chamada ao montar o `option`. Precisa re-rodar quando o tema muda (dark ↔ light) — os valores por trás de `--ks-primary` etc. mudam entre os dois modos.

### 3. Tema dark/light — ECharts precisa de `setOption` novo, não reage sozinho

Como as cores ficam "assadas" no `option` (achado #2), trocar de tema não re-pinta o chart sozinho como acontecia com `var(--ks-*)` em SVG puro. Usar `useTheme()` de `next-themes` (já em uso em `src/providers/ThemeProvider.tsx`) — no `resolvedTheme` mudar, re-montar o `option` com cores recalculadas e chamar `setOption` de novo.

### 4. Animação: ECharts tem o PRÓPRIO sistema de animação — 3ª categoria a integrar com `prefers-reduced-motion`

O projeto já trata isso pra CSS (`@keyframes`/`transition`, reset global em `kikitocn-tokens.css`) e pra `motion` (`<MotionConfig reducedMotion="user">`, `ThemeProvider.tsx`). **ECharts é um terceiro sistema de animação, nenhum dos dois resets cobre.** Achado real, não documentado antes: `EChartsContainer` precisa checar `window.matchMedia("(prefers-reduced-motion: reduce)")` e passar `animation: false` (ou `animationDuration: 0`) no `option` quando ativo — senão a lib anima sozinha ignorando a preferência do usuário. Fica registrado aqui como **pendência de acessibilidade a resolver dentro do wrapper**, não por chart individual.

### 5. Renderer: SVG vs Canvas — decide a estratégia de acessibilidade

ECharts suporta os dois (`renderer: "svg"` ou `"canvas"`, escolhido no `echarts.init`).

|                               | SVG                                                                                                                                                                                               | Canvas                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| DOM inspecionável             | Sim — cada elemento vira nó SVG real                                                                                                                                                              | Não — só um `<canvas>` opaco                                                                                                    |
| a11y                          | Precisa `role="img"`/`aria-label` no wrapper (mesma solução já usada no `radial-bar-chart`/`recharts`)                                                                                            | Mesma solução, mas Playwright não consegue inspecionar path/valores dentro                                                      |
| Testes e2e existentes         | `e2e/cn/charts/chart.spec.ts` já procura `svg[role="img"]` pra 6 dos 9 tipos — **compatível** se o wrapper expõe o `role`/`aria-label` no `<svg>` raiz que o próprio renderer SVG do ECharts gera | Quebra esse padrão pros 6 tipos — precisaria reescrever pra checar a `<div>` wrapper, igual já foi feito pro `radial-bar-chart` |
| Performance em dataset grande | Pior que canvas                                                                                                                                                                                   | Melhor — mas nenhum chart do Kikito CN hoje tem dataset grande (são todos de demo/dashboard, dezenas de pontos no máximo)       |

**Recomendação**: `renderer: "svg"` — mantém o padrão de teste já estabelecido (menos quebra), mantém DOM inspecionável (consistente com a filosofia hand-rolled anterior), e nenhum caso de uso atual precisa da performance extra de canvas. Registrar como decisão a confirmar com o usuário antes da Fase 1 (não presumir).

### 6. `Sparkline` pode não valer a pena migrar

`Sparkline` é deliberadamente minúsculo (uso inline dentro de tabela/card, `width`/`height` tipicamente < 100px) — inicializar uma instância inteira do ECharts (mesmo modular) por sparkline é overhead real (motor de layout, tooltip, resize observer) pra um SVG de ~15 linhas de código hoje. **Candidato a ficar fora da migração** mesmo depois dos outros 8 — decisão de custo/benefício, mesmo espírito do redutor de 8 gates do `variant-intake` (Gate 5: prop/complexidade nova desproporcional ao ganho). Registrar como pergunta explícita antes de tocar em `Sparkline`, não decidir sozinho.

### 7. `radial-bar-chart` sai do `recharts`, `recharts` é removido do projeto

Como os 9 migram pra ECharts (assumindo Sparkline entra também — a confirmar), `recharts` deixa de ter qualquer consumidor real e pode ser removido de `package.json` no final — reverte a exceção registrada em `variant-intake/DECISIONS.md` #1, mas por motivo de consolidação, não de erro.

### 8. Registry / CLI — mudança mecânica de 1 linha, já mapeada

`scripts/registry-meta.mjs` → `NPM_DEP_MAP` ganha `"echarts": "echarts"`. O detector de dependência em `build-registry.mjs` já usa `mod.startsWith(pkg + "/")`, então imports como `echarts/core`, `echarts/charts`, `echarts/renderers` são detectados automaticamente sem lógica nova — só adicionar a entrada no mapa. Depois de migrado, remover a entrada de `recharts` (ou deixar, inofensiva, se algum outro componente futuro vier a usar).

---

## Ordem de migração sugerida (risco crescente)

1. **`radial-bar-chart`** — primeiro, porque já não é hand-rolled (já saiu do "molde SVG puro" uma vez, trocar `recharts`→`echarts` é mais parecido — mesmo formato de dado, `RadialBar`). Prova o wrapper (`EChartsContainer`) funcionando de ponta a ponta com o menor risco de regressão visual (só 1 consumidor).
2. **`donut-chart`** e **`pie-chart`** — mais simples depois do radial (mesma família polar), poucos props.
3. **`bar-chart`** — já teve mudança recente (orientation), bom pra validar que a API nova aceita orientação vertical/horizontal via `option.xAxis`/`yAxis` do ECharts sem quebrar a prop pública.
4. **`radar-chart`** — polar, mapeamento direto pro `radar` do ECharts.
5. **`line-chart`** e **`area-chart`** — mais props (grid/dots/legend/tooltip/stacked/gradient), maior superfície de regressão, migrar depois de validar o wrapper nos casos mais simples.
6. **`funnel-chart`** — sai do HTML/divs pro `funnel` nativo do ECharts; maior mudança estrutural de DOM (era a única exceção não-SVG, teste de a11y específico precisa ser revisto).
7. **`sparkline`** — só se a decisão do item 6 dos achados for "migrar mesmo assim"; senão, fica hand-rolled permanentemente e sai do escopo.

Cada item = 1 commit, mesmo pipeline já estabelecido nesta sessão (implementar → demo no showcase preservando os dados de exemplo já existentes, pra comparação visual direta antes/depois → `eslint`/`tsc --noEmit` → `registry:build` → Playwright, reescrevendo o teste de a11y espec[fico do tipo se o seletor mudar → commit).

## Antes de começar a Fase 1 — decisões que faltam confirmar com o usuário

1. **Renderer**: SVG (recomendado, ver achado #5) ou Canvas?
2. **Sparkline entra ou fica hand-rolled** (achado #6)?
3. **Gauge/skill-bar entram no escopo** ou seguem fora (confirmado fora por padrão, ver seção Escopo)?
4. **Medir bundle size antes/depois** (`next build`, comparar `.next/analyze` ou tamanho de first-load JS da rota `/cn/charts/*`) e reportar — dado que ECharts é a lib mais pesada entre as opções consideradas, vale ter o número real em mãos, não só a expectativa.

## Checklist de verificação por item (mesmo já usado nesta sessão)

- [ ] `option` builder isolado numa função pura (facilita snapshot/teste, evita lógica de tema dentro do JSX)
- [ ] Cores via `resolveKsColor()`, nunca hex cru
- [ ] `prefers-reduced-motion` respeitado (achado #4)
- [ ] Tema dark/light re-renderiza corretamente (achado #3) — testar manualmente alternando
- [ ] `role="img"`/`aria-label` no elemento raiz (achado #5)
- [ ] API pública (props) idêntica à anterior — nenhum consumidor existente quebra
- [ ] `eslint` 0 erros, `tsc --noEmit` limpo
- [ ] `npm run registry:build` sem erro, dependência `echarts` detectada automaticamente
- [ ] `e2e/cn/charts/chart.spec.ts` atualizado e verde (chromium-desktop + mobile-chrome)
- [ ] Demo no showcase com os MESMOS dados de exemplo de antes (comparação visual direta)
