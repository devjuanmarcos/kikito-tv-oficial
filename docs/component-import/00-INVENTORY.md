# Varredura — `shadcndashboard` → Kikito CN

Origem: `D:\DEVJUANMARCOS\PROJETOS\TEMPLATES\shadcndashboard`
Destino: **Kikito CN** (`src/components/ui/cn/**`, tokens semânticos — decisão tomada, ver CLAUDE.md pra vocabulário).
Escopo desta varredura (decisão tomada): **biblioteca de componentes apenas** — `src/components/ui/` (59 primitivos shadcn crus), `src/components/shadcn-dashboard-library/` (harvest curado: 49 categorias de variantes + 30 já "adaptadas" a tokens, com `registry.ts`/`tokens.ts` próprios), `src/components/animated-components/` (4 arquivos). **Fora do escopo**: `dashboards/`, `apps/`, `tables/`, `form/`, `website-ui/`, `user-profile/` — são composições de página inteira, não biblioteca atômica.

Lib de animação alvo (decisão tomada): **`motion`** (v12, pacote atual — `framer-motion` v12 também instalado lá mas trata-se do mesmo time/API, provavelmente legado de compat). Kikito não tem nenhum dos dois instalado ainda.

## Números da varredura

| Escopo                               | Arquivos totais | Categorias/nomes distintos |
| ------------------------------------ | --------------: | -------------------------: |
| `ui/`                                |              59 |                         59 |
| `shadcn-dashboard-library/variants/` |             310 |                         49 |
| `shadcn-dashboard-library/adapted/`  |              33 |                         30 |
| `animated-components/`               |               4 |                          4 |
| **Total em escopo**                  |         **406** |                          — |

**Achado principal da varredura**: cruzando os nomes de categoria contra os 200 componentes já existentes em `src/components/ui/cn/`, a esmagadora maioria já tem um componente-primo no Kikito CN — por nome idêntico ou por conceito equivalente com nome diferente (ex.: `sonner`→`toast`, `input-otp`→`otp-input`, `radio-group`→`radio`, `number-ticker`→`animated-number`, `dialog`→`modal`, `animated-text`→`text-effect`, `sidebar`→`vertical-nav`, `empty`→`empty-state`, `field`→`form-field`, `confetti`→`confetti-button`). Ou seja: **isto não é majoritariamente um trabalho de portar componentes novos — é um trabalho de colher técnica de animação pra enriquecer componentes que o Kikito CN já tem.** Só uma cauda pequena (~6-9 nomes) fica genuinamente sem primo óbvio — ver `new-components/PLAN.md`.

Só **43 arquivos em todo o escopo** de fato importam `motion`/`framer-motion` (0 em `ui/`, que é shadcn cru sem animação JS). Esses 43 são o material real de origem pra portar animação — ver `animation-backport/PLAN.md` pra lista completa com destino em cada um.

## Pastas deste plano

1. **[`motion-infrastructure/PLAN.md`](motion-infrastructure/PLAN.md)** — trabalho de base que precisa vir ANTES de portar qualquer animação: dependência `motion`, tokens de easing/duração no token bridge, e a pegadinha do `prefers-reduced-motion` com animação orientada a JS (o reset CSS global que a auditoria da Kikito CN já fez não cobre isso).
2. **[`animation-backport/PLAN.md`](animation-backport/PLAN.md)** — os 43 arquivos que usam `motion`, cada um mapeado pro componente Kikito CN existente que vai receber a técnica.
3. **[`new-components/PLAN.md`](new-components/PLAN.md)** — a cauda pequena de nomes sem primo óbvio na Kikito CN hoje, pra decidir se viram componente novo de verdade.

## Como usar

Cada arquivo de plano é uma lista de trabalho — nenhum código foi portado ainda, isto é só o mapa. Pra portar um item, seguir o mesmo pipeline já estabelecido em `docs/AUDITORIA-CN-STATUS.md`: ler o arquivo de origem, traduzir a classe/token pro vocabulário Kikito CN (nunca importar `bg-primary`/`bg-card` do shadcn cru direto), rodar os 9 gates, `registry:build`, Playwright, commit local (nunca `git push` sem pedir).
