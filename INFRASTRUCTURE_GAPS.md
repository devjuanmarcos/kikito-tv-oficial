# Infrastructure Gaps — Template vs. Biomob Production

> Análise comparativa entre `portal-pwa-shadcn-template` e `biomob-org-frontend`.
> Cada item lista o que está faltando e um **prompt pronto para implementação**.
> Ordem de prioridade: segurança/qualidade primeiro, features depois.

---

## Índice

1. ✅ [Type-safe Environment Variables](#1-type-safe-environment-variables)
2. ✅ [ESLint Avançado](#2-eslint-avançado)
3. ✅ [Husky + lint-staged + Commitlint](#3-husky--lint-staged--commitlint)
4. ✅ [Vitest — Unit Testing](#4-vitest--unit-testing)
5. ✅ [Playwright — E2E Testing](#5-playwright--e2e-testing)
6. ✅ [Testes de Acessibilidade](#6-testes-de-acessibilidade)
7. ~~[GitHub Actions CI/CD](#7-github-actions-cicd)~~ _(ignorado — sem orçamento para GA)_
8. ✅ [Docker — Containerização](#8-docker--containerização)
9. ✅ [Zustand Store](#9-zustand-store)
10. ✅ [Pino — Structured Logging](#10-pino--structured-logging)
11. [Rate Limiting com Upstash Redis](#11-rate-limiting-com-upstash-redis)
12. ✅ [next-safe-action](#12-next-safe-action)
13. ✅ [Sanitização de HTML](#13-sanitização-de-html)
14. ✅ [Feature Flags](#14-feature-flags)
15. ✅ [Audit Log](#15-audit-log)
16. ✅ [Middleware com RBAC](#16-middleware-com-rbac)
17. ✅ [Secretlint](#17-secretlint)
18. ✅ [Knip — Dead Code Detection](#18-knip--dead-code-detection)
19. ✅ [Next.js Config Avançado](#19-nextjs-config-avançado)
20. ✅ [Vercel Analytics + Speed Insights](#20-vercel-analytics--speed-insights)
21. ✅ [Hook: use-focus-trap](#21-hook-use-focus-trap)
22. ✅ [Arquitetura: pasta `querys/`](#22-arquitetura-pasta-querys)
23. ✅ [Arquitetura: Services por Domínio](#23-arquitetura-services-por-domínio)
24. ✅ [Bundle Analyzer](#24-bundle-analyzer)
25. ✅ [Componentes de Acessibilidade](#25-componentes-de-acessibilidade)
26. [animate-ui Components](#26-animate-ui-components)
27. ✅ [auth-utils.ts e Safe Auth Helpers](#27-auth-utilsts-e-safe-auth-helpers)
28. [Variante vinext — Migração Next.js → Vite](#28-variante-vinext--migração-nextjs--vite)

---

## 1. Type-safe Environment Variables

**O que falta:** `src/env.ts` com `@t3-oss/env-nextjs` + Zod para validar todas as variáveis de ambiente em runtime. Hoje o projeto usa `.env` sem qualquer validação — uma variável faltando só estoura em produção.

**Referência:** `biomob-org-frontend/src/env.ts` (59 linhas)

---

**PROMPT:**

```
Implemente type-safe environment variables neste projeto Next.js usando @t3-oss/env-nextjs e Zod.

Passos:
1. Instale: pnpm add @t3-oss/env-nextjs zod (zod já está instalado, verifique)
2. Crie src/env.ts seguindo este padrão:
   - import { createEnv } from "@t3-oss/env-nextjs"
   - import { z } from "zod"
   - Seção "server": variáveis privadas (NEXTAUTH_SECRET, NEXTAUTH_URL, NODE_ENV, etc.)
   - Seção "client": variáveis públicas com prefixo NEXT_PUBLIC_ (ex: NEXT_PUBLIC_APP_URL)
   - runtimeEnv: mapeamento explícito de process.env para cada variável
   - skipValidation: !!process.env.SKIP_ENV_VALIDATION (para CI/CD)
3. Atualize env.example com todas as variáveis documentadas
4. Crie .env.test.local para variáveis de teste (NODE_ENV=test, etc.)
5. Importe src/env.ts em next.config para garantir validação no build
6. Substitua todos os process.env.VARIAVEL espalhados no código por env.VARIAVEL (importado de src/env.ts)
7. Documente cada variável com comentários no env.ts

Regras:
- Variáveis de servidor nunca devem aparecer no bundle client-side
- Use z.url() para URLs, z.string().min(1) para secrets
- NODE_ENV deve usar z.enum(["development", "test", "production"])
```

---

## 2. ESLint Avançado

**O que falta:** O `.eslintrc.json` atual só tem `"extends": ["next/core-web-vitals"]`. Faltam plugins de TypeScript, SonarJS (qualidade de código), jsx-a11y (acessibilidade) e import ordering.

**Referência:** `biomob-org-frontend/.eslintrc.json`

---

**PROMPT:**

```
Atualize o ESLint deste projeto Next.js com TypeScript para uma configuração de nível produção.

Instale as dependências:
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-sonarjs eslint-plugin-jsx-a11y eslint-plugin-import

Atualize .eslintrc.json com:
- extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended", "plugin:sonarjs/recommended", "plugin:jsx-a11y/recommended"]
- plugins: ["@typescript-eslint", "sonarjs", "jsx-a11y", "import"]
- parser: "@typescript-eslint/parser"
- parserOptions: { project: "./tsconfig.json" }

Rules customizadas a adicionar:
- "@typescript-eslint/no-explicit-any": "warn"
- "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }]
- "import/order": ["error", { groups: [...], alphabetize: { order: "asc" } }]
- "import/no-duplicates": "error"
- "jsx-a11y/alt-text": "error"
- "jsx-a11y/aria-props": "error"
- "sonarjs/no-duplicate-string": ["warn", { threshold: 3 }]
- "sonarjs/cognitive-complexity": ["warn", 15]

Ignore patterns:
- .next/, node_modules/, public/, *.config.*, src/components/ui/ (shadcn gerado)

Após configurar, rode pnpm lint e corrija todos os erros críticos (não warnings).
```

---

## 3. Husky + lint-staged + Commitlint

**O que falta:** Zero automação de git hooks. Código pode ser commitado sem passar por lint, format ou type check. Sem padrão de mensagens de commit.

**Referência:** `biomob-org-frontend/.husky/`, `commitlint.config.js`, `lint-staged` em package.json

---

**PROMPT:**

```
Configure git hooks de qualidade neste projeto com Husky, lint-staged e Commitlint.

1. HUSKY
   pnpm add -D husky
   pnpm exec husky init

2. LINT-STAGED (pre-commit hook)
   pnpm add -D lint-staged

   Adicione ao package.json:
   "lint-staged": {
     "*.{ts,tsx}": ["eslint --fix --max-warnings=0", "prettier --write"],
     "*.{json,md,css}": ["prettier --write"]
   }

   Conteúdo de .husky/pre-commit:
   pnpm exec lint-staged

3. COMMITLINT (commit-msg hook)
   pnpm add -D @commitlint/cli @commitlint/config-conventional

   Crie commitlint.config.js:
   export default { extends: ["@commitlint/config-conventional"] }

   Conteúdo de .husky/commit-msg:
   pnpm exec commitlint --edit $1

4. TYPE-CHECK no pre-push (opcional mas recomendado)
   Crie .husky/pre-push:
   pnpm tsc --noEmit

Formato de commits (Conventional Commits):
- feat: nova feature
- fix: correção de bug
- docs: documentação
- refactor: refatoração sem mudança de comportamento
- test: adição/modificação de testes
- chore: manutenção, configs, dependências
- ci: mudanças em CI/CD

Adicione ao README as instruções de formato de commit.
```

---

## 4. Vitest — Unit Testing

**O que falta:** Nenhum setup de testes unitários. Apenas `@faker-js/faker` e `msw` instalados sem configuração.

**Referência:** `biomob-org-frontend/vitest.config.mts`, `src/test/setup.ts`

---

**PROMPT:**

```
Configure Vitest para testes unitários neste projeto Next.js com TypeScript.

1. INSTALAÇÃO
   pnpm add -D vitest @vitejs/plugin-react @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths

2. CRIE vitest.config.mts:
   import { defineConfig } from "vitest/config"
   import react from "@vitejs/plugin-react"
   import tsconfigPaths from "vite-tsconfig-paths"

   export default defineConfig({
     plugins: [react(), tsconfigPaths()],
     test: {
       environment: "jsdom",
       globals: true,
       setupFiles: ["./src/test/setup.ts"],
       coverage: {
         provider: "v8",
         reporter: ["text", "json", "html", "lcov"],
         thresholds: { lines: 40, functions: 40, branches: 35, statements: 40 },
         exclude: ["src/test/**", "src/@types/**", "src/providers/**", "src/components/ui/**"]
       },
       exclude: ["node_modules", ".next", "e2e/**"]
     }
   })

3. CRIE src/test/setup.ts:
   - Import "@testing-library/jest-dom"
   - Configure MSW server com beforeAll/afterEach/afterAll
   - Mock next/navigation (useRouter, usePathname, useSearchParams)
   - Mock next-intl (useTranslations retornando (key) => key)
   - Mock next/image

4. CRIE src/test/mocks/handlers/index.ts:
   - MSW handlers base para as rotas de auth (POST /api/auth/*)
   - Handler de health check

5. SCRIPTS no package.json:
   "test": "vitest",
   "test:ui": "vitest --ui",
   "test:run": "vitest run",
   "test:coverage": "vitest run --coverage"

6. ESCREVA testes de exemplo para:
   - src/lib/utils.ts (cn function)
   - src/lib/format.ts (formatters)
   - src/hooks/use-debounce.ts

Certifique-se que `pnpm test:run` passa sem erros.
```

---

## 5. Playwright — E2E Testing

**O que falta:** Sem testes end-to-end. Fluxos críticos (login, navegação, formulários) não são testados.

**Referência:** `biomob-org-frontend/playwright.config.ts`, `e2e/` folder

---

**PROMPT:**

```
Configure Playwright para testes E2E neste projeto Next.js.

1. INSTALAÇÃO
   pnpm add -D @playwright/test
   pnpm exec playwright install --with-deps chromium firefox

2. CRIE playwright.config.ts na raiz:
   - baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000"
   - 3 projetos: chromium-desktop (1280x720), firefox-desktop (1280x720), mobile-chrome (390x844)
   - Locale: pt-BR, timezone: America/Sao_Paulo
   - Screenshots: on failure only
   - Videos: on first retry
   - Traces: on first retry
   - Reporter: html (com screenshots e videos)
   - webServer: { command: "pnpm dev", port: 3000, reuseExistingServer: !process.env.CI }

3. ESTRUTURA de pastas:
   e2e/
   ├── auth/
   │   └── login.spec.ts
   ├── navigation/
   │   └── navigation.spec.ts
   ├── accessibility/
   │   └── a11y.spec.ts
   └── forms/
       └── form-validation.spec.ts

4. ESCREVA testes base:
   - auth/login.spec.ts: página de login renderiza, formulário valida campos obrigatórios
   - navigation/navigation.spec.ts: homepage carrega, links do menu funcionam
   - accessibility/a11y.spec.ts: sem erros de a11y críticos na homepage (use @axe-core/playwright)

5. INSTALE axe-core para testes de a11y:
   pnpm add -D @axe-core/playwright

6. SCRIPTS no package.json:
   "test:e2e": "playwright test",
   "test:e2e:ui": "playwright test --ui",
   "test:e2e:report": "playwright show-report"

7. Adicione e2e/ e playwright-report/ ao .gitignore (manter test-results/)
```

---

## 6. Testes de Acessibilidade

**O que falta:** Nenhum teste automatizado de acessibilidade (WCAG 2.1 AA).

**Referência:** `biomob-org-frontend` usa `@axe-core/playwright` + `jest-axe`

---

**PROMPT:**

```
Adicione testes de acessibilidade automatizados a este projeto (após Vitest e Playwright já configurados).

1. UNIT TESTS (jest-axe com Vitest)
   pnpm add -D jest-axe @types/jest-axe

   Crie src/test/a11y-utils.ts com helper:
   import { axe, toHaveNoViolations } from "jest-axe"
   expect.extend(toHaveNoViolations)
   export { axe }

   Crie testes a11y para componentes críticos:
   - src/components/ui/button.test.tsx: botão tem accessible name
   - src/components/ui/dialog.test.tsx: dialog tem role=dialog e aria-label
   - src/components/form/: inputs têm labels associadas

2. E2E TESTS (axe-core/playwright)
   No e2e/accessibility/a11y.spec.ts (já criado):
   import { checkA11y } from "axe-playwright" (ou AxeBuilder do @axe-core/playwright)

   Testes:
   - Homepage não tem violações de nível crítico
   - Página de login não tem violações
   - Navegação por teclado funciona (Tab order lógico)
   - Skip links presentes e funcionais
   - Imagens têm alt text

3. CRIE src/components/a11y/:
   - skip-to-content.tsx: link "Pular para conteúdo principal" (visível ao Tab, oculto visualmente)
   - sr-only.tsx: utilitário para texto somente para leitores de tela
   - Adicione SkipToContent no layout raiz antes do header

4. Configure score mínimo no CI: nenhuma violação de nível "critical" ou "serious" permitida.
```

---

## 7. GitHub Actions CI/CD

**O que falta:** Zero automação de CI. PRs podem ser mergeados sem passar por lint, testes ou build.

**Referência:** `biomob-org-frontend/.github/workflows/`

---

**PROMPT:**

```
Configure GitHub Actions CI/CD para este projeto Next.js com pnpm.

Crie os seguintes workflows em .github/workflows/:

1. ci.yml — Pipeline principal (trigger: push/PR para main e develop)
   Jobs sequenciais:
   a) lint: pnpm lint + pnpm tsc --noEmit
   b) test: pnpm test:run (vitest) com upload do coverage para Codecov (opcional)
   c) build: pnpm build com SKIP_ENV_VALIDATION=1
   d) e2e: pnpm test:e2e (playwright) — apenas em PRs para main

   Configurações:
   - Node: 20, pnpm: 9 (usar pnpm/action-setup)
   - Cache: ~/.pnpm-store
   - Timeout: 15min por job
   - Falhar rápido: false (todos os jobs rodam)
   - Upload artifacts: playwright-report e coverage se falhar

2. security.yml — Segurança (trigger: push para main, schedule diário)
   - Secretlint: pnpm dlx secretlint "**/*"
   - pnpm audit --audit-level=high

3. lighthouse-ci.yml — Performance (trigger: push para main)
   - Build do projeto
   - Rodar Lighthouse CI
   - Thresholds: performance≥80, accessibility≥90, best-practices≥85, seo≥85

Extras:
- Adicionar .github/PULL_REQUEST_TEMPLATE.md com checklist
- Adicionar .github/ISSUE_TEMPLATE/ com bug report e feature request
- Cache de dependências entre jobs
- Variáveis de ambiente de CI: SKIP_ENV_VALIDATION=1, NODE_ENV=test
```

---

## 8. Docker — Containerização

**O que falta:** Sem suporte a containers. Deploy depende de plataformas específicas.

**Referência:** `biomob-org-frontend/Dockerfile`, `docker-compose.yml`

---

**PROMPT:**

```
Adicione suporte Docker a este projeto Next.js com build multi-stage otimizado.

1. DOCKERFILE (multi-stage, production-ready):
   Stage 1 - base: node:20-alpine, instalar pnpm, configurar workdir
   Stage 2 - deps: copiar package.json + pnpm-lock.yaml, rodar pnpm install --frozen-lockfile
   Stage 3 - builder: copiar deps, copiar source, SKIP_ENV_VALIDATION=1, rodar pnpm build
   Stage 4 - runner: node:20-alpine, criar user nextjs (uid 1001), copiar standalone output

   Configurações de segurança:
   - Rodar como usuário não-root (nextjs:nodejs)
   - EXPOSE 3000
   - ENV NODE_ENV=production PORT=3000 HOSTNAME="0.0.0.0"
   - CMD ["node", "server.js"]

2. ATUALIZE next.config.ts:
   Adicione output: "standalone" para suporte a Docker (já que usa Serwist/PWA, verificar compatibilidade)

3. DOCKER-COMPOSE.yml:
   Serviço "app" (produção):
   - build: .
   - ports: "3000:3000"
   - env_file: .env.local
   - restart: unless-stopped

   Serviço "dev" (desenvolvimento):
   - image: node:20-alpine
   - volumes: .:/app, /app/node_modules, /app/.next
   - command: pnpm dev
   - ports: "3000:3000"

4. .dockerignore:
   node_modules, .next, .git, .env.local, coverage, playwright-report, test-results

5. SCRIPTS no package.json:
   "docker:build": "docker build -t app .",
   "docker:run": "docker run -p 3000:3000 --env-file .env.local app",
   "docker:compose": "docker-compose up"

Testar: docker build -t template . deve completar sem erros.
```

---

## 9. Zustand Store

**O que falta:** Sem gerenciamento de estado client-side. UI state (modais abertos, sidebars, etc.) está disperso em componentes com useState.

**Referência:** `biomob-org-frontend/src/stores/ui-store.ts`

---

**PROMPT:**

```
Adicione Zustand para gerenciamento de estado client-side neste projeto Next.js.

1. INSTALAÇÃO
   pnpm add zustand

2. CRIE src/stores/ui-store.ts:
   Interface UIStore com:
   - Sidebar: isSidebarOpen (boolean), toggleSidebar(), setSidebarOpen(open: boolean)
   - Modals: activeModal (string | null), openModal(id: string), closeModal()
   - Command palette: isCommandOpen (boolean), toggleCommand(), setCommandOpen(open: boolean)
   - Theme preference: locale, setLocale (se não usar next-intl context)

   Implementação:
   import { create } from "zustand"
   import { persist } from "zustand/middleware"

   Use persist middleware para sidebar state (localStorage)
   Não persista modal state (sessão apenas)

3. CRIE src/stores/index.ts:
   Re-export de todos os stores (padrão barrel)

4. HOOKS de seleção (evitar re-renders):
   Export seletores como:
   export const useSidebarOpen = () => useUIStore((s) => s.isSidebarOpen)
   export const useActiveModal = () => useUIStore((s) => s.activeModal)

5. REFATORE componentes existentes:
   - Substitua useState para sidebar no layout por useUIStore
   - Substitua useState para command palette por useUIStore

6. ADICIONE devtools do Zustand em desenvolvimento:
   import { devtools } from "zustand/middleware"
   Wrape o store com devtools em process.env.NODE_ENV === "development"

7. ESCREVA teste unitário para o store:
   - Teste toggleSidebar muda o estado
   - Teste openModal define activeModal corretamente
   - Teste closeModal limpa activeModal
```

---

## 10. Pino — Structured Logging

**O que falta:** Sem logging estruturado. `console.log` espalhado pelo código sem contexto, sem níveis, sem formato consistente.

**Referência:** `biomob-org-frontend/src/lib/logger.ts`

---

**PROMPT:**

```
Implemente logging estruturado com Pino neste projeto Next.js.

1. INSTALAÇÃO
   pnpm add pino
   pnpm add -D pino-pretty

2. CRIE src/lib/logger.ts:
   import pino from "pino"

   Configuração:
   - Em development: usar pino-pretty com colorize: true, translateTime: "HH:MM:ss"
   - Em production: JSON puro (sem pretty-print)
   - Nível base: "info" (prod) ou "debug" (dev)
   - Adicionar campo base: { service: "portal-pwa" }

   Exportar:
   export const logger = pino({ ... })

   Funções tipadas:
   export const log = {
     info: (msg: string, data?: object) => logger.info(data, msg),
     warn: (msg: string, data?: object) => logger.warn(data, msg),
     error: (msg: string, error?: unknown, data?: object) => logger.error({ err: error, ...data }, msg),
     debug: (msg: string, data?: object) => logger.debug(data, msg),
   }

3. USO nos Route Handlers e Server Actions:
   - Logar início e fim de operações críticas
   - Logar erros com stack trace
   - Nunca logar dados sensíveis (senhas, tokens)
   - Exemplo: log.info("User authenticated", { userId, role })

4. INTEGRAÇÃO com middleware:
   Logar requests em desenvolvimento: method, pathname, status (não logar em prod para performance)

5. SUBSTITUA console.log/error por log.info/error nos arquivos de lib/ e services/

Nota: Pino é server-only. Para client-side use console (ou integre com um serviço como Sentry).
```

---

## 11. Rate Limiting com Upstash Redis

**O que falta:** APIs e Server Actions sem proteção contra abuso. Um bot pode spammar formulários, autenticação, etc.

**Referência:** `biomob-org-frontend/src/lib/rate-limit.ts`

---

**PROMPT:**

```
Implemente rate limiting nas API routes e Server Actions usando Upstash Redis.

1. INSTALAÇÃO
   pnpm add @upstash/ratelimit @upstash/redis

2. VARIÁVEIS de ambiente (adicionar ao env.ts e env.example):
   UPSTASH_REDIS_REST_URL=
   UPSTASH_REDIS_REST_TOKEN=

3. CRIE src/lib/rate-limit.ts:
   import { Ratelimit } from "@upstash/ratelimit"
   import { Redis } from "@upstash/redis"

   Criar instâncias pré-configuradas:
   - rateLimitDefault: 10 requests por 10 segundos (uso geral)
   - rateLimitAuth: 5 requests por 60 segundos (endpoints de autenticação)
   - rateLimitForms: 3 requests por 60 segundos (envio de formulários)

   Função helper:
   export async function checkRateLimit(
     identifier: string,
     limiter: Ratelimit = rateLimitDefault
   ): Promise<{ success: boolean; remaining: number; reset: number }>

4. APLIQUE em Route Handlers críticos:
   - POST /api/auth/* — rateLimitAuth
   - Qualquer POST de formulário público — rateLimitForms

   Identificador: IP do usuário via headers("x-forwarded-for") || headers("x-real-ip")

   Se bloqueado: return NextResponse.json({ error: "Too many requests" }, { status: 429 })
   Adicionar headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

5. FALLBACK para desenvolvimento local:
   Se UPSTASH_REDIS_REST_URL não estiver configurado, retornar { success: true } (sem rate limit)
   Isso permite desenvolvimento sem Redis.

6. TESTE:
   Escreva teste unitário mockando o Ratelimit para:
   - Retornar success: true quando dentro do limite
   - Retornar success: false quando excedido
```

---

## 12. next-safe-action

**O que falta:** Server Actions sem validação tipada nem tratamento de erros padronizado.

**Referência:** `biomob-org-frontend/src/lib/safe-action.ts`, uso extensivo em `src/app/actions/`

---

**PROMPT:**

```
Configure next-safe-action para Server Actions type-safe com validação Zod integrada.

1. INSTALAÇÃO
   pnpm add next-safe-action

2. CRIE src/lib/safe-action.ts:
   import { createSafeActionClient } from "next-safe-action"
   import { z } from "zod"

   Criar dois clientes:

   a) actionClient (público):
      createSafeActionClient({
        handleServerError(e) {
          log.error("Server action error", e)
          if (e instanceof Error) return e.message
          return "Erro inesperado. Tente novamente."
        }
      })

   b) authActionClient (autenticado):
      actionClient.use(async ({ next, ctx }) => {
        const session = await getServerSession()
        if (!session?.user) throw new Error("Não autenticado")
        return next({ ctx: { user: session.user } })
      })

3. PADRÃO de uso para Server Actions:
   "use server"
   import { authActionClient } from "@/lib/safe-action"
   import { z } from "zod"

   export const updateProfileAction = authActionClient
     .schema(z.object({ name: z.string().min(1) }))
     .action(async ({ parsedInput, ctx }) => {
       // ctx.user disponível e tipado
       return { success: true }
     })

4. HOOK para uso em componentes:
   import { useAction } from "next-safe-action/hooks"

   const { execute, result, status } = useAction(updateProfileAction)
   // status: "idle" | "executing" | "hasSucceeded" | "hasErrored"

5. MIGRE as Server Actions existentes em src/app/actions/ para usar safe-action

6. ESCREVA testes para:
   - Action com input válido retorna resultado
   - Action com input inválido retorna erro de validação
   - Action autenticada sem sessão retorna erro de autenticação
```

---

## 13. Sanitização de HTML

**O que falta:** Conteúdo HTML externo (Tiptap, APIs, usuário) renderizado sem sanitização — vulnerabilidade XSS.

**Referência:** `biomob-org-frontend/src/lib/sanitize.ts`

---

**PROMPT:**

```
Implemente sanitização de HTML para prevenir XSS neste projeto Next.js.

1. INSTALAÇÃO
   pnpm add isomorphic-dompurify
   pnpm add -D @types/dompurify

2. CRIE src/lib/sanitize.ts:
   import DOMPurify from "isomorphic-dompurify"

   Configurações pré-definidas:

   a) sanitizeHtml(dirty: string): string
      Configuração padrão: permite bold, italic, links, listas
      { ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "ul", "ol", "li", "p", "br"] }
      { ALLOWED_ATTR: ["href", "target", "rel"] }
      Sempre adicionar rel="noopener noreferrer" em links externos

   b) sanitizeRichText(dirty: string): string
      Para conteúdo Tiptap/WYSIWYG: permite mais tags (h1-h6, blockquote, code, pre, img)
      Mas bloqueia scripts, iframes, event handlers

   c) sanitizeStrict(dirty: string): string
      Remove TODO HTML — retorna texto puro

3. APLIQUE em todos os pontos que renderizam HTML externo:
   - dangerouslySetInnerHTML sempre deve usar sanitizeHtml ou sanitizeRichText
   - Adicionar ESLint rule para detectar dangerouslySetInnerHTML sem sanitize:
     "react/no-danger": "warn"

4. ESCREVA testes unitários:
   - sanitizeHtml remove <script> tags
   - sanitizeHtml preserva <strong> e <a>
   - sanitizeStrict remove todo HTML
   - Ataque XSS clássico é neutralizado: <img src=x onerror=alert(1)>
```

---

## 14. Feature Flags

**O que falta:** Features são ativadas/desativadas apenas via código. Deploy é necessário para qualquer toggle de feature.

**Referência:** `biomob-org-frontend/src/lib/feature-flags.ts` com Vercel Edge Config

---

**PROMPT:**

```
Implemente um sistema de feature flags para este projeto Next.js.

Opção A — Vercel Edge Config (recomendado para projetos Vercel):
1. Instalar: pnpm add @vercel/edge-config
2. Adicionar EDGE_CONFIG ao env.ts
3. Criar src/lib/feature-flags.ts:
   import { get } from "@vercel/edge-config"

   Definir flags tipadas:
   type FeatureFlag = "new_dashboard" | "beta_feature" | "maintenance_mode"

   export async function isFeatureEnabled(flag: FeatureFlag): Promise<boolean> {
     try {
       return (await get<boolean>(flag)) ?? false
     } catch {
       return false // Fallback seguro
     }
   }

   export async function getFeatureFlags(): Promise<Record<FeatureFlag, boolean>> {
     // Busca todas as flags de uma vez
   }

Opção B — Arquivo de configuração local (simples, sem infra):
1. Criar src/config/feature-flags.ts com objeto de flags
2. Em development/staging: flags diferentes de production
3. Override via variável de ambiente FEATURE_FLAGS="flag1=true,flag2=false"

Independente da opção:
- Criar type FeatureFlag como union de strings (type-safe)
- Fallback sempre para false (feature desabilitada) em caso de erro
- Caching das flags (não chamar a cada request)
- Usar em Server Components: const enabled = await isFeatureEnabled("new_dashboard")
- Usar em middleware para redirect/block de rotas

Escreva testes para o fallback em caso de erro da Edge Config.
```

---

## 15. Audit Log

**O que falta:** Zero rastreabilidade de ações do usuário. Sem logs de quem fez o quê e quando.

**Referência:** `biomob-org-frontend/src/lib/audit-log.ts`

---

**PROMPT:**

```
Implemente um sistema básico de audit log para rastrear ações críticas do usuário.

1. CRIE src/lib/audit-log.ts:

   Tipo AuditEntry:
   {
     action: string        // "user.login", "profile.update", "resource.delete"
     userId?: string
     userEmail?: string
     ip?: string
     userAgent?: string
     metadata?: Record<string, unknown>
     timestamp: string     // ISO 8601
     success: boolean
     errorMessage?: string
   }

   Função principal:
   export async function auditLog(entry: Omit<AuditEntry, "timestamp">): Promise<void>

   Implementação:
   - Usar logger.info (Pino) para persistir no stdout/log aggregator
   - Formato: { type: "AUDIT", ...entry, timestamp: new Date().toISOString() }
   - Em produção, logs são coletados pelo Vercel/container orchestrator
   - Nunca logar dados sensíveis (senhas, tokens, CPF completo)

2. APLIQUE em ações críticas:
   - Login bem-sucedido/falhado
   - Logout
   - Alteração de perfil
   - Operações de admin (criação/exclusão de recursos)

   Exemplo de uso em Server Action:
   await auditLog({
     action: "user.login",
     userId: user.id,
     userEmail: user.email,
     ip: getClientIP(request),
     success: true
   })

3. HELPER getClientIP:
   Criar em src/lib/request-utils.ts:
   Extrair IP de headers: x-forwarded-for, x-real-ip, cf-connecting-ip

4. Garantir que auditLog NUNCA jogue exceção (try/catch internamente)
   — falha de log não deve quebrar a operação do usuário.
```

---

## 16. Middleware com RBAC

**O que falta:** O middleware atual só gerencia i18n e expiração de sessão. Sem controle de acesso baseado em roles.

**Referência:** `biomob-org-frontend/src/middleware.ts` com rotas por role (admin, aluno, voluntario)

---

**PROMPT:**

```
Evolua o middleware.ts para suportar Role-Based Access Control (RBAC).

Contexto: o middleware atual tem controle de sessão expirada comentado. Ative e expanda.

1. DEFINA as roles do sistema em src/lib/auth-utils.ts:
   export type UserRole = "admin" | "user" | "moderator" // ajuste conforme seu sistema

   export const ROLE_ROUTES: Record<string, UserRole[]> = {
     "/dashboard/admin": ["admin"],
     "/dashboard/moderator": ["admin", "moderator"],
     "/dashboard": ["admin", "moderator", "user"],
   }

2. ATUALIZE src/middleware.ts:
   Lógica de RBAC:

   a) Verificar se rota requer autenticação
   b) Se requer: verificar token/sessão
   c) Se autenticado: verificar se role do usuário tem permissão para a rota
   d) Se sem permissão: redirect para /[locale]/unauthorized
   e) Se não autenticado: redirect para /[locale]/login com callbackUrl

   Criar função matchesProtectedRoute(pathname: string): UserRole[] | null
   Criar função getUserRoleFromToken(token: JWT): UserRole | null

3. CRIE a página src/app/[locale]/unauthorized/page.tsx:
   Página simples com mensagem de acesso negado e link para voltar/dashboard

4. CRIE src/lib/auth-utils.ts:
   - hasRequiredRole(userRole: UserRole, requiredRoles: UserRole[]): boolean
   - getRedirectUrl(locale: string, callbackUrl: string): string
   - isPublicRoute(pathname: string): boolean (lista de rotas públicas)

5. PROTEJA rotas em massa com pattern matching:
   Usar micromatch ou string.startsWith para matching eficiente
   Evitar verificação de token para assets estáticos e rotas de API pública

6. ESCREVA testes para auth-utils.ts:
   - hasRequiredRole funciona para todos os cenários
   - isPublicRoute identifica rotas corretamente
```

---

## 17. Secretlint

**O que falta:** Sem detecção automática de secrets commitados (API keys, tokens, senhas).

**Referência:** `biomob-org-frontend/.secretlintrc.json`

---

**PROMPT:**

```
Configure Secretlint para detectar e prevenir vazamento de secrets no repositório.

1. INSTALAÇÃO
   pnpm add -D secretlint @secretlint/secretlint-rule-preset-recommend

2. CRIE .secretlintrc.json:
   {
     "rules": [
       {
         "id": "@secretlint/secretlint-rule-preset-recommend"
       }
     ]
   }

3. ADICIONE ao package.json:
   "secretlint": "secretlint \"**/*\""

   Ignore patterns (.secretlintignore):
   node_modules/
   .next/
   pnpm-lock.yaml
   *.test.ts
   *.spec.ts
   src/test/
   CHANGELOG.md

4. INTEGRE no pre-commit hook (adicionar ao .husky/pre-commit):
   pnpm secretlint
   Se falhar: bloquear commit com mensagem clara

5. INTEGRE no GitHub Actions security.yml (criado na etapa 7):
   pnpm secretlint

6. RODE uma varredura inicial:
   pnpm secretlint "**/*"
   Se encontrar secrets reais: removê-los imediatamente e rotar as credenciais comprometidas

7. ADICIONE ao .gitignore se ainda não estiver:
   .env
   .env.local
   .env.*.local
   *.pem
   *.key
```

---

## 18. Knip — Dead Code Detection

**O que falta:** Sem detecção de código morto. Exports não usados, dependências não utilizadas acumulam ao longo do tempo.

**Referência:** `biomob-org-frontend` usa `knip@^5.88.0`

---

**PROMPT:**

```
Configure Knip para detectar código morto, exports não utilizados e dependências desnecessárias.

1. INSTALAÇÃO
   pnpm add -D knip

2. CRIE knip.config.ts na raiz:
   import type { KnipConfig } from "knip"

   const config: KnipConfig = {
     entry: [
       "src/app/**/{page,layout,loading,error,not-found}.tsx",
       "src/app/**/route.ts",
       "src/middleware.ts",
       "src/env.ts",
     ],
     ignore: [
       "src/components/ui/**",  // shadcn gerado
       "src/@types/**",
       "src/test/**",
       "**/*.test.{ts,tsx}",
       "**/*.spec.{ts,tsx}",
     ],
     ignoreDependencies: [
       "tailwindcss",  // usado via PostCSS
       "postcss",
     ]
   }
   export default config

3. ADICIONE scripts:
   "knip": "knip",
   "knip:fix": "knip --fix"  // remove exports não usados automaticamente (cuidado!)

4. RODE e analise:
   pnpm knip

   Categorias de output a verificar:
   - Unlisted dependencies: dependências usadas mas não no package.json
   - Unused dependencies: instaladas mas nunca importadas
   - Unused exports: funções/tipos exportados mas nunca consumidos
   - Unused files: arquivos não referenciados

5. INTEGRE no CI (opcional, como warning):
   pnpm knip --reporter compact 2>&1 || true  // não falha o CI, apenas reporta

Nota: Não rodar knip --fix automaticamente em CI — pode remover exports que são usados externamente (libs).
```

---

## 19. Next.js Config Avançado

**O que falta:** `next.config.ts` básico. Sem security headers, sem cache otimizado, sem proteção de produção.

**Referência:** `biomob-org-frontend/next.config.mjs` (110 linhas)

---

**PROMPT:**

```
Atualize next.config.ts com configurações de produção: security headers, caching e otimizações.

1. SECURITY HEADERS (Content-Security-Policy, HSTS, etc.):
   Adicionar função getSecurityHeaders() que retorna array de headers:

   - X-DNS-Prefetch-Control: on
   - X-XSS-Protection: 1; mode=block
   - X-Frame-Options: SAMEORIGIN
   - X-Content-Type-Options: nosniff
   - Referrer-Policy: strict-origin-when-cross-origin
   - Permissions-Policy: camera=(), microphone=(), geolocation=()
   - Strict-Transport-Security: max-age=63072000; includeSubDomains; preload (apenas production)
   - Content-Security-Policy: configuração cuidadosa que não quebre o Next.js
     (default-src 'self', script-src 'self' 'unsafe-inline' 'unsafe-eval' (dev) | 'self' (prod))

2. CACHE HEADERS para assets estáticos:
   Matcher para /_next/static/**:
   Cache-Control: public, max-age=31536000, immutable

   Matcher para imagens públicas /public/**:
   Cache-Control: public, max-age=86400, stale-while-revalidate=604800

3. IMAGENS (domains autorizados):
   images: {
     remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }],
     formats: ["image/webp", "image/avif"],
     deviceSizes: [640, 750, 828, 1080, 1200],
   }

4. EXPERIMENTAL features úteis:
   - serverComponentsExternalPackages: ["pino"] (se usando pino)
   - optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"] (tree-shaking)

5. BUNDLE ANALYZER (condicional):
   const withBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: process.env.ANALYZE === "true" })
   Script: "analyze": "ANALYZE=true pnpm build"

6. MANTER configuração PWA existente (Serwist) — integrar sem quebrar.

7. VERIFICAR: pnpm build deve completar sem erros após as mudanças.
```

---

## 20. Vercel Analytics + Speed Insights

**O que falta:** Sem monitoramento de performance e analytics de produção.

**Referência:** `biomob-org-frontend` usa `@vercel/analytics` e `@vercel/speed-insights`

---

**PROMPT:**

```
Adicione Vercel Analytics e Speed Insights ao projeto para monitorar performance em produção.

1. INSTALAÇÃO
   pnpm add @vercel/analytics @vercel/speed-insights

2. INTEGRAÇÃO no layout raiz (src/app/[locale]/layout.tsx ou layout raiz):
   import { Analytics } from "@vercel/analytics/react"
   import { SpeedInsights } from "@vercel/speed-insights/next"

   Adicionar dentro do <body> antes de fechar:
   <Analytics />
   <SpeedInsights />

3. VERIFICAR que só carrega em produção:
   Analytics e SpeedInsights têm controle interno, mas para garantir:
   {process.env.NODE_ENV === "production" && <Analytics />}

4. CUSTOM EVENTS (opcional):
   import { track } from "@vercel/analytics"

   Rastrear eventos importantes:
   - track("form_submit", { form: "contact" })
   - track("download", { file: "annual-report" })
   - track("cta_click", { location: "hero" })

5. CORE WEB VITALS:
   Speed Insights monitora automaticamente:
   - LCP (Largest Contentful Paint) — target < 2.5s
   - FID/INP (Interaction to Next Paint) — target < 200ms
   - CLS (Cumulative Layout Shift) — target < 0.1

   Se scores estiverem baixos, investigar:
   - Imagens sem width/height (causa CLS)
   - Fonts sem font-display: swap
   - JavaScript bloqueando renderização

Nota: Funciona automaticamente no Vercel. Para outros hosts, configurar manualmente.
```

---

## 21. Hook: use-focus-trap

**O que falta:** Modais e dropdowns não prendem o foco (violação de acessibilidade WCAG 2.1 — 2.1.2 No Keyboard Trap reverso).

**Referência:** `biomob-org-frontend/src/hooks/use-focus-trap.ts`

---

**PROMPT:**

```
Implemente o hook use-focus-trap para gerenciar foco em modais e overlays.

1. CRIE src/hooks/use-focus-trap.ts:

   Interface:
   interface UseFocusTrapOptions {
     enabled?: boolean      // ativar/desativar dinamicamente
     returnFocusOnUnmount?: boolean  // retornar foco ao elemento anterior
     initialFocusRef?: RefObject<HTMLElement>  // elemento a focar ao abrir
   }

   Implementação:
   - Capturar o elemento focado antes de ativar a trap
   - Ao ativar: focar o primeiro elemento focável ou initialFocusRef
   - Interceptar Tab e Shift+Tab para manter foco dentro do container
   - Ao desmontar: retornar foco ao elemento original (se returnFocusOnUnmount)

   Elementos focáveis: a[href], button:not([disabled]), input:not([disabled]),
   textarea, select, [tabindex]:not([tabindex="-1"])

   export function useFocusTrap<T extends HTMLElement>(
     options: UseFocusTrapOptions = {}
   ): RefObject<T>

2. APLIQUE em componentes que precisam:
   - Dialog/Modal: sempre deve ter focus trap quando aberto
   - Drawer: ao abrir, prender foco
   - CommandPalette (kbar): ao abrir

   Exemplo:
   const containerRef = useFocusTrap<HTMLDivElement>({ enabled: isOpen, returnFocusOnUnmount: true })
   <div ref={containerRef} role="dialog" aria-modal="true">

3. ESCREVA testes:
   - Tab prende o foco dentro do container
   - Shift+Tab faz ciclo reverso
   - Ao desmontar, foco retorna ao elemento original
   - Funciona corretamente com enabled: false

4. ADICIONE ao src/components/a11y/ um componente FocusTrap:
   <FocusTrap enabled={isOpen} returnFocusOnUnmount>
     {children}
   </FocusTrap>
```

---

## 22. Arquitetura: pasta `querys/`

**O que falta:** React Query hooks misturados com services ou em componentes. Sem organização por domínio.

**Referência:** `biomob-org-frontend/src/querys/` com 40+ arquivos organizados por módulo

---

**PROMPT:**

```
Reorganize os React Query hooks em uma pasta dedicada src/querys/ organizada por domínio.

1. ESTRUTURA de pastas:
   src/querys/
   ├── index.ts          (re-exports)
   └── auth/
       ├── use-session.ts
       └── use-user-profile.ts

2. PADRÃO para cada hook:
   a) Query Keys: usar factory pattern
      export const authKeys = {
        all: ["auth"] as const,
        session: () => [...authKeys.all, "session"] as const,
        profile: (userId: string) => [...authKeys.all, "profile", userId] as const,
      }

   b) Query Hook:
      export function useSession() {
        return useQuery({
          queryKey: authKeys.session(),
          queryFn: () => authService.getSession(),
          staleTime: 5 * 60 * 1000, // 5 minutos
        })
      }

   c) Mutation Hook:
      export function useUpdateProfile() {
        const queryClient = useQueryClient()
        return useMutation({
          mutationFn: (data: UpdateProfileInput) => profileService.update(data),
          onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.all })
        })
      }

3. REGRAS:
   - queryFn sempre chama service (não faz fetch diretamente)
   - staleTime configurado por tipo de dado (dados raros mudam: 30min, dados frequentes: 30s)
   - Queries que dependem de auth verificam se há sessão antes de rodar
   - Usar enabled: !!userId para queries condicionais

4. MIGRE qualquer useQuery/useMutation que esteja em componentes para esta pasta

5. CRIE src/querys/index.ts com todos os exports organizados por módulo

6. DOCUMENTE os query keys (cruciais para invalidação correta de cache)
```

---

## 23. Arquitetura: Services por Domínio

**O que falta:** `src/services/axios.ts` único para toda a aplicação. Sem separação por API/domínio.

**Referência:** `biomob-org-frontend/src/services/` com axios instance por API e funções tipadas

---

**PROMPT:**

```
Refatore a camada de services para uma arquitetura modular por domínio.

1. ESTRUTURA proposta:
   src/services/
   ├── http.ts              (factory de axios instances)
   ├── auth/
   │   ├── auth.service.ts  (funções de API)
   │   ├── auth.types.ts    (tipos de request/response)
   │   └── index.ts
   └── (outros domínios conforme crescimento)

2. CRIE src/services/http.ts — factory pattern:
   import axios, { AxiosInstance } from "axios"

   interface CreateHttpClientOptions {
     baseURL: string
     timeout?: number
     withAuth?: boolean  // adicionar Authorization header automaticamente
   }

   export function createHttpClient(options: CreateHttpClientOptions): AxiosInstance {
     const instance = axios.create({
       baseURL: options.baseURL,
       timeout: options.timeout ?? 10000,
       headers: { "Content-Type": "application/json" }
     })

     if (options.withAuth) {
       // Request interceptor: adicionar Bearer token
       // Response interceptor: refresh token em 401
     }

     // Response interceptor: transformar erros em tipo padronizado
     return instance
   }

3. PADRÃO de erros — criar src/services/errors.ts:
   class ApiError extends Error {
     constructor(
       public status: number,
       public code: string,
       message: string,
       public data?: unknown
     ) { super(message) }
   }

   Mapear erros HTTP para ApiError no interceptor global

4. SERVIÇOS tipados:
   Cada service expõe funções com tipos explícitos:
   export async function getProfile(userId: string): Promise<UserProfile>
   export async function updateProfile(data: UpdateProfileInput): Promise<UserProfile>

   Nunca expor a axios instance diretamente.

5. MANTER retrocompatibilidade:
   Renomear src/services/axios.ts para http.ts gradualmente
   Garantir que todos os services importem da factory, não do axios diretamente
```

---

## 24. Bundle Analyzer

**O que falta:** Sem visibilidade sobre o tamanho do bundle. Dependências pesadas passam despercebidas.

**Referência:** `biomob-org-frontend` usa `@next/bundle-analyzer`

---

**PROMPT:**

```
Configure @next/bundle-analyzer para análise de tamanho de bundle.

1. INSTALAÇÃO
   pnpm add -D @next/bundle-analyzer

2. ATUALIZE next.config.ts (após as melhorias do item 19):
   import withBundleAnalyzerInit from "@next/bundle-analyzer"

   const withBundleAnalyzer = withBundleAnalyzerInit({
     enabled: process.env.ANALYZE === "true",
     openAnalyzer: true,
   })

   Wrape a config final: export default withBundleAnalyzer(withSerwist(nextConfig))

3. ADICIONE scripts:
   "analyze": "cross-env ANALYZE=true pnpm build",
   "analyze:server": "cross-env BUNDLE_ANALYZE=server ANALYZE=true pnpm build",
   "analyze:browser": "cross-env BUNDLE_ANALYZE=browser ANALYZE=true pnpm build"

   pnpm add -D cross-env

4. RODE e analise:
   pnpm analyze

   Métricas a verificar:
   - First Load JS por rota: target < 100KB (ideal < 80KB)
   - Chunks compartilhados: verificar se há duplicação
   - Dependências pesadas: identificar candidatos para dynamic import

5. OTIMIZAÇÕES comuns após análise:
   a) Dynamic imports para componentes pesados:
      const HeavyChart = dynamic(() => import("recharts").then(m => m.LineChart), { ssr: false })

   b) Tree shaking para lucide-react:
      import { Home } from "lucide-react" (não: import * from "lucide-react")

   c) Adicionar ao next.config: optimizePackageImports: ["lucide-react", "date-fns"]

6. ADICIONE ao CI um step que verifica o tamanho do bundle:
   Usar @next/bundle-analyzer output para comparar com baseline
```

---

## 25. Componentes de Acessibilidade

**O que falta:** Sem componentes dedicados a acessibilidade. Sem skip links, sem barra de acessibilidade.

**Referência:** `biomob-org-frontend/src/components/a11y/`, `src/components/header/barra-acessibilidade/`

---

**PROMPT:**

```
Crie uma pasta src/components/a11y/ com componentes de acessibilidade essenciais.

1. src/components/a11y/skip-to-content.tsx
   - Link "Pular para o conteúdo principal" no início do DOM
   - Visualmente oculto até receber foco (sr-only até :focus)
   - Ao clicar/Enter: move foco para <main id="main-content">
   - Estilo ao focar: visível, alto contraste, z-index alto
   - Adicionar ao layout raiz como primeiro elemento do body

2. src/components/a11y/visually-hidden.tsx
   - Componente wrapper que aplica classes sr-only
   - Útil para texto descritivo somente para screen readers
   - Props: as (elemento HTML), children
   - Substituir spans com className="sr-only" por este componente

3. src/components/a11y/focus-ring.tsx
   - Wrapper que garante focus ring visível (outline)
   - Para componentes que removem outline por padrão
   - Compatível com navegação por teclado

4. src/components/a11y/announce.tsx
   - Componente que usa aria-live para anunciar mudanças dinâmicas
   - Props: message (string), politeness ("polite" | "assertive")
   - Útil para: toast de sucesso, erros de formulário, loading states

5. ADICIONAR ao layout principal:
   - SkipToContent antes do header
   - Garantir que <main> tenha id="main-content" e tabIndex={-1}
   - Verificar que o título da página muda ao navegar (para screen readers)

6. VERIFICAR landmarks semânticos:
   - <header role="banner">
   - <nav role="navigation" aria-label="...">
   - <main id="main-content">
   - <footer role="contentinfo">

7. ESCREVA testes para SkipToContent:
   - Link existe no DOM
   - Ao focar, torna-se visível
   - Ao clicar, move o foco para #main-content
```

---

## 26. animate-ui Components

**O que falta:** Componentes animados limitados. O biomob tem uma biblioteca `animate-ui` com primitivos, componentes e animações de texto.

**Referência:** `biomob-org-frontend/src/components/animate-ui/` com subpastas `components/`, `primitives/`, `text/`

---

**PROMPT:**

```
Adicione componentes animate-ui ao design system do template.

Contexto: o projeto já tem framer-motion e motion instalados. Vamos criar uma biblioteca interna
de componentes animados em src/components/animate-ui/.

Estrutura:
src/components/animate-ui/
├── primitives/
│   ├── animated-div.tsx        (div com variants de entrada: fade, slide, scale)
│   ├── animated-presence.tsx   (AnimatePresence wrapper com defaults sensatos)
│   └── stagger-container.tsx   (container que anima filhos em sequência)
├── components/
│   ├── animated-counter.tsx    (número animado que conta de 0 até N)
│   ├── animated-list.tsx       (lista com items entrando um por um)
│   ├── animated-tabs.tsx       (tabs com transição de conteúdo)
│   └── page-transition.tsx     (wrapper para transição entre páginas)
└── text/
    ├── typewriter.tsx           (efeito de digitação)
    ├── word-reveal.tsx          (palavras reveladas uma a uma)
    └── gradient-text.tsx        (texto com gradiente animado)

Regras de implementação:
- Respeitar prefers-reduced-motion: useReducedMotion() do framer-motion
- Quando reducedMotion=true: desabilitar animações (renderizar sem transition)
- Todos os componentes têm prop disabled?: boolean para desativar
- Durations: entrada 0.3s, saída 0.2s (sensato para UI)
- Usar CSS variables para durations (theming possível)
- Exportar tudo de src/components/animate-ui/index.ts

Para cada componente:
1. Criar o componente com TypeScript types completos
2. Exportar variants pré-definidos (gentle, snappy, bouncy)
3. Escrever exemplo de uso no arquivo

Adicionar ao registry.json do shadcn se aplicável.
```

---

## 27. auth-utils.ts e Safe Auth Helpers

**O que falta:** Lógica de autenticação duplicada/espalhada. Sem helpers tipados para verificação de sessão server-side.

**Referência:** `biomob-org-frontend/src/lib/auth-utils.ts`, `src/lib/auth.ts` (4.3KB)

---

**PROMPT:**

```
Crie utilitários de autenticação consolidados para uso server-side e client-side.

1. EXPANDA src/lib/auth.ts:

   Server-side helpers:
   - getSession(): Promise<Session | null> — wrapper tipado para getServerSession
   - requireSession(): Promise<Session> — lança erro se não autenticado (use em Server Components protegidos)
   - requireRole(role: UserRole): Promise<Session> — lança erro se role insuficiente

   Exemplo de uso em Server Component:
   const session = await requireSession() // redireciona para login se não autenticado
   const adminSession = await requireRole("admin") // 403 se não for admin

2. CRIE src/lib/auth-utils.ts:

   - hasRequiredRole(userRole: UserRole, requiredRoles: UserRole[]): boolean
   - isAdminRole(role: UserRole): boolean
   - buildCallbackUrl(locale: string, redirect: string): string
   - getClientIP(headers: Headers): string | null

   Exemplo de uso com next-safe-action (item 12):
   export const authActionClient = createSafeActionClient()
     .use(async ({ next }) => {
       const session = await requireSession()
       return next({ ctx: { user: session.user } })
     })

   export const adminActionClient = createSafeActionClient()
     .use(async ({ next }) => {
       const session = await requireRole("admin")
       return next({ ctx: { user: session.user } })
     })

3. ERROS tipados de autenticação:
   export class AuthError extends Error {
     constructor(public code: "UNAUTHENTICATED" | "UNAUTHORIZED" | "SESSION_EXPIRED") {
       super(code)
     }
   }

4. ATUALIZAR middleware.ts para usar as mesmas utils

5. ESCREVA testes unitários para todos os helpers:
   - hasRequiredRole: todos os cenários de roles
   - buildCallbackUrl: gera URL correta com locale
   - Mocking de getServerSession para requireSession
```

---

## 28. Variante vinext — Migração Next.js → Vite

**Contexto:** O usuário mencionou migrar o template para **vinext** (Vite + React, sem Next.js). Esta seção cobre o que precisará ser adaptado.

---

**PROMPT:**

```
Crie uma variante "vinext" deste template baseada em Vite + React (sem Next.js), mantendo todo o design system e infraestrutura.

Diferenças principais a adaptar:

1. BUNDLER: Webpack/Turbopack → Vite 6
   pnpm create vite vinext --template react-ts

   Instalar: vite, @vitejs/plugin-react, vite-tsconfig-paths

   vite.config.ts:
   - Plugin react() para Fast Refresh
   - Plugin tsconfigPaths() para aliases @/
   - Build: target es2020, minify: esbuild, sourcemap: true
   - Dev server: port 3000, open: true

2. ROTEAMENTO: App Router → React Router v7 (ou TanStack Router)
   pnpm add react-router-dom

   Estrutura de rotas:
   src/routes/
   ├── index.tsx     (router definition)
   ├── root.tsx      (root layout)
   └── pages/        (page components)

   Criar createBrowserRouter com:
   - Lazy loading de rotas: lazy(() => import("./pages/dashboard"))
   - Loader/Action pattern (similar a Server Components)
   - Protected route wrapper usando useAuth()

3. SERVER ACTIONS → API calls:
   Sem Server Actions no Vite. Substituir por:
   - React Query mutations chamando API REST diretamente
   - next-safe-action → TanStack Form + zod (client-only validation)
   - Server logic → Backend separado (Express/Fastify/Hono)

4. next-intl → react-i18next ou @lingui/react
   pnpm add react-i18next i18next i18next-browser-languagedetector

   Manter os mesmos locale files, apenas adaptar a API

5. Manter IGUAL (zero mudanças):
   - Todos os componentes UI (shadcn/Radix)
   - Hooks customizados
   - Zustand store
   - Design system (Tailwind + CSS vars)
   - ESLint, Prettier, Husky, Commitlint
   - Vitest (já funciona com Vite nativamente!)
   - Playwright (independente de framework)

6. PWA com Vite:
   pnpm add -D vite-plugin-pwa workbox-window
   Substituir Serwist por vite-plugin-pwa

7. Metadata/SEO:
   pnpm add react-helmet-async
   Substituir next/head por Helmet

8. Variáveis de ambiente:
   Sem @t3-oss/env-nextjs. Usar:
   pnpm add -D vite-env-only
   Ou criar env.ts manual com import.meta.env

Resultado: mesmo DX, mesmo design system, mas rodando em Vite puro.
Manter os dois templates sincronizados via script de sync para componentes compartilhados.
```

---

## Ordem de Implementação Recomendada

### Fase 1 — Fundação de Qualidade (1-2 dias)

1. Type-safe Environment Variables
2. ESLint Avançado
3. Husky + lint-staged + Commitlint
4. Secretlint
5. Next.js Config Avançado

### Fase 2 — Testes (2-3 dias)

6. Vitest — Unit Testing
7. Playwright — E2E Testing
8. Testes de Acessibilidade

### Fase 3 — Infraestrutura de Runtime (1-2 dias)

9. Pino — Structured Logging
10. Zustand Store
11. next-safe-action
12. Sanitização de HTML
13. Rate Limiting

### Fase 4 — CI/CD e Deploy (1 dia)

14. GitHub Actions CI/CD
15. Docker — Containerização
16. Bundle Analyzer
17. Vercel Analytics + Speed Insights

### Fase 5 — Arquitetura e Features (2-3 dias)

18. Middleware com RBAC
19. Audit Log
20. Feature Flags
21. auth-utils.ts
22. Arquitetura querys/
23. Arquitetura Services por Domínio
24. Hook: use-focus-trap
25. Componentes de Acessibilidade

### Fase 6 — Design e Expansão (1-2 dias)

26. animate-ui Components
27. Knip — Dead Code Detection

### Fase 7 — Variante Vite

28. vinext — Migração Next.js → Vite

---

> **Total estimado:** 10-15 dias de trabalho para um template de nível produção.
> Após todas as fases, este template estará à altura de qualquer boilerplate enterprise do mercado.
