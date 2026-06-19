# Componentes, Tokens, Auth e HTTP

Este template usa tokens do Figma exportados para Tailwind e CSS variables. A fonte atual dos tokens é:

- `PIA _ shadcn.zip`: cores light/dark.
- `PIA _ Tipografia.zip`: escala de tamanhos e pesos.

## Tokens

Os tokens globais ficam em `src/app/[locale]/globals.css` e são expostos pelo `tailwind.config.ts`.

Intenções semânticas disponíveis:

- `primary`
- `secondary`
- `tertiary`
- `quaternary`
- `neutral`
- `success`
- `warning`
- `destructive`
- `info`

Cada intenção deve ter:

- cor base: `--primary`, `--success`, etc.
- foreground: `--primary-foreground`, `--success-foreground`, etc.
- hover: `--primary-hover`, `--success-hover`, etc.
- soft: `--primary-soft`, `--success-soft`, etc.
- soft foreground: `--primary-soft-foreground`, `--success-soft-foreground`, etc.

`terciary` existe só como alias legado. O nome correto para novos componentes é `tertiary`.

## Variantes de Componentes

`Button`, `Badge` e `Alert` seguem a mesma matriz:

```tsx
<Button intent="primary" appearance="solid" size="md" />
<Badge intent="success" appearance="outline" size="lg" />
<Alert intent="warning" appearance="dashed" size="sm" />
```

### `intent`

`primary | secondary | tertiary | quaternary | neutral | success | warning | destructive | info`

### `appearance`

`solid | soft | outline | ghost | link | dashed`

### `size`

`xs | sm | md | lg | xl`

`Button` ainda aceita variantes antigas como `variant="outlinePrimary"` para compatibilidade, mas o padrão novo deve preferir `intent` + `appearance`.

## Auth e Middleware

As rotas de autenticação são centralizadas em `src/lib/auth-utils.ts`.

- Login público: `/{locale}/auth`
- Acesso negado: `/{locale}/unauthorized`
- Dashboard admin protegido: `/{locale}/administrador/**`

O middleware executa nesta ordem:

1. ignora assets e `/api/auth`;
2. aplica locale padrão quando necessário;
3. redireciona sessão expirada para `/{locale}/auth`;
4. permite rotas públicas;
5. valida RBAC por role;
6. entrega para `next-intl`.

## Refresh Token

A fronteira server-only de cookies e refresh fica em `src/services/auth/session-tokens.ts`.

Responsabilidades:

- ler access token;
- persistir access/refresh token;
- limpar cookies;
- marcar sessão expirada;
- chamar refresh e salvar o novo par.

`src/services/axios.ts` não importa Server Actions. Ele usa `refreshAuthSession()` diretamente, compartilha uma única promise de refresh e tenta uma vez novamente em respostas `401`.

Endpoints públicos de auth devem usar:

```ts
{ ignoreBearerToken: true } as any
```

Isso evita que login, recuperação de senha e validação de primeiro acesso disparem refresh token antes da autenticação.

## Stack

Esta limpeza manteve Next 15 e React 18. Foram alinhados:

- `eslint-config-next` com Next 15;
- `@next/bundle-analyzer` com Next 15;
- `@types/react` e `@types/react-dom` com React 18.

Não migrar junto nesta fase:

- Next 16;
- React 19;
- next-intl 4;
- Tiptap 3;
- MSW 2;
- Vitest 4;
- ESLint 10.

Essas mudanças exigem migração própria porque alteram APIs, tipos ou tooling.
