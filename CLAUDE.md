# Kikito TV — Regras do Design System

Este repositório contém **dois sistemas de design separados**. Nunca misture o vocabulário de um dentro do outro.

| Sistema                                                     | Onde vive                                             | Vocabulário                                                                                        | Documentado em                                   |
| ----------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Dashboard / Admin**                                       | `src/components/ui/**` (exceto `cn/`), telas do admin | shadcn puro: `bg-primary`, `bg-card`, `border-border`, `text-muted-foreground`, `bg-destructive`   | [.docs/DESIGN_SYSTEM.md](.docs/DESIGN_SYSTEM.md) |
| **Kikito CN** (biblioteca publicada via `npx kikitocn add`) | `src/components/ui/cn/**`                             | tokens semânticos próprios: `bg-patina`, `bg-raised`, `border-rule`, `text-foreground/muted/faint` | esta seção + skill `/validate-component`         |

Antes de editar um arquivo, identifique qual sistema ele pertence pelo path. **Um componente em `cn/` nunca deve conter `bg-primary`, `bg-card`, `border-border`, `text-muted-foreground`, `bg-destructive`, `text-gray-*`, `bg-blue-*`, hex hardcoded ou qualquer classe fora da tabela abaixo.** Se encontrar isso durante qualquer edição — mesmo que não pedida explicitamente — corrija para o token canônico correspondente e avise o que foi trocado.

---

## Tokens canônicos — Kikito CN (`src/components/ui/cn/**`)

Fonte: `src/styles/kikitocn-tokens.css` (bloco `@theme inline`). Nunca usar valor cru (hex, `hsl()`, `rgb()`, cinza do Tailwind) quando existe token equivalente aqui.

### Cores

| Categoria           | Classes                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| Superfícies         | `bg-canvas` `bg-base` `bg-raised` `bg-float` `bg-sunken` `bg-graphite` `bg-graphite-2`              |
| Texto               | `text-foreground` `text-muted` `text-faint`                                                         |
| Borda               | `border-rule`                                                                                       |
| Patina (primary)    | `bg-patina` `text-patina` `text-patina-fg` `bg-patina-soft` `text-patina-soft-fg` `bg-patina-hover` |
| Kinpaku (secondary) | `bg-kinpaku` `text-kinpaku` `text-kinpaku-fg` `bg-kinpaku-soft` `text-kinpaku-soft-fg`              |
| Violet              | `bg-violet` `text-violet` `text-violet-fg` `bg-violet-soft` `text-violet-soft-fg`                   |
| Rose                | `bg-rose` `text-rose` `text-rose-fg` `bg-rose-soft` `text-rose-soft-fg`                             |
| Danger              | `bg-danger` `text-danger` `text-danger-fg` `bg-danger-soft` `text-danger-soft-fg`                   |
| Success             | `bg-success` `text-success` `text-success-fg` `bg-success-soft` `text-success-soft-fg`              |
| Warning             | `bg-warning` `text-warning` `text-warning-fg` `bg-warning-soft` `text-warning-soft-fg`              |
| Info                | `bg-info` `text-info` `text-info-fg` `bg-info-soft` `text-info-soft-fg`                             |
| Neutral             | `bg-neutral` `text-neutral` `text-neutral-fg` `bg-neutral-soft` `text-neutral-soft-fg`              |

CSS var fallback (quando Tailwind não alcança, ex. dentro de `<canvas>`, `style=`, animação inline): `var(--ks-patina)`, `var(--ks-danger)` etc. `--ks-primary` e `--ks-secondary` são aliases válidos de `--ks-patina`/`--ks-kinpaku` (não são do sistema legado — só existem quando prefixados com `--ks-`).

**Exceções válidas (documentar com comentário no código):**

- SVG decorativo sem significado semântico: `fill="currentColor"`.
- Gradiente/glare que precisa ser branco/literal independente do tema (ex. reflexo de luz): comentário `/* no token equivalent */`.
- Cor exigida por API do browser sem suporte a CSS var (ex. `canvas` 2D `fillStyle`): comentário explicando a limitação técnica.

### Tipografia

Mesma escala usada no dashboard (`tailwind.config.ts`, plugin de tipografia) — isso é compartilhado entre os dois sistemas de propósito.

| Token                 | Valor    | Classe                                                                    |
| --------------------- | -------- | ------------------------------------------------------------------------- |
| `text-display-01`     | 7.5rem   | `.display-01`                                                             |
| `text-display-02`     | 3.75rem  | `.display-02`                                                             |
| `text-heading-01`     | 3.5rem   | `.heading-01`                                                             |
| `text-heading-02`     | 3rem     | `.heading-02` `.heading-02-bold` `.heading-02-medium` `.heading-02-light` |
| `text-heading-03`     | 2.25rem  | `.heading-03` `.heading-03-bold` `.heading-03-medium`                     |
| `text-heading-04`     | 1.75rem  | `.heading-04` `.heading-04-bold` `.heading-04-medium` `.heading-04-light` |
| `text-heading-05`     | 1.5rem   | `.heading-05` `.heading-05-bold` `.heading-05-medium` `.heading-05-light` |
| `text-body-title`     | 1.25rem  | `.body-title` `.body-title-bold` `.body-title-medium` `.body-title-light` |
| `text-body-paragraph` | 1rem     | `.body-paragraph` `.body-paragraph-bold` `.body-paragraph-medium`         |
| `text-body-callout`   | 0.875rem | `.body-callout` `.body-callout-bold` `.body-callout-medium`               |
| `text-body-caption`   | 0.75rem  | `.body-caption` `.body-caption-bold` `.body-caption-medium`               |

Nunca usar `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-[Npx]`, `text-[Nrem]` cru. Sempre mapear pro token mais próximo da tabela acima.

**Exceção:** tamanho abaixo de `text-body-caption` (0.75rem) só quando o elemento é genuinamente um micro-label (eyebrow, badge inline, glyph decorativo) — nunca conteúdo primário. Documentar com comentário `/* below scale minimum: <motivo> */`.

### Radius

| Token           | Valor  |
| --------------- | ------ |
| `--radius-xs`   | 2px    |
| `--radius-sm`   | 6px    |
| `--radius-base` | 8px    |
| `--radius-md`   | 10px   |
| `--radius-lg`   | 14px   |
| `--radius-xl`   | 20px   |
| `--radius-2xl`  | 28px   |
| `--radius-pill` | 9999px |

Sintaxe: `rounded-(--radius-sm)`. Para `xs`/`sm`/`md`/`lg`/`xl`/`2xl` a classe direta (`rounded-sm` etc) também funciona — o `@theme inline` sobrescreve o namespace nativo do Tailwind, confirmado via computed style (`rounded-sm` → 6px). **Exceção: `--radius-base` não tem classe direta** (`base` não é um step padrão do Tailwind — `rounded-base` resolve pra `0px`, silenciosamente errado). Pra esse token, `rounded-(--radius-base)` é obrigatório.

Nunca usar `rounded-[Npx]` arbitrário quando existe token próximo. Exceção documentada só quando o valor está genuinamente fora da escala (menor que 2px ou maior que 28px) — comentário `/* above scale maximum */` ou `/* below scale minimum */`.

### Spacing (migração em andamento — ver plano abaixo)

**Fronteira importante — dois eixos diferentes, nunca confundir:**

1. **Spacing estrutural/genérico** (padding de card, gap entre campos, espaço entre seções) → **alvo da migração pros tokens abaixo.**
2. **Escala própria de tamanho por componente** (`SIZE`/`SIZE_INPUT` por `size="sm"|"md"|"lg"`, `PADDING_CLS` do Card por variante) → **NUNCA migrar pra token de spacing.** É calibração visual própria do componente (padding vs. font-size vs. ícone naquele tier específico), não layout genérico. Acoplar ao token de spacing generalista quebraria o ajuste fino na primeira mudança de token feita por outro motivo. Documentar como "escala própria do componente" quando encontrar, não como violação.

Tokens em `src/styles/kikitocn-tokens.css`, ancorados 1:1 nos steps do Tailwind já dominantes no código (confirmado por auditoria de frequência real em 2026-08-26 — `gap-2`, `px-4`, `px-3` são os mais usados). Ficam **fora** do bloco `@theme inline` (não geram classe própria tipo `p-xs`); aplicar via sintaxe de var arbitrária, igual ao padrão já usado pra radius:

| Token           | Valor    | Step Tailwind equivalente | Uso                  |
| --------------- | -------- | ------------------------- | -------------------- |
| `--spacing-3xs` | 0.125rem | 0.5                       | `p-(--spacing-3xs)`  |
| `--spacing-2xs` | 0.25rem  | 1                         | `p-(--spacing-2xs)`  |
| `--spacing-xs`  | 0.375rem | 1.5                       | `p-(--spacing-xs)`   |
| `--spacing-sm`  | 0.5rem   | 2                         | `gap-(--spacing-sm)` |
| `--spacing-md`  | 0.75rem  | 3                         | `px-(--spacing-md)`  |
| `--spacing-lg`  | 1rem     | 4                         | `px-(--spacing-lg)`  |
| `--spacing-xl`  | 1.5rem   | 6                         | `px-(--spacing-xl)`  |
| `--spacing-2xl` | 2rem     | 8                         | `p-(--spacing-2xl)`  |
| `--spacing-3xl` | 3rem     | 12                        | `p-(--spacing-3xl)`  |

Cada token bate exato com um step numérico já usado — migrar uma classe (`gap-2` → `gap-(--spacing-sm)`) é troca de nome, zero diferença visual.

**Status:** decisão tomada (2026-08-26). Migração é **componente a componente**, não em massa — ver `docs/UNIFICACAO-COMPONENTES.md` e o fluxo de `/validate-component` pra ordem de prioridade. Ao validar ou editar um componente CN:

1. Confirmar primeiro se o spacing é estrutural (migra) ou escala-por-tamanho (não migra, documenta como está).
2. Se estrutural e bate exato com um token acima → trocar pela sintaxe `<propriedade>-(--spacing-*)`.
3. Se estrutural e não bate exato (raro, dado que a escala cobre os steps 0.5–12) → documentar comentário explicando o valor.
4. Nunca introduzir spacing novo fora da escala numérica do Tailwind ou dos tokens semânticos sem comentário explicando o porquê.

## Animação — Kikito CN (`src/components/ui/cn/**`)

6ª categoria de token, mesma lógica de Cores/Tipografia/Radius/Spacing acima. Fonte: `src/styles/kikitocn-tokens.css` (bloco `--ks-motion-*`, fora do `@theme inline`, mesmo padrão de spacing) + `src/lib/motion/` (camada TS que espelha os valores pra consumo direto nas props do pacote `motion`).

### Tokens CSS

| Token                           | Valor                            | Uso                                                                                             |
| ------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------- |
| `--ks-motion-instant`           | 80ms                             | Micro-interação mais rápida (ex.: rotação de ícone)                                             |
| `--ks-motion-fast`              | 150ms                            | Padrão de transições pequenas — valor mais frequente já em produção antes deste sistema existir |
| `--ks-motion-standard`          | 200ms                            | Padrão de painéis/menus (dropdown, select)                                                      |
| `--ks-motion-slow`              | 300ms                            | Transições maiores, mais deliberadas                                                            |
| `--ks-motion-slower`            | 500ms                            | Teto — raro, só pra movimento genuinamente grande                                               |
| `--ks-motion-ease-standard`     | `cubic-bezier(0.22, 1, 0.36, 1)` | Curva padrão (mesma de `--ease-out-quint`, já existente)                                        |
| `--ks-motion-ease-decelerate`   | `cubic-bezier(0, 0, 0.2, 1)`     | Entrada — desacelera até parar                                                                  |
| `--ks-motion-ease-accelerate`   | `cubic-bezier(0.4, 0, 1, 1)`     | Saída — acelera até sumir                                                                       |
| `--ks-motion-distance-sm/md/lg` | 8px / 16px / 24px                | Deslocamento em variantes de entrada/saída (slide-in/slide-up)                                  |

### Presets TS (`src/lib/motion`, import único via `@/lib/motion`)

| Export                                                                                     | O que é                                                                                                                    |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `MOTION_DURATION` / `MOTION_EASE` / `MOTION_DISTANCE` / `MOTION_SPRING`                    | Espelham os tokens CSS acima em número (segundos/px), pra props do `motion`                                                |
| `fadeIn`, `scaleIn`, `scaleInDown`, `scaleInVertical`, `slideInUp`                         | `Variants` nomeadas — vocabulário próprio de entrada/saída, nunca inventar `initial`/`animate`/`exit` solto num componente |
| `transitionInstant/Fast/Standard/Slow`, `transitionEnter/Exit`                             | `Transition` (tween) nomeadas                                                                                              |
| `springGentle` (150/25, colhido do `Modal`) / `springSnappy` (350/25, colhido do `Select`) | `Transition` (spring) nomeadas                                                                                             |
| `staggerContainer(staggerDelay?, delayChildren?)`                                          | Orquestra entrada sequencial de filhos                                                                                     |

### Regras

1. Componente novo que anima via `motion` **nunca** usa número mágico solto (`transition={{ duration: 0.2 }}`) — sempre um preset de `@/lib/motion`. Se o padrão de origem não existir ainda, adicionar ao preset primeiro (ver `docs/component-import/motion-infrastructure/PLAN.md`).
2. `reducedMotion="user"` aplicado globalmente via `<MotionConfig>` em `src/providers/ThemeProvider.tsx` — cobre toda animação `motion` automaticamente. **Não cobre CSS** (`@keyframes`/`transition-*` do Tailwind) — esse caso já tem reset global próprio em `kikitocn-tokens.css` (ver seção de bug latente / auditoria).
3. Componente que importa `motion` declara `peerDeps: ["@/lib/motion", "motion"]` no registry (`cn-registry.tsx`).
4. `npx kikitocn add <componente>` empacota `src/lib/motion/**` e `src/lib/utils.ts` automaticamente (`registry:lib` — resolvido 2026-08-29, ver `docs/design-system-maintenance/registry-shared-libs/PLAN.md`). Não precisa mais declarar isso manualmente em lugar nenhum — `scripts/build-registry.mjs` detecta o import e adiciona sozinho.

## Bordas (largura) — Kikito CN (`src/components/ui/cn/**`)

6ª categoria de token, mesma lógica de Cores/Tipografia/Radius/Spacing/Animação acima. Fonte: `src/styles/kikitocn-tokens.css` (bloco `:root, .dark`, fora do `@theme inline`, mesmo padrão de spacing/motion — não é um namespace themeável nativo do Tailwind v4 como `--radius-*`, então não recebe alias de classe própria).

### Tokens

Ancorados em auditoria de frequência real (2026-08-29), mesma metodologia já usada pra Spacing/Motion — nunca inventar um valor sem confirmar uso real primeiro.

| Token                     | Valor | Uso real (frequência)                                                                          |
| ------------------------- | ----- | ---------------------------------------------------------------------------------------------- |
| `--border-width-hairline` | 1px   | Padrão dominante (~1150 ocorrências) — contorno normal de card/input/divider                   |
| `--border-width-thin`     | 1.5px | 12x — Avatar, Button, Callout, ColorPicker, Radio, Spinner, Timeline                           |
| `--border-width-base`     | 2px   | 27x — ênfase (foco, seleção, badge)                                                            |
| `--border-width-thick`    | 3px   | 12x, majoritariamente faixa de destaque lateral — QuoteBlock, MultiAccordion, MarkdownRenderer |
| `--border-width-heavy`    | 4px   | 5x — faixa de destaque maior                                                                   |

**Exceção sem token**: 2.5px (2 ocorrências — Spinner/AvatarGroup/UserCard) é rara demais pra token próprio. Documentar com comentário `/* below scale minimum */`-style explicando o valor quando aparecer, igual à regra já usada pra spacing fora da escala.

Cor de borda continua em `border-rule` (token de Cores, já existente) — nunca hardcode. Estilo (`dashed`/`dotted`/`solid`) já é 100% coberto pelas classes nativas do Tailwind (`border-dashed` etc.) — palavras-chave discretas, sem escala numérica pra tokenizar, nenhum gap aqui.

### Sintaxe de consumo — achado real, ler antes de usar

Ao contrário de `rounded-(--radius-sm)` e `gap-(--spacing-sm)` (que funcionam com a forma "nua"), a forma nua `border-(--var)` / `border-l-(--var)` **é silenciosamente ignorada pelo Tailwind v4** — a classe aparece no HTML normalmente, zero erro de build, zero warning, mas **zero efeito visual** (`border`/`border-l` são ambíguos entre `border-width` e `border-color`, e sem um hint de tipo o compilador simplesmente descarta a classe). Confirmado ao migrar `QuoteBlock` nesta sessão: computed `border-width` ficava em `0px` com a sintaxe nua.

**Sempre usar o hint de tipo `length:`:**

```
border-(length:--border-width-thick)
border-l-(length:--border-width-thick)
```

Nunca `border-(--border-width-thick)` sem o `length:` — parece funcionar (nenhum erro), mas não aplica nada.

### Status

Decisão tomada (2026-08-29), primeiro consumidor real feito em `QuoteBlock.tsx` (variantes `default`/`bordered`), confirmado visualmente via Playwright (`border-width: 1px` / `border-left-width: 3px` computados corretamente). Migração é **componente a componente**, mesmo fluxo já estabelecido pra Spacing — não migrar em massa. Ao validar ou editar um componente CN, se encontrar `border-[Npx]` arbitrário ou `border-2`/`border-4`/etc. batendo exato com um token acima, trocar pela sintaxe `length:` acima; se não bater exato (raro, a escala já cobre 1/1.5/2/3/4px), documentar comentário explicando o valor.

## Bug latente achado por auditoria: `rounded` sem sufixo

`rounded` puro (sem `-xs`/`-sm`/etc) resolve pro `--radius` **nativo** do Tailwind (não sobrescrito por este projeto), não pra nenhum token daqui — ao contrário do que parece à primeira vista. Sempre usar `rounded-(--radius-*)` ou a classe direta com sufixo. Achado em ~30 arquivos do `cn/` durante a auditoria de 2026-08-26 (corrigido só nos componentes já validados; os demais ainda têm essa pendência).

---

## Rodando o dev server + Playwright juntos

`playwright.config.ts` tem `webServer: { command: "pnpm dev", url: "http://localhost:3000", reuseExistingServer: true }`. Se a porta 3000 estiver livre quando o Playwright rodar, ele sobe **seu próprio** `next dev` — e como isso escreve no mesmo diretório `.next` que um servidor manual rodando em outra porta, os dois processos corrompem a build um do outro (sintoma: 404/500 aleatório em chunk `.js`, `ENOENT` no log do servidor apontando pra `.next/server/app/...`).

**Regra:** ao rodar o servidor de desenvolvimento manualmente (`preview_start`/`npm run dev`) para depois rodar Playwright, sempre usar a **porta 3000** (a mesma do `playwright.config.ts`) — assim `reuseExistingServer` reaproveita em vez de duplicar. Se precisar de outra porta por algum motivo, garantir que _algo_ responda em 3000 antes de rodar os testes, ou os testes vão subir um segundo servidor concorrente sem avisar. Se aparecer 404/500 estranho e intermitente durante `playwright test`, isso é o primeiro suspeito — `rm -rf .next` e reiniciar um único servidor limpo resolve.

---

## Antes de publicar mudanças em `src/components/ui/cn/**`

O pacote publicado (`npx kikitocn add <componente>`) vem de `registry/r/*.json` e `registry/registry.json`, gerados a partir do source via script — **não são sincronizados automaticamente**. Depois de editar qualquer arquivo em `cn/`, rodar:

```bash
npm run registry:build
```

Sem isso, o fix fica só no source e não chega no cliente que instala via CLI. Confirmado em 2026-08-26: `registry/r/button.json` estava desatualizado em relação ao `Button.tsx` até essa correção.

## Auditoria de componentes

Use `/validate-component <grupo>/<nome>` pra rodar os 9 gates completos (estrutura, cor, tipografia, componentes internos, a11y, dark/light, build, showcase, Playwright) em um componente CN por vez. As tabelas de tokens deste arquivo e as do skill devem ficar em sincronia — se um token mudar aqui, atualizar lá também (e vice-versa).
