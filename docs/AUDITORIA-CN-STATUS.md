# Auditoria Kikito CN — Status e Continuação

> Ler isto + [CLAUDE.md](../CLAUDE.md) (raiz do projeto) antes de continuar. Não assumir nada que não esteja aqui confirmado — vários achados abaixo são "confirmado" vs "suspeito, não testado", tratados como categorias diferentes de propósito.

## Objetivo

Validar sistematicamente os ~200 componentes `src/components/ui/cn/**` contra as regras do CLAUDE.md, usando `/validate-component <grupo>/<nome>` (9 gates: estrutura, cor, tipografia, componentes internos, a11y, dark/light, build, showcase, Playwright).

---

## Concluído — 9 gates completos, commitado e pushado (commit `dfc7c49`, origin/main)

| Componente      | Achados corrigidos                                                                                                                                                                                                                                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inputs/button` | `bg-white/20` → `bg-current/20` na barra de progresso do hold-confirm                                                                                                                                                                                                                                                                                                         |
| `inputs/badge`  | `text-[0.625rem]` sem exceção documentada; `primary/soft`/`primary/dot` usavam `text-patina` em vez de `text-patina-soft-fg` (único das 7 intents errado)                                                                                                                                                                                                                     |
| `inputs/input`  | **Hydration crash real** (contador global `let _uid` → `useId()`); 6 demos ausentes no showcase (Password/Search/Number/FloatingLabel Input); 3 gaps de a11y (Currency sem id/htmlFor, Phone sem aria-label, Number sem aria-invalid)                                                                                                                                         |
| `inputs/select` | **RichSelect e MultiSelect eram 100% inacessíveis por teclado** (sem role/aria/nav por seta) — implementado listbox/combobox completo nos 4 modos; `aria-controls` do Combobox apontava pra id fixo e duplicado entre instâncias → `useId()`; `shadow-[var(--ks-shadow-md)]` quebrado (var nunca definida) → substituído por valor literal igual ao usado no resto do arquivo |
| `display/card`  | `var(--ks-raised)` não existe (é `--ks-lacquer-raised`) — GlowCard/GradientBorder com fundo transparente/quebrado                                                                                                                                                                                                                                                             |
| `data/table`    | Botão-dentro-de-botão (HTML inválido, teclado nunca alcançava); 3 `onClick` sem `tabIndex`/`onKeyDown` (tr clicável + 2 th sortáveis); 3 `<Checkbox>` sem `aria-label`; botão "Reset" virou `<Button>` CN                                                                                                                                                                     |

Todos os 6: typecheck limpo, Playwright verde, registry rebuildado, dark/light confirmado no browser.

### `display/tabs` — concluído nesta sessão (ainda não commitado no momento de escrever isto, ver "Estado git atual")

- Gate 1: import repetido `import("./tabs.types").TabItem` (4x) → import top-level único
- Gate 2: `rounded-t-[--radius-sm]` (sintaxe de colchete cru, inválida — ver achado #3 abaixo) → `rounded-t-(--radius-sm)`
- Gate 3: `text-[1em]` dos ícones documentado como exceção válida (herda tamanho do pai, não é valor fixo fora de escala)
- Gate 5 (**gap real de a11y encontrado e corrigido**): tablist não tinha navegação por seta (ArrowLeft/ArrowRight/Home/End), exigida pelo padrão WAI-ARIA APG pra `role="tablist"`. Implementado com ativação automática (seta move foco E já seleciona a tab) + roving tabindex (`tabIndex={0}` só na tab ativa, `-1` nas demais)
- Gate 9: criado `e2e/cn/display/tabs.spec.ts` (5 testes: crash/dark/console/click/**navegação por teclado**) — **10/10 passando em chromium-desktop + mobile-chrome**. Firefox falha por binário ausente na máquina (`npx playwright install` nunca rodado pra firefox) — ambiental, não é bug do componente, não bloqueia.
- **Achado de infraestrutura durante a validação**: o Browser pane usado pra verificação visual serviu reiteradamente uma versão desatualizada do bundle (onClick funcionando mas onKeyDown ausente do fiber, confirmado via `element.__reactProps$*`), mesmo após restart completo do dev server e `rm -rf .next`. Playwright (browser isolado, fora do Browser pane) confirmou o comportamento correto de cara. **Conclusão prática: para verificar comportamento JS/interatividade em componentes CN daqui pra frente, preferir Playwright a inspeção manual via Browser pane** — o pane é confiável pra CSS/visual mas mostrou-se não confiável pra estado de handlers JS nesta sessão.

---

## Achados de infraestrutura — JÁ CORRIGIDOS

1. `--color-canvas` (kikitocn-tokens.css) apontava pra `--neutral` (cor de intent, inverte de propósito) em vez de `--background` → `bg-canvas` ficava ilegível no light mode. Afetava 15 arquivos.
2. `--ks-raised` referenciado mas nunca definido (nome certo: `--ks-lacquer-raised`).
3. Escala de spacing semântica redefinida — ancorada 1:1 nos steps numéricos do Tailwind já dominantes no código real (auditoria de frequência de uso, não invenção). Ver CLAUDE.md seção Spacing.
4. **Repo GitHub `devjuanmarcos/kikito-tv-oficial` estava PRIVADO** — o CLI publicado no npm (`kikitocn@1.1.0`) faz fetch anônimo em `raw.githubusercontent.com`, que retorna 404 pra repo privado. Ou seja: `npx kikitocn add <qualquer-coisa>` estava quebrado pra **todo mundo**, não só desalinhado. Tornado público hoje, verificado ao vivo (`curl` direto na URL real) que reflete os fixes de hoje.

---

## Achados de infraestrutura — PENDENTES (não resolvidos, cuidado ao mexer)

### 1. Classe `rounded` sem sufixo — não tokenizada

Resolve pro `--radius` **nativo** do Tailwind (4px), não pra nenhum token deste projeto. Confirmado via computed style real. Só corrigido em `Table.tsx` até agora. Grep de 2026-08-26 achou em ~30 arquivos (lista não re-verificada hoje, pode ter mudado): Alert, Avatar (é um type string, falso-positivo), CnInstallBlock, Banner, Command, CodeBlock, Fab, CreditCard, EventCalendar, DatePicker (4x), FloatingBar, ImageCompare (2x), VideoCard, InlineEdit (2x), LogViewer, NoticeBar, Select (linha 459, ainda não migrada), NotificationBell, Tooltip (2x), Stat (3x), Toast, SwipeCard (2x). **Reconfirmar com grep antes de corrigir cada um** (regex usada: `"[^"]*\brounded\b[^"-][^"]*"|"[^"]*\brounded"` no path do componente).

### 2. `--ks-shadow-md/lg/xl` referenciado mas nunca definido — ✅ FECHADO

Sombra saía vazia/inválida (propriedade `shadow-[var(--ks-shadow-*)]` com var inexistente). **Corrigido em `Select.tsx`, `Autocomplete.tsx`, `Command.tsx`, `DropdownMenu.tsx`** — os 4 arquivos confirmados agora usam valor literal (mesmo padrão de sombra elevada repetido em todos). Nenhuma decisão de criar uma escala `--ks-shadow-*` de verdade foi tomada — se aparecer mais um caso, resolver do mesmo jeito (literal) até decidirmos criar o token.

Não existe token de shadow/elevação no design system ainda (nem `--shadow-sm` nem nada parecido em `kikitocn-tokens.css`). Isso é uma decisão de escopo tipo a de spacing — **perguntar ao usuário antes de inventar uma escala nova**, ou seguir o padrão ad-hoc já usado em outros lugares do Select.tsx (`shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)]` etc) como fix pontual sem criar token novo.

### 3. Sintaxe `<util>-[--var]` (colchete cru, sem `var()`) — CONFIRMADO quebrado pra utilities direcionais/compostas

Tailwind v4 tem um shorthand documentado onde `algo-[--foo]` vira automaticamente `algo: var(--foo)` — **mas isso NÃO funciona pra utilities direcionais tipo `rounded-t-`, `rounded-r-`** (testado empírico: `rounded-t-[--radius-sm]` dava `0px` real numa página renderizada; trocando pra `rounded-t-(--radius-sm)` (parênteses) deu `6px` correto).

**Confirmado quebrado e corrigido hoje:**

- `src/components/ui/cn/tabs/Tabs.tsx:76` — `rounded-t-[--radius-sm]` → `rounded-t-(--radius-sm)` ✅ (verificado 6px real)

**Confirmado quebrado, AINDA NÃO corrigido:**

- `src/components/ui/cn/price-table/PriceTable.tsx:26` — `rounded-t-[--radius-md]`
- `src/components/ui/cn/markdown-renderer/MarkdownRenderer.tsx:45` — `rounded-r-[--radius-sm]`

**Suspeito, NÃO testado ainda** (usa `--radius` sem sufixo nenhum — que também não é um token que existe; token real seria `--radius-base` etc):

- `src/components/ui/cn/context-card/ContextCard.tsx:34` — `rounded-[--radius]`
- `src/components/ui/cn/status-page/StatusPage.tsx:73` — `rounded-[--radius]`
- `src/components/ui/cn/theme-selector/ThemeSelector.tsx:31` — `rounded-[--radius]`
- `src/components/ui/cn/tooltip/Tooltip.tsx:280` — `rounded-[--radius]` (+ `shadow-lg` bare, mesmo bug da categoria "rounded bare" mas pra shadow)

**Não testado, provavelmente OK** (shorthand simples sem direção, mais chance do auto-var do Tailwind v4 funcionar — mas NÃO confirmar de cabeça, testar cada um numa página real antes de mexer):
`AvatarGroup.tsx` (`w-[--ag-sz]`, `text-[length:--ag-fs]`), `Alert.tsx` (`text-[--alert-ic]`), `Banner.tsx` (`text-[--ks-info]` etc), `Callout.tsx` (`bg-[--i-soft]`, `text-[--i-fg]` etc), `Checklist.tsx` (`bg-[--c]`, `text-[--c-fg]`), `Pagination.tsx` (`h-[--pg-h]`, `text-[length:--pg-fs]`).

**Método de teste obrigatório** (não pular): abrir a página REAL do componente no browser (a classe precisa já estar compilada no bundle daquela página — criar elemento dinâmico via JS numa página que não usa a classe dá falso negativo, Tailwind não gera CSS pra classe que não escaneou), rodar `getComputedStyle` no elemento real via `javascript_tool`, comparar contra o valor esperado do token.

---

### `overlays/tooltip` — concluído

Grupo real é **`overlays`**, não `display` (confirmado via `cn-registry.tsx` — não assumir grupo pelo nome, checar sempre).

- Gate 1: não tinha `tooltip.types.ts` — criado, tipos extraídos do `.tsx`
- Gate 2: `text-base` (era pra ser `text-canvas` — bug real: texto do tooltip simples não tinha cor definida contra `bg-foreground`, herdava ambiente) → `text-canvas`; `rounded-[5px]` → `rounded-(--radius-sm)`; `rounded-[--radius]` (var inexistente, 2 ocorrências: RichTooltip bubble + `ContextCard.tsx` standalone) → `rounded-(--radius-md)`; `rounded` bare (2×, botões de fechar do Popover) → `rounded-(--radius-xs)`
- Gate 3: `leading-[1.5]` → `leading-normal`
- Gate 5: `SimpleTooltip` e `RichTooltip` não tinham `aria-describedby` ligando trigger↔tooltip (gap real de a11y, AT não anunciava o conteúdo) — adicionado via `useId()`; `SimpleTooltip` sem Escape-to-dismiss — adicionado
- **Bug real encontrado**: `HoverCardImpl` (variant="card") destructurava `className` mas nunca aplicava no `cn(...)` do portal — prop do consumidor era descartada silenciosamente. Corrigido.
- Família de wrappers backward-compat (`popover/`, `hover-card/`, `rich-tooltip/`) — checados, são thin delegates pro `Tooltip`, sem violação própria
- `ContextCard.tsx` (componente standalone, NÃO delega pro Tooltip) — fix pontual do achado #3 pendente (`rounded-[--radius]`) aplicado de passagem, mas **não recebeu os 9 gates completos** — fica pendente pra quando for a vez dele na fila
- Gate 9: `e2e/cn/overlays/tooltip.spec.ts` novo (4 testes) — 8/8 em chromium-desktop + mobile-chrome

### `overlays/modal` — concluído

Também grupo **`overlays`**. Super component com 4 variantes (modal/alert/drawer/panel), absorve `AlertDialog`/`Drawer`/`SidePanel`.

- Gate 1: não tinha `modal.types.ts` — criado
- Gate 2: `bg-[color-mix(...,var(--ks-danger)_12%,...)]` etc (3×, ícone do Alert) recriava manualmente o padrão que já existe como token → `bg-danger-soft`/`bg-warning-soft`/`bg-patina-soft`; `rounded-[12px]` → `rounded-(--radius-md)`; `rounded-t-[14px]`/`rounded-b-[14px]` (drawer top/bottom, exato match) → `rounded-t-(--radius-lg)`/`rounded-b-(--radius-lg)`; `bg-black/55` (3×, scrim) documentado como exceção válida (overlay é deliberadamente independente de tema)
- Gate 3: `leading-[1.45]` (2×) → `leading-normal`; `gap-[0.625rem]` (10px, 2×) sem match exato entre `--spacing-sm`(8px) e `--spacing-md`(12px) — documentado, não forçado
- Gate 4: os 2 botões de fechar (X) do `ModalDialog`/`ModalDrawer` eram `<button>` cru → viraram `<Button variant="ghost" intent="neutral" size="sm" iconOnly>`. O toggle do `ModalPanel` (tab semicircular grudado na borda) ficou como está — documentado como escala própria do componente, não encaixa no icon-only scale do Button
- **Gap real de a11y encontrado e corrigido**: nenhuma das 4 variantes tinha **focus trap** (Tab podia escapar do dialog pro conteúdo de fundo) — padrão WAI-ARIA exige isso pra `role="dialog"`/`alertdialog"`. Implementado `useFocusTrap` compartilhado (Tab/Shift+Tab presos + Escape), aplicado em `ModalDialog`, `ModalDrawer` e `ModalAlert` (esse último também não tinha focus-on-open, adicionado)
- **Bug real encontrado e corrigido**: `ModalAlert` — pressionar Escape chamava só `onClose()`, pulando `onCancel()`; clicar no overlay ou no botão Cancel chamava os dois. Agora os três caminhos de dismiss são consistentes (chamam `onCancel` antes de fechar)
- Família de wrappers (`alert-dialog/`, `drawer/`, `side-panel/`) — checados, thin delegates, sem violação própria
- Gate 9: `e2e/cn/overlays/modal.spec.ts` novo (7 testes, inclui **focus trap** e Escape) — 12/12 em chromium-desktop + mobile-chrome
- Nota de teste: o painel do modal fica sempre montado no DOM (transição via CSS `opacity`+`data-open`, não unmount condicional) — mesma pegadinha do Tooltip. Asserções usam o atributo `data-open`, não `toBeVisible()/toBeHidden()`.

### `inputs/checkbox` — concluído (fecha o lote Tier-0)

- Gate 1: não tinha `checkbox.types.ts` — criado
- Gate 2: **bug real** — intent `secondary` usava `bg-foreground border-foreground` (a cor de TEXTO como fundo, não a cor de marca secundária) em vez de `bg-kinpaku border-kinpaku` — único dos 6 intents errado, mesmo padrão de "um intent fora do grupo" já visto no Badge; `text-white` (hardcoded, com override manual `text-black` só pro warning) no ícone do check → substituído por um mapa `INTENT_CHECK_FG` usando os pares `-fg` pré-validados (`text-patina-fg`, `text-kinpaku-fg` etc.) — resolve o caso do warning de graça, sem hack; `rounded-[4px]` → `rounded-sm` (6px, mais próximo do padrão de checkbox arredondado usual); `p-[2px]` → `p-(--spacing-3xs)` (match exato, 2px)
- Gate 3: `text-[0.6875rem]` (11px, tier `sm`) documentado como abaixo da escala; `leading-[1.4]` → `leading-normal`
- Gate 5 (**gap real de a11y encontrado e corrigido**): o `<input>` real fica `sr-only` (visualmente oculto) e a caixa customizada visível **não tinha nenhum anel de foco** — usuário de teclado navegando via Tab não via onde estava. Corrigido com `has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-patina` no `<span>` pai (não dá pra usar `peer-focus-visible` aqui porque o input é filho do span, não irmão — `peer-*` só funciona entre irmãos; `has-[:focus-visible]` resolve via `:has()` no pai)
- Gate 9: `e2e/cn/inputs/checkbox.spec.ts` novo (6 testes, inclui teclado e foco visível) — 12/12 em chromium-desktop + mobile-chrome. Nota de teste: o `<input>` sendo `sr-only` (1×1px) faz o Playwright falhar ao mirar clique nele direto — o teste clica no `<label>` visível (é assim que um usuário real ativa o checkbox de qualquer forma, via forward nativo do browser)

**Achado de infraestrutura NOVO, fora do escopo deste componente** — `src/app/[locale]/globals.css:33-43` tem uma regra **global, sitewide**: `:focus-visible:not(input):not(select):not(textarea):not([role="combobox"]):not([role="listbox"]) { outline: 1px solid hsl(var(--brand-primary-mid)); ... }` — isso é o token de cor do **dashboard legado** (`--brand-primary-mid`, não é um `--ks-*`) vazando como outline padrão pra **qualquer elemento focável do site que não seja input/select/textarea/combobox/listbox** — incluindo praticamente todo componente CN com foco custom via `role="tab"`, `role="button"` etc. Não afeta o Checkbox (o elemento real é `<input>`, explicitamente excluído), mas pode estar competindo/vazando por trás do anel `focus-visible:outline-patina` que várias validações desta sessão (Button, Tabs, Select) já assumiram como fonte única de verdade. **Não investigado a fundo ainda — precisa de um empirical check (via Playwright, não Browser pane) pra ver se o outline do CN realmente ganha na cascata ou se o cinza/azul do dashboard aparece por trás/depois.** Isso é exatamente o tipo de mistura de vocabulário que o CLAUDE.md pede pra nunca acontecer — registrar aqui e decidir com calma antes de mexer (é uma regra global, qualquer fix afeta o site inteiro, não só CN).

### `inputs/autocomplete` — concluído

Grupo real é **`inputs`**, não `overlays` (verificado, não assumido).

- Gate 1: já tinha `.types.ts` — ok
- Gate 2: `shadow-[var(--ks-shadow-md)]` (var indefinida, achado #2 da lista de pendências) → literal igual ao padrão já usado no Select
- Gate 3: já limpo (só tokens de tipografia)
- Gate 5 (**3 gaps reais de a11y corrigidos**): `<label>` sem `htmlFor` e `<input>` sem `id` (label nunca associado, AT não anunciava); `aria-controls="autocomplete-listbox"` apontava pra um ID que **não existia** no DOM (a listbox não tinha `id` nenhum) — corrigido com `useId()`; `aria-activedescendant` **não existia** — durante navegação por seta a opção destacada nunca era anunciada pro AT, apesar do destaque visual funcionar. Todos os três corrigidos.
- Gate 3/spacing: `gap-1`(4px)→`gap-(--spacing-2xs)` exato; `py-3 px-4`(empty state)→tokens exatos; `px-3`(linha de opção)→`px-(--spacing-md)` exato; `gap-[10px]`/`py-[9px]` sem match exato, documentado; `SIZE_INPUT` (px por tier) documentado como escala própria do componente, não migra
- Gate 9: `e2e/cn/inputs/autocomplete.spec.ts` novo (6 testes, inclui `aria-activedescendant`) — 12/12 chromium-desktop + mobile-chrome

### `overlays/command` — concluído

Super component com 3 variantes (palette/bar/spotlight), absorve `CommandBar` e `SpotlightSearch` (backward-compat wrappers, cada um com sua própria página de showcase — não receberam spec próprio, mesma lógica do `Command.tsx` já testada via `command.spec.ts`).

- Gate 2: `shadow-[var(--ks-shadow-xl)]` (achado #2 da lista de pendências, agora só falta `DropdownMenu`) → literal; `bg-[color-mix(...,var(--ks-primary)_12%,...)]` recriava manualmente `bg-patina-soft` → trocado pelo token; `rounded` bare (1×) e `rounded-[4px]` (2×) → `rounded-(--radius-sm)`; `animate-[--animate-fade-in]` removido — classe morta/redundante, a animação real já vinha 100% de um `style` inline (`animationName: "ks-cmd-in"`) que sempre ganhava da classe Tailwind
- Gate 3: 4× `text-[0.625rem]` documentados (eyebrows de grupo, badge ESC, glyph de kbd)
- Gate 5 (**gaps reais de a11y corrigidos nas 3 variantes**): nenhuma das três (`palette`, `bar`, `spotlight`) tinha `aria-activedescendant` — a navegação por seta already funcionava visualmente mas nunca era anunciada pro AT; `aria-controls`/`role="combobox"`/`aria-expanded` também ausentes nos 3 inputs; a variante `bar` (o `CommandBarImpl`) estava a mais crua das três — resultado sem `role="listbox"`/`role="option"`/`aria-selected` nenhum. Todas as 3 agora têm o wiring completo via `useId()` por instância (sem risco de colisão entre múltiplas paletas na mesma página, como o showcase realmente tem)
- Gate 9: `e2e/cn/overlays/command.spec.ts` novo (6 testes: crash/dark/console/⌘K abre-fecha/filtro+seleção+activedescendant) — 10/10 chromium-desktop + mobile-chrome. Nota de teste: a página de showcase embute o variant `bar` inline na mesma página (seção "Unificados") com o mesmo `role="listbox"` — os testes escopam os locators ao `role="dialog"` da paleta pra não pegar o outro

### `overlays/dropdown-menu` — concluído

Super component com 3 variantes (click/contextmenu/hover), absorve `ContextMenu` e `FloatingMenu`.

- Gate 1: não tinha `.types.ts` — criado. `floating-menu/FloatingMenu.tsx` (wrapper) também não tinha — criado de passagem
- Gate 2: `shadow-[var(--ks-shadow-lg)]` (achado #2, **agora fechado, era o último confirmado**) → literal; `hover:bg-[color-mix(...,var(--ks-primary)_10%,...)] hover:text-patina` (2×) → `hover:bg-patina-soft hover:text-patina`; `hover:bg-[color-mix(...,var(--ks-danger)_10%,...)]` (2×) → `hover:bg-danger-soft`; `rounded-[5px]` (2×) → `rounded-(--radius-sm)`; `text-base` no ícone do HoverMenu (banido, era pra ser tamanho, não cor) → `text-body-paragraph` (match exato 1rem)
- Gate 3: spacing — sweep quase completo do arquivo (`gap-2`→sm, `px-2`→sm, `px-3`→md, `py-1.5`→xs, `py-2`→sm, `py-1`→2xs, `p-1`→2xs, `mb-1`/`my-1`/`mx-1`/`pb-1`→2xs); `py-[7px]` (×2) e `gap-2.5` documentados (sem match exato); 3× `text-[0.625rem]`/`text-[0.6875rem]` documentados
- Gate 5 (**gap real de a11y corrigido**): o trigger do `ClickMenu` não tinha `aria-haspopup`/`aria-expanded`/`aria-controls` — padrão WAI-ARIA menu button. Corrigido via `useId()`. Nota: navegação por seta (Up/Down) **dentro** do menu aberto não foi implementada — os itens são `<button>` reais, então Tab já alcança cada um nativamente (não é "quebrado", só não é o idioma ARIA completo de menu); registrado como melhoria futura, não bloqueante
- **Achado colateral importante**: durante a checagem do Gate 8, descobri que **`overlays/dropdown-menu` não tinha demo nenhuma no showcase** (nem função, nem entrada no mapa `DEMOS`) — a página real provavelmente quebrava/ficava vazia pra usuários reais. Investigando o mesmo padrão achei mais dois: `overlays/floating-menu` (a função `FloatingMenuDemo` existia mas nunca foi wireada no mapa `DEMOS`) e `display/hover-card` (nem função existia). Corrigi os 3 agora. **Rodando o lint no arquivo de showcase inteiro achei ~35 outras funções `XyzDemo` definidas e nunca usadas** (warning `no-unused-vars` do eslint) — ou seja, o mesmo bug provavelmente se repete em dezenas de componentes espalhados pelo showcase inteiro. **Não investigado/corrigido — é um achado novo, separado, que merece sua própria varredura dedicada** (rodar `npx eslint` no arquivo de showcase e cruzar cada `XyzDemo` não usado com seu registro em `cn-registry.tsx` pra descobrir se falta o import, a função, ou só a entrada no mapa).
- Gate 9: `e2e/cn/overlays/dropdown-menu.spec.ts` novo (5 testes, inclui aria-haspopup/expanded) — 10/10 chromium-desktop + mobile-chrome. `floating-menu`/`hover-card` verificados só por smoke-check (curl 200, sem spec dedicado — são wrappers finos, mesmo padrão usado pra Popover/HoverCard/RichTooltip no passe do Tooltip)

## Fila restante

`Tabs` ✅ → `Tooltip` ✅ → `Modal` ✅ → `Checkbox` ✅ — **lote Tier-0 completo** (Button, Badge, Input, Select, Card, Table, Tabs, Tooltip, Modal, Checkbox, todos commitados e pushados).

Continuado depois do Tier-0, seguindo pelos componentes com `--ks-shadow-*` quebrado (mesma família de achado, contexto quente): `Autocomplete` ✅ → `Command` ✅ → `DropdownMenu` ✅ — **lista de `--ks-shadow-*` pendente agora fechada** (achado #2 resolvido nos 4 arquivos).

### Achado grande — 33 páginas de showcase quebradas/em branco, ✅ FECHADO

Investigação completa (não só os 3 achados de passagem durante o DropdownMenu). Rodei `npx eslint` no `_showcase.tsx` inteiro, extraí toda função `XyzDemo` marcada "defined but never used", e cruzei cada uma com `cn-registry.tsx` (componente existe? qual grupo real?) e com o mapa `DEMOS` (a chave `grupo/nome` já está wireada sob outro nome, ou falta mesmo?). Resultado: **31 componentes publicados, com demo já escrita, nunca conectados ao mapa `DEMOS`** — mesma causa raiz de `floating-menu`/`hover-card`. Nenhum caso de "componente não existe" ou "já wireada sob outro nome" — todos os 31 eram gap puro de wiring, fix de uma linha cada.

Lista corrigida (todas verificadas via `curl` retornando 200, sem texto de error boundary): `display/accordion-group`, `layout/aspect-ratio`, `inputs/calendar`, `display/chat-bubble`, `inputs/chip-group`, `display/dot-stepper`, `inputs/fab`, `display/feature-list`, `layout/floating-bar`, `inputs/form-field`, `display/keyboard-shortcuts`, `display/media-player`, `display/metric-card`, `layout/navigation-menu`, `display/note-card`, `feedback/notification-bell`, `feedback/onboarding-tour`, `display/password-strength`, `display/pricing-card`, `display/progress-steps`, `inputs/rating-input`, `display/receipt-card`, `display/ribbon`, `inputs/signature-pad`, `layout/sortable-list`, `display/stats-card`, `display/tag-cloud`, `display/terminal-block`, `inputs/text-editor`, `display/timeline-progress`, `layout/vertical-nav`, `display/window-frame`.

Contando os 3 achados de passagem do DropdownMenu, **34 páginas reais foram desquebradas nesta sessão**. `npx eslint` no arquivo agora dá zero warnings de `XyzDemo` não usada.

**Nota**: isso é só showcase/CLI-demo — não mexe no componente em si (não precisa `registry:build`, não passa pelos gates 1-7/9). É puramente Gate 8 de 31 componentes que nunca tinham sido tocados por esta auditoria — **eles ainda precisam da passada completa de 9 gates quando chegar a vez deles na fila**.

### `overlays/context-card` — concluído

Componente isolado (não delega pro Tooltip), pequeno (43 linhas), único trigger é hover/focus via CSS puro (`:hover`/`:focus-within`, zero JS).

- Gate 1: já tinha `.types.ts` — ok. Convertido aspas simples → duplas (convenção do resto do projeto)
- Gate 2: `shadow-lg` bare → literal padrão dos outros painéis flutuantes do CN (mesmo usado em Select/Command/DropdownMenu), pra consistência
- Gate 5 (**gap real de a11y encontrado e documentado, não "corrigido" por completo**): a revelação depende de `:focus-within` no wrapper — se `trigger` não for um elemento nativamente focável, **usuário de teclado não consegue abrir o popup, ponto final**. Confirmado ativamente quebrado na própria demo do showcase (`trigger` era um `<span>` sem foco nativo). Duas ações tomadas: (1) JSDoc no componente documentando a exigência e recomendando `<Tooltip variant="card">` (já 100% acessível, ver seção Tooltip) como alternativa quando o trigger não for focável nativamente; (2) a demo do showcase trocou `<span>` por `<button type="button">` (reset de estilo, sem `tabIndex` manual — colocar `tabIndex` num elemento não-interativo é o próprio erro de a11y que `jsx-a11y/no-noninteractive-tabindex` bloqueou no pre-commit da primeira tentativa) pra não ensinar o padrão quebrado. **Não fiz a reescrita completa pra JS** (o que resolveria de vez, igual ao `HoverCardImpl` do Tooltip) — seria essencialmente duplicar a variante `card` do Tooltip; a decisão de aposentar `ContextCard` em favor de `<Tooltip variant="card">` fica pra quando/se formos revisar a lista de "absorvidos" do Tooltip
- `delay` prop: existe no tipo mas nunca foi implementada (revelação é 100% CSS, sem debounce) — marcada `@deprecated` no JSDoc do tipo em vez de removida (evita quebrar consumidores que já passam a prop)
- Gate 9: `e2e/cn/overlays/context-card.spec.ts` novo (4 testes, inclui **revelação por teclado**, confirma que o fix do trigger na demo funciona) — 8/8 chromium-desktop + mobile-chrome

## Achado grande — outline global do dashboard vazando em TODO componente CN com foco customizado — ✅ FECHADO

Investigado a fundo (2026-08-27). Confirmação empírica em 3 camadas:

1. `src/app/[locale]/globals.css:33-43` tinha uma regra **sem `@layer`** (unlayered): `:focus-visible:not(input):not(select):not(textarea):not([role="combobox"]):not([role="listbox"]) { outline: 1px solid hsl(var(--brand-primary-mid)); }` — `--brand-primary-mid` é `168, 68%, 19%` (verde do dashboard legado), nada a ver com `--ks-patina` (`hsl(var(--primary))`, dourado).
2. Regra do CSS Cascade Layers: **estilo fora de qualquer `@layer` sempre vence estilo dentro de `@layer`, independente de especificidade.** As utilities do Tailwind (`focus-visible:outline-patina` etc., usadas em Button/Tabs/Modal/DropdownMenu/Command/Select) vivem dentro de `@layer utilities` — ou seja, **sempre perdiam** pra essa regra global, mesmo com uma classe utilitária explícita apontando pro token certo.
3. **Confirmado via computed style real** (Playwright, não Browser pane — método já estabelecido nesta sessão): antes do fix, `Button` focado mostrava `outline-color: rgb(16, 81, 68)` (o verde `--brand-primary-mid`) e `outline-width: 1px`, apesar do componente ter `focus-visible:outline-2 focus-visible:outline-patina` no código. Depois do fix: `outline-color: rgb(255, 208, 0)` (correto, `--ks-patina` no tema atual) e `outline-width: 2px`.

**Fix**: envolvido as duas regras (linhas 33-43) num `@layer base { ... }`. Como a ordem de layers do Tailwind v4 é `theme, base, components, utilities`, qualquer utility (`focus-visible:outline-*`) agora bate a regra de base automaticamente — sem precisar tocar em nenhum componente individual. Regressão zero: componentes **sem** override próprio (ex: `Tabs`, que nunca teve um `focus-visible:outline-patina` seu) continuam recebendo o verde de fallback exatamente como antes — confirmado via Playwright (`rgb(16, 81, 68)` sem mudança no Tabs) — e a suite de 20 testes de foco/interação (`checkbox`, `button`, `modal`, `tabs`) passou 20/20 depois do fix.

**Achado colateral, não corrigido, prioridade menor**: `Tabs` (e provavelmente outros componentes com foco customizado por `role`, tipo `role="tab"`/`role="menuitem"`) **nunca tiveram um `focus-visible:outline-patina` próprio** — sempre dependeram só do fallback verde do dashboard, mesmo antes deste bug existir. Isso não é uma regressão do fix de hoje, é uma lacuna de cobertura pré-existente: decidir se vale a pena adicionar o anel de foco patina explicitamente nesses componentes também, componente a componente, na próxima rodada.

## Continuando a fila geral — Super components sem os 9 gates

`docs/UNIFICACAO-COMPONENTES.md` **não é uma fila de validação** — é o plano (já concluído) de absorver componentes-irmãos em Super components pra reduzir a sidebar. Nenhuma das duas coisas tem uma "ordem geral" pronta; a fila de validação de 9 gates é só o que está registrado aqui neste doc. Retomando pelos Super components ainda sem 9 gates completos, por serem os que afetam mais páginas de uma vez (cada um tem irmãos absorvidos que herdam o fix).

### `inputs/toggle-group` — concluído

Super component com 4 variantes (outline/solid/ghost base, segmented, chip, filter), absorve `SegmentedControl`, `ChipGroup`, `FilterBar`.

- Gate 1: não tinha `.types.ts` — criado. Achado um `ToggleGroupAllProps` duplicado (definido tanto no novo arquivo de tipos quanto ainda solto no `.tsx`) — removida a duplicata
- Gate 3: `text-sm` cru (banido, era exatamente `text-body-callout`) e `text-[0.75rem]` (match exato `text-body-caption`) no `CHIP_SIZE_CLS` → corrigidos; `text-[0.6875rem]`/`text-[0.7rem]` (3 ocorrências, tiers `sm` de 3 escalas diferentes) documentados como abaixo do mínimo da escala
- Gate 3/spacing: `gap-2`/`px-3`/`gap-1` estruturais (não ligados a tier de tamanho) → tokens exatos; `gap-[6px]` → match exato `--spacing-xs`; `gap-[5px]`/`py-[5px]`/`px-[10px]` documentados (sem match exato). As escalas por tamanho (`SIZE_BTN`, `SEG_SIZE_*`, `CHIP_SIZE_CLS`) ficaram como estão — escala própria do componente, mesmo critério do `PADDING_CLS` do Card citado no CLAUDE.md
- Gate 5 (**gap real de a11y encontrado e corrigido**): a variante `filter` (`FilterToggleGroup`) era a única das 4 sem `role="group"` no wrapper e sem `aria-pressed` nos botões de opção — usuário de leitor de tela não tinha nenhuma indicação de quais filtros estavam ativos. As outras 3 variantes (base/segmented/chip) já tinham os dois corretamente
- Família de wrappers (`segmented-control/`, `chip-group/`, `filter-bar/`) — checados, thin delegates, sem violação própria
- Gate 9: `e2e/cn/inputs/toggle-group.spec.ts` novo (5 testes, inclui single exclusivo vs multiple acumulativo) — 10/10 chromium-desktop + mobile-chrome. Fix do `filter` confirmado à parte via smoke-check no `inputs/filter-bar` (aria-pressed correto nas duas instâncias da demo)

### `display/stat` — concluído

Super component com 3 modos (single/metric/grid), absorve `MetricCard`, `StatsCard`. Já tinha `.types.ts` (Gate 1 ok).

- Gate 3: `text-2xl` (banido, match exato `text-heading-05`), `text-xl` (match exato `text-body-title`, 2×) e `text-lg` (mapeado pra `text-body-title`, ícone de grid) → corrigidos nos 3 modos
- Gate 3/spacing: sweep quase completo — sem escala própria por `size` neste componente (não tem prop `size`), então quase tudo é estrutural: `gap-3`/`px-6`/`gap-2`/`gap-1`/`pt-2`/`p-4`/`gap-1.5`/`py-4`/`py-0.5`/`px-2` → tokens exatos; `py-5`/`px-5`(×2)/`gap-[3px]` documentados (sem match exato na escala 0.5–12)
- Gate 5 (**gap real de a11y encontrado e corrigido**): os estados `loading` (`SingleStat` e `MetricStat`, ambos trocam conteúdo real por skeleton `animate-pulse`) não tinham `aria-busy` — leitor de tela não tinha nenhuma indicação de que o card estava carregando. Adicionado `aria-busy={loading}` no wrapper das duas
- Família de wrappers (`metric-card/`, `stats-card/`) — checados, thin delegates, sem violação própria
- Gate 9: `e2e/cn/display/stat.spec.ts` novo (4 testes) — 8/8 chromium-desktop + mobile-chrome

### `display/timeline` — concluído

Super component com 4 famílias (`variant`): `default`/`compact`/`reverse` (clássico), `scroll` (absorve `ScrollTimeline`), `progress` (absorve `TimelineProgress`), `activity` (absorve `ActivityFeed`). Já tinha `.types.ts` (Gate 1 ok).

- Gate 2: nenhum hex/hsl/rgb cru, nenhuma sintaxe `-[--var]` quebrada, nenhum `rounded` bare
- Gate 3: `text-xs` (banido, match exato `text-body-caption`) e `text-sm` (banido, ×2, match exato `text-body-callout`) na família `progress` → corrigidos
- Gate 3/spacing: sweep quase completo nas famílias `default`/`scroll`/`progress` (nenhuma tem prop `size`) — `my-1`/`gap-3`/`pt-1`/`gap-2`(×2)/`mt-1`/`py-2`/`gap-4`/`mb-8`/`px-4`/`py-3`/`mb-1`(×2)/`mx-2`/`pb-6`/`pt-1.5`/`mt-2` → tokens exatos; `mt-[0.625rem]` documentado (sem match exato). Dois casos tratados como escala própria do componente (não migrados, documentados): `pb-0`/`pb-[0.875rem]`/`pb-6` por variante `compact`/`default` na família clássica, e o `pad` (`py-2 gap-[10px]` vs `py-3 gap-3`) por densidade `compact` na família `activity` — mesmo critério do `PADDING_CLS` do Card citado no CLAUDE.md
- Gate 5 (**gaps reais de a11y encontrados e corrigidos**):
  1. Ícones de status decorativos (`CheckIcon`/`ActiveIcon`/`PendingIcon`/`ErrorIcon`/`WarnIcon` da família clássica, `ActivityDefaultIcon` da família `activity`) não tinham `aria-hidden="true"` — inconsistente com os ícones da família `progress` (`ProgressCheckIcon`/`ProgressXIcon`) que já tinham. Adicionado em todos
  2. Família `progress`: o passo `current` não tinha `aria-current="step"` — leitor de tela não conseguia identificar qual etapa está ativa num indicador só-visual. Adicionado
  3. Família `activity`: os três containers de avatar/ícone (imagem, fallback com inicial, ícone) não tinham `aria-hidden="true"` — informação já duplicada no texto (`title`/`description`), então o avatar é puramente decorativo. Adicionado
- Wrappers (`scroll-timeline/`, `timeline-progress/`, `activity-feed/`) — checados, thin delegates, sem violação própria
- Gate 8: as 3 famílias absorvidas já tinham demo própria no showcase (`display/scroll-timeline`, `display/timeline-progress`, `display/activity-feed`), além de `display/timeline` pra família clássica — todas cobertas
- Gate 9: `e2e/cn/display/timeline.spec.ts` novo (10 testes cobrindo as 4 rotas + dark mode + `aria-current`) — 20/20 chromium-desktop + mobile-chrome (firefox-desktop falha por falta do executável Firefox no ambiente, pré-existente, não relacionado)

### `feedback/progress` — concluído

Super component com 4 formas (`shape`/`mode`): `bar` (default, linear), `ring` (absorve `ProgressRing`), `gauge` (absorve `Gauge`), `skill-list` (absorve `SkillBar`). Mais o componente irmão standalone `ProgressSteps` (indicador de passos numerados, distinto do `variant="progress"` do `Timeline` — este é percentual/circular, aquele é sequência de etapas).

- Gate 1: nem `Progress.tsx` nem `ProgressSteps.tsx` tinham `.types.ts` — tipos estavam inline no `.tsx`. Criados `progress.types.ts` e `progress-steps.types.ts`, `.tsx` e `index.ts` atualizados pra importar de lá. `ProgressSteps.tsx` também estava com aspas simples e indentação fora do padrão do projeto (nunca tinha passado pelo prettier) — normalizado
- Gate 2: nenhum hex/hsl/rgb cru, nenhum `rounded` bare (só `rounded-full`/`rounded-pill`, ambos válidos). Documentado `rgba(255,255,255,0.18)` do glare listrado do `ProgressBar` animado como exceção válida (glare precisa ser branco literal, independente do tema)
- Gate 3: `ProgressSteps`: `text-xs`/`text-sm` cru (banidos, matches exatos `text-body-caption`/`text-body-callout`) no `SIZE_CIRCLE` → corrigidos; `text-[0.6rem]`/`text-[0.7rem]`/`text-[0.65rem]` documentados como abaixo do mínimo da escala (tier `sm`, micro-labels). `Progress` (shape `gauge`): `fontSize` inline via `style=` (banido) pro valor numérico — convertido pra classes de tipografia por tier (`GAUGE_VALUE_TEXT_CLS`, matches exatos 12/16/20px → `text-body-caption`/`text-body-paragraph`/`text-body-title`); um `style={{fontSize:10}}` isolado (label `/max`) → `text-[10px]` documentado abaixo do mínimo. Shape `ring`: `fontSize` proporcional a um `size` numérico livre (não enum) — sem token possível, documentado
- Gate 3/spacing: `Progress` (bar/ring/gauge/skill-list) — `gap-1`/`gap-2`/`mt-0.5`/`gap-[6px]`(×2) → tokens exatos; `gap-[14px]` documentado (sem match exato). `ProgressSteps` — `gap-3`/`mx-2`/`pb-6`/`mt-2` → tokens exatos; `SIZE_CIRCLE`/`SIZE_LABEL` (por tier `sm`/`md`/`lg`) ficaram como estão — escala própria do componente
- Gate 5 (**gap real de a11y encontrado e corrigido**): as 3 formas absorvidas (`ring`, `gauge`, `skill-list`, esta por item) não tinham `role="progressbar"`/`aria-value*` nenhum — só a forma `bar` (padrão) já tinha. Adicionado nas 3, com `aria-label` derivado do `label`/porcentagem quando não é string. `ProgressSteps`: passo `current` não tinha `aria-current="step"` (mesmo achado do `Timeline` família `progress`) → corrigido
- Wrappers (`progress-ring/`, `gauge/`, `skill-bar/`) — checados, thin delegates, sem violação própria
- Gate 8: `feedback/progress` (bar), `feedback/progress-ring`, `charts/gauge`, `charts/skill-bar`, `display/progress-steps` — todas as 5 rotas já tinham demo própria cobrindo múltiplas variações
- Gate 9: `e2e/cn/feedback/progress.spec.ts` novo (13 testes cobrindo as 5 rotas + a11y `role=progressbar`/`aria-valuenow` + `aria-current` do `ProgressSteps` + dark mode) — 26/26 chromium-desktop + mobile-chrome. Teste de a11y usa `toBeAttached()`/atributo em vez de `toBeVisible()` — o layout do showcase (sidebar fixa) deixa o primeiro elemento fora da área visível em viewport mobile estreito, não é bug do componente

### `data/table` — concluído

Super component com 4 variantes (`variant`): `table` (default, full-featured: sort/filter/paginate/select), `grid` (absorve `DataGrid`), `list` (absorve `DataList`), `tree` (absorve `TreeTable`). Mais o componente irmão standalone `TreeView` (árvore de navegação hierárquica com seleção, distinto do `variant="tree"` do `DataTable` — este é tabular com colunas, aquele é uma lista de nós). Já tinha `.types.ts` (Gate 1 ok pro `Table.tsx`).

- Gate 1: `TreeView.tsx` tinha `TreeNode`/`TreeViewProps` inline — criado `tree-view.types.ts`, `.tsx`/`index.ts` atualizados
- Gate 2: nenhum hex/hsl/rgb cru, nenhum `rounded` bare, nenhuma sintaxe `-[--var]` quebrada em nenhum dos 2 arquivos
- Gate 3: nenhum `text-xs`/`text-sm`/etc. cru — já usava tokens (`text-[0.625rem]` já documentado como abaixo do mínimo, herdado de sessão anterior)
- Gate 3/spacing: sweep grande no `Table.tsx` (arquivo de 1291 linhas, 4 variantes) — `gap-2`/`gap-3`/`gap-1`/`px-1`/`px-2`/`mb-1`/`py-3`/`py-[6px]` (match exato) → tokens; `px-[14px]` (padding canônico de célula, repetido ~15× no arquivo todo) e `py-[5px]`/`py-[7px]`/`py-[9px]`/`py-[10px]`/`py-[11px]`/`gap-[5px]`/`px-[10px]`/`gap-[10px]` documentados (sem match exato). `thCls`/`tdCls` por `size` (sm/md/lg) e as escalas de `sz`/`svgSz` do `ActivityFeed`-like em outros componentes ficaram como estão — escala própria. `TreeView.tsx`: `gap-1.5`/`px-2`/`gap-0.5`(×2) → tokens exatos; `py-[0.3125rem]` documentado; `paddingLeft` proporcional a `depth` documentado como continuo, sem token aplicável
- Gate 5 (**gaps reais de a11y encontrados e corrigidos**, todos em `Table.tsx`):
  1. Ícones decorativos (`SortNone`/`SortAsc`/`SortDesc`/`FilterIcon`/`PlusIcon`/`XIcon`/`CheckIcon`/`ViewIcon`/`SearchIcon`/`EmptyIcon`, 10 no total) não tinham `aria-hidden="true"` — nenhum tinha. Adicionado em todos
  2. `SelectFilter` (dropdown de filtro por coluna) e `ViewOptions` (dropdown de colunas visíveis) — nenhum dos dois tinha `aria-haspopup`/`aria-expanded`/`aria-controls` no trigger, nem `role="listbox"`/`"menu"` no popup (mesmo padrão de achado já corrigido em `DropdownMenu`/`Command`/`Autocomplete` em sessões anteriores). Adicionado `aria-haspopup="listbox"` + `role="listbox"`/`"option"` no primeiro; `aria-haspopup="menu"` + `role="menu"`/`"menuitemcheckbox"` no segundo, ambos via `useId()`
  3. Estado `loading` (skeleton rows) não tinha `aria-busy` no wrapper — adicionado
- `TreeView.tsx` já estava bem coberto de a11y (`role="tree"/"treeitem"/"group"`, `aria-selected`/`aria-expanded`, ícone com `aria-hidden` já presente) — nenhum gap encontrado
- **Achado de showcase**: `data/tree-view` estava registrado no `cn-registry.tsx` mas não tinha demo nenhuma no `_showcase.tsx` (nem função nem entrada no `DEMOS`) — página renderizava "não encontrada" (mesma classe de bug das 34 páginas fechadas antes). Criada `TreeViewDemo` e wired
- Wrappers (`data-grid/`, `data-list/`, `tree-table/`) — checados, thin delegates, sem violação própria
- Gate 8: `data/table`, `data/data-grid`, `data/data-list`, `data/tree-table` já tinham demo; `data/tree-view` criada agora (achado acima)
- Gate 9: `e2e/cn/data/table.spec.ts` (já existia com 4 testes pro `data/table`) — estendido com as 4 rotas restantes + a11y do `aria-haspopup`/`aria-expanded` do `ViewOptions` + `aria-expanded` de nó da `TreeView` — 28/28 chromium-desktop + mobile-chrome

### `inputs/date-picker` — concluído

Super component com 3 dispatches (`range`/`mode`): default (single-date popover), `range` (absorve `DateRangePicker`), `mode="inline"` (absorve `Calendar`). Mais 2 componentes irmãos standalone: `EventCalendar` (grade mensal com eventos coloridos, distinto do `mode="inline"` — este tem eventos por dia e é o calendário de página inteira usado em `display/event-calendar`) e `TimePicker` (seletor de hora, catalog-absorb documentado como "não vale a pena mergear" no próprio JSDoc do Super).

- Gate 1: `DatePicker.tsx` e `Calendar.tsx` tinham tipos inline (sem `.types.ts`) — criados `date-picker.types.ts` e `calendar.types.ts`, `.tsx`/`index.ts` atualizados. `date-range-picker.types.ts` ajustado pra importar `DateRange` do novo arquivo em vez do `.tsx`
- Gate 2/3: nenhum hex/hsl/rgb cru, nenhum `rounded` bare, nenhuma sintaxe `-[--var]` quebrada nos 5 arquivos. `text-[0.625rem]`/`text-[0.65rem]` (micro-labels de dia da semana, repetidos em `DatePicker`/`EventCalendar`/`TimePicker`) documentados como abaixo do mínimo da escala
- Gate 3/spacing: sweep grande nos 3 arquivos maiores (nenhum tem prop `size`, tudo estrutural) — dezenas de `gap-N`/`px-N`/`py-N`/`p-N`/`mb-N`/`mt-N` com match exato → tokens (incluindo um `p-[6px_8px]` compound shorthand no `EventCalendar` convertido pra `py-(--spacing-xs) px-(--spacing-sm)`, já que os dois valores bateram exato); `py-[0.4rem]`/`py-[3px]`/`py-[5px]`/`px-[18px]`/`py-[14px]` documentados (sem match exato)
- Gate 5 (**gap real de a11y grave encontrado e corrigido**): o trigger do `SingleDatePicker` era um `<button>` que continha, como filho, um segundo controle interativo (o botão "Limpar data", um `<span role="button">` sem `tabIndex`/`onKeyDown`) — **botão dentro de botão é HTML inválido e o navegador trata o conjunto como um único elemento focável, tornando o botão de limpar **completamente inacessível por teclado\*\* (não é possível dar Tab até ele isoladamente). Corrigido restruturando o trigger pra `<div role="button" tabIndex>` (com `onKeyDown` Enter/Space) e convertendo o filho pra um `<button>` real e independente
- Gate 5 (outros gaps corrigidos): trigger do `SingleDatePicker` e do `RangeDatePicker` sem `aria-haspopup`/`aria-expanded`/`aria-controls` (mesmo padrão já corrigido em `Table`/`DropdownMenu`/`Command`/`Autocomplete`) — adicionado nos dois, com `role="dialog"` + `id` no popover; `label` associado via `aria-labelledby` em vez de `htmlFor` (o alvo virou um `<div>`, que não é labelable); 4 ícones (`ChevronL`/`ChevronR`/`CalIcon`/`XIcon`) sem `aria-hidden`; dois spans clicáveis (abrir seletor de mês/ano) sem suporte a teclado — convertidos pra `<button>`. No `EventCalendar`: células de dia e chips de evento eram `<div onClick>` sem nenhuma semântica de interatividade — adicionado `role="button"`/`tabIndex`/`onKeyDown` condicionalmente (só quando o callback correspondente é passado); botões de navegação de mês sem `aria-label` (só tinham o glifo `‹`/`›`). No `TimePicker`: `shadow-lg` (Tailwind bruto, não é o padrão de shadow literal já usado em outros overlays) → alinhado ao padrão oklch usado no `DatePicker`; trigger sem `aria-haspopup`/`aria-expanded`; botões de hora/minuto/período sem `aria-pressed`
- **Achado de infraestrutura (fora do componente, corrigido)**: `cn-registry.tsx` tinha a prop `showTime` duplicada duas vezes na lista `props` do `date-picker` — causava `Warning: Encountered two children with the same key` no `CnPropsTable` (`key={prop.name}`) sempre que a página `/cn/inputs/date-picker` carregava. Removida a entrada duplicada
- Emoji como ícone (📅 no `RangeDatePicker`, 🕐 no `TimePicker`) — anotado como sugestão de melhoria não bloqueante, mesmo critério do Gate 4
- Gate 8: as 5 rotas já tinham demo (`inputs/date-picker`, `inputs/date-range-picker`, `inputs/calendar`, `inputs/time-picker`, `display/event-calendar`)
- Gate 9: `e2e/cn/inputs/date-picker.spec.ts` novo (12 testes cobrindo as 5 rotas + a11y do popover: `aria-haspopup`/`aria-expanded` e fluxo de seleção de dia) — 24/24 chromium-desktop + mobile-chrome

### `charts/chart` — concluído

Diferente dos outros Super components desta lista: `Chart` é um **router puro** sobre 6 renderers SVG standalone (`line`/`area`/`bar`/`donut`/`radar`/`funnel`, + `sparkline` já validado antes), não uma absorção/refatoração — cada um continua uma implementação própria completa, plenamente importável e documentada isoladamente no catálogo. Todos os 7 avaliados juntos por serem a mesma família visual.

- Gate 1: `Chart.tsx` tinha `ChartType`/`ChartProps` inline — criado `chart.types.ts`, `.tsx`/`index.ts` atualizados; import de tipo em `_showcase.tsx` ajustado
- Gate 2 (**violação real de cor encontrada e corrigida**): `FunnelChart` usava `text-white` hardcoded (classe banida) pro texto dentro da barra colorida — corrigido com um array `STAGE_FG_CLS` pareado 1:1 com `STAGE_COLORS` (usa os tokens `-fg` corretos: `text-patina-fg`, `text-info-fg` etc.); mantido `text-white` só como fallback documentado quando o consumidor passa `stage.color` customizado (cor arbitrária sem token de contraste garantido). `AreaChart`: `shadow-lg` (Tailwind bruto) → alinhado ao padrão oklch literal já usado no `DatePicker`
- Gate 3: `fontSize={N}` nos `<text>` SVG (`Line`/`Bar`/`Area`/`Donut`/`Radar`Chart, todos abaixo de 12px) documentados como exceção — são atributos numéricos de elemento SVG, não alcançáveis por classe Tailwind no contexto de um `viewBox` escalável
- Gate 3/spacing: sweep completo nas legendas/tooltips (nenhum componente tem prop `size`) — `gap-x-4`/`gap-y-1`/`gap-1.5`/`gap-3`/`gap-4`/`mt-2`/`px-1`/`px-3`/`py-2`/`mb-1`/`gap-2` → tokens exatos, repetido de forma idêntica em `LineChart`/`AreaChart`/`RadarChart`/`DonutChart`/`FunnelChart`
- Gate 5 (**gap real de a11y encontrado e corrigido, em toda a família**): nenhum dos 5 charts SVG (`Line`/`Bar`/`Area`/`Donut`/`Radar`) tinha `role="img"` ou `aria-label` no `<svg>` raiz — pra leitor de tela, um gráfico inteiro era invisível/sem nenhuma informação. Adicionado `role="img"` + `aria-label` resumindo os dados (série/valores) nos 5. `FunnelChart` (que não usa SVG, é HTML) já tinha texto real (`toLocaleString()`, labels) legível por padrão
- Gate 8: as 7 rotas (`charts/chart`, `charts/line-chart`, `charts/bar-chart`, `charts/area-chart`, `charts/donut-chart`, `charts/radar-chart`, `charts/funnel-chart`) já tinham demo própria
- Gate 9: `e2e/cn/charts/chart.spec.ts` novo (16 testes cobrindo as 7 rotas + a11y `role=img`/`aria-label` + dark mode) — 32/32 chromium-desktop + mobile-chrome. Teste de a11y usa `svg[role="img"]` em vez de `getByRole("img")` — SVGs decorativos de navegação da página também se expõem implicitamente como `role=img` na árvore de acessibilidade, poluindo o match genérico

### `display/text-effect` — concluído

Igual ao `Chart`: **router puro** sobre 4 renderers standalone (`typewriter`/`morph`/`gradient`/`number` → `Typewriter`/`MorphingText`/`TextGradient`/`AnimatedNumber`), não uma absorção — cada um continua totalmente independente e documentado isoladamente. `marquee-text` e `scroll-reveal` têm nomes parecidos mas **não fazem parte desta família** (não são dispatch do `TextEffect`), ficam pendentes pra uma validação própria futura.

- Gate 1: `TextEffect.tsx` tinha `TextEffectType`/`TextEffectProps` inline — criado `text-effect.types.ts`, `.tsx`/`index.ts` atualizados; import de tipo em `_showcase.tsx` ajustado
- Gate 2/3: nenhum hex/hsl/rgb cru, nenhum `rounded` bare, nenhuma sintaxe `-[--var]` quebrada, nenhum `text-xs/sm/base/lg/xl/2xl` cru nos 5 arquivos — os 4 renderers já estavam bem alinhados aos tokens (`from`/`to` do `TextGradient` já usam `var(--ks-violet)`/`var(--ks-rose)` por padrão)
- Gate 5 (**gap real de a11y encontrado e corrigido**): `TextGradient` usa a técnica `background-clip: text` + `color: transparent` pra pintar o texto com gradiente — em **modo de alto contraste forçado** (Windows High Contrast / `forced-colors: active`), o navegador ignora `background`, e o texto fica **completamente invisível** (permanece `color: transparent`, sem nada visível). Adicionado fallback via `@media (forced-colors: active)` que restaura `color: CanvasText` e remove o gradiente nesse modo
- `Typewriter`/`MorphingText`/`AnimatedNumber` já tinham a11y correta (cursor com `aria-hidden`, `aria-label` com o texto completo pro typewriter, `aria-live="polite"` pro morph) — nenhum gap encontrado
- Gate 8: as 5 rotas (`display/text-effect`, `display/typewriter`, `display/morphing-text`, `display/text-gradient`, `display/animated-number`) já tinham demo própria
- Gate 9: `e2e/cn/display/text-effect.spec.ts` novo (11 testes cobrindo as 5 rotas + a11y de `forced-colors` no `TextGradient`) — 22/22 chromium-desktop + mobile-chrome

## Pendências abertas pra próxima sessão, em ordem de prioridade

1. Decidir o destino de `ContextCard` (aposentar em favor de `<Tooltip variant="card">`, ou investir na reescrita pra JS) — levantado durante o Gate 5 acima, não decidido
2. Cobertura de `focus-visible:outline-patina` em componentes com foco customizado por `role` (Tabs e possivelmente outros `role="tab"`/`role="menuitem"`) que nunca tiveram anel de foco próprio, dependendo só do fallback verde do dashboard — achado colateral do fix do outline global, não é regressão, é lacuna pré-existente
3. `text-lg`/`text-xl` cru achado de passagem em `avatar/Avatar.tsx` durante o sweep de `rounded` — corrigido pro tamanho, mas os `text-[Npx]` arbitrários no mesmo `SIZE_DIM` (xs/sm/md/lg, ex: `text-[0.5625rem]`) não foram tocados, ficam pendentes pro Gate 3 completo do Avatar
4. `cn-install-block/CnInstallBlock.tsx` usa hex cru (`#0d1117`, `#79c0ff` etc, paleta do GitHub) — provavelmente exceção válida (mimetiza tema de código real, independente do tema CN) mas nunca recebeu o comentário de exceção documentada; fica pendente confirmar e comentar quando for a vez desse componente
5. `marquee-text` e `scroll-reveal` têm nomes parecidos com a família `text-effect` mas não fazem parte dela (não são dispatch do `TextEffect`) — ainda não receberam nenhum gate, ficam pendentes como itens standalone próprios

## Achado grande — sweep de `rounded` bare (23 arquivos) e sintaxe `-[--var]` (10 arquivos) — ✅ FECHADOS

Os dois achados de infraestrutura mais antigos da lista de pendências, resolvidos juntos em 2026-08-27 (mesma sessão do fix do outline global).

### `rounded` bare (não tokenizado)

Grep reconfirmado achou 21 arquivos; investigação real encontrou **mais 4** que o grep anterior tinha perdido (`note-card/NoteCard.tsx`, `quick-actions/QuickActions.tsx`, `text-editor/TextEditor.tsx`, `tag-cloud/TagCloud.tsx`) — todos com bug real, corrigidos. `avatar/Avatar.tsx`, `checkbox/Checkbox.tsx`, `skeleton/Skeleton.tsx`, `badge/Badge.tsx`, `button/Button.tsx` são **falsos-positivos confirmados** (a palavra "rounded" aparece como nome de variante/prop/chave de objeto, não como classe CSS) — nenhuma mudança neles. Total: **23 arquivos com bug real corrigido**, cada um pro token de raio mais próximo do contexto (a maioria virou `rounded-(--radius-xs)` por serem badges/botões pequenos, alguns `rounded-(--radius-sm)`/`rounded-(--radius-md)` pra elementos maiores). Achado de bônus: `avatar/Avatar.tsx` também tinha `text-lg`/`text-xl` cru (banido) no mapa de tamanho — trocado por `text-body-title`/`text-heading-05`.

### Sintaxe `-[--var]` (bracket cru sem `var()`) — confirmado quebrado também nas formas SIMPLES, não só direcionais

Essa era a dúvida em aberto da sessão anterior. **Confirmado empiricamente** (Playwright, computed style real): `Banner.tsx` tinha `text-[--ks-info]`/`text-[--ks-success]`/`text-[--ks-warning]`/`text-[--ks-danger]` e as 4 intents renderizavam a **mesma cor herdada** (`rgb(246, 248, 240)`) em vez da cor de cada intent — depois do fix (`text-info`/`text-success`/etc.) as 4 ficaram visualmente distintas (azul/verde/amarelo/rosa). Isso fecha a dúvida: **a forma simples sem direção está tão quebrada quanto a direcional.**

Arquivos corrigidos (10): `Banner.tsx` (trocado pelo token direto, já existia `text-info` etc.), `Alert.tsx` (`text-[--alert-ic]` → `text-(--alert-ic)`), `AvatarGroup.tsx` (`w-[--ag-sz]`/`h-[--ag-sz]`/`text-[length:--ag-fs]`/`ml-[--ag-gap]` → sintaxe de parênteses, confirmado via computed style real: width/height/fontSize/marginLeft todos corretos depois), `Callout.tsx` (7 ocorrências de `bg-[--i]`/`border-[--i]`/`text-[--i-fg]` etc.), `Checklist.tsx` (`bg-[--c]`/`border-[--c]`/`text-[--c-fg]`, + um `rounded-[5px]` de passagem), `Pagination.tsx` (`h-[--pg-h]`/`min-w-[--pg-min]`/`px-[--pg-px]`/`text-[length:--pg-fs]`, 2 ocorrências), `ThemeSelector.tsx` (`rounded-[--radius]`), `StatusPage.tsx` (`rounded-[--radius]`), `MarkdownRenderer.tsx` (`rounded-r-[--radius-sm]`, direcional), `PriceTable.tsx` (`rounded-t-[--radius-md]`, direcional). `DropdownMenu.tsx` e `Tooltip.tsx` (as duas menções restantes da lista original) foram checados e **não têm ocorrência real** — só comentários documentando fixes anteriores.

Todos os 10 arquivos: `npm run typecheck` limpo, `npx eslint` 0 erros, todas as páginas correspondentes verificadas via `curl` (200, sem crash).

Depois de resolver essas 4, seguir a ordem geral do `docs/UNIFICACAO-COMPONENTES.md` pros ~185 componentes restantes (incluindo os 31 recém-desquebrados acima, que só passaram pelo Gate 8 até aqui).

---

## Regras operacionais (não repetir erro já cometido hoje)

1. **Playwright spawna seu próprio `next dev`** se a porta 3000 estiver livre (`webServer.reuseExistingServer` em `playwright.config.ts`), e isso corrompe o `.next` compartilhado com qualquer servidor manual rodando em outra porta (sintoma: 404/500 aleatório em chunk, `ENOENT` no log apontando pra `.next/server/app/...`). **Sempre rodar o dev server manual na porta 3000.**
2. Depois de editar qualquer `cn/*.tsx`: `npm run registry:build` antes de considerar terminado (o registry publicado NÃO sincroniza sozinho).
3. Commitlint aceita só `[feat, fix, chore, docs, refactor, test, perf, ci, build, revert, style]` como tipo — **"audit" não é válido**, apesar do skill `/validate-component` sugerir esse prefixo. Usar `fix(cn): ...`.
4. `gh` CLI: a conta dona do repo é `devjuanmarcos` (60 repos públicos, é a conta pessoal real). Existe uma segunda conta logada (`devjnmarcos`, nova, sem acesso) que fica ativa por padrão às vezes — **conferir com `gh api user` antes de concluir que algo "não existe"**. Trocar com `gh auth switch --hostname github.com --user devjuanmarcos`.
5. Repo GitHub já está público (era privado, corrigido 2026-08-27) — não precisa mexer de novo, só lembrar que existia esse gap.
6. Fonte de verdade das regras de token (cor/tipografia/radius/spacing): **CLAUDE.md na raiz do projeto** — já atualizado, único lugar que precisa ficar em sincronia com o skill `/validate-component`.

---

## Como retomar numa sessão nova/contexto limpo

1. Ler este arquivo inteiro + `CLAUDE.md`.
2. Rodar `git log --oneline -5` e `git status` pra confirmar que nada mudou desde `dfc7c49`.
3. Continuar `display/tabs` a partir de "Gate 3 tipografia" (ver seção acima), ou invocar `/validate-component display/tabs` de novo (o skill vai re-verificar do zero, o que é seguro mesmo com os 2 fixes já aplicados).
4. Não assumir os itens "suspeito, não testado" da seção de achados pendentes — testar cada um antes de tocar.
