# Plano de Unificação de Componentes — Super Componentes

> ⚠️ **Nota de atualização (2026-08-29)**: a auditoria sistemática de `docs/AUDITORIA-CN-STATUS.md` conferiu, componente a componente, **todas** as entradas `absorbs:` deste plano contra o código real — e achou 8 casos onde o registry dizia "absorvido" mas o componente "absorvido" era na verdade uma implementação paralela real, nunca de fato unificada. Ver **§10** no fim deste documento pra lista completa das correções. As tabelas abaixo (§2, §5, §9) ficam como registro histórico da decisão original, com nota inline (~~riscado~~) nos pontos que a auditoria corrigiu.

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

| Super          | Absorve                                                                                                                                                            | Discriminador                                                             | Variantes em dev                         | Mantém separado                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------ |
| **Card**       | card, glass-card, glow-card, tilt-card, spotlight, gradient-border                                                                                                 | `effect: 'none'\|'glass'\|'glow'\|'tilt'\|'spotlight'\|'gradient-border'` | 🟡 `effect="gradient-border"` (animação) | flip-card (estrutura front/back)           |
| **Stat**       | stat, metric-card, stats-card                                                                                                                                      | `mode: 'single'\|'metric'\|'grid'` (`+ sparkline`, `+ cols`)              | 🟡 `mode="metric"` sparkline inline      | —                                          |
| **Badge**      | badge, tag, status-badge, ping                                                                                                                                     | `mode: 'badge'\|'tag'\|'status'\|'ping'`                                  | —                                        | ribbon (overlay de canto)                  |
| **Kbd**        | kbd, shortcut-key                                                                                                                                                  | `keys?: string[]` (1 tecla vs sequência)                                  | —                                        | —                                          |
| **Accordion**  | accordion, accordion-group, multi-accordion, collapsible                                                                                                           | `multiple?: boolean` (collapsible = 1 item)                               | —                                        | —                                          |
| **Timeline**   | timeline, scroll-timeline, timeline-progress, activity-feed                                                                                                        | `variant: 'default'\|'scroll'\|'progress'\|'activity'`                    | 🟡 `variant="scroll"` (layout alternado) | —                                          |
| **TextEffect** | typewriter, morphing-text, text-gradient, animated-number                                                                                                          | `effect: 'typewriter'\|'morph'\|'gradient'\|'number'`                     | 🟡 `effect="morph"` (transição blur)     | —                                          |
| **Avatar**     | avatar, avatar-group                                                                                                                                               | `group?: boolean` + `items[]`                                             | —                                        | —                                          |
| **Background** | ~~grid-pattern, particle-field~~ **grid-pattern apenas** (auditoria provou absorção falsa — particle-field é canvas real e independente, nunca unificado; ver §10) | `type: 'grid'`                                                            | —                                        | particle-field (canvas real, rota própria) |

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

| Super         | Absorve                                                                                                                                                                  | Discriminador    | Variantes em dev | Mantém separado                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ---------------- | ---------------------------------------------------------------------------- |
| **ScrollNav** | ~~scroll-spy, table-of-contents~~ **scroll-spy apenas** (auditoria provou absorção falsa — table-of-contents é componente real e independente, nunca unificado; ver §10) | `variant: 'spy'` | —                | mini-map (preview visual da página) · table-of-contents (real, rota própria) |

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

- **Canvas/render próprio:** signature-pad, ~~particle-field (absorvido como variante dev de Background, mas render canvas isolado)~~ **particle-field (componente real e independente — a absorção era falsa, ver §10)**, mini-map.
- **Estrutura multi-elemento/dual-face:** otp-input, number-pad, flip-card.
- **Templates de conteúdo (domínio fechado):** user-card, pricing-card, receipt-card, credit-card, video-card, note-card, chat-bubble.
- **Wrappers estruturais (não selecionáveis):** input-group, button-group, split-button, **fab** (absorve quick-actions de verdade desde a auditoria — ver §10), copy-button.
- **Perf/wrapper:** virtual-list.
- **Layout dedicado:** comparison-table, event-calendar.
- **Comportamento único:** inline-edit, tag-input, autocomplete, color-picker, spinner, ~~quick-actions~~ (absorvido por `fab`, ver §10), step-form, ribbon.

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

**Promoções**: 58 variantes `dev` → `stable`. ~~Permanecem `dev` (mantidos catalog-absorb por divergência real): `grid-pattern?type=particles` (canvas vs SVG) e `scroll-spy?variant=toc`.~~ **Correção da auditoria**: essas duas nunca foram absorções de verdade — `particle-field` e `table-of-contents` são componentes reais e independentes, cada um com rota própria na sidebar. Ver §10.

**Mantidos como componente à parte / catalog-absorb** (decisão por regressão/UX): ~~context-card~~ (era absorção **falsa** — `absorbs` dizia que sim mas `ContextCard.tsx` não delegava; corrigido na auditoria pra wrapper genuíno sobre `Tooltip variant="card"`), time-picker, confirm-button (capacidade existe no Super, wrapper preservado — confirmado, era `ConfirmButton.tsx` duplicado até a auditoria corrigir pra delegar de verdade), ~~particle-field, table-of-contents~~ (ambos reais e independentes, nunca absorvidos — ver acima), flip-card, virtual-list, comparison-table, event-calendar, otp-input, number-pad, signature-pad, tag-input, inline-edit, autocomplete, color-picker, spinner, ~~quick-actions~~ (absorvido de verdade por `fab` na auditoria), step-form, ribbon, button-group, split-button, fab, copy-button.

**Resultado final (na época): sidebar 197 total → 127 visíveis (70 absorvidos).** ~~tsc limpo, `next build` verde.~~ **Estado atual (pós-auditoria, 2026-08-29): 197 total → 139 visíveis (58 absorvidos)** — a contagem caiu porque 7 absorções falsas foram revertidas (componentes voltaram a aparecer na sidebar: activity-feed continua absorvido de verdade por Timeline, mas avatar-group/accordion-group+multi-accordion+collapsible/grid-pattern→~~particle-field~~/scroll-spy→~~table-of-contents~~/stepper→dot-stepper+progress-steps/badge→tag+status-badge+ping/input→~~password-input+search-input~~ voltaram a ser visíveis por serem reais e independentes), parcialmente compensado por 1 absorção nova genuína (fab ← quick-actions). Ver `docs/AUDITORIA-CN-STATUS.md`, pendência 0, pra metodologia completa de verificação.

### Item 4 — variant bar resolve irmãos absorvidos (`?v=<nome>`)

O resíduo de demo-switching foi resolvido com um modelo único e zero-regressão, em vez de curar `?prop=value` família a família:

- **CnVariantBar** agora mostra um chip _base_ (o Super) + um chip por irmão absorvido (`absorbs[]`), resolvido para o título/grupo real via `getResolvedVariants()`/`getComponentByName()` em `cn-registry.tsx`.
- Selecionar um chip deep-linka para `?v=<nome-do-irmão>`. A página (`[component]/page.tsx`) lê o param e re-renderiza **showcase + install + usage + source + props** do irmão real (`docMeta`), mantendo o header e a barra do Super.
- Reusa os demos/registry já existentes de cada irmão (intactos) — nada de preview novo por variante. Chart/TextEffect continuam com seus demos curados como chip base; os tipos viram chips de irmão.
- `variants[]` (prop/value/aliases) permanece **só para o índice de busca** (`buildSearchIndex`); a navegação por variante na tela passou a ser name-based (`?v=`).

tsc limpo nos arquivos tocados, `next build` verde.

**Documento aprovado.** Próximo passo: implementar na ordem das Fases 0→4 (§4).

---

## 10. Correções pós-auditoria (2026-08-29)

A auditoria sistemática 9-gate de `docs/AUDITORIA-CN-STATUS.md` conferiu **todas** as ~20 entradas `absorbs:` deste plano contra o código real (abrindo o arquivo do Super e checando se existe de fato um dispatcher/`switch` que produz a MESMA funcionalidade do irmão, e não uma implementação solta). Resultado: a maioria das absorções estava correta, mas **8 casos estavam errados** — o registry dizia `absorbs: [...]` sem o Super de fato delegar/rotear pro irmão. Essas 8 (mais uma nona corrigida nesta sessão) foram tratadas assim:

| Super                                                | Irmão(s) que o registry dizia absorvidos      | O que a auditoria achou                                                                                                | Resolução                                                                                                                                                                        |
| ---------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Avatar                                               | avatar-group                                  | Implementação paralela real, sem delegação                                                                             | `absorbs` removido — avatar-group voltou a aparecer na sidebar como componente próprio                                                                                           |
| Accordion                                            | accordion-group, multi-accordion, collapsible | Implementações paralelas reais                                                                                         | `absorbs` removido dos 3 — todos voltaram a aparecer na sidebar                                                                                                                  |
| Grid Pattern                                         | particle-field                                | particle-field é canvas real e independente, nunca foi unificado                                                       | `absorbs` removido — particle-field visível na sidebar (corrige §2 "Background" e §5 acima)                                                                                      |
| Scroll Spy                                           | table-of-contents                             | table-of-contents é componente real e independente, nunca foi unificado                                                | `absorbs` removido — table-of-contents visível na sidebar (corrige §2 "ScrollNav" acima)                                                                                         |
| Stepper                                              | dot-stepper, progress-steps                   | Implementações paralelas reais                                                                                         | `absorbs` removido dos 2 — ambos voltaram a aparecer na sidebar                                                                                                                  |
| Badge                                                | tag, status-badge, ping                       | Implementações paralelas reais                                                                                         | `absorbs` removido dos 3 — todos voltaram a aparecer na sidebar                                                                                                                  |
| Tooltip                                              | context-card (parcial)                        | `ContextCard.tsx` era standalone via CSS puro (`:hover`/`:focus-within`), zero delegação real pro Tooltip              | Corrigido pra valer: `ContextCard.tsx` reescrito como wrapper genuíno sobre `<Tooltip variant="card">` — `absorbs` agora é verdadeiro                                            |
| Input                                                | password-input, search-input (parcial)        | Implementações paralelas reais (funcionalidade não-redundante)                                                         | `absorbs` removido dos 2 — ambos visíveis na sidebar                                                                                                                             |
| Fab _(nova, não fazia parte da lista original de 8)_ | quick-actions                                 | Mesmo conceito (FAB circular + speed-dial) implementado 2x de forma independente, sem nenhum `absorbs` ligando os dois | Fab ganhou `position="inline"`/`placement`/`intent` por ação (as 3 features exclusivas do QuickActions) — `QuickActions.tsx` virou wrapper genuíno, `absorbs` agora é verdadeiro |

Achado correlato: **`confirm-button`** (família Button) tinha `absorbs` tecnicamente correto no registry, mas `ConfirmButton.tsx` era uma reimplementação standalone duplicada, não um wrapper de verdade — corrigido pra delegar pro `Button` de fato.

**Contagem real hoje**: 197 componentes no registry, 58 nomes absorvidos → **139 visíveis na sidebar** (não 127 como o §9 registrou na época — aquele número já contava as absorções falsas acima como reduções válidas).

**Fonte de verdade daqui pra frente**: `docs/AUDITORIA-CN-STATUS.md`, seção "pendência 0", documenta o critério exato usado pra validar `absorbs` e a lista completa de absorções confirmadas verdadeiras (`Table`, `Progress`, `Timeline`, `Chart`, `Modal`, `Command`, `DropdownMenu`, `ToggleGroup`, `Stat`, `DatePicker`, `Kbd`, `Tooltip`, `Card`, `Button`, `Input`, `Select`, `Rating`, `Slider`, `TextEffect`, `Fab`). Se um novo Super for adicionado no futuro com `absorbs`, aplicar o mesmo critério antes de confiar no campo — não assumir que `absorbs: [...]` no registry implica delegação real sem abrir o arquivo do Super e conferir.
