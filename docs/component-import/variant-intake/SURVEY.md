# Survey — 8 gates aplicados às 79 categorias (`variants/` + `adapted/`)

Levantamento produzido rodando o redutor de 8 gates definido em [`CRITERIA.md`](CRITERIA.md) contra as 49 categorias de `shadcndashboard/src/components/shadcn-dashboard-library/variants/` (310 arquivos) e as 30 de `adapted/` (33 arquivos) — 79 nomes de categoria no total, com sobreposição de nome entre as duas pastas em 30 casos.

**Achado de método, antes da tabela**: em todo caso onde `adapted/<categoria>` tem o mesmo número de arquivo que `variants/<categoria>` (ex. `adapted/checkbox-01.tsx` vs `variants/checkbox-01.tsx`), o conteúdo é o mesmo componente, só pré-tokenizado pela origem (comentário de atribuição + normalização de aspas, zero diferença estrutural) — confirmado por diff direto em `checkbox-01`, `select-01` e `progress-04`. Por isso **as duas pastas foram tratadas como uma única categoria por nome** (49 categorias reais, não 79) — a exceção confirmada é `pagination`: `adapted/pagination-01.tsx` é um componente diferente (`FloatingPill`, o indicador deslizante) dos três `variants/pagination-0{1,2,3}.tsx`, e por isso já tinha virado o candidato real portado no `animation-backport/PLAN.md`. Nenhuma outra divergência desse tipo foi encontrada nas amostras verificadas.

Reaproveitado como ponto de partida: `../00-INVENTORY.md` (mapa de primos CN) e `../animation-backport/PLAN.md` (43 arquivos com `motion`, já avaliados por técnica de animação) — reclassificados aqui sob a lente de variante visual/estrutural completa, não só a técnica isolada. `../new-components/PLAN.md` cobre a cauda sem primo (pie-chart, radial-chart, item, menubar — feitos; shine-border, input-mask, number-ticker — descartados); essas categorias aparecem abaixo só com uma nota de remissão, sem gate novo.

Convenção de veredito: ✅ Trazer · ⏳ Decisão de produto · ❌ Duplicidade/não cabe (ver `CRITERIA.md` para a definição de cada um).

---

## accordion

Componente CN: `accordion/` (`Accordion`, variant `default|separated|ghost`).

❌ **Gate 2.** As 7 origens (Radix puro, sem `motion` real na estrutura — a suspeita inicial de altura animada era falsa, ver `animation-backport/PLAN.md`) usam um trigger numerado por etapa (bolha "01"→"02" com morph de escala/opacidade, título com color+x-shift, ícone `+`→`×`). Portar exigiria trocar a API do trigger (hoje `label`+`icon` genéricos) por uma forma de conteúdo dedicada a "step numerado" — reescrita de arquitetura, não variante.

## alert

Componente CN: `alert/` (`Alert`, intent × variant `soft|outline|solid|left-accent`, `actions`, `children` livre).

❌ **Gate 1.** `alert-04.tsx` (faixa lateral colorida) já é exatamente `variant="left-accent"`. Os demais (`01` checklist, `02` avatar+texto, `03` accept/decline com `ConfettiButton`, `05` card escuro com 2 botões, `06` gradiente com CTA) são só composições dentro de `children`+`actions`, que o `Alert` já aceita livremente — nenhum pede capacidade nova.

## animated-text

Componentes CN: `text-effect/` (dispatcher `typewriter|morph|gradient|number`), `text-gradient/`, `typewriter/`, `morphing-text/`.

- `animated-text-02.tsx` (gradiente cíclico) → ❌ **Gate 1**, `TextGradient` já tem `animate?: boolean`.
- `animated-text-03.tsx` (typewriter apaga/retypa em loop) → ❌ **Gate 1**, `Typewriter` já cobre `texts[]`+`speed`+`deleteSpeed`+`pauseDuration`+`loop`+`cursor`.
- `animated-text-04.tsx` (troca de frase com cor por palavra, estilo "boot sequence") → ❌ **Gate 1**, conceitualmente é o mesmo padrão do `MorphingText` (troca de palavras em sequência); cor por palavra é modificação cosmética pequena demais pra justificar entrada nova agora.
- `animated-text-01.tsx` (sweep de brilho estático sobre texto, "shiny text") → ✅ **Trazer** — efeito novo (`effect="shine"` na família `TextEffect`), CSS puro (`bg-clip-text`+`mask`/`background-position`), sem lib nova, curadoria real (tagline premium é padrão recorrente).
- `animated-text-05.tsx` (wave shimmer por caractere, via `motion`, inspirado no "TextShimmerWave" da motion-primitives) → ✅ **Trazer** — efeito distinto dos 3 já existentes, reusa `staggerContainer` de `@/lib/motion`; cuidado de a11y (texto completo acessível via wrapper, spans decorativos `aria-hidden`).

## area-chart

Componente CN: `area-chart/`, absorvido em `chart/` (`type="area"`).

❌ **Gate 3** pra maioria — todas as 7 origens usam `recharts` (Kikito optou deliberadamente por SVG hand-rolled em todos os tipos de `Chart` exceto `radial-bar-chart`, ver `new-components/PLAN.md`). `area-chart-01/04.tsx` (preenchimento gradiente) → ❌ **Gate 1**, `gradient?: boolean` já existe. `area-chart-02/03.tsx` (combo `Bar`+`Line` num só canvas, via `ComposedChart`) → ❌ **Gate 2**, "combo chart" muda o modelo de dados pra série heterogênea, não é variante de um tipo só. `area-chart-05.tsx` (curva em degrau/"step") → ⏳ **Decisão de produto** — interpolação `linear|step|smooth` é implementável nativamente (sem `recharts`, só troca a função de geração do path SVG), mas é trabalho real de matemática de path compartilhada entre `area-chart`/`line-chart`, não uma troca de classe.

## autocomplete

Componente CN: `autocomplete/`.

✅ **Já trazido** (ver `animation-backport/PLAN.md`) — abertura/fechamento do painel com `AnimatePresence`+`scaleInVertical`/`springSnappy`, reuso do padrão do `Select`. Stagger por item (`autocomplete-04/05/06.tsx`) foi descartado deliberadamente (re-dispararia a cada tecla digitada) — decisão que se mantém sob a lente de variante visual completa, não só de técnica: o efeito da origem é estruturalmente incompatível com uma lista que muda a cada keystroke.

## avatar

Componente CN: `avatar/`.

✅ **Já trazido** (ver `animation-backport/PLAN.md`) — `onClick`/`selected`/`label`(aria) com `whileHover`/`whileTap`, reusando `springSnappy`. ❌ **Gate 5** pro que sobrou de `avatar-07.tsx`: legenda visível abaixo do avatar + badge posicionado + estado "dim/grayscale quando não selecionado" formam um "tile de seleção" (people-picker) que pediria 3 props novas (`caption`, posição de badge, estado dim) num componente que se define como puramente decorativo — custo de manutenção permanente desproporcional a mais uma variante; padrão de "avatar com legenda" já é melhor resolvido por composição livre ou por `avatar-group`/`user-card`.

## badge

Componente CN: `badge/`.

❌ **Gate 1** pra `badge-01/02/03/04/05/06.tsx` — default/outline/destructive já existem via `intent`/`variant`; badge de contagem circular já é `rounded="full"`+tamanho; ícone+texto colorido já é `iconLeft`+`intent`; badge com link dentro é composição livre (`children`). ⏳ **Decisão de produto** pra `badge-07/08/09.tsx` (badge de status assíncrono — sucesso/pendente/falha — com glow ambiente + ícone com pop-in + rótulo revelado letra-por-letra via `motion`): capacidade realmente nova (nenhum badge da Kikito CN tem glow ou stagger de texto), custo de implementação moderado mas proporcional (reusa `staggerContainer`), e exige decisão explícita de a11y (spans por letra precisam de `aria-hidden` + texto completo acessível no wrapper) — não é mecânico o bastante pra ✅ direto.

## bar-chart

Componente CN: `bar-chart/`, absorvido em `chart/` (`type="bar"`).

❌ **Gate 3** pra maioria (todas as 7 origens em `recharts`). ✅ **Trazer**: `bar-chart-04.tsx` (`layout="vertical"`, barras horizontais) — capacidade ausente hoje (`BarChart` só tem eixo vertical), implementável nativamente via troca de eixo no SVG hand-rolled, sem depender de `recharts`; valor de curadoria real (categorias com rótulo longo pedem barra horizontal). `bar-chart-06.tsx` (valores negativos, barra bidirecional a partir do zero) fica na mesma decisão se a extensão de eixo for aprovada.

## breadcrumb

Componente CN: `breadcrumb/`.

❌ **Gate 1** pra `breadcrumb-02.tsx` (separador customizado " / ") — prop `separator` já existe. ❌ **Gate 6** pra `01.tsx` (wrapper pill) e `03.tsx` (setas de navegação + separador `·` + logo) — atingível via `className`/`separator` como nó customizado, sem ganho de curadoria que justifique API nova. ❌ **Gate 2** pra `04.tsx`/`05.tsx` (crumb que abre dropdown/menu) — exigiria trocar a forma do item de `label+href+icon` pra um trigger de submenu com `MenuEntry[]`, mudança de arquitetura. ✅ **Trazer**: `breadcrumb-06.tsx` — ellipsis clicável que abre um `DropdownMenu` revelando os itens colapsados. Hoje `maxItems` só renderiza um "…" estático e mudo (confirmado em `Breadcrumb.tsx`); tornar o "…" interativo reusa o `DropdownMenu` que já existe, custo baixo (os itens ocultos já estão disponíveis no array), valor de curadoria real (padrão GitHub/VS Code).

## button

Componente CN: `button/`.

✅ **Trazer**: padrão de hover "lift" (`hover:-translate-y-1 transition-transform duration-200`), presente em `button-09/10/11/12.tsx` — recorrência real através de 4 arquivos independentes (satisfaz a régua do Gate 3/6 de "problema recorrente"), custo mínimo (1 valor novo em `ButtonEffect`), micro-interação genérica e segura pra qualquer conteúdo de botão.

⏳ **Decisão de produto**: duas famílias de efeito "wow" no hover aparecem repetidas com variações — (a) revelação de ícone deslizando com encolhimento de texto (`button-01.tsx`, `button-19.tsx`) e (b) preenchimento radial que expande a partir do ponto do cursor/entrada (`button-16.tsx`, `button-17.tsx`) e (c) sweep de brilho no texto/borda (`button-02.tsx`, `button-03.tsx`, mesma técnica de `animated-text-01`). As três passam nos gates técnicos, mas escolher qual(is) canonizar como `ButtonEffect` novo — e o nome — é subjetivo (exatamente a definição de ⏳ do `CRITERIA.md`).

❌ **Gate 6**: `button-04.tsx` (heartbeat/pulso) — nicho demais pra um botão genérico. `button-05.tsx`/`06.tsx` (borda gradiente/borda animada, estilo Figma) — redundante em espírito com `Card` `effect="gradient-border"` já existente (mesmo achado do `shine-border`), baixo ganho incremental de trazer a mesma técnica pro Button sem pedido explícito. `button-07/08/09(social)/13/14/15.tsx` — composição já possível (`variant="outline"` + ícone) ou tamanhos já existentes (`xs..xl`). `button-18.tsx` (copiar código com barra de progresso e confirmação) → ❌ **Gate 1**, já coberto por `copy-button`.

## button-group

Componente CN: `button-group/` (`ButtonGroup`, `orientation`, `attached`, `children` livre).

❌ **Gate 1/6** — as 6 origens (ícones, vertical, paginação inline, `ButtonGroupSeparator`/`ButtonGroupText`, seletor de moeda, filtro) são todas composições de `Button`+`Select` dentro de `ButtonGroup`, já atingíveis hoje porque `children` aceita qualquer conteúdo (incluindo texto/separador como `<span>`/`<hr>` simples). Nenhuma pede capacidade nova no `ButtonGroup` em si.

## calendar

Componente CN: `calendar/` (data única) + `event-calendar/` + `date-picker/` (modo `inline`, sem range).

❌ **Gate 3** pra quase tudo — as 15 origens são construídas sobre `react-day-picker` (matchers de `disabled`, `DropdownNavProps`, `ChevronProps`, `CalendarDayButton` render-prop), dependência que a Kikito CN deliberadamente não adotou (`Calendar` é hand-rolled sobre `Date` nativo). Portar mês/ano em dropdown (`05`), navegação por chevron customizada (`10`/`11`), dias desabilitados por matcher (`06`), ou render-prop de botão-de-dia com preço (`15`) exigiria reescrever o motor de calendário, não trocar uma classe.

⏳ **Decisão de produto**: o `Calendar` standalone da Kikito CN só aceita **uma** data (`value?: Date`) — não tem `mode="range"`/`"multiple"` nativamente, diferente do `DatePicker` (que já tem união discriminada pra range, mas só no modo `input`, não `inline`). As origens `04.tsx`/`06.tsx`/`09.tsx` (seleção múltipla/intervalo) expõem esse gap real. Implementável nativamente (mesmo padrão já usado no `DatePicker`), mas decidir se o `Calendar` isolado deve absorver isso ou se fica exclusividade do `DatePicker` é uma escolha de produto, não mecânica.

## carousel

Componente CN: `carousel/` (`showDots`, `showArrows`, `autoPlay`, `orientation`).

❌ **Gate 1/6** pra `01.tsx` (dots — já existe `showDots`), `02.tsx` (setas flutuantes embaixo — atingível via `className` nos botões de seta já existentes) e `04.tsx` (cards de depoimento — composição livre de `items`). ✅ **Trazer**: `carousel-03.tsx` — indicador "1 / N" (contador numérico) como alternativa aos dots; ausente hoje, custo baixo (um valor a mais em um prop tipo `indicator?: "dots"|"counter"`), padrão comum em galerias de imagem minimalistas.

## checkbox

Componente CN: `checkbox/` (`variant` `square|rounded|circle`, `intent`, `indeterminate`).

❌ **Gate 1** — `checkbox-03.tsx` (cores customizadas destructive/success/warning) já é exatamente o que `intent` cobre; `checkbox-09.tsx` (tri-state pai/filhos) já usa `indeterminate?: boolean`, que já existe. ❌ **Gate 2** — `checkbox-07.tsx` (ícone customizado tipo "curtir", conteúdo inteiro trocando com o estado, sem caixa visível) é conceitualmente um botão-toggle de curtida, não uma checkbox visual — exigiria `children`/render arbitrário em vez de `label: string`. ❌ **Gate 6** — `checkbox-08.tsx` (borda tracejada) é baixo valor de curadoria (tracejado sinaliza "adicionar", não "confirmar", em outros componentes do design system). Os demais (`01`,`02`,`04`,`05`,`06`) são composições com `Label` já possíveis hoje.

## code-block

Componente CN: `code-block/` (`CodeBlock` single-file) + internos de doc `cn-install-block`/`cn-source-block`/`cn-usage-block` (sem tabs).

❌ **Gate 1**: `code-block-07.tsx` (`InstallCommand`) já é coberto por `cn-install-block` (nome e proposta idênticos). `01/02/03/04.tsx` são variações de conteúdo/background de um único bloco, sem capacidade nova. ⏳ **Decisão de produto**: `code-block-05.tsx` (`MultiFileCodeBlock`, abas por arquivo) e `code-block-06.tsx` (`LanguageTabsCodeBlock`, abas por linguagem) expõem um gap real — `CodeBlock` só renderiza um arquivo por vez, sem modo de abas, e nenhum componente interno de doc cobre isso. Implementável reusando o `Tabs` que já existe, mas decidir a forma exata da API (união discriminada tipo `Select`, ou dois componentes-irmãos separados) e se cabe abas por arquivo, por linguagem, ou ambos, é decisão de produto.

## collapsible

Componente CN: `collapsible/` (`title`, `children` livres).

❌ **Gate 1/2** — as 3 origens (`01` changelog, `02` sidebar de navegação em árvore, `03` gerenciador de API keys) são padrões de página inteira compostos de vários `Collapsible`+`Card`+`DropdownMenu` aninhados, não uma variação visual do `Collapsible` em si. Como `title`/`children` já são livres, tudo isso é atingível compondo o que já existe — trazer aqui seria documentar um padrão de composição, não um `variant=` novo.

## combobox

Componente CN: `select/` modo `combobox` (chips inline + busca + navegação por teclado, já absorve o conceito de "chips input").

❌ **Gate 1**: `combobox-02.tsx` (chips dentro do campo) já é exatamente o modo `combobox`/`multi` do `Select` (confirmado no código-fonte — comentário `"Combobox: multi + keyboard nav"`). ❌ **Gate 6**: `combobox-01.tsx` (ícone de addon dentro do input) é cosmético demais pra justificar prop nova. ⏳ **Decisão de produto**: `combobox-04.tsx` (opções agrupadas por região) — modo `combobox` hoje só aceita `ComboboxOption[]` plano, sem grupos (diferente do modo `single`, que já tem `SelectGroup`); `combobox-05.tsx`/`06.tsx` (avatar/bandeira por opção) — `ComboboxOption`/`MultiSelectOption` não têm slot de ícone (diferente de `RichSelectOption`, que já tem). Ambos os gaps são reais e proporcionais (union de tipos já usada em outros modos do `Select`), mas decidir se vale unificar a forma da opção entre os 4 modos é uma escolha de design, não mecânica.

## command

Componente CN: `command/` (`variant` `palette|bar|spotlight`, `groups`/`items` com `icon`/`shortcut`/`keywords`).

❌ **Gate 1**: `command-01` a `06.tsx` são só conjuntos de conteúdo diferentes (conta, configurações, atalhos, arquivos, git, navegação de dashboard) — tudo atingível com a API de dados já existente. ❌ **Gate 2**: `command-07.tsx` (filtro com `RadioGroup`/`Checkbox` embutidos dentro dos itens, que ficam abertos ao interagir em vez de fechar no `onSelect`) é conceitualmente um painel de filtro, não uma paleta de comando — já coberto por `filter-bar` na Kikito CN.

## context-menu

Componente CN: `context-menu/` (absorvido em `dropdown-menu/` trigger `contextmenu`).

✅ **Já trazido** (ver `animation-backport/PLAN.md`) — abertura/fechamento do painel via `AnimatePresence`+`scaleIn`, e como achado de passagem o `ClickMenu` (trigger `click`) ganhou a mesma animação de saída que faltava. ❌ **Gate 6** pro que sobrou: `whileHover` (item desloca 4px em x) das origens 01/02 — os outros triggers do mesmo componente usam hover por cor de fundo; aplicar deslocamento só no `contextmenu` criaria inconsistência entre triggers do mesmo componente por ganho estético pequeno.

## date-picker

Componente CN: `date-picker/` (modo `input`/`inline`, `range`).

❌ **Gate 1** — as 2 origens (`date-picker-01.tsx` data+hora via `Popover`+`Calendar`+`Input`, `date-picker-02.tsx` range via `Popover`+`Calendar` com `react-day-picker`) são exatamente o padrão que o `DatePicker` da Kikito CN já implementa nativamente (`mode="input"`, `range`), só que remontado manualmente com peças soltas. Nada de capacidade nova.

## dialog

Componente CN: `modal/` (`Modal`, variant `modal|alert|drawer|panel`, entrada única `scaleInDown`).

⏳ **Decisão de produto** — as 6 origens são o mesmo conteúdo de diálogo variando só a direção/escala de entrada (`slide-in-from-{top,bottom,left,right}`, `zoom-in-50`, `zoom-in-150`). O `Modal` hoje só tem uma entrada (`scaleInDown`) pro variant `default`. Adicionar variedade direcional é tecnicamente barato (precisa só de presets novos nomeados em `@/lib/motion` primeiro, per Gate 8), mas escolher quais das 6 direções canonizar — e se "zoom-150" (estilo "What's New") realmente adiciona valor sobre o padrão atual — é subjetivo o bastante pra não ser um ✅ mecânico.

## dropdown-menu

Componente CN: `dropdown-menu/` (`MenuEntry` = item/separator/group; `group.label` é `string`, sem slot de conteúdo rico).

⏳ **Decisão de produto**: `dropdown-menu-01.tsx` (menu de conta com cabeçalho avatar+nome+email+status-dot antes dos grupos) — gap real (`DropdownMenuProps` não tem slot de header), mas custo baixo (1 prop opcional `header?: ReactNode`) e valor de curadoria alto (padrão de "menu de conta" é universal); fica ⏳ por ser uma decisão de forma de API (prop de topo vs. novo tipo em `MenuEntry`), não por incerteza de valor. ❌ **Gate 1**: `dropdown-menu-02.tsx` (lista de notificações rica dentro do menu, com botão "ver todas") já é coberto por `notification-bell`, que tem exatamente essa forma de dado (`title`/`body`/`time`/`intent`/`avatar`, `onRead`, `onDismiss`).

## file-upload

Componente CN: `file-upload/` (dropzone nativo, sem `react-dropzone`).

✅ **Já trazido** (ver `animation-backport/PLAN.md`) — entrada/saída de item da lista via `AnimatePresence`+`slideInUp`, com correção de bug real de `key` por índice. ❌ **Gate 3** pro que sobrou — as 3 origens (`variants/`, `adapted/`, `animated-components/`) compartilham o efeito de "peek" no hover do dropzone via `layoutId`, mas dependem de `react-dropzone` e de uma estrutura de card único que não combina com o dropzone simples da Kikito CN; nova dependência não se justifica só por essa variante.

## input

Componente CN: `input/` (absorve `number`/`currency`/`phone`, `floatingLabel`, `clearable`, `revealable`, `prefix`/`suffix`, `iconLeft`/`iconRight`, `status`).

❌ **Gate 1** pra quase tudo — `input-01`(data)/`02`(hora)/`03`(moeda)/`07`(stepper)/`08`(add-ons)/`09`(floating label)/`10`(clear)/`12`(botão no fim)/`14`(erro)/`15`(required)/`16`(default)/`17`(label)/`18`(disabled) já são cobertos 1:1 pelas props atuais. `input-04.tsx` (checklist de validação de senha em tempo real) → duplicado por `password-strength`. `input-19.tsx` (anel de progresso circular pra validação) → widget novo e independente, já descartado em `animation-backport/PLAN.md` (fora do escopo de variante de `Input`). ✅ **Trazer**: `input-06.tsx` (contador de caracteres com `maxLength`) — `Textarea` já tem `showCount`, mas `Input` não; adicionar por paridade é custo mínimo (mesmo padrão já provado) e consistência esperada entre os dois campos de texto.

## input-mask

Componente CN: `input/` — **sem primo novo, já resolvido em `new-components/PLAN.md`** (descartado: os 3 formatters são específicos — cartão, validade, MAC —, não máscara genérica; implementável em minutos com `Input`+função local).

## input-otp

Componente CN: `otp-input/` (inputs nativos reais por célula, sem lib externa).

❌ **Gate 2** (já tentado e revertido, ver `animation-backport/PLAN.md`) — a origem usa a lib `input-otp` (um único input real escondido + slots visuais fake-caret), arquitetura incompatível com os inputs nativos reais do `OtpInput` da Kikito CN. Uma tentativa de portar só o "pulso" decorativo (sem tocar em caret/foco) foi implementada e revertida por um hydration mismatch real e reproduzível — não vale o risco num campo de autenticação por um efeito puramente decorativo.

## kbd

Componente CN: `kbd/` (`Kbd`, `KbdGroup`, `KbdSequence`) + `shortcut-key/`.

❌ **Gate 1/6** — as 5 origens (atalho dentro de botão, grupo de atalhos, atalho em tooltip, atalho dentro de input de busca, "gerador" interativo de combinação de teclas) são todas composições de `Kbd`/`KbdGroup` com `Button`/`InputGroup`/`Tooltip`, já atingíveis hoje. Nenhuma pede capacidade nova no `Kbd` em si.

## label

Componente CN: `label/` + `form-field/`.

❌ **Gate 1** — `label-06.tsx` (mais um floating-label, com barra inferior que cresce do centro via `scaleX` em vez do `focus-within:border-patina` instantâneo) já está resolvido: o floating label vive no `Input floatingLabel` (`FloatingLabelImpl`, 3 variantes), compartilhado por múltiplos consumidores — a diferença é só o detalhe da barra animada, pequeno demais pra justificar mexer numa implementação compartilhada (ver `animation-backport/PLAN.md`).

## line-chart

Componente CN: `line-chart/`, absorvido em `chart/` (`type="line"`).

❌ **Gate 3** pra maioria — as 4 origens em `recharts`. ⏳ **Decisão de produto**: `line-chart-01.tsx` tem `ReferenceLine` (linha de referência/meta horizontal com rótulo) — capacidade ausente e genuinamente útil (linha de meta/média é padrão comum em dashboards), implementável nativamente como um `<line>` SVG extra, mas decidir o escopo (quais tipos de `Chart` ganham `referenceLines`, como estilizar o rótulo) é decisão de produto, não mecânica. `line-chart-02/03/04.tsx` não trazem nada além do que `showArea`/`showDots`/`showGrid`/`showLegend` já cobrem.

## number-ticker

Componente CN: `animated-number/` — **sem primo novo, já resolvido em `new-components/PLAN.md`** (descartado: já existe como `animated-number`; a origem nem usa `motion` apesar do nome, provável CSS/contador simples).

## pagination

Componente CN: `pagination/`.

✅ **Já trazido** (ver `animation-backport/PLAN.md`) — indicador de página ativa deslizante via `layoutId` (mesmo padrão do `Tabs`), a partir de `adapted/pagination-01.tsx` (`FloatingPill`). Nada estrutural sobrou de fora — as demais origens (`variants/pagination-01/02/03.tsx`) eram variações do mesmo indicador ou `AnimatePresence` de enter/exit já cobertas pela mesma técnica.

## pie-chart

Componente CN: `pie-chart/`, absorvido em `chart/` (`type="pie"`) — **sem primo novo, já resolvido em `new-components/PLAN.md`** (feito: SVG próprio via `<path>`+arco).

## popover

Componente CN: `popover/` (`content: ReactNode` livre) + `hover-card/` + `rich-tooltip/`.

❌ **Gate 1** — todas as 6 origens (about card, profile card, notificações com abas, controle de volume com slider, download com progresso, card de estatísticas) são conteúdo arbitrário dentro de `PopoverContent`, que o `Popover` da Kikito CN já aceita livremente via `content`. Nenhuma pede mudança na API do `Popover` em si; `popover-03.tsx` (notificações) é o mesmo território de `dropdown-menu-02.tsx`, também já coberto por `notification-bell`.

## progress

Componente CN: `progress/` (shape `bar|ring|gauge`, modo `skill-list`).

⏳ **Decisão de produto**: o único elemento real nas origens (`progress-04.tsx`, `variants`+`adapted`) é uma simulação de "loading fake" (progresso auto-incrementando com jitter, mensagens rotativas) — pra reproduzir isso a `Progress` precisaria de um modo `indeterminate` novo, que é feature, não variante de estilo (ver `animation-backport/PLAN.md`). Vale registrar como decisão de produto pendente, não puramente descartado. ❌ **Gate 6** pro resto (shimmer/glow com cores hardcoded `bg-blue-500`, chrome de demo) — a `Progress` já tem transição suave de valor (300ms) pro caso comum.

## radar-chart

Componente CN: `radar-chart/`, absorvido em `chart/` (`type="radar"`).

❌ **Gate 3** — as 6 origens são todas `recharts` (`PolarGrid`+`PolarAngleAxis`+`Radar`) variando só opacidade de preenchimento/legenda/tooltip, tudo já coberto por `series[]`/`levels`/`showLegend` do `RadarChart` nativo. Nenhum diferenciador nativo-portável real encontrado além do que já existe.

## radial-chart

Componente CN: `radial-bar-chart/`, absorvido em `chart/` (`type="radial-bar"`) — **sem primo novo, já resolvido em `new-components/PLAN.md`** (feito: única exceção que adotou `recharts` por decisão do usuário).

## radio-group

Componente CN: `radio/` (`RadioGroupOption` = `value`+`label`+`helperText`+`disabled`).

❌ **Gate 3**: `radio-group-02.tsx` depende de `react-hook-form`+`zod`, infra de formulário, não variante visual. ❌ **Gate 6**: `radio-group-05.tsx` (borda tracejada) é baixo valor, mesmo caso do `checkbox-08`. ⏳ **Decisão de produto**: `radio-group-03/04/06.tsx` (radio em formato de card — ícone+título+descrição+preço, cartão inteiro clicável, destaque quando selecionado; variação em grade ou em lista) expõem um gap real (`RadioGroupOption` só tem `label`/`helperText`, sem ícone/preço/descrição separados), proporcional de resolver (campos opcionais a mais na option + `variant="card"`), com valor de curadoria plausível (seletor de plano é padrão comum) — mas decidir a forma exata e checar sobreposição com `pricing-card`/`price-table` já existentes é decisão de produto, não mecânica.

## scroll-area

Componente CN: `scroll-area/` (`orientation`, `maxHeight`/`maxWidth`, sem fade nas bordas).

❌ **Gate 1/6**: `scroll-area-01.tsx` (explorador de arquivos com cabeçalho sticky) é composição já possível. ✅ **Trazer**: `scroll-area-02.tsx` (stories horizontais) e `scroll-area-03.tsx` (galeria vertical) — ambos usam a mesma técnica de **fade nas bordas via `mask-image: linear-gradient(...)`**, confirmada ausente no `ScrollArea.tsx` atual (só tem controle de overflow/scrollbar, nenhum mask). CSS puro, sem lib nova, sem problema de cor (mask usa alpha, não cor de marca), custo baixo (~1 prop booleano `fadeEdges`), valor de curadoria real (efeito premium reconhecível em carrosséis/scrollers horizontais).

## select

Componente CN: `select/` (super-componente: `single`/`multi`/`rich`/`combobox`, com `icon`/`SelectGroup` já no modo `single`).

❌ **Gate 1** pra todas as 9 origens — obrigatório (`select-01`) é composição com `Label`; ícone por opção (`02`,`03`,`07`) já é `SelectOption.icon`; grupos (`04`,`09`) já é `SelectGroup`; `06.tsx` usa a lib de origem do `multi-select`, já absorvida. `05.tsx` (label flutuante sobreposta) e `08.tsx` (texto-prefixo fora do trigger) são customizações cosméticas de baixo valor (Gate 6) que não pedem API nova.

## shine-border

**Sem primo novo — já resolvido em `new-components/PLAN.md`** (descartado: `Card` `effect="gradient-border"`/`gradientVariant="spin"` já é exatamente uma borda com gradiente cônico rotativo).

## skeleton

Componente CN: `skeleton/` (`shape`, `animate`).

❌ **Gate 2/6** — as 3 origens (`03`,`04`,`05`) são templates prontos de loading (card de perfil, tabela, lista) compostos de vários `<Skeleton>` numa entrada escalonada, não uma mudança no shimmer/pulse da primitiva. `Skeleton` já tem `animate-pulse` funcional; compor um template específico é atingível hoje com o que já existe, sem ganho de trazer como "variante" formal.

## slider

Componente CN: `slider/` (`marks`, `intent`, `range`) + `range-slider/` (wrapper).

✅ **Trazer**: técnica de **pré-visualização no hover** (segmento destacado mostrando onde o valor cairia antes de soltar/clicar), presente em `slider-01.tsx` (volume), `slider-02.tsx` (reação com emoji) e `slider-03.tsx` (temperatura com cor por faixa) — mesma técnica reaproveitável nos 3, ausente no `Slider` atual, CSS+JS local sem lib nova, baixo risco (não altera teclado/leitor de tela), valor de curadoria real (toque tátil visto em players de mídia). ❌ **Gate 3/5**: `slider-04.tsx` depende de `@number-flow/react` (lib nova só pro contador) e reestiliza track/thumb com dezenas de overrides `data-[slot=...]` específicos do Radix Slider da origem — custo de replicar desproporcional a uma reskin cosmética isolada.

## sonner

Componente CN: `toast/` (`intent`, `variant`, `@keyframes toast-in/out` já funcionais).

❌ **Gate 2** — as origens (`sonner-06/07.tsx`) usam `toast.custom()` pra renderizar um card de "status de pagamento" com ripple pulsante e cores hardcoded (teal/amber/red), conteúdo customizado de uma notificação específica, não uma animação do container `Toast` em si (que já tem enter/exit funcionais).

## spinner

Componente CN: `spinner/` (anel único, sem `variant`).

⏳ **Decisão de produto** — `spinner-07.tsx` é um estilo "orbital" (núcleo pulsante + satélite orbitando), visualmente distinto do anel atual. Sob a lente antiga (`animation-backport/PLAN.md`) foi classificado como fora de escopo por não existir slot de `variant` — mas sob esta lente (trazer variante visual completa) isso é exatamente o que o redutor cobre: implementável em SVG+CSS puro, sem lib nova, custo proporcional (1 valor novo em `SpinnerVariant`), com valor de curadoria plausível (visual mais distintivo pra contexts de loading "premium"). Fica ⏳ por não ter sido pedido explicitamente e por herdar do backport anterior a dúvida sobre prioridade.

## switch

Componente CN: `switch/` (`label`, `description`, `intent`, `labelPosition`).

❌ **Gate 1** — `switch-04.tsx` (com descrição) já é `label`+`description` nativos; `switch-06.tsx` (cores customizadas) já é `intent`. Os demais (ícone dentro do label, tema claro/escuro nas duas pontas, wrapper clicável no card inteiro) são composições já possíveis hoje, sem pedir capacidade nova no `Switch`.

## tabs

Componente CN: `tabs/` (`variant` `line|pill|card|enclosed`, indicador deslizante já portado).

✅ **Já trazido** (ver `animation-backport/PLAN.md`) — indicador `layoutId` em `line`/`pill`, a partir de `tabs-01.tsx`. ✅ **Trazer** (novo, sob esta lente): transição de **conteúdo** ao trocar de aba (`tabs-02.tsx`, `tabs-05.tsx`, `tabs-07.tsx`, via `AnimatePresence`) — complementar ao indicador já feito, `TabPanelProps` hoje não tem nenhuma transição de entrada/saída do painel; custo baixo (reusa `fadeIn`/`transitionStandard` já existentes em `@/lib/motion`), valor de curadoria real (fade suave ao trocar de conteúdo é esperado em produtos maduros).

## textarea

Componente CN: `textarea/` (`state`, `showCount`, `autoResize`, `maxRows`, `resize`).

❌ **Gate 1** — erro (`01`), obrigatório (`03`), botão abaixo (`04`), auto-grow (`05`), contador (`06`), ajuda à direita (`08`), desabilitado (`09`) já são cobertos 1:1. ❌ **Gate 6**: `textarea-02.tsx` (ícone à esquerda) é baixo valor pra um campo multilinha. ✅ **Trazer**: `textarea-07.tsx` (floating label) — `Input` já tem `floatingLabel` (3 variantes), `Textarea` não tem o equivalente; trazer por paridade reusa a técnica já provada, custo e risco baixos.

## tooltip

Componente CN: `tooltip/` (`variant` `simple|rich|card`, absorve `Popover`/`HoverCard`).

❌ **Gate 2** — a única origem com `motion` real (`tooltip-03.tsx`, `useSpring`+`useMotionValue`+`useTransform` contínuos) é um padrão bespoke de "avatar stack com tooltip que segue e inclina o mouse", desenhado pra uma fileira de avatares sobrepostos, não pra um tooltip genérico anexado a qualquer trigger (que é o contrato do `Tooltip` da Kikito CN). Também usa cor hardcoded (`bg-blue-500`) sem equivalente semântico óbvio. O `Tooltip` atual já tem transição CSS funcional (140ms, próxima do token `--ks-motion-fast`=150ms) pro caso genérico.

---

## Tabela-resumo

| Categoria     | Veredito                                 | Componente CN alvo                  |
| ------------- | ---------------------------------------- | ----------------------------------- |
| accordion     | ❌                                       | accordion                           |
| alert         | ❌                                       | alert                               |
| animated-text | ✅ (parcial)                             | text-effect / text-gradient         |
| area-chart    | ⏳ (parcial) / ❌ (maioria)              | area-chart / chart                  |
| autocomplete  | ✅ já trazido                            | autocomplete                        |
| avatar        | ✅ já trazido / ❌ (resto)               | avatar                              |
| badge         | ⏳ (parcial) / ❌ (maioria)              | badge                               |
| bar-chart     | ✅ (parcial) / ❌ (maioria)              | bar-chart / chart                   |
| breadcrumb    | ✅ (parcial) / ❌ (resto)                | breadcrumb                          |
| button        | ✅ (parcial) / ⏳ (parcial) / ❌ (resto) | button                              |
| button-group  | ❌                                       | button-group                        |
| calendar      | ⏳ (parcial) / ❌ (maioria)              | calendar / date-picker              |
| carousel      | ✅ (parcial) / ❌ (resto)                | carousel                            |
| checkbox      | ❌                                       | checkbox                            |
| code-block    | ⏳ (parcial) / ❌ (resto)                | code-block                          |
| collapsible   | ❌                                       | collapsible                         |
| combobox      | ⏳ (parcial) / ❌ (resto)                | select (modo combobox)              |
| command       | ❌                                       | command                             |
| context-menu  | ✅ já trazido / ❌ (resto)               | context-menu / dropdown-menu        |
| date-picker   | ❌                                       | date-picker                         |
| dialog        | ⏳                                       | modal                               |
| dropdown-menu | ⏳ (parcial) / ❌ (parcial)              | dropdown-menu                       |
| file-upload   | ✅ já trazido / ❌ (resto)               | file-upload                         |
| input         | ✅ (parcial) / ❌ (maioria)              | input                               |
| input-mask    | já resolvido (new-components)            | input                               |
| input-otp     | ❌                                       | otp-input                           |
| kbd           | ❌                                       | kbd / shortcut-key                  |
| label         | ❌                                       | label / form-field                  |
| line-chart    | ⏳ (parcial) / ❌ (maioria)              | line-chart / chart                  |
| number-ticker | já resolvido (new-components)            | animated-number                     |
| pagination    | ✅ já trazido                            | pagination                          |
| pie-chart     | já resolvido (new-components)            | pie-chart / chart                   |
| popover       | ❌                                       | popover / hover-card / rich-tooltip |
| progress      | ⏳ (parcial) / ❌ (resto)                | progress                            |
| radar-chart   | ❌                                       | radar-chart / chart                 |
| radial-chart  | já resolvido (new-components)            | radial-bar-chart / chart            |
| radio-group   | ⏳ (parcial) / ❌ (resto)                | radio                               |
| scroll-area   | ✅ (parcial) / ❌ (resto)                | scroll-area                         |
| select        | ❌                                       | select / multi-select / rich-select |
| shine-border  | já resolvido (new-components)            | card                                |
| skeleton      | ❌                                       | skeleton                            |
| slider        | ✅ (parcial) / ❌ (parcial)              | slider / range-slider               |
| sonner        | ❌                                       | toast                               |
| spinner       | ⏳                                       | spinner                             |
| switch        | ❌                                       | switch                              |
| tabs          | ✅ já trazido / ✅ (novo, parcial)       | tabs                                |
| textarea      | ✅ (parcial) / ❌ (maioria)              | textarea                            |
| tooltip       | ❌                                       | tooltip / rich-tooltip / hover-card |

### Candidatos ✅ "Trazer" — arquivo de origem específico

| Categoria     | Arquivo(s)                                        | O que trazer                                               |
| ------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| animated-text | `animated-text-01.tsx`                            | Sweep de brilho estático em texto ("shine")                |
| animated-text | `animated-text-05.tsx`                            | Wave shimmer por caractere (via `motion`)                  |
| bar-chart     | `bar-chart-04.tsx`                                | Orientação horizontal (`layout="vertical"` na origem)      |
| breadcrumb    | `breadcrumb-06.tsx`                               | Ellipsis clicável abrindo dropdown com itens colapsados    |
| button        | `button-09/10/11/12.tsx`                          | Micro-interação hover "lift" (`effect` novo)               |
| carousel      | `carousel-03.tsx`                                 | Indicador tipo contador ("1 / N")                          |
| input         | `input-06.tsx`                                    | Contador de caracteres (paridade com `Textarea.showCount`) |
| scroll-area   | `scroll-area-02.tsx`, `scroll-area-03.tsx`        | Fade nas bordas via `mask-image`                           |
| slider        | `slider-01.tsx`, `slider-02.tsx`, `slider-03.tsx` | Pré-visualização no hover (segmento de destino)            |
| tabs          | `tabs-02.tsx`, `tabs-05.tsx`, `tabs-07.tsx`       | Transição de conteúdo do painel ao trocar de aba           |
| textarea      | `textarea-07.tsx`                                 | Floating label (paridade com `Input.floatingLabel`)        |

### Candidatos ⏳ "Decisão de produto" — arquivo de origem específico

| Categoria     | Arquivo(s)                                                         | Decisão pendente                                                 |
| ------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| area-chart    | `area-chart-05.tsx`                                                | Interpolação `step` no path SVG (compartilhado com line-chart)   |
| badge         | `badge-07/08/09.tsx`                                               | Glow + stagger de texto pra badge de status assíncrono           |
| button        | `button-01/16/17/19.tsx` (fill/reveal), `button-02/03.tsx` (shine) | Qual família de efeito "wow" no hover canonizar                  |
| calendar      | `calendar-04/06/09.tsx`                                            | `Calendar` standalone ganhar `mode="range"`/`"multiple"`         |
| code-block    | `code-block-05.tsx`, `code-block-06.tsx`                           | Modo abas (por arquivo / por linguagem) no `CodeBlock`           |
| combobox      | `combobox-04.tsx`, `combobox-05/06.tsx`                            | Grupos e ícone por opção no modo `combobox`                      |
| dialog        | `dialog-01..06.tsx`                                                | Variedade de direção de entrada no `Modal` default               |
| dropdown-menu | `dropdown-menu-01.tsx`                                             | Slot de header (avatar+nome+email) no menu                       |
| line-chart    | `line-chart-01.tsx`                                                | `ReferenceLine` (linha de meta/média)                            |
| progress      | `progress-04.tsx`                                                  | Modo `indeterminate`                                             |
| radio-group   | `radio-group-03/04/06.tsx`                                         | `RadioGroup` estilo card/lista (checar overlap com pricing-card) |
| spinner       | `spinner-07.tsx`                                                   | Variante visual "orbital"                                        |
