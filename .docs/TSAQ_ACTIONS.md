# Guia TSAQ: Actions

Este documento ensina como implementar **Server Actions** que chamam os Services e retornam o formato padrão do projeto (`GetActionProps` / `PostAndPutActionProps`).

## Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Tipos de Retorno](#tipos-de-retorno)
- [Actions de GET](#actions-de-get)
- [Actions de POST/PUT (formulários)](#actions-de-postput-formulários)
- [Exemplo: GET com baseGetAction](#exemplo-get-com-basegetaction)
- [Exemplo: POST Create com FormData](#exemplo-post-create-com-formdata)
- [Exemplo: PUT Update com FormData](#exemplo-put-update-com-formdata)
- [Boas Práticas](#boas-práticas)
- [Próximos passos](#próximos-passos)

---

## Visão Geral

As **Actions**:

- Ficam em arquivos com `"use server"` no topo.
- Chamam os **Services** e tratam erros (ex.: `axiosErrorMessage`).
- Retornam sempre o mesmo formato: `GetActionProps<R>` para GETs e `PostAndPutActionProps<T>` para POST/PUT, definidos em `src/@types/kikito-action.d.ts`.

Assim, o client (Queries e formulários) pode tratar sucesso/erro de forma uniforme.

---

## Estrutura de Pastas

Use uma pasta por domínio em `src/app/actions/`, alinhada ao nome usado em Types e Services:

```
src/app/actions/
  └── {dominio}/              # ex.: campaings, users
        ├── gets.ts           # todas as actions de GET (list, by-id, etc.)
        ├── create-campaing.ts
        ├── edit-campaing.ts
        ├── delete-campaing.ts
        └── ...
```

---

## Tipos de Retorno

Definidos em [src/@types/kikito-action.d.ts](src/@types/kikito-action.d.ts):

**GetActionProps\<T\>** (para GETs):

- `success: boolean`
- `message: string`
- `responseData?: T`
- `issues?: ApiErrorDetail[]`

**PostAndPutActionProps\<T\>** (para POST/PUT usados em formulários):

- `success: boolean`
- `message: string`
- `responseData?: T`
- `fields?: Record<string, FormDataEntryValue>`
- `issues?: ApiErrorDetail[]`

---

## Actions de GET

Use o helper **baseGetAction** de [src/app/actions/baseGetAction.ts](src/app/actions/baseGetAction.ts). Ele recebe:

1. A função do **Service** que faz a chamada HTTP.
2. Mensagem de sucesso.
3. Mensagem de erro (usada no `axiosErrorMessage` em caso de falha).

Retorno: uma função que recebe os mesmos parâmetros do service e retorna `Promise<GetActionProps<R>>`.

### GET com parâmetros (listagem)

```typescript
"use server";

import { baseGetAction } from "@/app/actions/baseGetAction";
import type { ListCampaignsRequest, ListCampaignsResponse } from "@/@types/campaings";
import { listCampaignsService } from "@/services/campaings";

export const listCampaingsAction = baseGetAction<
  ListCampaignsRequest,
  ListCampaignsResponse
>(
  listCampaignsService,
  "Lista obtida com sucesso",
  "Erro ao buscar lista de campanhas"
);
```

### GET por ID

O service recebe um único `id: string`. O tipo genérico do `baseGetAction` fica `string` para o parâmetro:

```typescript
"use server";

import { baseGetAction } from "@/app/actions/baseGetAction";
import type { GetCampaignByIdResponse } from "@/@types/campaings";
import { getCampaignByIdService } from "@/services/campaings";

export const getCampaignByIdAction = baseGetAction<
  string,
  GetCampaignByIdResponse
>(
  (id) => getCampaignByIdService(id),
  "Campanha obtida com sucesso",
  "Erro ao buscar campanha"
);
```

Uso no client: `getCampaignByIdAction(campaignId)`.

---

## Actions de POST/PUT (formulários)

Não usam `baseGetAction`. Assinatura padrão para uso com `useActionState` em formulários:

```typescript
export async function nomeDaAction(
  prevState: PostAndPutActionProps<ResponseType>,
  data: FormData
): Promise<PostAndPutActionProps<ResponseType>>
```

Fluxo:

1. Extrair campos com `data.get("fieldName")` (e `data.getAll("fieldName")` para listas/arquivos).
2. Validar e converter (ex.: números, datas, preços formatados).
3. Montar o payload (novo `FormData` ou objeto) conforme o backend.
4. Chamar o **Service** (ex.: `createCampaignService`, `updateCampaignService`).
5. Em sucesso: retornar `{ message, success: true, responseData: response.data }`.
6. Em catch: usar `axiosErrorMessage(error, "Mensagem de erro")` e retornar `{ message: errorMessage, success: false }`.

---

## Exemplo: GET com baseGetAction

Arquivo `src/app/actions/campaings/gets.ts`:

```typescript
"use server";

import { baseGetAction } from "@/app/actions/baseGetAction";
import type {
  ListCampaignsRequest,
  ListCampaignsResponse,
  GetCampaignByIdResponse,
} from "@/@types/campaings";
import { listCampaignsService, getCampaignByIdService } from "@/services/campaings";

export const listCampaingsAction = baseGetAction<
  ListCampaignsRequest,
  ListCampaignsResponse
>(
  listCampaignsService,
  "Lista obtida com sucesso",
  "Erro ao buscar lista de campanhas"
);

export const getCampaignByIdAction = baseGetAction<
  string,
  GetCampaignByIdResponse
>(
  (id) => getCampaignByIdService(id),
  "Campanha obtida com sucesso",
  "Erro ao buscar campanha"
);
```

---

## Exemplo: POST Create com FormData

Arquivo `src/app/actions/campaings/create-campaing.ts`:

```typescript
"use server";

import type { CreateCampaignResponse } from "@/@types/campaings";
import { createCampaignService } from "@/services/campaings";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function postCreateCampaignAction(
  prevState: PostAndPutActionProps<CreateCampaignResponse>,
  data: FormData
): Promise<PostAndPutActionProps<CreateCampaignResponse>> {
  try {
    const title = data.get("title") as string;
    const totalTickets = data.get("totalTickets") as string;
    const itemPrice = data.get("itemPrice") as string;
    const coverImage = data.get("coverImage");
    const gallery = data.getAll("gallery");

    if (!coverImage) {
      throw new Error("É necessário enviar ao menos uma imagem.");
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", title);
    formDataToSend.append("totalTickets", totalTickets);
    formDataToSend.append("itemPrice", itemPrice);
    formDataToSend.append("coverImage", coverImage);
    gallery.forEach((file) => formDataToSend.append("gallery", file));

    const response = await createCampaignService(formDataToSend);
    return {
      message: "Campanha criada com sucesso!",
      success: true,
      responseData: response.data,
    };
  } catch (error: unknown) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao criar campanha");
    return { message: errorMessage, success: false };
  }
}
```

---

## Exemplo: PUT Update com FormData

Arquivo `src/app/actions/campaings/edit-campaing.ts`:

```typescript
"use server";

import type { UpdateCampaignResponse } from "@/@types/campaings";
import { updateCampaignService } from "@/services/campaings";
import { axiosErrorMessage } from "@/utils/errorMessage";
import { parseFormattedPrice } from "@/utils/input-masks"; // se existir no projeto

export async function updateCampaignAction(
  prevState: PostAndPutActionProps<UpdateCampaignResponse>,
  data: FormData
): Promise<PostAndPutActionProps<UpdateCampaignResponse>> {
  try {
    const id = data.get("id") as string;
    const title = data.get("title") as string;
    const itemPriceRaw = data.get("itemPrice") as string;
    const itemPrice = parseFormattedPrice(itemPriceRaw); // ex.: "R$ 1.234,56" -> "1234.56"

    const formDataToSend = new FormData();
    formDataToSend.append("title", title);
    formDataToSend.set("itemPrice", itemPrice);

    const coverImage = data.get("coverImage");
    if (coverImage instanceof File && coverImage.size > 0) {
      formDataToSend.append("coverImage", coverImage);
    }
    data.getAll("gallery").forEach((file) => formDataToSend.append("gallery", file));

    const response = await updateCampaignService(id, formDataToSend);
    return {
      message: "Campanha atualizada com sucesso!",
      success: true,
      responseData: response.data,
    };
  } catch (error: unknown) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao editar campanha");
    return { message: errorMessage, success: false };
  }
}
```

---

## Boas Práticas

1. **Sempre `"use server"`** no topo do arquivo.
2. **GETs:** Preferir `baseGetAction` para padronizar retorno e tratamento de erro.
3. **POST/PUT:** Retornar sempre `PostAndPutActionProps<T>`; em catch usar `axiosErrorMessage` e nunca deixar o erro “vazar” sem formato.
4. **FormData:** Extrair e validar campos no action; converter máscaras (ex.: preço) antes de enviar ao service.
5. **Não** colocar lógica de UI (toast, redirect) nas actions; o client (form ou query) decide o que fazer com `state.success` e `state.message`.

---

## Próximos passos

- Implementar os hooks **Queries** que chamam as actions de GET: [TSAQ_QUERIES.md](./TSAQ_QUERIES.md).
