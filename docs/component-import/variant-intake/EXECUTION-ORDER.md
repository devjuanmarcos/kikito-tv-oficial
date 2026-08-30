# Ordem de execução — 23 itens aprovados

Referência: [`SURVEY.md`](SURVEY.md) (11 ✅ mecânicos) + [`DECISIONS.md`](DECISIONS.md) (12 ⏳ aprovados). Ordem por esforço/dependência, não por categoria alfabética. Cada item = 1 commit (mesmo pipeline já estabelecido: eslint → tsc --noEmit → registry:build → showcase demo → e2e quando aplicável).

## Batch A — CSS/prop simples, sem motion novo

- [x] `bar-chart` — orientação horizontal (commit `e20196a`)
- [x] `breadcrumb` — ellipsis clicável → dropdown
- [x] `carousel` — indicador "1/N"
- [x] `input` — contador de caracteres
- [x] `scroll-area` — fade nas bordas
- [x] `textarea` — floating label

## Batch B — reuso de preset de motion já existente

- [x] `text-effect` — shine sweep
- [x] `text-effect` — wave shimmer
- [x] `button` — hover lift
- [x] `slider` — preview no hover
- [x] `tabs` — transição de conteúdo do painel

## Batch C — precisa preset novo em `@/lib/motion` primeiro, ou é mais estrutural

- [x] `modal` — entradas direcionais (CSS puro — ver nota no Modal.tsx sobre não migrar pra motion)
- [x] `button` — 3 efeitos wow (reveal ícone, preenchimento radial, shine sweep)
- [x] `badge` — status glow + stagger de texto
- [x] `spinner` — variant orbital (fecha Batch C)

## Batch D — mudança de modelo de dados / API maior

- [x] `radio` — variant="card"
- [x] `calendar` — mode="range"/"multiple" no standalone
- [x] `select` (combobox) — grupos + ícone por opção
- [x] `dropdown-menu` — prop `header`
- [x] `code-block` — abas por arquivo
- [ ] `line-chart` — ReferenceLine
- [ ] `progress` — modo indeterminate
- [ ] `area-chart`/`line-chart` — interpolação step (compartilhada)

Progresso registrado marcando `[x]` conforme cada item fecha (commit + verificação).
