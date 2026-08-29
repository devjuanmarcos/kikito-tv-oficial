# Candidatos genuinamente novos — sem primo óbvio na Kikito CN hoje

Depois de cruzar toda a varredura contra os 200 componentes já existentes (ver `../00-INVENTORY.md`), a lista de "sem primo óbvio" é pequena. Nenhum destes usa `motion` (não apareceram na varredura de `../animation-backport/PLAN.md`) — são candidatos a **componente novo**, não a backport de animação. Decisão de incluir ou não fica pra quando chegar a vez de cada um.

## ✅ Feitos

| Nome origem   | Componente Kikito CN                     | O que mudou em relação à origem                                                                                                                                                                                        |
| ------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `item.tsx`    | `display/item` — `Item`/`ItemGroup`/etc. | Não portado o polimorfismo `render`/`asChild` de `@base-ui/react` (nenhum outro componente CN tem esse padrão). Resto adaptado 1:1 com tokens da Kikito CN.                                                            |
| `menubar.tsx` | `layout/menubar` — `Menubar`             | Reescrito do zero: a origem usa `@base-ui/react` + um `DropdownMenu` composable (nenhum dos dois existe aqui). Segue o padrão de dados do `DropdownMenu` da Kikito CN (`items: MenuEntry[]`) em vez de composição JSX. |

## Restantes (baixa prioridade ou dependem de decisão de sobreposição)

| Nome origem                        | Onde                                 | Tamanho | O que é                                                | Recomendação                                                                                                                                                                                                           |
| ---------------------------------- | ------------------------------------ | ------: | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input-mask` (pasta `variants/`)   | `shadcn-dashboard-library/variants/` |       — | Máscara de input genérica                              | **Baixa prioridade** — `currency-input`/`phone-input` já cobrem máscara pros casos mais comuns; avaliar só se aparecer necessidade de máscara arbitrária (CPF, CEP, etc.)                                              |
| `pie-chart` (pasta `variants/`)    | `shadcn-dashboard-library/variants/` |       — | Gráfico de pizza (círculo cheio, sem buraco no centro) | **Avaliar como tipo novo do `Chart`** — visualmente distinto de `donut-chart` (que já existe), mas mesma família; se entrar, é `type="pie"` no `Chart` existente, não componente separado                              |
| `radial-chart` (pasta `variants/`) | `shadcn-dashboard-library/variants/` |       — | Visualização radial (barra circular)                   | **Avaliar como tipo novo do `Chart`, ou verificar sobreposição com `progress-ring`/`gauge`** antes de decidir — pode já estar coberto                                                                                  |
| `shine-border` (pasta `variants/`) | `shadcn-dashboard-library/variants/` |       — | Efeito de brilho deslizante na borda                   | **Baixa prioridade** — `Card` já tem 5 efeitos (`glass`/`glow`/`tilt`/`spotlight`/`gradient-border`); avaliar se `shine` agrega o suficiente pra virar um 6º ou se `glow-card`/`gradient-border` já cobrem visualmente |

## Descartados explicitamente (redundantes, não precisam virar componente novo)

| Nome origem                         | Onde                                 | Por quê                                                                                                                                 |
| ----------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `direction.tsx`                     | `ui/`                                | 6 linhas, é só um context provider de RTL/LTR — infra, não componente visual                                                            |
| `confetti.tsx`                      | `ui/`                                | 1 linha, provavelmente re-export — conceito já coberto por `confetti-button` (efeito do `Button`)                                       |
| `native-select.tsx`                 | `ui/`                                | `<select>` nativo cru — `select` da Kikito CN já cobre o caso, sem ganho real em duplicar                                               |
| `sheet.tsx`                         | `ui/`                                | Painel lateral — já coberto por `Modal` (absorve `drawer`/`side-panel`)                                                                 |
| `toggle.tsx`                        | `ui/`                                | Toggle booleano simples — já coberto por `Switch`, e `ToggleGroup` cobre o caso de múltiplos toggles agrupados                          |
| `dialog.tsx`                        | `ui/`                                | Modal base — já coberto por `Modal` (absorve `alert-dialog`); sem uso de `motion` na origem, nada de animação nova pra colher aqui      |
| `radio-group.tsx`                   | `ui/` + `variants/`                  | Já existe como `radio` na Kikito CN; sem uso de `motion` na origem                                                                      |
| `number-ticker` (pasta `variants/`) | `shadcn-dashboard-library/variants/` | Já existe como `animated-number`; sem uso de `motion` na origem apesar do nome — provável CSS/contador simples                          |
| `sonner.tsx` (`ui/`, sem motion)    | `ui/`                                | Já existe como `toast`; a versão COM animação está em `shadcn-dashboard-library/variants/sonner/` — ver `../animation-backport/PLAN.md` |
