# Redutor — trazer variante de `shadcndashboard` pra dentro de componente CN existente

Escopo diferente dos planos anteriores (`animation-backport`, `new-components`): aqueles cobriam **técnica de animação** (motion) e **componente sem primo**. Este cobre a fatia do meio — **variante visual/estrutural** de algo que já existe no CN, trazida como um novo `variant=`/`effect=` na API atual, não como componente novo.

Fonte: `shadcndashboard/src/components/shadcn-dashboard-library/variants/` (310 arquivos, 49 categorias) + `adapted/` (33 arquivos, 30 categorias) — ver `../00-INVENTORY.md`. 43 desses arquivos já foram minerados por técnica de animação (`animation-backport/PLAN.md`, fechado); este redutor olha o resto **e** revisita esses 43 com um olhar diferente (variante visual completa, não só a técnica isolada).

## Os 8 gates

Aplicar em ordem — o primeiro que reprovar já decide "não cabe", sem checar os seguintes.

### 1. Já existe capacidade equivalente no componente CN?

Se o componente já tem `variant=`/`effect=` que produz visual igual ou próximo → **não cabe, duplicidade**. Precedente real desta sessão: `shine-border` parecia novo, mas `Card` `effect="gradient-border"`/`gradientVariant="spin"` já era exatamente isso — só não tinha sido conferido a fundo.

### 2. É variação de estilo do MESMO componente, ou é conceitualmente outro componente?

Se trazer a variante exige mudar a **API de dados** (não só classe/animação) — ex.: de `items: MenuEntry[]` pra composição JSX arbitrária — não é variante, é reescrita de arquitetura. Isso não é `variant=` a mais, é decisão de `new-components` (ou nem isso). Não cabe aqui.

### 3. Depende de lib externa nova?

`react-dropzone`, `input-otp`, etc. Se sim: variante isolada raramente justifica dependência nova — avaliar à parte, não aprovar automaticamente. Default: não cabe, a menos que a lib resolva um problema real recorrente (não só essa variante).

### 4. O efeito depende de cor hardcoded pra funcionar?

Cor fora do token (`bg-blue-500`, hex cru) é normal de origem — o trabalho de tokenizar é esperado. Mas se o efeito **perde a identidade** ao trocar pra token semântico (ex.: um glow que só funciona com um azul saturado específico, sem equivalente em `--ks-*`), reavaliar — pode não valer a reescrita.

### 5. Prop nova desproporcional ao ganho visual?

Se pra caber a variante o componente precisa de 3+ props novas, ramificação de estado, ou reestrutura de children — comparar custo de manutenção permanente vs. ganho de 1 variante a mais. Não cabe se o custo for alto e o ganho for cosmético.

### 6. Tem valor de curadoria real?

Kikito CN se vende como **curada**, não "todo variant possível do community". Pergunta: um usuário real escolheria isso em vez do que já existe, ou é só "mais uma opção genérica" que dilui a lista de variantes sem motivo de escolha claro? Se a resposta for "ninguém saberia por que escolher essa" → não cabe.

### 7. Acessibilidade não regride

Variante não pode remover foco visível, contraste AA, semântica (`role`, `aria-*`) que a base já garante. Se o efeito original depende de esconder isso (ex.: overlay opaco sobre input que mata caret nativo, visto no `otp-input`) → não cabe sem reformular.

### 8. Motion (se houver) usa preset de `@/lib/motion`

Nunca número mágico novo. Se o timing da origem não bate com nenhum preset existente e o caso de uso é genuinamente novo, **primeiro** atualizar `@/lib/motion` (novo preset nomeado), depois consumir — nunca inline.

## Veredito por categoria

| Veredito                  | Significado                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ Trazer                 | Passa os 8 gates — vira `variant=`/`effect=` novo no componente existente, entra na sidebar/showcase                                                    |
| ⏳ Decisão de produto     | Passa os gates técnicos mas depende de escolha subjetiva (qual visual escolher entre várias origens, nome da variante) — perguntar antes de implementar |
| ❌ Duplicidade / não cabe | Reprovado em algum gate — registrar em qual gate e por quê, mesmo padrão de transparência já usado nos outros planos                                    |

## Próximo passo

Rodar os 8 gates contra as 49 categorias de `variants/` + 30 de `adapted/` (79 no total, com sobreposição de nome entre as duas pastas em alguns casos — checar duplicata categoria-a-categoria antes de contar). Produzir tabela única em `SURVEY.md` nesta mesma pasta, reaproveitando o que `animation-backport/PLAN.md` já levantou pros 43 arquivos de motion (não re-analisar do zero, só reclassificar sob a lente de "variante visual completa" em vez de "técnica isolada").
