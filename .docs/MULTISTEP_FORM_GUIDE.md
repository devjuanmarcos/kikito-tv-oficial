# Guia: Componente MultistepForm

Este documento descreve o uso do componente **MultistepForm**: formulários em múltiplas etapas com validação por step e um único submit no final, integrado a **InputRender** e ao padrão **TSAQ** (Server Actions, `useActionState`, FormData).

## Índice

- [Visão geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Estrutura de configuração](#estrutura-de-configuração)
- [Validação por step](#validação-por-step)
- [Integração com DrawerFormComponent e TSAQ](#integração-com-drawerformcomponent-e-tsaq)
- [Exemplo de uso](#exemplo-de-uso)
- [Features opcionais](#features-opcionais)

---

## Visão geral

O **MultistepForm** permite:

- Um único formulário com estado compartilhado entre todas as etapas.
- Validação **por step**: ao clicar em "Próximo", apenas os campos da etapa atual são validados.
- **Um único envio** no último step: validação com o schema completo e chamada da Server Action (ou `onSubmit`).
- Uso de **InputRender** para renderizar os campos de cada step (text, textarea, select, etc.).
- Compatibilidade com **DrawerFormComponent**: o Form passado ao Drawer pode ser um FormBox que internamente usa `MultistepForm`.

### Arquivos

| Arquivo | Descrição |
|--------|------------|
| `src/components/form/input-render.tsx` | Componente que renderiza um input a partir de `InputRenderProps` (FormField + Input/Textarea/Select/etc.). |
| `src/components/form/multistep-form-types.ts` | Tipos `MultistepFormConfig<T>` e `StepConfig<T>`. |
| `src/components/form/multistep-form.tsx` | Componente principal do formulário multistep. |
| `src/components/form/multistep-step-schema.ts` | Utilitário `pickStepSchema(schema, fields)` para validar apenas os campos do step. |
| `src/components/form/examples/onboarding-multistep-form.tsx` | Exemplo completo (onboarding em 3 steps) com Drawer e Server Action. |

---

## Arquitetura

- **Um único `useForm`** com `shouldUnregister: false`, para preservar valores entre steps.
- **Sem** `zodResolver(schemaCompleto)` no init: isso faria o step 1 falhar por campos ainda não preenchidos de outros steps.
- **Botão "Próximo"**: validação apenas dos campos do step atual (via `pickStepSchema` + `safeParse`); em caso de sucesso, avança para o próximo step.
- **Botão "Voltar"**: apenas decrementa o step (sem validação).
- **Botão "Enviar"** (último step): validação com o schema completo; em caso de sucesso, monta `FormData` (se houver `action`) e chama `config.onSubmit(data)`.

---

## Estrutura de configuração

A configuração é do tipo `MultistepFormConfig<T>`:

```typescript
import type { MultistepFormConfig, StepConfig } from "@/components/form/multistep-form-types";

type MultistepFormConfig<T> = {
  schema: z.ZodType<T>;       // Schema Zod completo (z.object({ ... }))
  steps: StepConfig<T>[];     // Lista de steps
  defaultValues: Partial<T>;  // Valores iniciais
  onSubmit: (data: T) => void | Promise<void>;  // Chamado após submit com dados validados
};

type StepConfig<T> = {
  id: string;
  title?: string;
  description?: string;
  fields: (keyof T)[];  // Nomes dos campos deste step (para validação)
  inputs:
    | InputRenderProps<T>[]
    | ((control: Control<T>, form: UseFormReturn<T>) => InputRenderProps<T>[]);
};
```

- **schema**: deve ser um `z.object({ ... })` com todos os campos do formulário.
- **steps[].fields**: lista de chaves do schema que pertencem a esse step; só esses campos são validados ao clicar em "Próximo".
- **steps[].inputs**: array de definições de input (para usar com **InputRender**) ou função que recebe `control` e `form` e retorna esse array.

---

## Validação por step

- No **"Próximo"**: usa-se `pickStepSchema(schema, step.fields)` para obter um schema que valida só os campos do step; em seguida `stepSchema.safeParse(form.getValues())`. Em caso de erro, os erros são mapeados com `form.setError`.
- No **"Enviar"** (último step): usa-se `schema.safeParse(form.getValues())` para validar tudo; em caso de sucesso, chama-se a Server Action (montando `FormData` a partir dos dados) e/ou `config.onSubmit(data)`.

Assim, não há conflito entre steps: a etapa 1 não exige campos da etapa 3.

---

## Integração com DrawerFormComponent e TSAQ

1. **Server Action**: mesma assinatura das demais actions (ex.: `(prevState, formData) => Promise<PostAndPutActionProps<T>>`).
2. **FormBox**: recebe `{ setOpen, row? }` e usa `useActionState(action, initialState)`.
3. **MultistepForm**: recebe `config`, `action={formAction}` e `onCancel={() => setOpen(false)}`.
4. No **submit final**, o MultistepForm valida com o schema completo, monta `FormData` (incluindo arquivos) e chama `action(formData)` em `startTransition`.
5. No **FormBox**, um `useEffect` observa o estado retornado pela action (`state.success` / `state.message`) para exibir toast e fechar o drawer (`setOpen(false)`), e opcionalmente invalidar queries.

Assinatura do Form compatível com o Drawer:

```typescript
({ setOpen, row? }: { setOpen: React.Dispatch<React.SetStateAction<boolean>>; row?: Item | null }) => JSX.Element
```

O MultistepForm não precisa de `row` para o exemplo de criação; para edição, você pode preencher `defaultValues` a partir de `row` antes de passar a config.

---

## Exemplo de uso

Exemplo completo em **onboarding** (3 steps: conta, perfil, tipo de conta):

```tsx
// 1) Schema e tipo
const onboardingSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  accountType: z.enum(["personal", "company"]),
  companyName: z.string().optional(),
});
type OnboardingData = z.infer<typeof onboardingSchema>;

// 2) Config com steps e inputs (InputRenderProps)
const config: MultistepFormConfig<OnboardingData> = {
  schema: onboardingSchema,
  defaultValues: { email: "", password: "", firstName: "", lastName: "", accountType: undefined, companyName: "" },
  steps: [
    { id: "account", title: "Conta", fields: ["email", "password"], inputs: (control) => accountInputs(control) },
    { id: "profile", title: "Perfil", fields: ["firstName", "lastName"], inputs: (control) => profileInputs(control) },
    { id: "company", title: "Tipo", fields: ["accountType", "companyName"], inputs: (control) => companyInputs(control) },
  ],
  onSubmit: () => {},
};

// 3) No FormBox (com useActionState e Drawer)
const [state, formAction] = useActionState(onboardingAction, initialState);

useEffect(() => {
  if (state.success) { toast.success(state.message); setOpen(false); }
  if (!state.success && state.message) toast.error(state.message);
}, [state, setOpen]);

return (
  <MultistepForm
    config={config}
    action={formAction}
    onCancel={() => setOpen(false)}
    submitLabel="Concluir cadastro"
    renderProgress={(current, total) => <p>Etapa {current} de {total}</p>}
  />
);
```

Uso no Drawer na página:

```tsx
<DrawerFormComponent
  open={drawerOpen}
  setOpen={setDrawerOpen}
  Form={OnboardingFormBox}
  title="Cadastro"
  subTitle="Preencha as etapas."
/>
```

O exemplo completo está em `src/components/form/examples/onboarding-multistep-form.tsx`.

---

## Features opcionais

| Feature | Descrição |
|--------|------------|
| **Indicador de progresso** | Use a prop `renderProgress={(current, total) => ...}` para exibir "Step 1 de 3" ou um stepper. |
| **Navegação** | Botões "Voltar" e "Próximo"; no último step, "Enviar". Textos customizáveis com `nextLabel`, `prevLabel`, `submitLabel`. |
| **Cancelar** | `onCancel` fecha o drawer ou limpa o estado. |
| **Scroll to error** | Possível estender com `trigger(..., { shouldFocus: true })` ou focar o primeiro campo com erro após `setError`. |
| **Steps condicionais** | Para steps que dependem de valores do form, `steps` pode ser uma função `(formValues) => StepConfig<T>[]` (requer pequena extensão no componente). |
| **Persistência (rascunho)** | Opcional: usar `localStorage` (ex.: Mantine `useLocalStorage`) para salvar `form.getValues()` entre steps ou sessões. |
| **Accessibilidade** | Use `aria-current="step"` no indicador e labels corretos nos inputs (InputRender já usa FormLabel/FormControl). |

---

## Referências

- [INPUT_RENDER_GUIDE.md](./INPUT_RENDER_GUIDE.md) – Tipos de input e `InputRenderProps`.
- [TSAQ_AND_FORMS_GUIDE.md](./TSAQ_AND_FORMS_GUIDE.md) – Padrão TSAQ, Actions e FormBox.
