# Design System — Padrão do Projeto

Este documento descreve o padrão visual e de componentes usado no **administrador/dashboard** e nas demais telas do projeto. O objetivo é manter consistência: usar sempre os **componentes UI** e os **tokens de tipografia e cores** do [tailwind.config.ts](../tailwind.config.ts), **evitando** classes genéricas do Tailwind como `text-sm`, `text-lg`, `text-gray-500`, etc.

## Índice

- [Princípio geral](#princípio-geral)
- [Tipografia](#tipografia)
- [Cores](#cores)
- [Layout de página (PageBoxLayout)](#layout-de-página-pageboxlayout)
- [Componentes UI](#componentes-ui)
- [Tabelas e listagens](#tabelas-e-listagens)
- [Referência rápida: evite / use](#referência-rápida-evite--use)
- [Onde está definido](#onde-está-definido)

---

## Princípio geral

- **Use** as classes de tipografia do projeto (`heading-03-bold`, `body-paragraph`, `body-callout`, etc.) e as cores do tema (`text-foreground`, `text-muted-foreground`, `bg-primary`, etc.).
- **Evite** classes “soltas” de tamanho ou cor do Tailwind (`text-sm`, `text-base`, `text-lg`, `text-gray-500`, `font-medium` sozinho) em conteúdo de página. Em componentes UI reutilizáveis, quando fizer sentido, pode-se usar as classes do design system (ex.: `body-callout` no placeholder).
- **Prefira** os componentes em `@/components/ui` e `@/components/layout`; eles já consomem o tema (cores, bordas, espaçamentos).

Assim, o layout e a hierarquia visual ficam alinhados ao [tailwind.config.ts](../tailwind.config.ts) e ao [globals.css](../src/app/[locale]/globals.css).

---

## Tipografia

A escala de tipografia é definida no **plugin** do [tailwind.config.ts](../tailwind.config.ts) (por volta das linhas 262–291). Use sempre essas classes em títulos e textos de interface.

### Escala (do maior ao menor)

| Classe | Uso típico |
|--------|------------|
| `display-01` | Hero, destaque principal (4.5rem, bold) |
| `display-02` | Hero secundário (4rem, bold) |
| `heading-01` | Título de seção grande (3.5rem, bold) |
| `heading-02`, `heading-02-bold`, `heading-02-medium`, `heading-02-light` | Título de card ou bloco (3rem) |
| `heading-03`, `heading-03-bold`, `heading-03-medium` | Título de página no header (2rem) — ex.: PageBoxLayout |
| `heading-04`, `heading-04-bold`, `heading-04-medium`, `heading-04-light` | Subtítulo de seção (1.75rem) |
| `heading-05`, `heading-05-bold`, `heading-05-medium`, `heading-05-light` | Título de card menor, nome de perfil (1.5rem) |
| `body-title`, `body-title-bold`, `body-title-medium`, `body-title-light` | Subtítulo, label forte (1.25rem) |
| `body-paragraph`, `body-paragraph-bold`, `body-paragraph-medium`, `body-paragraph-light` | Parágrafo, descrição (1rem) — padrão de texto corrido |
| `body-callout`, `body-callout-bold`, `body-callout-medium`, `body-callout-light` | Texto auxiliar, legendas, links secundários (0.875rem) |
| `body-caption`, `body-caption-bold`, `body-caption-medium`, `body-caption-light` | Notas, metadados, tabelas (0.75rem) |

### Exemplos no projeto

- **Título da página (header):** `heading-03-bold` — [page-box.tsx](../src/components/layout/page-box.tsx).
- **Descrição da página:** `body-paragraph-medium text-muted-foreground`.
- **Título de card (TableCard, TopicCard):** `heading-02-bold text-foreground`.
- **Descrição do card:** `body-paragraph text-muted-foreground`.
- **Auth (AuthLayout):** `heading-02-medium` no título, `body-title text-muted-foreground` na descrição, `body-callout-light` em link secundário.
- **Feed/outras telas:** `heading-02-bold text-foreground` e `body-paragraph text-muted-foreground` para título + descrição.

Não use `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl` etc. para esse tipo de conteúdo; use a escala acima.

---

## Cores

As cores vêm das variáveis CSS em [globals.css](../src/app/[locale]/globals.css) e são expostas pelo [tailwind.config.ts](../tailwind.config.ts) em `theme.extend.colors`. Use sempre as cores semânticas do tema.

### Uso comum

- **Texto principal:** `text-foreground`
- **Texto secundário / descrição:** `text-muted-foreground`
- **Fundo da página:** `bg-background`
- **Cards e superfícies:** `bg-card`, `text-card-foreground`; borda `border-border`
- **Botão primário:** `variant="default"` (já usa `primary`); destaque com `bg-primary text-primary-foreground`
- **Badges e estados:** `primary`, `destructive`, `warning`, `success`, `info`, `muted`; variantes com opacidade (ex.: `primary/10`) quando existirem no tema
- **Links e ênfase:** `text-primary` ou `hover:text-primary`
- **Erro / destaque negativo:** `text-destructive`, `bg-destructive`, `border-destructive`
- **Aviso:** `text-warning`, `bg-warning`
- **Sucesso:** `text-success`, `bg-success`

Evite cores “soltas” como `text-gray-500`, `bg-blue-500` em telas e cards; use as cores do tema (primary, muted, destructive, etc.) para manter acessibilidade e consistência.

---

## Layout de página (PageBoxLayout)

O padrão de tela com header e conteúdo é o **PageBoxLayout** em [page-box.tsx](../src/components/layout/page-box.tsx).

- **Header:** `Header` (breadcrumbs) + bloco opcional com ícone, título e descrição.
- **Título da página:** `heading-03-bold` (sem classe de cor extra quando dentro do layout padrão; o foreground vem do tema).
- **Descrição da página:** `body-paragraph-medium text-muted-foreground`.
- **Conteúdo:** `children` dentro do mesmo container, com `flex flex-col w-full gap-5` e altura mínima consistente.

Em novas telas (dashboard, auth após ajustes, etc.), use o mesmo padrão: `PageBoxLayout` com `breadcrumbs`, `title`, `description` e `titleIcon` quando fizer sentido, e componha o conteúdo com os mesmos tokens de tipografia e cores.

---

## Componentes UI

Use sempre que possível os componentes de `@/components/ui` e de layout:

- **Layout:** `PageBoxLayout`, `Header`, `PageContainer`, `SidebarProvider`, `SidebarInset`
- **Feedback:** `Button`, `Badge`, `Card`, `Input`, `Select`, `Checkbox`, etc.
- **Estrutura:** `Card`, `CardHeader`, `CardTitle`, `CardContent`; `Separator`
- **Ícones:** `SquareTitleIcon`, `SimpleTitleIcon` (e ícones Lucide) com cores do tema (ex.: `text-foreground`, `text-muted-foreground`)

Esses componentes já utilizam as cores e, quando aplicável, tipografia do tema. Evite sobrescrever com `text-sm` ou cores fora do design system.

---

## Tabelas e listagens

- Use o **DataTable** ([data-table](../src/components/data-table)) com toolbar, paginação e colunas configuradas.
- Células e cabeçalhos: prefira `body-callout` ou `body-caption` para texto denso; títulos de coluna podem usar `body-paragraph-medium` ou equivalente da escala.
- Cores de texto: `text-foreground`, `text-muted-foreground`; estados (ativo, pendente) com as cores semânticas (success, warning, destructive, muted) via variantes de Badge ou classes do tema.

Mantenha a mesma paleta e escala de tipo nas tabelas para não quebrar a consistência com o resto do dashboard.

---

## Referência rápida: evite / use

| Evite | Use |
|-------|-----|
| `text-sm` | `body-callout` ou `body-caption` conforme hierarquia |
| `text-base` | `body-paragraph` |
| `text-lg` | `body-title` |
| `text-xl`, `text-2xl` | `heading-05` ou `heading-04` |
| `text-3xl`, `text-4xl` | `heading-03`, `heading-02`, `heading-01` conforme nível |
| `text-gray-500`, `text-gray-600` | `text-muted-foreground` |
| `font-medium` / `font-bold` sozinhos | Classes que já incluem peso: `heading-03-bold`, `body-paragraph-medium`, etc. |
| `bg-blue-500`, `text-blue-600` | `bg-primary`, `text-primary`, ou variantes do tema (success, warning, destructive, info) |
| Margens/paddings arbitrários em títulos | `gap-2`, `gap-4`, `gap-5` e espaçamentos já usados no PageBoxLayout e nos cards |

---

## Onde está definido

- **Tipografia (escala e utilitários):** [tailwind.config.ts](../tailwind.config.ts) — `theme.extend.fontSize`, `theme.extend.fontWeight` e o plugin que adiciona `.heading-*`, `.body-*`, `.display-*`.
- **Cores (variáveis e tema):** [src/app/[locale]/globals.css](../src/app/[locale]/globals.css) — `:root` e `.dark`; referências no `tailwind.config.ts` em `theme.extend.colors`.
- **Layout e componentes:** [src/components/layout](../src/components/layout) (page-box, header, page-container) e [src/components/ui](../src/components/ui).

Ao criar novas telas ou componentes de conteúdo, consulte este guia e o [INPUT_RENDER_GUIDE.md](./INPUT_RENDER_GUIDE.md) para formulários, para manter o mesmo padrão do administrador/dashboard e das demais telas atuais.
