# Plano de Unificação de Componentes — Super Componentes

> Objetivo: reduzir a quantidade de entradas na sidebar do catálogo `/cn` **sem reduzir capacidade de entrega**. Componentes da mesma família viram um único "Super componente" mais robusto (mais props, mais variantes). Variantes ainda não prontas entram no Super marcadas como **"em desenvolvimento"** e ficam visíveis na tela de documentação.

Estado atual: **195 componentes** registrados em `src/lib/cn-registry.tsx`.
Meta deste plano: **~130 entradas** na sidebar (≈ **-65**, ~1/3 de redução) mantendo 100% das funcionalidades.

---

## 1. Princípios de design

1. **Discriminador único por família.** Cada Super componente expõe um prop discriminador (`mode`, `variant`, `type`, `range`, `multiple`…) que seleciona o comportamento. Visualmente o resultado é idêntico ao componente original.
2. **Zero perda de capacidade.** Todo prop dos componentes absorvidos sobrevive no Super (namespaced quando necessário). Nada é removido — só consolidado.
3. **Backward-compat por re-export.** Os nomes antigos continuam importáveis como thin wrappers sobre o Super (ex.: `MultiSelect = (p) => <Select mode="multi" {...p} />`). Não quebra código existente nem demos.
4. **"Em desenvolvimento" é first-class.** A meta do registry ganha status por componente e por variante. A tela do componente mostra um badge "Em desenvolvimento" na variante incompleta, sem escondê-la.
5. **Não unificar à força.** Componentes com UX/estrutura radicalmente diferente (canvas, dual-face, multi-célula, templates de conteúdo) ficam separados — unificar só aumentaria complexidade sem ganho real.

### 1.1 Mudança no registry (`CnComponentMeta`)

```ts
export interface CnComponentMeta {
  // ...campos atuais...
  status?: "stable" | "beta" | "dev"; // default 'stable'
  variants?: CnVariantMeta[]; // variantes do Super, com status próprio
  absorbs?: string[]; // nomes legados que este Super substitui
}

export interface CnVariantMeta {
  prop: string; // ex: "type"
  value: string; // ex: "number"
  label: string; // ex: "Number"
  status: "stable" | "beta" | "dev";
  note?: string; // ex: "Formatação locale em desenvolvimento"
}
```

A tela `[locale]/cn/[group]/[component]/page.tsx` lê `variants` e renderiza um seletor de variante + badge de status. Variante `dev` aparece com tarja **"Em desenvolvimento"** e (opcional) demo desabilitado.

### 1.2 Busca ciente de variantes (decisão Q3)

Os nomes absorvidos **somem da navegação da sidebar** (viram variante do Super), mas continuam **encontráveis pela busca** — tanto a busca da sidebar quanto a busca do header.

Regra: o índice de busca não indexa só os 195→127 nomes — ele achata **componentes + variantes + valores de prop transversais**. Cada `CnVariantMeta` ganha `aliases[]`:

```ts
export interface CnVariantMeta {
  prop: string; // "mode"
  value: string; // "multi"
  label: string; // "Multi-select"
  status: "stable" | "beta" | "dev";
  note?: string;
  aliases?: string[]; // ["multiselect", "multi select", "tags select"]
}
```

**A busca é abrangente, não exata.** Não casa apenas o texto literal digitado — indexa **todas as informações** de cada componente para que qualquer termo relevante retorne o componente certo. O índice por entrada cobre:

- nome técnico + nome legado(s) (`absorbs[]`)
- título + descrição
- grupo
- nomes de props (`props[].name`)
- valores de variante/prop transversais (ex.: `outline`, `solid`, `multi`, `range`)
- labels e `aliases[]` das variantes
- keywords livres (`keywords[]` opcional na meta)

Match por **substring + tokenização + fuzzy** (tolerante a typo/espaço/caixa), com ranqueamento: nome exato > alias/variante > prop > descrição. Os exemplos abaixo são ilustrativos — o objetivo é que **qualquer** info do componente seja pesquisável:

- **Buscar `"multiselect"`** → **Select** variante `mode="multi"` em destaque (deep-link `…/cn/inputs/select?mode=multi`).
- **Buscar `"outline"`** → **todos** os componentes que expõem a variante/valor `outline`, cada um já no demo dessa variante.
- **Buscar `"glow card"` / `"date range"`** (nome legado) → resolve para o Super + variante.
- **Buscar um prop** (ex.: `"clearable"`, `"sparkline"`) → retorna os componentes que têm esse prop.
- **Buscar termo da descrição** (ex.: `"drag and drop"`, `"keyboard nav"`) → retorna os componentes que mencionam.

Implementação: `buildSearchIndex()` em `cn-registry.tsx` achata cada componente em N entradas pesquisáveis `{ componentName, label, href, kind: 'component'|'variant'|'prop'|'token', variantValue?, status?, haystack: string }`, onde `haystack` concatena todos os campos acima. Sidebar-search e header-search consomem o **mesmo índice** (fonte única). Resultados de variante mostram o componente-pai + chip da variante (+ badge "Em desenvolvimento" quando `dev`).

---

## 2. Tabela-mestre das unificações

Legenda status: ✅ pronto p/ absorver · 🟡 absorver com variante marcada `dev` · ⛔ manter separado

### Inputs

| Super           | Absorve                                                                                                  | Discriminador                                                                               | Variantes em dev                                                                                                           | Mantém separado (motivo)                                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Input**       | input, password-input, search-input, currency-input, phone-input, floating-label-input, **number-input** | `type: 'text'\|'password'\|'search'\|'currency'\|'phone'\|'number'` + `floatingLabel?`      | 🟡 `type="number"` (stepper ±, precision) · 🟡 `type="currency"` (locale fmt) · 🟡 `type="phone"` (máscara/validação país) | otp-input, number-pad (multi-célula/keypad) · signature-pad (canvas) · tag-input (array+chips) · inline-edit (toggle view/edit) · input-group (wrapper) |
| **Select**      | select, multi-select, rich-select, combobox                                                              | `mode: 'single'\|'multi'\|'rich'\|'combobox'`                                               | —                                                                                                                          | autocomplete (input livre/async) · color-picker (não é select)                                                                                          |
| **ToggleGroup** | toggle-group, segmented-control, chip-group, filter-bar                                                  | `variant: 'outline'\|'solid'\|'segmented'\|'chip'\|'filter'` + `type: 'single'\|'multiple'` | 🟡 `variant="filter"` (counts/clear)                                                                                       | button-group (junção estrutural, sem seleção)                                                                                                           |
| **Slider**      | slider, range-slider                                                                                     | `range?: boolean` (value `number \| [number,number]`)                                       | —                                                                                                                          | —                                                                                                                                                       |
| **Rating**      | rating, rating-input                                                                                     | `readOnly?: boolean` (display vs picker)                                                    | —                                                                                                                          | —                                                                                                                                                       |

### Display

| Super          | Absorve                                                            | Discriminador                                                             | Variantes em dev                         | Mantém separado                  |
| -------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------- |
| **Card**       | card, glass-card, glow-card, tilt-card, spotlight, gradient-border | `effect: 'none'\|'glass'\|'glow'\|'tilt'\|'spotlight'\|'gradient-border'` | 🟡 `effect="gradient-border"` (animação) | flip-card (estrutura front/back) |
| **Stat**       | stat, metric-card, stats-card                                      | `mode: 'single'\|'metric'\|'grid'` (`+ sparkline`, `+ cols`)              | 🟡 `mode="metric"` sparkline inline      | —                                |
| **Badge**      | badge, tag, status-badge, ping                                     | `mode: 'badge'\|'tag'\|'status'\|'ping'`                                  | —                                        | ribbon (overlay de canto)        |
| **Kbd**        | kbd, shortcut-key                                                  | `keys?: string[]` (1 tecla vs sequência)                                  | —                                        | —                                |
| **Accordion**  | accordion, accordion-group, multi-accordion, collapsible           | `multiple?: boolean` (collapsible = 1 item)                               | —                                        | —                                |
| **Timeline**   | timeline, scroll-timeline, timeline-progress, activity-feed        | `variant: 'default'\|'scroll'\|'progress'\|'activity'`                    | 🟡 `variant="scroll"` (layout alternado) | —                                |
| **TextEffect** | typewriter, morphing-text, text-gradient, animated-number          | `effect: 'typewriter'\|'morph'\|'gradient'\|'number'`                     | 🟡 `effect="morph"` (transição blur)     | —                                |
| **Avatar**     | avatar, avatar-group                                               | `group?: boolean` + `items[]`                                             | —                                        | —                                |
| **Background** | grid-pattern, particle-field                                       | `type: 'grid'\|'particles'` (SVG vs canvas interno)                       | 🟡 `type="particles"` (perf canvas)      | —                                |

### Feedback

| Super        | Absorve                                   | Discriminador                                                                 | Variantes em dev                 | Mantém separado                               |
| ------------ | ----------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------- |
| **Progress** | progress, progress-ring, gauge, skill-bar | `shape: 'bar'\|'ring'\|'gauge'` + `mode: 'single'\|'list'` (skill-bar = list) | 🟡 `shape="gauge"` (range/ticks) | spinner (indeterminado)                       |
| **Stepper**  | stepper, dot-stepper, progress-steps      | `variant: 'default'\|'dots'\|'progress'`                                      | —                                | step-form (wizard de formulário, nível acima) |

### Data

| Super     | Absorve                                                                              | Discriminador                                                          | Variantes em dev                         | Mantém separado                                                           |
| --------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| **Table** | table, data-grid, data-list, tree-table                                              | `variant: 'table'\|'grid'\|'list'\|'tree'`                             | 🟡 `variant="tree"` (expand hierárquico) | virtual-list (virtualização/perf) · comparison-table (layout lado-a-lado) |
| **Chart** | line-chart, area-chart, bar-chart, donut-chart, radar-chart, funnel-chart, sparkline | `type: 'line'\|'area'\|'bar'\|'donut'\|'radar'\|'funnel'\|'sparkline'` | 🟡 `type="radar"` · 🟡 `type="funnel"`   | — (entrada única na sidebar, render interno por tipo)                     |

### Layout

| Super         | Absorve                       | Discriminador           | Variantes em dev | Mantém separado                     |
| ------------- | ----------------------------- | ----------------------- | ---------------- | ----------------------------------- |
| **ScrollNav** | scroll-spy, table-of-contents | `variant: 'spy'\|'toc'` | —                | mini-map (preview visual da página) |

### Overlays

| Super       | Absorve                                                  | Discriminador                                                      | Variantes em dev                          | Mantém separado            |
| ----------- | -------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------- | -------------------------- |
| **Tooltip** | tooltip, rich-tooltip, popover, hover-card, context-card | `trigger: 'hover'\|'click'\|'focus'` + `variant: 'simple'\|'rich'` | 🟡 `variant="rich"` (title/icon/action)   | —                          |
| **Menu**    | dropdown-menu, context-menu, floating-menu               | `trigger: 'click'\|'contextmenu'\|'hover'`                         | —                                         | —                          |
| **Command** | command, command-bar, spotlight-search                   | `variant: 'palette'\|'bar'\|'spotlight'`                           | —                                         | quick-actions (FAB radial) |
| **Dialog**  | modal, alert-dialog, drawer, side-panel                  | `variant: 'modal'\|'alert'\|'drawer'\|'panel'`                     | 🟡 `variant="panel"` (collapsible inline) | —                          |

### Inputs (botões — família button)

| Super      | Absorve                                                  | Discriminador                                                           | Variantes em dev                                | Mantém separado                                                             |
| ---------- | -------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| **Button** | button, magnetic-button, confetti-button, confirm-button | `effect?: 'none'\|'magnetic'\|'confetti'` + `confirm?: 'click'\|'hold'` | 🟡 `effect="magnetic"` · 🟡 `effect="confetti"` | split-button (botão+dropdown) · fab (flutuante) · copy-button (copia texto) |

### Date/Time

| Super          | Absorve                                               | Discriminador                                                                            | Variantes em dev                      | Mantém separado                                     |
| -------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------- |
| **DatePicker** | date-picker, date-range-picker, time-picker, calendar | `range?: boolean` + `showTime?: boolean` + `mode: 'input'\|'inline'` (calendar = inline) | 🟡 `showTime` (time picker integrado) | event-calendar (gestão de eventos, domínio próprio) |

---

## 3. Contagem e impacto na sidebar

| Família             |  Antes | Depois |         Δ |
| ------------------- | -----: | -----: | --------: |
| Input (texto)       |      7 |      1 |        -6 |
| Select              |      4 |      1 |        -3 |
| ToggleGroup         |      4 |      1 |        -3 |
| Slider              |      2 |      1 |        -1 |
| Rating              |      2 |      1 |        -1 |
| Card (efeitos)      |      6 |      1 |        -5 |
| Stat (KPI)          |      3 |      1 |        -2 |
| Badge               |      4 |      1 |        -3 |
| Kbd                 |      2 |      1 |        -1 |
| Accordion           |      4 |      1 |        -3 |
| Timeline            |      4 |      1 |        -3 |
| TextEffect          |      4 |      1 |        -3 |
| Avatar              |      2 |      1 |        -1 |
| Background          |      2 |      1 |        -1 |
| Progress            |      4 |      1 |        -3 |
| Stepper             |      3 |      1 |        -2 |
| Table               |      4 |      1 |        -3 |
| Chart               |      7 |      1 |        -6 |
| ScrollNav           |      2 |      1 |        -1 |
| Tooltip             |      5 |      1 |        -4 |
| Menu                |      3 |      1 |        -2 |
| Command             |      3 |      1 |        -2 |
| Dialog              |      4 |      1 |        -3 |
| Button (efeitos)    |      4 |      1 |        -3 |
| DatePicker          |      4 |      1 |        -3 |
| **Total absorvido** | **93** | **25** | **≈ -68** |

**Sidebar: 195 → ~127 entradas.** Restam intactos os ~75 componentes especializados (canvas, templates de conteúdo, wrappers estruturais, primitivos sem família) + os 25 Super.

> Charts e TextEffect: 1 entrada na sidebar cada, mas internamente continuam delegando para os renderers existentes — não há reescrita de SVG, só roteamento por `type`.

---

## 4. Estratégia de implementação (faseada)

### Fase 0 — Infra (1 PR)

- Estender `CnComponentMeta` com `status`, `variants`, `absorbs`.
- Tela do componente: seletor de variante + badge "Em desenvolvimento" (lê `variants[].status`).
- Sidebar: filtrar do catálogo os nomes listados em qualquer `absorbs[]` (somem da navegação, viram variante do Super).

### Fase 1 — Wins de baixo risco (merges 1:1 quase idênticos)

Slider, Rating, Accordion, Kbd, Avatar, Stepper, Badge.
São APIs quase idênticas — discriminador booleano/enum simples, baixa chance de regressão.

### Fase 2 — Inputs e Selects

Input (com `type`), Select (com `mode`), ToggleGroup. Maior volume de uso → testar bem. `type="number"`, `currency`, `phone` entram **marcados `dev`** conforme exemplo do briefing.

### Fase 3 — Overlays e Dialogs

Tooltip, Menu, Command, Dialog. Cuidado com portal/focus-trap/keyboard nav compartilhados.

### Fase 4 — Display/Data pesados

Card (efeitos), Stat, Timeline, TextEffect, Progress, Table, Chart, Background, ScrollNav, Button (efeitos), DatePicker.

### Por merge, o checklist é:

1. Criar/estender o Super com o prop discriminador + props absorvidos.
2. Migrar a lógica de cada componente absorvido para um branch interno do Super (sem reescrever — mover).
3. Converter o componente antigo em re-export wrapper (backward-compat).
4. Atualizar registry: 1 entrada Super com `absorbs[]` + `variants[]`; remover entradas absorvidas da sidebar.
5. Atualizar demo da tela para o seletor de variante.
6. Marcar variantes incompletas como `status: 'dev'`.

---

## 5. Mantidos separados (resumo + motivo)

- **Canvas/render próprio:** signature-pad, particle-field (absorvido como variante dev de Background, mas render canvas isolado), mini-map.
- **Estrutura multi-elemento/dual-face:** otp-input, number-pad, flip-card.
- **Templates de conteúdo (domínio fechado):** user-card, pricing-card, receipt-card, credit-card, video-card, note-card, chat-bubble.
- **Wrappers estruturais (não selecionáveis):** input-group, button-group, split-button, fab, copy-button.
- **Perf/wrapper:** virtual-list.
- **Layout dedicado:** comparison-table, event-calendar.
- **Comportamento único:** inline-edit, tag-input, autocomplete, color-picker, spinner, quick-actions, step-form, ribbon.

---

## 6. Riscos e mitigação

| Risco                                                | Mitigação                                                                                                               |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Props "explodirem" no Super (dezenas de campos)      | Agrupar props por modo via namespacing leve e documentar quais valem por `mode`/`type`. Demos mostram só os relevantes. |
| Regressão visual em componente muito usado           | Wrappers backward-compat + comparar render antes/depois nas demos existentes.                                           |
| Variante `dev` parecer "quebrada"                    | Badge explícito "Em desenvolvimento" + nota na tela; nunca remover, só sinalizar.                                       |
| Bundle do Super crescer (ex.: Chart com 7 renderers) | Lazy/dynamic import por `type` quando o peso justificar.                                                                |

---

## 7. Decisões

| #   | Pergunta                      | Decisão                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Aceita as 25 famílias Super?  | ✅ **Aprovado.** Na maioria dos casos = 1 Super com muitas props/variantes (padronização). O que for distinto demais / sem sentido englobar → permanece **componente à parte** (documentado como standalone, não Super). Sempre a abordagem mais profissional por componente. Ex.: `select` incorpora multi/rich/combobox como variantes (visual e funcionalmente idênticos), mas estruturas que não encaixam ficam fora. |
| 3   | Nomes antigos na sidebar      | ✅ **Somem da navegação** da sidebar (viram variante), **mas permanecem na busca** (sidebar + header), ciente de variantes — ver §1.2.                                                                                                                                                                                                                                                                                    |
| 2   | Backward-compat por re-export | ✅ **Aprovado.** Nomes antigos (`MultiSelect`, `GlowCard`…) continuam importáveis como wrapper fino sobre o Super. Não quebra código/demos; custo ~zero.                                                                                                                                                                                                                                                                  |
| 4   | Charts / TextEffect           | ✅ **Aprovado.** 1 entrada única na sidebar com prop `type`; cada tipo indexado na busca (consistente com Q3 — some da nav, achável por busca).                                                                                                                                                                                                                                                                           |

**Princípio geral (reforçado):** unificar **apenas quando fizer total sentido**. A meta é maximizar Super componentes (1 com muitas props/variantes) para padronizar, mas qualquer componente cuja estrutura/UX não encaixe — ou cuja unificação não traga ganho — permanece **standalone**, documentado como tal. Profissionalismo por componente acima da contagem.

---

## 8. Duas estratégias de absorção (importante)

Na execução, cada família cai em uma de duas estratégias — escolhida pela **fidelidade** que o merge de código permite:

1. **Code-merge** — quando as APIs/visuais alinham e há um discriminador real. O Super ganha o prop (ex.: `range`, `toggleOff`); o irmão vira **wrapper backward-compat** (`<Slider range />`). Reduz código **e** sidebar. Variante exposta na barra (`variants[]`, prop real, deep-link).
2. **Catalog-absorb** — quando os irmãos têm shapes de item/visual distintos e um merge forçado regrediria o render. O Super só ganha `absorbs[]`: o irmão **some da nav** e fica **só na busca**, com **código/página/demo intactos** (zero regressão). Reduz sidebar; código permanece (limpeza opcional depois).

Regra de metadata: `absorbs[]` sempre define a redução de sidebar; `variants[]` só é usado para props **reais** do Super (senão o deep-link `?prop=value` ficaria morto).

---

## 9. Status de execução

- **Fase 0 — infra** ✅ (commit inicial): tipos do registry, `buildSearchIndex`/`getVisibleComponents`, busca abrangente na sidebar + header, `CnVariantBar`.
- **Fase 1** ✅ — 12 entradas removidas da nav:
  - _Code-merge:_ **Slider** ← range-slider · **Rating** ← rating-input · **Kbd** ← shortcut-key.
  - _Catalog-absorb:_ **Avatar** ← avatar-group · **Accordion** ← accordion-group, multi-accordion, collapsible · **Badge** ← tag, status-badge, ping · **Stepper** ← dot-stepper, progress-steps.
- **Fase 2 (Inputs/Selects)** 🟦 parcial — catalog-absorb + variantes `dev` para modos ainda não portados à base (+12 entradas fora da nav):
  - **Input** ← password-input, search-input, number-input, currency-input, phone-input, floating-label-input. Variantes: `revealable`/`search` estáveis; `number`/`currency`/`phone`/`floatingLabel` **dev** (impl rica segue nos componentes originais — exatamente o caso number do briefing).
  - **Select** ← multi-select, rich-select, combobox (modos `multi`/`rich`/`combobox` **dev**).
  - **ToggleGroup** ← segmented-control, chip-group, filter-bar (variantes `segmented`/`chip`/`filter` **dev**).
  - _Falta na Fase 2:_ portar o código dos modos `dev` para dentro das bases (Input number/currency/phone, Select multi/rich/combobox) e converter os originais em wrappers.
- **Fase 3 (Overlays/Dialogs)** ✅ catalog-absorb (+11):
  - **Tooltip** ← rich-tooltip, popover, hover-card, context-card · **Dropdown Menu** ← context-menu, floating-menu · **Command** ← command-bar, spotlight-search · **Modal** ← alert-dialog, drawer, side-panel. Modos não portados = `dev`.
- **Fase 4 (Display/Data)** 🟦 catalog-absorb (+24):
  - **Card** ← glass/glow/tilt-card, spotlight, gradient-border · **Stat** ← metric-card, stats-card · **Timeline** ← scroll-timeline, timeline-progress, activity-feed · **Progress** ← progress-ring, gauge, skill-bar · **Data Table** ← data-grid, data-list, tree-table · **Grid Pattern** ← particle-field · **Scroll Spy** ← table-of-contents · **Button** ← magnetic/confetti/confirm-button · **Date Picker** ← date-range-picker, time-picker, calendar. Modos não portados = `dev`.
  - **Deferidos (precisam de Super novo, não simples absorb):** **Chart** (line/area/bar/donut/radar/funnel/sparkline → 1 entrada com `type`) e **TextEffect** (typewriter/morphing-text/text-gradient/animated-number). Nenhum tem base canônica; exigem criar o componente Super + roteamento por `type`.

### Resultado atual

**59 nomes absorvidos → sidebar 195 → 136.** Com Chart (−6) e TextEffect (−3) quando implementados: **~127** (meta atingida).

### Itens 1-3 — CONCLUÍDOS (commit f854f30)

**Item 1 — code-merge real de 14 famílias** (lógica do irmão movida VERBATIM para dentro do Super, irmão virou wrapper backward-compat, padrão Slider). Todas validadas com tsc por família:
Input (number/currency/phone/floating-label), Select (multi/rich/combobox), ToggleGroup (segmented/chip/filter), Tooltip (rich/popover/hover-card), DropdownMenu (context-menu/floating-menu), Command (bar/spotlight), Modal (alert/drawer/side-panel), Card (glass/glow/tilt/spotlight/gradient-border), Stat (metric/grid), Timeline (scroll/progress/activity), Progress (ring/gauge/skill-bar), DataTable (grid/list/tree), Button (magnetic/confetti), DatePicker (range/calendar-inline).

**Item 2 — Chart e TextEffect** (supers novos que despacham por `type`/`effect` para os renderers existentes, sem reescrever SVG). Charts: line/area/bar/donut/radar/funnel/sparkline. TextEffect: typewriter/morph/gradient/number.

**Item 3 — demo-switching**: as telas de Chart e Text Effect leem `?type`/`?effect` (deep-link do CnVariantBar) e trocam o preview ao vivo.

**Promoções**: 58 variantes `dev` → `stable`. Permanecem `dev` (mantidos catalog-absorb por divergência real): `grid-pattern?type=particles` (canvas vs SVG) e `scroll-spy?variant=toc`.

**Mantidos como componente à parte / catalog-absorb** (decisão por regressão/UX): context-card, time-picker, confirm-button (capacidade existe no Super, wrapper preservado), particle-field, table-of-contents, flip-card, virtual-list, comparison-table, event-calendar, otp-input, number-pad, signature-pad, tag-input, inline-edit, autocomplete, color-picker, spinner, quick-actions, step-form, ribbon, button-group, split-button, fab, copy-button.

**Resultado final: sidebar 197 total → 127 visíveis (70 absorvidos).** tsc limpo, `next build` verde.

### Resíduo opcional (não bloqueante)

Demo-switching `?prop=value` nas telas das outras 12 famílias (Chart/TextEffect já têm). O CnVariantBar já deep-linka e destaca a variante ativa em todas; falta apenas o preview curado de cada uma reagir ao param — extensão mecânica do padrão de ChartDemo/TextEffectDemo.

**Documento aprovado.** Próximo passo: implementar na ordem das Fases 0→4 (§4).
