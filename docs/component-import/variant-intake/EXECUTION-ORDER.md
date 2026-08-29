# Ordem de execução — 23 itens aprovados

Referência: [`SURVEY.md`](SURVEY.md) (11 ✅ mecânicos) + [`DECISIONS.md`](DECISIONS.md) (12 ⏳ aprovados). Ordem por esforço/dependência, não por categoria alfabética. Cada item = 1 commit (mesmo pipeline já estabelecido: eslint → tsc --noEmit → registry:build → showcase demo → e2e quando aplicável).

## Batch A — CSS/prop simples, sem motion novo

- [x] `bar-chart` — orientação horizontal (commit `e20196a`)
- [x] `breadcrumb` — ellipsis clicável → dropdown
- [x] `carousel` — indicador "1/N"
- [ ] `input` — contador de caracteres
- [ ] `scroll-area` — fade nas bordas
- [ ] `textarea` — floating label

## Batch B — reuso de preset de motion já existente

- [ ] `text-effect` — shine sweep
- [ ] `text-effect` — wave shimmer
- [ ] `button` — hover lift
- [ ] `slider` — preview no hover
- [ ] `tabs` — transição de conteúdo do painel

## Batch C — precisa preset novo em `@/lib/motion` primeiro, ou é mais estrutural

- [ ] `modal` — entradas direcionais (slide-in-from-{top,bottom,left,right})
- [ ] `button` — 3 efeitos wow (reveal ícone, preenchimento radial, shine sweep)
- [ ] `badge` — status glow + stagger de texto
- [ ] `spinner` — variant orbital

## Batch D — mudança de modelo de dados / API maior

- [ ] `radio` — variant="card"
- [ ] `calendar` — mode="range"/"multiple" no standalone
- [ ] `select` (combobox) — grupos + ícone por opção
- [ ] `dropdown-menu` — prop `header`
- [ ] `code-block` — abas por arquivo
- [ ] `line-chart` — ReferenceLine
- [ ] `progress` — modo indeterminate
- [ ] `area-chart`/`line-chart` — interpolação step (compartilhada)

Progresso registrado marcando `[x]` conforme cada item fecha (commit + verificação).
