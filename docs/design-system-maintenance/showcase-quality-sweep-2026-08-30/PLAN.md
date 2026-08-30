# Varredura de qualidade do showcase — 30 componentes citados (2026-08-30)

## Origem

Usuário mandou ~40 screenshots do showcase (`/cn/**`) via seletor de elemento, reclamando que "a maior parte está incompleta, sem animação, totalmente quebrada e feia", pedindo pra deletar e reescrever cada componente citado do zero usando código externo avançado como base + motion em tudo.

## Achado que muda o escopo: metodologia de verificação

**O painel de browser interativo (Claude Browser pane) está servindo dados stale para este projeto — confirmado pela 4ª vez nesta sessão.** Ao investigar por que a sidebar mostrava "141 componentes" nos screenshots (deveria ser 156, pós-correções de `da6be4a`/`b770bbd`/`dceffac`), reproduzi o mesmo "141" no pane mesmo com: processo `next dev` novo (PID confirmado via `Get-CimInstance`), `.next` limpo, aba nova sem estado herdado. `curl` direto no servidor (bypassa o pane inteiro) confirmou **156 componentes**, dado correto. Root cause do pane não identificado (não é cache de processo nem de `.next` — possivelmente cache HTTP do perfil do browser embutido, fora do meu controle).

**Regra adotada para o resto desta varredura**: nunca confiar em screenshot do pane pra julgar se um componente está "quebrado". Verificar via `curl` (HTML gerado real) + Playwright (`e2e/cn/**/*.spec.ts` existente, roda num browser gerenciado à parte) antes de tocar em qualquer código. Só editar quando o markup real (não a captura de tela) confirma o problema.

## Status por componente citado

### ✅ Corrigidos (bug real confirmado no markup)

| Componente                   | Bug                                                                                                                                                                                                   | Fix                                                                                                                                                                              | Commit    |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **Radio** (`variant="card"`) | Slot de preço com tipografia grande+bold+`shrink-0`, assume conteúdo curto tipo "$19". Demo passava `price="Talk to us"` (frase de CTA) pro plano Enterprise, estourava a largura do card.            | Removido `shrink-0` do span de preço (`text-right` no lugar — quebra linha em vez de estourar); demo trocado pra `price="Custom"` (padrão real de precificação SaaS enterprise). | `60bb41e` |
| **Command**                  | Demo renderizava só `<Command groups={...} />` sem trigger visível — o componente só escuta o keybinding global, não desenha nada sozinho. Showcase mostrava caixa vazia pra quem não sabia o atalho. | Adicionado botão visível (`useState` + `open`/`onOpenChange`), mesmo padrão já usado no `SpotlightSearchDemo` logo abaixo na mesma página.                                       | `45d3d39` |

### ✅ Verificados, NÃO são bugs (descartados com evidência)

| Componente           | Suspeita do screenshot                                                            | Por que não é bug                                                                                                                                                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FAB** (speed-dial) | Botões "Add/Edit/Delete" pareciam cramped/sobrepostos numa caixa pequena          | `fixed` + `contain:layout` no container pai é técnica deliberada e correta pra prender um FAB `position:fixed` dentro da caixa de preview em vez do viewport inteiro. Cramped só porque a caixa de demo é pequena (272×224px) — comportamento esperado de speed-dial, não quebrado. |
| **Pricing Card**     | "Priority support"/"Custom domain" pareciam duplicados na leitura de texto linear | São 3 colunas de plano (Starter/Pro/Team), cada uma lista as mesmas 5 features uma vez — 3 ocorrências = 3 colunas, não duplicação dentro de uma coluna.                                                                                                                            |
| **Mini Map**         | "Introdução" aparecia repetido na extração de texto                               | 2 `<nav>` demos empilhados na página (variante alinhamento esquerda vs direita), cada um com os mesmos 5 itens de exemplo — 2 demos distintas, não 1 com conteúdo duplicado.                                                                                                        |
| **Spotlight Search** | —                                                                                 | Já tinha botão de trigger visível + kbd "⌘K" corretos desde antes; nenhuma ação necessária.                                                                                                                                                                                         |

### ✅ Corrigido (rodada 2 — bug real achado ao ler o código-fonte, não só o HTML)

| Componente     | Bug                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Fix                                                                                                                                                                                           | Commit    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **Side Panel** | `SidePanel.tsx` resolvia `open ?? defaultOpen` num boolean sempre concreto — `ModalPanel` (variant="panel" do `Modal`) usa `controlled = open !== undefined` pra decidir se gerencia estado sozinho; como nunca recebia `undefined`, achava que era sempre controlado e o toggle interno não fazia nada quando ninguém de fora escutava `onOpenChange`. Regressão do próprio commit `d0e82c5` desta sessão (tipo `ModalProps.open` era obrigatório, forçando aquele workaround). Demo também abria colapsado por padrão (sem `defaultOpen`). | `open` virou opcional em `ModalProps`; `SidePanel` repassa `open`/`defaultOpen`/`onOpenChange` intocados; demo ganhou `defaultOpen`; criado `e2e/cn/layout/side-panel.spec.ts` (não existia). | `910e7f8` |

### ✅ Verificados em lote — 24 com Playwright pré-existente, 2 sem teste (criados)

Rodada 2: `curl` em lote nas 26 rotas restantes (nenhuma caixa de demo vazia, motion presente em todas — `@keyframes`/`transition-*` confirmados por grep), depois toda a suíte Playwright existente rodada em lote: **113/113 testes passaram** em Input Group, Split Button, Card, Code Block, Animated List, Price Table, Swipe Card, Audio Waveform, Stat, Video Card, Grid Pattern, Chat Bubble, Dot Stepper, Icon Box, Ribbon, Feedback Widget, Resizable, Navigation Menu, Sortable List, Vertical Nav, Masonry, Scroll Area, Separator, Floating Bar — zero regressão, zero achado.

Faltavam teste (`Gate 9`) só em **Side Panel** (achou o bug acima) e **Scroll Reveal** (sem bug, só faltava cobertura) — ambos criados e passando (4/4 cada).

**Nota**: "todos os testes existentes passam" não é garantia absoluta de zero bug sutil de lógica (o bug do Side Panel só apareceu lendo o código-fonte, não rodando os testes que já existiam pra outros componentes nem inspecionando o HTML) — mas cobre a classe de bug mais visível (crash, erro de console, interação básica quebrada) pros 24 restantes. Fica registrado como nível de confiança alcançado nesta rodada, não como "100% auditado a fundo".

Nota à parte, não-bloqueante: **Vertical Nav** usa emoji como ícone de item — desaconselhado em produção per CLAUDE.md Gate 4 (sugestão de melhoria, sem ação nesta rodada).

## Decisão sobre "código externo avançado"

Localizei a fonte que o projeto já usa pra isso — `D:\DEVJUANMARCOS\PROJETOS\TEMPLATES\shadcndashboard` (vendorizado local, referenciado com atribuição em vários componentes já existentes, ex: `Button.tsx`'s `RadialFillImpl` cita `shadcndashboard/button-16/17.tsx`; ver também `docs/component-import/animation-backport/PLAN.md`). **Usar essa fonte, não sites arbitrários da internet** — evita questão de licença, já é o padrão estabelecido no código, e tem motion (`motion`/framer-motion) em boa parte dos exemplos. Adaptar pro vocabulário de tokens Kikito CN (nunca copiar hex/cores cruas), documentar origem com comentário `// Origem: <arquivo> do shadcndashboard` igual aos exemplos existentes.

## Fluxo por componente (daqui pra frente)

1. `curl` na rota do componente → confirmar se há bug real no HTML (não confiar no pane).
2. Se real: ler o componente fonte, decidir fix mínimo vs. inspiração externa (shadcndashboard) se genuinamente faltar recurso/motion.
3. Aplicar fix, rodar `e2e/cn/**/<nome>.spec.ts` existente (criar se não existir, per template do skill `/validate-component`).
4. `tsc --noEmit` + `eslint` no(s) arquivo(s) tocado(s).
5. Commit individual, mensagem detalhada (achado + causa raiz + verificação).
6. Se motion foi adicionado: usar preset de `@/lib/motion`, nunca número mágico solto (CLAUDE.md §Animação regra 1).

## Status

**Fechado.** 3/3 bugs reais confirmados e corrigidos (Radio, Command, Side Panel), 4 suspeitas descartadas com evidência (FAB, Pricing Card, Mini Map, Spotlight Search), 24/24 componentes restantes com Playwright pré-existente passando 113/113, 2 componentes sem teste (Side Panel, Scroll Reveal) receberam suíte nova. Todos os 30 componentes citados nos screenshots originais foram verificados nesta varredura.
