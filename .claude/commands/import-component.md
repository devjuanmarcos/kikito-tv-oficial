# Skill: Importação/Adaptação de Componente Externo

Você é o responsável por pegar código de bibliotecas externas (colado direto ou por link) e
transformar em um componente de primeira classe da Kikito CN — nunca um copy-paste cru.

Precedente real desta skill: `SquishPricingCard` (2026-08-30, commit `d3e28be`) — pricing card
com fundo animado adaptado de um exemplo `shadcndashboard`/framer-motion. Consultar
`src/components/ui/cn/squish-pricing-card/` como referência de "como deve ficar no final" sempre
que houver dúvida de nível de acabamento.

---

## Como usar

```
/import-component <cole o código aqui>
```

ou

```
/import-component <link pra uma página de componente>
```

O input varia — às vezes é o JSX/TSX completo de um componente + subcomponentes, às vezes é só
um link. Se for link, buscar o conteúdo (WebFetch) antes de continuar. Se o código vier com
imports de bibliotecas externas (`framer-motion`, `clsx`, `class-variance-authority`, ícones
específicos etc.), esses imports **não sobrevivem** — tudo tem que virar `@/lib/utils`,
`@/lib/motion`, `motion/react`, ícones SVG inline ou componentes CN já existentes.

---

## Contexto do projeto

- **Projeto:** `D:\DEVJUANMARCOS\PROJETOS\KIKITO\kikito-tv-oficial`
- **Componentes:** `src/components/ui/cn/<nome>/` (padrão: `<Nome>.tsx`, `<nome>.types.ts`, `index.ts`)
- **Fonte curada de tudo** (grupo, título, descrição, props, peerDeps, demo de docs): `src/lib/cn-registry.tsx`
- **Metadados do pacote CLI publicado** (`npx kikitocn add`): `scripts/registry-meta.mjs` —
  **`group` tem que bater EXATAMENTE com o de `cn-registry.tsx`**, senão
  `npm run registry:build` trava sozinho (`scripts/check-registry-sync.mjs`, criado 2026-08-30)
- **Showcase (demo + rota):** `src/app/[locale]/cn/[group]/[component]/_showcase.tsx`
  — função `<Nome>Demo()` + entrada no mapa `DEMOS` no formato `"<group>/<nome>": <Nome>Demo`
- **Motion:** `src/lib/motion/` (`tokens.ts`, `transitions.ts`, `variants.ts`, `orchestration.ts`,
  reexportado por `index.ts`)
- **Tokens de design:** `src/styles/kikitocn-tokens.css` + tabelas completas no `CLAUDE.md` da raiz
  (Cores/Tipografia/Radius/Spacing/Animação/Bordas) — **ler antes de adaptar**, é a fonte da verdade
- **Biblioteca vendorizada local pra inspiração de código externo avançado:**
  `D:\DEVJUANMARCOS\PROJETOS\TEMPLATES\shadcndashboard` (não sites aleatórios da internet —
  ver `docs/component-import/animation-backport/PLAN.md` pro precedente de uso)
- **Testes:** `e2e/cn/<group>/<nome>.spec.ts`

---

## Decisão 0 — componente novo ou variante/prop de um existente?

Antes de criar qualquer arquivo, checar se já existe algo com sobreposição conceitual:

1. Grep em `src/lib/cn-registry.tsx` por palavras-chave do que o código faz (nome do padrão,
   sinônimos, `keywords:` de entradas próximas).
2. Se existir um componente correlato, ler o `.tsx` dele por completo e decidir com evidência,
   não achismo:
   - **Mesmo conceito, API compatível, só faltando um caso** → vira prop/variant nova no
     componente existente (ex.: `shape`, `intent`, `effect` novo).
   - **Conceito visivelmente diferente, ou API/estrutura de dados incompatível** → componente
     novo. Documentar a decisão num comentário no topo do arquivo, igual ao de
     `SquishPricingCard.tsx` (explica por que não virou variant do `PricingCard`).
3. Nunca forçar um componente com propósito diferente (ex.: card de comparação de planos) a
   também servir de spotlight de marketing só porque "ambos são pricing" — casos de uso
   diferentes merecem componentes diferentes (mesmo raciocínio já usado pro chart/text-effect
   não deveriam ter sido absorvidos um pelo outro).

---

## Etapas de adaptação (nenhuma é opcional)

### 1. Cores

Toda cor sólida raw (`indigo-500`, `#3b82f6`, `rgb(...)`, `hsl(...)`) vira um dos tokens de
intent da tabela do `CLAUDE.md` (`patina`/`kinpaku`/`violet`/`rose`/`danger`/`success`/`warning`/
`info`/`neutral`), tipicamente exposta como uma prop `intent` no componente novo com um mapa
`Record<Intent, string>` (ver `INTENT_BG`/`INTENT_FG` em `SquishPricingCard.tsx` ou
`INTENT_VARIANT` em `Button.tsx` como modelo). Texto/borda sobre uma cor sólida de intent usa o
`<intent>-fg` correspondente (já validado WCAG AA nos 2 temas, não recalcular).

**Exceção real e documentada** (não é desculpa genérica): glare/overlay de luz ou sombra que
precisa ser literalmente branco/preto translúcido *independente* do tema (reflexo de luz sobre
um fundo colorido, sombra decorativa) — manter literal com comentário
`/* no token equivalent: ... */` citando o motivo específico, igual ao overlay das formas do
`SquishPricingCard` ou o glare do `Card.tsx`.

### 2. Tipografia

Toda classe `text-Ns`/`text-[Nrem]`/`text-[Npx]` mapeia pro token mais próximo da tabela do
CLAUDE.md (`text-display-01/02`, `text-heading-01..05`, `text-body-title/paragraph/callout/caption`).
Documentar com `/* below scale minimum: ... */` só se for genuinamente um micro-label abaixo de
`text-body-caption` (0.75rem) — nunca conteúdo primário.

### 3. Spacing / Radius / Bordas

- Padding/gap genérico → `p-(--spacing-*)`/`gap-(--spacing-*)` (tabela no CLAUDE.md, âncora nos
  steps do Tailwind: 0.5/1/1.5/2/3/4/6/8/12).
- **Exceção**: se o valor for uma escala própria do componente (dimensão calibrada por
  `size="sm"|"md"|"lg"`, não espaçamento estrutural genérico) — documentar como tal, não migrar.
- `rounded-*` → token de radius (`rounded-(--radius-sm|md|lg|xl|2xl)`). Nunca `rounded` puro sem
  sufixo (resolve pro radius nativo do Tailwind, não pro token — bug já achado 2026-08-26).
  `--radius-base` não tem classe direta, só `rounded-(--radius-base)`.
- `border-N` (largura) → `border-(length:--border-width-*)` — **o hint `length:` é obrigatório**,
  `border-(--var)` sem ele é silenciosamente ignorado pelo Tailwind v4 (zero erro, zero efeito).
  Cor de borda separada: `border-rule` (nunca hardcode).

### 4. Motion — regra central desta skill

Todo `transition`/`duration`/`ease` solto do código de origem (framer-motion ou CSS) precisa
virar um preset de `@/lib/motion`:

1. Procurar em `src/lib/motion/tokens.ts` + `transitions.ts` + `variants.ts` se já existe um
   preset com a MESMA forma (duração+easing, ou variants de entrada/saída). Reusar se existir
   (ex.: menu que "brota" do trigger → `scaleIn`+`transitionStandard`, já usado por
   DropdownMenu/Autocomplete/SplitButton/NavigationMenu).
2. Se não existir, **adicionar antes de consumir** — nunca inline. Se a duração do código de
   origem excede o teto documentado (`--ks-motion-slower`, 500ms), preferir ajustar pra um valor
   já existente na escala em vez de criar um degrau novo só pra esse componente (ver
   `transitionSquish`, que trocou os 1000ms da origem por `MOTION_DURATION.slower` = 500ms).
   Easing nomeado do framer-motion (`backInOut`, `anticipate` etc, string não cubic-bezier) pode
   virar entrada nova em `MOTION_EASE` como string literal — `motion/react` aceita.
3. Se o componente tem `AnimatePresence`/`whileHover`/toggle de conteúdo condicional
   (`{estado && <div>}`), **nunca deixar sem transição** — é o bug mais recorrente achado na
   varredura de showcase de 2026-08-30 (Radio, Command, Split Button, Feedback Widget, Vertical
   Nav, Navigation Menu todos tinham isso). `AnimatePresence` + `scaleIn`/`fadeIn`/`slideInUp` +
   `transitionStandard`/`transitionSquish` conforme o formato do widget.
4. Efeitos de mouse-tracking contínuo (glow que segue o cursor, tilt 3D, spotlight) **não** usam
   `motion` — usam CSS custom properties atualizadas via `onMouseMove` direto (ver
   `Card.tsx` variantes glow/tilt/spotlight, ou o drag 1:1 do `SwipeCard`). Motion não é a
   ferramenta certa pra rastreamento de posição em tempo real; não forçar.
5. Componente que importa `motion` declara `peerDeps: ["@/lib/utils", "@/lib/motion", "motion"]`
   no registry.

### 5. Reaproveitamento de componentes CN existentes

Antes de reimplementar um botão/badge/input/tooltip/etc do zero dentro do componente novo,
checar se já existe equivalente em `src/components/ui/cn/` e importar de lá (ex.: usar
`<Button>` CN em vez de um `<button className="...">` cru, `<Badge>` em vez de um `<span>`
pill customizado). Só reimplementar inline quando o componente CN existente não cobrir o caso
(documentar por quê, igual aos comentários de "achado real" que já existem no código).

### 6. Registro completo (nenhum destes é dispensável)

1. Arquivos do componente: `<nome>/<Nome>.tsx`, `<nome>/<nome>.types.ts`, `<nome>/index.ts`.
2. `src/lib/cn-registry.tsx`: entrada nova (ou prop nova numa existente) com `name`, `title`,
   `group`, `description`, `filePath`, `peerDeps` (se usa motion), `props` (todas, com tipo e
   descrição em português), `keywords` (sinônimos em pt/en que alguém buscaria).
3. `scripts/registry-meta.mjs`: entrada correspondente com **o mesmo `group`** — rodar
   `npm run registry:check` depois pra confirmar (falha alto se divergir).
4. `_showcase.tsx`: função `<Nome>Demo()` cobrindo pelo menos 2 variações reais (intents,
   tamanhos, ou variantes do próprio componente), entrada no mapa `DEMOS`, import no topo do
   arquivo.
5. `e2e/cn/<group>/<nome>.spec.ts`: template mínimo (render sem crash, sem erro de console) +
   pelo menos 1 teste de comportamento real (interação, motion aplicando transform, conteúdo
   correto). Ver `e2e/cn/display/squish-pricing-card.spec.ts` como modelo.
6. `npm run registry:build` — roda o checker de sincronia automaticamente antes de gerar
   qualquer saída; se travar, corrigir `registry-meta.mjs` antes de prosseguir.

### 7. Verificação (não pular nenhuma)

1. `npx tsc --noEmit` — 0 erros.
2. `npx eslint <arquivos tocados>` — 0 erros (warnings pré-existentes tipo
   `sonarjs/no-duplicate-string` não bloqueiam).
3. `npx playwright test e2e/cn/<group>/<nome>.spec.ts --project=chromium-desktop` — 100% verde.
4. **Prova visual real via Playwright, nunca via o painel de browser interativo sozinho** — o
   pane deste ambiente serve dados/JS cacheados de forma imprevisível (achado repetido 6+ vezes
   na sessão de 2026-08-30, causa raiz real era um bug de cache em `next.config.ts` — ver
   commit `4824a9d` — mas mesmo corrigido, cache já gravado antes não se autolimpa). Tirar
   screenshot com um script Playwright temporário (`page.screenshot()`), olhar o resultado, só
   então confiar. Apagar o script/screenshot temporário depois.
5. Se o componente tem hover/interação visual, testar o hover de verdade (`locator.hover()` +
   `waitForTimeout` cobrindo a duração da transição) antes de aceitar como pronto.

### 8. Commit

Uma mensagem detalhada em português explicando: o que a origem fazia, por que virou componente
novo (ou variant), cada adaptação de token/motion feita e por quê (não só listar, explicar a
escolha quando não for óbvia), e a verificação rodada. Ver `d3e28be` (SquishPricingCard) como
modelo de nível de detalhe esperado.

---

## Regras não-negociáveis (resumo do CLAUDE.md — checar antes de considerar pronto)

- Zero hex/`rgb()`/`hsl()` cru fora das exceções documentadas.
- Zero `bg-primary`/`bg-card`/`border-border`/`text-muted-foreground`/`bg-destructive`/
  `text-gray-*`/`bg-blue-*` (vocabulário do dashboard, nunca dentro de `cn/`).
- Zero `text-sm`/`text-lg`/`text-[Npx]` arbitrário sem mapear pra escala.
- Zero `rounded` puro sem sufixo/token.
- Zero `border-(--var)` sem o hint `length:`.
- Zero número mágico de `motion` solto (`transition={{ duration: 0.3 }}` inline) — sempre preset.
- Todo componente que importa `motion` declara `peerDeps` no registry.
- `group` de `cn-registry.tsx` e `registry-meta.mjs` idênticos, sempre.

---

## Relatório final

Ao terminar, emitir:

```
═══════════════════════════════════════════════════
  IMPORTAÇÃO DE COMPONENTE — Kikito CN
  Origem: <link ou "código colado">
  Componente novo: <nome> / Grupo: <group>  (ou: prop nova em <componente existente>)
  Data: <data>
═══════════════════════════════════════════════════

  Decisão novo-vs-variant   [ justificativa em 1 linha ]
  Cores adaptadas           [ mapa origem → intent ]
  Tipografia adaptada       [ mapa origem → token ]
  Spacing/Radius/Bordas     [ mapa origem → token, exceções documentadas ]
  Motion                    [ preset reusado ou criado + por quê ]
  Componentes CN reusados   [ lista, ou "nenhum aplicável" ]

  Registro                  [ ✅ cn-registry.tsx / ✅ registry-meta.mjs / ✅ demo / ✅ e2e ]
  registry:build            [ ✅ limpo / detalhe se travou e como corrigiu ]
  tsc / eslint               [ ✅ 0 erros ]
  Playwright                [ N/N testes, screenshot conferido ]

═══════════════════════════════════════════════════
  RESULTADO: ✅ PRONTO PRA COMMIT
═══════════════════════════════════════════════════
```
