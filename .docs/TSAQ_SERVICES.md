# Guia TSAQ: Services

Este documento ensina como implementar a camada **Services**: funções que chamam a API HTTP (axios) e são usadas pelas Server Actions.

## Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Assinaturas e Tipos](#assinaturas-e-tipos)
- [GET com Params](#get-com-params)
- [GET por ID](#get-por-id)
- [POST com FormData](#post-com-formdata)
- [PUT com FormData ou JSON](#put-com-formdata-ou-json)
- [DELETE](#delete)
- [Boas Práticas](#boas-práticas)
- [Próximos passos](#próximos-passos)

---

## Visão Geral

A camada **Services**:

- Recebe parâmetros e body tipados (tipos definidos em `@/@types/{dominio}`).
- Retorna `Promise<AxiosResponse<ResponseType>>`.
- Usa a instância configurada do axios (ex.: `api` de `@/services/axios` ou equivalente).
- **Não** trata toast, estado de UI ou erros para o usuário; apenas chama a API e repassa a response (ou lança).

---

## Estrutura de Pastas

Use uma pasta por domínio em `src/services/`, com nome no **plural** e alinhado ao usado em Types e Actions:

```
src/services/
  └── {dominio}/           # ex.: campaings, users
        └── index.ts       # exporta todas as funções do domínio
```

Exemplo para **campaings**:

```
src/services/
  └── campaings/
        └── index.ts
```

Você pode dividir em vários arquivos (ex.: `gets.ts`, `mutations.ts`) e reexportar pelo `index.ts`.

---

## Assinaturas e Tipos

- Importe os tipos de request/response de `@/@types/{dominio}`.
- Use `AxiosResponse` do axios para o retorno.

Exemplo de imports:

```typescript
import { AxiosResponse } from "axios";
import api from "../axios"; // ou @/services/axios, conforme seu projeto
import type {
  ListCampaignsRequest,
  ListCampaignsResponse,
  GetCampaignByIdResponse,
  UpdateCampaignRequest,
  UpdateCampaignResponse,
  CreateCampaignResponse,
} from "@/@types/campaings";
```

---

## GET com Params

Listagem com paginação e filtros:

```typescript
export async function listCampaignsService(
  params?: ListCampaignsRequest
): Promise<AxiosResponse<ListCampaignsResponse>> {
  return await api.get("/campaigns", { params });
}
```

---

## GET por ID

Buscar um recurso por identificador:

```typescript
export async function getCampaignByIdService(
  id: string
): Promise<AxiosResponse<GetCampaignByIdResponse>> {
  return await api.get(`/campaigns/${id}`);
}
```

---

## POST com FormData

Criar recurso com envio de arquivos (ex.: imagens):

```typescript
export async function createCampaignService(
  data: FormData
): Promise<AxiosResponse<CreateCampaignResponse>> {
  return await api.post("/campaigns", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
```

Importante: para `FormData`, defina `Content-Type: multipart/form-data`. Não sete manualmente o boundary; o axios/browser faz isso.

---

## PUT com FormData ou JSON

Atualizar recurso. Se aceitar arquivos, o service pode receber `FormData` e setar o header; caso contrário, envie JSON.

```typescript
export async function updateCampaignService(
  id: string,
  data: UpdateCampaignRequest | FormData
): Promise<AxiosResponse<UpdateCampaignResponse>> {
  return await api.put(`/campaigns/${id}`, data, {
    headers:
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
  });
}
```

---

## DELETE

```typescript
export async function deleteCampaignService(
  id: string
): Promise<AxiosResponse<void>> {
  return await api.delete(`/campaigns/${id}`);
}
```

---

## Boas Práticas

1. **Só HTTP:** Services não devem usar `toast`, `router` ou estado React; apenas chamar a API.
2. **Tipagem:** Sempre tipar parâmetros e retorno com os tipos do `@types/{dominio}`.
3. **FormData:** Sempre que enviar `FormData`, use `headers: { "Content-Type": "multipart/form-data" }`.
4. **Base URL:** Use a instância do axios já configurada com `baseURL` e interceptors (auth, refresh token) do projeto.
5. **Erros:** Deixe o erro ser propagado; o tratamento (ex.: `axiosErrorMessage`, toast) fica nas Actions.

---

## Próximos passos

- Implementar as **Actions** que chamam esses services e retornam o formato padrão do projeto: [TSAQ_ACTIONS.md](./TSAQ_ACTIONS.md).
