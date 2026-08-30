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

### ⏳ Ainda não verificados individualmente (citados nos screenshots, sem confirmação de bug real)

Do HTML/classes inspecionados de relance ao longo desta conversa, TODOS abaixo pareciam usar tokens corretos (`bg-raised`, `border-rule`, `text-patina` etc.) e ter motion onde fazia sentido (Audio Waveform tem `@keyframes`, Scroll Reveal tem `transition`, Card tem `transition-[border-color,box-shadow,transform]`) — mas nenhum recebeu o passe completo de 9 gates ainda. Ordem sugerida (agrupado por página, pra reaproveitar o mesmo `curl`+Playwright por rota):

- **Inputs**: Input Group (prefix/suffix/icon), Split Button
- **Display**: Card, Code Block, Animated List, Price Table, Swipe Card, Audio Waveform, Stat, Video Card, Grid Pattern, Chat Bubble, Dot Stepper, Icon Box, Ribbon
- **Feedback**: Feedback Widget (stars)
- **Layout**: Resizable, Navigation Menu, Sortable List, Vertical Nav (nota: usa emoji como ícone — desaconselhado em produção per CLAUDE.md Gate 4, não bloqueante), Side Panel, Masonry, Scroll Area, Scroll Reveal, Separator, Floating Bar

**Nota de escopo**: dado que 3 das 4 suspeitas concretas nesta lista já viraram "não é bug" ao checar o markup real, a expectativa é que a maioria dos itens acima também esteja OK — mas cada um recebe o `/validate-component` completo antes de ser marcado como fechado, não fica "presumido OK" sem passar pelos 9 gates.

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

Em andamento — 2/2 bugs confirmados corrigidos, 4 suspeitas descartadas com evidência, ~25 componentes na fila de verificação individual.
