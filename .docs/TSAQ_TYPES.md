# Guia TSAQ: Types

Este documento ensina onde e como definir as tipagens usadas no fluxo TSAQ (Types, Services, Actions, Queries) do projeto.

## Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Tipos por Endpoint](#tipos-por-endpoint)
- [Exemplo Completo](#exemplo-completo)
- [Uso nas Outras Camadas](#uso-nas-outras-camadas)

---

## Visão Geral

A camada **Types** centraliza as interfaces e tipos de request/response de um domínio (ex.: campanhas, usuários). Ela é a base para tipar Services, Actions e Queries.

### Benefícios

- Tipagem forte em toda a cadeia (service → action → query/form).
- Alinhamento com o contrato do backend (rotas, DTOs).
- Um único lugar para ajustar quando a API mudar.

---

## Estrutura de Pastas

Use uma pasta por domínio dentro de `src/@types/`, com nome no **plural** e consistente em todo o TSAQ:

```
src/@types/
  └── {dominio}/          # ex.: campaings, users
        └── index.ts       # exporta todos os tipos do domínio
```

Exemplo para o domínio **campaings**:

```
src/@types/
  └── campaings/
        └── index.ts
```

Você pode ter vários arquivos (ex.: `requests.ts`, `responses.ts`) e reexportar tudo pelo `index.ts`.

---

## Tipos por Endpoint

Para cada operação da API, defina tipos de request (quando houver) e response:

| Operação        | Request (params/body)     | Response                 |
|-----------------|---------------------------|--------------------------|
| Listar          | `ListCampaignsRequest`    | `ListCampaignsResponse`  |
| Buscar por ID   | — (id na URL)             | `GetCampaignByIdResponse`|
| Criar           | `CreateCampaignRequest`*  | `CreateCampaignResponse` |
| Atualizar       | `UpdateCampaignRequest`   | `UpdateCampaignResponse` |
| Deletar         | — (id na URL)             | `void` ou resposta mínima|

\* Criar/atualizar com arquivos costuma usar `FormData` no front; os tipos de request podem descrever os campos que você envia (para documentação) ou o shape do body quando for JSON.

Nomes sugeridos:

- **Listagem:** `List{Recurso}Request`, `List{Recurso}Response`.
- **Por ID:** `Get{Recurso}ByIdResponse`.
- **Criar:** `Create{Recurso}Request`, `Create{Recurso}Response`.
- **Atualizar:** `Update{Recurso}Request`, `Update{Recurso}Response`.

Alinhe os nomes e campos com o backend (DTOs, documentação da API).

---

## Exemplo Completo

Exemplo mínimo para o domínio **campaings** em `src/@types/campaings/index.ts`:

```typescript
// Listagem com paginação e filtros
export interface ListCampaignsRequest {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ListCampaignsResponse {
  items: CampaignItem[];
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface CampaignItem {
  id: string;
  title: string;
  subtitle?: string;
  status: string;
  totalTickets: number;
  itemPrice: number;
  drawDate: string;
  coverImage?: string;
  gallery?: string[];
  // ... outros campos retornados pela API
}

// Buscar por ID (mesmo shape ou mais completo que CampaignItem)
export type GetCampaignByIdResponse = CampaignItem; // ou interface com mais campos

// Atualizar (campos que podem ser enviados no PUT)
export interface UpdateCampaignRequest {
  title?: string;
  subtitle?: string;
  description?: string;
  totalTickets?: string;
  itemPrice?: string;
  maintenancePrice?: string;
  drawDate?: string;
  status?: string;
  // arquivos (coverImage, gallery) vão no FormData
}

export interface UpdateCampaignResponse {
  id: string;
  // ... campos retornados após update
}

// Criar (pode ter CreateCampaignRequest e CreateCampaignResponse)
export interface CreateCampaignResponse {
  id: string;
  // ...
}
```

Use um único arquivo `index.ts` ou organize em vários e reexporte:

```typescript
// src/@types/campaings/index.ts
export * from "./requests";
export * from "./responses";
```

---

## Uso nas Outras Camadas

- **Services:** importam os tipos para assinaturas de parâmetros e retorno (`AxiosResponse<GetCampaignByIdResponse>`).
- **Actions:** importam para tipar `PostAndPutActionProps<CreateCampaignResponse>` e `GetActionProps<ListCampaignsResponse>`.
- **Queries:** importam para tipar `useQuery<GetCampaignByIdResponse>` e hooks.
- **Formulários:** podem usar um schema Zod próprio; os tipos de formulário (ex.: `FormDataType`) costumam ser inferidos do schema. Os tipos de API servem para tipar a query by-id e a resposta da action.

Exemplo de import:

```typescript
import type {
  ListCampaignsRequest,
  ListCampaignsResponse,
  GetCampaignByIdResponse,
  UpdateCampaignRequest,
  UpdateCampaignResponse,
} from "@/@types/campaings";
```

---

## Próximos passos

- Implementar a camada **Services** que consome esses tipos: [TSAQ_SERVICES.md](./TSAQ_SERVICES.md).
