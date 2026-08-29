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

### `display/marquee-text` + `layout/scroll-reveal` — concluído

Dois componentes standalone com nomes parecidos à família `text-effect` mas fora dela (não são dispatch do `TextEffect`) — fechados juntos por serem pequenos e terem sido apontados como pendência na validação anterior.

- Gate 1/2/3: ambos já tinham `.types.ts`, nenhum hex/hsl/rgb cru, nenhum `rounded` bare, `SIZE_CLASSES` do `MarqueeText` já usava tokens de tipografia corretos
- Gate 5 (**2 gaps reais de a11y encontrados e corrigidos**):
  1. `MarqueeText`: o texto era duplicado `repeat × 2` vezes (padrão 16×) só pra criar o loop visual contínuo — sem nenhum tratamento de a11y, um leitor de tela lia o mesmo texto até 16 vezes seguidas. Adicionado `aria-hidden="true"` na faixa visual repetida + um `<span className="sr-only">{text}</span>` com o conteúdo real, lido uma única vez
  2. Nenhum dos dois respeitava `prefers-reduced-motion`: `MarqueeText` tem rolagem horizontal **infinita** (não para nunca, viola WCAG 2.2.2 Pause/Stop/Hide) e `ScrollReveal` anima `translate`/`scale` (movimento real, não só opacidade) a cada elemento que entra na viewport. Adicionado `@media (prefers-reduced-motion: reduce) { animation: none }` no primeiro; no segundo, um hook que detecta a preferência (com listener de mudança) e pula direto pro estado final sem transição de transform quando ativa
- Gate 8: `display/marquee-text` e `layout/scroll-reveal` já tinham demo própria
- Gate 9: `e2e/cn/display/marquee-text.spec.ts` novo (6 testes cobrindo as 2 rotas + a11y do `aria-hidden`/`sr-only` do marquee + `prefers-reduced-motion` do scroll-reveal) — 12/12 chromium-desktop + mobile-chrome

### `display/avatar` — concluído

- **Achado de arquitetura confirmado (não é bug de runtime, mas era enganoso)**: `cn-registry.tsx` declarava `absorbs: ["avatar-group"]` no `avatar`, mas isso **nunca foi verdade** — `avatar-group/AvatarGroup.tsx` é uma implementação totalmente paralela e independente (API orientada a dados via prop `avatars`), enquanto o `AvatarGroup` exportado por `Avatar.tsx` é outra implementação, por composição de `children`. As duas nunca foram unificadas. Consequência real: `getVisibleComponents()` filtra qualquer nome listado em `absorbs` da barra lateral — **`avatar-group` ficava escondido da navegação** mesmo tendo rota, demo e componente 100% funcionais. Corrigido removendo a entrada falsa de `absorbs`; `avatar-group` agora aparece na sidebar. `AvatarGroup` do `Avatar.tsx` **não foi removido** (é API pública publicada via `npx kikitocn add avatar` — pode ter consumidores externos) — documentado com JSDoc explicando que são dois componentes distintos, mantidos de propósito
- Gate 1: `Avatar.tsx` tinha tipos inline — criado `avatar.types.ts`, `.tsx`/`index.ts` atualizados
- Gate 2: `BG_PALETTE` (`Avatar.tsx`) usa `oklch(...)` literal e `colorForName`/`textColorForName` (`avatar-group/AvatarGroup.tsx`) usam `hsl(...)` literal — ambos precisam de mais matizes distintos do que os ~10 tokens semânticos oferecem pra diferenciar avatares por iniciais; exceção legítima, mas nenhuma tinha o comentário de exceção documentada. Adicionado nos dois
- Gate 3: os 4 `text-[Nrem]` do `SIZE_DIM` (xs/sm/md/lg) — pendência já registrada de uma sessão anterior — documentados como escala própria do componente, sem match exato na escala de tipografia
- Gate 5 (**gaps reais de a11y encontrados e corrigidos**): iniciais (`Avatar.tsx`) e status dot (`Avatar.tsx`) usavam `aria-label` num `<span>` sem `role` — sem `role`, leitores de tela costumam ignorar `aria-label` num elemento genérico. Adicionado `role="img"` nos dois. Mesmo gap no `AvatarItem` de `avatar-group/AvatarGroup.tsx` (initials `<div>` com `aria-label` sem `role`) — corrigido igual. SVG de silhueta decorativo (fallback sem nome/ícone) sem `aria-hidden` — adicionado
- Gate 8: `display/avatar` e `display/avatar-group` já tinham demo própria (a de `avatar-group` só não aparecia na sidebar, ver achado acima)
- Gate 9: `e2e/cn/display/avatar.spec.ts` novo (6 testes cobrindo as 2 rotas + confirma `avatar-group` na sidebar + a11y `role=img`) — 12/12 chromium-desktop + mobile-chrome

### `display/accordion` — concluído

**Mesmo achado do `avatar`, repetido**: `absorbs: ["accordion-group", "multi-accordion", "collapsible"]` no `accordion` também era falso — os 4 são implementações totalmente paralelas e independentes (`Accordion` é array-driven via `items`; `AccordionGroup`/`MultiAccordion`/`Collapsible` cada um com API própria), nenhuma delega pra outra. Consequência: as 3 ficavam escondidas da sidebar. **`collapsible` estava pior ainda: nem demo tinha** — nenhuma função `CollapsibleDemo`, nenhuma entrada no `DEMOS`, página `/cn/display/collapsible` renderizava "não encontrada" mesmo com componente 100% funcional (mesma classe das 34 páginas fechadas antes + `tree-view`).

- Corrigido: removida a entrada falsa de `absorbs`; criada `CollapsibleDemo` e wired no `DEMOS`; as 3 agora aparecem na sidebar
- Gate 1: `Accordion.tsx`, `AccordionGroup.tsx` e `Collapsible.tsx` tinham tipos inline — criados `.types.ts` pros 3 (`MultiAccordion` já tinha)
- Gate 3/spacing: sweep completo nos 4 (nenhum tem prop `size`) — `gap-2`/`gap-3`/`gap-1`/`px-4`/`py-3` → tokens exatos; `py-3.5`/`py-[14px]`/`pb-[14px]` documentados (sem match exato)
- Gate 5 (**gap real e grave de a11y encontrado e corrigido, nos 4**): nenhum dos 4 ligava o botão trigger ao painel de conteúdo via `id`/`aria-controls`/`aria-labelledby`/`role="region"` de forma completa — `Accordion.tsx` não tinha nenhum desses; os outros 3 tinham parcialmente. Adicionado o conjunto completo nos 4
- **Bug real introduzido e auto-corrigido durante o Gate 9**: ao adicionar os ids acima usando `item.value`/`item.id` cru (sem prefixo), descobri via teste que a mesma lista de `items` é reaproveitada em **múltiplas instâncias** do mesmo componente na mesma página de demo (padrão normal de showcase — "variantes lado a lado") — isso gerava **ids HTML duplicados** (`id="acc-1"` repetido 5× na página do `accordion-group`, por exemplo), o que é inválido e quebra `aria-controls`/`getElementById`. Corrigido nos 4 componentes com um `useId()` por instância como prefixo. Detalhe técnico: `useId()` do React inclui `:` no valor (`:r0:`), inválido em seletor CSS tipo `#id` sem escape — sanitizado com `.replace(/:/g, "")` nos 4
- Gate 8: `display/accordion`, `display/accordion-group`, `display/multi-accordion` já tinham demo; `display/collapsible` criada agora (achado acima)
- Gate 9: `e2e/cn/display/accordion.spec.ts` novo (12 testes cobrindo as 4 rotas + confirma as 3 antes-escondidas na sidebar + a11y de `aria-controls`/`role=region` no `Accordion` e `Collapsible`) — 22/22 chromium-desktop + mobile-chrome

### `display/kbd` — concluído

Diferente de `avatar`/`accordion`: aqui o `absorbs: ["shortcut-key"]` **é verdadeiro** — `ShortcutKey.tsx` é um wrapper backward-compat genuíno, delega de fato pra `KbdSequence` (`<KbdSequence symbols separator="+" />`). Nenhum achado de arquitetura falsa desta vez.

- **Achado de showcase**: `display/kbd` (o próprio Super, não um absorvido) nunca foi importado em `_showcase.tsx` — sem função de demo, sem entrada no `DEMOS`, página renderizava "não encontrada" mesmo com componente 100% funcional (mesma classe de bug de `collapsible`/`tree-view`/as 34 fechadas antes). Criada `KbdDemo` e wired
- Gate 1: `Kbd.tsx` tinha tipos inline — criado `kbd.types.ts`, `.tsx`/`index.ts` atualizados
- Gate 2: `text-base` na variante `solid` — não é a classe de tamanho de fonte banida; resolve pra `color: var(--color-base)` (mesmo comportamento confirmado em `border-base`/`ring-base` durante o Gate 2 do `avatar`), uso correto de token de superfície como cor de texto
- Gate 3: `text-[0.6/0.7/0.8rem]` e `rounded-[3px]`/`rounded-[4px]` no `SIZE` (sm/md/lg) documentados como escala própria do componente, sem match exato nas escalas de tipografia/radius
- Gate 3/spacing: `gap-1` no `KbdSequence` (não ligado a nenhum tier de size) → `gap-(--spacing-2xs)`; `px-1`/`px-1.5`/`px-2` do `SIZE` mantidos como estão (escala própria por tier, valores genuinamente diferentes por tamanho)
- Gate 5: separador decorativo entre teclas (`+`/`⌘`) sem `aria-hidden` — adicionado, evita leitor de tela anunciar "mais" entre cada tecla
- Gate 8: `display/shortcut-key` já tinha demo; `display/kbd` criada agora (achado acima)
- Gate 9: `e2e/cn/display/kbd.spec.ts` novo (5 testes cobrindo as 2 rotas + conteúdo do `Kbd`) — 10/10 chromium-desktop + mobile-chrome

### `inputs/rating` — concluído

`RatingInput` absorvido de fato — wrapper genuíno (`<Rating toggleOff icon="★" emptyIcon="☆" />`), sem achado de arquitetura falsa.

- **Suspeita investigada e descartada empiricamente**: `SIZE_CLS.sm.textSz = "text-base"` parecia colidir com o token de cor `--color-base` (confirmado existir em `kikitocn-tokens.css:184`) e resolver como `color` em vez de tamanho de fonte — mesmo padrão que exigiu `text-(length:--x)` no `AvatarGroup`. Testado ao vivo (`getComputedStyle` no botão real, depois de adicionar uma instância `size="sm"` com ícone customizado na demo, que antes não existia): `fontSize: 16px` confirmado correto, cor controlada corretamente por `text-kinpaku`/`text-rule` à parte. **Não é bug** — documentado aqui pra não reabrir a mesma dúvida à toa numa sessão futura
- Gate 2/3: `text-xl`/`text-2xl` cru (banidos) no `SIZE_CLS` (tiers `md`/`lg`) → `text-body-title`/`text-heading-05` (matches exatos); `text-base` (tier `sm`) mantido — ver nota acima; `gap-[2px]`/`gap-[3px]`/`gap-1` do `SIZE_CLS` documentados como escala própria do componente
- Gate 3/spacing: `gap-1` (wrapper raiz, não ligado a tier) → `gap-(--spacing-2xs)`; `ml-2` (label do `showValue`) → `ml-(--spacing-sm)`
- Gate 5 (**gap real de a11y encontrado e corrigido**): em modo `readOnly`, os botões continuavam expondo `aria-label="Rate N of M"` e ficavam focáveis via Tab — um leitor de tela ouvia "Rate 3 of 5" como se fosse uma ação disponível, quando na verdade é só exibição. Corrigido: o wrapper ganha `role="img"` + `aria-label="X out of Y"` quando `readOnly`, e os botões internos ficam `aria-hidden`/`tabIndex={-1}` (a unidade inteira é anunciada de uma vez, não estrela por estrela). Ícones SVG de estrela (`StarIcon`, cheio/vazio/meio) sem `aria-hidden` — adicionado
- Gate 8: demo já cobria a maioria das variações; adicionadas 2 instâncias `size="sm"`/`"md"` com ícone customizado (faltava exercitar esse caminho, foi o que motivou o teste empírico acima)
- Gate 9: `e2e/cn/inputs/rating.spec.ts` novo (6 testes cobrindo as 2 rotas + clique atualiza valor + a11y `role=img`/`aria-hidden` em read-only) — 12/12 chromium-desktop + mobile-chrome

### `inputs/slider` — concluído

`RangeSlider` absorvido de fato — wrapper genuíno (`<Slider range />`).

- Gate 1: tipos inline — criado `slider.types.ts`, `.tsx`/`index.ts` atualizados; `range-slider/RangeSlider.tsx` ajustado pra importar `SliderRangeProps` do novo arquivo
- Gate 2: `bg-white` hardcoded (thumb do slider single-value) → `bg-canvas` (adapta com o tema, mesmo efeito visual no modo claro)
- Gate 5 (**bug real e confirmado empiricamente, achado mais sério desta leva**): o thumb do modo `range` tinha `focus-visible:shadow-[0_0_0_3px_var(--ks-primary)/50]` — `/50` **dentro** do `var()` não é sintaxe CSS válida pra opacidade (só funciona como sufixo do Tailwind _fora_ do colchete, tipo `bg-patina/50`). Resultado: o navegador descarta a declaração `box-shadow` inteira. **Confirmado ao vivo**: `getComputedStyle` antes e depois de `.focus()` no thumb real deu o **mesmo valor exato** de `box-shadow` — ou seja, dar Tab entre os dois thumbs (Minimum/Maximum value) não muda nada visualmente, usuário de teclado não tem noção de qual thumb está focado. Corrigido com `color-mix(in oklch, var(--ks-primary) 50%, transparent)`, que produz opacidade real
- Gate 5 (**segundo bug real, funcional não só a11y**): quando `disabled=true` no modo `range`, os thumbs (`<button role="slider">`) não recebiam o atributo `disabled` nativo — só o wrapper ficava com `pointer-events-none`. Um usuário de **teclado** ainda conseguia dar Tab até o thumb e mudar o valor com as setas (o `onKeyDown` não checava `disabled`). Corrigido: `disabled={disabled}` nos dois `<button>` + guarda `if (disabled) return` no `onKeyDown` de cada um (defesa em profundidade)
- Gate 3/spacing: `gap-1`/`gap-3`/`mt-1`/`gap-0.5`/`gap-2` (nenhum ligado a tier de `size`) → tokens exatos; `pb-5` (marcas) documentado (sem match exato); `text-[0.625rem]` (label de marca) documentado como abaixo do mínimo. `SIZE_TRACK`/`SIZE_THUMB` (dimensões por tier) e o offset `calc()` do thumb (contínuo por `size`) mantidos como estão — escala própria do componente
- `jsx-a11y` aponta o `onClick` do track (clique pra pular o thumb mais próximo) como não-teclado-acessível — aceito como está: é um atalho de mouse sobre um widget **já** 100% acessível por teclado via os dois `role="slider"` reais (setas), não é o meio primário de interação
- Gate 9: `e2e/cn/inputs/slider.spec.ts` novo (6 testes cobrindo as 2 rotas + a11y de foco visível funcional + bloqueio de teclado quando `disabled`) — 12/12 chromium-desktop + mobile-chrome

**Revisita (nonagésimo quinto standalone, sessão posterior)** — achado novo, mesma categoria de "prop declarada, nunca lida" já vista várias vezes: `size` e `intent` são props reais de `SliderCommon` (herdadas por `SliderRangeProps`, documentadas no registry pros dois modos), mas `RangeSliderImpl` **nem desestruturava as duas**, sempre renderizando `w-4 h-4` + `bg-patina`/`var(--ks-primary)` fixos não importa o que o consumidor passasse — nenhuma demo jamais exercitou `size`/`intent` num range slider, por isso passou despercebido até agora. Corrigido: `size`/`intent` entram na desestruturação e alimentam `SIZE_TRACK`/`SIZE_THUMB`/`INTENT_CLS` (os mesmos maps do modo single); a cor do anel de foco (antes `var(--ks-primary)` cru fixo) virou custom property por elemento (`--thumb-ring`, resolvida via `style` inline a partir do `intent`), já que uma classe Tailwind estática não pode interpolar o intent dinamicamente, mas duas classes estáticas (`shadow-[...var(--thumb-ring)]` + variante `focus-visible:`) podem referenciar a mesma custom property. Registry: `defaultValue` documentado com default `50`, real é `0` — corrigido + `registry:build`. Showcase: adicionada instância `size="lg" intent="danger"` em `RangeSliderDemo` pra exercitar o fix. `e2e/cn/inputs/slider.spec.ts` (arquivo já existente, achado nesta revisita — **quase virou duplicata**: um pente-fino inicial não conferiu se `slider` já tinha sido validado antes de começar, e a primeira tentativa sobrescreveu o spec com `Write` em vez de mesclar; recuperado do histórico via `git show <commit-antigo>:<path>` e mesclado de volta, nenhuma cobertura antiga perdida) ganhou 4 testes novos (`ArrowRight` no single, marcas visíveis, `size`+`intent` do range comparando thumb customizado vs default — prova empírica do bug — e thumbs focáveis) somados aos 2 já existentes de a11y — 12/12 chromium-desktop + mobile-chrome. **Lição pra sessões futuras**: sempre `grep` o nome do componente no doc inteiro antes de pegar da fila de "candidatos não validados" — a lista de candidatos foi montada uma vez e não necessariamente reflete o que já foi feito em revisitas posteriores.

### `display/grid-pattern` + `display/particle-field` — concluído

**Terceira instância do padrão `absorbs` falso** (após `avatar`→`avatar-group` e `accordion`→[3 componentes]): `grid-pattern` tinha `absorbs: ["particle-field"]` no registry, mas são **duas implementações totalmente independentes** — `GridPattern` é um padrão SVG data-URI estático (dots/lines/cross/grid via `background-image`), `ParticleField` é uma animação canvas 2D com física de partículas via `requestAnimationFrame`. `GridPattern.tsx` nunca teve suporte real a um `type="particles"` (a função `buildPattern` só resolve `'dots'|'lines'|'cross'|'grid'`) — o registry chegava a documentar isso via `variant.note` ("mantido separado... use o ParticleField"), mas mesmo assim o `absorbs` ficava lá, escondendo o `particle-field` (componente real, com demo própria já funcionando) da sidebar via `getVisibleComponents()`. Corrigido: `absorbs` removido, `description`/`keywords` do `grid-pattern` limpos da menção falsa a partículas, variante fantasma `type="particles"` removida do registry.

- Gate 1: ambos já com `.types.ts`/`index.ts` corretos; sem mudança estrutural
- Gate 2: nenhuma cor hardcoded em `GridPattern.tsx` (prop `color` livre, decorativo/parametrizado, sem token equivalente fixo — correto como está). `ParticleField.tsx`: `color = "120,80,255"` (RGB cru) usado em `ctx.fillStyle`/`ctx.strokeStyle` — exceção documentada do `CLAUDE.md` ("cor exigida por API do browser sem suporte a CSS var"), comentário adicionado nos 3 pontos de uso
- Gate 3: nenhum texto/tipografia em nenhum dos dois — não aplicável
- Gate 5 (**gap de a11y corrigido nos dois**): camada de padrão do `GridPattern` (`div` decorativo de background) e o `<canvas>` do `ParticleField` não tinham `aria-hidden="true"` — ambos são puramente visuais/decorativos, sem conteúdo semântico. Adicionado nos dois
- Achado extra durante a demo (`_showcase.tsx`): `rounded` bare (sem sufixo) no chip de label do `GridPatternDemo` — resolve pro radius nativo do Tailwind, não pro token daqui (bug já catalogado em `CLAUDE.md`). Corrigido pra `rounded-(--radius-sm)`
- Gate 8: `GridPatternDemo` já cobria as 4 variações de `type`; `ParticleFieldDemo` só tinha 1 instância — adicionada uma segunda com `count`/`color`/`speed`/`size` diferentes
- Estilo de código: os dois arquivos estavam em aspas simples/sem `;` (nunca formatados) — normalizados pro padrão do projeto (aspas duplas, `;`, sem mudança de import de `React` — `jsx: "preserve"` + runtime automático do Next não precisa)
- Gate 9: `e2e/cn/display/grid-pattern.spec.ts` novo — 6 testes (2 rotas render+console, `particle-field` aparece na sidebar confirmando o fix do `absorbs`, `aria-hidden` nas duas camadas decorativas, contagem de `<canvas>`)
- **Investigado e descartado como bug do componente**: teste inicial afirmava `canvas.width > 0` em `mobile-chrome` e falhava sempre (0px). Rastreado a caixa-do-`Frame` (`rounded... flex items-center justify-center`) via cadeia de ancestrais (`getComputedStyle`) — mede **~66px de largura em qualquer demo** nesse viewport (confirmado idêntico em `pin-board`, componente não relacionado), porque a sidebar não colapsa em ~393px e o grid de demos vira 2 colunas, espremendo cada célula. **Sistêmico, pré-existente, fora do escopo** desta validação — ver pendência abaixo. Teste ajustado pra não afirmar dimensão real, só presença/`aria-hidden` no DOM

### `layout/scroll-spy` + `layout/table-of-contents` — concluído

**Quarta instância do padrão `absorbs` falso**, idêntica em estrutura às anteriores (o `variant.note` já dizia "mantido separado; use o TableOfContents", mas o `absorbs` continuava lá): `ScrollSpy` é uma lista plana por `depth` (1|2) com `window.scroll` listener; `TableOfContents` é uma árvore por `level` (1-4) com `IntersectionObserver` e modo controlado via `activeId`/`onItemClick`. Zero código compartilhado, APIs de item diferentes. Corrigido: `absorbs` removido, `description`/`keywords` limpos, variante fantasma `variant="toc"` removida do registry.

- Gate 1: ambos já com `.types.ts`/`index.ts` corretos; `ScrollSpy.tsx` já em aspas duplas/`;`; sem mudança estrutural
- Gate 2: nenhuma cor hardcoded em nenhum dos dois — todos os tokens já corretos (`text-patina`, `bg-patina-soft`, `text-muted`, `bg-raised`/`bg-graphite`)
- Gate 3/spacing: `ScrollSpy` — `gap-0.5`(nav)/`px-3`+`py-1.5`(botão)/`pl-6`(item `depth=2`) → tokens exatos; `gap-2.5` documentado (sem match). `TableOfContents` — `gap-[2px]`→`--spacing-3xs`; `py-1`→`--spacing-2xs`; `LEVEL_PL` (recuo por `level` 1-4) tratado como **escala própria do componente** (hierarquia visual do TOC, não spacing genérico) — só `pl-2`(nível 1) bate exato com `--spacing-sm`, os demais (`pl-5`/`pl-8`/`pl-11`) documentados sem match; `mb-[10px]` documentado sem match
- Gate 5 (**gap real de a11y, mesmo padrão em ambos**): nenhum dos dois marcava o item ativo com `aria-current` — um leitor de tela não tinha como saber qual seção/item está selecionado além da cor (que também falha WCAG por si só sem o atributo). Adicionado `aria-current={isActive ? "true" : undefined}` nos botões dos dois, seguindo o precedente já usado em `VerticalNav`/`Breadcrumb`/etc. no restante da biblioteca. `ScrollSpy`: botão também ganhou `type="button"` explícito (faltava)
- Gate 8: demos já cobriam bem (`ScrollSpy`: depths 1/2; `TableOfContents`: levels 1-3 + modo controlado) — nenhuma mudança necessária
- Gate 9: `e2e/cn/layout/scroll-spy.spec.ts` novo — 6 testes (2 rotas render+console, `table-of-contents` aparece na sidebar confirmando o fix do `absorbs`, clique marca `aria-current` nos dois componentes)

### `overlays/tooltip` (revisita) — `context-card` era um absorbs falso PARCIAL

Ao varrer sistematicamente todo `absorbs:` de `cn-registry.tsx` (ver pendência 0 abaixo), achei um **quinto caso, e o primeiro parcial**: `tooltip` absorve `["rich-tooltip", "popover", "hover-card", "context-card"]` — os 3 primeiros são wrappers genuínos (já confirmados na validação original do Tooltip, ver seção acima), mas `context-card` **não é** — é standalone, revelação 100% CSS (`:hover`/`:focus-within`), zero delegação pro Tooltip (confirmado na própria seção `overlays/context-card` acima, que já dizia isso mas não conectou ao `absorbs` do Tooltip que o escondia). Resultado prático: `overlays/context-card` estava sumido da sidebar desde a sessão anterior, mesmo já 100% validado (9 gates, `context-card.spec.ts` 8/8) — a página existia e funcionava via URL direta, só não aparecia na navegação.

- Corrigido: `context-card` removido do `absorbs` do `tooltip`; `description`/`keywords`/variant `note`/`aliases` limpos da menção a ele (mantido só onde é genuinamente verdade — `hover-card`)
- Nenhuma mudança de código nos componentes em si (achado é 100% de metadata do registry, mesma classe dos outros 4)
- `context-card.spec.ts`: adicionado 1 teste confirmando aparição na sidebar — 10/10 chromium-desktop + mobile-chrome (os 8 testes antigos continuam passando)

### `display/stepper` (revisita) — `dot-stepper`/`progress-steps` eram absorbs falso, sexto achado

Varredura sistemática (pendência 0): `Stepper` absorvia `["dot-stepper", "progress-steps"]`, mas `Stepper.tsx` só despacha por `orientation` (horizontal/vertical) — nenhum modo "dot" ou "progress" próprio existe no arquivo. `DotStepper.tsx` é standalone com dispatch interno (`variant`: dot/dash/progress), zero import de `Stepper`. `ProgressSteps` já tinha sido confirmado como irmão standalone na validação do `Progress` (nem por `Stepper` nem por `Progress` — nenhum dos dois delega). Os dois estavam escondidos da sidebar desde antes desta auditoria começar.

- Corrigido: `absorbs` removido do `stepper`; `description`/`keywords` limpos das menções a dot/progress
- Nenhuma mudança de código nos componentes — achado 100% de metadata do registry
- Gate 8: `display/dot-stepper` e `display/progress-steps` já tinham demo própria (fixadas no achado das 34 páginas quebradas de uma sessão anterior) — só precisavam reaparecer na sidebar
- Gate 9: `e2e/cn/display/stepper.spec.ts` novo (4 testes: 2 rotas render+console, `dot-stepper`/`progress-steps` aparecem na sidebar, clique num dot marca `aria-current="step"`) — 8/8 chromium-desktop + mobile-chrome

### `inputs/badge` (revisita) — `tag`/`status-badge`/`ping` eram absorbs falso, sétimo achado

Continuando a varredura sistemática: `Badge` absorvia `["tag", "status-badge", "ping"]`, mas `Badge.tsx` não tem **nenhuma** menção a "tag"/"status"/"ping" no arquivo inteiro — zero dispatch. Os 3 são componentes standalone com sua própria escala de intent/size, nenhum importa `Badge`. Diferente dos casos anteriores, `tag` e `ping` **nunca tiveram demo no showcase** (nem função, nem entrada em `DEMOS`) — gap de Gate 8 em cima do gap de `absorbs`, então além de reaparecerem na sidebar, precisaram de demo nova. `status-badge` já tinha demo (`StatusBadgeDemo`), só estava escondida.

- Corrigido: `absorbs` removido do `badge`; `description`/`keywords` limpos das menções a tag/status/ping
- Gate 1: `Tag.tsx`/`Ping.tsx` tinham tipos inline — criados `tag.types.ts`/`ping.types.ts`, `.tsx`/`index.ts` atualizados
- Gate 2: nenhuma cor hardcoded nos 3 — tokens já corretos
- Gate 3: `Tag`: `text-[0.6875rem]` (tier `sm`) documentado como abaixo do mínimo, escala própria do componente
- Gate 5 (a11y, achado leve nos 3): anéis de pulso decorativos (`Ping`'s ring animado, `StatusBadge`'s pulse) sem `aria-hidden` — adicionado nos dois (a informação real já está no dot sólido/label, o ring é só efeito visual)
- Gate 8: `TagDemo`/`PingDemo` novas, criadas e wired em `display/tag`/`display/ping`; `StatusBadgeDemo` já existia
- Achado de passagem no showcase: `rounded` bare (sem sufixo) no chip de label do `GridPatternDemo` já fechado numa sessão anterior; nada novo aqui
- Gate 9: `e2e/cn/display/tag.spec.ts` novo (4 testes: 3 rotas render+console + botão de remover); `e2e/cn/inputs/badge.spec.ts` +1 teste confirmando os 3 na sidebar

### `inputs/button` (revisita) — `confirm-button` era wrapper duplicado (não delegava), e um bug real pré-existente descoberto no caminho

`Button` absorve `["magnetic-button", "confetti-button", "confirm-button"]` — **confirmado verdadeiro pros 3** (`Button.tsx` tem dispatch real via `MagneticImpl`/`ConfettiImpl`/`ConfirmImpl`). Mas ao conferir os 3 wrappers, `magnetic-button`/`confetti-button` delegavam de fato (`return <Button effect="..." />`), enquanto `confirm-button/ConfirmButton.tsx` era uma **reimplementação standalone duplicada** — reconstruía manualmente `INTENT_CLASSES`/`INTENT_OUTLINE`/`INTENT_SOFT` e a lógica de doubleclick/hold do zero, incluindo o mesmo `bg-white/20` hardcoded que já tinha sido corrigido dentro do `Button.tsx` (Tier-0, `bg-current/20`) mas nunca propagado pro wrapper standalone.

- Corrigido: `ConfirmButton.tsx` reescrito como wrapper genuíno (`<Button confirm={mode} .../>`), igual ao padrão de `MagneticButton`/`ConfettiButton` — resolve o `bg-white/20` de graça (herda a versão já corrigida do Super)
- Gate 9: `e2e/cn/feedback/confirm-button.spec.ts` novo

**Achado sério e NÃO resolvido nesta sessão** (descoberto ao testar a delegação, não introduzido por ela — reproduz identicamente via `<Button confirm="doubleclick">` direto, incluindo na própria demo "Unificados" da página `inputs/button` que já existia antes de qualquer mudança minha): o modo `confirm="doubleclick"` do `ConfirmImpl` (dentro de `Button.tsx`) **não atualiza visualmente em resposta a cliques reais/confiáveis**. `click()` programático via `page.evaluate(() => el.click())` funciona perfeitamente (label muda pra "Click again to confirm", confirmado via debug de estado/render direto no código). Porém `page.click()` do Playwright (mouse real), `Enter` com foco (teclado), e `page.dispatchEvent('click')` (CDP) — todos falham em refletir a mudança no DOM/accessibility tree final, **mesmo com o estado React internamente correto** (confirmado via `console.log` no corpo do render: `confirming:true`, `label:"Click again to confirm"` computados certinho nos dois passes de render, mas o texto visível nunca muda).

Descartado como causa, um por um, cada um com teste isolado: corrupção de `.next` (rebuild limpo + restart do zero), Fast Refresh/HMR (reproduz em servidor recém-iniciado sem nenhum edit prévio), React StrictMode (reproduz com `reactStrictMode: false` explícito), `active:scale-[0.98]` (reproduz removendo a classe), os handlers `onMouseDown`/`onMouseUp` sempre acoplados mesmo sendo no-op em modo doubleclick (reproduz removendo-os condicionalmente). O modo `hold` (que reage a `mousedown` real, não `click`) funciona normalmente em `chromium-desktop` — o problema é específico do evento `click`/fluxo de confirmação por clique, não de eventos reais em geral. Suspeita não testada por falta de tempo: alguma interação com `<Analytics />`/`<SpeedInsights />` (Vercel) no layout raiz, únicos "ouvintes globais" candidatos encontrados na varredura — não investigado a fundo.

Teste marcado como `test.fail(...)` em `confirm-button.spec.ts` (documenta o bug conhecido, mantém a suíte verde, não mascara silenciosamente). **Prioridade alta pra próxima sessão** — é o padrão "double-click pra confirmar ação destrutiva" (ex: "Delete account"), e se o feedback visual não responde ao primeiro clique real, um usuário pode clicar duas vezes rápido pensando que nada aconteceu, potencialmente pulando o atrito de segurança que o componente existe pra garantir.

### `inputs/input` (revisita) — `password-input`/`search-input` eram absorbs falso PARCIAL, oitavo achado — ✅ VARREDURA DE `absorbs` COMPLETA

Último caso pendente da lista. `Input` absorve 6 nomes; 4 confirmados verdadeiros (`number-input`/`currency-input`/`phone-input`/`floating-label-input`, wrappers genuínos com dispatch real via `type`/`floatingLabel`). Os outros 2 são o caso parcial: `Input.tsx` tem um equivalente **básico** via composição de props genéricas (`revealable` dá toggle mostrar/ocultar; `type="search"+iconLeft+clearable` dá ícone+botão de limpar) — mas os standalone têm funcionalidades reais, não-redundantes, que o Super não replica: `PasswordInput` tem medidor de força (`showStrength`, 4 barras, `getStrength()`); `SearchInput` tem `loading` (spinner), `shortcut` (badge de atalho) e `onSearch` (callback no Enter). O próprio `variant.note` do `revealable` já admitia isso ("medidor de força via password-strength" — apontando pra OUTRO componente, não pro próprio Input) mas o `absorbs` continuava escondendo os 2 da sidebar mesmo assim.

- Corrigido: `password-input`/`search-input` removidos do `absorbs`; `description`/`keywords`/2 variantes fantasma removidas do registry
- Nenhuma mudança de código nos componentes — achado 100% de metadata do registry (ambos já tinham demo própria, sem gap de Gate 8 desta vez)
- `e2e/cn/inputs/input.spec.ts` +1 teste confirmando os 2 na sidebar — 8/8 chromium-desktop + mobile-chrome

**Varredura sistemática de `absorbs` concluída** — todas as ~20 entradas de `cn-registry.tsx` foram conferidas nesta sessão (via `grep -n 'absorbs:' cn-registry.tsx` + leitura de cada arquivo absorvido, cruzando import/delegação real). `Select` (multi-select/rich-select/combobox) confirmado **verdadeiro** — dispatch real via `switch(mode)`, os 3 wrappers delegam de fato. **Resultado final: 8 achados de absorbs falso** (6 totais + 2 parciais: Tooltip/context-card e Input/password+search), zero entradas ainda não verificadas.

### `inputs/color-picker` — concluído

Primeiro componente standalone (não Super/família) auditado nesta sessão depois de fechar a varredura de `absorbs`. Já tinha `.types.ts`/`index.ts` corretos (Gate 1 ok).

- Gate 2: nenhuma violação — hex cru em `DEFAULT_SWATCHES` e no `style={{ background: swatch }}` são cores literais escolhidas pelo usuário (é um seletor de cor, não tem token semântico aplicável); `shadow-[0_0_0_1px_var(--ks-lacquer)]` já usa var() corretamente
- Gate 3/spacing: `gap-[6px]` (match exato `--spacing-xs`) e `gap-2`(×1, match exato `--spacing-sm`) → tokens; `gap-[10px]`/`py-[7px]`/`px-[10px]` documentados (sem match exato). `rounded-[7px]` → `rounded-(--radius-sm)` (regra do radius é "usar o token mais próximo mesmo sem match exato", diferente da regra de spacing — 7px dentro da escala 2-28px, então documentar não é opção aqui)
- Gate 5 (**gaps reais de a11y corrigidos**): swatches não tinham `aria-pressed` — usuário de leitor de tela não sabia qual cor estava selecionada além do nome (`aria-label`); adicionado `aria-pressed={selected}`. Input de hex não tinha `aria-label`/`<label>` nenhum — adicionado `aria-label="Cor em hexadecimal"`. Preview de cor (div decorativa) sem `aria-hidden` — adicionado. Input `type="color"` nativo sem `aria-label` próprio (só `title`) — adicionado
- Gate 8: demo só tinha 1 instância — adicionada uma segunda (`Frame` com modo controlado + modo `disabled` lado a lado)
- Gate 9: `e2e/cn/inputs/color-picker.spec.ts` novo (5 testes: crash/console + clique em swatch atualiza `aria-pressed`+input + digitação de hex válido + instância disabled bloqueada) — 10/10 chromium-desktop + mobile-chrome. Nota de teste: `page.locator("button[disabled]")` sem escopo pegou um botão **não relacionado** do header ("Entrar"/"Cadastrar", desabilitados por "em breve") — corrigido pra `getByRole` com nome específico

### `inputs/signature-pad` — concluído

Segundo standalone da fila. Não tinha `.types.ts` (Gate 1 — criado `signature-pad.types.ts`, `.tsx`/`index.ts` atualizados).

- Gate 2: `strokeColor = color ?? 'oklch(95% 0.01 0)'` usado direto em `ctx.strokeStyle` — exceção válida documentada (canvas 2D API não aceita CSS var), comentário adicionado
- Gate 3/spacing: `gap-2`(×2) → `gap-(--spacing-sm)` exato nos dois lugares
- Gate 4: os botões `Clear`/`Save` eram `<button>` cru com estilo reimplementado do zero (cores, padding, radius) — viraram `<Button variant="outline" intent="neutral" size="sm">`/`<Button variant="solid" intent="primary" size="sm">`, herdando o sistema visual completo do Super
- Gate 5 (**gap real de a11y, limitação inerente documentada**): `<canvas>` sem nenhuma semântica pra leitor de tela — adicionado `role="img"` + `aria-label` dinâmico ("empty"/"signature drawn"). A limitação de fundo (captura de assinatura à mão livre é fundamentalmente inacessível por teclado, não é algo que dá pra resolver sem mudar o método de entrada) fica documentada, não "corrigida" por completo — mesma categoria de ressalva do `ContextCard`
- Gate 8: demo só tinha 1 instância — adicionada seção com cor customizada + modo `readOnly`
- Gate 9: `e2e/cn/inputs/signature-pad.spec.ts` novo (4 testes: crash/console + `aria-label` muda ao desenhar + Save desabilitado até desenhar/Clear reseta) — 8/8 chromium-desktop + mobile-chrome. Nota de teste: `page.mouse.move/down/up` (coordenadas reais) não entrega `mousedown`/`mousemove` no projeto `mobile-chrome` (`hasTouch: true` faz o Chromium se comportar como dispositivo touch-only de verdade, sem sintetizar mouse) — trocado por `canvas.dispatchEvent(...)` direto, funciona igual nos dois projetos

### `inputs/otp-input` — concluído

Terceiro standalone da fila. Já tinha `.types.ts`/`index.ts` corretos (Gate 1 ok).

- Gate 2/3: sem violação de cor; `SIZE_WRAP` (gap por tier) documentado como escala própria do componente; `mx-0.5` → `mx-(--spacing-3xs)` (match exato)
- Gate 5: sem `role="group"`/`aria-label` no wrapper (leitor de tela ouvia "OTP digit 1", "OTP digit 2"... sem contexto do conjunto) — adicionado `role="group" aria-label="One-time passcode"`. Adicionado também `autoComplete="one-time-code"` (habilita autofill de SMS no mobile, ausente antes)
- **Bug real grave encontrado e corrigido, pré-existente, não relacionado a nenhuma mudança desta sessão**: o estado inicial (`useState`) usava `(controlled ? value! : defaultValue).split("").slice(0, length)` — com `defaultValue="" `(o padrão), `"".split("")` produz um array **vazio**, não um array de `length` posições vazias, então `cells.map()` nunca renderizava **nenhuma célula**. O componente inteiro estava invisível sempre que usado com o valor inicial vazio (o caso mais comum, incluindo a própria demo do showcase) — nunca detectado porque não havia spec Playwright antes desta validação. O modo controlado tinha o **mesmo bug**, disfarçado atrás de um `.padEnd(length, "")` que parecia uma correção mas é um no-op: `padEnd` com `fillString` vazio sempre retorna a string original sem preencher nada (confirmado no spec do MDN/ECMAScript). Corrigido com um helper `toCells()` baseado em `Array.from({length}, (_, i) => v[i] ?? "")`, usado nos dois modos
- Gate 8: demo já cobria bem (3 variantes, tamanhos, mask) — sem mudança
- Gate 9: `e2e/cn/inputs/otp-input.spec.ts` novo (5 testes: crash/console + digitação completa + Backspace navega/limpa + paste preenche todas as células) — 10/10 chromium-desktop + mobile-chrome. Sem esse spec o bug das células invisíveis nunca teria sido pego

### `inputs/tag-input` — concluído

Quarto standalone. Não tinha `.types.ts` (Gate 1 — criado `tag-input.types.ts`).

- **Achado de showcase (mesma classe das ~35 páginas já fechadas em sessões anteriores)**: registrado no `cn-registry.tsx`, mas **nunca importado nem referenciado em `_showcase.tsx`** — nem função de demo, nem entrada em `DEMOS`. Página renderizava "não encontrada". Import + `TagInputDemo` nova + entrada `"inputs/tag-input"` adicionados
- Gate 3/spacing: `gap-1` do chip de tag (não ligado a tier, fixo) → `gap-(--spacing-2xs)` exato; `SIZE_WRAP`/`SIZE_TAG` (por tier) documentados como escala própria do componente
- Gate 5 (**gap real de a11y corrigido**): o `<input>` de digitação só tinha `placeholder` como identificação — e o `placeholder` some assim que existe pelo menos 1 tag (`placeholder={tags.length === 0 ? placeholder : undefined}`), deixando o input **sem nome acessível nenhum** depois da primeira tag. Adicionado `aria-label={placeholder}` fixo, independente do estado
- Gate 8: demo nova cobre digitação+onChange controlado, `max` (campo some ao atingir o limite) e `disabled`
- Gate 9: `e2e/cn/inputs/tag-input.spec.ts` novo (6 testes: crash/console + Enter cria tag/Backspace remove última + clique no X remove só a tag certa + `max` esconde o campo) — 10/10 chromium-desktop + mobile-chrome

### `inputs/file-upload` — concluído

Quinto standalone. Já tinha `.types.ts`/`index.ts` corretos (Gate 1 ok).

- Gate 2: `bg-[color-mix(in_srgb,var(--ks-primary)_5%,transparent)]` (hover/drag-over do dropzone) recriava manualmente o padrão que já existe como token → `bg-patina-soft`
- Gate 3/spacing: `px-3`→`--spacing-md`, `mt-[6px]`(×2)→`--spacing-xs`, `mt-3`→`--spacing-md`, `gap-2`→`--spacing-sm`, `py-2 px-4`(botão)→tokens exatos (herdados de graça ao virar `<Button>`); `gap-[10px]`/`py-[10px]` documentados (sem match exato); `rounded-[4px]`→`--radius-xs`, `rounded-[12px]`→`--radius-md` (mesmo critério já usado no Modal pra 12px), `rounded-[7px]`→`--radius-sm` (mesmo critério do ColorPicker pra 7px, ambos nesta sessão); `SIZE_PAD` documentado como escala própria do componente
- Gate 4: o botão "Choose file…" (variante `button`) era `<button>` cru reimplementando cor/padding/radius → virou `<Button variant="outline" intent="neutral">`, herdando o sistema visual completo do Super
- Gate 5 (**gap real e grave de a11y encontrado e corrigido**): a dropzone (variante padrão) era um `<div onClick>` **sem `role`, sem `tabIndex`, sem `onKeyDown`** — completamente inacessível por teclado, violação direta da regra 2 do Gate 5 do CLAUDE.md. Adicionado `role="button"` + `tabIndex={0}` (`-1` quando `disabled`) + `onKeyDown` (Enter/Space aciona o input de arquivo escondido) + `aria-label`. Botão de remover arquivo sem `aria-label`/`type="button"` — adicionado. Ícones decorativos (`UploadIcon`/`FileIcon`/`XIcon`) sem `aria-hidden` — adicionado nos 3
- Gate 8: demo já cobria os 2 variants (dropzone + button) com `maxSize`/`accept`/`hint` — sem mudança
- Gate 9: `e2e/cn/inputs/file-upload.spec.ts` novo (5 testes: crash/console + dropzone acionável via teclado (Enter dispara o input real) + upload via `setInputFiles` mostra a lista e permite remover + variante button usa o `<Button>` de verdade) — 10/10 chromium-desktop + mobile-chrome

### `inputs/inline-edit` — concluído

Sexto standalone. Não tinha `.types.ts` (Gate 1 — criado `inline-edit.types.ts`).

- **Achado de showcase** (mesma classe de bug já fechada em ~36 outras páginas): registrado no `cn-registry.tsx` mas nunca importado/referenciado em `_showcase.tsx`. Demo nova + wiring adicionados
- **Bug real confirmado, mesma classe já achada no `Slider` nesta sessão**: `focus-within:shadow-[0_0_0_2px_var(--ks-primary)/20]` — `/20` dentro do `var()` é sintaxe de opacidade inválida, o navegador descarta a declaração inteira de `box-shadow`. Confirmado via Playwright (`getComputedStyle(...).boxShadow` real, não mais `"none"`). Corrigido com `color-mix(in oklch, var(--ks-primary) 20%, transparent)`
- Gate 3/spacing: sweep completo (nenhuma escala por tamanho neste componente) — `gap-1.5`/`px-2`/`py-1`/`gap-1`/`p-0.5`/`pt-1` → tokens exatos em todos os pontos
- Gate 5 (**gap real de a11y corrigido**): `<input>`/`<textarea>` do modo de edição sem `aria-label` nenhum — leitor de tela não tinha contexto do que estava sendo editado. Adicionado `aria-label={placeholder}`
- Gate 8: demo nova cobre single-line, multiline (Cmd/Ctrl+Enter), placeholder vazio e `disabled`
- Gate 9: `e2e/cn/inputs/inline-edit.spec.ts` novo (5 testes: crash/console + clique entra em edição e Enter confirma + Escape cancela + `box-shadow` real no foco, confirmando o fix). Nota de teste: `getByRole("textbox")` sem escopo pegou o campo de busca do header (`Buscar componentes`) em vez do input do componente — corrigido escopando a `page.locator("main")` — 10/10 chromium-desktop + mobile-chrome

### `inputs/split-button` — concluído

Sétimo standalone. Não tinha `.types.ts` (Gate 1 — criado `split-button.types.ts`).

- **Achado de showcase** (mesma classe de bug já fechada em outras páginas): registrado no `cn-registry.tsx` mas nunca importado/referenciado em `_showcase.tsx`. Demo nova + wiring adicionados
- Gate 2 (**bug real de cor corrigido**): `DIVIDER_CLS` usava `bg-white/20`/`bg-black/20` fixos, escolhidos manualmente por intent assumindo qual fundo é "claro" ou "escuro" — mesmo achado já corrigido no hold-progress do `Button` nesta sessão. Corrigido pra `bg-current/20` + a mesma classe `text-*-fg` já usada pelo botão daquele intent (o divider é um `<div>` irmão, não filho do botão, então precisa da própria cor de texto pra `currentColor` resolver certo)
- Gate 3/spacing: `p-1`→`--spacing-2xs`, `px-3 py-1.5`(item de menu)→tokens exatos; `SIZE_BTN`/`SIZE_CHEVRON` documentados como escala própria do componente
- Gate 5 (**gaps reais de a11y corrigidos**): o botão de chevron tinha `aria-expanded` mas não `aria-haspopup="menu"` (padrão WAI-ARIA de menu button) — adicionado. O menu aberto não fechava com Escape (só clique fora) — adicionado listener de teclado. Menu sem `aria-label` próprio — adicionado
- Gate 8: demo nova cobre os 5 intents, 3 sizes e `disabled`
- Gate 9: `e2e/cn/inputs/split-button.spec.ts` novo (5 testes: crash/console + chevron abre menu com `aria-haspopup`/`aria-expanded` + Escape fecha + clique fora fecha + item `disabled` não dispara) — 10/10 chromium-desktop + mobile-chrome

### `inputs/input-group` — concluído

Oitavo standalone. Não tinha `.types.ts` (Gate 1 — criado `input-group.types.ts`).

- **Achado de showcase** (mesma classe já fechada em outras páginas): registrado no `cn-registry.tsx` mas nunca importado/referenciado em `_showcase.tsx`. Demo nova + wiring adicionados
- Gate 2: `text-[0.75rem]` cru (banido, tier `sm`) → `text-body-caption` (match exato)
- Gate 3/spacing: `pr-1.5`/`pl-1.5` do addon-ícone (estrutural, não ligado ao tier de `size`) → `--spacing-xs` exato; `pl-2.5`/`pr-2.5` documentados (sem match exato); `SIZE_ADDON` mantido como escala própria por tier (padding/dimensão)
- Gate 5 (**limitação documentada, não "corrigida" por completo, mesma categoria do `ContextCard`**): `disabled`/`invalid` só afetam a aparência/`pointer-events` do wrapper — o `<input>` real passado como `children` continua focável e editável por teclado a menos que o consumidor TAMBÉM passe `disabled`/`aria-invalid` pro input diretamente (o componente não clona/injeta props no filho). Adicionado JSDoc explicando isso explicitamente; a demo nova já modela o padrão correto (espelha os dois nos inputs reais)
- Gate 8: demo nova cobre prefixo/sufixo de texto, prefixo de ícone, `invalid` e `disabled` (com o filho corretamente espelhado)
- Gate 9: `e2e/cn/inputs/input-group.spec.ts` novo (4 testes: crash/console + prefixo/sufixo visíveis ao redor do input real + instância disabled espelha `disabled` de verdade no input, não só visual) — 8/8 chromium-desktop + mobile-chrome

### `inputs/form-field` — concluído, + bug real achado no `Input` (Tier-0, já validado antes)

Nono standalone. Já tinha demo wired, só faltava `.types.ts` (Gate 1 — criado `form-field.types.ts`).

- Gate 3/spacing: `gap-1`(×2)→`--spacing-2xs`, `ml-0.5`→`--spacing-3xs` — tokens exatos
- Gate 5 (**limitação documentada + fix real que a torna utilizável**): `required`/`errorMessage` só afetam a aparência — o `<input>` real (children) não recebe `required`/`aria-invalid` automaticamente (documentado via JSDoc, mesma categoria do `InputGroup`). Mas o hint/erro agora ganha um `id` estável derivado de `htmlFor` (`${htmlFor}-description`), pra o consumidor conseguir ligar via `aria-describedby` — antes disso nem essa ligação era possível
- **Bug real encontrado no `Input` (Tier-0) ao tentar montar a demo corretamente**: `Input.tsx` sempre sobrescrevia qualquer `aria-describedby`/`aria-invalid` passado pelo consumidor com seu próprio cálculo interno (baseado só nas props `hint`/`error` do próprio `Input`) — mesmo quando esse cálculo interno dava `undefined`. Isso quebrava qualquer composição externa tipo `<FormField><Input aria-describedby="..." /></FormField>`, que é exatamente o padrão que a doc do `FormField` recomenda. Corrigido: `Input` agora combina o próprio hint/erro com o que o consumidor passar (`[hintId, describedByProp].filter(Boolean).join(' ')` pro describedby; `resolvedStatus === 'error' || invalidProp` pro invalid) em vez de sobrescrever cegamente. Confirmado sem regressão: suite existente do `Input` (8 testes, dark mode incluso) — 18/18 rodando junto com a nova suite do `FormField`
- Gate 8: demo existente atualizada pra realmente ligar `htmlFor`/`id`/`aria-describedby`/`aria-invalid` nos 3 exemplos (antes não ligava nada, `htmlFor` apontava pra um id que nunca existia no DOM)
- Gate 9: `e2e/cn/inputs/form-field.spec.ts` novo (5 testes: crash/console + label associa via `getByLabel` + hint com `id` real referenciado por `aria-describedby` + erro com `role=alert` referenciado da mesma forma) — 10/10 chromium-desktop + mobile-chrome (mais os 8 do `Input` confirmando zero regressão)

### `inputs/number-pad` — concluído

Décimo standalone. Já tinha `.types.ts`/`index.ts`/demo corretos (Gate 1/8 ok de cara).

- Gate 3/spacing: `gap-4`/`gap-3`/`gap-2` → tokens exatos (`--spacing-lg`/`--spacing-md`/`--spacing-sm`)
- Gate 5 (**gap real de a11y encontrado e corrigido**): o indicador de progresso (pontos preenchidos em modo `masked`, ou os dígitos/pontinhos em modo texto) é **100% visual** — nenhuma indicação pra leitor de tela de quantos dígitos já foram digitados. Adicionado `role="status" aria-live="polite"` com texto tipo "2 of 4 digits entered", atualizado a cada tecla. A tecla `⌫` também não tinha `aria-label` (só o glyph Unicode como nome acessível) — adicionado `aria-label="Backspace"`. Grid de teclas ganhou `role="group" aria-label="Number pad"` pra contexto
- Gate 8: demo já cobria bem — sem mudança
- Gate 9: `e2e/cn/inputs/number-pad.spec.ts` novo (4 testes: crash/console + status ao vivo atualiza ao digitar + Backspace remove e zera o status) — 6/8 rodando, 2 skipped em `mobile-chrome` (pendência sistêmica 0b: sidebar do showcase intercepta clique real em `~393px`, não é bug do componente)

### `inputs/pricing-toggle` — concluído

Décimo primeiro standalone. Já tinha `.types.ts`/`index.ts`/demo corretos.

- Gate 2 (**bug real de cor corrigido**): thumb do switch usava `bg-white` hardcoded — mesmo achado já corrigido no `Slider` nesta sessão → `bg-canvas`. O fundo ativo (`current === 'yearly'`) usava `style={{ background: 'var(--ks-primary)' }}` inline em vez da classe `bg-patina` — convertido pra classe, consistente com o resto do arquivo
- Gate 3/spacing: `gap-3`→`--spacing-md`, `px-2 py-0.5`(badge de savings)→`--spacing-sm`/`--spacing-3xs`, `top-0.5 left-0.5`(posição do thumb)→`--spacing-3xs` — todos exatos
- Gate 5 (**gaps reais de a11y corrigidos**): o `<button role="switch">` não tinha **nenhum** nome acessível (nem `aria-label`, nem texto visível dentro) — leitor de tela anunciava só "switch", sem saber o que alternava. Adicionado `aria-label` dinâmico ("Switch to Yearly"/"Switch to Monthly"). Os dois `<span onClick>` (labels "Monthly"/"Yearly" clicáveis) não tinham `role`/`tabIndex`/`onKeyDown` — violação direta da regra 2 do Gate 5 do CLAUDE.md, inacessíveis por teclado. Adicionado `role="button"` + `tabIndex={0}` + `onKeyDown` (Enter/Space) nos dois
- Gate 9: `e2e/cn/inputs/pricing-toggle.spec.ts` novo (5 testes: crash/console + `aria-label`/`aria-checked` mudam ao clicar + thumb não usa mais `bg-white` + label "Yearly" aciona via teclado) — 10/10 chromium-desktop + mobile-chrome

### `inputs/newsletter-form` — concluído

Décimo segundo standalone. Já tinha `.types.ts`/`index.ts`/demo/`<Button>` do Super corretos (Gate 1/4/8 ok de cara).

- Gate 3/spacing: sweep completo (`gap-3`/`gap-2`/`px-3 py-2`/`mt-2`/`p-6`) → tokens exatos em todos os pontos
- Gate 5 (**gaps reais de a11y corrigidos**): `<input type="email">` só tinha `placeholder`, sem `aria-label`/`<label>` — adicionado `aria-label` + `aria-invalid`. Emoji decorativos (🎉, ✉️) sem `aria-hidden` — adicionado. Bloco de confirmação sem `role="status"` — adicionado
- **Bug real de UX encontrado e corrigido, achado ao tentar montar o teste do erro**: o `<form>` não tinha `noValidate`. Como o input é `type="email"`, a validação **nativa do navegador** intercepta o evento `submit` **antes** do `handleSubmit` do componente rodar sempre que o email é inválido — o balão de erro nativo do Chrome aparecia (com wording/idioma do SO do usuário, fora do tema) e a mensagem de erro **estilizada do próprio componente nunca era alcançada**, virando código morto pra qualquer entrada que já falhasse a validação nativa (a maioria dos casos reais). Corrigido com `noValidate` no `<form>`, deixando a validação customizada (`isEmail()` + `role="alert"` + `aria-describedby`) realmente rodar
- Gate 9: `e2e/cn/inputs/newsletter-form.spec.ts` novo (4 testes: crash/console + email inválido mostra erro estilizado com `role=alert`/`aria-describedby`/`aria-invalid` reais + email válido dispara `onSubmit` e mostra confirmação com `role=status`) — 8/8 chromium-desktop + mobile-chrome

### Fix pontual — `SiteHeader.tsx` (`.sh-kbd`), reportado pelo usuário

Mesmo bug do `cnh-kbd` (achado/corrigido antes nesta sessão), agora no header do site público: badge `⌘K` sem `display:inline-flex`/`align-items:center` — ficava colado no texto "Buscar" e desalinhado verticalmente. Corrigido idêntico: `display:inline-flex; align-items:center; justify-content:center` no `.sh-kbd` + `Buscar`/`<kbd>` envolvidos num `<span className="inline-flex items-center gap-(--spacing-2xs)">`. Confirmado visualmente no browser (zoom no header).

### `inputs/fab` — concluído

Décimo terceiro standalone.

- Gate 1: faltava `fab.types.ts` (tipos inline no `.tsx`) — extraído
- Gate 3: `text-sm`/`text-lg`/`text-xl`/`text-xs`/`text-base` cru nas escalas `SIZE_BTN`/`SIZE_ACTION` (tamanho do ícone por tier) → mapeados pros tokens exatos mais próximos (`text-body-callout`/`text-body-paragraph`/`text-body-title`/`text-body-caption`), mantendo ordem crescente entre os 3 tiers
- Gate 3/spacing: `gap-3`/`gap-2`/`px-2 py-0.5` → tokens exatos; offsets de posição fixa (`bottom-6 right-6` etc.) → `bottom-(--spacing-xl) right-(--spacing-xl)` etc.
- Gate 4: não reusa `<Button>` CN — forma circular (`rounded-full`) e escala própria (`lg` chega a 64px, fora do maior tier do Button) são bespoke de floating action button, mesmo raciocínio já documentado pro chevron do SplitButton. Documentado no componente, não bloqueante
- Gate 5 (**gap real de a11y corrigido**): botão principal sem `actions`/`tooltip` ficava **sem nome acessível nenhum** (`aria-label` só era setado se `tooltip` ou `hasActions` fosse verdadeiro) — adicionado fallback `"Ação"`. Também adicionado `aria-haspopup`/`aria-expanded` no botão principal e Escape fecha o speed-dial (mesmo padrão do SplitButton)
- **Bug real de showcase encontrado e corrigido**: o demo "Speed-dial" envolvia o `<Fab position="bottom-right">` (que é `position:fixed`) num `<div className="relative ... overflow-hidden">`, assumindo que isso conteria o botão dentro da caixa — mas `position:fixed` sempre usa o viewport como referência a menos que algum ancestral tenha `transform`/`filter`/`contain`/`will-change:transform`, nenhum dos quais estava presente. Resultado: o FAB "vazava" pro canto real da tela do navegador em vez de aparecer dentro do card de demonstração (reproduzível, confirmado via screenshot antes/depois). Corrigido com `[contain:layout]` no wrapper, que cria o _containing block_ necessário
- Achado de passagem no registry: `intent` documentado com só 3 valores (`primary`/`secondary`/`neutral`) quando o tipo real tem 5 (+ `success`/`danger`); `style` também faltava na tabela de props — corrigido em `cn-registry.tsx` + `registry:build`
- Gate 8: demo enriquecida com seção "Sizes" (sm/md/lg) além de posição/speed-dial e intents já existentes
- Gate 9: `e2e/cn/inputs/fab.spec.ts` novo (7 testes: crash/console/aria-label fallback/speed-dial abre-fecha+contido no card/ações disparam onClick/4 intents/3 sizes) — 12/12 chromium-desktop + mobile-chrome úteis passando, 2 `test.skip` em mobile-chrome (pendência 0b, sidebar intercepta clique), firefox falha por binário ausente (ambiental, não bloqueia)

### `display/feature-list` — concluído

Décimo quarto standalone.

- Gate 1: faltava `feature-list.types.ts` (tipos inline no `.tsx`) — extraído
- Gate 2 (**achado real**): intents usavam opacidade ad-hoc (`text-patina bg-patina/10` etc.) em vez dos tokens soft canônicos — trocado por `bg-*-soft`/`text-*-soft-fg` em todas as 6 intents (incluindo `neutral`, que usava `bg-graphite`/`text-foreground` solto)
- Gate 3: `text-lg` cru no ícone da variante `icon` → `text-body-title` (mais próximo, sem token exato em 18px); `text-[0.65rem]` do numeral da variante `numbered` documentado como exceção válida (`below scale minimum`, badge circular pequeno, decorativo)
- Gate 3/spacing: `gap-3`/`mt-0.5` → tokens exatos
- Gate 5 (**gap real de a11y corrigido**): item com `available:false` só comunicava o estado via opacidade + ícone X (que já tinha `aria-hidden`) — pra quem usa leitor de tela não havia NENHUMA indicação de indisponibilidade. Adicionado `<span className="sr-only">Não disponível: </span>` antes do título. Também adicionado `aria-hidden="true"` nos indicadores decorativos das variantes `numbered`/`icon` (só o `check` já tinha, via `CheckIcon`/`XIcon`)
- Achado de passagem no registry: tabela de props bem desatualizada — `variant` documentava um valor `'bullet'` que **nunca existiu** (o valor real é `'numbered'`); `intent` só listava 3 valores quando o tipo real tem 6; default de `intent` documentado como `'success'` quando o real é `'primary'`; descrição de `items` citava um shape `{ label, included?, description? }` que não bate com `FeatureItem` real (`{ title, description?, icon?, available? }`); faltava `style` na tabela — tudo corrigido + `registry:build`
- Gate 8: demo ganhou uma seção nova "Item indisponível (available: false)", prop que não tinha nenhum exemplo antes
- Gate 9: `e2e/cn/display/feature-list.spec.ts` novo (5 testes: crash/console/sr-only de indisponível/aria-hidden dos indicadores/números da variante numbered) — 10/10 chromium-desktop + mobile-chrome
- **Nota de infraestrutura reincidente**: o Browser pane mostrou o demo desatualizado (sem a nova seção "Item indisponível") mesmo após `navigate force + reload(true)` e aba nova — confirmado via `fetch(url, {cache:"no-store"})` direto no `javascript_tool` que o HTML servido pelo Next **já continha** o conteúdo novo. Mesmo padrão já documentado na validação do `Tabs` (bundle client do pane fica preso numa versão velha; Playwright, que abre um browser isolado, sempre reflete o estado real). Não é bug do componente — só reforça a regra já escrita: **preferir Playwright a inspeção visual manual via Browser pane quando o pane parecer não refletir uma mudança recente**

### `task_66252e1d` — `<Input>` CN ganhou `forwardRef` — ✅ FECHADO

Flagado durante a validação do `keyboard-shortcuts`, resolvido em seguida na mesma sessão (o usuário disparou a task diretamente). `Input.tsx` (Tier-0) agora envolve o componente inteiro e cada um dos 5 modos internos (`TextInputImpl`, `FloatingLabelImpl`, `NumberInputImpl`, `CurrencyInputImpl`, `PhoneInputImpl`) em `React.forwardRef`, encaminhando o `ref` até o `<input>` real renderizado em qualquer modo. `CurrencyInputImpl` precisou de um `mergeRefs()` novo (helper adicionado no topo do arquivo) porque já usava um ref interno próprio pra `.select()` no focus — o ref encaminhado e o interno agora convivem no mesmo nó.

`KeyboardShortcuts.tsx` foi revisitado pra trocar o workaround de `querySelector('input[type="search"]')` por um `useRef<HTMLInputElement>` de verdade passado direto pro `<Input ref={searchRef} .../>`.

Verificação: `npx tsc --noEmit -p .` limpo (só o erro pré-existente do `dompurify`, não relacionado); `npx eslint` limpo no `Input.tsx` e no `KeyboardShortcuts.tsx` (só 2 warnings pré-existentes de `jsx-a11y` no overlay clicável do dialog, não introduzidos aqui); regressão completa rodada e verde — `e2e/cn/inputs/input.spec.ts` (8/8), `e2e/cn/display/keyboard-shortcuts.spec.ts` (12/12, incluindo o novo teste de foco via ref real), e os 3 outros consumidores de `<Input>` validados nesta sessão — `form-field.spec.ts` + `input-group.spec.ts` + `newsletter-form.spec.ts` (26/26 juntos) — confirmando zero regressão colateral no componente Tier-0 mais usado da lib.

**Nota de metodologia**: a primeira rodada de Playwright pós-mudança deu 8 falhas por timeout de 30s, aparentando um crash grave — investigação via `preview_logs` mostrou que era só o _primeiro_ compile daquele arquivo levando ~40s (heavy recompile do bundle, não um erro real); os "erros de sintaxe" que apareceram no log eram de estados intermediários do arquivo _durante a própria edição_ (chaves de `forwardRef` ainda não fechadas entre uma tool call e outra), já resolvidos no arquivo final. `tsc --noEmit` limpo foi o sinal definitivo de que não havia erro de sintaxe real; re-rodar os testes após o compile "esquentar" confirmou 8/8 verde.

### Achado paralelo — `@types/dompurify` quebra `npx tsc --noEmit -p .` do projeto inteiro

Confirmado via `git stash` que reproduz na árvore limpa (não é causado por nenhum componente desta sessão): o pacote `@types/dompurify@3.2.0` instalado é um stub deprecated sem `index.d.ts` (`dompurify`/`isomorphic-dompurify` já publicam tipos próprios). Como o `tsconfig.json` não tem `"types"` explícito, o TS tenta incluir todo `@types/*` como biblioteca implícita e quebra em `TS2688: Cannot find type definition file for 'dompurify'`. Não bloqueia o dev server (Next usa um checker mais tolerante), mas quebra qualquer `tsc --noEmit` "de verdade" — inclusive os rodados nesta auditoria, que por isso passaram a ignorar esse erro específico ao validar cada componente (nenhum dos typechecks desta sessão listou outro erro além deste). Flagado como task separada (`task_dfb2f5fe`) pra remover a dependência de tipos obsoleta — fix provável é só tirar `@types/dompurify` do `package.json`/lockfile.

### `inputs/chip-group` — concluído

Décimo quinto standalone. Confirmado `absorbs` VERDADEIRO (`ChipGroup.tsx` é wrapper fino real, `<ToggleGroup variant="chip" {...props} />`, zero lógica própria) — mesmo assim passou pelos 9 gates porque delegação não isenta de bug.

- Gate 1: faltava `chip-group.types.ts` (o único tipo próprio, `ChipGroupProps`, estava inline) — extraído
- Gates 2/3/5/6: herdados de `ToggleGroup` (já validado em sessão anterior) por delegação total — nada pra corrigir no wrapper em si
- **Bug real grave encontrado e corrigido, na fonte (`ToggleGroup.tsx`, não no wrapper)**: `ChipToggleGroup` tinha `multiSelect = true` como default. Ou seja, **todo uso de `<ChipGroup>` sem passar `multiSelect` explicitamente rodava em modo multi-seleção**, mesmo quando a intenção (e a documentação do registry, que já dizia default `'false'`) era single-select. Sintoma visível: clicar num chip diferente **acumulava** a seleção (`"react, vue"`) em vez de trocar (`"vue"`) — reproduzido tanto no browser (via clique real E via `.click()` síncrono, com checagem de fiber/DOM) quanto no Playwright (2 testes falhando em chromium-desktop + mobile-chrome antes do fix). Corrigido pra `multiSelect = false`, com comentário explicando o porquê. Reconfirmado com o teste próprio do `ChipGroup` + a suíte inteira de `toggle-group.spec.ts` (18/18, sem regressão nas variantes segmented/filter/base)
- Achado de passagem no registry: `intent` só listava 4 dos 7 valores reais (faltavam `secondary`/`warning`/`info`); faltava `disabled?` na descrição de `chips`; faltava `style` — corrigido + `registry:build`
- Gate 8: demo já cobria single/multi/intents adequadamente, sem mudança
- Gate 9: `e2e/cn/inputs/chip-group.spec.ts` novo (4 testes: crash/console/single-select troca em vez de acumular/multi-select acumula) — 8/8 chromium-desktop + mobile-chrome
- **Nota**: `FilterToggleGroup` (variante `filter`, absorve `FilterBar`) tem o mesmo padrão `multiSelect = true` — **não mexido aqui** porque pra filtros multi-seleção como default é uma escolha de UX defensável (diferente de chips, que geralmente representam uma escolha exclusiva tipo tab/radio visual) e está fora do escopo desta validação pontual do ChipGroup; verificar quando `inputs/filter-bar` for validado formalmente. **Atualização**: validado em `inputs/segmented-control` + `inputs/filter-bar` acima — confirmado que `true` é o real (era o registry que estava errado, não o código), corrigido lá
- **Retrospecto (varredura da família `select`/`toggle-group`/`dropdown-menu`)**: `chip-group.types.ts` também tinha o mesmo bug de import — `ToggleGroupChipProps`/`ChipGroupChip`/`ChipGroupIntent`/`ChipGroupSize` vinham de `ToggleGroup.tsx` (o `.tsx` do Super) em vez de `toggle-group.types.ts`, não pego na validação original porque na época o padrão ainda não tinha sido identificado como recorrente. Corrigido de passagem

### `inputs/calendar` — concluído

Décimo sexto standalone. Confirmado `absorbs` VERDADEIRO (`Calendar.tsx` é wrapper fino real, `<DatePicker mode="inline" {...} />`) — Gates 1/2/3/4/6 já vinham corretos (tinha `.types.ts` e `index.ts` desde o início).

- **Bug real de a11y encontrado e corrigido, na fonte (`DatePicker.tsx`, `InlineCalendar`, não no wrapper)**: dias com evento mostravam só um pontinho colorido decorativo (`<span>` sem `aria-hidden`) — nenhuma indicação de QUAL era o evento nem pra mouse (sem `title`) nem pra leitor de tela (sem `aria-label` no `<button>` do dia, que só continha o número visualmente). Corrigido: `aria-label` agora inclui data + eventos do dia (ex.: `"5 de agosto — Team sync"`), `title` com a lista de eventos, e `aria-hidden="true"` no pontinho decorativo. Afeta também `EventCalendar`/`date-picker` (mesmo `InlineCalendar` compartilhado) — benefício automático, sem retrabalho
- Achado de passagem no registry: faltava `style` na tabela de props — corrigido + `registry:build`
- Gate 8: demo só tinha 1 variação (controlado + events) — adicionada uma segunda ("Uncontrolled (defaultValue) + onEventClick") pra exercitar o modo não-controlado e o callback de clique em evento, que antes não tinha nenhum exemplo
- Gate 9: `e2e/cn/inputs/calendar.spec.ts` novo (4 testes: crash/console/clicar em dia com evento dispara `onEventClick`) — 3/4 úteis passando em chromium-desktop + mobile-chrome, 1 `test.skip` em mobile-chrome (pendência 0b, sidebar intercepta clique). Reconfirmado sem regressão contra `date-picker.spec.ts` inteiro (29/30, mesmo skip)
- **Nota de metodologia**: a primeira versão do teste tentava clicar num texto `"Team sync"` — não existe como texto na UI (o evento é só o pontinho colorido), então o teste falhava por timeout tanto no Playwright quanto reproduzido manualmente no browser. Corrigido pra clicar no `<button>` do dia via o `aria-label` novo (`/Team sync/`), o que só foi possível **depois** do fix de a11y acima — sem o `aria-label`, não existiria nenhum jeito confiável de mirar o dia certo por acessibilidade

### `layout/aspect-ratio` — concluído

Décimo sétimo standalone. Componente puramente estrutural (zero cor/tipografia própria) — Gates 2/3/5/6 triviais (nada pra corrigir).

- Gate 1: faltava `aspect-ratio.types.ts` (tipos inline no `.tsx`) — extraído
- **Bug real de demo encontrado e corrigido**: os 3 exemplos do showcase (`16:9`/`1:1`/`4:3`) envolviam o texto numa `<div>` colorida **sem `h-full`** — como `AspectRatio` só garante que o wrapper interno (`absolute inset-0`) tenha a altura certa, mas não estica automaticamente o filho do consumidor pra preencher esse wrapper, a `<div>` colorida ficava do tamanho do próprio texto (~23px de altura) em vez da altura real da proporção (ex.: 162px pro card de 288px de largura em 16:9) — visualmente a demo mostrava só uma barrinha fina, não o retângulo proporcional que o nome da seção prometia. Descoberto porque o teste Playwright mediu a razão largura/altura real do elemento visível e bateu ~12.5 e ~0.03 em vez de 1.77/1/1.33. Corrigido com `h-full` nas 3 divs + comentário JSDoc no próprio `AspectRatio.tsx` avisando que `children` precisa de `h-full w-full` (ou `object-cover` pra mídia) pra realmente preencher a proporção — evita o mesmo erro em consumidores futuros
- Achado de passagem no registry: faltava `style` na tabela de props — corrigido + `registry:build`
- Gate 9: `e2e/cn/layout/aspect-ratio.spec.ts` novo (3 testes: crash/console/razão largura-altura real medida via `boundingBox()` nas 3 proporções) — 5/5 úteis chromium-desktop + mobile-chrome, 1 `test.skip` em mobile-chrome (pendência 0b — o squeeze da sidebar reduz a largura real do `Frame`, e como a proporção depende de largura real pra calcular a altura, o teste dava ratio=1.0 exato mesmo pro card 16:9)

### `layout/floating-bar` — concluído

Décimo oitavo standalone.

- Gate 1: faltava `floating-bar.types.ts` (tipos inline no `.tsx`) — extraído
- Gate 3/spacing: `gap-3`/`px-4`/`py-3`/`bottom-6`/`top-6`/`ml-1`/`translate-y-4` → tokens exatos
- Gate 4: botão de fechar (`<button>` cru 24×24 + ícone X) trocado por `<Button variant="ghost" intent="neutral" size="xs" iconOnly>` CN — tamanho `xs` do Button (`h-6 w-6`) bate exato com o que já estava ali, candidato legítimo pra reuso (diferente do botão circular bespoke do Fab, que não reusa por causa da forma/escala fora de escala)
- Gate 5: adicionado `role="status"` + `aria-live="polite"` + `aria-hidden={!visible}` no container — sem isso, o conteúdo que aparece/desaparece dinamicamente (toast-like) não era anunciado pra leitor de tela
- **Bug real de showcase encontrado e corrigido — mesmo padrão exato do achado no Fab**: o demo envolvia `<FloatingBar>` (que é `position:fixed`) num `<div className="relative ... overflow-hidden">` assumindo containment, mas sem `transform`/`contain`/`filter` no ancestral, `position:fixed` sempre usa o viewport como referência — a barra vazava pro canto real da tela em vez de ficar dentro do card do demo. Corrigido com `[contain:layout]` no wrapper (idêntico ao fix do Fab)
- Gate 8: demo só tinha 1 variação (visible toggle, sem `onDismiss` demoed, sem posição `top`) — enriquecida com `onDismiss` funcional na barra existente + nova seção "Position: top"
- Achado de passagem no registry: faltava `style` na tabela de props — corrigido + `registry:build`
- Gate 9: `e2e/cn/layout/floating-bar.spec.ts` novo (5 testes: crash/console/contida no card (não vaza)/dismiss esconde a barra/posição top toggle) — 8/8 úteis chromium-desktop + mobile-chrome, 2 `test.skip` em mobile-chrome (pendência 0b, sidebar intercepta clique)

### `display/keyboard-shortcuts` — concluído

Décimo nono standalone. Componente mais complexo do lote (modal com busca via portal).

- Gate 1: faltava `keyboard-shortcuts.types.ts` (tipos inline no `.tsx`) — extraído
- Gate 2: scrim `bg-[oklch(0%_0_0/0.6)]` normalizado pra `bg-black/60` + comentário, igual ao padrão já documentado no `Modal.tsx` (`bg-black` é exceção válida documentada pra scrim, não bug)
- Gate 3/spacing: sweep completo (`px-5`→sem token exato, mantido; `py-4`/`py-3`/`gap-4`/`gap-1`/`mb-2`/`space-y-2`/`px-1.5`/`mx-4`) → tokens exatos onde existe correspondência; `text-[0.65rem]` do `<kbd>` documentado como exceção válida (rótulo de tecla individual, below scale minimum)
- Gate 4: `<input type="search">` cru trocado por `<Input type="search" size="md">` CN
- **Achado grave de a11y, gate 5 — o componente é um modal (`fixed inset-0` + overlay + Escape-to-close) mas não tinha NENHUMA semântica de dialog**: sem `role="dialog"`, sem `aria-modal`, sem `aria-labelledby`, sem foco inicial ao abrir, sem focus trap (Tab escapava livremente pra página de trás) e sem lock de scroll do body. Corrigido replicando o mesmo padrão WAI-ARIA já usado no `Modal.tsx` (`useFocusTrap`, adaptado localmente já que `KeyboardShortcuts` é standalone, não uma variante do Super) — `role="dialog"` + `aria-modal` + `aria-labelledby` no painel, foco no campo de busca ao abrir (mais útil que focar o botão de fechar primeiro, que seria o comportamento padrão de "primeiro focusable"), `overflow:hidden` no body enquanto aberto, e Tab cicla dentro do dialog
- **Achado colateral**: `<Input>` CN não usa `React.forwardRef` — passar `ref` pra ele não funciona (React ignora silenciosamente). Precisou de um workaround via `querySelector('input[type="search"]')` em vez de ref direto pra focar o campo. Flagado como task separada (`task_66252e1d`), não corrigido aqui (mudaria a assinatura de um componente Tier-0 usado em ~30+ lugares — fora de escopo desta validação pontual)
- Gate 9: `e2e/cn/display/keyboard-shortcuts.spec.ts` novo (5 testes: crash/console/abre com role=dialog+aria-modal+foco no campo de busca/Escape fecha/busca filtra os atalhos/Tab no último focusable volta pro primeiro) — 10/10 úteis chromium-desktop + mobile-chrome (1 flake ambiental confirmado e re-verificado — CSP/timeout de carga concorrente, nada a ver com o componente)

### `layout/sortable-list` — concluído

Vigésimo standalone.

- Gate 1: faltava `sortable-list.types.ts` (tipos inline no `.tsx`) — extraído
- Gate 3/spacing: `gap-1`/`gap-3` → tokens exatos (`px-3 py-2.5` mantido, sem token exato pra `2.5`)
- **Achado grave de a11y, gate 5 — reordenação era possível SÓ por mouse**: `draggable` nativo (HTML5 Drag and Drop) sem NENHUMA alternativa de teclado — sem `aria-grabbed`/`aria-dropeffect`, sem manipulador de tecla nenhum no grip, sem live region anunciando mudanças. Um usuário de teclado simplesmente não conseguia reordenar a lista de jeito nenhum. Corrigido: grip virou um `<button>` real e focável com `aria-label` descritivo (`"Reordenar item N de M"`), `ArrowUp`/`ArrowDown`/`Home`/`End` movem o item (mesma função usada pelo drop do mouse), e um `<li role="status" aria-live="polite">` (`sr-only`) anuncia a nova posição a cada movimento. Foco é preservado automaticamente entre reordenações porque o `<li>` mantém `key={item.id}` — o React reusa a mesma instância de DOM/foco em vez de recriar
- Achado de passagem no registry: descrição afirmava "touch support" que **não existe** (só HTML5 drag-and-drop nativo, sem handlers de touch) — corrigido pra descrever o suporte real (teclado); faltava `style` na tabela de props — corrigido + `registry:build`
- Achado de passagem no showcase: `useState<import(".../SortableList").SortableItem[]>(...)` — import de tipo apontando pro arquivo `.tsx` antigo (que não exporta mais `SortableItem` diretamente após a extração do Gate 1) — corrigido pra importar do barrel `index.ts` do componente
- Gate 8: demo só tinha 1 variação (drag) — adicionada seção "Disabled" (sem grip nenhum, sem `draggable`)
- Gate 9: `e2e/cn/layout/sortable-list.spec.ts` novo (5 testes: crash/console/`ArrowDown` reordena/`End` move pro fim/live region anuncia posição/disabled sem grip nem draggable) — 12/12 chromium-desktop + mobile-chrome, sem nenhum skip (por não depender de drag real nem de largura do Frame, escapou da pendência 0b)

### `layout/vertical-nav` — concluído

Vigésimo primeiro standalone.

- Gate 1: faltava `vertical-nav.types.ts` (tipos inline no `.tsx`) — extraído
- Gate 2: cor ativa era um tint ad-hoc (`bg-patina/15 text-patina`, texto puro em vez de `-fg`) — trocado pro par canônico `bg-patina-soft text-patina-soft-fg`, mesma família de achado já visto em `ChipGroup`/`FeatureList`
- Gate 3: `text-base` cru no ícone → `text-body-paragraph` (16px, match exato); `text-[0.6rem]` do badge cru — resolvido pela troca de Gate 4 abaixo, deixou de existir
- Gate 3/spacing: `pr-3`→md, `py-2`→sm, `gap-0.5`/`space-y-0.5`(×2)/`mt-0.5`→3xs, `p-2`→sm; indent dinâmico por profundidade (`style={{paddingLeft: ...}}`) documentado como cálculo intencional (base 0.75rem = `--spacing-md`, incremento 1rem = `--spacing-lg` por nível), não valor arbitrário estático
- Gate 4 (**achado real de duplicação**): o badge de contagem/categoria era um `<span>` cru com cores e tamanho reinventados (`px-1.5 py-0.5 text-[0.6rem] bg-danger/bg-graphite-2`) quando `<Badge>` CN já existe e cobre exatamente esse caso — trocado por `<Badge size="sm" intent={typeof badge === "number" ? "danger" : "neutral"}>`
- Gate 5: ícone do item marcado `aria-hidden="true"` (decorativo, o label de texto já carrega a informação)
- Achado de passagem no registry: descrição de `items` não mencionava `href`/`disabled`/`children`; faltava `style` — corrigido + `registry:build`
- Gate 8: demo só tinha ícones simples + 1 badge string, sem `onSelect` real, sem badge numérico, sem item `disabled` — enriquecida com item `Inbox` (badge numérico 12), `Settings` disabled, e `onSelect` de verdade trocando `activeId` via `useState`
- Gate 9: `e2e/cn/layout/vertical-nav.spec.ts` novo (6 testes: crash/console/`aria-current`/`onSelect` troca item ativo/disabled não dispara/`aria-expanded` alterna/badges renderizam via `<Badge>`) — 14/14 chromium-desktop + mobile-chrome

### `display/ribbon` — concluído

Vigésimo segundo standalone. Componente pequeno e bem construído — sem bugs reais, só housekeeping.

- Gate 1: faltava `ribbon.types.ts` (tipos inline no `.tsx`) — extraído
- Gate 2/5: nada a corrigir — tokens corretos, pares de contraste pré-validados, `pointer-events-none` no overlay decorativo já presente. Removido um `aria-label` redundante no `<span>` da faixa (texto visível já é idêntico ao nome acessível computado, sem ganho real)
- Gate 3: `text-[0.6rem]` documentado como exceção válida (rótulo curto decorativo); `top-[14px]`/`w-[90px]`/`py-[3px]`/`±22px` documentados com comentário explicando que são constantes geométricas da técnica de faixa diagonal a 45° — não espaçamento genérico, sem token da escala aplicável
- Achado de passagem no registry: `intent` só listava 5 dos 6 valores (faltava `secondary`); faltava `style` — corrigido + `registry:build`
- Gate 9: `e2e/cn/display/ribbon.spec.ts` novo (4 testes: crash/console/6 intents legíveis/2 posições coexistindo) — 8/8 chromium-desktop + mobile-chrome. Achado de metodologia (não do componente): o card de fundo do demo repete o mesmo texto do label — `getByText(label)` batia em 2 elementos, resolvido com `.last()`

### `display/note-card` — concluído

Vigésimo terceiro standalone.

- Gate 1: faltava `note-card.types.ts` (tipos inline no `.tsx`) — extraído
- Gate 2: as 6 cores de "papel de nota adesiva" (hex fixo) e o glare branco do pino (`bg-white/60`) são exceções válidas documentadas — cores de papel físico deliberadamente independentes do tema (mesmo raciocínio do terminal escuro do `CnInstallBlock`), glare de luz também já é categoria de exceção explícita no CLAUDE.md. Nenhuma mudança de código, só comentários explicando a exceção
- Gate 3: `text-sm` cru → `text-body-callout`; `text-[0.65rem]` do rodapé autor/data documentado como exceção válida (metadado secundário)
- Gate 3/spacing: `p-4`→lg, `mt-1`→2xs, `mt-3`→md, `pt-2`→sm
- **Bug real encontrado e corrigido**: o conteúdo (`children`, arbitrário) era envolvido num `<p>` — como o uso típico do componente passa blocos (`<p>`, `<h*>`) como filhos, isso gera HTML inválido (`<p>` dentro de `<p>`), que o browser corrige sozinho quebrando a estrutura real do DOM (confirmado via warning `"... cannot be a descendant of ..."` no console, 2 ocorrências). Corrigido trocando o wrapper pra `<div>`
- Gate 5: pino decorativo (puramente visual) marcado `aria-hidden="true"`
- Achado de passagem no registry: `color` só listava 5 dos 6 valores (faltava `orange`); faltava `style` — corrigido + `registry:build`
- Gate 8: demo não exercitava `author`/`date` — adicionado exemplo na seção de rotação
- Gate 9: `e2e/cn/display/note-card.spec.ts` novo (5 testes: crash/console/6 cores/author+date no rodapé/rotação aplica `transform` real) — 10/10 chromium-desktop + mobile-chrome. Achados de metodologia corrigidos no caminho: `capitalize` é CSS (o texto real no DOM continua minúsculo, testes ajustados); locator de rotação precisou subir 2 níveis (`../..`) até o container raiz onde o `transform` é de fato aplicado

### `display/dot-stepper` — concluído

Vigésimo quarto standalone. Confirmado `absorbs` FALSO (varredura anterior: `Stepper`→`dot-stepper`/`progress-steps` confirmado falso, `dot-stepper` é implementação real independente).

- Gate 1: faltava `dot-stepper.types.ts` (tipos inline no `.tsx`) — extraído
- Gate 3/spacing: `gap-2`/`gap-1.5` → tokens exatos
- Gate 5: adicionado `role="group" aria-label="Pagination"` nas variantes `dot`/`dash` (conjunto de controles relacionados, cada botão já tinha `aria-label`/`aria-current` individual mas faltava o agrupamento); `role="status" aria-live="polite"` na fração da variante `progress` (`"2/5"`), que antes não era anunciada quando o passo mudava
- **Achado real no registry**: `variant` documentado como `'dot' | 'bar' | 'ring'` — **nenhum dos valores `bar`/`ring` existe**, os valores reais são `'dot' | 'dash' | 'progress'`. Corrigido; faltava `style` na tabela — `registry:build` rodado
- Gate 9: `e2e/cn/display/dot-stepper.spec.ts` novo (5 testes: crash/console/clique muda `aria-current`/progress bar tem `role=status` com fração/dash ativo tem `w-6`) — 10/10 chromium-desktop + mobile-chrome

### `display/receipt-card` — concluído

Vigésimo quinto standalone.

- Gate 1: faltava `receipt-card.types.ts` (tipos inline no `.tsx`) — extraído
- Gate 2 (**dois achados reais**):
  1. status usava tint ad-hoc (`bg-success/15 text-success border border-success/30` etc.) em vez do par soft canônico — trocado por `<Badge variant="soft" intent={...}>` CN (ver Gate 4)
  2. o gradiente serrilhado do rodapé usava `var(--background)` — **var legada do dashboard/shadcn, fora do sistema de tokens CN** — corrigido pra `var(--ks-lacquer-deep)`, o equivalente real de `bg-canvas` (confirmado no `kikitocn-tokens.css`: `--color-canvas: var(--ks-lacquer-deep)`)
- Gate 3: `text-xl` cru → `text-body-title` (match exato 20px); `text-[0.7rem]` do badge de status deixou de existir (Gate 4)
- Gate 3/spacing: `px-6`→xl, `py-4`→lg, `mt-0.5`→3xs, `mt-2`→sm, `py-3`→md, `space-y-2`→sm, `space-y-1.5`→xs
- Gate 4 (**achado real de duplicação**): badge de status reinventava do zero exatamente o que `<Badge variant="soft">` CN já cobre — trocado por `<Badge variant="soft" intent={paid→success, pending→warning, cancelled→danger} size="sm" className="uppercase">`
- Gate 5: faixa serrilhada (puramente decorativa) marcada `aria-hidden="true"`
- Achado de passagem no registry: descrição de `items` citava um shape `{ label, quantity?, price }` que **não existe** (real é `{ label, value, highlight? }`); default de `currency` documentado como `'R$'` quando o real é `'$'`; faltava `style` — corrigido + `registry:build`
- Gate 8: demo só tinha 1 variação sem `status`/`discount`/`highlight` — enriquecida (status "paid" + discount + item highlighted no card principal, nova seção "Status" com pending/cancelled)
- Gate 9: `e2e/cn/display/receipt-card.spec.ts` novo (4 testes: crash/console/itens+desconto+imposto formatados/3 status via `<Badge>`) — 8/8 chromium-desktop + mobile-chrome. Locators de "Discount"/"Tax" precisaram de `.first()` (rótulos comuns, colidiam com outros cards na mesma página do showcase)

### `display/chat-bubble` — concluído

Vigésimo sexto standalone.

- Gate 1: faltava `chat-bubble.types.ts` (tipos inline no `.tsx`) — extraído
- Gate 3: `text-[0.65rem]`/`text-[0.6rem]` documentados como exceções válidas (nome do remetente e metadado horário/status, ambos secundários)
- Gate 3/spacing: `gap-2`→sm, `gap-0.5`→3xs, `px-3 py-2`→md/sm, `gap-1`→2xs, `px-1`→2xs
- Gate 4 (**achado real de duplicação**): o avatar circular (imagem + fallback de iniciais) reinventava do zero exatamente o que `<Avatar>` CN já cobre — trocado por `<Avatar src={} name={} alt={} size="xs">`. Conferido que `Avatar.initials()` produz o mesmo resultado pra fallbacks já abreviados de 1-2 letras (`"AL".slice(0,2).toUpperCase()` = `"AL"`), então o comportamento visual não muda pro caso comum, e corrige de quebra um risco de overflow se o consumidor passasse um nome completo como fallback (`Avatar` abrevia automaticamente, o `<div>` cru antigo não)
- Gate 5 (**dois gaps reais de a11y corrigidos**): indicador de "digitando" (3 pontinhos animados) não tinha NENHUMA indicação pra leitor de tela — adicionado `role="status" aria-label="Typing"` no container e `aria-hidden` nos pontos decorativos; ícone de status de entrega (`✓`/`✓✓`/`⚠`) só tinha o glifo visual — um leitor de tela liria o caractere unicode cru, sem sentido — adicionado `aria-label` descritivo (`"Sent"`/`"Delivered"`/`"Read"`/`"Failed to send"`)
- Achado de passagem no registry: `status` só listava 3 dos 4 valores (faltava `error`); faltava `style` — corrigido + `registry:build`
- Gate 8: demo não exercitava `avatar`/`avatarFallback` — adicionado na seção "Bubbles"
- Gate 9: `e2e/cn/display/chat-bubble.spec.ts` novo (5 testes: crash/console/avatar com iniciais via `<Avatar>`/indicador de digitação com `role=status`/ícones de status com `aria-label`) — 10/10 chromium-desktop + mobile-chrome

### `display/timeline-progress` — concluído

Vigésimo sétimo standalone. Confirmado `absorbs` VERDADEIRO (`TimelineProgress.tsx` é wrapper fino real, `<Timeline variant="progress" {...props} />`, zero lógica própria; `Timeline` já foi validado em sessão anterior).

- Gate 1: faltava `timeline-progress.types.ts` — os tipos eram re-exportados direto no `.tsx` do wrapper (`export type {...} from "../timeline/timeline.types"` dentro do próprio `TimelineProgress.tsx`) — extraído pro arquivo de tipos dedicado, mesmo padrão já usado em `ChipGroup`/`Calendar`
- Gates 2/3/4/5/6: herdados do `Timeline` (já validado) por delegação total — nada pra corrigir no wrapper em si
- **Achado real no registry**: descrição de `steps` citava um shape `{ label, description?, status, date? }` — **`id` (obrigatório) estava faltando e `date?` não existe**; o shape real é `{ id, label, description?, status, icon? }`. Corrigido, incluindo os 4 valores do union de `status`; faltava `style` — `registry:build` rodado
- Gate 9: `e2e/cn/display/timeline-progress.spec.ts` novo (3 testes: crash/console/4 estados de passo — completed/current/upcoming/error — renderizam) — 6/6 chromium-desktop + mobile-chrome. Locator de "Account created" precisou de `.first()` (aparece nas duas seções do demo)

### `display/password-strength` — concluído

Vigésimo oitavo standalone.

- Gate 1: faltava `password-strength.types.ts` (tipos inline no `.tsx`) — extraído
- Gate 3/spacing: `gap-2`→sm, `gap-1.5`(×2)→xs, `gap-1`→2xs, `ml-1`→2xs
- **Achado grave de a11y, gate 5 — o medidor de força era totalmente mudo pra leitor de tela**: as barras de força mudavam visualmente a cada tecla digitada mas nenhuma semântica ARIA existia pra comunicar isso (o foco fica no campo de senha, não no medidor — sem `aria-live` não há como saber que algo mudou). Corrigido: container das barras virou `role="progressbar"` com `aria-valuemin/max/now` + `aria-valuetext` (ex.: `"Strong"`) + `aria-live="polite"`, barras individuais e o rótulo textual marcados `aria-hidden` (o significado já está no `progressbar`). **Segundo gap, no checklist de regras**: cada `<li>` só comunicava o pass/fail via a forma do ícone (`CheckIcon`/`XIcon`, ambos `aria-hidden`) — um leitor de tela lia só o texto da regra (`"At least 8 characters"`) sem NENHUMA indicação se ela tinha sido cumprida. Corrigido com `aria-label={"${label}: met|not met"}` no `<li>`, texto visual movido pra um `<span aria-hidden>` interno pra não duplicar a leitura
- Achado de passagem no registry: faltava `style` — corrigido + `registry:build`
- Gate 9: `e2e/cn/display/password-strength.spec.ts` novo (4 testes: crash/console/`progressbar` muda `aria-valuenow`+`aria-valuetext` ao digitar/checklist expõe `met`/`not met`) — 8/8 chromium-desktop + mobile-chrome. Achado de metodologia: `getByLabel("Password")` bateu em 2 elementos (o `<label>` real do campo e algo mais na árvore de acessibilidade) — resolvido mirando `input[type="password"]` direto; texto do `<li>` do checklist também colidia consigo mesmo (`<li>` e o `<span aria-hidden>` filho combinam o mesmo texto) — resolvido mirando o `<li>` pelo `aria-label`

### `display/tag-cloud` — concluído

Vigésimo nono standalone.

- Gate 1: faltava `tag-cloud.types.ts` (tipos inline no `.tsx`) — extraído
- Gate 2: hover ad-hoc (`hover:bg-patina/10` etc.) trocado pro token soft canônico (`hover:bg-patina-soft` etc.), mesma família de achado recorrente nesta sessão
- Gate 3: `fontSize` inline calculado dinamicamente por peso documentado como exceção intencional — o próprio conceito de nuvem de tags exige interpolação contínua, não passos de escala discretos
- Gate 3/spacing: `gap-2`→sm, `px-1.5 py-0.5`→xs/3xs
- **Bug real corrigido**: quando um item tinha `href` **e** `onClick` ao mesmo tempo, o `onClick` era **silenciosamente ignorado** — a tag virava `<a>` (prioridade de `href` na escolha da tag) e a condição do spread de eventos excluía explicitamente qualquer item com `href` (`onClick && !item.href`). Corrigido pra disparar `onClick` em qualquer tag clicável, com ou sem `href`
- Achado de passagem no registry: descrição de `items` não mencionava `intent?`; defaults de `minSize`/`maxSize` documentados como `0.75`/`2.5` (como se fossem rem) quando os reais são `12`/`28` (px — o valor numérico é usado direto em `style={{fontSize}}`, e o React aplica "px" automaticamente pra essa propriedade) — corrigido; faltava `style` — `registry:build` rodado
- Gate 8: demo não exercitava `intent`/`onClick` — enriquecida com intents variados nos tags e uma seção "Clickable" nova
- Gate 9: `e2e/cn/display/tag-cloud.spec.ts` novo (4 testes: crash/console/tags com peso maior têm `font-size` computado real maior/`onClick` dispara mesmo sem `href`) — 8/8 chromium-desktop + mobile-chrome

### `display/metric-card` — concluído

Trigésimo standalone. Confirmado `absorbs` VERDADEIRO (`MetricCard.tsx` é wrapper fino real, `<Stat mode="metric" {...props} />`; `Stat` já validado em sessão anterior).

- Gate 1: faltava `metric-card.types.ts` — tipos re-exportados direto no `.tsx` do wrapper — extraído, mesmo padrão de `ChipGroup`/`TimelineProgress`
- Gates 2/3/4/5/6: herdados do `Stat` (já validado) por delegação total
- **Achado real no registry**: `trend` documentado como `'up' | 'down' | 'neutral'` — **`'neutral'` não existe**, o valor real é `'flat'` (confirmado no próprio demo, que já usa `trend="flat"` corretamente — só a doc estava errada); `intent` só listava 5 dos 6 valores (faltava `info`); faltava `style` — corrigido + `registry:build`
- Gate 9: `e2e/cn/display/metric-card.spec.ts` novo (4 testes: crash/console/3 variantes de trend com valores reais/loading state) — 8/8 chromium-desktop + mobile-chrome

### `display/stats-card` — concluído

Trigésimo primeiro standalone. Confirmado `absorbs` VERDADEIRO (`StatsCard.tsx` é wrapper fino real, `<Stat mode="grid" {...props} />`; `Stat` já validado em sessão anterior).

- Gate 1: faltava `stats-card.types.ts` — tipos re-exportados direto no `.tsx` do wrapper — extraído, mesmo padrão de `MetricCard`/`ChipGroup`/`TimelineProgress`
- Gates 2/3/4/5/6: herdados do `Stat` por delegação total
- **Achado real no registry**: descrição de `stats` citava um shape `{ label, value, description?, intent? }` — **campos completamente errados**, o shape real é `{ label, value, change?, trend?, icon? }`; faltava `style` — corrigido + `registry:build`
- Gate 9: `e2e/cn/display/stats-card.spec.ts` novo (3 testes: crash/console/2-3-4 colunas mostram todos os stats) — 5/5 úteis chromium-desktop + mobile-chrome, 1 `test.skip` em mobile-chrome (pendência 0b — confirmado visualmente via `resize_window` que o card de "2 columns" fica com ~0px de largura útil na sidebar espremida)

### `inputs/rating-input` — concluído

Trigésimo segundo standalone. Confirmado `absorbs` VERDADEIRO (`RatingInput.tsx` é wrapper fino real, `<Rating toggleOff icon={icon} emptyIcon={emptyIcon} {...props} />`; `Rating` já validado em sessão anterior).

- Gate 1: props inteiramente inline no `.tsx` do wrapper (nem re-export existia) — extraído pra `rating-input.types.ts`, mesmo padrão de `MetricCard`/`StatsCard`/`ChipGroup`/`TimelineProgress`
- Gates 2/3/4/5/6: herdados do `Rating` por delegação total
- **Achado real no registry**: props `icon`/`emptyIcon` (ambas reais, usadas no próprio demo com heart emoji) estavam **completamente ausentes** da tabela de props; faltava `style` — corrigido + `registry:build`
- Gate 9: `e2e/cn/inputs/rating-input.spec.ts` novo (6 testes: crash/console/controlado com clique real/read-only via `role=img`/ícone customizado/disabled) — 12/12 chromium-desktop + mobile-chrome. `firefox-desktop` falhou nos 6 (`browserType.launch: Executable doesn't exist ...firefox-1532...`) — gap de ambiente pré-existente (binário do Firefox não instalado), não é bug do componente; não contabilizado no resultado

### `inputs/combobox` — concluído

Trigésimo terceiro standalone. Confirmado `absorbs` VERDADEIRO (`Combobox.tsx` é wrapper fino real, `<Select mode="combobox" {...props} />`; `Select` já validado em sessão anterior, incluindo o próprio modo combobox — a11y de listbox/aria-controls/etc. já corrigida lá).

- Gate 1 (**bug real**): `Combobox.tsx` importava `ComboboxProps`/`ComboboxOption` de `Select.tsx` (o `.tsx` do Super, não o `.types.ts`) — funciona porque `Select.tsx` re-exporta, mas viola a regra de "tipos sempre em `.types.ts`" e cria uma segunda fonte da verdade. Criado `combobox.types.ts` importando direto de `select/select.types.ts`; `Combobox.tsx`/`index.ts` atualizados
- Gates 2/3/4/5/6: herdados do `Select` por delegação total
- **Achado real no registry**: prop `className` (real, usada no próprio demo) estava ausente da tabela de props — corrigido + `registry:build`
- Gate 9: `e2e/cn/inputs/combobox.spec.ts` novo (4 testes: crash/console/multi-select adiciona e remove chip/`maxSelected=1` bloqueia segunda seleção via `aria-selected`) — 8/8 chromium-desktop + mobile-chrome

### `inputs/multi-select` + `inputs/rich-select` — concluído

Trigésimo quarto e trigésimo quinto standalone. Confirmado `absorbs` VERDADEIRO nos dois (`<Select mode="multi" />` / `<Select mode="rich" />`, mesma família de `combobox`).

- Gate 1 (**mesmo bug do `combobox`, replicado nos outros dois modos**): `MultiSelect.tsx`/`RichSelect.tsx` importavam `MultiSelectProps`/`RichSelectProps` de `Select.tsx` (o `.tsx` do Super) em vez do `.types.ts` — e pior, cada um já tinha um `multi-select.types.ts`/`rich-select.types.ts` **próprio e correto, mas morto** (não importado por ninguém, existia só pros tipos de `Option`/`Size`). Corrigido: os dois `.types.ts` agora reexportam de `select/select.types.ts` (mesmo padrão do `combobox.types.ts`); `.tsx`/`index.ts` atualizados
- **Achado real de Gate 2 no `Select.tsx` (Super, não no wrapper)**: 4 ocorrências do padrão "soft" incorreto, encontradas ao ler o código exato renderizado pelos 3 wrappers desta família — chip do `MultiSelectImpl` usava `bg-patina/15 text-patina` (opacidade ad-hoc, deveria ser o token soft); badge do `RichSelectImpl` e chip + opção-selecionada do `ComboboxImpl` usavam `bg-patina-soft text-patina` (par errado — o par pré-validado é `text-patina-soft-fg`, não `text-patina`). Corrigidas as 4 ocorrências pro par canônico `bg-patina-soft`/`text-patina-soft-fg`
- Gates 3/4/5/6 (resto): herdados do `Select` por delegação total
- **Achado no registry**: `className`/`style` (reais nos dois) ausentes das tabelas de props — corrigido + `registry:build`
- Gate 8: os dois demos tinham só 1 variação — `MultiSelectDemo` ganhou uma segunda (`maxSelected`), `RichSelectDemo` ganhou uma segunda (badge + opção desabilitada)
- Gate 9: `e2e/cn/inputs/multi-select.spec.ts` e `e2e/cn/inputs/rich-select.spec.ts` novos (4 testes cada) + regressão de `select.spec.ts`/`combobox.spec.ts` (afetados pelo fix de cor no `Select.tsx`) — 27/30 úteis chromium-desktop + mobile-chrome, 3 `test.skip` em mobile-chrome (pendência 0b, confirmado visualmente de novo via `resize_window` em `multi-select` e `rich-select` — texto/chips cortados e dropdown instável/fora do viewport na sidebar espremida)

### `overlays/context-menu` + `overlays/floating-menu` + `overlays/popover` + `display/hover-card` — concluído

Trigésimo sexto ao trigésimo nono standalone. Todos confirmados `absorbs` VERDADEIRO (`DropdownMenu`/`Tooltip` Super components), fechando a varredura dos wrappers "absorvidos-mas-com-página-própria" que ainda não tinham recebido o tratamento completo (mesma categoria de achado do `combobox`/`multi-select`/`rich-select` acima).

- Gate 1 (**mesmo bug recorrente da família `select`**): `ContextMenu.tsx` e `FloatingMenu.tsx` importavam o tipo `MenuEntry` de `DropdownMenu.tsx` (o `.tsx` do Super) em vez de `dropdown-menu.types.ts` — corrigido nos dois. `Popover.tsx` e `HoverCard.tsx` eram piores: **não tinham `.types.ts` nenhum**, com a prop interface inteira inline no `.tsx` e o tipo de enum (`PopoverPlacement`/`HoverCardSide`/`HoverCardAlign`) importado de `Tooltip.tsx` — criados `popover.types.ts` e `hover-card.types.ts`, shape preservado 1:1 (sem usar `Omit<TooltipXProps>` pra não arriscar mudar a optionalidade de `content`), só a fonte do enum corrigida pra `tooltip.types.ts`. `command-bar`/`spotlight-search`/`rich-tooltip` foram checados de passagem — já estavam corretos, nenhuma mudança
- **Achado real de Gate 2, grave, no `DropdownMenu.tsx` (Super)**: a implementação `HoverMenu` (é o que `FloatingMenu` realmente renderiza) tem seu próprio render de item **duplicado e não sincronizado** com o `renderMenuItem` compartilhado usado pelo `ClickMenu` padrão — o item de perigo do `HoverMenu` não tinha bg nenhum no hover (só `hover:text-danger`, redundante com o `text-danger` já sempre ativo), e o `renderMenuItem` compartilhado usava `hover:bg-danger/10` (opacidade ad-hoc). Mais 2 ocorrências do padrão "soft errado" já visto na família `select`: `hover:bg-patina-soft hover:text-patina` (par errado, faltava `-soft-fg`) nas 2 renderizações internas do `ContextMenuImpl`. Total: **5 ocorrências corrigidas** no arquivo, todas pro par canônico `bg-*-soft`/`text-*-soft-fg`
- **Achado real de Gate 5, grave, no `HoverMenu`**: o painel do menu (o que `FloatingMenu` abre) não tinha `role="menu"` nem os itens `role="menuitem"` — únicos entre as 3 implementações internas do Super sem essa semântica (`ClickMenu` e `ContextMenuImpl` já tinham). O trigger (uma `<div onClick>` ao redor do elemento passado) também não tinha `aria-haspopup`/`aria-expanded`/`aria-controls`. Adicionado tudo via `useId()`, aditivo, sem mudar o fluxo de clique/hover existente
- Gates 3/4/6 (resto): herdados do `DropdownMenu`/`Tooltip`
- **Achado no registry**: `context-menu` sem `className`/`style` (reais); `floating-menu` com a descrição de `items` incompleta (faltavam `id` — obrigatório — `intent`, `disabled`), `placement` documentado com só 4 de 8 valores reais, e `style` ausente; `hover-card` sem `style`. Corrigido tudo + `registry:build`
- Gate 8: os 4 já tinham demo com 2+ variações — nenhuma mudança
- Gate 9: `e2e/cn/overlays/{context-menu,floating-menu,hover-card,popover}.spec.ts` novos (3-4 testes cada) + regressão de `dropdown-menu.spec.ts` (afetado pelos fixes de cor/a11y no Super) — 36/36 chromium-desktop + mobile-chrome (1 engano de URL corrigido no meio do caminho: `hover-card` é grupo `display`, não `overlays`, apesar do arquivo de teste morar em `e2e/cn/overlays/` por afinidade temática com a família Tooltip)

### `inputs/segmented-control` + `inputs/filter-bar` — concluído

Quadragésimo e quadragésimo primeiro standalone. Confirmados `absorbs` VERDADEIRO (`ToggleGroup` Super, mesma família de `chip-group` já validado).

- Gate 1 (**mesmo bug recorrente**): `SegmentedControl.tsx` sem `.types.ts` nenhum (tipos inline, importava enum de `ToggleGroup.tsx`) — criado `segmented-control.types.ts`. `FilterBar.tsx` já tinha `.types.ts` próprio correto, mas ainda importava `ToggleGroupFilterProps` de `ToggleGroup.tsx` só pro cast interno — corrigido pra `toggle-group.types.ts`
- **Achado real de Gate 2, grave, no `ToggleGroup.tsx` (Super, `FilterToggleGroup`)**: recriava manualmente o padrão "soft" com `bg-[color-mix(in_srgb,var(--ks-primary)_N%,transparent)]` em 3 lugares (hover 8%, chip ativo 15%, badge de contagem ativo 25%) em vez dos tokens que já existem — corrigido pro par canônico `bg-patina-soft`/`text-patina-soft-fg` no hover e no chip ativo; o badge de contagem (aninhado sobre um pai já com `bg-patina-soft`) foi pra `bg-patina`/`text-patina-fg` com comentário de exceção documentada (precisa de mais contraste que o soft pra não se misturar no fundo do pai)
- Gates 3/4/5/6 (resto): herdados do `ToggleGroup`
- **Achado no registry**: `segmented-control` e `filter-bar` sem `className`/`style` (reais); **`filter-bar.multiSelect` documentado com default `false` — o real é `true`** (confirmado no código: `FilterToggleGroup({ multiSelect = true, ... })`), mesma classe de bug do default errado de `trend` no `metric-card`
- Gate 8: os 2 já tinham demo com 2-3 variações — nenhuma mudança
- Gate 9: `e2e/cn/inputs/{segmented-control,filter-bar}.spec.ts` novos (3-4 testes cada) + regressão de `toggle-group.spec.ts`/`chip-group.spec.ts` (afetados pelo fix de cor no Super) — 32/32 chromium-desktop + mobile-chrome

### `inputs/radio` — concluído

Quadragésimo segundo standalone. Componente atômico real (não wrapper/absorção) — primeira validação completa.

- Gate 1: `Radio.tsx` não tinha `.types.ts` nenhum (`RadioProps`/`RadioGroupOption`/`RadioGroupProps`/`RadioSize` todos inline) — extraído pra `radio.types.ts`; arquivo também não seguia o padrão de formatação do projeto (aspas simples, alinhamento manual de `:` em interfaces) — normalizado de passagem
- Gate 2: cores 100% em tokens (`bg-patina`, `border-rule`, `bg-raised`, `text-foreground`, `text-faint`) — nenhuma violação
- Gate 3: sweep de spacing estrutural (`gap-2`/`gap-3`/`gap-4`/`mb-2`/`mt-2` → tokens exatos); `text-[0.6875rem]` (helper do tier `sm`) já não tinha comentário de exceção — adicionado; `mt-[0.1em]`/`gap-[0.1rem]` (ajuste óptico fino, não é spacing genérico) documentados como fora de escala
- Gate 4: não aplicável — é o próprio átomo, nada pra reusar
- Gate 5 (**gap real de a11y corrigido**): `helperText` do `Radio` individual não tinha `aria-describedby` ligando o `<input>` ao texto de apoio — leitor de tela não anunciava a descrição ao focar a opção. Adicionado `id` + `aria-describedby`. Mesmo tratamento no `helperText` do `RadioGroup` (nível de grupo), associado ao `<fieldset>`. Semântica de grupo (`fieldset`/`legend`/`name` compartilhado) já estava correta antes
- Gate 6: nenhuma cor hardcoded pra modo específico — herda tema via tokens
- **Achado no registry**: `defaultChecked`/`className`/`style` (reais) ausentes da tabela de props — corrigido + `registry:build`
- Gate 8: demo já cobria RadioGroup vertical/horizontal + 3 tamanhos — nenhuma mudança
- Gate 9: `e2e/cn/inputs/radio.spec.ts` novo (6 testes: crash/console/troca de seleção controlada/`aria-describedby` do helper/navegação por seta no grupo nativo) — 10/10 chromium-desktop + mobile-chrome (1 fix de locator no meio do caminho: `getByLabel("Pro")` colidia com "...Up to 3 pro**ject**s", trocado por seletor de atributo `input[value="pro"]`)

### `inputs/switch` — concluído

Quadragésimo terceiro standalone. Componente atômico real (não wrapper/absorção).

- Gate 1: `Switch.tsx` sem `.types.ts` nenhum (`SwitchProps`/`SwitchSize`/`SwitchIntent`/`SwitchLabelPosition` inline) — extraído pra `switch.types.ts`
- **Gate 2, bug real e grave**: intent `secondary` usava `bg-secondary` — classe do vocabulário do dashboard legado (banida por nome no `CLAUDE.md`), não do CN. Apesar de hoje resolver pra cor certa por acidente (o `@theme inline` do projeto tem um alias `--color-secondary: var(--ks-secondary)` → `--ks-kinpaku`, então visualmente nunca quebrou), viola a regra de nunca misturar vocabulário entre os dois sistemas — corrigido pro token direto `bg-kinpaku`. Thumb usava `bg-white` hardcoded (mesmo achado já catalogado nesta sessão pro `Slider`/`PricingToggle`, mas o `Switch` em si nunca tinha sido corrigido) → `bg-canvas`, confirmado como o token exato já usado no thumb do `Slider`
- Gate 3: `gap-2.5` (sem match exato na escala) → `gap-(--spacing-md)` (match exato, 0.75rem); demais já estavam corretos
- Gate 5 (**gaps reais de a11y corrigidos**): `<input type="checkbox">` sem `role="switch"`/`aria-checked` — leitor de tela anunciava "checkbox marcado/desmarcado" em vez de "switch ligado/desligado" (padrão WAI-ARIA de switch); `description` sem `aria-describedby` ligando ao texto de apoio. Ambos corrigidos, aditivos, sem mudar comportamento
- Gate 6: nenhuma cor hardcoded pra modo específico (depois do fix do `bg-white`)
- **Achado no registry**: `className`/`style` (reais) ausentes da tabela de props — corrigido + `registry:build`
- Gate 8: demo já cobria controlado/6 intents/label position/3 tamanhos — nenhuma mudança
- Gate 9: `e2e/cn/inputs/switch.spec.ts` novo (5 testes: crash/console/`role=switch`+`aria-checked` ao clicar/`aria-describedby` da description/6 intents renderizam) — 10/10 chromium-desktop + mobile-chrome

### `layout/separator` — concluído

Quadragésimo quarto standalone. Componente atômico real, server component (sem `'use client'`, corretamente — não usa hooks/eventos).

- Gate 1: sem `.types.ts` (4 tipos + a interface, todos inline) — extraído pra `separator.types.ts`
- Gate 2: 100% tokens (`border-rule`, `text-faint`) — nenhuma violação
- Gate 3 (**spacing estrutural migrado**): `spacing` mapeava direto pra `my-N`/`mx-N` numérico do Tailwind (`my-1`/`my-2`/`my-4`/`my-6`/`my-8` e equivalentes `mx-*`) — todos com match exato na escala (`1→2xs, 2→sm, 4→lg, 6→xl, 8→2xl`), migrados pros tokens `--spacing-*`; `gap-3` (label) → `gap-(--spacing-md)`
- Achado de limpeza (não é bug funcional): a variável `alignCls` (`justify-start/end/center`) era computada mas nunca usada no className — o alinhamento do label já é resolvido só pelos dois `<span>` `flex-1` condicionais (o lado omitido empurra o label pra ponta oposta; `justify-content` não afeta itens `flex-1`, que absorvem todo espaço livre de qualquer forma). Removida a variável morta, comportamento idêntico, comentário explicando o porquê
- Gate 4/5/6: nada a corrigir — `role="none"`/`role="separator"` + `aria-orientation` já corretos, cores herdam tema via tokens
- **Achado real no registry, dois defaults invertidos**: `spacing` documentado com default `'md'` — real é `undefined` (sem margem se omitido); `decorative` documentado com default `false` — **o real é `true`** (inverso do documentado — por padrão o separador já nasce fora da árvore de acessibilidade). Descrição também dizia "aria-hidden" quando o mecanismo real é `role="none"`. `className`/`style` (reais) também ausentes. Tudo corrigido + `registry:build`
- Gate 8: demo já cobria 3 variantes de linha + label (incluindo `labelAlign="start"`) + vertical — nenhuma mudança
- Gate 9: `e2e/cn/layout/separator.spec.ts` novo (5 testes: crash/console/`role="none"` por padrão/label visível/`aria-orientation` vertical) — 10/10 chromium-desktop + mobile-chrome

### `inputs/label` — concluído (fecha o Tier-0 completo: button/badge/input/select/label)

Quadragésimo quinto standalone. Componente atômico real, já tinha `.types.ts` correto (único achado de Gate 1 do lote atual a não precisar de extração) — servia de baseline de comparação.

- Gate 1: `.types.ts` já existia e estava correto; removido um `import React from 'react'` morto no `.tsx` (nunca usado — JSX automático não precisa, e `React.LabelHTMLAttributes` é usado só no `.types.ts`)
- Gate 2: 100% tokens (`text-foreground`, `text-danger`, `text-muted`) — nenhuma violação
- Gate 3 (**spacing estrutural migrado**): `gap-0.5`/`gap-1` (ambos com match exato: `0.5→3xs`, `1→2xs`) → tokens
- Gate 4/5/6: nada a corrigir — asterisco de obrigatório já `aria-hidden`, sem cor hardcoded
- **Achado real no registry**: `hint` documentado como "texto de apoio inline após o label" — **é renderizado como `<p>` separado abaixo**, não inline; descrição corrigida. `className` (real) ausente da tabela — corrigido + `registry:build`
- Gate 8: demo já cobria default/required/optional/2 tamanhos/hint/disabled num único Frame — cobertura suficiente, nenhuma mudança
- Gate 9: `e2e/cn/inputs/label.spec.ts` novo (4 testes: crash/console/asterisco+marcador opcional/hint abaixo do label) — 7/7 úteis chromium-desktop + mobile-chrome, 1 `test.skip` em mobile-chrome (pendência 0b, confirmado visualmente de novo via `resize_window`)

### `inputs/textarea` — concluído

Quadragésimo sexto standalone. Componente atômico real, `forwardRef`.

- Gate 1: `Textarea.tsx` sem `.types.ts` (4 tipos + interface, inline) — extraído pra `textarea.types.ts`
- **Gate 1/ref, bug real latente**: mesma classe do bug do `Input` fechado antes nesta sessão — `const taRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? innerRef` fazia cast cego do `ref` recebido via `forwardRef`; se um consumidor passasse **ref-callback** (`ref={(el) => ...}`) em vez de um objeto `useRef()`, o cast quebraria silenciosamente e `adjustHeight()` acessaria `.current` numa função. Nenhum consumidor atual passa `ref` (confirmado por grep), então não havia sintoma visível ainda — corrigido com o mesmo helper `mergeRefs` já usado no fix do `Input`, latente fechado antes de virar bug real
- **Gate 1, bug real e grave, achado pelos próprios testes**: `showCount` **nunca atualizava o contador em uso não-controlado** (sem `value`) — `charCount` só lia `value`/`defaultValue` das props, nunca o valor real do DOM after digitação, então ficava travado em `0` pra sempre em qualquer uso sem controle explícito (exatamente o padrão do demo "Features" do showcase). Corrigido com estado interno (`uncontrolledLength`) atualizado a cada `onChange`, usado como fallback quando não há `value` controlado
- **Gate 2**: `border-danger/60`/`border-success/60`/`border-warning/60` (opacidade ad-hoc) — inconsistente com o padrão já estabelecido no `Input` (`border-danger` sem opacidade) — corrigido pra bater com o `Input`. `hover:border-foreground/40` mantido — confirmado ser o mesmo idioma já usado no `Input` pro mesmo propósito, não é violação isolada
- Gate 3: `gap-[0.375rem]` (match exato com `--spacing-xs`) e `gap-2` (match exato com `--spacing-sm`) → tokens
- Gate 5 (**gap real de a11y corrigido**): `helperText`/`errorText`/`successText`/`warningText` (o texto de feedback efetivo) não tinha `aria-describedby` ligando ao `<textarea>`; estado `error` não tinha `aria-invalid`. Ambos corrigidos
- Gate 6: nada a corrigir — tokens herdam tema
- **Achado no registry**: `successText`/`warningText` (reais, usados na derivação de `effectiveState`) e `className` ausentes da tabela de props — corrigido + `registry:build`
- Gate 8: demo já cobria 3 variantes + estados error/success + auto-resize/count — nenhuma mudança
- Gate 9: `e2e/cn/inputs/textarea.spec.ts` novo (5 testes: crash/console/valor controlado/`aria-invalid`+`aria-describedby` do erro/contador atualiza em uso não-controlado — este último pegou o bug do `showCount` na primeira tentativa) — 10/10 chromium-desktop + mobile-chrome

### `feedback/spinner` — concluído

Quadragésimo sétimo standalone. Componente atômico real, já tinha `.types.ts` correto.

- Gate 1: `.types.ts` já correto; normalizado o `.tsx` pro padrão de formatação do projeto (aspas duplas, `Record<T, string>` tipado explicitamente em vez de objeto inferido)
- **Gate 2, bug real de semântica de cor**: intent `secondary` usava `border-foreground/15 border-t-foreground/60` — **a mesma paleta neutra/cinza do intent `neutral`** (`border-faint/20 border-t-faint`), tornando os dois visualmente quase idênticos e ignorando por completo a cor de marca secundária (kinpaku) que o nome do intent promete. Corrigido pra `border-kinpaku/25 border-t-kinpaku`, espelhando exatamente o padrão do `primary` (`border-patina/25 border-t-patina`) só trocando a família de cor — mesmo critério já usado pro fix do `Switch` (`bg-secondary` → `bg-kinpaku`) nesta sessão. Opacidade no border em si (não um token `bg-X-soft`) documentada como exceção válida — não existe `border-*-soft` na paleta (os pares soft são bg/text), e a trilha esmaecida atrás do arco ativo de um spinner é um caso legítimo sem equivalente semântico
- Gate 3: `gap-2` (match exato) → `gap-(--spacing-sm)`
- Gate 4/5/6: nada a corrigir — `role="status"` + `aria-label` já corretos, cores herdam tema
- **Achado no registry**: descrição dizia "SVG spinning loader" — a implementação real é CSS puro (`border` + `animate-spin`), sem nenhum SVG — corrigido; `className`/`style` (reais) ausentes da tabela — corrigido + `registry:build`
- Gate 8: demo já cobria 5 tamanhos + 3 intents (`primary`/`secondary`/`neutral`, faltando só `current` — gap leve, não bloqueante) — nenhuma mudança
- Gate 9: `e2e/cn/feedback/spinner.spec.ts` novo (4 testes: crash/console/`role=status`+`aria-label` nas 5 sizes/cor computada de `secondary` diferente de `neutral` — este último confirma o fix de cor de verdade, não só estruturalmente) — 8/8 chromium-desktop + mobile-chrome

### `feedback/skeleton` — concluído

Quadragésimo oitavo standalone. Componente atômico real, server component (sem `'use client'`, correto).

- Gate 1: sem `.types.ts` (`SkeletonShape`/`SkeletonProps` inline) — extraído pra `skeleton.types.ts`
- Gate 2/3/4/5/6: nada a corrigir — `bg-graphite` canônico, `rounded-none`/`rounded-(--radius-sm)`/`rounded-full` corretos (sem o bug do `rounded` bare), `aria-hidden="true"` já presente (placeholder puramente visual — correto deixar fora da árvore, quem precisa de `aria-busy`/`role="status"` é o componente pai que troca conteúdo real por skeleton, já resolvido em `Stat`/`Table` em sessões anteriores)
- **Achado no registry**: `className`/`style` (reais) ausentes da tabela de props — corrigido + `registry:build`
- Gate 8: demo já cobria 4 shapes + composição realista (profile card) — nenhuma mudança
- Gate 9: `e2e/cn/feedback/skeleton.spec.ts` novo (4 testes: crash/console/`aria-hidden` em todas as instâncias/`rounded-full` via computed style) — 8/8 chromium-desktop + mobile-chrome (1 fix de teste no meio do caminho: `rounded-full` do Tailwind resolve pra `calc(infinity * 1px)`, o computed value vira um número gigante tipo `3.35544e+07px`, não o literal `"9999px"` que eu tinha assumido — trocado por `parseFloat(...) > 1000`)

### `feedback/toast` — concluído

Quadragésimo nono standalone. Componente atômico real, context provider + portal.

- Gate 1: `ToastProviderProps` estava definida inline no `.tsx` (as outras 4 já vinham de `toast.types.ts` corretamente) — movida pra lá. **Achado extra**: o tipo nem era reexportado no `index.ts` (só existia se importado direto de `.../toast/Toast`) — corrigido junto
- **Gate 2, bug real e grave (var quebrada)**: intent `neutral` usava `text: "var(--ks-foreground)"` — **essa CSS var nunca existiu em `kikitocn-tokens.css`** (confirmado por grep: zero ocorrências no arquivo de tokens, só nesse um lugar) — mesma classe do achado catalogado em `CLAUDE.md` (`shadow-[var(--ks-shadow-md)]` inexistente). Corrigido pro token real, `var(--ks-text)`
- **Gate 2, bug real e grave de contraste**: no variant `solid`, o ícone e o botão de ação usavam `rgba(255,255,255,0.9)` fixo em vez de `colors.text` (o `-fg` correto por intent) — **`--warning-foreground` é quase preto** (`hsl(41, 100%, 5.5%)` num dos temas) porque o fundo sólido de warning é amarelo claro; forçar branco ali deixaria ícone e botão de ação praticamente ilegíveis sobre fundo amarelo. Corrigido nos 3 lugares (ícone, botão de ação, barra de progresso decorativa) pra usar `colors.text`
- **Achado de limpeza (dead code)**: a barra de destaque lateral do variant `soft` tinha DUAS implementações simultâneas — um `<span>` com estilo inline (a que realmente aparece) e um pseudo-elemento `before:` inteiro (classes + `--tw-before-bg` no `style`) que nunca tinha `before:bg-*` nenhum consumindo a variável — 100% morto, nunca renderizava nada. Removido o pseudo-elemento morto por completo
- Gate 3: sweep de spacing estrutural (`gap-2`/`p-4`/`gap-0.5`/`mt-1.5`/`p-0.5`/`top-2`/`bottom-2` — todos com match exato) → tokens; `gap-2.5`/`pl-5` documentados (sem match exato)
- Gate 5 (**gap leve corrigido**): barra de progresso decorativa (contagem regressiva) sem `aria-hidden` — adicionado
- Gate 6: nada a corrigir depois do fix de cor
- Gate 8: demo já cobria os 5 intents + solid (só `success`) — **adicionado um trigger "Solid warning"** com `action` pra exercitar visualmente o fix de contraste (o `success` sozinho não pegava o bug, porque `success-fg` já era claro por acidente)
- Gate 9: `e2e/cn/feedback/toast.spec.ts` novo (5 testes: crash/console/`role=status`+título/dismiss remove o toast/cor computada do botão de ação em `solid warning` não é branco fixo nem igual ao fundo) — 10/10 chromium-desktop + mobile-chrome

### `feedback/alert` — concluído

Quinquagésimo standalone. Componente atômico real, o mais denso de achados de cor desta sessão.

- Gate 1: sem `.types.ts` (`AlertIntent`/`AlertVariant`/`AlertSize`/`AlertProps` inline) — extraído pra `alert.types.ts`
- **Gate 2, bug real e grave, generalizado**: variant `solid` usava `text-white`/`text-black` **hardcoded** por intent (`info/success/danger: text-white`, `warning: text-black`) em vez dos tokens `-fg` corretos — mesmo achado exato do `Toast` fechado antes nesta sessão, aqui presente desde o início. **Além disso**, os variants `soft`/`outline`/`left-accent` recriavam manualmente o padrão soft com `bg-[color-mix(in_oklch,var(--ks-X)_N%,transparent)]` em **12 ocorrências** (3 variants × 4 intents coloridos) — o exato exemplo citado no próprio `CLAUDE.md` como violação de referência. Corrigido tudo: `solid` → `bg-X text-X-fg`; `soft`/`left-accent` → `bg-X-soft text-foreground` com `--alert-ic` apontando pro `-soft-fg` (par canônico pré-validado); `outline` manteve a opacidade no border (documentada como exceção — não existe `border-*-soft` na paleta). De passagem, intent `neutral` trocado de `bg-graphite` (token de superfície genérica) pra `bg-neutral-soft`/`bg-neutral` (tokens de intent dedicados que já existem pra esse propósito exato)
- Gate 3: `SIZE_CLS` (padding+ícone+font-size por tier) mantido como escala própria do componente, não migrado; `gap`/`mt`/`p`/margens negativas do botão de fechar e da área de `actions` (estrutural, fora do `SIZE_CLS`) migrados pros tokens de spacing, todos com match exato
- **Achado real de comportamento, achado pelo teste**: a demo "Dismissible" passava `dismissible` **sem `onDismiss`** — o `Alert` não tem estado próprio de visibilidade (correto por design, quem decide se esconde é o consumidor via callback), então clicar no × não fazia **absolutamente nada**, silenciosamente. Corrigido: demo agora tem estado local (`dismissed`) e um botão "Show alert again", demonstrando o padrão de uso real
- Gate 8: "Variants" só demonstrava `solid` no intent `info` (que por acaso já teria mascarado o bug do `text-white`, já que `info-fg` provavelmente é claro) — **adicionado "Solid warning"** pra exercitar visualmente o fix de contraste de verdade, mesmo raciocínio do `Toast`
- Gate 9: `e2e/cn/feedback/alert.spec.ts` novo (5 testes: crash/console/`role=alert` nos 5 intents/dismiss via `onDismiss` realmente remove o alert/cor computada de `solid warning` não é igual ao fundo) — 10/10 chromium-desktop + mobile-chrome (1 teste pegou o bug do dismiss não-funcional na primeira tentativa, corrigido na demo, não no teste)

### `feedback/notice-bar` — concluído

Quinquagésimo primeiro standalone. Componente atômico real.

- **Gate 8, achado grave, mesma classe das "34 páginas quebradas" de sessão anterior**: `NoticeBar` **não tinha demo nenhuma** — sem import, sem função `NoticeBarDemo`, sem entrada no mapa `DEMOS` — a rota `/cn/feedback/notice-bar` renderizava "não encontrada" apesar do componente estar 100% funcional. Criada a demo completa (intents + dismissible/action) e conectada
- Gate 1: sem `.types.ts` (`NoticeBarIntent`/`NoticeBarAction`/`NoticeBarProps` inline) — extraído pra `notice-bar.types.ts`
- **Gate 2, mesmo padrão da varredura de hoje**: `bg-info/10 border-info/30 text-info` etc (opacidade ad-hoc recriando o soft) — corrigido pro par canônico `bg-info-soft`/`text-info-soft-fg`; border manteve opacidade (exceção documentada, sem token `border-*-soft`). `text-[0.875rem]` do ícone padrão tinha **match exato** com `text-body-callout` (0.875rem) — trocado pela classe direta em vez do bracket arbitrário
- Gate 3: `gap-2.5`/`py-2.5` documentados (sem match exato); `px-4`/`ml-2`/`ml-1`/`p-0.5` (match exato) → tokens
- Gate 5/6: nada a corrigir — `role="status"` (carrega `aria-live="polite"` implícito), dismiss já tinha estado próprio funcional (diferente do `Alert`)
- **Achado real no registry**: `dismissible` documentado com default `'true'` — **o real é `false`**; `style` (real) ausente — corrigido + `registry:build`
- Gate 9: `e2e/cn/feedback/notice-bar.spec.ts` novo (5 testes: crash/console/`role=status` nos 5 intents/dismiss remove a barra/action dispara callback) — 10/10 chromium-desktop + mobile-chrome

### `display/callout` — concluído

Quinquagésimo segundo standalone. Componente atômico real; já tinha um sistema de cor mais sofisticado (CSS vars por instância via `INTENT_VARS`) que a maioria — quase não precisou de fix de cor, ao contrário dos últimos componentes desta varredura.

- Gate 1: `.types.ts`/`index.ts` já corretos (`CalloutProps` já vinha de lá), mas `index.ts` só reexportava `CalloutProps` — **`CalloutIntent`/`CalloutAppearance` nunca eram reexportados pelo barrel** — corrigido. Faltava `'use client'` no `.tsx` — inconsistente com o resto da biblioteca (`Alert`/`Toast`/`NoticeBar` etc têm, mesmo sem hooks, só por repassar `onClick` de prop) — adicionado
- Gate 2: já usava `bg-(--i-soft)` (correto) pro appearance soft, não caiu no padrão de opacidade ad-hoc dos outros componentes desta sessão. Único ponto exigindo documentação: o border do soft (`border-[color-mix(...,30%,...)]`) — mesma exceção válida já usada em `Alert`/`Spinner`/`NoticeBar` (sem token `border-*-soft`)
- Gate 3: `gap-3`/`py-4`/`gap-1` (match exato) → tokens; `px-[1.125rem]` documentado (sem match exato)
- **Achado no registry**: `className`/`style` (reais) ausentes da tabela — corrigido + `registry:build`
- Gate 8: demo cobria os 4 intents soft + outline + solid, mas **nunca exercitava `onClose`/`action`** (as duas props mais interativas do componente) — adicionado uma seção "Closable · with action" com estado local, mesmo padrão do `Alert`/`Toast`
- Gate 9: `e2e/cn/display/callout.spec.ts` novo (4 testes: crash/console/4 intents com título exato/`onClose` remove + `action` dispara) — 7/7 úteis chromium-desktop + mobile-chrome, 1 `test.skip` em mobile-chrome (pendência 0b, confirmado visualmente de novo). 2 fixes de locator no meio do caminho: `getByText("Info")` colidia com "This is a **info** callout..." (trocado por `exact: true`); 1 falha isolada por timeout de rede transiente no `chromium-desktop` (não relacionada ao código, sumiu no re-run)

### `display/checklist` — concluído

Quinquagésimo terceiro standalone. `.types.ts`/cores já corretos (sistema de CSS var por instância, `--ks-primary`/`--ks-primary-fg` são aliases válidos documentados no `CLAUDE.md`, não é o padrão de opacidade ad-hoc dos componentes anteriores).

- Gate 1: `index.ts` não reexportava `ChecklistIntent` (só `ChecklistProps`/`ChecklistItem`) — corrigido, mesmo achado do `Callout`
- Gate 2: nada a corrigir — vars corretas
- Gate 3: `gap-3`/`gap-1.5`/`gap-1`/`py-2` (match exato) → tokens; `px-[0.625rem]`/`gap-[0.625rem]` documentados (sem match exato)
- **Gate 5, gap real de a11y corrigido**: a barra de progresso (contagem "N de M concluídos") não tinha `role="progressbar"`/`aria-value*` nenhum — mesmo padrão já corrigido em `Progress`/`DotStepper`/`RatingInput` em sessões anteriores. Adicionado `role="progressbar"` + `aria-valuemin/max/now` + `aria-label`. Item de checklist (`role="checkbox"` num `<div>`) já tinha `aria-checked`/`tabIndex`/`onKeyDown` corretos desde antes
- **Achado real no registry**: `showProgress` documentado com default `'false'` — **o real é `true`** (mesma classe de bug de default invertido já achada em `separator`/`filter-bar`); `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 8: demo já cobria default (progress+strikethrough) + intent success — nenhuma mudança
- Gate 9: `e2e/cn/display/checklist.spec.ts` novo (5 testes: crash/console/clique alterna `aria-checked` e progresso/`aria-valuenow` correto/Enter via teclado alterna) — 10/10 chromium-desktop + mobile-chrome (2 rodadas de falhas transientes por contenção do dev server compartilhado com verificação visual via browser — resolvido fechando a aba extra, confirmado não-relacionado ao código num terceiro run limpo)

### `display/empty-state` — concluído

Quinquagésimo quarto standalone. `.types.ts`/`index.ts` já corretos desde antes — o mais limpo até agora nesta varredura.

- Gate 1: normalizado o `.tsx` pro padrão de formatação do projeto (aspas duplas)
- Gate 2/5/6: nada a corrigir — `text-muted`/`text-foreground` canônicos, sem interatividade própria (server component correto, sem `'use client'`)
- Gate 3: `SIZE_CLS` (padding+ícone+font-size por tier) mantido como escala própria; `mt-1` do wrapper de `action` (fora do `SIZE_CLS`, estrutural) → `mt-(--spacing-2xs)` (match exato)
- **Achado no registry**: `style` (real) ausente da tabela de props — corrigido + `registry:build`
- Gate 8: demo só tinha 1 variação (default) — **adicionada seção "Sizes"** com sm/md/lg
- Gate 9: `e2e/cn/display/empty-state.spec.ts` novo (4 testes: crash/console/título+descrição+ação/3 tamanhos com títulos distintos) — 8/8 chromium-desktop + mobile-chrome

### `display/quote-block` — concluído

Quinquagésimo quinto standalone.

- **Gate 8, mesma classe do `NoticeBar`**: `QuoteBlock` **não tinha demo nenhuma** — sem import, sem função, sem entrada no `DEMOS` — rota renderizava "não encontrada". Criada a demo completa (default com autor+avatar + 3 variants)
- Gate 1: sem `.types.ts` (`QuoteBlockVariant`/`QuoteBlockProps` inline) — extraído pra `quote-block.types.ts`
- **Gate 2, bug real**: o círculo de avatar customizado (`AvatarCircle`) usava `bg-patina/20 text-patina` — o padrão de opacidade ad-hoc de novo, agora numa "fake soft surface" pra um círculo de iniciais
- **Gate 4, dedup real**: além do bug de cor, `AvatarCircle` reinventava por completo o que o `<Avatar>` CN já faz (iniciais, imagem, fallback) — mesmo achado já corrigido no `ChatBubble` em sessão anterior. Substituído por `<Avatar src={avatar} name={avatarFallback ?? author} alt={author} size="sm" />`, resolvendo o bug de cor de brinde (o `Avatar` já usa tokens corretos)
- Gate 3: `py-2`/`mb-3`/`mt-4` (match exato) → tokens; `p-5`/`pl-5`/`gap-2.5` documentados (sem match exato)
- **Achado real no registry, grave**: `variant` documentado como `'default' | 'accent' | 'ghost'` — **nenhum desses três valores existe**, o union real é `'default' | 'bordered' | 'filled' | 'minimal'`; `style` (real) ausente — corrigido + `registry:build`
- Gate 9: `e2e/cn/display/quote-block.spec.ts` novo (4 testes: crash/console/`<blockquote>` real com autor e avatar por iniciais/3 variantes com autores distintos) — 7/7 úteis chromium-desktop + mobile-chrome, 1 `test.skip` em mobile-chrome (pendência 0b, mesmo padrão já confirmado visualmente várias vezes nesta sessão)
- **Nota operacional**: primeira tentativa de commit falhou no hook `eslint --fix` do husky — a demo nova introduziu 2 bugs reais de lint, não relacionados ao componente em si: `role="Mathematician"` (prop própria do `QuoteBlock`, não o atributo ARIA) disparou falso positivo de `jsx-a11y/aria-role`, resolvido com `eslint-disable-next-line` comentado explicando o motivo; e aspas/apóstrofo literais dentro de texto JSX (`"We've..."`) violavam `react/no-unescaped-entities`, resolvido com entidades HTML (`&ldquo;`/`&apos;`/`&rdquo;`). Husky reverte a working tree pro estado anterior à tentativa quando o hook falha (comportamento correto, sem perda de dados) — confirmado depois via `git show HEAD:.../QuoteBlock.tsx` que o commit final contém as correções certas

### `display/read-more` — concluído

Quinquagésimo sexto standalone.

- **Gate 8, terceira ocorrência da mesma classe (`NoticeBar`/`QuoteBlock`)**: `ReadMore` **não tinha demo nenhuma** — sem import, sem função, sem entrada no `DEMOS`. Criada demo (default + labels customizados)
- Gate 1: sem `.types.ts` (`ReadMoreProps` inline) — extraído pra `read-more.types.ts`
- **Gate 5, gap real de a11y corrigido**: o botão de expandir/colapsar não tinha `aria-expanded` — leitor de tela não anunciava o estado do toggle. Adicionado
- Gate 2/3/6: nada a corrigir — `text-patina` canônico, sem spacing estrutural fora de `SIZE`
- **Achado real no registry**: `expandLabel`/`collapseLabel` documentados com defaults em português (`'Ler mais'`/`'Ler menos'`) — **os reais são em inglês** (`'Read more'`/`'Show less'`, confirmado no código); `style` (real) ausente — corrigido + `registry:build`
- Gate 9: `e2e/cn/display/read-more.spec.ts` novo (4 testes: crash/console/expandir alterna `aria-expanded`/labels customizados) — 8/8 chromium-desktop + mobile-chrome
- **Nota operacional aplicada**: depois do incidente de commit do `QuoteBlock`, rodei `eslint` incluindo o `_showcase.tsx` (não só a pasta do componente) antes de commitar — confirmado limpo (0 erros, só os warnings pré-existentes do arquivo)

### `inputs/button-group` + `display/icon-box` — concluído

Quinquagésimo sétimo/oitavo standalone. Quarta e quinta ocorrência da mesma classe de bug (`NoticeBar`/`QuoteBlock`/`ReadMore`) — desta vez achadas via **varredura sistemática completa** (não mais achado avulso): script PowerShell comparando todos os `name:` de `cn-registry.tsx` contra todas as chaves do mapa `DEMOS` em `_showcase.tsx` (`Compare-Object`) — confirmou que **estes eram os últimos 2** componentes órfãos (197 entradas no registry vs 195 chaves em `DEMOS` antes da correção). Considerar essa varredura o fechamento definitivo dessa classe de bug — não mais "achado avulso via inspeção manual".

**`ButtonGroup`:**

- Gate 8: zero demo (sem import, sem função, sem entrada em `DEMOS`) — criada (attached horizontal/vertical + detached)
- Gate 1: sem `.types.ts` (`ButtonGroupProps` inline) — extraído pra `button-group.types.ts`
- **Achado real no registry**: `attached` documentado com default `false` — real é `true` (mesma classe de bug invertido já visto em `separator.decorative`/`filter-bar.multiSelect`/`checklist.showProgress`/`notice-bar.dismissible`)
- **Gate 5, gap real de a11y**: `<div role="group">` sem `aria-label` — leitor de tela não anunciava o propósito do agrupamento. Adicionada prop opcional `"aria-label"?: string` no `.types.ts`, wired no componente
- Gate 3: `gap-2` (match exato) → token
- Gate 9: `e2e/cn/inputs/button-group.spec.ts` novo (4 testes: crash/console/`role=group`+`aria-label`/detached ainda clicável) — 8/8 chromium-desktop + mobile-chrome

**`IconBox`:**

- Gate 8: zero demo — criada (6 intents + neutral, com/sem título+descrição, 3 tamanhos)
- Gate 1: sem `.types.ts` — extraído pra `icon-box.types.ts`
- **Gate 2, 6 bugs de cor reais**: todos os intents coloridos usavam `bg-X/10 text-X` (opacidade ad-hoc) em vez de `bg-X-soft text-X-soft-fg` — mesma classe de bug já vista em `Alert`/`IconBox`(nome coincidente com achado anterior)/`Toast`; `neutral/solid` usava `bg-foreground text-base` (inversão sem sentido semântico) → `bg-neutral text-neutral-fg`
- **Gate 3, bug real de tamanho de fonte cru banido pelo CLAUDE.md**: `SIZE_BOX` usava `text-xl`/`text-2xl` crus — `text-xl` (1.25rem, match exato) → `text-body-title`; `text-2xl` (1.5rem, match exato) → `text-heading-05`; tier `lg` (`text-[1.125rem]`, sem match exato na escala) mantido como está, documentado com comentário (zero mudança visual em nenhum dos três)
- **Achado real no registry**: `size` documentado com valor fictício `'xl'` — o union real não tem esse valor
- Gate 9: `e2e/cn/display/icon-box.spec.ts` novo (4 testes: crash/console/7 intents com cores distintas soft-vs-neutral/título+descrição nos 3 tamanhos) — 8/8 chromium-desktop + mobile-chrome

**Nota operacional — falso alarme identificado e descartado**: a primeira rodada de Playwright (8 workers, paralelo) deu 2 falhas transientes (`sem erros de console`, só chromium-desktop, timeout de 30s em `waitForLoadState("networkidle")`) — mesma assinatura já vista em `Callout`/`Checklist`. Uma re-tentativa idêntica em paralelo **repetiu a mesma falha 2x seguidas** (diferente do padrão anterior de "passa na segunda tentativa"), então em vez de insistir cegamente rodei com `--workers=1` (serial) — **16/16 passou limpo**. Conclusão: a causa real é contenção de recursos do dev server sob paralelismo alto (8 workers batendo o mesmo `localhost:3000` simultaneamente), não flakiness aleatória do teste nem bug do componente. Registrar como alternativa válida ao "só re-rodar": se uma falha por timeout se repetir 2x seguidas no mesmo padrão, tentar `--workers=1` antes de suspeitar de bug real.

### `display/breadcrumb` — concluído

Quinquagésimo nono standalone. Primeiro componente validado depois da varredura sistemática de `absorbs`/demos — retomado a partir da ordem de prioridade Tier-1 do skill (`shortcut-key`/`status-badge`/`animated-number` já fechados via absorção real ou família `text-effect`; próximo da lista era `breadcrumb`).

- **Gate 1, bug real**: arquivo tinha `onClick` (item clicável sem `href`) mas não tinha `'use client'` — componente interativo sem a diretiva
- Gate 3: `py-[0.375rem]` (3 ocorrências, match exato com `--spacing-xs`) e `px-1` (match exato com `--spacing-2xs`) → tokens; `gap-[0.3125rem]` (5px, sem match exato na escala) mantido com comentário `/* below spacing scale minimum */`
- **Achado real no registry**: `separator` documentado com default `'/'` (string literal) — o real é o ícone SVG de chevron (`<DefaultSeparator />`); `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 8: demo já existia com 3 variações (default/collapsed/custom separator) mas nunca testava a prop `icon` — adicionada 4ª variação "With icon"
- Gate 2/5/6: nada a corrigir — `text-faint`/`text-foreground` canônicos, último item já tinha `aria-current="page"`, separador decorativo já tinha `aria-hidden`
- Gate 9: `e2e/cn/display/breadcrumb.spec.ts` novo (5 testes: crash/console/último item não é link com aria-current/colapso mostra elipse/item com href é link) — 10/10 chromium-desktop + mobile-chrome

### `display/animated-list` — concluído

Sexagésimo standalone.

- Gate 1: import order (falta linha em branco entre grupos) — corrigido
- **Achado real no registry**: `staggerMs` documentado com default `60` — real é `80`; `style` (real) ausente — corrigido + `registry:build`
- Gate 2/3/4/5/6: sem cor/tipografia hardcoded (componente é só wrapper de animação via `style` inline com nomes de keyframe do token bridge, todos confirmados existentes em `kikitocn-tokens.css`); sem elemento interativo próprio
- Gate 9: `e2e/cn/display/animated-list.spec.ts` novo (4 testes) — 1ª rodada achou colisão de locator real (`getByText("Design System")` batia tanto no item da lista quanto no brand-tag do header do showcase) — corrigido escopando a busca em `page.locator("main")`; 8/8 chromium-desktop + mobile-chrome depois do fix
- **Achado sistêmico novo, não bloqueante, registrado como pendência**: nenhuma keyframe de animação do token bridge (`slide-up-ks`/`fade-in-ks`/etc, usadas por `AnimatedList` e outros) respeita `prefers-reduced-motion` — não há media query em `kikitocn-tokens.css` desligando/reduzindo essas animações pra quem pediu menos movimento no SO. Afeta potencialmente todo componente que usa essas keyframes (`AnimatedList`, `MarqueeText`, `Toast`, etc.), não é bug isolado deste componente — ver item novo na lista de pendências abaixo

### `data/pagination` — concluído

Sexagésimo primeiro standalone. Já tinha passado pelo sweep de sintaxe `-[--var]` numa sessão anterior (2 ocorrências fixadas), mas nunca pelos 9 gates completos.

- **Gate 3, bug real que o sweep anterior deixou passar**: o `rangeLabel` (`"1–20 of 240"`) ainda usava `text-[length:--pg-fs]` (colchete cru, sintaxe confirmada quebrada) — as outras 2 ocorrências (`BTN_BASE`, span de elipse) já tinham sido corrigidas pra `text-(length:--pg-fs)`, essa terceira ficou pra trás. Corrigido; `px-[0.375rem]` (match exato) → `px-(--spacing-xs)` de passagem
- **Achados reais no registry, dois**: `page` documentado como "1-indexed" — o real é **0-indexed** (`page === 0` desabilita "First page", `page + 1` só na label visual do botão); `showEdges` documentado com default `false` — real é `true` (mesma classe de bug invertido já vista em 5 componentes anteriores); `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 5: elipse (`…`) não tinha `aria-hidden` — adicionado (decorativo, já tinha `pointer-events-none`)
- Gate 2/4/6: nada a corrigir — `bg-patina!`/`text-patina-fg!` canônicos, `var(--ks-graphite)`/`var(--ks-primary)` confirmados existentes; ícones SVG inline decorativos aceitáveis, botões com estilo específico de paginação (não candidatos a `<Button>` CN genérico — tamanho/hover próprios da grade de páginas)
- Gate 9: `e2e/cn/data/pagination.spec.ts` novo (5 testes: crash/console/página 1 com aria-current+First page desabilitado/Next page avança nas duas instâncias com estado compartilhado/range label) — 10/10 chromium-desktop + mobile-chrome

### `display/copy-button` — concluído

Sexagésimo segundo standalone. Já delegava corretamente pro `<Button>` CN (Gate 4 limpo de cara).

- **Gate 5, gap real de a11y**: o feedback "Copied!" só mudava o `aria-label`/texto visível do botão sem nenhum `aria-live` — leitor de tela não anunciava a confirmação de cópia a não ser que o foco se movesse. Adicionado `aria-live="polite"` no próprio `<Button>` (sem `role` custom, pra não sobrescrever o `role="button"` implícito e quebrar a semântica/queries existentes — confirmado que `Button` repassa `...rest` pro elemento nativo)
- Gate 1: `index.ts` não reexportava `CopyButtonSize`/`CopyButtonVariant` (tipos reais do `.types.ts`) — adicionado; import order corrigido
- **Achado real no registry**: `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 2/3/6: nada a corrigir — só `text-success!` (token canônico) condicional no estado copiado
- Gate 9: `e2e/cn/display/copy-button.spec.ts` novo (4 testes: crash/console/clicar copia pro clipboard real + mostra "Copied!"/aria-live=polite) — 1ª rodada achou colisão de locator real (`getByText("Copied!")` batia no botão E nos painéis de "código-fonte"/"tabela de props" da página, que mostram o valor literal `successLabel` como exemplo) — corrigido usando `getByRole("button", { name: /Copy code|Copied!/ })` (regex que cobre os dois estados do accessible name) em vez de `getByText`; 8/8 chromium-desktop + mobile-chrome depois do fix

### `feedback/countdown-timer` — concluído

Sexagésimo terceiro standalone.

- Gate 1: dois imports separados de `'react'` (`{ useEffect, useRef, useState }` e `React` default só pra `React.Fragment`) — mesclado num único import com `Fragment` nomeado
- Gate 3: `gap-1`/`mt-1`/`pt-0.5` (todos match exato) → tokens de spacing
- **Achado real no registry**: `showDays` documentado com default `false` — real é `true` (mesma classe de bug invertido, já vista em 6 componentes anteriores); `className`/`style` (reais) ausentes — corrigido + `registry:build`
- **Achado de passagem no showcase**: demo usava `text-lg` cru (banido) no texto "Time's up!" — sem match exato na escala (1.125rem fica exatamente entre `body-paragraph` 1rem e `body-title` 1.25rem); mapeado pra `text-body-title` (peso semântico de destaque, consistente com ser uma mensagem de conclusão)
- Gate 2/5/6: nada a corrigir — `role="timer"` + `aria-live="off"` já é o padrão WAI-ARIA correto pra timers que atualizam a cada segundo (evita spam de leitor de tela); separador decorativo já tinha `aria-hidden`
- Gate 9: `e2e/cn/feedback/countdown-timer.spec.ts` novo (4 testes) — 1ª rodada achou colisão de locator real (`getByText("Hours")` batia nos dois timers da demo) — corrigido escopando no timer com `showDays`; **2ª rodada travou 120s no `webServer` do Playwright sem nenhum log de erro** — resolvido com o remédio já documentado no CLAUDE.md (`rm -rf .next` + reiniciar servidor limpo), confirmado que era exatamente esse sintoma (nenhum processo ouvindo na porta 3000 durante o travamento); 8/8 chromium-desktop + mobile-chrome depois da limpeza

### `display/credit-card` — concluído

Sexagésimo quarto standalone. Mockup visual decorativo (simulação de cartão físico) — vários achados de exceção documentada, não de token errado.

- Gate 1: `import React from 'react'` morto (nunca referenciado, JSX transform moderno não precisa) — removido
- **Gate 2, exceção documentada (nova categoria)**: hex literais em `VARIANT_BG`/`VARIANT_TEXT` e no `<style>` inline (chip dourado, sombreamento) — mockup de cartão físico precisa manter aparência realista independente do tema claro/escuro do site, mesma classe de exceção já usada em `cn-install-block`/`terminal-block`. Faltava o comentário `/* no token equivalent */` exigido — adicionado
- **Gate 2, bug real de passagem**: `border-radius: 16px` cru dentro do `<style>` (CSS puro, não classe Tailwind) — 16px está dentro da escala (entre `--radius-lg` 14px e `--radius-xl` 20px, mais perto do lg), corrigido pra `var(--radius-lg)` (var real confirmada em `kikitocn-tokens.css`, não só token Tailwind)
- Gate 3: `text-[0.6rem]`/`text-[0.625rem]` (4 ocorrências, "Card Holder"/"Expires"/"Signature"/"CVV") — abaixo do mínimo da escala mas genuinamente micro-labels decorativos, documentado com comentário; `p-6`/`gap-4`/`gap-0.5`(×3)/`mt-6`(×2)/`px-6`/`px-3`/`gap-3` (todos match exato, spacing estrutural genérico, sem prop `size` que justificasse escala própria) → tokens
- **Achados reais no registry**: `number`/`name`/`expiry`/`cvv` sem `default` documentado (reais existem: `''`, `'CARD HOLDER'`, `'MM/YY'`, `'•••'`); `style` (real) ausente — corrigido + `registry:build`
- Gate 8: demo só exercitava 1 variant (`dark`) + 1 brand (`visa`) — adicionadas 2 instâncias extras (`mastercard`/`light`, `amex`/`gradient`)
- Gate 5/6: nada a corrigir — conteúdo real (nome, número, validade) continua em texto acessível por leitor de tela mesmo com o mockup visual; não é candidato a `role="img"` (esconderia o texto real)
- Gate 9: `e2e/cn/display/credit-card.spec.ts` novo (5 testes) — 8/10 passou de cara, as 2 "sem erros de console" bateram no mesmo timeout transiente de contenção do dev server já visto antes (agravado por um `rm -rf .next` que forçou recompilação do zero no meio do processo) — confirmado transiente, 10/10 depois de re-rodar isoladamente

### `layout/draggable` — concluído

Sexagésimo quinto standalone.

- **Gate 5, gap grave de a11y encontrado e corrigido**: a lista só era reordenável via drag-and-drop nativo de mouse — **zero alternativa de teclado**, mesmo bug de operabilidade já resolvido antes no `SortableList` CN (reaproveitado o mesmo padrão: `ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight` conforme `direction`, `Home`/`End`, região `aria-live="polite"` anunciando a nova posição). Modo `handle=false`: `tabIndex`/`onKeyDown`/`aria-label` direto no item; modo `handle=true`: a alça virou `<button type="button">` de verdade (era `<span draggable>` sem nenhuma semântica ou foco) com o mesmo handler. Adicionado `role="list"`/`role="listitem"` no wrapper e itens
- Gate 3: `gap-2`/`mr-1`/`mb-1`/`px-1`/`py-[2px]` (todos match exato) → tokens; `px-[14px]`/`py-[10px]` (padding do card, sem match exato) e `gap-[3px]` (espaço entre barras do grip) documentados com comentário; `rounded-[1px]` nas barrinhas do grip documentado (`below scale minimum`)
- Gate 2: `var(--ks-primary-soft)` confirmado alias real (não é bug — mesma classe de aliases `--ks-*` já validada antes)
- **Achado real no registry**: `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 8: demo só tinha 1 variação (vertical, sem handle) — adicionadas "With handle" e "Horizontal"
- Gate 9: `e2e/cn/layout/draggable.spec.ts` novo (5 testes, incluindo reordenar por teclado nos dois modos) — 10/10 chromium-desktop + mobile-chrome, direto na primeira rodada

### `feedback/feedback-widget` — concluído

Sexagésimo sexto standalone.

- **Achado grave, categoria nova**: `.types.ts` **e** o registry declaravam `open`/`defaultOpen`/`onOpenChange` como API pública, e o registry descrevia o componente como "Floating feedback widget... optional open state" — mas o `.tsx` **nunca implementou nada disso**: sempre renderiza inline, sem trigger flutuante, sem lógica de abrir/fechar nenhuma. As 3 props ficavam aceitas e completamente ignoradas silenciosamente. Confirmado que o uso real (demo, 3 instâncias stars/nps/emoji) sempre foi só o card inline — decisão: **remover as 3 props mortas** de `.types.ts` e do registry (em vez de implementar a feature flutuante do zero, que não é o padrão de uso real hoje) + corrigir a descrição do registry pra refletir o componente real ("Inline feedback card...")
- **Gate 2, bug real**: emoji selecionado usava `bg-patina/10` (opacidade ad-hoc) em vez de `bg-patina-soft` — mesma classe de bug já vista em Alert/IconBox/Toast; `border-patina/50` no hover do NPS mantido (exceção documentada de opacidade em borda, sem token `-soft` pra borda)
- **Gate 5, gap real de a11y, 3 partes**: nenhum botão de rating (NPS/stars/emoji) tinha `aria-pressed` — leitor de tela não anunciava qual nota/estrela/emoji estava selecionado; botões de estrela tinham só o glyph "★"/"☆" como conteúdo (nome acessível não confiável entre leitores de tela) — adicionado `aria-label` explícito nos três grupos; a troca pra tela de agradecimento não tinha `role="status"` — leitor de tela podia perder o contexto da transição
- Gate 3: `p-8`/`gap-2`(×2 grupos)/`gap-4`/`gap-1`(×2)/`p-2` (todos match exato) → tokens; `p-5` (1.25rem, sem match exato) documentado
- Gate 8: demo já cobria os 3 `type` (stars/nps/emoji) com títulos distintos — suficiente
- Gate 9: `e2e/cn/feedback/feedback-widget.spec.ts` novo (5 testes: crash/console/stars habilita submit+aria-pressed/nps completa fluxo até tela de agradecimento/emoji aria-pressed) — 10/10 chromium-desktop + mobile-chrome, direto na primeira rodada

### `display/flip-card` — concluído

Sexagésimo sétimo standalone.

- **Gate 5, gap grave de a11y encontrado e corrigido, duas frentes**: `trigger="click"` tinha `onClick` num `<div>` sem `role`/`tabIndex`/`onKeyDown` — inalcançável por teclado (padrão exato do CLAUDE.md); `trigger="hover"` não tinha **nenhuma** alternativa de teclado (hover-only, verso do card nunca alcançável sem mouse). Corrigido unificando: card inteiro sempre `role="button"` + `tabIndex={0}` + `aria-pressed={flipped}` + `onKeyDown` (Enter/Espaço chama o mesmo `toggle()` dos dois modos)
- **Gate 2, bug real**: `borderRadius: 16` cru duas vezes em `style=` inline (não é classe Tailwind, CSS puro) — 16px está dentro da escala, mais perto de `--radius-lg` (14px) que de `--radius-xl` (20px) — corrigido pra `var(--radius-lg)` nos dois lugares (scene + card), mesmo achado do `CreditCard` nesta sessão
- **Achado de passagem no showcase**: as 2 demos usavam `text-3xl`/`text-sm` crus (banidos) nos glyphs/labels dos cards — `text-3xl`(1.875rem, sem match exato, mais perto de `heading-04`)→`text-heading-04`; `text-sm`(0.875rem, match exato)→`text-body-callout`
- **Achados reais no registry**: `width`/`height` sem `default` documentado (reais: `280`/`180`); `style` (real) ausente — corrigido + `registry:build`
- Gate 1: import order corrigido
- Gate 9: `e2e/cn/display/flip-card.spec.ts` novo (4 testes: crash/console/`trigger=click` vira com Enter/`trigger=hover` vira com Espaço) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada

### `display/glass-card` + `display/glow-card` + `display/tilt-card` + `display/spotlight` + `display/gradient-border` — concluído

Sexagésimo oitavo ao septuagésimo segundo standalone. Família "efeitos do Card" — confirmados wrappers reais (não fake-absorbs) que delegam pra `Card` via prop `effect`, mas cada um com registry próprio desatualizado.

- **Achados reais no registry, grave (4 dos 5 tinham default errado ou nome de prop trocado)**:
  - `glow-card`: `glowSize` doc `300`, real `400`; `glowOpacity` doc `0.15`, real `0.14`; `radius` doc `12`, real `16`; `padding` doc `24`, real `20` — **todos os 4 defaults numéricos errados**
  - `tilt-card`: `scale` doc `1.05`, real `1.04`; `perspective` doc `1000`, real `800`; `glare` doc default `false`, real `true` (mesma classe de bug invertido já vista em 6+ componentes)
  - `spotlight`: `size` doc `400`, real `300`; `color` sem default documentado (real: `'var(--ks-violet-soft)'`)
  - `gradient-border`: só faltava `style`/default de `colors`; `glass-card`: só faltava `style` — esses dois já estavam corretos
  - `style` (real, existe nos 5) ausente em todos — corrigido + `registry:build`
- **Achado de passagem no showcase, 3 demos**: `text-3xl`/`text-2xl`/`text-sm` crus (banidos) nos glyphs/labels das demos de `GlowCard`/`TiltCard` — mapeados pros tokens de tipografia mais próximos (`text-heading-04`/`text-heading-05`); `bg-[#0a0a0f]`/`text-white` no `SpotlightDemo` documentado como exceção válida (backdrop propositalmente escuro pra exibir o glow, independente do tema); `text-white` no card gradiente kinpaku→violet do `TiltCardDemo` documentado (gradiente de 2 tokens, sem par `-fg` único que garanta contraste)
- Gate 1/2/4/5/6: nada a corrigir nos componentes-fonte — `GlassCard`/`GlowCard`/`TiltCard`/`Spotlight`/`GradientBorder` são wrappers finos e corretos sobre `Card`, que já tinha sido validado no lote Tier-0 (incluindo o fix de `var(--ks-raised)`→`var(--ks-lacquer-raised)` usado no efeito glass)
- Gate 9: 5 specs novos (`e2e/cn/display/{glass-card,glow-card,tilt-card,spotlight,gradient-border}.spec.ts`, 3 testes cada) — 1ª rodada achou colisão de locator real no `spotlight.spec.ts` (`getByText("Spotlight Effect")` batia também na descrição da página) — corrigido com `{ exact: true }`; 30/30 no total, chromium-desktop + mobile-chrome

### `display/image-compare` — concluído

Septuagésimo terceiro standalone.

- **Gate 5, gap grave de a11y encontrado e corrigido**: o divisor before/after só era arrastável via mouse/touch — **zero alternativa de teclado**. Corrigido dando à alça o widget ARIA certo pra essa interação: `role="slider"` + `tabIndex={0}` + `aria-valuemin/max/now` + `aria-orientation` + `aria-label`, movida com `ArrowLeft/Right` (ou `Up/Down` se vertical) em passos de 5%, mais `Home`/`End` pros extremos
- **Gate 2, bug real**: `shadow-lg` (classe nativa do Tailwind) no knob — mesma classe de bug já identificada e corrigida em `AreaChart` nesta sessão (não existe token de shadow ainda; padrão do repo é o valor literal `shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)]` já usado em `Select`/`DatePicker`) — alinhado a esse padrão
- Gate 3: `top-2 left-2`/`top-2 right-2`/`px-2 py-0.5` (todos match exato) → tokens de spacing
- **Achados reais no registry**: `width`/`height` sem `default` documentado (reais: `'100%'`/`300`); `style` (real) ausente — corrigido + `registry:build`
- Gate 1 (limpeza de passagem): parâmetro `e` não utilizado no `onMouseDown`; container raiz com `onMouseDown`/`onTouchStart` sinalizado por `jsx-a11y/no-static-element-interactions` — documentado com `eslint-disable-next-line` explicando que o controle acessível de verdade é a alça (`role="slider"`), não a superfície de drag inteira
- Gate 8: demo só tinha a variação horizontal — adicionada variação `direction="vertical"`
- Gate 9: `e2e/cn/display/image-compare.spec.ts` novo (5 testes: crash/console/slider com `aria-valuenow` e `ArrowRight` incrementa/`Home`+`End` nos extremos/versão vertical com `aria-orientation`) — 1 falha isolada e transiente (`sem erros de console` no mobile-chrome, um aviso de CSP `frame-ancestors` sobre `google.com` sem nenhuma relação com o componente) — confirmado transiente ao rodar isolado; 10/10 no total, chromium-desktop + mobile-chrome

### `layout/image-cropper` — concluído

Septuagésimo quarto standalone.

- **Gate 5, gap grave de a11y encontrado e corrigido**: mover a área + redimensionar pelos 4 cantos — toda a interação era só mouse/touch, **zero alternativa de teclado**. Corrigido: área central + cada uma das 4 alças de canto agora são `role="button"` focáveis (`tabIndex`), com `onKeyDown` movendo/redimensionando via Arrow keys — reaproveitando a mesma matemática do mouse (extraída pra função pura `applyDelta`, eliminando também duplicação real de código com a lógica de mousemove)
- **Gate 2, bug real**: `rounded-[2px]` cru nas 4 alças — 2px bate exato com `--radius-xs` → `rounded-xs` (classe direta, confirmada funcionando)
- Gate 3: `bottom-2` (match exato) → token; `px-[10px]`/`py-[3px]` (sem match exato) documentados
- Gate 1 (limpeza de passagem): `import React` morto (só usado em posição de tipo, que já funciona via namespace global ambiente); container raiz com `onMouseDown` sinalizado por `jsx-a11y/no-static-element-interactions` — documentado com `eslint-disable-next-line` (mesmo padrão do `ImageCompare`)
- **Achados reais no registry**: `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 9: `e2e/cn/layout/image-cropper.spec.ts` novo (4 testes) — 3 rodadas de ajuste até fechar: 1ª achou `role="group"` inválido pro que devia ser um widget interativo (`jsx-a11y/no-noninteractive-tabindex`, erro real de lint, corrigido pra `role="button"`); 2ª achou 2 bugs reais **no teste** (não no componente): seletor sem `exact: true` casava com as 5 alças por substring, e um teste lia o texto de feedback _antes_ de qualquer interação disparar o `onCrop` que o monta — corrigidos; 3ª rodada com um `toBeVisible()`→`toBeAttached()` no teste de mobile pra não colidir com a pendência sistêmica 0b (sidebar espreme o Frame em mobile-chrome, documentada, não é bug deste componente); 8/8 chromium-desktop + mobile-chrome depois dos ajustes

### `layout/infinite-scroll` — concluído

Septuagésimo quinto standalone.

- **Gate 1, bug real de tipo**: `hasMore` era `boolean` (obrigatório) em `.types.ts`, mas o componente já desestruturava com `hasMore = true` — o default do JS virava código morto sob TS, forçando todo consumidor a sempre passar `hasMore` mesmo o componente suportando omissão. Corrigido pra `hasMore?: boolean`
- **Gate 5, gap real de a11y**: indicador de "carregando mais" e mensagem de fim de lista sem `role="status"` — leitor de tela não anunciava a atualização de conteúdo assíncrona típica de infinite scroll. Adicionado `role="status"` + `aria-label` no loader, `aria-hidden` no spinner puramente decorativo
- Gate 3: `py-4` (×2, match exato) → token
- **Achados reais no registry**: `hasMore` doc `required: true` (refletia o bug do type antigo — agora `default: true`); `threshold` doc default `0`, real `0.1`; `style` (real) ausente — corrigido + `registry:build`
- Gate 1 (limpeza): import order corrigido
- Gate 9: `e2e/cn/layout/infinite-scroll.spec.ts` novo (4 testes) — o teste de scroll-até-o-sentinel falhava consistentemente em `mobile-chrome` (não transiente, reproduzido 3× com abordagens diferentes); investigado ao vivo via Browser pane com `getBoundingClientRect()` real: o container da demo (mesma pendência sistêmica 0b já documentada — sidebar/grid do showcase espreme o `Frame`) fica com **2px de largura** em viewport mobile, colapsando o sentinel (`div.h-px`, sem largura própria) a `width:0` — um elemento de área zero nunca dispara `IntersectionObserver`, confirmado via inspeção direta do DOM. Não é bug do `InfiniteScroll`; documentado com `test.skip(isMobile, ...)` explicando a causa raiz real (não um "talvez"); 7/7 testes úteis chromium-desktop + mobile-chrome, 1 skip justificado

### `data/json-viewer` — concluído

Septuagésimo sexto standalone.

- **Achado grave, mesma categoria do `FeedbackWidget`**: `.types.ts` e o registry declaravam `collapsed?: boolean` ("Inicia com todos os nós colapsados") como API pública, mas o componente **nunca desestruturava nem usava essa prop** — completamente ignorada. Como o mesmo resultado já é alcançável via `defaultExpandDepth={0}` (prop real, funcional), decisão: remover a prop morta em vez de implementar um segundo mecanismo redundante
- **Gate 2, bug real**: `text-kinpaku/70` no contador "N items/keys" do nó colapsado — opacidade ad-hoc num texto informativo (não decorativo, diferente do glyph de aspas do `QuoteBlock` que usa opacidade como exceção válida em SVG `aria-hidden`). Corrigido pra `text-muted`, o token semântico real pra anotação secundária
- **Gate 5, gap real de a11y**: os botões de expandir/colapsar cada nó não tinham `aria-expanded` nem `aria-label` — leitor de tela não anunciava o estado nem a ação (só liam o glyph "{"/"}" literal). Adicionado `aria-expanded` + `aria-label="Expand"/"Collapse"` nos dois estados
- Gate 3: `p-4`/`pl-4`/`ml-1` (todos match exato) → tokens
- **Achado real no registry, de passagem**: `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 9: `e2e/cn/data/json-viewer.spec.ts` novo (4 testes: crash/console/dados expandidos por padrão/aria-expanded muda ao clicar) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada

### `data/kanban` — concluído

Septuagésimo sétimo standalone.

- **Gate 5, gap grave de a11y encontrado e corrigido**: mover um card entre colunas era só drag-and-drop de mouse/touch — **zero alternativa de teclado**. Corrigido: cada card virou `role="button"` focável com `aria-label` descrevendo card+coluna atual, `ArrowLeft`/`ArrowRight` movem pra coluna anterior/seguinte (mesma ordem visual esquerda→direita) — lógica de mover card entre colunas extraída pra função `moveCard` compartilhada entre o drop de mouse e o teclado (eliminando duplicação real de código)
- **Gate 2, bug real**: destaque de coluna-alvo durante o drag usava `bg-patina/5` (opacidade ad-hoc) → `bg-patina-soft`, mesma classe de bug já vista em vários componentes; `bg-lacquer` (alias válido de `bg-base`, confirmado real, mas fora do vocabulário canônico do CLAUDE.md) → normalizado pra `bg-base`
- Gate 3: `text-[0.625rem]` (×2, chip de label e iniciais do avatar) documentados como micro-labels; `gap-4`/`p-3`/`pb-2`/`gap-2`(×2)/`mb-1`/`mt-1`/`mt-2`/`px-1.5`/`py-0.5`(×2) (todos match exato) → tokens
- **Achado real no registry**: `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 9: `e2e/cn/data/kanban.spec.ts` novo (4 testes: crash/console/4 colunas com cards/card focável move com ArrowRight) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada

### `feedback/log-viewer` — concluído

Septuagésimo oitavo standalone.

- **Gate 2, bug real, 4 intents**: badges de nível (`info`/`warn`/`error`/`success`) usavam `bg-X/15 text-X` (opacidade ad-hoc) em vez de `bg-X-soft text-X-soft-fg` — mesma classe de bug já vista em vários componentes. O wash sutil de fundo da linha inteira (`bg-X/5`) foi mantido como exceção documentada (não é par bg/texto de contraste — a mensagem continua `text-foreground` independente do nível, é só um destaque visual de linha, sem token `-soft` equivalente pra essa intensidade)
- **Gate 5, gaps reais de a11y, 3 partes**: campo de busca sem `aria-label` (só tinha `placeholder`, que não deveria ser a única fonte de nome acessível); emoji 🔍 decorativo sem `aria-hidden`; lista de logs sem `role="log"` — papel ARIA correto pra uma região de log que cresce dinamicamente (implica `aria-live="polite"`), relevante já que o componente tem `autoScroll` pensado pra logs em streaming
- Gate 3: `text-[0.5625rem]` (badge de nível) e `mt-px` (ajuste fino de alinhamento com o badge) documentados; `gap-2`/`px-3 py-2`/`px-1.5 py-0.5`/`px-4 py-6`/`px-3 py-1.5` (todos match exato) → tokens
- **Achados reais no registry**: `maxHeight` doc default `400`, real `360`; `emptyMessage`/`className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 9: `e2e/cn/feedback/log-viewer.spec.ts` novo (4 testes: crash/console/entradas com badge/busca filtra por `aria-label`) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada

### `display/markdown-renderer` — concluído

Septuagésimo nono standalone.

- **Achado gravíssimo, o mais sério da auditoria até aqui — XSS real**: o parser markdown→HTML é regex ingênuo e não escapava HTML bruto do `content` de entrada antes de aplicar as transformações de sintaxe — resultado ia direto pro DOM via `dangerouslySetInnerHTML`. Qualquer `content` com `<script>`/`onerror=`/etc. arbitrário executava. Corrigido reaproveitando infraestrutura já existente e nunca antes usada no projeto: `sanitizeRichText()` de `src/lib/sanitize.ts` (baseado em `isomorphic-dompurify`, allowlist de tags já compatível 1:1 com o que este parser produz — headings, `a`, `ul`/`ol`/`li`, `code`/`pre`, `table`/`thead`/`tbody`/`tr`/`th`/`td`, `img`, etc.)
- **Achado grave correlato — feature anunciada mas morta**: o registry descrevia suporte a tabela GFM e a estilização (`[&_table]`/`[&_th]`/`[&_td]`/`[&_img]`) já existia no componente, mas **nunca existiu parser nenhum** pra tabela nem pra imagem markdown (`![alt](src)`) — decisão: implementar de verdade (não só corrigir a doc), já que o CSS estava pronto e a feature era explicitamente publicitada. Novo parser de tabela GFM (linha de cabeçalho + linha separadora `---|---` + linhas de corpo) e regex de imagem (que precisa rodar ANTES do regex de link — mesmo padrão `[]()`, diferenciado só pelo `!` líder)
- **Achado de ambiente descoberto ao integrar o sanitizer — SSR quebrado por dependência de terceiro**: `isomorphic-dompurify` inicializa jsdom no import do módulo quando `window === undefined` (SSR), e a resolução de asset do jsdom sob o bundler deste projeto quebra (`ENOENT` em `.../jsdom/.../browser/default-stylesheet.css`) — derrubava TODOS os testes, incluindo o de "renderiza sem crash". Corrigido com `"use client"` + import **dinâmico dentro de `useEffect`** (`import("@/lib/sanitize")`, não top-level — um import top-level, mesmo em componente client, ainda é avaliado no passe de SSR do Next.js e quebraria do mesmo jeito). Confirmado via `find`/`grep`: primeira invocação real de `sanitizeRichText` no projeto, bug latente nunca disparado antes
- Gate 3: tamanhos/espaçamentos em `em` (headings, código inline, listas, blockquote) documentados como exceção válida — escala proporcional ao font-size do próprio elemento (padrão "prose"), mesma categoria já usada nos ícones do `Tabs` que herdam tamanho do texto pai; `rounded-r-[--radius-sm]` (bracket cru direcional, já catalogado como quebrado) → `rounded-r-(--radius-sm)`
- **Achado real no registry**: `style` (real) ausente — corrigido + `registry:build`
- Gate 9: `e2e/cn/display/markdown-renderer.spec.ts` novo (4 testes: crash/console/heading+bold+code+blockquote/tabela GFM real com `thead`/`tbody`) — 1ª rodada: todos os 8 falharam com o `ENOENT` do jsdom (bug de ambiente acima, corrigido); 2ª rodada: 7/8 passou, 1 falha isolada em `mobile-chrome` no teste de heading/bold/blockquote — mesma pendência sistêmica 0b (container do showcase espremido), corrigida com `test.skip(isMobile, ...)`; 3ª rodada: 7 passed + 1 skipped, EXIT:0

### `layout/masonry` — concluído

Octogésimo standalone.

- **Achado real, feature anunciada mas não implementada por completo**: `columns` aceita `number | { sm?, md?, lg? }` — tanto o tipo quanto o registry ("configurable column counts per breakpoint") descreviam suporte a breakpoint, mas o componente só lia `.md` do objeto e ignorava `sm`/`lg` silenciosamente, sem nenhuma media query real por trás. Implementado de verdade: `resolveColumns()` normaliza os 3 tiers com fallback em cascata (`sm` explícito ou `1`; `md` cai pro `sm` se ausente; `lg` cai pro `md`), aplicados via CSS custom properties (`--masonry-cols-sm/md/lg`) lidas por propriedades arbitrárias do Tailwind com variante responsiva (`[column-count:var(--masonry-cols-sm)] md:[column-count:var(--masonry-cols-md)] lg:[column-count:var(--masonry-cols-lg)]`) — media query real, confirmado via `getComputedStyle` em dois viewports diferentes
- **Achado real de robustez, de passagem**: normalização de `children` trocada de `Array.isArray(children)` (falha silenciosamente pra um único filho não-array, ou pra children não literalmente array) por `React.Children.toArray(children)`, que lida com os dois casos e filtra `null`/`undefined` corretamente
- **Achado real no showcase**: `rounded-[--radius]` (bracket cru sem `var()`, mesma classe de bug já catalogada — resolve pro `--radius` nativo do Tailwind, não pra token nenhum daqui) → `rounded-(--radius-md)`. Demo também só exercitava `columns` numérico fixo — adicionada 2ª instância com `columns={{ sm: 1, md: 2, lg: 4 }}` pra cobrir a feature recém-implementada (Gate 8 exige ≥2 variações significativas)
- **Achado real no registry**: `className`/`style` (reais, presentes em `masonry.types.ts`) ausentes — corrigido + `registry:build`
- Gate 9: `e2e/cn/layout/masonry.spec.ts` novo (4 testes: crash/console/`column-count` fixo/`column-count` muda por viewport via `getComputedStyle`) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada; não bate na pendência sistêmica 0b porque o teste lê `getComputedStyle` (não depende de o container estar visualmente visível, só de existir no DOM)

### `display/media-player` — concluído

Octogésimo primeiro standalone.

- **Gate 1, bug real de estrutura**: `MediaPlayerProps`/`MediaPlayerType` estavam declarados inline no `.tsx` — não existia `media-player.types.ts`. Extraído pro arquivo próprio, `index.ts` e o import interno atualizados
- **Achado grave, mesma categoria do `MarkdownRenderer` (feature anunciada, nunca implementada)**: `type?: 'audio' | 'video'` era documentado no registry ("Audio/video player card") e no tipo, mas o componente **sempre montava um `<audio>` escondido**, nunca um `<video>` — passar `type="video"` com um `src` de vídeo real nunca exibia nada visível. Implementado de verdade: quando `type === 'video' && src`, o slot de capa (56×56) monta um `<video>` visível de verdade controlado pelos mesmos transportes (play/pause/seek/volume); o `<audio>` do rodapé só monta pro caso `'audio'`, evitando dois elementos de mídia tocando o mesmo `src` ao mesmo tempo
- **Achado real de bug funcional, 2 casos**: os botões "Previous"/"Next" chamavam `setProgress(0)`/`setProgress(duration)` direto — nunca atualizavam `mediaRef.current.currentTime`, então com um `src` real o áudio/vídeo continuava tocando do ponto antigo enquanto a UI mostrava progresso zerado/no fim. Corrigido: os três lugares que alteram posição (clique na barra, teclado, prev/next) convergem pra uma única `seekTo()` que atualiza estado E `currentTime`
- **Gate 5, gap real de a11y**: barra de progresso era `<div onClick>` mouse-only, sem alternativa de teclado (mesma classe de bug já vista em vários componentes) — virou `role="slider"` focável com `aria-valuemin/max/now/text`, `Arrow←/→`/`↑/↓` (passo de 5s), `Home`/`End`, extraindo a lógica de seek pra função compartilhada com o clique; cover/vídeo decorativo (título/artista já aparecem como texto ao lado) ganhou `aria-hidden="true"` explícito; input de volume ganhou `aria-label="Volume"` (só tinha o ícone ao lado, sem nome acessível)
- Gate 3: `text-2xl` cru (banido) no emoji de fallback → `text-heading-05` (match exato 1.5rem); `text-[0.6rem]` (×2, dígitos de tempo decorrido/total) documentado como micro-label abaixo do mínimo da escala
- **Gate 4, precedente confirmado**: botões de transporte (prev/play/next) ficam nativos (`<button>` customizado), não `<Button>` CN — mesmo padrão já usado em `Carousel`/`ImageViewer` pras setas circulares, porque o Button CN não tem uma variante icon-only circular equivalente; `<input type="range">` do volume também fica nativo (já é totalmente acessível por teclado nativamente; `Slider` CN ainda não foi validado nesta auditoria e é visualmente mais pesado que o encaixe compacto necessário aqui) — anotado como melhoria não-bloqueante, não bug
- **Achado real no registry**: `style` (real, presente em `media-player.types.ts`) ausente — corrigido + `registry:build`
- Gate 8: showcase só tinha `type="video"` sem `src`, então o novo branch de `<video>` nunca era exercitado visualmente — adicionadas 2 instâncias com `src` real (mesmo padrão de asset externo já usado em `ImageCropper`/`Avatar`: SoundHelix pro áudio, Big Buck Bunny do bucket público do Google pro vídeo)
- Gate 9: `e2e/cn/display/media-player.spec.ts` novo (5 testes: crash/console/`type=video` monta `<video>` não `<audio>`/`type=audio` monta `<audio>` não `<video>`/Play alterna label e barra de progresso navega por teclado) — 10/10 chromium-desktop + mobile-chrome, direto na primeira rodada

### `layout/mini-map` — concluído

Octogésimo segundo standalone.

- **Sem achados de cor/tipografia real**: `bg-rule` usado como preenchimento do dot inativo e da linha conectora — confirmado padrão real e amplamente usado (14 outros arquivos, incluindo `DotStepper`/`Timeline`/`Stepper` já validados), não é hex/opacidade ad-hoc, é reaproveitamento legítimo do token de borda pra elemento decorativo fino
- Gate 3: `gap-2`/`py-0.5` (ambos match exato) → tokens de spacing
- **Achado real, defensivo**: `<button>` sem `type="button"` — se o `MiniMap` for usado dentro de um `<form>` (não é o caso do showcase, mas é um componente de biblioteca, não controla o contexto de uso do consumidor), o clique dispararia submit por padrão. Adicionado `type="button"`, mesmo padrão já usado em todos os outros botões da lib
- **Achado real no registry**: `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 8: demo só exercitava `position="right"` — adicionada 2ª instância com `position="left"` lado a lado (Gate 8 exige ≥2 variações)
- Gate 9: `e2e/cn/layout/mini-map.spec.ts` novo (4 testes: crash/console/clique marca `aria-current`/2 `<nav>` renderizados) — teste de clique falhava em `mobile-chrome` por interceptação de ponteiro da sidebar sticky do showcase (mesma pendência sistêmica 0b, não é bug do componente), corrigido com `test.skip(isMobile, ...)`; 1 falha adicional de "sem erros de console" em ambos os projetos na 2ª rodada foi confirmada **transiente** (servidor esfriando entre rodadas consecutivas em background — reexecução limpa: 7 passed + 1 skip, `EXIT:0`)

### `feedback/notification-bell` — concluído

Octogésimo terceiro standalone.

- **Gate 1, bug real de estrutura**: `NotificationBellProps`/`Notification`/`NotificationIntent` inline no `.tsx` — extraído pro `notification-bell.types.ts`, `index.ts` atualizado
- **Achado grave, bug de posicionamento real confirmado ao vivo (Browser pane)**: `calcPos()` clampava a borda esquerda (`if (left < 8) left = 8`) mas nunca a de cima quando o fallback "vira o painel pra cima do botão" (`top = r.top - ph - 8`) resultava em valor negativo — em viewport curto, sem espaço nem abaixo nem acima do gatilho, o painel renderizava com `top: -166px` de verdade (confirmado via `getBoundingClientRect()`), cortando os primeiros itens da lista pra fora da tela sem nenhuma forma de rolar até lá (`position: fixed` não acompanha scroll da página). Corrigido com um clamp final (`if (top < 8) top = 8`), mesma lógica que já existia pra `left`
- **Gate 5, gap grave de a11y**: `<li onClick={...}>` pra "marcar como lida" era mouse-only — `<li>` não é focável e não tinha alternativa de teclado. Como havia um botão "Dismiss" aninhado dentro do mesmo `<li>`, dar `role="button"`+`tabIndex` ao `<li>` inteiro criaria um widget aninhado (dois elementos interativos, um dentro do outro) — resolvido reestruturando: a área "marcar como lido" virou um `<button>` real irmão do Dismiss (não ancestral), eliminando o aninhamento e ganhando foco/teclado nativo de graça
- **Gate 5, 2º gap real**: botão "Dismiss" só ficava visível em `:hover` (`opacity-0 group-hover:opacity-100`) — invisível pra quem navega por teclado até ele, apesar de já ser focável. Adicionado `focus-visible:opacity-100` + anel de foco
- **Gate 4, reaproveitamento real**: contador de não-lidas era um `<span>` customizado reinventando o que `Badge` CN já resolve — trocado por `<Badge intent="danger" variant="solid" size="sm">`, mesmo padrão que `VerticalNav` já usa pra contador numérico
- Gate 2: `bg-graphite/40` (wash de linha "não lida") documentado como exceção válida — não há `-soft` equivalente pra `graphite` (só intents têm `-soft`), mesma categoria já aceita em `LogViewer`; `text-faint/60` (diluição sem função semântica, não existe token mais fraco que `faint`) simplificado pra `text-faint` puro; `bg-faint` do dot neutro confirmado token real (`--color-faint` é genérico, não escopado só a texto)
- Gate 3: de passagem, `aria-label` com template literal aninhado (`sonarjs/no-nested-template-literals`) refatorado pra ternário simples
- **Achado real no registry**: `maxVisible` documentado com default `5`, componente usa `20` de verdade — corrigido; `style` (real) ausente — corrigido + `registry:build`
- Gate 8: showcase não tinha `onRead`/`onReadAll`/`onDismiss` conectados (painel renderizava mas nada era interativo de fato) — demo ganhou `useState` local pros três callbacks
- Gate 9: `e2e/cn/feedback/notification-bell.spec.ts` novo (5 testes: crash/console/abrir painel/marcar como lida via button real/Dismiss focável por teclado e remove da lista) — 1ª rodada achou o bug de `top` negativo ao vivo (teste de clique falhava com "element is outside of the viewport", investigado via Browser pane antes de qualquer tentativa cega de correção no teste); depois do fix no componente, 10/10 chromium-desktop + mobile-chrome

### `feedback/onboarding-tour` — concluído

Octogésimo quarto standalone.

- **Gate 1, bug real de estrutura**: `TourPlacement`/`TourStep`/`OnboardingTourProps` inline no `.tsx` — extraído pro `onboarding-tour.types.ts`, `index.ts` atualizado
- **Gate 5, gap grave de a11y (mesma categoria já resolvida no `Modal`)**: overlay fullscreen cobria a tela, mas elementos por trás continuavam focáveis por Tab (invisíveis atrás do scrim, alcançáveis por teclado), o painel não tinha `role="dialog"`/`aria-modal`, e não recebia foco nenhum ao abrir. Corrigido reaproveitando o mesmo padrão que o `Modal` já usa (adaptado pra não travar o scroll do body, já que o tour depende de rolar até o próximo alvo — diferente do Modal, que bloqueia a página inteira): `role="dialog"` + `aria-modal="true"` + `aria-labelledby` apontando pro título, `tabIndex={-1}` no painel, Tab-trap cycling entre os focáveis do painel, foco inicial no primeiro focável ao abrir
- **Achado real de bug, encontrado pelo próprio Playwright**: o efeito de foco inicial só dependia de `[isOpen]`, mas no primeiro render o componente retorna `null` (`mounted` ainda `false`, painel não existe no DOM) — como `isOpen` não muda entre esse render nulo e o render real do portal (só `mounted` muda), o efeito preso a `[isOpen]` nunca rodava de novo depois que o painel existia de verdade, e o foco nunca caía em lugar nenhum. Corrigido incluindo `mounted` nas deps
- **Gate 4, reaproveitamento real**: botões "Back"/"Next"/"Finish" eram `<button>` customizado reinventando `Button` CN — trocados por `<Button variant="outline|solid" intent="neutral|primary" size="sm">`, mesmo padrão que `Modal` já usa pros próprios botões de rodapé (X de fechar continua nativo, mesma exceção de "controle compacto icon-only" já usada em `Carousel`/`MediaPlayer`)
- Gate 2: `bg-[oklch(0%_0_0/0.5)]` do overlay → `bg-black/50` (equivalente funcional, mas alinhado à convenção literal já documentada no `Modal`: "scrim de overlay, deliberadamente independente de tema")
- Gate 3: `gap-2`/`mb-2`/`mb-3`/`gap-1.5`/`py-1`/`p-4` (todos match exato) → tokens de spacing; `px-2.5` documentado sem match exato na escala
- Gate 1 (limpeza de passagem): `import { cn }` morto removido (nunca era chamado no arquivo original, já era import morto antes desta sessão)
- Gate 9: `e2e/cn/feedback/onboarding-tour.spec.ts` novo (5 testes: crash/console/abre dialog focado e avança/Tab não escapa do dialog/Escape fecha) — 3 rodadas até fechar: 1ª achou colisão real de substring (`getByRole("button", {name: "Next"})` casava com o botão "Open Next.js Dev Tools" do próprio Next.js dev overlay) corrigida com `exact: true`; 2ª achou o bug real do `mounted` nas deps acima (não foi tentativa cega no teste — investigado no componente antes de mexer no teste) e uma assunção errada do teste (esperava foco em "Next", mas o primeiro focável em ordem de DOM é o X "Close tour", que vem antes no JSX) corrigida; 10/10 chromium-desktop + mobile-chrome depois dos dois fixes

### `display/pin-board` — concluído

Octogésimo quinto standalone.

- **Achado grave, mesma categoria já vista várias vezes (feature anunciada, nunca implementada)**: `notes` era documentado no registry como "Notas controladas" e existia no tipo, mas o componente **nunca lia essa prop** — ficava sempre não-controlado internamente (`useState` a partir de `defaultNotes`), ignorando por completo qualquer array passado via `notes`. Implementado o par controlado/não-controlado de verdade: `isControlled = notes !== undefined`, um único `commit()` que ou só chama `onChange` (controlado, quem decide o próximo estado é o consumidor) ou atualiza o estado interno E chama `onChange` (não-controlado) — mesmo padrão de controlled/uncontrolled já usado em inputs da própria lib
- **Gate 5, gap grave de a11y**: mover uma nota era só drag de mouse, e deletar só `onDoubleClick` — **zero alternativa de teclado pra nenhuma das duas ações**, e a nota nem era focável. Corrigido: cada nota virou `role="button"` focável com `aria-label` explicando as duas interações, `Arrow←/→/↑/↓` move em passos de 10px (`moveByKeyboard`, reaproveitado pelo novo `commit()`), `Delete`/`Backspace` remove — mesma categoria de fix já aplicada em `Draggable`/`Kanban`
- Gate 2: paleta de cores do post-it (`COLORS`, hex cru) e o `color-mix(...)` do texto documentados como exceção válida — cor é o próprio conteúdo escolhido pra nota (como um marca-texto), não chrome de UI, sem token semântico equivalente (mesma categoria do scrim `bg-black/50` do Modal/OnboardingTour); `shadow-md` (nativo, banido) → `shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)]` (×2, nota e botão +); `hover:bg-patina/90` (opacidade ad-hoc) → `hover:bg-patina-hover`, token que já existe pra exatamente esse caso
- Gate 3: `p-3`/`bottom-3 right-3` (match exato) → tokens de spacing
- Gate 5, de passagem: botão "+" só tinha `title` (fallback fraco de nome acessível) — adicionado `aria-label="Add note"`
- Gate 1 (limpeza): container de drag sinalizado por `jsx-a11y/no-static-element-interactions` documentado com `eslint-disable-next-line` (mesmo padrão do `ImageCropper`/`ImageCompare`)
- **Achado real no registry**: `style` (real) ausente — corrigido + `registry:build`
- Gate 8: showcase só tinha modo não-controlado — adicionada 2ª instância controlada (`notes`/`onChange` com contagem exibida no label do `Frame`, pra exercitar a feature recém-implementada)
- Gate 9: `e2e/cn/display/pin-board.spec.ts` novo (5 testes: crash/console/seta move nota focada/Delete remove/modo controlado atualiza contagem) — 2 testes de teclado batem na pendência sistêmica 0b (mobile-chrome) e o teste de clique no controlado bate na variante "sidebar intercepta clique" da mesma pendência — todos os 3 com `test.skip(isMobile, ...)`; 7 passed + 3 skips justificados, `EXIT:0`

### `display/price-table` — concluído

Octogésimo sexto standalone.

- **Gate 5, achado real**: `✕` de feature não incluída usava `text-faint` — mas "recurso não incluído" é informação essencial pra decisão de compra numa tabela de preços, não texto decorativo/secundário; a regra de ouro do `text-faint` (CLAUDE.md) pede `text-muted` pra conteúdo primário. Corrigido
- **Gate 5, 2º achado real**: `<th>` de cada plano não tinha `scope="col"` — tabela de comparação lida célula a célula por leitor de tela perde a associação "esta célula pertence a este plano" sem o scope. Adicionado
- **Gate 2**: `bg-patina/5` (×2, header e células da coluna destacada) → `bg-patina-soft`, mesma classe de bug já vista em vários componentes
- **Gate 4, reaproveitamento real**: badge "Most popular" era uma `<div>` reinventando exatamente o Badge CN (`text-[0.625rem] font-bold px-2 py-0.5 rounded-full bg-patina text-patina-fg` = literalmente a receita do `Badge` `solid/primary/sm`) — trocado por `<Badge intent="primary" variant="solid" size="sm">`
- Gate 3: `px-4 pb-6 pt-4`/`mt-1`(×2)/`mt-3`/`py-3 px-2`/`py-3 px-4` (todos match exato) → tokens de spacing
- **Achado real no registry**: `style` (real) ausente — corrigido + `registry:build`
- Gate 9: `e2e/cn/display/price-table.spec.ts` novo (4 testes: crash/console/`scope=col` + Badge real/check-cross corretos por plano) — 1ª rodada achou colisão de substring real (`th:has-text("Pro")` casava com a descrição "Perfect for side **Pro**jects" do plano Free), corrigida localizando a coluna pelo badge "Most popular" (único no plano Pro); 8/8 chromium-desktop + mobile-chrome depois do fix

### `display/pricing-card` — concluído

Octogésimo sétimo standalone.

- **Gate 1, bug real de estrutura**: `PricingFeature`/`PricingCardProps` inline no `.tsx` — extraído pro `pricing-card.types.ts`, `index.ts` atualizado
- **Gate 4, reaproveitamento real, 2 casos**: badge do topo era `<span>` reinventando a receita exata do `Badge` `solid/primary/sm` (`text-[0.65rem] font-bold px-3 py-0.5 rounded-full bg-patina text-patina-fg`, achado idêntico ao `PriceTable` visto minutos antes) → `<Badge>` real; CTA era `<button>` customizado reinventando `Button` CN → `<Button variant="solid|soft" intent="primary|neutral" fullWidth>`, mesmo padrão já aplicado em `OnboardingTour`/`PriceTable`
- **Gate 2/5, achado de dupla diluição**: ícone "✕" (feature não incluída) usava `text-faint/40` **dentro** de um `<li>` que já aplicava `opacity-40` na linha inteira — diluía duas vezes um tom que já é fraco por natureza, deixando o traço quase invisível. Diferente do achado do `PriceTable` (lá não havia nenhum outro sinal visual, então virou bug de contraste); aqui o `opacity-40` da linha inteira já é um tratamento deliberado tipo "desabilitado" (isento de contraste por CLAUDE.md), então a correção foi só remover a diluição redundante do ícone (`text-faint` puro, sem `/40`), mantendo o sinal visual mas sem a dupla penalização
- Gate 3: `text-3xl` cru (banido) no preço → `text-heading-04` (1.75rem, mais próximo de 1.875rem); `p-6`/`mb-4`/`mt-1`/`gap-0.5`/`mb-6`(×2)/`gap-3`/`gap-2`/`ml-1` (todos match exato) → tokens de spacing
- **Achados reais no registry**: `cta` documentado com default `'Começar'` (português), componente usa `'Get started'` (inglês) de verdade — corrigido; `period` sem default documentado (real: `'/month'`) — corrigido; `style` (real) ausente — corrigido + `registry:build`
- Gate 9: `e2e/cn/display/pricing-card.spec.ts` novo (4 testes: crash/console/badge real + CTA clicável no destacado/CTA do plano normal) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada

### `overlays/quick-actions` — concluído

Octogésimo oitavo standalone.

- **Achado sistêmico novo, prioridade média (ver pendência 5 abaixo)**: `QuickActions` (grupo `overlays`) e `Fab` (grupo `inputs`, `src/components/ui/cn/fab/Fab.tsx`) são, na prática, **o mesmo componente implementado duas vezes** — botão circular flutuante que expande num speed-dial de sub-ações com `icon`/`label`/`onClick`/`intent`. Nenhum dos dois tem `absorbs` declarado ligando um ao outro no registry (diferente dos ~20 casos de `absorbs` já auditados na pendência 0), então os dois ficam visíveis lado a lado na sidebar como componentes "diferentes". Decisão de unificação fica fora do escopo de uma validação pontual — registrado como pendência pra decisão futura, não corrigido nesta sessão
- **Gate 5, gap grave de a11y**: quando o menu está fechado, os botões de ação ficavam `opacity-0` + o painel pai `pointer-events-none` (visualmente escondidos, cliques bloqueados), mas continuavam **focáveis por Tab** — a mesma categoria de "elemento escondido ainda alcançável por teclado" já resolvida em `Modal`/`OnboardingTour`. Corrigido com `tabIndex={open ? 0 : -1}` em cada botão de ação
- **Gate 5, 2º gap**: tooltip de cada ação só aparecia em `:hover` (mouse) — quem chegava por Tab não via o rótulo visual, só o `title`/`aria-label` (que ajuda leitor de tela, mas não usuário vidente navegando por teclado). Adicionado `group-focus-within:opacity-100`
- Gate 2: `hover:bg-X/90` (×5: patina do trigger + patina/success/warning/danger das ações) → `hover:bg-X-hover`, tokens que já existem pra exatamente esse caso; `shadow-md` (nativo, banido, ×2) → `shadow-[0_8px_24px_color-mix(in_srgb,black_20%,transparent)]`
- Gate 3: `mb-2`/`mt-2`/`mr-2`/`ml-2` (nas 4 direções de `PLACEMENT_CLS`)/`gap-2`/`px-2 py-0.5` (todos match exato) → tokens de spacing
- **Achado real no registry, 3 partes**: descrição anunciava expansão "radial or linear", mas só existe layout linear (flex nas 4 direções) — nenhum código de posicionamento circular/trigonometria existe; corrigida a descrição em vez de implementar uma feature nova não-anunciada por nenhuma prop (diferente do `PinBoard`/`MediaPlayer`, aqui não havia nenhuma prop tipo `layout="radial"` já plumbada, só a frase solta na descrição); `triggerIcon` documentado com default `undefined`, real é `'+'`; `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 9: `e2e/cn/overlays/quick-actions.spec.ts` novo (4 testes: crash/console/ação fora da ordem de tab quando fechado/ação focável e clicável quando aberto) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada

### `charts/radar-chart` — concluído

Octogésimo nono standalone. Nota: `radar-chart` está no `absorbs` real do `Chart` router (já confirmado verdadeiro na pendência 0), mas isso não isenta o renderer de baixo nível de auditoria — é o componente de fato instalado via `npx kikitocn add radar-chart` e usado internamente pelo `Chart`, mesmo padrão já seguido pra `BarChart`/`AreaChart`/`DonutChart` nesta auditoria.

- **Achado real de eficiência (de passagem)**: `max` por eixo era recalculado com `Math.max(...series.flatMap(...))` dentro de dois loops aninhados (pontos do polígono E dos círculos, pra cada série) — O(eixos × séries) recomputações redundantes do mesmo valor por eixo, a cada render. Hoisted pra um array `maxByAxis` calculado uma vez, com uma função `seriesPoint` compartilhada eliminando a duplicação de código entre os dois loops
- Gate 3: `fontSize={10}` (atributo numérico de `<text>` em SVG) documentado com o mesmo comentário de exceção já usado em `AreaChart`/`BarChart`/`DonutChart` (só estava faltando o comentário, o código já era correto)
- **Sem achados de cor real**: todo o SVG usa `var(--ks-*)` — confirmado que `var(--ks-lacquer)` é a variável CSS real de base (não um alias redundante de outra var; `--color-base`/`--color-lacquer` no Tailwind apontam pra essa mesma raiz, então não há "token mais canônico" pra trocar no nível de CSS var cru, diferente da troca de classe Tailwind `bg-lacquer`→`bg-base` feita no `Kanban`)
- **Achado real no registry**: `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 9: `e2e/cn/charts/radar-chart.spec.ts` novo (4 testes: crash/console/SVG acessível com aria-label + polígonos de série/legenda com labels) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada

### `layout/resizable` — concluído

Nonagésimo standalone.

- **Gate 5, gap grave de a11y**: o divisor entre os dois painéis era só `onMouseDown` — zero alternativa de teclado, nem focável. Corrigido: `role="slider"` + `tabIndex={0}` + `aria-orientation={direction}` (a prop já era literalmente `'horizontal'|'vertical'`, mapeia direto) + `aria-valuemin/max/now`, `Arrow` (direção conforme `direction`) em passos de 5%, `Home`/`End` pros extremos — lógica de resize extraída pra `resizeTo()` compartilhada entre mouse e teclado (mesmo padrão de `seekTo`/`applyDelta` já usado em `MediaPlayer`/`ImageCropper`)
- Gate 2/3: `bg-patina opacity-60` (realce da barra de arraste) e `rounded-[1px]` (grip de 2px, abaixo do mínimo da escala) documentados como exceções válidas — o primeiro não tem equivalente `-soft` real pro caso (feito pra pills/badges, ficaria claro demais numa barra fina), o segundo é abaixo do radius mínimo por necessidade visual genuína (arredondamento maior distorceria um traço de 2px)
- **Achado real no registry**: `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 8: showcase só tinha `direction="horizontal"` — adicionada 2ª instância `direction="vertical"` (Gate 8 exige ≥2 variações)
- Gate 9: `e2e/cn/layout/resizable.spec.ts` novo (5 testes: crash/console/`ArrowRight` aumenta `aria-valuenow`/`Home`/`End` pros extremos/`aria-orientation` correto no vertical) — 10/10 chromium-desktop + mobile-chrome, direto na primeira rodada (inclusive confirmando que o mapeamento `aria-orientation={direction}` estava certo)

### `layout/scroll-area` — concluído

Nonagésimo primeiro standalone.

- **Gate 5, gap real de a11y**: viewport com `overflow` não tinha `tabIndex` — sem outro descendente focável dentro (ex: um texto simples), o conteúdo era inalcançável via teclado (só scroll por mouse/touch/roda). Adicionado `tabIndex={0}` no viewport, seguindo o padrão recomendado pela WAI-ARIA Authoring Practices pra "scrollable region"; `jsx-a11y/no-noninteractive-tabindex` disparou erro real (a regra não tem exceção nativa pra esse padrão, já que normalmente pede um `role` interativo que não se aplica aqui) — resolvido com `eslint-disable-line` **na mesma linha** do atributo (não `eslint-disable-next-line` numa linha acima, que não sobrevive à reformatação do Prettier quebrando os atributos do JSX em linhas separadas — achado de tooling novo, documentado pra não repetir)
- Gate 1 (limpeza): `import React from 'react'` (runtime, só usado pra `React.CSSProperties`) → `import type React`, mais preciso já que não há uso em runtime
- **Sem achados de cor real**: `color-mix(in_srgb,var(--ks-text-muted)_50%,transparent)` dentro de bracket confirmado sintaticamente válido (função CSS completa, diferente do padrão "bracket cru sem `var()`" já catalogado como quebrado)
- **Achado real no registry**: `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 9: `e2e/cn/layout/scroll-area.spec.ts` novo (4 testes: crash/console/2 viewports com `tabindex=0`/`End` move `scrollTop` do viewport focado) — 2 testes de teclado batem na pendência sistêmica 0b (mobile-chrome), `test.skip(isMobile, ...)`; 1 falha de "sem erros de console" em mobile-chrome (CSP de terceiro framing `google.com`, nada a ver com o componente) confirmada **transiente** via reexecução isolada (passou limpo); resultado líquido 5 passed + 2 skips justificados

### `layout/scroll-progress` — concluído

Nonagésimo segundo standalone.

- **Gate 5, gap real de a11y**: barra de progresso de leitura sem nenhuma semântica ARIA — corrigido com `role="progressbar"` + `aria-valuenow/min/max` + `aria-label`, mesmo padrão real já usado extensivamente em `Progress` (Super component confirmado verdadeiro, não absorção falsa)
- Gate 1 (limpeza): import order corrigido
- **Achado real no registry**: `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 9: `e2e/cn/layout/scroll-progress.spec.ts` novo (3 testes: crash/console/`aria-valuenow` atualiza ao rolar o container-alvo) — teste de scroll bate na pendência sistêmica 0b em mobile-chrome, `test.skip(isMobile, ...)`; 5 passed + 1 skip justificado

### `inputs/search-input` — concluído

Nonagésimo terceiro standalone.

- **Gate 1, bug real de estrutura**: `SearchInputProps`/`SearchInputSize` inline no `.tsx` — extraído pro `search-input.types.ts`, `index.ts` atualizado
- Gate 2/3: `text-[0.8125rem]` cru (banido) no size `sm` → `text-body-callout`, confirmado via precedente real do `Input` CN (o `sm` do Input também usa `text-body-callout`, a escala de tipografia não encolhe entre sm/md — só altura/padding mudam); `text-[0.6875rem]` do hint de atalho documentado como micro-label abaixo do mínimo da escala
- **Gate 5, gap real de a11y**: `<input>` sem `aria-label` — dependia só do `placeholder`, que funciona como nome acessível apenas até o usuário digitar (em alguns navegadores o cálculo de accessible-name muda depois que o valor deixa de estar vazio). Adicionado `aria-label={placeholder}` como fallback estável
- **Sem achado no `shortcut`**: confirmado que é só hint visual mesmo, documentado como tal no registry ("atalho de teclado **exibido**") — a aplicação consumidora é responsável por registrar o listener global de verdade; não é feature morta, é escopo correto
- **Achados reais no registry**: `placeholder` documentado com default `'Buscar...'` (português, com reticências ASCII), componente usa `'Search…'` (inglês, com `…` unicode) de verdade — corrigido; `style` (real) ausente — corrigido + `registry:build`
- Gate 9: `e2e/cn/inputs/search-input.spec.ts` novo (4 testes: crash/console/nome acessível estável depois de digitar/Clear limpa o campo) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada

### `inputs/signature-pad` — concluído

Nonagésimo quarto standalone.

- **Achado grave, bug de tema real (confirmado por inspeção lógica, não visual)**: o traço da assinatura era `strokeStyle = color ?? "oklch(95% 0.01 0)"` — um literal quase-branco **fixo**, independente do tema. Como `backgroundColor` (default `"transparent"`) deixa o canvas revelar o fundo real da página por trás, no **modo claro** a tinta quase-branca ficava sobre um fundo claro — assinatura praticamente invisível. Corrigido lendo `--ks-text` computado em tempo real a cada traço (`getComputedStyle(canvas).getPropertyValue('--ks-text')`), já que `strokeStyle` do canvas 2D exige string literal e não aceita `var()` do CSS — acompanha o tema automaticamente porque é recalculado a cada `mousedown`/`mousemove`
- **Achado de tooling, grave — quase virou regressão não detectada**: ao escrever o fix acima, `color ?? getComputedStyle(...) || "currentColor"` (sem parênteses) é erro de sintaxe real (`??` não pode se misturar com `||` sem parênteses) — só apareceu quando o Playwright tentou abrir a página de verdade (erro 500 do dev server via SWC/webpack); **nem `tsc --noEmit` nem `eslint` acusaram nada**, ambos aceitaram o arquivo como válido. Corrigido com parênteses explícitos (`color ?? (... || "currentColor")`); lição documentada na seção de regras operacionais — daqui pra frente, qualquer `??` misturado com `||`/`&&` precisa ser conferido rodando a página de verdade, não só lint/typecheck
- Gate 1 (limpeza): `getCtx` virou `useCallback` (fechava sobre `color`/`lineWidth` sem memoização, causando o warning real de `react-hooks/exhaustive-deps` no `onMove` que dependia dele)
- **Sem achados de contraste real**: `text-faint/30` do placeholder "Sign here" confirmado como exceção válida — já é `aria-hidden="true"` (decorativo) e cumpre o mesmo papel de um `<input placeholder>` nativo, que é convencionalmente de baixo contraste por design; não é o mesmo caso do `PriceTable` (lá não havia nenhum outro sinal visual pra informação essencial)
- **Observação registrada, não corrigida**: `readOnly` desabilita a interação corretamente, mas não existe nenhuma prop pra alimentar o canvas com uma assinatura já existente pra exibição — o modo "somente visualização" hoje só produz um canvas vazio. Não é prop morta (o código faz exatamente o que descreve), mas é uma lacuna de utilidade prática; ficaria pendente adicionar algo como `value`/`image` numa sessão futura se isso for considerado prioritário
- **Achados reais no registry, 5 partes**: `height` documentado com default `200`, real é `160`; `color` documentado com default `'#000000'`, real é `undefined` (acompanha o tema); `backgroundColor` documentado com default `'#ffffff'`, real é `'transparent'`; `saveLabel`/`clearLabel`/`placeholder`/`style` (todos reais) ausentes do registry — corrigido tudo + `registry:build`
- Gate 9: `e2e/cn/inputs/signature-pad.spec.ts` novo (4 testes: crash/console/desenhar habilita Save + Clear reseta/cor do traço não fica fixa) — 1ª rodada: todos os 8 falharam com erro 500 (o bug de sintaxe `??`/`||` acima, achado ao vivo pelo Playwright); depois do fix, 1 falha isolada em mobile-chrome no teste de desenho (mouse sintético não dispara `mousedown` no canvas espremido pela pendência sistêmica 0b), corrigida com `test.skip(isMobile, ...)`; 7 passed + 1 skip justificado, `EXIT:0`

### `feedback/status-page` — concluído

Nonagésimo sexto standalone. Já tinha um `rounded-[--radius]` corrigido numa sessão anterior (sweep de sintaxe `-[--var]`), mas nunca tinha passado pelos 9 gates formalmente.

- **Achado grave, feature anunciada nunca implementada**: registry documentava `overallStatus` como "calculado automaticamente se omitido", mas o componente só tinha um default estático `"operational"` — nenhum código de cálculo existia em lugar nenhum. Implementado de verdade: `computeOverallStatus()` percorre todos os grupos/serviços e retorna o pior status por severidade (`outage` > `degraded` > `maintenance` > `operational`)
- **Gate 2, achado real**: label do grupo (ex: "Core Services") usava `opacity-60` cru sobre `text-foreground` — mas o nome do grupo é informação primária de navegação, não decorativa; regra de ouro do `text-faint`/diluição ad-hoc do CLAUDE.md pede `text-muted`, mesma categoria já corrigida no `PriceTable`. Corrigido
- Gate 5, de passagem: dots decorativos de status (overall + por serviço) sem `aria-hidden="true"` — o texto ao lado já anuncia o status por extenso, os dots são só reforço visual de cor. Adicionado nos dois
- Gate 1 (limpeza): `import React from "react"` morto (nunca referenciado em runtime) removido
- Gate 3: `px-4 py-8`/`gap-4`(×2)/`mb-8`/`mb-2`/`px-3 py-1.5`/`gap-2`/`pt-1`/`mt-0.5`/`gap-1.5` (todos match exato) → tokens de spacing; `px-5`/`py-3.5` (linha de serviço) documentados sem match exato
- **Achados reais no registry**: `title` documentado com default `undefined`, real é `'System Status'` — corrigido; `overallStatus` com a descrição da feature morta acima corrigida pra refletir o cálculo real; `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 8: showcase só exercitava `overallStatus` explícito — adicionada 2ª instância omitindo a prop, pra provar o cálculo automático recém-implementado
- Gate 9: `e2e/cn/feedback/status-page.spec.ts` novo (4 testes: crash/console/grupos e serviços renderizam/`overallStatus` omitido calcula "degraded" automaticamente) — teste de conteúdo bate na pendência sistêmica 0b em mobile-chrome, `test.skip(isMobile, ...)`; 7 passed + 1 skip justificado

### `inputs/step-form` — concluído

Nonagésimo sétimo standalone.

- **Gate 5, achado real**: passo ativo do indicador de progresso não tinha `aria-current="step"` — valor de `aria-current` definido especificamente pra esse caso (processo multi-etapa) na própria spec ARIA, nunca usado. Adicionado, junto com `role="list"`/`role="listitem"` no header de progresso pra dar estrutura semântica real a um conjunto de passos
- Gate 2 (consistência, não bug de token): o conector entre os círculos de passo usava `style={{ background: ... }}` com `var()` cru, enquanto TODO o resto do arquivo já usa `bg-success`/`bg-rule` via classe pro mesmo conceito — inconsistente, trocado pra classe também
- Gate 1 (limpeza): emoji 🎉 da tela de sucesso sem `aria-hidden` — adicionado
- Gate 3: `px-6 py-4`(×2)/`gap-2`/`gap-1.5`/`px-6 py-6`/`mb-1`/`mb-4`/`mt-3`/`gap-3` (todos match exato) → tokens de spacing; `p-10` (tela de sucesso) documentado sem match exato
- **Achado real no registry**: `className`/`style` (reais) ausentes — corrigido + `registry:build`
- **Achado no showcase**: conteúdo de exemplo do passo "Account"/"Profile" usava `<input>`/`<textarea>` crus reinventando `Input`/`Textarea` CN (inclusive com `focus:border-patina/60`, opacidade ad-hoc já banida) — trocado pelos componentes reais; demo também nunca exercitava `validate` de verdade (só passos sem validação) — adicionado `validate` real no passo "Account" (email obrigatório, com estado controlado) pra testar o caminho de erro de fato
- Gate 9: `e2e/cn/inputs/step-form.spec.ts` novo (5 testes: crash/console/`validate` bloqueia e mostra erro/`aria-current=step` + avança depois de preencher/fluxo completo até "All done!") — 1ª rodada achou 2 bugs reais **de teste**: clique duplo em sequência muito rápido no botão "Next →" pegava o botão em transição de layout (corrigido esperando o texto do próximo passo entre cliques) e `getByText("All done!")` colidia com o painel de código-fonte da própria página (mesmo texto aparece no `<p>` renderizado e no snippet do componente) — corrigido escopando ao `frame` com `exact: true`; 3 testes de interação batem na pendência sistêmica 0b em mobile-chrome, `test.skip(isMobile, ...)`; 7 passed + 3 skips justificados

### `feedback/stopwatch` — concluído

Nonagésimo oitavo standalone.

- **Achado grave, bug funcional real**: `reset()` sempre voltava `elapsed` pra `0` absoluto, ignorando `initialTime` — um consumidor que configura um tempo inicial (ex: contagem com "cabeça de largada") via `initialTime={30000}` via clicar Reset perdia esse valor de configuração, indo pra `00:00` em vez de voltar pro `00:30` configurado. Corrigido: `reset()` volta `baseRef`/`elapsed` pra `initialTime`, e o botão Reset fica `disabled` quando `elapsed === initialTime` (antes comparava só com `0` cru)
- Gate 5, de passagem: lista de laps sem `role="list"`/`role="listitem"` — adicionado (mesmo padrão de estrutura semântica aplicado no `StepForm` minutos antes)
- Gate 3: `gap-4`/`gap-2`/`px-4 py-2` (todos match exato) → tokens de spacing
- **Achado real no registry**: `maxLaps` documentado com default `undefined`, real é `20`; `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 8: showcase só exercitava `initialTime` default (0) — adicionada 2ª instância com `initialTime={30000}` pra provar o fix do Reset
- Gate 9: `e2e/cn/feedback/stopwatch.spec.ts` novo (4 testes: crash/console/Start-Lap-Reset zera de volta/Reset volta pro `initialTime` configurado) — 2 testes de interação bateram na variante "sidebar intercepta clique" da pendência sistêmica 0b em mobile-chrome, `test.skip(isMobile, ...)`; 6 passed + 2 skips justificados

### `inputs/survey-form` — concluído

Nonagésimo nono standalone.

- **Achado grave, bug funcional real**: `required` só desenhava o asterisco vermelho no label — nenhum tipo de pergunta além de `text`/`textarea` (via atributo HTML nativo) de fato bloqueava o envio se ficasse sem resposta. Uma pergunta `radio`/`checkbox`/`scale`/`rating` marcada como obrigatória podia ser enviada completamente em branco. Implementado `isAnswered()` por tipo + validação real no `handleSubmit`, bloqueando o envio e mostrando "This question is required." por pergunta
- **Achado real de conflito, encontrado só ao testar o fix acima**: o atributo HTML `required` nativo no `<Input>`/`<Textarea>` colidia com a validação customizada nova — o navegador bloqueia o evento `submit` **antes** do `onSubmit` do React disparar, então a pergunta de texto nunca chegava a aparecer no fluxo de erro unificado (só o popup nativo do browser, silenciosamente, pra só uma pergunta por vez). Removido o `required` nativo dos dois, já que a validação customizada agora cobre os 5 tipos de forma consistente
- **Gate 4, reaproveitamento real**: tipo `rating` reinventava estrelas customizadas (`<button>` soltos, `"★"/"☆"` cru sem `aria-label`) duplicando o `Rating` CN — que já foi validado nesta mesma auditoria (`inputs/rating`, com fix real de a11y incluso) — trocado pelo componente de verdade
- **Gate 5, achado real**: tipo `scale` (botões numéricos de escolha única) não tinha nenhuma semântica de grupo — corrigido com `role="radiogroup"` no container + `role="radio"`/`aria-checked` em cada botão (mantido como `<button>` custom, não `RadioGroup`, porque visualmente é uma escala numérica em grade, não uma lista de rádios com label — mesmo raciocínio de "forma bespoke" já usado pro `Fab`/`QuickActions`)
- Gate 3: `mb-[6px]`/`ml-[2px]`/`gap-6`/`gap-2`(×2)/`gap-[6px]` (todos match exato) → tokens de spacing; `mb-7`/`mt-7` documentados sem match exato
- **Achado real no registry**: `className`/`style` (reais) ausentes — corrigido + `registry:build`
- Gate 8: nenhuma pergunta da demo era `required` (a feature nunca era exercitada) — marcadas `name` e `role` como `required: true`
- Gate 9: `e2e/cn/inputs/survey-form.spec.ts` novo (6 testes: crash/console/`required` bloqueia e mostra 2 erros/preencher permite enviar/`scale` com `aria-checked`/`rating` usa o `Rating` real) — 1ª rodada achou o próprio bug do `required` nativo (0 erros mostrados em vez de 2, o teste denunciou o conflito antes de eu corrigir); 2ª rodada achou bug de teste (clique no `<input>` `sr-only` do `Radio` era interceptado pelo `<span>` decorativo por cima — corrigido clicando no label visível "Developer" em vez do input escondido); demais falhas (timeout de `page.goto` sob 8 workers simultâneos) confirmadas transientes via reexecução com `--workers=2`; resultado final 8 passed + 4 skips justificados (pendência 0b variante "sidebar intercepta clique")

### `display/swipe-card` — concluído

Centésimo standalone. **Achado mais grave de toda a auditoria até aqui.**

- **Achado gravíssimo — componente e seu próprio tipo/registry/showcase publicados nunca bateram**: `SwipeCard.tsx` estava implementado internamente contra um modelo de dados (`item.title`/`item.subtitle`/`item.image`/`item.content`, callbacks `onSwipe`/`onEmpty`, threshold hardcoded em 80px) **completamente diferente** do que `swipe-card.types.ts`, o **registry publicado** (`npx kikitocn add swipe-card` documenta `{id, children}` + `onSwipeLeft`/`onSwipeRight` + `threshold`) e o **próprio showcase** (que já consumia a API documentada) esperavam. Resultado real pra qualquer consumidor seguindo a API oficial: cards completamente vazios (`children` nunca era renderizado) e `onSwipeLeft`/`onSwipeRight` que **nunca disparavam** (o componente chamava props que não existem no tipo). **Nem `tsc --noEmit` nem `eslint` acusaram** — confirmado empiricamente com uma reprodução isolada (`_zztest.tsx` descartável) que desestruturar props ausentes do tipo declarado num parâmetro de função, nesta config de projeto, não gera erro de tipo; achado só foi possível lendo o código e cruzando com registry/demo, não com nenhuma ferramenta automatizada. Corrigido: reescrito `SwipeCard.tsx` pra implementar o contrato de verdade — renderiza `item.children`, chama `onSwipeLeft`/`onSwipeRight` com o `id`, usa o `threshold` configurável (default 100, batendo com o registry) em vez do 80 hardcoded
- **Achado real correlato**: `useState(items)` só inicializa uma vez no mount — mudar a prop `items` depois (ex: o botão "Reset stack" da própria demo) nunca resincronizava o baralho interno. Corrigido com um `useEffect(() => setStack(items), [items])`
- Gate 5, de passagem: botões "✕"/"✓" sem `aria-label` (só o glifo cru como nome acessível) → `aria-label="Skip"`/`"Keep"`; cards de trás no baralho (visualmente obscurecidos pelo topo) sem `aria-hidden` — conteúdo arbitrário de `children` continuava alcançável fora de ordem; adicionado `aria-hidden={!isTop}`. Interação de swipe já era 100% operável por teclado via esses dois botões reais — diferente da maioria dos componentes de drag já corrigidos nesta auditoria, aqui nunca houve "zero alternativa"
- Gate 2: `shadow-md` (nativo, ambíguo entre o `shadow-sm` confirmado aceito e o `shadow-lg` confirmado banido) → alinhado à convenção literal já dominante pra cards elevados; `hover:bg-X/10` dos botões documentado como exceção válida (realce de hover num botão circular pequeno, mais claro que qualquer `-soft` existente ficaria)
- Gate 3: `top-4 left-4`/`top-4 right-4`/`px-2 py-0.5`/`gap-4` (todos match exato) → tokens de spacing
- Gate 1 (limpeza): container de drag sinalizado por `jsx-a11y/no-static-element-interactions` documentado com `eslint-disable-next-line` (mesmo padrão de `ImageCropper`/`ImageCompare`/`PinBoard`)
- **Achado real no registry**: `style` (real) ausente — corrigido + `registry:build`
- **Achado de tooling documentado**: confirmado ao vivo que uma aba do Browser pane pode ficar presa servindo JS/render **cliente** obsoleto entre reinícios do dev server mesmo depois de `rm -rf .next` e reiniciar limpo — `curl` direto no servidor provou que o HTML servido já estava correto o tempo todo; abrir uma aba nova não resolveu sozinho (o Playwright, com contexto de browser genuinamente novo, confirmou o fix normalmente). Lição: quando o Browser pane mostrar algo que não bate com o código-fonte confirmado, checar via `curl` direto antes de assumir que o fix está errado
- Gate 9: `e2e/cn/display/swipe-card.spec.ts` novo (5 testes: crash/console/card do topo renderiza `children` de verdade/Skip dispara `onSwipeLeft` e traz o próximo/Reset stack devolve o baralho) — 10/10 chromium-desktop + mobile-chrome, direto na primeira rodada

### `display/terminal-block` — concluído

Centésimo primeiro standalone. Já tinha o `bg-[#0d1117]` documentado e um `text-sm` corrigido numa sessão anterior (sweep de hex cru), mas nunca tinha passado pelos 9 gates formalmente.

- **Gate 1, bug real de estrutura**: `TerminalLineType`/`TerminalLine`/`TerminalBlockProps` inline no `.tsx` — extraído pro `terminal-block.types.ts`, `index.ts` atualizado; de passagem, achado e corrigido um `import("...").TerminalLine` no showcase que apontava pro caminho antigo (`TerminalBlock.tsx`, que não exporta mais o tipo depois da extração) — quebraria silenciosamente se não fosse checado
- **Gate 2, achado real**: `text-faint/80` no texto de "output" (o conteúdo primário de um transcript de terminal, não decoração) → `text-muted`, regra de ouro do `text-faint` já aplicada em vários outros componentes; `bg-X/70` dos "traffic lights" (imitação dos controles de janela do macOS) e `bg-foreground/60` do cursor piscante documentados como exceções válidas (sem `-soft` equivalente que sirva pra esses tamanhos/contextos)
- **Achado grave de a11y, não catalogado antes nesta auditoria**: a animação de "digitação" via `setInterval` nunca checava `prefers-reduced-motion` — além do aspecto puramente visual, ela também **atrasava a chegada do conteúdo completo no DOM** pra quem usa leitor de tela (linhas além de `visibleCount` não existiam ainda; um transcript inteiramente conhecido de antemão ficava artificialmente escondido atrás de um timer de `180ms × N linhas`, sem nenhum motivo — não é dado ao vivo). Implementado `usePrefersReducedMotion()` (via `matchMedia`) que desliga a animação e revela tudo de imediato quando o usuário pediu movimento reduzido
- Gate 3: `gap-1.5`/`px-4`(título e corpo)/`py-4`/`space-y-1`/`mr-1.5` (todos match exato) → tokens de spacing; `py-2.5` documentado sem match exato
- **Achados reais no registry**: `title` documentado com default `'terminal'` (minúsculo), real é `'Terminal'`; `style` (real) ausente — corrigido + `registry:build`
- Gate 9: `e2e/cn/display/terminal-block.spec.ts` novo (4 testes: crash/console/linhas aparecem sem animação/com `prefers-reduced-motion` o conteúdo completo aparece de imediato mesmo com `animate`) — achado de tooling: `page.reload()` não reaplicava a emulação de `prefers-reduced-motion` de forma confiável nesta versão do Playwright, enquanto `page.goto()` fresco funcionava — confirmado com um teste diagnóstico isolado antes de assumir que o componente estava errado (o componente já funcionava corretamente: `matchMedia` batia `true` e as 5 linhas apareciam de imediato); demais falhas de mobile-chrome bateram na pendência sistêmica 0b, `test.skip(isMobile, ...)`; 6 passed + 2 skips justificados

### `inputs/text-editor` — concluído

Centésimo segundo standalone. Só tinha passado por um fix pontual de `rounded` bare numa sessão anterior (sweep de infraestrutura), nunca formalmente pelos 9 gates.

- **Gate 1, bug real de estrutura**: sem `.types.ts` — `TextEditorProps` inline no `.tsx`, contra a regra. Extraído pro novo `text-editor.types.ts` (com `ariaLabel` adicionado), `index.ts` atualizado.
- **Gate 2/3, achado grave**: `prose prose-invert max-w-none` aplicado na área editável — mas o projeto **não tem `@tailwindcss/typography` instalado** (confirmado via `package.json`/`tailwind.config.ts`, nenhuma referência ao plugin). As duas classes eram **classes mortas, sem efeito nenhum**: todo conteúdo rico gerado pelo `execCommand` (`<h2>`, `<ul>`/`<ol>`, `<strong>`/`<em>`/`<s>`) renderizava só com o UA stylesheet padrão do browser — fora da escala de tokens de tipografia/spacing/cor por completo (heading sem `text-heading-05`, listas sem os tokens de indentação, etc.), invisível em qualquer leitura superficial do componente porque as classes _pareciam_ fazer algo. Corrigido substituindo por seletores `[&_h2]:`/`[&_ul]:`/`[&_ol]:`/`[&_li]:`/`[&_strong]:`/`[&_em]:`/`[&_s]:`/`[&_p]:` explícitos, todos usando tokens (`text-heading-05`, `--spacing-*`).
- **Gate 5, achados reais de a11y**:
  - `outline-none` na área editável sem nenhum substituto — foco ficava completamente invisível ao navegar por teclado. Corrigido movendo o ring pro wrapper (`focus-within:border-patina` + `focus-within:shadow-[...]`), mesmo padrão de `Input`/`Textarea` CN.
  - Área `contentEditable` sem `role`/nome acessível algum — adicionado `role="textbox"` `aria-multiline="true"` `aria-label={ariaLabel ?? placeholder}` `aria-disabled` `tabIndex={disabled ? -1 : 0}` (o último pro lint `jsx-a11y/interactive-supports-focus`, contentEditable já é focável nativamente no browser mas o role explícito exige tabIndex explícito também).
  - Nenhum feedback visual/aria indicava se o cursor estava dentro de um trecho já em negrito/itálico/etc — toolbar parecia sempre "inativa". Implementado `queryCommandState()` reavaliado em `onKeyUp`/`onMouseUp`/`onFocus`/depois de cada `exec()`, refletido em `aria-pressed` nos botões toggle (bold/italic/underline/strikeThrough/lists — `formatBlock` fica de fora, não é toggle real) + destaque visual (`bg-patina-soft`) quando pressed.
  - `text-faint` nos botões do toolbar (label é o único indicador do comando, não decoração) → `text-muted`, regra de ouro do `text-faint` de novo.
- **Gate 4**: toolbar reescrito pra usar `<Button>` CN (`variant="ghost" intent="neutral" size="xs"`) em vez de `<button>` cru — primeiro achado desse tipo específico no grupo `inputs` (toolbar de rich-text).
- **Achado real no registry**: `minHeight` documentado com default `200`, real é `140`; `ariaLabel` e `style` (reais) ausentes — corrigido + `registry:build` (detectou `registryDeps: [button]` automaticamente pelo novo import).
- Showcase: só tinha 1 variação (`Default`) — adicionado `Disabled` (Gate 8 exige 2+).
- Gate 9: `e2e/cn/inputs/text-editor.spec.ts` novo (5 testes: crash/console/role=textbox com nome acessível/Bold aplica `aria-pressed`/disabled bloqueia edição e toolbar) — 7 passed + 3 skips (pendência 0b mobile) em chromium-desktop + mobile-chrome; firefox-desktop falhou por binário ausente na máquina (`firefox-1532` nunca instalado via `npx playwright install`), ambiental, já documentado como não-bloqueante desde `display/tabs`.

### `display/theme-selector` — concluído

Centésimo terceiro standalone. Só tinha passado por um fix pontual de `rounded-[--radius]` numa sessão anterior.

- **Gate 5, achado real**: nenhum `aria-pressed` no botão de cada tema — a seleção só era comunicada visualmente (borda + checkmark), invisível pra leitor de tela. Corrigido com `aria-pressed={isSelected}`; checkmark decorativo (`✓`, redundante com o `aria-pressed` depois do fix) marcado `aria-hidden="true"`.
- Gate 2: `hover:border-[var(--ks-primary)]` (bracket cru, inconsistente com `border-patina` já usado 2 linhas acima no mesmo arquivo pro estado selecionado) → `hover:border-patina/60`. Swatch de cor com `style={{ background: c }}` documentado como exceção válida (preview real das cores do tema, dado dinâmico arbitrário — não paleta do design system).
- Gate 3: `gap-2`/`px-3`/`py-2` (container e botão, todos match exato) → tokens de spacing; `gap-[2px]` do grid de swatches bate exato com `--spacing-3xs` (0.125rem = 2px) → `gap-(--spacing-3xs)`.
- Gate 4: `<button>` cru mantido — mesmo padrão já estabelecido em `ColorPicker` pra swatch-buttons de formato bespoke (cor + label + checkmark não cabem no layout do `Button` CN sem forçar API alheia).
- **Achado real no registry**: `style` (real) ausente → adicionado + `registry:build`.
- Gate 9: `e2e/cn/display/theme-selector.spec.ts` novo (3 testes: crash/console/clicar seleciona e reflete `aria-pressed` nos dois lados) — 5/5 chromium-desktop + mobile-chrome. Um flake isolado no teste de console (CSP `frame-ancestors` bloqueando um iframe pra `google.com`, nada relacionado ao componente) não reproduziu em 2 reruns isolados — mesma categoria de "contenção de cold-start" já documentada nesta auditoria, não um bug real.

### `display/user-card` — concluído

Centésimo quarto standalone. Nunca tinha sido tocado por nenhuma sessão anterior.

- **Gate 2, achado real**: badge (`bg-[color-mix(in_srgb,var(--ks-primary)_15%,transparent)] text-patina text-[0.625rem] rounded-[4px]`) reimplementava à mão, com valor cru, exatamente o que o token `bg-patina-soft`/`text-patina-soft-fg` já faz (confirmado no `kikitocn-tokens.css`: `--ks-patina-soft` já é esse `color-mix`) → substituído por `<Badge intent="primary" variant="soft" size="sm">` (Gate 4 na mesma tacada).
- **Gate 4, achado real**: botão "Follow"/"Following" era um `<button>` cru com paleta manual (`bg-patina`/`border-patina`) e **sem nenhum estado de hover** → `<Button intent="primary" variant={followed?"solid":"outline"} size="sm" rounded="full">` CN, ganhando hover de graça.
- **Achado real de robustez**: `<img>` do avatar não tinha `onError` — uma URL de avatar quebrada mostrava o ícone de imagem-quebrada do browser em vez de cair pros iniciais (o próprio `avatarFallback`/`name` já existiam pra esse propósito, só não eram usados nesse caso). Corrigido com `useState` + `onError` (mesmo padrão do `Avatar.tsx`).
- Gate 2, ad-hoc opacity (achado recorrente já catalogado várias vezes nesta auditoria): `opacity-40` no username e no label de cada stat (ambos metadado secundário, não conteúdo primário) → `text-faint`; `opacity-55` na bio (conteúdo mais substancial que metadado, mas ainda secundário) → `text-muted`.
- Gate 3: `mb-3`/`mt-2`/`mt-1`/`mt-[2px]`/`gap-[2px]` (todos match exato) → tokens de spacing; `tracking-[0.05em]` tem classe nativa exata do Tailwind (`tracking-wider`) → trocado; `leading-[1.6]` → `leading-relaxed` (1.625, mais próximo listado no Gate 3); `rounded-[16px]` do container sem match exato (entre `lg`=14 e `xl`=20) → `rounded-lg` documentado; `px-5`/`pb-5`/`gap-5`/`mt-[14px]`/`pt-[14px]` sem match exato na escala de spacing (steps 5 e 3.5 não fazem parte da âncora) → documentados com comentário, mantidos como estão.
- Gate 4, avaliado e mantido como exceção: avatar continua bespoke (ring `border-raised` sobre o cover + iniciais com paleta de marca fixa) em vez de `<Avatar>` CN — `Avatar` sempre tinge por hash do nome, API sem override de cor; forçar o encaixe mudaria a identidade visual pretendida (branding fixo, não cor por usuário).
- **Achado real no registry**: `stats` sem `default: "[]"` documentado; `style` (real) ausente — corrigido + `registry:build` (detectou `registryDeps: [badge, button]` automático).
- Gate 9: `e2e/cn/display/user-card.spec.ts` novo (4 testes: crash/console/Follow alterna pra Following/badge+stats aparecem) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada, sem hit na pendência 0b.

### `display/video-card` — concluído

Centésimo quinto standalone. Nunca tinha sido tocado por nenhuma sessão anterior.

- **Achado grave real, categoria já recorrente nesta auditoria**: `src` (documentado em `video-card.types.ts` **e** no registry como `"URL do vídeo"`) nunca era lido em lugar nenhum do componente — o card era só um link estático pro `poster`, `src` não fazia absolutamente nada. Implementado como preview mudo em hover (padrão comum de video-card: `<video muted autoPlay loop playsInline>` substitui o poster enquanto o mouse está sobre a thumbnail), desligado automaticamente se o usuário pediu `prefers-reduced-motion` (mesmo hook já usado em `TerminalBlock`).
- Gate 2: `hover:shadow-md` (nativo, banido) → alinhado à convenção literal já dominante pra cards elevados (`shadow-[0_8px_24px_color-mix(...)]`).
- Gate 4: badge de categoria (`bg-patina text-patina-fg` cru, posicionado absoluto) reimplementava exatamente `Badge intent="primary" variant="solid"` → substituído (badge de duração mantido bespoke — chip translúcido monoespaçado sobre a thumbnail não é um badge de intent semântico, categoria visual diferente).
- Gate 5: os dois glifos "▶" (fallback sem poster e overlay de play) eram puramente decorativos (nenhuma informação além do que o título já comunica) mas sem `aria-hidden` → adicionado nos dois; preview em vídeo também marcado `aria-hidden`+`tabIndex={-1}` (decorativo, o card inteiro já é o elemento navegável via `href`).
- Gate 3: `top-2`/`left-2`/`bottom-2`/`right-2`/`px-1.5`/`py-0.5`/`px-2`/`p-3`/`gap-1`/`mt-0.5` (todos match exato) → tokens de spacing. `text-foreground/20` do glifo de fallback documentado como exceção válida (preenchimento decorativo grande, sem `-soft` que sirva pra esse tamanho/contexto).
- **Achado real no registry**: `style` (real) ausente → adicionado + `registry:build` (`registryDeps: [badge]` automático); descrição de `src` atualizada pra refletir o comportamento de verdade.
- Showcase: só tinha 2 variações quase idênticas (poster+metadata completos) — adicionado card demonstrando o preview em hover (`src` real, vídeo CC0 do MDN) e um card sem `poster` (Gate 8 exige variação significativa, não só repetição de dados).
- Gate 9: `e2e/cn/display/video-card.spec.ts` novo (4 testes: crash/console/fallback sem poster/hover troca poster por `<video muted>`) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada.

### `data/virtual-list` — concluído

Centésimo sexto standalone. Já tinha um `jsx-a11y/no-noninteractive-tabindex` **error** real e ativo (achado como efeito colateral do fix do `ScrollArea` numa sessão anterior, nunca corrigido de fato).

- **Gate 5, achado grave confirmado (era erro de lint real, não warning)**: `tabIndex={0}` e `role="list"` no mesmo elemento — uma lista (`role="list"`) não é um widget focável, mas o viewport de scroll precisa ser alcançável via teclado (sem outro descendente focável). Resolvido restruturando: `tabIndex` fica no viewport de scroll (sem `role`, mesmo padrão já auditado em `ScrollArea` — `// eslint-disable-line jsx-a11y/no-noninteractive-tabindex` na mesma linha, com o comentário explicando o motivo), `role="list"` move pro spacer interno (semanticamente mais correto: a "lista" são os itens, não o scrollport). Resultado: **zero warnings/erros**, não só o error original resolvido.
- **Gate 5, achado real correlato**: `outline-none` sem nenhum substituto de foco → `focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-patina`, mesma convenção do `ScrollArea`; nenhuma forma de dar nome acessível ao viewport → nova prop `ariaLabel` (no elemento com `role="list"`, não no viewport — accessible name computation não herda de um ancestral).
- **Achado real de passagem no showcase**: `rounded-[--radius]` (mesmo bug de sintaxe bracket-cru-sem-var já fechado nesta auditoria pra outros 10 arquivos, mas essa ocorrência sobrou no showcase e nunca tinha sido pega pelo grep anterior porque é fora de `src/components/ui/cn`) → `rounded-(--radius-lg)`.
- **Achado real no registry**: `ariaLabel`, `className`, `style` (todos reais) ausentes → corrigido + `registry:build`.
- Showcase: só tinha 1 variação (1000 linhas, itemHeight 56) — adicionado uma segunda com `itemHeight` menor e `overscan={0}` (Gate 8 exige 2+).
- Gate 9: `e2e/cn/data/virtual-list.spec.ts` novo (4 testes: crash/console/`role="list"` com nome acessível + windowing real (< 30 nós renderizados de 1000 itens)/scroll troca a janela visível) — 6 passed + 2 skips (pendência 0b mobile). **Dois bugs de teste corrigidos ao longo do caminho, nenhum no componente**: nome duplicado por match parcial (`"Row list"` casava com `"Compact row list"` também — `exact: true` resolveu) e scroll aplicado no elemento errado (`role="list"` é o spacer interno que NÃO rola; o pai é o viewport de verdade com `overflow-y-auto` — `.locator("..")` resolveu).

### `display/window-frame` — concluído

Centésimo sétimo standalone. Só tinha sido verificado por um sweep raso de `curl` (200, sem crash) numa sessão anterior — nunca formalmente pelos 9 gates.

- **Achado gravíssimo no registry**: `variant` documentado como `'macos' | 'browser' | 'terminal'` — os valores reais do tipo são `'macos' | 'windows' | 'minimal'`. **`'browser'` e `'terminal'` não existem**: passar qualquer um deles (seguindo a própria documentação publicada) faz as três condições `variant === '...'` falharem silenciosamente, renderizando o componente **sem nenhum chrome**, só o `children` cru — nenhum erro, nenhum aviso, resultado visualmente errado sem pista do motivo. Corrigido a documentação pros três valores reais.
- **Gate 1, bug real de estrutura**: sem `.types.ts` — tipos inline no `.tsx`. Extraído pro novo `window-frame.types.ts`, `index.ts` atualizado; de passagem, `'use client'` removido (componente é 100% apresentacional, sem hook/handler nenhum — não precisa).
- **Gate 2, achado real**: traffic lights do `MacOsChrome` com hex cru (`#ff5f56`/`#ffbd2e`/`#27c93f`), sem exceção documentada — e inconsistente com o `TerminalBlock` (mesmíssimo padrão de "traffic lights", já usa tokens de intent nesta auditoria) → `bg-danger`/`bg-warning`/`bg-success`.
- **Gate 4/5, achado real**: os três botões de controle do `WindowsChrome` (`─`/`□`/`✕`) eram `<button>` reais **sem nenhum `onClick`** — afordância falsa: tab stop e "botão" anunciado pro leitor de tela que não faz absolutamente nada ao ativar. O próprio `MacOsChrome` ao lado já resolve o mesmo papel decorativo corretamente (`<span aria-hidden>` nos traffic lights) — downgrade pra manter os dois chromes consistentes entre si.
- Gate 3: `text-xs` (nativo, banido) nos botões do `WindowsChrome` → `text-body-caption`; `gap-3`/`px-4`/`gap-1.5`/`mx-4`/`px-3`/`py-1`/`py-2`/`pb-2` (todos match exato) → tokens de spacing; `py-2.5` documentado sem match exato (entre `md` e `lg`, já é o padrão adotado em outros componentes pro mesmo valor).
- **Achado real no registry**: `style` (real) ausente → adicionado + `registry:build`.
- Showcase: 3 variações já cobertas (macos/windows/minimal), mas nenhuma exercitava `url` — adicionado um quarto `Frame` com `url="https://kikito.dev"`.
- Gate 9: `e2e/cn/display/window-frame.spec.ts` novo (5 testes: crash/console/os 3 variantes reais renderizam/barra de URL aparece/chrome decorativo não expõe nenhum `<button>` falso) — 10/10 chromium-desktop + mobile-chrome, direto na primeira rodada.

### `display/word-counter` — concluído

Centésimo oitavo standalone. Nunca tinha sido tocado por nenhuma sessão anterior — componente já bem construído (reusava `Label`/`Textarea` CN de cara, Gate 4 praticamente de graça).

- **Achados reais no registry, 3 defaults errados na mesma entrada**: `rows` documentado `4`, real `5`; `showSentences` documentado `false`, real `true`; `showReadTime` documentado `false`, real `true` — os dois booleans documentados como desligados por padrão são, na real, ligados por padrão. `style` (real) também ausente. Todos corrigidos + `registry:build`.
- **Gate 5, achado real**: barra de progresso do limite (palavras/chars) sem `role="progressbar"`/`aria-value*` nenhum — puramente visual, invisível pra leitor de tela saber o quão perto do limite o texto está. Adicionado `role="progressbar"` + `aria-valuenow`/`aria-valuemin`/`aria-valuemax` + `aria-label` dinâmico (mesmo padrão já usado em `ScrollProgress`). Avaliado e descartado de propósito: `aria-live` no bloco de contadores — anunciaria a cada tecla digitada, mais ruído que ajuda; `Textarea` CN (`showCount`) já não usa isso, sem precedente pra adicionar aqui.
- Gate 2: `opacity-40` no label de cada stat (metadado secundário sob o valor) → `text-faint`, mesma categoria já catalogada várias vezes nesta auditoria; `tracking-[0.05em]` → `tracking-wider` (classe nativa exata).
- Gate 3: `gap-2`/`gap-4`/`gap-[2px]` (todos match exato) → tokens de spacing. `h-[3px]` da trilha da barra de progresso avaliado e mantido — é espessura visual própria do componente (like a espessura de um slider/progress ring), não spacing estrutural entre elementos, fora do escopo da regra.
- Showcase: já tinha 2 variações (com limite / sem limite) — nenhuma mudança necessária.
- Gate 9: `e2e/cn/display/word-counter.spec.ts` novo (4 testes: crash/console/digitar atualiza contagem + `aria-valuenow`/ultrapassar limite marca `text-danger`) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada.

**Fila original da sessão (text-editor → word-counter) concluída — todos os 7 componentes validados.**

### `inputs/password-input` — concluído

Centésimo nono standalone. **Primeiro componente validado fora da fila original desta sessão** — a fila original (text-editor → word-counter) terminou; auditoria de cobertura completa (`grep` de todo `docs/AUDITORIA-CN-STATUS.md` contra `ls src/components/ui/cn/`) achou **37 componentes nunca mencionados no documento**. Dos 37, a maioria já está coberta por absorção confirmada verdadeira em Super components (`Modal`, `Command`, `Tooltip`, `Input`, `Button` — ver pendência 0) — o subconjunto genuinamente sem cobertura: `audio-waveform`, `banner`, `bento-grid`, `card-stack`, `carousel`, `code-block`, `code-diff`, `comparison-table`, `image-viewer`, `password-input`, `sparkline`, `status-badge`. `password-input` escolhido primeiro por já estar confirmado como **não absorvido** pelo `Input` (pendência 0: "Input(...SEM password/search)").

- **Gate 1, bug real de estrutura**: sem `.types.ts` — tipos inline no `.tsx`. Extraído pro novo `password-input.types.ts`.
- **Gate 5, achado real**: `<input>` sem `aria-invalid`/`aria-describedby` nenhum — hint/mensagem de erro existiam visualmente mas nunca eram associados ao campo pra leitor de tela (compare com `Input` CN, que já faz essa ligação corretamente). Corrigido com `aria-invalid={invalid}` + `aria-describedby` apontando pro id do hint ou do erro.
- **Gate 5, achado real correlato, mesmo padrão já resolvido no componente irmão `PasswordStrength`**: medidor de força mudava visualmente a cada tecla digitada mas nenhum leitor de tela era avisado (foco fica no campo de senha, não no medidor). Replicado o padrão exato já usado em `PasswordStrength.tsx` — `role="progressbar"` + `aria-valuemin/max/now` + `aria-valuetext` + `aria-live="polite"` no wrapper, `aria-hidden` nas 4 barras e no label textual (evita anúncio duplicado, já que `aria-valuetext` já carrega o mesmo texto).
- Gate 2: `text-[0.8125rem]` (tamanho `sm`) sem match exato — alinhado à convenção do `Input` CN irmão, que usa `text-body-callout` pro próprio tamanho `sm`; `text-[0.6875rem]` do label de força documentado como exceção válida (abaixo do mínimo da escala, micro-label). `pr-9`/`pr-10`/`pr-11` e `right-2`/`right-2.5`/`right-3` mantidos como escala própria do componente (cálculo pareado com o tamanho do botão de olho, mesmo padrão do próprio `Input.tsx`).
- Gate 3: `gap-1.5`/`gap-1` (match exato) → tokens de spacing.
- Gate 4: botão de olho mantido bespoke — mesmíssimo elemento (ícone + `tabIndex={-1}`) já usado no `revealable` do `Input` CN, não uma reinvenção.
- **Achado real no registry**: `id` e `style` (reais) ausentes → adicionados + `registry:build`.
- Showcase: já tinha 3 variações (default/strength meter/invalid) — nenhuma mudança necessária.
- Gate 9: `e2e/cn/inputs/password-input.spec.ts` novo (5 testes: crash/console/toggle show-hide/medidor com `aria-valuetext`/invalid com `aria-describedby` resolvendo pro texto certo) — 10/10 chromium-desktop + mobile-chrome. Um bug de teste corrigido no caminho (3 demos na mesma página compartilham o mesmo `aria-label` "Show password" — `getByRole` sem escopo colidia; resolvido escopando ao wrapper do input via `.locator("..")`).

### `display/status-badge` — concluído

Centésimo décimo standalone. Segundo componente da nova fila de cobertura (37 nunca mencionados, ver seção `password-input` acima) — confirmado como implementação paralela real de `Badge` (não absorvido, pendência 0: `badge`→`tag`/`status-badge`/`ping` confirmado falso).

- **Gate 5, achado grave real**: o dot de status comunicava Online/Busy/Away/etc **só por cor**, sem nenhuma alternativa textual quando `showLabel={false}` (o próprio default do componente!) — falha clássica de WCAG 1.4.1 (uso de cor como único meio). O componente irmão `Avatar.tsx` já resolve o mesmíssimo padrão de dot-de-status corretamente (`role="img"` + `aria-label`) — `StatusBadge` nunca teve isso. Corrigido: dot ganha `role="img"` + `aria-label={LABELS[status]}` quando `showLabel` é falso; quando `showLabel` é verdadeiro, o dot vira `aria-hidden` (o texto visível ao lado já cobre a informação, evita anúncio duplicado).
- **Gate 2, achado real**: cor do dot vinha de `style={{ background: 'var(--ks-...)' }}` — mas `status` é um enum fixo de 5 valores conhecidos em build-time, não uma cor arbitrária/dinâmica (diferente do caso do `ThemeSelector`/`Avatar` por hash de nome, onde CSS var é genuinamente necessário). Tailwind alcança direto aqui. Convertido pra classes estáticas (`bg-success`/`bg-faint`/`bg-danger`/`bg-warning`/`bg-info`), mesmo padrão já usado no `STATUS_COLOR` do `Avatar.tsx` pro idêntico conceito.
- Gate 3: `gap-1.5` (match exato) → token de spacing.
- Gate 1, limpeza: `import React from "react"` nunca usado (nem `React.algumaCoisa` em lugar nenhum do arquivo) → removido.
- **Achado real no registry**: `style` (real) ausente → adicionado + `registry:build`.
- Showcase: as 8 instâncias de demo usavam `showLabel` em todas — nenhuma exercitava o caminho default (`showLabel={false}`, onde o fix de acessibilidade importa mais) → adicionada uma linha com os 5 status sem `showLabel`.
- Gate 9: `e2e/cn/display/status-badge.spec.ts` novo (4 testes: crash/console/sem `showLabel` os 5 dots expõem `role=img`+`aria-label`/com `showLabel` o dot não duplica anúncio) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada.

### `feedback/banner` — concluído

Centésimo décimo primeiro standalone. Já tinha passado por um fix pontual em 2026-08-27 (`text-[--ks-*]` bracket cru quebrado → `text-{intent}`), nunca pelos 9 gates completos.

- **Gate 2, achado real**: `bg-[color-mix(in_oklch,var(--ks-*)_N%,transparent)]`/`border-[color-mix(...)]` reimplementavam à mão, com valor cru, exatamente o que os tokens `bg-*-soft`/`text-*-soft-fg` já fazem — mesma categoria de achado já confirmada em `UserCard` e outros componentes nesta auditoria. Substituído pelos tokens reais nas 5 intents; borda convertida pro padrão de opacidade via modificador Tailwind já usado no `variant="outline"` do `Badge` (`border-info/25` etc, preservando a % original de cada intent).
- Gate 5, achados reais: ícones decorativos (padrão e o X do dismiss) sem `aria-hidden` nenhum, nem no wrapper nem nos `<svg>` — corrigido nos dois níveis; botão de dismiss sem nenhum `focus-visible` (reset total: `border-none bg-transparent p-0`, sem substituto de foco) → adicionado `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina`, mesma convenção do `Button` CN.
- Gate 1, limpeza: `React.ReactNode` usado sem `import type React` (funciona pela globalização do namespace do `@types/react`, mas inconsistente com o padrão do resto do arquivo) → import explícito adicionado.
- Gate 3: `py-[0.625rem]` documentado sem match exato (entre `sm` e `md`, mesmo valor não-exato já visto em outros componentes); `gap-3`/`px-4` (match exato) → tokens de spacing.
- Gate 4, avaliado e mantido bespoke: botão de dismiss não migrado pro `Button` CN — o `variant="ghost"` do Button aplica fundo colorido no hover (pill), visual mais pesado que o fade minimalista de opacidade que o Banner usa hoje; mudaria a identidade visual do componente sem ganho real.
- **Achado real no registry**: `className`/`style` (reais) ausentes → adicionados + `registry:build`.
- Showcase: já tinha 6 variações (5 intents + ícone/ação customizados) — nenhuma mudança necessária.
- Gate 9: `e2e/cn/feedback/banner.spec.ts` novo (4 testes: crash/console/Dismiss remove o banner certo/5 intents com `role="alert"`) — 8/8 chromium-desktop + mobile-chrome (uma falha de timeout isolada em `mobile-chrome` na primeira rodada não reproduziu ao re-rodar isolado — contenção de cold-start, mesma categoria já documentada nesta auditoria).

### `display/audio-waveform` — concluído

Centésimo décimo segundo standalone. Nunca tinha sido tocado por nenhuma sessão anterior — terceiro componente da nova fila de cobertura (37 nunca mencionados).

- **Achado grave real, categoria já recorrente**: `variant` (documentado e tipado como `'bars' | 'wave' | 'pulse'`) **nunca era lido em lugar nenhum** — o componente sempre renderizava barras, independente do valor passado. Implementado de verdade: `wave` (polígono SVG suave a partir das mesmas alturas) e `pulse` (círculo com anel `animate-ping`, mesma técnica já usada no `pulse` do `StatusBadge`).
- **Achado grave real correlato**: a tabela fixa `HEIGHTS` só tinha 20 valores — `Array.slice` não estende um array, então `bars={30}` (ou qualquer valor > 20, dentro do próprio limite de 40 que o componente afirma suportar) renderizava **só 20 barras**, silenciosamente ignorando o resto, sem erro nem aviso. Corrigido substituindo a tabela fixa por um gerador determinístico (`heightAt(i)`) — funciona pra qualquer contagem dentro do limite.
- **Gate 5, achado real**: `aria-label` num `<div>` sem `role` nenhum — por spec (HTML-AAM), um elemento genérico sem role implícito **não expõe `aria-label` a leitor de tela nenhum** (esse atributo era, na prática, sempre ignorado). Corrigido com `role="img"` no wrapper + `aria-hidden` em todo o conteúdo visual interno (bars/wave/pulse), pra não duplicar exposição.
- **Achado real, animação nunca respeitava `prefers-reduced-motion`**: nenhuma das 3 variantes desligava a animação contínua pra quem pediu movimento reduzido (mesma categoria já corrigida em `TerminalBlock`/`VideoCard`). Resolvido com um `@media (prefers-reduced-motion: reduce)` dentro do `<style>` já injetado pelo componente (mais simples que hook JS aqui, já que a técnica de animação já era CSS puro via custom properties).
- Gate 2: `gap-[2px]` bate exato com `--spacing-3xs` → migrado; `color` com fallback `var(--ks-primary)` mantido (cor é prop dinâmica arbitrária, Tailwind não alcança).
- **Achado real no registry**: `height` documentado com default `48`, real `40`; `style` (real) ausente — corrigidos + `registry:build`.
- Showcase: 3 instâncias, todas variant default (`bars`) e nenhuma com `bars > 20` — trocada uma pra `bars={30}` (exercita o fix do cap escondido) e adicionada uma linha com `variant="wave"` e `variant="pulse"`.
- Gate 9: `e2e/cn/display/audio-waveform.spec.ts` novo (5 testes: crash/console/`role=img` alterna Paused↔Playing/30 barras renderizadas de verdade/`wave` e `pulse` renderizam os elementos certos) — 10/10 chromium-desktop + mobile-chrome, direto na primeira rodada.

### `layout/bento-grid` — concluído

Centésimo décimo terceiro standalone. Nunca tinha sido tocado por nenhuma sessão anterior — quarto componente da nova fila de cobertura.

- **Achado real de completude**: `cols` suporta `3 | 4`, mas `BentoItem.colSpan` só ia até `3` — num grid de 4 colunas, era **impossível** um item ocupar a linha inteira (precisaria de `colSpan={4}`, valor que nem existia no tipo nem no `COL_SPAN` map). Corrigido: `colSpan` agora aceita `1|2|3|4`, `COL_SPAN` ganhou `4: "col-span-4"`.
- Gate 1, limpeza: `import React from "react"` nunca usado (sem JSX que precise, sem `React.algumaCoisa`) → removido.
- Gate 2/3: nenhuma violação de cor/tipografia — componente já usava `bg-raised`/`border-rule`/`rounded-(--radius-lg)` corretamente. `gap` numérico em px avaliado e mantido — é prop de runtime livre (não classe estática), categoria diferente da regra de spacing que rege classes Tailwind fixas.
- **Achado real no registry**: `colSpan` documentado só até `3` (mesmo gap corrigido acima); `className`/`style` (reais) ausentes → corrigidos + `registry:build`.
- Showcase: só tinha 1 variação (`cols=3`) — nenhuma exercitava `cols=4`/`colSpan=4`. Adicionada uma segunda seção demonstrando exatamente o cenário do achado corrigido.
- Gate 9: `e2e/cn/layout/bento-grid.spec.ts` novo (4 testes: crash/console/`colSpan=4` gera `grid-column: span 4` de verdade/itens do grid de 3 colunas aparecem) — 7 passed + 1 skip (pendência 0b mobile, confirmada reproduzível via screenshot antes de marcar o skip, não assumida de graça).

### `display/card-stack` — concluído

Centésimo décimo quarto standalone. Nunca tinha sido tocado por nenhuma sessão anterior — quinto componente da nova fila de cobertura.

- **Gate 5, achado grave real**: avançar o stack só era possível clicando com mouse (`<div onClick>` cru) — **zero alternativa de teclado**, mesma categoria já corrigida em `PinBoard`/`Resizable` nesta auditoria. Corrigido com `role="button"` + `tabIndex={0}` + `onKeyDown` (Enter/Space) + `aria-label="Show next card"` + `focus-visible`.
- **Gate 5, achado real correlato, mesmo padrão do `SwipeCard`**: cards obscurecidos atrás do topo (visualmente escondidos, `pointerEvents: 'none'`) não eram `aria-hidden` — leitor de tela alcançava o conteúdo de todos igualmente, fora de ordem visual. Corrigido com `aria-hidden={!isTop}`.
- **Achado real de robustez**: `advance()` fazia `(a+1) % cards.length` sem checar `cards.length === 0` — array vazio geraria `NaN` no estado. Guarda adicionada (`if (cards.length === 0) return`).
- Gate 1, limpeza: tipos sem `import type React from "react"` (funcionava pela globalização do `@types/react`, mas inconsistente com o padrão do resto do arquivo) → import explícito adicionado; aspas simples → duplas.
- **Achados reais no registry, 2 defaults errados**: `autoPlay` documentado `true`, real `false`; `interval` documentado `5000`, real `3000`. `style` (real) também ausente. Todos corrigidos + `registry:build`.
- Showcase: só tinha 1 variação (auto-play) — adicionada uma segunda seção manual (clique/teclado), que também serviu de base pro teste do Gate 9.
- Gate 9: `e2e/cn/display/card-stack.spec.ts` novo (4 testes: crash/console/Enter avança o stack sem mouse/cards obscurecidos ficam `aria-hidden`) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada.

### `display/carousel` — concluído

Centésimo décimo quinto standalone. Nunca tinha sido tocado por nenhuma sessão anterior — sexto componente da nova fila de cobertura. **Segundo achado mais grave da fila nova até aqui** (depois do `AudioWaveform`).

- **Achado gravíssimo real — `orientation="vertical"` nunca funcionou de verdade**: a trilha (`flex-col` quando vertical) e cada slide (`flex-[0_0_100%]`) nunca tinham altura explícita nenhuma. Um elemento de bloco preenche a largura do pai automaticamente (por isso o horizontal "funcionava de graça"), mas **nunca preenche a altura sozinho** — resultado: com `orientation="vertical"`, o container crescia pra caber a SOMA de todos os slides empilhados (sem clipping nenhum) e o `translateY` só rolava parcialmente por dentro desse empilhamento, nunca mostrando "um slide de cada vez" de verdade — quebrado independente de como o consumidor tentasse usar. Confirmado ao vivo via Playwright (`boundingBox()` antes do fix mostraria ~4x a altura configurada). Corrigido: trilha e slides ganham `h-full` condicional em modo vertical, documentado no tipo que vertical exige altura explícita no próprio `Carousel` (via `className`/`style` — comportamento normal/esperado de qualquer scroller vertical, não é um prop novo inventado). Ícones das setas também trocados pra ↑/↓ em vez de ←/→ herdados do horizontal (mesmo bug visual, nunca fazia sentido apontar pro lado errado).
- **Gate 5, achados reais de a11y, padrão WAI-ARIA APG carousel, nunca implementado**: sem `role="region"`/`aria-roledescription="carousel"` no container; cada slide sem `role="group"`/`aria-roledescription="slide"`/`aria-label` nem `aria-hidden` nos obscurecidos (mesmo padrão já corrigido em `SwipeCard`/`CardStack` nesta auditoria); dots sem `aria-current` indicando qual página está ativa (mesmo padrão já estabelecido em `StepForm`, `aria-current="step"`). Todos implementados.
- Gate 3: `px-3`/`pt-3`(match exato)/`gap-[6px]`(bate exato com `--spacing-xs`) → tokens de spacing.
- Gate 4, confirmado precedente já documentado nesta auditoria: botões de seta/dot mantidos `<button>` cru — controles compactos de formato bespoke, mesma exceção já pré-aprovada explicitamente pra `Carousel`/`MediaPlayer` na lista de precedentes.
- Gate 1, limpeza: aspas simples → duplas em todo o arquivo e nos tipos.
- **Achado real no registry**: `style` (real) ausente → adicionado + descrição de `orientation` atualizada explicando a exigência de altura + `registry:build`.
- Showcase: só tinha a variação horizontal — nunca exercitava vertical (por isso o bug nunca foi percebido). Adicionada uma segunda seção `orientation="vertical"` com altura explícita, que serviu de prova ao vivo do fix.
- Gate 9: `e2e/cn/display/carousel.spec.ts` novo (4 testes: crash/console/Next avança e reflete `aria-hidden`+`aria-current`/vertical clipa de verdade — altura do container confirmada < 260px em vez de ~4×) — 7 passed + 1 skip (pendência 0b variante "sidebar intercepta pointer-events" em mobile-chrome). Achado de teste (não do componente): `getByRole` exclui elementos `aria-hidden` da árvore de acessibilidade por design — pra checar o PRÓPRIO estado de `aria-hidden` de um slide escondido, precisa de um seletor de atributo direto, não `getByRole`.

### `display/code-block` — concluído

Centésimo décimo sexto standalone. Nunca tinha sido tocado por nenhuma sessão anterior — sétimo componente da nova fila de cobertura. **Achado mais grave da fila nova até aqui, categoria nova (documentação publicada aponta pro arquivo errado).**

- **Achado gravíssimo real no registry**: a entrada `code-block` tinha `filePath: "src/components/ui/kk-code-block/KkCodeBlock.tsx"` — um arquivo **completamente diferente**, de uma implementação legada fora de `cn/` (`src/components/ui/kk-code-block/`), que ainda existe no repo mas não é o componente publicado. A tabela de props também vinha inteira da implementação errada: documentava `lang` (com default `'tsx'`), mas o componente real (`cn/code-block/CodeBlock.tsx`) **não tem prop `lang` nenhuma** — o nome real é `language`, sem default. A descrição também afirmava "Syntax-highlighted", mas o componente real **não faz nenhum destaque de sintaxe**, é texto monoespaçado puro. `npm run registry:build` mascarava o sintoma (o script deriva o path real pela convenção de pasta, ignorando o campo `filePath` do TS-source — por isso o pacote publicado via `npx kikitocn add` já vinha certo), mas qualquer um lendo a tabela de Props no próprio site ou o `cn-registry.tsx` direto veria a API errada. Corrigido: `filePath`, `props` (nomes/defaults reais) e `description` (sem a alegação falsa de syntax highlight) reescritos do zero.
- **Gate 5, achado real**: botão de copiar flutuante (quando não há `filename`/`language`) só ficava visível em `group-hover:opacity-100` — **focar por teclado deixava o botão funcionalmente presente mas invisível**, mesma categoria já corrigida em `QuickActions`. Adicionado `group-focus-within:opacity-100`/`focus-visible:opacity-100`; confirmado ao vivo via Playwright (`toHaveCSS("opacity","1")` após `.focus()`).
- **Gate 5, achado real**: `<table>` usada só como grade de alinhamento (número da linha + código), não dado tabular de verdade — leitor de tela anunciava "tabela com N linhas" pra um simples bloco de código. Corrigido com `role="presentation"` na tabela (remove semântica implícita de tabela dos descendentes automaticamente) + `aria-hidden` na célula do número de linha (ruído decorativo pra navegação visual, não conteúdo).
- **Gate 2, achado real, mesmo padrão do `TerminalBlock`/precedente do `CopyButton`**: linha da tabela usava `hover:bg-white/[0.03]` — cor literal hardcoded, correta só em dark mode, quebrada/invertida em light mode → `hover:bg-foreground/[0.03]` (token que já se adapta ao tema).
- **Gate 5, achado real, seguindo precedente exato do `CopyButton` (já validado)**: nenhum dos dois botões de copiar tinha `aria-live` — o feedback "Copied!" mudava o `aria-label` mas não era anunciado de forma confiável. Adicionado `aria-live="polite"` nos dois, replicando exatamente o padrão do componente irmão.
- Gate 1: extraído `CodeBlockProps` pro novo `code-block.types.ts` (estava inline).
- Gate 3: `text-[0.8125rem]` sem match exato → alinhado ao `text-body-callout` já usado no `TerminalBlock` (mesma categoria de componente); `px-4`/`py-2`/`gap-1`/`gap-2`/`pr-4`/`pl-4`/`top-2`/`right-2`/`px-2`/`py-1` (todos match exato) → tokens de spacing. `leading-6` avaliado e mantido — é step nativo do Tailwind (não bracket arbitrário), trocar por `leading-normal` mudaria o valor de verdade (21px vs 24px), não é o mesmo caso do alerta do CLAUDE.md.
- Gate 4: botão de copiar do header (com `filename`/`language`) migrado pra `<Button variant="ghost" intent="neutral" size="xs">` CN — formato padrão, sem motivo pra ser bespoke; botão flutuante (posicionamento absoluto + revelação em hover/foco) mantido bespoke, mecânica de interação incompatível com as variantes do `Button`.
- Showcase: 3 variações cobriam filename+language, só language, e maxHeight — nenhuma exercitava o caminho sem nenhum dos dois (o botão flutuante que precisava do fix de foco) → adicionada uma 4ª seção.
- Gate 9: `e2e/cn/display/code-block.spec.ts` novo (5 testes: crash/console/copiar do header com `aria-live`/botão flutuante visível ao focar por teclado/tabela `role="presentation"`) — 9 passed + 1 skip (pendência 0b variante pointer-events em mobile-chrome).

### `data/code-diff` — concluído

Centésimo décimo sétimo standalone. Nunca tinha sido tocado por nenhuma sessão anterior — oitavo componente da nova fila de cobertura. **Terceiro achado gravíssimo consecutivo na fila nova.**

- **Achado gravíssimo real — `splitView` não mostrava diff nenhum**: em modo split, o componente renderizava `before`/`after` a partir do texto cru (`beforeLines`/`afterLines`), **sem passar pelo `computeDiff` (LCS)** — as duas colunas apareciam inteiramente em cinza neutro, sem nenhuma linha destacada como adicionada/removida. O próprio propósito de um "diff viewer" não existia nesse modo — era, na prática, só duas colunas de texto lado a lado, indistinguível de colar dois arquivos não relacionados. Nunca percebido porque o showcase nunca tinha uma instância com `splitView`. Corrigido reaproveitando o mesmo resultado do `computeDiff` já usado no modo unificado, convertido em pares de coluna alinhados (`toSplitRows` — linha ausente de um lado vira célula vazia, técnica padrão de diff split como GitHub).
- Gate 2, achado real, mesma categoria já corrigida em `UserCard`/`Banner`: `bg-success/10`/`bg-danger/10` reimplementavam à mão o que `bg-success-soft`/`bg-danger-soft` já fazem → substituídos.
- **Gate 5, achados reais de a11y**: as duas tabelas (unificada e as duas colunas do split) eram `<table>` de verdade sem `role="presentation"` — leitor de tela anunciava "tabela com N linhas" pra uma grade de alinhamento de código; células de número de linha e o sinal `+`/`-` sem `aria-hidden` (o sinal sozinho, sem contexto, não comunica "adicionado"/"removido" de forma confiável pra leitor de tela). Corrigido com `role="presentation"` nas 3 tabelas + `aria-hidden` nas células decorativas + texto `sr-only` ("Added: "/"Removed: ") prefixando o conteúdo de cada linha modificada, técnica robusta que não depende de semântica ARIA de tabela (que fica suprimida por `role="presentation"`).
- **Achado real de tipo morto**: `DiffLineType` declarava `'header'`, mas nada em `computeDiff` produz esse valor e nem `LINE_BG`/`LINE_SIGN` tinham entrada pra ele — se um consumidor externo montasse um `DiffLine[]` manual com `type: 'header'` (API pública exportada), o resultado visual quebraria silenciosamente (sem cor de fundo, sem sinal). Removido do tipo por não corresponder a nenhum caminho de renderização real.
- Gate 3: `gap-2`/`px-4`/`py-2`/`py-1`/`pr-3`/`pl-3`/`pr-2`/`pl-2`/`py-0.5`(bate exato com `--spacing-3xs`) → tokens de spacing.
- **Achado real no registry**: descrição afirmava "syntax highlight" — o componente não faz nenhum destaque de sintaxe, só cores por tipo de linha (adicionada/removida/inalterada); `className`/`style` (reais) ausentes. Corrigidos + `registry:build`.
- Showcase: só tinha a variação unificada — nunca exercitava `splitView` (por isso o bug nunca foi percebido). Adicionada uma segunda seção.
- Gate 9: `e2e/cn/data/code-diff.spec.ts` novo (5 testes: crash/console/linhas destacadas no modo unificado/**split view mostra highlight de verdade** (achado principal, confirmado ao vivo)/números de linha `aria-hidden`) — 10/10 chromium-desktop + mobile-chrome, sem hit na pendência 0b.

### `data/comparison-table` — concluído

Centésimo décimo oitavo standalone. Nunca tinha sido tocado por nenhuma sessão anterior — nono componente da nova fila de cobertura. Diferente de `CodeBlock`/`CodeDiff`, aqui a `<table>` é dado tabular de verdade (matriz de features × planos) — `role="presentation"` NÃO se aplica, o achado aqui é semântica de tabela **incompleta**, não indevida.

- **Gate 5, achado grave real**: nenhum `<th>` (cabeçalho de coluna nem o nome da feature na primeira coluna) tinha `scope`. Pra uma tabela comparativa de verdade, `scope="col"` nos cabeçalhos de plano e `scope="row"` no nome de cada feature são o que permite um leitor de tela anunciar "Sharing, coluna Pro: incluído" em vez de só "incluído" solto. Corrigido: `scope="col"` em todos os `<th>` do cabeçalho (mesmo padrão já aplicado em `PriceTable` nesta auditoria); nome da feature migrado de `<td>` pra `<th scope="row">` (com `font-normal text-left` pra preservar o visual).
- **Gate 5, achado grave real**: tooltip de cada feature usava só o atributo nativo `title` — sem alcance por teclado (só `:hover` de mouse revela `title`, sem timing/foco confiável, e leitores de tela não anunciam `title` de forma consistente). Migrado pro `<Tooltip>` CN (`trigger` padrão já escuta hover E foco simultaneamente, confirmado lendo o próprio `SimpleTooltip`), com o "?" agora um `<button>` real (focável) em vez de `<span>`.
- **Gate 4, achado real**: badge da coluna destacada (`bg-patina text-patina-fg text-[0.625rem] rounded-full`) reimplementava exatamente `Badge intent="primary" variant="solid" size="sm"` → substituído.
- **Gate 2, achado real, mesma categoria já corrigida várias vezes nesta auditoria**: `bg-patina/5` (header e células da coluna destacada) reimplementava à mão o que `bg-patina-soft` já faz → substituído nos dois lugares.
- Gate 3: `px-4`/`py-3`/`py-2`/`gap-1.5`(todos match exato) → tokens de spacing; `text-[0.625rem]` (badge, resolvido pela migração pro Badge) e `text-[0.5625rem]` (glifo "?" de 9px) documentado como exceção válida (micro-label decorativo).
- **Achado real no registry**: campo `tooltip` de `ComparisonRow` não estava documentado na descrição de `rows`; `className`/`style` (reais) ausentes. Corrigidos + `registry:build` (`registryDeps: [badge, tooltip]` automático).
- Showcase: nenhuma linha usava `tooltip` (por isso o gap de a11y nunca foi percebido) → adicionado num exemplo real.
- Gate 9: `e2e/cn/data/comparison-table.spec.ts` novo (4 testes: crash/console/`scope` correto em `columnheader`/`rowheader`/tooltip acessível por foco de teclado/badge via `Badge` CN) — 10/10 chromium-desktop + mobile-chrome, direto na primeira rodada.

### `display/image-viewer` — concluído

Centésimo décimo nono standalone. Nunca tinha sido tocado por nenhuma sessão anterior — décimo componente da nova fila de cobertura.

- **Gate 5, achado grave real, mesmo padrão já corrigido em `OnboardingTour`**: a lightbox (`role="dialog" aria-modal="true"`, renderizada via portal) não tinha **nenhum** focus trap — `Tab` escapava do dialog pro grid de thumbnails por trás do overlay (contradizendo o próprio `aria-modal="true"` declarado), o foco não entrava no dialog ao abrir, e não voltava pro elemento que abriu ao fechar. Corrigido: `Tab`/`Shift+Tab` ciclam só entre os botões do dialog; foco vai pro botão Close ao abrir; volta pro thumbnail que disparou a abertura ao fechar (rastreado via `e.currentTarget` no clique, não um estado global).
- **Gate 5, achado real correlato**: `role="dialog"` sem `aria-label`/`aria-labelledby` nenhum — leitor de tela anunciava só "dialog", sem nome. Adicionado `aria-label="Image viewer"`.
- **Gate 5, achado real, mesmo padrão do `Carousel`/`StepForm`**: dots de navegação sem `aria-current` indicando qual imagem está ativa → adicionado.
- Gate 2, preto/branco literais (`bg-black/92`, `bg-white/10` etc.) avaliados e **mantidos** — lightbox de imagem é convenção universal de sempre-escuro, invariante ao tema do app hospedeiro (exceção documentada explicitamente no CLAUDE.md pra esse tipo de caso), mas nunca tinha comentário nenhum explicando isso → adicionado.
- Gate 3: `gap-2`/`top-4 right-4`/`gap-4`/`p-6`(bate exato com `--spacing-xl`)/`gap-[6px]`(bate exato com `--spacing-xs`) → tokens de spacing. `left-5`/`right-5` (20px, posição das setas) **revertidos de uma primeira tentativa errada** de arredondar pra `--spacing-xl` (24px, mudaria a posição visual de verdade) — mantidos como estão, documentados como sem match exato, conforme a regra do CLAUDE.md (não arredondar silenciosamente quando não há match, documentar em vez disso).
- Gate 1: aspas simples → duplas nos tipos.
- **Achado real no registry**: `style` (real) ausente → adicionado + `registry:build`.
- Showcase: já cobria múltiplas imagens + legendas, suficiente pra testar o fix.
- Gate 9: `e2e/cn/display/image-viewer.spec.ts` novo (5 testes: crash/console/focus trap não escapa pro conteúdo de trás/fechar devolve foco pro thumbnail/ArrowRight navega e dot reflete `aria-current`) — 10/10 chromium-desktop + mobile-chrome (um timeout isolado de `networkidle` por imagens externas do `picsum.photos` não reproduziu ao re-rodar sozinho — contenção de rede sob workers concorrentes, não bug do componente).

### `charts/sparkline` — concluído

Centésimo vigésimo standalone. Nunca tinha sido tocado por nenhuma sessão anterior — décimo primeiro e último componente da fila de cobertura mapeada nesta sessão (37 nunca mencionados → 12 genuinamente sem cobertura → todos concluídos).

- **Gate 5, achado real**: nenhuma das 3 variantes (`line`/`bar`/`area`) tinha `role`/`aria-label` — um `<svg>` puro de dados sem isso é invisível ou anunciado sem informação nenhuma pra leitor de tela, pro tipo de componente cujo propósito inteiro é comunicar uma tendência numérica. Adicionado `role="img"` + `aria-label` nas duas variantes de retorno (o tipo `bar` tem um `return` antecipado, precisou do fix nos dois lugares); nova prop opcional `ariaLabel`, com fallback pra um resumo gerado a partir de `data` (tendência + faixa min/max) quando ausente — não exige prop obrigatória nova pra quem já usa o componente.
- Gate 2: `var(--ks-*)` direto nos atributos `fill`/`stroke` do SVG avaliado e mantido — intent é resolvido em runtime, Tailwind não alcança um valor dinâmico desse no atributo de um elemento SVG; comentário adicionado documentando a exceção (não tinha nenhum antes).
- Gate 1: aspas simples → duplas no componente e nos tipos.
- **Achados reais no registry**: `color` e `strokeWidth` (ambas props reais) não estavam documentadas; `ariaLabel`/`className`/`style` também ausentes. Corrigidos + `registry:build`.
- Showcase: já cobria os 3 tipos (area/line/bar) — suficiente pra testar o fix.
- Gate 9: `e2e/cn/charts/sparkline.spec.ts` novo (3 testes: crash/console/os 3 tipos expõem `role="img"` com nome acessível gerado a partir dos dados) — 6/6 chromium-desktop + mobile-chrome, direto na primeira rodada.

**Fila de cobertura desta sessão (37 nunca mencionados no doc → 12 genuinamente sem cobertura, os demais absorvidos por Super components confirmados) concluída — todos os 12 validados**: `password-input`, `status-badge`, `banner`, `audio-waveform`, `bento-grid`, `card-stack`, `carousel`, `code-block`, `code-diff`, `comparison-table`, `image-viewer`, `sparkline` — mais os 7 da fila original (text-editor → word-counter), total 19 componentes validados nesta sessão.

### `display/accordion-group` — concluído

Centésimo vigésimo primeiro standalone. Nunca tinha sido tocado por nenhuma sessão anterior. **Novo sweep de cobertura**: `accordion→accordion-group/multi-accordion/collapsible` já estava confirmado como absorção **falsa** (implementações paralelas reais, pendência 0) — mas nenhum dos três nunca tinha passado pelos 9 gates individualmente. Primeiro dos 17 achados assim nesta segunda leva.

- **Achado gravíssimo no registry, mesma categoria do `WindowFrame`**: `variant` documentado como `'default' | 'separated' | 'ghost'` — os valores reais são `'default' | 'card' | 'flush'`, **zero sobreposição**. Passar `variant="separated"` (seguindo a própria doc publicada) não bate com nenhuma chave de `WRAP_CLS`/`ITEM_CLS`, quebrando a estilização silenciosamente. `type` documentado como `'single' | 'multiple'`, real é `'single' | 'multi'` — funciona por acidente (`else` genérico do `toggle()` aceita qualquer não-`"single"`), mas TypeScript rejeitaria o literal errado se levado a sério. `items` documentava um campo `intent` que **não existe em lugar nenhum** do componente (nem no tipo, nem na renderização) e um `title` que na real é `trigger`. Todos os 4 campos corrigidos.
- Gate 2, achado real: conteúdo do painel (`item.content`, informação primária revelada ao expandir) usava `text-faint` — viola a regra de ouro do `text-faint` (nunca pra conteúdo primário) → `text-muted`.
- **Achado real no registry correlato**: `style` (real) ausente → adicionado + `registry:build`.
- Gate 5: já estava bem construído de origem — `aria-expanded`/`aria-controls`/`role="region"`/`aria-labelledby`/`aria-hidden` corretos, ids prefixados por instância (`useId()`) pra não colidir entre múltiplas instâncias na mesma página. Nenhum achado novo aqui.
- Showcase: já cobria os 2 `type` reais e as 3 `variant` reais corretamente — só o registry estava desalinhado com o componente/showcase de verdade.
- Gate 9: `e2e/cn/display/accordion-group.spec.ts` novo (5 testes: crash/console/`type=single` fecha o anterior e reflete `aria-expanded`/`type=multi` mantém múltiplos abertos/3 variantes renderizam) — 9 passed + 1 skip (pendência 0b variante pointer-events em mobile-chrome). **Achado de infraestrutura, não do componente**: o dev server manual da sessão tinha morrido silenciosamente há várias validações; Playwright tentou subir seu próprio `next dev` (documentado como cenário perigoso no CLAUDE.md) e o primeiro conjunto de resultados saiu com falsos-positivos de "pointer-events interceptado" até em `chromium-desktop`. Resolvido com `rm -rf .next` + reinício limpo do servidor manual na porta 3000 antes de re-confirmar os testes — comportamento real do componente confirmado correto via clique direto no DOM (`element.click()`) antes mesmo do reinício, o que já indicava que a falha era ambiental, não do componente.

### `display/avatar-group` — concluído

Centésimo vigésimo segundo standalone. Nunca tinha sido tocado — `avatar→avatar-group` já confirmado como absorção falsa (parênteses parceiro do `Avatar.tsx`, implementação paralela de propósito).

- **Achado grave real**: a bolha de overflow ("+3") passava `{name: "+3"}` pelo mesmo `getInitials()` usado pros nomes reais — `"+3".split(" ")` não tem espaço, `map(n => n[0])` pega só o primeiro char ("+"), resultado final era **só "+"**, o número inteiro descartado silenciosamente. Qualquer grupo com overflow mostrava uma bolha "+" sem indicar quantos a mais existiam. Corrigido com um componente `OverflowItem` dedicado que renderiza `+{count}` direto, sem passar pelo helper de iniciais.
- **Gate 2/5, achado real de contraste**: cor de fundo/texto de cada avatar sem imagem era gerada por hue contínuo independente (`hsl(hash%360, ...)` pro fundo E pro texto, calculados separadamente) — **sem garantia nenhuma de contraste** entre os dois (mesmo hue, luminosidades escolhidas sem checagem cruzada). O componente irmão `Avatar.tsx` já resolve o mesmo problema corretamente com uma paleta curada de 8 pares fundo/texto (`oklch` literal, contraste garantido por design, não computado). Substituído pela mesma técnica.
- Gate 5, achado real correlato: avatar de iniciais sem `item.name` tinha `aria-label={undefined}` — sem nome acessível nenhum quando o dado de origem não trazia nome. Corrigido com fallback `"Unknown member"`. Bolha de overflow ganhou `aria-label` descritivo (`"N more"`) em vez de repetir o texto visual cru.
- Gate 1, limpeza: `import React from "react"` nunca usado → removido; aspas simples → duplas nos tipos.
- **Achado real no registry**: `max` documentado com default `5`, real `4` (mesma categoria de default errado já vista dezenas de vezes nesta auditoria); `style` (real) ausente. Corrigidos + `registry:build`.
- Showcase: já tinha uma instância com overflow real (7 avatares, `max=4`) — suficiente pra provar o fix sem mudança.
- Gate 9: `e2e/cn/display/avatar-group.spec.ts` novo (4 testes: crash/console/bolha mostra "+3" completo — achado principal/`role="group"` com contagem total) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada.

### `inputs/button-group` — concluído

Centésimo vigésimo terceiro standalone. Nunca tinha sido tocado — sem nenhuma alegação de absorção envolvida (nem verdadeira nem falsa), simplesmente nunca chegou a vez de validar.

- **Componente já limpo de origem** — primeiro caso nesta segunda leva sem achado de bug real. Registry já 100% alinhado com a implementação (`orientation`/`attached`/`aria-label`/`className`/`style`, defaults corretos). Seletores `[&>*:not(:first-child)...]` conferidos manualmente (cantos arredondados corretos por posição, bordas duplicadas removidas corretamente nos dois eixos) e confirmados via Playwright (`getComputedStyle` nos cantos/bordas reais).
- Gate 1, limpeza cosmética: `flex-row`/`flex-col` estava sendo aplicado duas vezes quando `attached={false}` (redundante, inofensivo) → simplificado.
- Gate 2/3: sem cor nenhuma (wrapper de layout puro); spacing já usava `gap-(--spacing-sm)` tokenizado.
- Gate 9: `e2e/cn/inputs/button-group.spec.ts` novo (4 testes: crash/console/`attached` zera cantos e borda esquerda do botão do meio/`attached=false` preserva cantos e espaçamento próprios) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada.

### `display/collapsible` — concluído

Centésimo vigésimo quarto standalone. Nunca tinha sido tocado — terceiro membro do trio `accordion→accordion-group/multi-accordion/collapsible` (absorção falsa já confirmada) a passar pelos 9 gates.

- Gate 2, achado real: conteúdo do painel (primário) usava `text-foreground/80` — dilução ad-hoc em vez de token semântico, mesma categoria já corrigida dezenas de vezes nesta auditoria (e no `AccordionGroup`, sibling direto, minutos atrás) → `text-muted`.
- Gate 3: `leading-[1.6]` (arbitrário, banido) → `leading-relaxed` (1.625, mesmo fix exato já aplicado no `UserCard` pro mesmo valor).
- Gate 1/4/5: já bem construído de origem — `aria-expanded`/`aria-controls`/`role="region"`/`aria-labelledby`/`aria-hidden` corretos, `disabled` real (atributo nativo + bloqueio no handler), `useId()` com sanitização de `:` já documentada. Registry já 100% alinhado, só faltava `style`.
- **Achado real no registry**: `style` (real) ausente → adicionado + `registry:build`.
- Showcase: já cobria default (`defaultOpen`) e `disabled` — suficiente.
- Gate 9: `e2e/cn/display/collapsible.spec.ts` novo (4 testes: crash/console/`defaultOpen` + toggle reflete `aria-expanded`/`disabled` bloqueia interação) — 8/8 chromium-desktop + mobile-chrome, direto na primeira rodada.

### `display/multi-accordion` — concluído

Centésimo vigésimo quinto standalone. Nunca tinha sido tocado — último dos três membros do trio `accordion→accordion-group/multi-accordion/collapsible`.

- **Achado real, dois enums declarados só parcialmente implementados**: `variant="flush"` era **visualmente idêntico** a `"default"` — só `isBordered` (`variant==="bordered"`) era checado, o terceiro valor do tipo nunca tinha lógica própria. Corrigido implementando o mesmo conceito de "flush" já usado no `AccordionGroup` (sibling): itens separados só por `divide-y`, sem borda/raio individual por item. Correlato: `intent` do item aceitava `'primary'|'secondary'|'info'|...` no tipo, mas o mapa de cores (`INTENT_OPEN_BORDER`) já tinha entradas prontas pra `tertiary`(violet)/`quaternary`(rose) que **nunca eram alcançáveis** porque o tipo não permitia esses valores — corrigido adicionando os dois ao union, tornando funcionalidade já implementada finalmente utilizável.
- **Gate 5, achado real**: o painel só existia no DOM quando aberto (`{isOpen && <div>}`) — além de não ter nenhuma transição/animação possível (nó nem existe pra animar), `aria-controls` referenciava um id inexistente enquanto fechado, contra a recomendação WAI-ARIA ("hidden, not removed"). Corrigido pra sempre montar o painel e alternar via `aria-hidden` + `max-height`/`opacity`, mesmo padrão exato já usado nos dois siblings (`AccordionGroup`/`Collapsible`) — ganha animação de abertura/fechamento de graça, que antes não existia.
- Gate 2: conteúdo do painel usava `text-muted` (já correto, sem achado aqui — diferente dos siblings que usavam `text-faint`/opacity).
- Gate 3: `leading-[1.6]` (arbitrário, banido) → `leading-relaxed`, mesmo fix do `Collapsible`/`UserCard`. `py-[14px]`/`pb-[14px]` já documentados sem match exato, mantidos.
- **Achado real no registry**: descrição de `items` omitia `disabled`/`intent`; `style` (real) ausente. Corrigidos + `registry:build`.
- Showcase: cobria default e per-item intents, mas **nenhuma variação `bordered`/`flush`** e nenhum intent `tertiary`/`quaternary` — exatamente os dois achados corrigidos, nunca percebidos por falta de demo. Adicionadas as duas seções de variante + os dois intents novos na demo de intents.
- Gate 9: `e2e/cn/display/multi-accordion.spec.ts` novo (6 testes: crash/console/`type=multiple` mantém vários abertos/painel permanece no DOM via `aria-hidden`/`flush` sem borda lateral (`divide-y` é só vertical, distinto de `default`)/intents `tertiary`/`quaternary` renderizam) — 10 passed + 2 skips (pendência 0b mobile). Achado de teste (não do componente): `divide-y` do Tailwind aplica borda só entre itens não-últimos (não nos 4 lados) — a asserção inicial comparando "borda total zero" no primeiro item falhou porque esse item específico recebe uma borda inferior de divisor; corrigido comparando `border-left-width` especificamente (nunca setado por `divide-y`, sempre `0` só no flush).

### `display/event-calendar` — concluído

Centésimo vigésimo sexto standalone. Nunca tinha sido tocado — sem nenhuma alegação de absorção. Componente já bem construído de origem (interação por teclado real em dias e eventos, tokens de spacing quase todos já corretos com comentários de exceção).

- **Achado real, mesma categoria do `MultiAccordion` minutos atrás**: `intentMap` não tinha entrada pra `neutral` (que **está** no tipo) — evento com `intent="neutral"` caía no fallback `?? intentMap.primary`, renderizando colorido como primary em vez de neutro. Correlato: `tertiary`(violet)/`quaternary`(rose) já tinham cor pronta no mapa mas o tipo não aceitava esses valores, tornando-as inalcançáveis. Ambos corrigidos (nova entrada `neutral` + união do tipo expandida).
- Gate 5, achado real: navegar de mês (botões ‹/›) não move o foco, e o texto do cabeçalho (`{MONTHS[month]} {year}`) não tinha `aria-live` — leitor de tela nunca era avisado que o mês mudou. Adicionado `aria-live="polite"`.
- Gate 2/3: `opacity-30` (dias fora do mês) e `opacity-60` (chip "+N") avaliados e mantidos — convenção universal de calendário (dias fora do mês sempre esmaecidos) já construída sobre tokens reais, categoria diferente da dieta ad-hoc de texto/fundo já banida. `text-[0.625rem]` (×3) e `px-[18px]`/`py-[14px]` já vinham documentados com comentário de exceção desde a implementação original — nenhuma correção necessária, só confirmado.
- **Achado real no registry**: `style` (real) ausente → adicionado + `registry:build`.
- Showcase: 6 eventos cobrindo 6 intents, mas nenhum `neutral`/`tertiary`/`quaternary`, e `onDayClick`/`onEventClick` nunca eram passados (interação por teclado nunca exercitada) → adicionado evento `neutral` + os dois callbacks.
- Gate 9: `e2e/cn/display/event-calendar.spec.ts` novo (5 testes: crash/console/evento `neutral` usa cor neutra — achado principal/navegar de mês atualiza `aria-live`/Enter no dia dispara `onDayClick` por teclado) — 9 passed + 1 skip (pendência 0b mobile).

### `display/grid-pattern` — concluído

Centésimo vigésimo sétimo standalone. `grid-pattern→particle-field` já confirmado como absorção falsa (implementações totalmente separadas), mas o `GridPattern` em si nunca tinha passado pelos 9 gates. Segundo caso desta segunda leva praticamente sem achado grave — componente já muito bem construído de origem (camada decorativa já com `aria-hidden` desde a implementação original, os 4 tipos de padrão implementados de verdade, `currentColor` como default inteligente).

- Gate 1, limpeza: comentário adicionado documentando por que `color` usa `currentColor` cru em vez de token (embutido numa data-URI de SVG gerado em runtime, Tailwind não alcança).
- **Achado real no registry, pequeno**: `color` sem `default` documentado (`'currentColor'`, real) → corrigido + `registry:build`.
- Gate 2/3/4/5: nada a corrigir — já compliant (sem cor crua fora do necessário, sem texto/spacing arbitrário, sem interatividade que precisasse de reuso, decoração já `aria-hidden`).
- Showcase: já cobria os 4 tipos com legenda visual.
- Gate 9: `e2e/cn/display/grid-pattern.spec.ts` novo (3 testes: crash/console/os 4 tipos renderizam `background-image` real de SVG data-URI atrás de uma camada `aria-hidden`) — 6/6 chromium-desktop + mobile-chrome, direto na primeira rodada.

### `display/marquee-text` — concluído

Centésimo vigésimo oitavo standalone. Já tinha sido explicitamente apontado como pendência na sessão do `TextEffect` ("nomes parecidos mas fora da família, ficam pendentes pra validação própria futura"). Terceiro caso seguido praticamente sem achado grave — componente já excepcionalmente bem construído (texto real em `sr-only` lido uma vez, faixa visual repetida `aria-hidden`, `prefers-reduced-motion` já pausando a animação desde a implementação original).

- **Achados reais no registry, 2 defaults errados**: `speed` documentado `40`, real `30`; `repeat` documentado `3`, real `8`. `style` (real) também ausente. Corrigidos + `registry:build`.
- Gate 1, limpeza: aspas simples → duplas nos tipos.
- Gate 2/3/4/5: nada a corrigir — `gap`/`padding` em `em` dentro do `<style>` escopado avaliados e aceitos (fora do escopo das regras de spacing, que regem classes Tailwind, não CSS customizado de animação); tipografia já usa tokens reais (`text-body-callout`→`text-heading-02`); a11y já exemplar de origem.
- Showcase: já cobria 3 velocidades/tamanhos diferentes.
- Gate 9: `e2e/cn/display/marquee-text.spec.ts` novo (4 testes: crash/console/texto real único em `sr-only` + faixa repetida `aria-hidden`/animação para com `prefers-reduced-motion`) — 8/8 chromium-desktop + mobile-chrome. Achado de teste (não do componente): `locator("../.mq-track")` misturava sintaxe XPath (`..`) com seletor CSS de classe na mesma string — inválido; corrigido encadeando `.locator("..").locator(".mq-track")` em duas chamadas separadas.

## Pendências abertas pra próxima sessão, em ordem de prioridade

0. **Achado sistêmico — ✅ VARREDURA COMPLETA**: o campo `absorbs` de `cn-registry.tsx` se provou **falso oito vezes** (`avatar`→`avatar-group`, `accordion`→`accordion-group`/`multi-accordion`/`collapsible`, `grid-pattern`→`particle-field`, `scroll-spy`→`table-of-contents`, `stepper`→`dot-stepper`/`progress-steps`, `badge`→`tag`/`status-badge`/`ping`, e dois casos **parciais**: `tooltip`→`context-card` e `input`→`password-input`/`search-input`, ambos dentro de listas majoritariamente verdadeiras) — em todos os casos os componentes "absorvidos" são implementações paralelas reais (ou, nos parciais, têm funcionalidade real não-redundante), nunca de fato unificadas/replicadas, e ficam escondidos da sidebar por isso (`getVisibleComponents()` filtra qualquer nome em `absorbs`). **Todas as ~20 entradas de `absorbs:` em `cn-registry.tsx` foram conferidas nesta sessão** — não é mais pendência, registrado aqui só como referência dos critérios usados: abrir o arquivo do Super e conferir se há de fato um dispatcher (`switch`/discriminated union) que produz a MESMA funcionalidade do absorvido, como em `Table`/`Progress`/`Timeline`/`Chart`/`TextEffect`/`Card`/`Button`/`Select` (confirmados verdadeiros), e não uma implementação solta ou um equivalente-mas-incompleto, como em `Avatar`/`Accordion`/`GridPattern`/`ScrollSpy`/`ContextCard`/`Stepper`/`Badge`/`PasswordInput`+`SearchInput` (confirmados falsos ou parciais). Lista completa de verdadeiros confirmados: `Table`(data-grid/data-list/tree-table), `Progress`(progress-ring/gauge/skill-bar), `Timeline`(scroll-timeline/timeline-progress/activity-feed), `Chart`(6 renderers, é router não absorção), `Modal`(alert-dialog/drawer/side-panel), `Command`(command-bar/spotlight-search), `DropdownMenu`(context-menu/floating-menu), `ToggleGroup`(segmented-control/chip-group/filter-bar), `Stat`(metric-card/stats-card), `DatePicker`(date-range-picker/calendar), `Kbd`(shortcut-key), `Tooltip`(rich-tooltip/popover/hover-card, SEM context-card), `Card`(5 effects, wrappers genuínos), `Button`(magnetic/confetti/confirm — confirm-button não delegava, corrigido), `Input`(number/currency/phone/floating-label, SEM password/search), `Select`(multi/rich/combobox, dispatch real via `switch(mode)`), `Rating`(rating-input), `Slider`(range-slider). Se um novo Super component for adicionado no futuro com `absorbs`, aplicar o mesmo critério antes de confiar no campo.
   0b. **Achado sistêmico novo**: em `mobile-chrome` (~393px), a sidebar do showcase (`cn-sidebar.tsx`) não colapsa pra menu hambúrguer e o grid de demos cai pra 2 colunas — a caixa de conteúdo do `Frame` fica espremida a ~66px de largura total (conteúdo útil ≈ 0px depois do padding). Confirmado idêntico em `grid-pattern`/`particle-field`/`pin-board` (não relacionados entre si) — afeta **qualquer** demo que dependa de largura real pra renderizar algo visível (canvas, SVG com `viewBox` proporcional, etc.) nesse breakpoint específico. Não é bug de nenhum componente individual; é do layout responsivo do showcase (`cn-sidebar.tsx` + grid de `_showcase.tsx`). Fica pendente decidir: colapsar sidebar em mobile, ou grid de 1 coluna abaixo de certo breakpoint. **Novo modo de falha confirmado (`infinite-scroll`)**: o mesmo espremer reduz um container de demo a **2px de largura** em vez de zero, o que colapsa um sentinel `<div className="h-px">` (sem largura própria) a `width:0` — um elemento de área zero nunca dispara `IntersectionObserver`, confirmado ao vivo via `getBoundingClientRect()` no Browser pane. Ou seja, essa pendência não afeta só conteúdo visual (canvas/SVG) — também quebra silenciosamente qualquer sentinel de intersection observer dentro de uma demo squeezed
   0c. **Achado grave, prioridade alta**: `Button.tsx` — modo `confirm="doubleclick"` não reflete cliques reais (mouse/teclado/CDP) no DOM, só clique programático funciona. Ver seção `inputs/button (revisita)` acima pra investigação completa. Não resolvido — flagado como task separada
1. Decidir o destino de `ContextCard` (aposentar em favor de `<Tooltip variant="card">`, ou investir na reescrita pra JS) — levantado durante o Gate 5 acima, não decidido
2. ~~Cobertura de `focus-visible:outline-patina` em Tabs~~ — ✅ FECHADO pro `Tabs`: `<button role="tab">` não tinha nenhum anel de foco próprio, dependia só do fallback verde do dashboard — adicionado `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina` + `rounded-(--radius-xs)` no botão. Confirmado via Playwright (`outlineColor` real ao focar, não mais `rgb(16, 81, 68)` do fallback) — `e2e/cn/display/tabs.spec.ts` +1 teste, 12/12 chromium-desktop + mobile-chrome. **Ainda não verificado**: outros componentes com `role="tab"`/`role="menuitem"` fora do escopo desta checagem pontual — se aparecer o mesmo padrão numa validação futura, aplicar o mesmo fix
3. ~~`cn-install-block/CnInstallBlock.tsx` usa hex cru~~ — ✅ FECHADO. Confirmado exceção válida (bloco de terminal/CLI, paleta GitHub dark deliberadamente fixa, independente do tema claro/escuro do site). Comentário de exceção adicionado. De passagem, achado igual em `terminal-block/TerminalBlock.tsx` (mesmo `bg-[#0d1117]` sem comentário) — também documentado; e um `text-sm` cru (banido) no mesmo arquivo → `text-body-callout` (match exato)
   4b. **Achado sistêmico novo (via `overlays/quick-actions`)**: `QuickActions` e `Fab` (`src/components/ui/cn/fab/Fab.tsx`) implementam o mesmo conceito (FAB circular que expande num speed-dial de ações com `icon`/`label`/`onClick`/`intent`) de forma totalmente independente, sem `absorbs` ligando um ao outro no registry — ficam os dois visíveis na sidebar como se fossem componentes diferentes. Decidir se um deve absorver o outro (like `ContextCard`/`Tooltip`, pendência 1 acima) ou se a duplicação é intencional (grupos diferentes: `inputs` vs `overlays`) fica pra uma sessão futura
4. **Achado sistêmico novo (via `display/animated-list`)**: nenhuma `@keyframes` do token bridge (`kikitocn-tokens.css`) respeita `prefers-reduced-motion: reduce` — afeta todo componente que anima via essas keyframes (`AnimatedList` confirmado; suspeito em `MarqueeText`/`ScrollReveal`/`Toast`/outros que usam a mesma folha, não verificado individualmente ainda). Não é bug de um componente isolado — é decisão de infraestrutura de animação (adicionar um bloco `@media (prefers-reduced-motion: reduce)` global desligando/reduzindo duração das keyframes, ou fazer cada componente checar a media query via JS). Fica pendente decidir a abordagem antes de implementar

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
   7b. `?? ` misturado com `||` sem parênteses (`a ?? b || c`) é erro de sintaxe real (regra do ECMAScript), mas nem `tsc --noEmit` nem `eslint` acusaram nesta sessão — só o compilador de verdade do dev server (SWC/webpack) rejeitou, derrubando a rota inteira com 500 (achado no `SignaturePad`, Playwright que revelou via `page.goto` travando/erro 500, não lint/typecheck). Sempre que introduzir `??` misturado com `||`/`&&` na mesma expressão, parenteses explícitos são obrigatórios — e `tsc`/`eslint` não são suficientes como única rede de segurança pra isso, só rodar a página de verdade confirma.
7. `eslint-disable-next-line` num atributo JSX que fica em linha própria (padrão do Prettier pra tags com múltiplos atributos) não sobrevive a uma reformatação futura — o Prettier pode reindentar e a diretiva passa a apontar pra linha errada. Pra atributo único (ex: `tabIndex={0}`), usar `// eslint-disable-line <regra>` **na mesma linha do atributo** — sobrevive a `prettier --write` porque o comentário fica preso à linha, não à posição.

---

## Como retomar numa sessão nova/contexto limpo

1. Ler este arquivo inteiro + `CLAUDE.md`.
2. Rodar `git log --oneline -5` e `git status` pra confirmar que nada mudou desde `dfc7c49`.
3. Continuar `display/tabs` a partir de "Gate 3 tipografia" (ver seção acima), ou invocar `/validate-component display/tabs` de novo (o skill vai re-verificar do zero, o que é seguro mesmo com os 2 fixes já aplicados).
4. Não assumir os itens "suspeito, não testado" da seção de achados pendentes — testar cada um antes de tocar.
