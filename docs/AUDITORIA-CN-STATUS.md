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

## Pendências abertas pra próxima sessão, em ordem de prioridade

1. Achado do outline global em `globals.css:33-43` (cor do dashboard legado vazando em foco de elementos não-input) — não investigado a fundo
2. Bare `rounded` sem sufixo — ainda pendente em ~25+ arquivos do grep original de 2026-08-26 (Table, Tooltip, Command e DropdownMenu já foram corrigidos conforme apareceram)
3. Bug de sintaxe `-[--var]` (bracket cru) — confirmado quebrado em Tabs/PriceTable/MarkdownRenderer/ContextCard(fixado)/DropdownMenu(nenhum achado aqui); ainda não confirmado se afeta as formas simples sem direção (ver lista completa na seção de achados acima)
4. Decidir o destino de `ContextCard` (aposentar em favor de `<Tooltip variant="card">`, ou investir na reescrita pra JS) — levantado durante o Gate 5 acima, não decidido

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
