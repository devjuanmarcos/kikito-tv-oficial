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

## `shine-border` — implementar como 6º efeito do `Card`

### Escopo

Adicionar `"shine"` a `CardEffect` (`card.types.ts`, hoje `glass|glow|tilt|spotlight|gradient-border`).

Implementação, **CSS puro** (mesma convenção dos keyframes `-ks` já existentes em `kikitocn-tokens.css`, ver `@keyframes spin-ks` como precedente direto — inclusive já existe um keyframe de rotação genérico que talvez sirva de base):

```css
@keyframes shine-border-ks {
  to {
    transform: rotate(360deg);
  }
}
```

Camada de gradiente cônico rotativo atrás do card, usando cores do tema (não as cores hardcoded `from-blue-500 via-red-500 to-teal-400` da origem) — candidatos: `conic-gradient(from 0deg, var(--ks-patina), var(--ks-kinpaku), var(--ks-violet), var(--ks-patina))` (um giro pelas cores de marca já existentes) ou uma versão mono usando só `--ks-patina` em variação de opacidade (mais sutil, mais fácil de ficar bem em ambos os temas). **Decisão de design a tomar na implementação** — não é óbvio qual fica melhor sem prototipar.

Respeita `prefers-reduced-motion` automaticamente — é `animation-duration`/`transition-duration`, cobertas pelo reset global já existente em `kikitocn-tokens.css` (ver comentário "pendência 4 da auditoria" no próprio arquivo).

### Checklist de implementação (quando for feito)

- [ ] `card.types.ts`: `CardEffect` ganha `"shine"`
- [ ] `Card.tsx`: novo bloco de render pro efeito `shine` (camada de gradiente cônico + `overflow: hidden` no wrapper, mesmo padrão dos outros 5 efeitos)
- [ ] `@keyframes` novo em `kikitocn-tokens.css` (ou reusar `spin-ks` se a rotação pura servir sem precisar do gradiente cônico embutido no próprio keyframe)
- [ ] Demo no showcase (adicionar ao `CardDemo` existente, ao lado dos outros 5 efeitos)
- [ ] `e2e/cn/*/card.spec.ts`: +1 teste confirmando o efeito renderiza (mesmo padrão dos outros)
- [ ] `npm run registry:build`

---

## Ordem sugerida (não obrigatória)

1. `input-mask` — é só mover uma linha de doc, zero custo, fazer primeiro.
2. `shine-border` — menor escopo real (1 efeito a mais num componente que já existe), CSS puro, sem decisão de arquitetura pendente.
3. `pie-chart` — escopo conhecido, sem decisão em aberto, mas exige escrever um componente novo do zero.
4. `radial-chart` — maior escopo E tem uma decisão de produto pendente (recharts vs. SVG) que vale alinhar com o usuário antes de começar a escrever código.
