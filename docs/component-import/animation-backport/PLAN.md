# Backport de animação — 43 arquivos de origem → componentes Kikito CN existentes

Pré-requisito: `../motion-infrastructure/PLAN.md` resolvido primeiro (dependência, tokens, `prefers-reduced-motion`).

Cada linha é um arquivo de origem real que importa `motion`/`framer-motion`. "Feature" vem de grep automático (`AnimatePresence`, `whileHover`, `whileTap`, `layoutId`, `staggerChildren`, `useSpring`) — confirmar lendo o arquivo antes de portar, o grep só aponta onde olhar primeiro. Caminhos relativos a `shadcndashboard/src/components/`.

## `accordion` — ❌ não portado, sem fit real

| Origem                                                         | Feature                                 | Nota                                                                                                             |
| -------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/accordion/accordion-07.tsx` | (sem flag — checar transição de altura) | Provável `height: auto` animado no expand, alternativa ao `grid-template-rows` CSS que o `AccordionGroup` já usa |

**Por que não**: a nota acima era um chute — a origem NÃO anima altura (o `Accordion` deles é Radix puro, resolve via CSS grid nativo do shadcn, igual ao `max-height` CSS que a Kikito CN já usa). O `motion` real ali é: bolha numerada morphing (escala/opacidade), título com color+x-shift, ícone `+`→`×` rotacionando — tudo amarrado a um layout de **trigger numerado por etapa** (`number: "01"`) que o `Accordion` da Kikito CN não tem (API genérica label+icon). Portar exigiria redesenhar a API do trigger pra uma forma de conteúdo que só essa demo usa — sem pedido explícito, não vale forçar.

## `animated-list` — ❌ não portado, formas diferentes de widget

| Origem                                                                 | Feature           | Nota                                                                                                              |
| ---------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/animated-list/animated-list-01.tsx` | `AnimatePresence` | Enter/exit de item de lista                                                                                       |
| `shadcn-dashboard-library/variants/animated-list/animated-list-02.tsx` | `AnimatePresence` | Variante 2 do mesmo padrão — comparar as duas antes de escolher                                                   |
| `shadcn-dashboard-library/variants/animated-list/animated-list-03.tsx` | `AnimatePresence` | Variante 3                                                                                                        |
| `animated-components/list-animation.tsx`                               | (sem flag)        | Candidato a stagger simples — já existe `AnimatedList` na Kikito CN, comparar se agrega algo novo antes de portar |

**Por que não**: a origem é um _feed de notificação rolante_ — revela item por item sozinho ao longo do tempo (`setTimeout`), sem remoção. A `AnimatedList` da Kikito CN é _stagger estático no mount_ (sem add/remove ao vivo). Formas de widget diferentes, não uma versão desatualizada da mesma coisa. O gap de acessibilidade que `motion`+`MotionConfig` resolveria (reduced-motion) já é coberto pro caso da Kikito CN por um reset CSS global separado (ver `CLAUDE.md` §Animação, item 2) — migrar pra `motion` só por consistência, sem ganho real de capacidade, não compensa o risco de regressão num componente já em uso.

## `table` / `data-grid` / `data-list` — ⏸️ decisão de design pendente, não mexido

| Origem                                   | Feature           | Nota                                                                                                               |
| ---------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `animated-components/animated-table.tsx` | `staggerChildren` | Linhas da tabela entrando em sequência — decidir se vai pra `Table` base ou fica restrito a um exemplo de showcase |

**Por que não (ainda)**: a origem faz sentido pra uma tabela de demo com 4-5 linhas fixas (`delay: index * 0.25` — quase 1.5s pra tabela toda entrar). O `Table`/`DataTable` da Kikito CN (`src/components/ui/cn/table/Table.tsx`, 1300+ linhas) é um data-grid completo com sort/filtro/paginação — aplicar stagger de entrada por padrão faria a animação **re-disparar a cada reordenação/filtro** (péssima UX) e não escalaria pra tabelas de 20-50 linhas sem um cap. Precisa de uma decisão de produto (opt-in via prop? só no mount inicial? cap de linhas?) antes de virar código — não é um port mecânico como os outros itens desta lista.

## `input` / `floating-label-input` — ❌ não portado, fora do escopo da API atual

| Origem                                                 | Feature           | Nota                                                                                              |
| ------------------------------------------------------ | ----------------- | ------------------------------------------------------------------------------------------------- |
| `animated-components/animatedinput-placeholder.tsx`    | `AnimatePresence` | Placeholder/label animado — provável candidato ao `floating-label-input` (já existe na Kikito CN) |
| `shadcn-dashboard-library/variants/input/input-19.tsx` | (sem flag)        | Checar o que anima — provável foco/validação                                                      |

**Por que não**: a nota do 1º arquivo era imprecisa — não é o floating-label (label sobe no foco/valor, já implementado via CSS no `Input floatingLabel`). É um **placeholder rotativo** (troca de string a cada 3s com `AnimatePresence`) dentro de um widget de busca com efeito de "vanish" em canvas (partículas se dissolvendo ao submeter) — bespoke, sem paralelo no `Input` da Kikito CN, que não aceita array de placeholders. O 2º arquivo (`input-19.tsx`) é outra coisa ainda: um círculo de progresso SVG com checkmark animado pra indicador de validação de senha/username — um widget novo e independente, não uma animação do `Input` em si. Nenhum dos dois é "port de animação pra componente existente"; ambos exigiriam desenhar API nova ou um componente novo (fora do escopo deste backport — ver `new-components/PLAN.md` se algum dia fizer sentido).

## `autocomplete` — ✅ abertura/fechamento do painel portado (item-stagger descartado)

| Origem                                                               | Feature                | Nota                                                                                                                           |
| -------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `shadcn-dashboard-library/variants/autocomplete/autocomplete-03.tsx` | (sem flag)             | Efeito de "vanish" character-by-character no botão limpar — bespoke, não portado (mesma categoria do canvas do `input`, acima) |
| `shadcn-dashboard-library/variants/autocomplete/autocomplete-04.tsx` | `motion.div`, `SPRING` | ✅ Painel — ver abaixo. Item-stagger (`delay: idx*0.04`) não portado, ver nota                                                 |
| `shadcn-dashboard-library/variants/autocomplete/autocomplete-05.tsx` | `motion.div`, `SPRING` | Idem — mesma decisão                                                                                                           |
| `shadcn-dashboard-library/variants/autocomplete/autocomplete-06.tsx` | `motion.div`, `SPRING` | Idem — mesma decisão                                                                                                           |

**O que foi feito**: o painel de sugestões do `Autocomplete` da Kikito CN tinha o mesmo bug já corrigido no `ClickMenu` (`context-menu`, acima) — `{open && <div>...}` direto, sem `AnimatePresence`, sem animação nenhuma de entrada/saída. Migrado com `AnimatePresence` + `scaleInVertical`/`springSnappy`, o **mesmo par já usado pelo painel do `Select`** (mesmo formato de widget: listbox ancorada abaixo de um campo, "desenrola" de cima pra baixo) — reuso direto de um preset existente, não um novo.

**Não portado, decisão deliberada**: o stagger por item (`delay: idx * 0.04`, uma pra cada opção da lista) das origens 04/05/06. Mesmo raciocínio já registrado em `table` acima — a lista filtrada do `Autocomplete` muda a **cada tecla digitada**, então um stagger de entrada re-dispararia a cada caractere (o array de itens filtrados é recriado no re-render), virando um efeito de "piscar" enquanto o usuário digita em vez de uma entrada suave. Onde a origem usa (uma lista que só muda ao abrir/fechar o painel, não a cada tecla) o efeito faz sentido; aqui não.

`e2e/cn/inputs/autocomplete.spec.ts` já cobria abrir/filtrar/navegar/selecionar — 12/12 chromium-desktop + mobile-chrome, zero regressão.

## `avatar` — ✅ modo clicável/selecionável com `whileHover`/`whileTap` portado

| Origem                                                   | Feature                  | Nota                                    |
| -------------------------------------------------------- | ------------------------ | --------------------------------------- |
| `shadcn-dashboard-library/variants/avatar/avatar-07.tsx` | `whileHover`, `whileTap` | ✅ Portado — ver o que foi feito abaixo |

**O que foi feito**: a origem é um `SelectableAvatar` inteiro (avatar+label+badge+seleção, sempre clicável). O `Avatar` da Kikito CN é **puramente decorativo** (`<span>`, sem `onClick`) — colar `whileHover`/`whileTap` incondicionalmente seria uma afordância falsa num elemento não-interativo. Em vez disso, `onClick`/`selected`/`label` viraram props opcionais novas: sem `onClick`, o `Avatar` continua exatamente como antes (`<span>`, zero mudança de comportamento pros usos existentes); com `onClick`, vira `motion.button` com `whileHover={{scale:1.05}}`/`whileTap={{scale:0.95}}` + anel de destaque quando `selected`. Spring reusa `springSnappy` (350/25) de `@/lib/motion` — a origem usa 400/25, visualmente indistinguível, não vale criar um 3º preset só pra bater exato. `e2e/cn/display/avatar.spec.ts` +2 testes (onClick vira `<button>` real com `aria-pressed` correto; sem `onClick` continua sem `role=button`) — 16/16 chromium-desktop + mobile-chrome (rodado com `--workers=1` pra evitar flakiness de contenção de workers em rota fria, já visto antes nesta sessão — não é bug real), incluindo os 5 já existentes (zero regressão).

## `badge` / `tag` / `status-badge`

| Origem                                                 | Feature    | Nota                                                                   |
| ------------------------------------------------------ | ---------- | ---------------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/badge/badge-07.tsx` | (sem flag) | 3 variantes sem feature marcante — checar se é só transição de entrada |
| `shadcn-dashboard-library/variants/badge/badge-08.tsx` | (sem flag) | —                                                                      |
| `shadcn-dashboard-library/variants/badge/badge-09.tsx` | (sem flag) | —                                                                      |

## `context-menu` — ✅ abertura do painel já coberta; achado real corrigido de passagem no `ClickMenu`

| Origem                                                               | Feature                                     | Nota                                                                     |
| -------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| `shadcn-dashboard-library/variants/context-menu/context-menu-01.tsx` | `AnimatePresence`, `whileHover`             | ✅ Painel — ver abaixo. `whileHover` (x:4 no item) não portado, ver nota |
| `shadcn-dashboard-library/variants/context-menu/context-menu-02.tsx` | `AnimatePresence`, `whileHover`, `whileTap` | Idem — mesma decisão                                                     |

**O que foi feito**: o `ContextMenuImpl` (trigger `right-click`) dentro de `DropdownMenu.tsx` já tinha `AnimatePresence` + `motion.div` com `scaleIn`/`transitionStandard` de uma migração anterior desta sessão (Modal/Select/DropdownMenu) — a animação de abertura/fechamento do painel pedida por esta origem já estava feita, nada a portar aqui.

**Achado real corrigido de passagem**: o `ClickMenu` (trigger `click`, o dropdown padrão — usado por bem mais componentes que o context-menu) ainda estava em CSS puro (`transition-[opacity,transform] duration-[140ms]`, número mágico fora dos tokens) e **sem nenhuma animação de saída** — o portal era montado/desmontado direto no `open &&`, então fechar o menu era instantâneo, sem fade. Migrado pro mesmo padrão do `ContextMenuImpl`: `AnimatePresence` sempre envolvendo o `createPortal`, `motion.div` com `initial`/`animate`/`exit` + `transitionStandard`, preservando a lógica de medição de posição existente (`ready` state via `requestAnimationFrame` — sem isso o menu apareceria por um frame na posição errada antes de reposicionar). Verificado manualmente no browser: abrir/fechar por clique fora e clicar num item — painel entra e sai com fade+scale, posicionamento correto, sem regressão nas outras 2 variantes (`ContextMenuImpl`, `HoverMenu`) que não foram tocadas.

**Não portado, decisão deliberada**: `whileHover` (x:4 no item ao passar o mouse) das origens — os itens de menu da Kikito CN (`renderMenuItem` e os dois outros triggers) usam consistentemente hover por cor de fundo (`hover:bg-graphite`/`hover:bg-patina-soft`), nunca deslocamento horizontal. Portar o x-shift só na variante `ClickMenu` criaria uma inconsistência entre triggers do mesmo componente pra um ganho estético pequeno — não vale.

`e2e/cn/overlays/dropdown-menu.spec.ts` já cobria abrir/fechar/click-outside/Escape/click-item do `ClickMenu` — 10/10 chromium-desktop + mobile-chrome, zero regressão (firefox-desktop falhou por binário do Playwright não instalado nesta máquina, não relacionado à mudança).

## `file-upload` — ✅ animação de entrada/saída da lista de arquivos portada (adaptada, não `layoutId`)

| Origem                                                             | Feature                  | Nota                                                                                                                                                                                               |
| ------------------------------------------------------------------ | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shadcn-dashboard-library/adapted/file-upload/file-upload-01.tsx`  | `layoutId`, `whileHover` | Não portado como está — depende de `react-dropzone` (dep nova, fora de escopo) e de um efeito "peek/hover" bespoke que não combina com o dropzone simples da Kikito CN. Ver o que foi feito abaixo |
| `shadcn-dashboard-library/variants/file-upload/file-upload-01.tsx` | `layoutId`, `whileHover` | Idem — mesma implementação, mesmo motivo                                                                                                                                                           |
| `animated-components/file-uploadmotion.tsx`                        | `layoutId`, `whileHover` | Idem — terceira cópia do mesmo conceito                                                                                                                                                            |

**O que foi feito (adaptado, não portado literal)**: as 3 origens compartilham `react-dropzone` + um efeito de "peek" no hover do dropzone via `layoutId`/`whileHover`, específico da estrutura deles (card único que se desloca). A Kikito CN já tem seu próprio drag-and-drop sem lib externa e uma lista de arquivos simples — em vez de portar o efeito de peek (exigiria trocar a estrutura toda + nova dependência), a animação real e reusável dali era **linha de arquivo entrando/saindo da lista** (padrão `FileItem`/`motion.p` da origem), aplicado via `AnimatePresence` + preset `slideInUp` de `@/lib/motion`.

**Achado real corrigido de passagem**: a lista usava `key={i}` (índice) — ao remover um arquivo do meio da lista, o `AnimatePresence` animava a linha ERRADA (React reaproveita o nó do índice deslocado em vez de detectar que o item específico saiu, bug clássico de lista com key por índice + animação de saída). Corrigido pra key por conteúdo (`nome-tamanho-data`). `e2e/cn/inputs/file-upload.spec.ts` +1 teste (remove arquivo do meio de 3, não o último — é o caso que expõe o bug) — 12/12 chromium-desktop + mobile-chrome, incluindo os 4 já existentes (zero regressão).

## `otp-input` — ⚠️ tentado e revertido, hidratação quebrou

| Origem                                                         | Feature                       | Nota                                                             |
| -------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/input-otp/input-otp-09.tsx` | `AnimatePresence`, `layoutId` | Célula ativa provavelmente com indicador deslizante (`layoutId`) |

**Por que não é port literal**: a origem usa a lib `input-otp` (um único `<input>` real escondido + slots visuais renderizados via `OTPInputContext`, com fake-caret) — arquitetura completamente diferente do `OtpInput` da Kikito CN, que usa **inputs nativos reais por célula** (caret real do SO, seleção real, sem fake-caret necessário). Portar o char-pop-in + fake-caret exigiria trocar a arquitetura toda ou sobrepor um overlay opaco sobre cada input (perdendo o caret nativo) — risco alto pra um campo crítico de autenticação, sem pedido explícito.

**Tentativa adaptada (revertida)**: em vez do char-pop, tentei só o "pulso" decorativo (anel que expande e desaparece a cada dígito digitado) via `AnimatePresence` + `motion.span` posicionado atrás do input real, sem tocar em caret/foco/paste. Implementação isolada, `eslint`/`tsc` limpos, `registry:build` ok — mas ao testar no browser apareceu um **hydration mismatch real e reproduzível** (`Recoverable Error` do Next: árvore do cliente não bate com a do servidor, apontando pra dentro do `<span className="contents">` que envolve cada célula). HTML servido via `fetch` direto batia com o código-fonte esperado, então a causa raiz não ficou clara rapidamente (não confirmei se é algo específico do `motion`/`AnimatePresence` dentro de um `.map()` com wrapper `contents`, ou uma interação mais sutil). Dado que é um campo de autenticação, não vale arriscar uma regressão de hidratação por um efeito puramente decorativo — revertido (`git checkout HEAD --`) sem deixar rastro no componente. Fica pendente de investigação futura se algum dia valer a pena.

## `label` — ❌ não portado, mesmo território do `input` acima

| Origem                                                 | Feature    | Nota               |
| ------------------------------------------------------ | ---------- | ------------------ |
| `shadcn-dashboard-library/variants/label/label-06.tsx` | (sem flag) | Checar o que anima |

**Por que não**: é mais um floating-label (label sobe no foco/valor) — já implementado via CSS no `Input floatingLabel` (`FloatingLabelImpl`, 3 variantes outline/filled/underline). A única coisa nova na origem é uma barra inferior animada que cresce do centro (`scaleX` via `motion`) em vez do `focus-within:border-patina` instantâneo que a Kikito CN usa. Detalhe pequeno demais pra justificar mexer numa implementação compartilhada por 3 variantes e já funcionando — principalmente pouco depois do susto de hidratação no `otp-input` (ver acima), que reforça cautela extra em qualquer edição estrutural de campo de formulário nesta rodada.

## `pagination` — ✅ `layoutId` (versão `adapted/pagination-01`) portado

| Origem                                                           | Feature           | Nota                                                       |
| ---------------------------------------------------------------- | ----------------- | ---------------------------------------------------------- |
| `shadcn-dashboard-library/adapted/pagination/pagination-01.tsx`  | `layoutId`        | ✅ Portado — indicador de página ativa deslizante          |
| `shadcn-dashboard-library/variants/pagination/pagination-01.tsx` | `layoutId`        | Não portado — versão não-adaptada do mesmo, já coberta     |
| `shadcn-dashboard-library/variants/pagination/pagination-02.tsx` | `layoutId`        | Não portado — variante alternativa do indicador deslizante |
| `shadcn-dashboard-library/variants/pagination/pagination-03.tsx` | `AnimatePresence` | Não portado — variante com enter/exit em vez de deslizante |

**O que foi feito**: mesmo padrão já estabelecido no `Tabs` (`layoutId` + `useId()` por instância) — a página ativa em `Pagination.tsx` tinha `bg-patina!`/`text-patina-fg!` estáticos, virou `motion.span` com `layoutId` atrás do número (`-z-10`, igual ao `PillTab`). `hover:brightness-[1.08]` (só no ativo) virou `hover:brightness-110` no botão inteiro em vez de só no fundo — efeito mais uniforme, já que o fundo agora é um elemento separado. Demo do showcase tem 2 instâncias de `<Pagination>` compartilhando o mesmo `page` (estado) mas com `layoutId` independente (`useId`) — testado que não colidem mesmo mostrando a mesma página ativa simultaneamente. `e2e/cn/data/pagination.spec.ts` +2 testes, e um achado de teste corrigido de passagem: `getByRole("button", {name:"Page 1"})` sem `exact` colidia com "Page 10/11/12" (substring) — corrigido nos 2 testes novos e no já existente que mascarava isso com `.first()` — 14/14 chromium-desktop + mobile-chrome.

## `progress` / `progress-ring` / `gauge` — ❌ não portado, é chrome de demo

| Origem                                                       | Feature           | Nota                                                |
| ------------------------------------------------------------ | ----------------- | --------------------------------------------------- |
| `shadcn-dashboard-library/adapted/progress/progress-04.tsx`  | `AnimatePresence` | **Já adaptado** — provável transição de valor/label |
| `shadcn-dashboard-library/variants/progress/progress-04.tsx` | `AnimatePresence` | Versão não-adaptada                                 |

**Por que não**: a origem é uma simulação inteira de "loading fake" — progresso auto-incrementando com jitter aleatório, mensagens de status rotativas, shimmer CSS e glow embaixo da barra. O único `motion`/`AnimatePresence` real ali é a troca de mensagem de status (chrome do demo, não da `Progress` em si); o shimmer/glow da própria barra é CSS puro com cores hardcoded (`bg-blue-500`, `white/40` — viola token de cor) e exigiria um novo modo `indeterminate` na `Progress` da Kikito CN (feature nova, não port de animação). A `Progress` atual já tem `transition-[width]` suave (300ms) pra mudança de valor — o caso comum já está coberto.

## `skeleton` — ❌ não portado, são templates prontos, não a primitiva

| Origem                                                       | Feature    | Nota                                                                                                                                                           |
| ------------------------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/skeleton/skeleton-03.tsx` | (sem flag) | 3 variantes de shimmer/pulse via `motion` em vez do `@keyframes shimmer` que o token bridge já tem — comparar qualidade visual antes de decidir se vale trocar |
| `shadcn-dashboard-library/variants/skeleton/skeleton-04.tsx` | (sem flag) | —                                                                                                                                                              |
| `shadcn-dashboard-library/variants/skeleton/skeleton-05.tsx` | (sem flag) | —                                                                                                                                                              |

**Por que não**: a nota do grep era imprecisa — nenhuma das 3 origens muda o shimmer/pulse da primitiva `Skeleton`. São **templates de loading prontos** (skeleton de card de perfil, de tabela, de lista) que compõem vários `<Skeleton>` numa entrada `fade-up` escalonada. A `Skeleton` da Kikito CN já tem `animate-pulse` funcional. Nada aqui é animação da primitiva — é composição de layout, categoria diferente (mais perto de `new-components` que de `animation-backport`, e mesmo assim de baixo valor: qualquer projeto pode montar isso com o `Skeleton` que já existe).

## `toast` (origem chama `sonner`) — ❌ não portado, é conteúdo de demo

| Origem                                                   | Feature           | Nota                 |
| -------------------------------------------------------- | ----------------- | -------------------- |
| `shadcn-dashboard-library/variants/sonner/sonner-06.tsx` | `AnimatePresence` | Enter/exit do toast  |
| `shadcn-dashboard-library/variants/sonner/sonner-07.tsx` | `AnimatePresence` | Variante alternativa |

**Por que não**: mesma categoria do `skeleton` acima — as origens são conteúdo customizado de toast via `toast.custom()` (card de "status de pagamento" com ripple pulsante e cores hardcoded teal/amber/red), não uma animação de entrada/saída do container `Toast` em si. O `Toast` da Kikito CN já tem `@keyframes toast-in`/`toast-out` funcionais.

## `spinner` — ❌ não portado, é uma variante nova, não animação da existente

| Origem                                                     | Feature    | Nota                                                                                    |
| ---------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `shadcn-dashboard-library/variants/spinner/spinner-07.tsx` | (sem flag) | Checar o que anima — provável rotação/pulso via `motion` em vez de `@keyframes spin-ks` |

**Por que não**: é um estilo de spinner totalmente diferente ("orbital" — núcleo pulsante central + satélite orbitando), não uma versão animada do spinner-anel que a Kikito CN já tem. O `Spinner` atual não tem sistema de `variant` pra pendurar um estilo alternativo — adicionar um seria uma variante nova (escopo de `new-components`, não de backport de animação de algo que já existe).

## `tabs` — ✅ `layoutId` (tabs-01) portado

| Origem                                               | Feature                       | Nota                                                                                                   |
| ---------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `shadcn-dashboard-library/variants/tabs/tabs-01.tsx` | `layoutId`                    | ✅ Portado — indicador deslizante nas variantes `line`/`pill` do `Tabs.tsx`, ver detalhe abaixo        |
| `shadcn-dashboard-library/variants/tabs/tabs-02.tsx` | `AnimatePresence`             | Não portado — transição de conteúdo ao trocar de aba, fica pra próxima rodada                          |
| `shadcn-dashboard-library/variants/tabs/tabs-05.tsx` | `AnimatePresence`, `layoutId` | Não portado — combina os dois padrões acima                                                            |
| `shadcn-dashboard-library/variants/tabs/tabs-06.tsx` | `layoutId`                    | Não portado — outra variante do indicador deslizante, comparar com a já portada antes de mexer de novo |
| `shadcn-dashboard-library/variants/tabs/tabs-07.tsx` | `AnimatePresence`, `layoutId` | Não portado — combinação, variante 2                                                                   |

**O que foi feito**: `LineTab`/`PillTab` em `Tabs.tsx` ganharam um `motion.span` com `layoutId` — a origem tinha só uma versão "pill circular" sem foco em acessibilidade; adaptado pras 2 variantes que fazem sentido pra indicador deslizante (`line`: barra embaixo; `pill`: fundo atrás do texto), variantes `card`/`enclosed` não mexidas (visual não pede indicador deslizante). `layoutId` gerado via `useId()` do próprio componente — **achado real, não estava no arquivo de origem** (que só tinha 1 instância na página de demo deles): sem isso, múltiplas `<Tabs>` na mesma página (a própria página de showcase da Kikito CN tem 9) tentariam sincronizar a animação umas com as outras. `focus-visible` conferido: o anel de foco fica no `<button>` externo, fora do `z-index` do indicador — não tem conflito de camada.

`e2e/cn/display/tabs.spec.ts` +2 testes (indicador aparece só na aba ativa da variante `pill`, sem vazar pra outra instância; 4 instâncias simultâneas de `line` — 1 barra cada, sem colisão de `layoutId`) — 16/16 chromium-desktop + mobile-chrome, incluindo os 5 testes já existentes (zero regressão).

## `tooltip` — ❌ não portado, padrão de UI diferente

| Origem                                                     | Feature     | Nota                                                                                                                                                                                                         |
| ---------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `shadcn-dashboard-library/variants/tooltip/tooltip-03.tsx` | `useSpring` | Posição do tooltip com física de mola em vez de `transition-[opacity,transform]` CSS que o `Tooltip` atual usa — mudança de abordagem (JS contínuo vs CSS discreto), avaliar custo/benefício antes de portar |

**Por que não**: a origem é o padrão "avatar stack com tooltip que segue e inclina com o mouse" (`useMotionValue`+`useSpring`+`useTransform` contínuos, tilt proporcional à posição X do cursor) — feito especificamente pra uma fileira de avatares sobrepostos, não pra um tooltip genérico anexado a qualquer trigger (que é o que o `Tooltip` da Kikito CN precisa ser: funciona em botões, ícones, texto). Também usa cor hardcoded (`bg-blue-500`). O `Tooltip` atual já tem `transition-[opacity,transform]` CSS funcional (140ms, já bem próximo do token `--ks-motion-fast`=150ms). Trocar CSS discreto por física contínua de mola só faz sentido no padrão de UI específico da origem — fora de escopo pro tooltip genérico.

---

## Fechamento da varredura (2026-08-29)

Todos os 43 arquivos de origem do topo deste documento foram avaliados. Resumo:

- **Portado**: `tabs`, `pagination`, `file-upload` (adaptado), `avatar`, `context-menu`/`dropdown-menu` (ClickMenu ganhou exit animation de achado), `autocomplete` (painel).
- **Tentado e revertido**: `otp-input` (hydration mismatch real, ver seção acima — não vale o risco num campo de autenticação por um efeito decorativo).
- **Não portado, sem fit real ou fora de escopo**: `accordion`, `animated-list`, `input`/`floating-label-input`, `label`, `badge`/`tag`/`status-badge`, `progress`, `skeleton`, `toast`, `spinner`, `tooltip` — cada um documentado acima com o motivo específico (a maioria cai em 2 categorias: **conteúdo/chrome de demo bespoke** com cores hardcoded, não animação de uma primitiva real; ou **variante nova** que exigiria API/feature nova, não port de animação de algo que já existe).
- **Pendente de decisão de produto, não mexido**: `table`/`data-grid`/`data-list` (stagger de entrada re-dispararia a cada sort/filtro — precisa decisão de design antes de virar código).

Não sobra nenhum item deste documento sem uma decisão registrada. Próximo trabalho de animação na Kikito CN não vem mais deste levantamento — vem de `docs/component-import/new-components/PLAN.md` (itens genuinamente novos) ou de necessidade de produto (ex.: `indeterminate` na `Progress`, decisão de stagger na `Table`).

---

## Prioridade sugerida (não obrigatória — reordenar como preferir)

1. ✅ **Tabs** (`layoutId`) — feito, ver seção `tabs` acima.
2. ✅ **Pagination** (`layoutId`) — feito, ver seção `pagination` acima.
3. ✅ **File-upload** — feito (adaptado, não `layoutId` literal), ver seção `file-upload` acima.
4. ✅ **Avatar** (`whileHover`/`whileTap`) — feito, ver seção `avatar` acima.
5. Resto por ordem de aparição, ou pela ordem que fizer sentido no roadmap do produto.
