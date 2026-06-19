# Skill: Validação de Componente CN

Você é o validador oficial de componentes da biblioteca Kikito CN.
Seu papel é executar **todos os gates** em ordem sequencial, sem pular nenhum, para um único componente por vez.
Um componente só é aprovado quando **todos os 9 gates passam sem ressalvas**.

---

## Como usar

```
/validate-component <grupo>/<nome>
```

Exemplos:
```
/validate-component display/banner
/validate-component inputs/autocomplete
/validate-component charts/gauge
```

---

## Contexto do projeto

- **Projeto:** `D:\DEVJUANMARCOS\PROJETOS\KIKITO\kikito-tv-oficial`
- **Componentes:** `src/components/ui/cn/<nome>/`
- **Token bridge:** `src/app/[locale]/globals.css` (seção `/* Kikito CN — token bridge */`)
- **Tailwind config:** `tailwind.config.ts` (tem escala de tipografia e dark mode: "class")
- **Showcase:** `src/app/[locale]/cn/[group]/[component]/_showcase.tsx`
- **Registry:** `src/lib/cn-registry.tsx`
- **Documento de auditoria:** ver `Plano de Auditoria Semântica — Kikito CN.md` no vault

---

## Tabela de tokens disponíveis

### Cores (Tailwind utilities via @theme inline)

| Categoria | Classes disponíveis |
|-----------|-------------------|
| Superfícies | `bg-canvas` `bg-base` `bg-raised` `bg-float` `bg-sunken` `bg-graphite` `bg-graphite-2` |
| Texto | `text-foreground` `text-muted` `text-faint` |
| Borda | `border-rule` |
| Patina (primary) | `bg-patina` `text-patina` `text-patina-fg` `bg-patina-soft` `text-patina-soft-fg` `bg-patina-hover` |
| Kinpaku (secondary) | `bg-kinpaku` `text-kinpaku` `text-kinpaku-fg` `bg-kinpaku-soft` |
| Violet | `bg-violet` `text-violet` `text-violet-fg` `bg-violet-soft` |
| Rose | `bg-rose` `text-rose` `text-rose-fg` `bg-rose-soft` |
| Danger | `bg-danger` `text-danger` `text-danger-fg` `bg-danger-soft` `text-danger-soft-fg` |
| Success | `bg-success` `text-success` `text-success-fg` `bg-success-soft` `text-success-soft-fg` |
| Warning | `bg-warning` `text-warning` `text-warning-fg` `bg-warning-soft` `text-warning-soft-fg` |
| Info | `bg-info` `text-info` `text-info-fg` `bg-info-soft` `text-info-soft-fg` |
| Neutral | `bg-neutral` `text-neutral` `text-neutral-fg` `bg-neutral-soft` `text-neutral-soft-fg` |
| Radius | `rounded-[--radius-xs]` `rounded-[--radius-sm]` `rounded-[--radius-md]` `rounded-[--radius-lg]` `rounded-[--radius-xl]` `rounded-[--radius-2xl]` `rounded-[--radius-pill]` |

**Fallback CSS vars (quando Tailwind não alcança):** `var(--ks-patina)`, `var(--ks-danger)`, etc.

### Tipografia (tailwind.config.ts fontSize + addUtilities)

| Token Tailwind | Valor | Classe utilitária composta |
|---------------|-------|--------------------------|
| `text-display-01` | 7.5rem | `.display-01` (bold, lh 1.1) |
| `text-display-02` | 3.75rem | `.display-02` |
| `text-heading-01` | 3.5rem | `.heading-01` |
| `text-heading-02` | 3rem | `.heading-02` `.heading-02-bold` `.heading-02-medium` `.heading-02-light` |
| `text-heading-03` | 2.25rem | `.heading-03` `.heading-03-bold` `.heading-03-medium` |
| `text-heading-04` | 1.75rem | `.heading-04` `.heading-04-bold` `.heading-04-medium` `.heading-04-light` |
| `text-heading-05` | 1.5rem | `.heading-05` `.heading-05-bold` `.heading-05-medium` `.heading-05-light` |
| `text-body-title` | 1.25rem | `.body-title` `.body-title-bold` `.body-title-medium` `.body-title-light` |
| `text-body-paragraph` | 1rem | `.body-paragraph` `.body-paragraph-bold` `.body-paragraph-medium` |
| `text-body-callout` | 0.875rem | `.body-callout` `.body-callout-bold` `.body-callout-medium` |
| `text-body-caption` | 0.75rem | `.body-caption` `.body-caption-bold` `.body-caption-medium` |

---

## Execução dos Gates

Execute cada gate em sequência. Se um gate falhar, **pare**, liste o que precisa ser corrigido, corrija, e só então prossiga para o próximo gate.

---

### GATE 1 — Estrutura de arquivos

**Verificar:**
1. Arquivo principal existe: `src/components/ui/cn/<nome>/<PascalCase>.tsx`
2. Arquivo de tipos existe: `src/components/ui/cn/<nome>/<nome>.types.ts`
3. Barrel export existe: `src/components/ui/cn/<nome>/index.ts`
4. `index.ts` exporta o componente e os tipos
5. Componente tem `displayName` ou nome de função declarado (não anônimo)
6. Props interface está em `.types.ts`, não inline no `.tsx`
7. Componentes com hooks/eventos têm `'use client'` na primeira linha
8. Componentes puramente server não têm `'use client'`

**Critério de aprovação:** Todos os 8 itens verificados sem falhas.

---

### GATE 2 — Semântica de cor

**Verificar (leia o arquivo `.tsx` inteiro):**

1. **Zero hex hardcoded** — nenhuma ocorrência de `#[0-9a-fA-F]{3,8}` no JSX/className (exceto em SVG fill decorativo sem valor semântico)
2. **Zero HSL/RGB raw** — sem `hsl(...)` ou `rgb(...)` inline nos classNames (valores de cor devem vir de vars ou tokens)
3. **Cores de superfície** usam classes Tailwind: `bg-canvas`, `bg-base`, `bg-raised`, `bg-float`, `bg-sunken`, `bg-graphite`
4. **Cores de texto** usam: `text-foreground`, `text-muted`, `text-faint`
5. **Bordas** usam: `border-rule` (não `border-gray-200` ou similar)
6. **Intents** usam tokens: `bg-danger`, `text-success`, `bg-warning-soft`, etc.
7. **CSS vars inline** (quando necessário): usa `var(--ks-*)`, nunca `var(--primary)` diretamente
8. **`style=` com cores** (quando necessário): usa `var(--ks-*)` ou tokens do @theme
9. **Nenhuma cor do projeto antigo** (`hsl(var(--primary))`, `text-primary`, `bg-secondary`, etc.) — essas são do dashboard, não do CN

**Regras de exceção documentadas:**
- SVGs decorativos sem significado semântico: `fill="currentColor"` é permitido
- Gradientes visuais (GlassCard, GradientBorder): podem usar oklch literal se não existe token equivalente, mas deve ser documentado com comentário `/* no token equivalent */`

**Critério de aprovação:** Nenhuma das violações listadas. Exceções documentadas.

---

### GATE 3 — Semântica de tipografia

**Verificar:**

1. **Zero `text-[Xrem]` arbitrário** — substituir todos por token da escala:
   - `text-[0.75rem]` → `text-body-caption`
   - `text-[0.875rem]` → `text-body-callout`
   - `text-[1rem]` → `text-body-paragraph`
   - `text-[1.25rem]` → `text-body-title`
   - `text-[1.5rem]` → `text-heading-05`
   - `text-[2.25rem]` → `text-heading-03`
   - `text-[3rem]` → `text-heading-02`

2. **Zero `text-[Xpx]` arbitrário** — sempre converter para rem e usar token

3. **Line-height** — preferir `leading-normal` (1.5), `leading-tight` (1.25), `leading-relaxed` (1.625) aos valores arbitrários `leading-[X]`

4. **`font-size` inline em `style=`** — proibido; sempre usar classe Tailwind

5. **Exceção documentada** para tamanhos fora da escala (ex: `text-[10px]` para micro-labels específicos) — comentário `/* below scale minimum */` obrigatório

**Critério de aprovação:** Nenhum valor arbitrário de tamanho de fonte não documentado.

---

### GATE 4 — Componentes internos

**Verificar:**

1. **Botões** — se o componente renderiza um botão acionável pelo usuário:
   - Gate 4 está desbloqueado para auditar **SOMENTE SE** `src/components/ui/cn/button/Button.tsx` existir
   - Se Button CN não existe ainda: **registrar como bloqueado** e pular para Gate 5
   - Se Button CN existe: substituir `<button className="...">` por `<Button variant="..." intent="...">` CN

2. **Badges/Tags** — se usa chips, tags, status pills:
   - Mesmo critério: verificar se `src/components/ui/cn/badge/Badge.tsx` existe
   - Se existe: usar `<Badge>` CN; se não: registrar como bloqueado

3. **Inputs** — se usa campo de texto dentro do componente:
   - Verificar `src/components/ui/cn/input/Input.tsx`
   - Se existe: usar `<Input>` CN; se não: registrar como bloqueado

4. **Componentes CN que já existem** — se usa `<Avatar>`, `<Stepper>`, `<StatusBadge>` etc. que já existem na biblioteca: deve importar de `@/components/ui/cn/...`, não reinventar inline

5. **Ícones** — verificar se usa emoji de ícone ou SVG inline. SVG inline é aceitável; emoji é desaconselhado em produção (anotar como sugestão de melhoria, não bloqueante)

**Status possíveis por sub-item:**
- ✅ Implementado corretamente
- ⏳ Bloqueado (primitivo ainda não existe) — registrar no documento de auditoria
- ❌ Falhou — precisa corrigir antes de prosseguir

**Critério de aprovação:** Todos os sub-itens são ✅ ou ⏳ (desbloqueados serão auditados em rodada posterior).

---

### GATE 5 — Acessibilidade mínima

**Verificar:**

1. **Elementos interativos** têm `role` correto se não são `<button>` ou `<a>` nativos
2. **`onClick` em `<div>`** → adicionar `role="button"` + `tabIndex={0}` + `onKeyDown` (Enter/Space)
3. **Imagens** têm `alt` descritivo (não vazio se não decorativas)
4. **`<img>` decorativas** têm `alt=""` + `aria-hidden="true"`
5. **Campos de formulário** têm `id` + `<label htmlFor>` ou `aria-label`
6. **Estados interativos** (loading, disabled, error) têm `aria-*` correspondente: `aria-disabled`, `aria-busy`, `aria-invalid`
7. **Focus ring** visível — não suprimir `outline` sem alternativa; usar `:focus-visible` do globals.css
8. **Contraste mínimo** — texto sobre superfície usa token que garante contraste (verificar combinações non-obvious: `text-muted` sobre `bg-graphite`, etc.)

**Critério de aprovação:** Nenhum item crítico (1, 2, 5, 7) com falha. Itens menores anotados como melhorias futuras.

---

### GATE 6 — Comportamento dark/light

**Verificar:**

1. Abrir o componente no browser com o toggle de tema
2. Alternar de dark → light → dark sem reload
3. **Verificar visualmente:**
   - Superfícies mudam corretamente (dark: graphite/canvas, light: white/off-white)
   - Texto legível em ambos os modos
   - Bordas visíveis em ambos os modos
   - Intents (danger, success, etc.) adaptam saturação/luminosidade
   - Sem "ghost elements" (elementos que ficam da cor errada após transição)
4. **Verificar em código:**
   - Nenhuma cor hardcoded que force um modo específico
   - `.dark` condicional no código é suspeito — verificar se é necessário ou se um token resolve

**Critério de aprovação:** Visual correto em ambos os modos, confirmado manualmente.

---

### GATE 7 — Build limpo

**Executar:**
```bash
cd D:\DEVJUANMARCOS\PROJETOS\KIKITO\kikito-tv-oficial
npm run build 2>&1 | grep -E "error TS|Error:|error:"
```

**Verificar:**
1. Nenhum erro TypeScript relacionado ao componente auditado
2. Nenhum import não resolvido
3. Nenhum tipo `any` não intencional (avisar, não bloquear)
4. Nenhuma prop obrigatória sem default ou validação

**Critério de aprovação:** Build 0 erros no componente auditado. Warnings documentados.

---

### GATE 8 — Demo no showcase

**Verificar em `_showcase.tsx`:**

1. Importação existe: `import { ComponentName } from '@/components/ui/cn/<nome>/ComponentName'`
2. Função demo existe: `function ComponentNameDemo() { ... }`
3. Demo cobre **pelo menos 2 variações** significativas (ex: intents diferentes, tamanhos, estados)
4. Demo usa `<Frame label="...">` como wrapper
5. Demo não tem dados hardcoded que deveriam ser props (não confundir conteúdo de exemplo com dado real)
6. Entrada existe no mapa `DEMOS`: `'grupo/nome': ComponentNameDemo`
7. Entrada existe no `CN_REGISTRY` com `name`, `title`, `group`, `description` corretos
8. Rota `/cn/grupo/nome` funciona sem erro 404 ou crash

**Critério de aprovação:** Todos os 8 itens verificados. Rota acessível no browser.

---

### GATE 9 — Playwright (estrutural)

**Verificar:**

Se o arquivo de teste não existe em `tests/cn/<grupo>/<nome>.spec.ts`, **criar** com o template mínimo:

```typescript
import { test, expect } from '@playwright/test'

const URL = '/pt/cn/<grupo>/<nome>'

test.describe('<ComponentName>', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL)
    await page.waitForLoadState('networkidle')
  })

  test('renderiza sem crash', async ({ page }) => {
    await expect(page).not.toHaveTitle(/Error|500|404/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('dark mode: página não quebra ao alternar', async ({ page }) => {
    const toggle = page.locator('[data-testid="theme-toggle"]')
    if (await toggle.isVisible()) {
      await toggle.click()
      await page.waitForTimeout(400)
      await expect(page.locator('main')).toBeVisible()
    }
  })

  test('sem erros de console', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto(URL)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })
})
```

**Executar:**
```bash
npx playwright test tests/cn/<grupo>/<nome>.spec.ts --reporter=line
```

**Critério de aprovação:** Todos os testes passam (ou são explicados e marcados como `test.skip` com razão).

---

## Relatório final de validação

Ao concluir todos os gates, emitir o seguinte relatório:

```
═══════════════════════════════════════════════════
  RELATÓRIO DE VALIDAÇÃO — Kikito CN
  Componente: <grupo>/<nome>
  Data: <data>
═══════════════════════════════════════════════════

  GATE 1 — Estrutura de arquivos    [ ✅ PASSOU / ❌ FALHOU ]
  GATE 2 — Semântica de cor         [ ✅ PASSOU / ❌ FALHOU ]
  GATE 3 — Semântica de tipografia  [ ✅ PASSOU / ❌ FALHOU ]
  GATE 4 — Componentes internos     [ ✅ PASSOU / ⏳ BLOQUEADO / ❌ FALHOU ]
  GATE 5 — Acessibilidade mínima    [ ✅ PASSOU / ❌ FALHOU ]
  GATE 6 — Comportamento dark/light [ ✅ PASSOU / ❌ FALHOU ]
  GATE 7 — Build limpo              [ ✅ PASSOU / ❌ FALHOU ]
  GATE 8 — Demo no showcase         [ ✅ PASSOU / ❌ FALHOU ]
  GATE 9 — Playwright               [ ✅ PASSOU / ❌ FALHOU ]

═══════════════════════════════════════════════════
  RESULTADO FINAL: ✅ APROVADO / ❌ REPROVADO
═══════════════════════════════════════════════════

  Pendências registradas:
  - [lista de ⏳ bloqueados e melhorias anotadas]

  Próximo componente sugerido: <próximo na fila do Plano de Auditoria>
═══════════════════════════════════════════════════
```

Após aprovação, atualizar:
1. O documento `Plano de Auditoria Semântica — Kikito CN.md` — marcar C1–C5 do componente
2. Commit com mensagem: `audit(cn): <grupo>/<nome> — gates 1-9 ✅`

---

## Ordem de prioridade padrão

Se não especificado qual componente auditar, seguir a ordem do Plano de Auditoria:

**Tier 0 primeiro (desbloqueiam todos os outros):**
1. `button/Button`
2. `badge/Badge`
3. `input/Input`
4. `label/Label`

**Tier 1 em seguida (atômicos, sem deps):**
5. `display/shortcut-key`
6. `display/status-badge`
7. `display/animated-number`
8. `display/breadcrumb`
9. `display/animated-list`
10. `charts/gauge` → `charts/skill-bar` → `charts/sparkline`
11. ... (ver tabela completa no Plano de Auditoria)
