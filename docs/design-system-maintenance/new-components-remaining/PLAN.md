# Plano — os 4 candidatos restantes de `new-components/PLAN.md`

Ver [`../00-FINDINGS.md`](../00-FINDINGS.md) pro levantamento completo (por que cada recomendação original mudou). Este documento é o plano de ação por item, pra quando cada um entrar na fila.

---

## `input-mask` — descartar

**Ação**: mover de `new-components/PLAN.md` (tabela "Restantes") pra seção "Descartados explicitamente" do mesmo arquivo, com a nota: _"3 variantes são formatters específicos (cartão/expiry/MAC), não uma máscara genérica — implementável em minutos com o `Input` existente + uma função local, não justifica componente novo."_

Nenhum trabalho de implementação — é só uma atualização de documentação (mover a linha de tabela).

---

## `pie-chart` — implementar como novo tipo de `Chart`

### Escopo

Novo componente-irmão `src/components/ui/cn/pie-chart/PieChart.tsx`, mesmo padrão estrutural de `DonutChart.tsx` (SVG hand-rolled, sem recharts — ver justificativa de consistência no `00-FINDINGS.md`):

- Props: mesmo shape de `DonutChartProps` (`segments: {label, value, color?}[]`, `size`, `strokeWidth` não se aplica a pizza preenchida — trocar por nada, a borda entre fatias pode ser só a cor de fundo), `centerLabel`/`centerValue` **não fazem sentido numa pizza sem buraco** — omitir essas duas props na versão pizza (diferença real de forma, não só visual).
- Render: `<path>` por fatia com comando de arco SVG (`M cx,cy L x1,y1 A r,r 0 largeArcFlag,1 x2,y2 Z`) — calcular `x1/y1`/`x2/y2` a partir do ângulo acumulado de cada fatia (mesmo acúmulo de `offset`/`pct` que `DonutChart` já faz, só trocando a primitiva de desenho de `<circle>` stroke pra `<path>` fill).
- Registrar `"pie"` em `ChartType` (`chart.types.ts`) e no `switch` de `Chart.tsx`, mesmo padrão de `"donut"`.

### Checklist de implementação (quando for feito)

- [ ] `PieChart.tsx` + `pie-chart.types.ts` + `index.ts` (estrutura igual a `donut-chart/`)
- [ ] `Chart.tsx`: `case "pie":` no dispatch, `ChartType` inclui `"pie"`
- [ ] Registro em `cn-registry.tsx` (group `charts`, ao lado de `donut-chart`)
- [ ] Demo no showcase + entrada em `DEMOS`
- [ ] `e2e/cn/charts/pie-chart.spec.ts`
- [ ] `npm run registry:build`

---

## `radial-chart` — decisão de arquitetura antes de implementar

### O gap é real (confirmado no levantamento)

Radial bar chart multi-série — várias categorias como arcos concêntricos de raios diferentes, cada um com seu próprio ângulo proporcional ao valor. Não é a mesma coisa que `ProgressRing`/`Gauge` (ambos valor único).

### Decisão pendente: recharts vs. SVG próprio

| Opção                                                                                                                                       | Prós                                                                                                   | Contras                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A — recharts** (`RadialBarChart`+`RadialBar`, como a origem)                                                                              | Menos código pra escrever, biblioteca já testada/madura pra layout multi-série                         | **Primeira dependência recharts de verdade na Kikito CN** (hoje só está _listada_ em `NPM_DEP_MAP`, nunca usada) — quebra a consistência "todo Chart é SVG hand-rolled"; `Chart.tsx` despacha todos os tipos de um arquivo só, então qualquer instalação de `Chart` (não só `type="radial-bar"`) importaria recharts no bundle, a menos que vire import dinâmico por tipo (mais complexidade de build) |
| **B — SVG próprio** (arcos concêntricos, mesma técnica do `DonutChart` mas N raios em vez de 1, cada um com seu próprio `stroke-dasharray`) | Consistente com os outros 6 tipos, zero dependência nova, seguindo exatamente o padrão já estabelecido | Mais código pra escrever (mas o `DonutChart` já resolveu a parte difícil — só precisa generalizar de "1 raio, N fatias" pra "N raios, 1 valor cada")                                                                                                                                                                                                                                                   |

**Recomendação**: Opção B, por consistência — a técnica de `DonutChart` generaliza direto (em vez de um `<circle>` de raio fixo com N segmentos, são N `<circle>`s de raios decrescentes, cada um com 1 segmento proporcional ao seu próprio valor). Evita o precedente de "esse tipo de chart usa uma lib, os outros seis não".

**Mas essa é uma decisão de produto, não técnica** — se o objetivo for ter um gráfico radial bonito rápido e não importa introduzir recharts, a Opção A é mais barata em tempo de implementação. Fica registrado aqui pra quando a decisão for tomada.

### Checklist de implementação (Opção B, quando decidido)

- [ ] `RadialBarChart.tsx` (nome do arquivo — cuidado pra não colidir com o `RadialBarChart` do recharts se algum dia coexistirem) + types + index, mesmo padrão de `donut-chart/`
- [ ] Generalizar a técnica: N `<circle>` concêntricos (raio decrescente por série), cada um com seu próprio `stroke-dasharray` proporcional ao valor da série (não fatias de um total — cada série tem seu próprio "quanto do círculo preencher", ex. like a Gauge por série)
- [ ] `ChartType` ganha `"radial-bar"`, `Chart.tsx` dispatch
- [ ] Registro em `cn-registry.tsx`, demo, e2e, `registry:build` — mesmo checklist do `pie-chart`

---

## `shine-border` — ❌ descartado (2026-08-29): já existe

**Correção sobre a análise original abaixo**: ao chegar a vez de implementar, `Card.tsx` já tinha exatamente isso. `effect="gradient-border"` com `gradientVariant="spin"` (que é o **default**, nem precisa ser passado explicitamente) já renderiza um `conic-gradient(from var(--_angle, 0deg), ...)` animado via `@property --_angle` + `@keyframes gb-spin` girando 0→360deg infinito, com cores default já na paleta da marca (`--ks-violet`/`--ks-primary`/`--ks-kinpaku`/`--ks-rose`, sobrescrevível via prop `colors`). Confirmado visualmente no showcase (`/cn/display/gradient-border`, variante "Spin — Conic gradient", já demoada). **Nenhuma implementação necessária — recomendação virou descartar, não fazer.**

A análise abaixo é o levantamento original, que concluiu (errado) que nenhum efeito existente rotacionava — mantida por transparência, não apagada:

### Escopo (análise original, não mais válida)

Adicionar `"shine"` a `CardEffect` (`card.types.ts`, hoje `glass|glow|tilt|spotlight|gradient-border`) — **redundante, `gradient-border`/`spin` já cobre isso**, ver correção acima.

---

## Ordem sugerida (não obrigatória)

1. ✅ `input-mask` — descartado, movido pra "descartados explicitamente" no `new-components/PLAN.md`.
2. ✅ `shine-border` — descartado, já existe (`gradient-border`/`spin`), achado ao chegar a vez de implementar.
3. `pie-chart` — escopo conhecido, sem decisão em aberto, mas exige escrever um componente novo do zero.
4. `radial-chart` — maior escopo E tem uma decisão de produto pendente (recharts vs. SVG) que vale alinhar com o usuário antes de começar a escrever código.
