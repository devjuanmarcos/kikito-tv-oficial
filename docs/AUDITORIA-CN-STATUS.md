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
- **Nota**: `FilterToggleGroup` (variante `filter`, absorve `FilterBar`) tem o mesmo padrão `multiSelect = true` — **não mexido aqui** porque pra filtros multi-seleção como default é uma escolha de UX defensável (diferente de chips, que geralmente representam uma escolha exclusiva tipo tab/radio visual) e está fora do escopo desta validação pontual do ChipGroup; verificar quando `inputs/filter-bar` for validado formalmente

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

## Pendências abertas pra próxima sessão, em ordem de prioridade

0. **Achado sistêmico — ✅ VARREDURA COMPLETA**: o campo `absorbs` de `cn-registry.tsx` se provou **falso oito vezes** (`avatar`→`avatar-group`, `accordion`→`accordion-group`/`multi-accordion`/`collapsible`, `grid-pattern`→`particle-field`, `scroll-spy`→`table-of-contents`, `stepper`→`dot-stepper`/`progress-steps`, `badge`→`tag`/`status-badge`/`ping`, e dois casos **parciais**: `tooltip`→`context-card` e `input`→`password-input`/`search-input`, ambos dentro de listas majoritariamente verdadeiras) — em todos os casos os componentes "absorvidos" são implementações paralelas reais (ou, nos parciais, têm funcionalidade real não-redundante), nunca de fato unificadas/replicadas, e ficam escondidos da sidebar por isso (`getVisibleComponents()` filtra qualquer nome em `absorbs`). **Todas as ~20 entradas de `absorbs:` em `cn-registry.tsx` foram conferidas nesta sessão** — não é mais pendência, registrado aqui só como referência dos critérios usados: abrir o arquivo do Super e conferir se há de fato um dispatcher (`switch`/discriminated union) que produz a MESMA funcionalidade do absorvido, como em `Table`/`Progress`/`Timeline`/`Chart`/`TextEffect`/`Card`/`Button`/`Select` (confirmados verdadeiros), e não uma implementação solta ou um equivalente-mas-incompleto, como em `Avatar`/`Accordion`/`GridPattern`/`ScrollSpy`/`ContextCard`/`Stepper`/`Badge`/`PasswordInput`+`SearchInput` (confirmados falsos ou parciais). Lista completa de verdadeiros confirmados: `Table`(data-grid/data-list/tree-table), `Progress`(progress-ring/gauge/skill-bar), `Timeline`(scroll-timeline/timeline-progress/activity-feed), `Chart`(6 renderers, é router não absorção), `Modal`(alert-dialog/drawer/side-panel), `Command`(command-bar/spotlight-search), `DropdownMenu`(context-menu/floating-menu), `ToggleGroup`(segmented-control/chip-group/filter-bar), `Stat`(metric-card/stats-card), `DatePicker`(date-range-picker/calendar), `Kbd`(shortcut-key), `Tooltip`(rich-tooltip/popover/hover-card, SEM context-card), `Card`(5 effects, wrappers genuínos), `Button`(magnetic/confetti/confirm — confirm-button não delegava, corrigido), `Input`(number/currency/phone/floating-label, SEM password/search), `Select`(multi/rich/combobox, dispatch real via `switch(mode)`), `Rating`(rating-input), `Slider`(range-slider). Se um novo Super component for adicionado no futuro com `absorbs`, aplicar o mesmo critério antes de confiar no campo.
   0b. **Achado sistêmico novo**: em `mobile-chrome` (~393px), a sidebar do showcase (`cn-sidebar.tsx`) não colapsa pra menu hambúrguer e o grid de demos cai pra 2 colunas — a caixa de conteúdo do `Frame` fica espremida a ~66px de largura total (conteúdo útil ≈ 0px depois do padding). Confirmado idêntico em `grid-pattern`/`particle-field`/`pin-board` (não relacionados entre si) — afeta **qualquer** demo que dependa de largura real pra renderizar algo visível (canvas, SVG com `viewBox` proporcional, etc.) nesse breakpoint específico. Não é bug de nenhum componente individual; é do layout responsivo do showcase (`cn-sidebar.tsx` + grid de `_showcase.tsx`). Fica pendente decidir: colapsar sidebar em mobile, ou grid de 1 coluna abaixo de certo breakpoint
   0c. **Achado grave, prioridade alta**: `Button.tsx` — modo `confirm="doubleclick"` não reflete cliques reais (mouse/teclado/CDP) no DOM, só clique programático funciona. Ver seção `inputs/button (revisita)` acima pra investigação completa. Não resolvido — flagado como task separada
1. Decidir o destino de `ContextCard` (aposentar em favor de `<Tooltip variant="card">`, ou investir na reescrita pra JS) — levantado durante o Gate 5 acima, não decidido
2. ~~Cobertura de `focus-visible:outline-patina` em Tabs~~ — ✅ FECHADO pro `Tabs`: `<button role="tab">` não tinha nenhum anel de foco próprio, dependia só do fallback verde do dashboard — adicionado `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina` + `rounded-(--radius-xs)` no botão. Confirmado via Playwright (`outlineColor` real ao focar, não mais `rgb(16, 81, 68)` do fallback) — `e2e/cn/display/tabs.spec.ts` +1 teste, 12/12 chromium-desktop + mobile-chrome. **Ainda não verificado**: outros componentes com `role="tab"`/`role="menuitem"` fora do escopo desta checagem pontual — se aparecer o mesmo padrão numa validação futura, aplicar o mesmo fix
3. ~~`cn-install-block/CnInstallBlock.tsx` usa hex cru~~ — ✅ FECHADO. Confirmado exceção válida (bloco de terminal/CLI, paleta GitHub dark deliberadamente fixa, independente do tema claro/escuro do site). Comentário de exceção adicionado. De passagem, achado igual em `terminal-block/TerminalBlock.tsx` (mesmo `bg-[#0d1117]` sem comentário) — também documentado; e um `text-sm` cru (banido) no mesmo arquivo → `text-body-callout` (match exato)

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
