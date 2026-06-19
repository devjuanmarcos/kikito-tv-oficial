# Guia TSAQ: Queries

Este documento ensina como implementar os hooks **Queries** (React Query) que chamam as actions de GET e expõem dados, loading e invalidação para a UI e para formulários de edição.

## Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Query Key](#query-key)
- [Hook by-id](#hook-by-id)
- [Hook listagem (all)](#hook-listagem-all)
- [Retorno dos Hooks](#retorno-dos-hooks)
- [Uso no Formulário de Edição](#uso-no-formulário-de-edição)
- [Re-export (index)](#re-export-index)
- [Próximos passos](#próximos-passos)

---

## Visão Geral

A camada **Queries**:

- Usa `useQuery` e `useQueryClient` de `@tanstack/react-query`.
- Chama as **Actions** de GET (não os Services diretamente), lê `result.responseData` e trata erro (toast, valor default).
- Expõe `data`, `isLoading`, `error`, `refetch`, `invalidateQuery` e, quando fizer sentido, `pagination`, `setPagination`, `searchTerm`, `setSearchTerm`.

Os arquivos devem ter `"use client"` no topo, pois são hooks usados em componentes client.

---

## Estrutura de Pastas

Use uma pasta por domínio em `src/querys/` (mesmo nome usado em Types, Services e Actions):

```
src/querys/
  └── {dominio}/           # ex.: campaings, users
        ├── all.ts         # listagem
        ├── by-id.ts       # busca por ID
        ├── index.ts       # re-export dos hooks
        └── ...            # outros (my-orders, orders-admin, etc.)
```

Se a pasta `src/querys` ainda não existir no projeto, crie-a e adicione os arquivos conforme este guia.

---

## Query Key

Use uma chave estável por recurso para permitir invalidação e cache:

```typescript
const CAMPAINGS_ALL = ["campaings", "all"];
const CAMPAING_BY_ID = ["campaings", "byId"];
```

Inclua no array os parâmetros que alteram o resultado (ex.: id, pagination, searchTerm):

```typescript
queryKey: [...CAMPAING_BY_ID, campaignId, contextInvalidateKey]
queryKey: [...CAMPAINGS_ALL, pagination, searchTerm, contextInvalidateKey]
```

---

## Hook by-id

Usado para preencher formulário de edição e telas de detalhe.

```typescript
"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { GetCampaignByIdResponse } from "@/@types/campaings";
import { getCampaignByIdAction } from "@/app/actions/campaings/gets";

const CAMPAING_BY_ID = ["campaings", "byId"];

export function useCampaingByIdQuery(campaignId: string, activatedCache = false) {
  const queryClient = useQueryClient();
  const [contextInvalidateKey, setContextInvalidateKey] = React.useState(0);

  const invalidateContext = React.useCallback(() => {
    setContextInvalidateKey((k) => k + 1);
  }, []);

  const {
    data,
    isLoading = true,
    error,
    refetch,
  } = useQuery<GetCampaignByIdResponse>({
    queryKey: [...CAMPAING_BY_ID, campaignId, contextInvalidateKey],
    queryFn: async () => {
      const emptyResponse = {} as GetCampaignByIdResponse;
      try {
        const result = await getCampaignByIdAction(campaignId);
        if (result.responseData) {
          return result.responseData as GetCampaignByIdResponse;
        }
        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar campanha");
        return emptyResponse;
      }
    },
    enabled: !!campaignId,
    staleTime: activatedCache ? 1000 * 60 * 3 : 0,
    gcTime: activatedCache ? 1000 * 60 * 3 : 0,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: CAMPAING_BY_ID });
  }, [queryClient]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidateQuery,
    invalidateContext,
  };
}
```

- **enabled: !!campaignId** — só dispara a query quando existir id (evita chamada com string vazia).
- **queryFn** — chama a action, usa `responseData` em caso de sucesso; em erro mostra toast e retorna objeto vazio para não quebrar a UI.

---

## Hook listagem (all)

Usado em tabelas e listagens com paginação e busca.

```typescript
"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ListCampaignsRequest, ListCampaignsResponse } from "@/@types/campaings";
import { listCampaingsAction } from "@/app/actions/campaings/gets";

const CAMPAINGS_ALL = ["campaings", "all"];

export function useAllCampaingsQuery(activatedCache = false) {
  const queryClient = useQueryClient();
  const [contextInvalidateKey, setContextInvalidateKey] = React.useState(0);
  const [pagination, setPagination] = React.useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = React.useState("");

  const invalidateContext = React.useCallback(() => {
    setContextInvalidateKey((k) => k + 1);
  }, []);

  const {
    data,
    isLoading = true,
    error,
    refetch,
  } = useQuery<ListCampaignsResponse>({
    queryKey: [...CAMPAINGS_ALL, pagination, searchTerm, contextInvalidateKey],
    queryFn: async () => {
      const emptyResponse: ListCampaignsResponse = {
        items: [],
        page: 1,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 0,
      };

      try {
        const params: ListCampaignsRequest = {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
          search: searchTerm,
        };

        const result = await listCampaingsAction(params ?? {});

        if (result.responseData) {
          setPagination((prev) => ({
            ...prev,
            totalItems: result.responseData?.totalItems ?? 0,
            pageIndex: result.responseData?.page ?? 1,
            pageSize: result.responseData?.itemsPerPage ?? 10,
          }));
          return result.responseData as ListCampaignsResponse;
        }
        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar lista de campanhas");
        return emptyResponse;
      }
    },
    enabled: true,
    staleTime: activatedCache ? 1000 * 60 * 3 : 0,
    gcTime: activatedCache ? 1000 * 60 * 3 : 0,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: CAMPAINGS_ALL });
  }, [queryClient]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidateQuery,
    invalidateContext,
    pagination,
    setPagination,
    searchTerm,
    setSearchTerm,
  };
}
```

---

## Retorno dos Hooks

Padrão mínimo:

- `data` — dados retornados pela action (`responseData`).
- `isLoading` — loading da query.
- `error` — erro do React Query.
- `refetch` — refetch manual.
- `invalidateQuery` — invalida o cache daquele recurso (útil após create/update/delete).

Opcional, para listagem:

- `pagination`, `setPagination`, `searchTerm`, `setSearchTerm`, `invalidateContext`.

---

## Uso no Formulário de Edição

No FormBox de edição:

1. Obter o id do item a editar (ex.: `itemToUpdate?.id` vindo de contexto ou props).
2. Chamar `useCampaingByIdQuery(itemToUpdate?.id ?? "")`.
3. Em um `useEffect`, quando `data` (ex.: `campaignData`) estiver disponível, mapear para o shape do formulário e chamar `form.reset(dataToSet)`.
4. Após sucesso do submit (action de update), chamar `invalidateQuery()` da listagem e `invalidateQuery()` (ou `invalidateContext`) da query by-id, para atualizar a UI e o próprio form se necessário.

Exemplo conceitual:

```typescript
const { itemToUpdate } = useColumns(); // ou props
const { data: campaignData, isLoading: isCampaignLoading, invalidateQuery: invalidateCampaignQuery } =
  useCampaingByIdQuery(itemToUpdate?.id ?? "");

React.useEffect(() => {
  if (!campaignData) return;
  const dataToSet = { ...campaignData, itemPrice: priceMask(campaignData.itemPrice), ... };
  form.reset(dataToSet);
}, [campaignData]);

// Após state.success da action de update:
invalidateQuery();           // lista
invalidateCampaignQuery();   // by-id
setOpen(false);
```

---

## Re-export (index)

Em `src/querys/campaings/index.ts`:

```typescript
export { useCampaingByIdQuery } from "./by-id";
export { useAllCampaingsQuery } from "./all";
```

Assim, a tela ou o form importam de `@/querys/campaings`.

---

## Próximos passos

- Montar o fluxo completo e os formulários com **DrawerFormComponent** e **InputRender**: [TSAQ_AND_FORMS_GUIDE.md](./TSAQ_AND_FORMS_GUIDE.md).
