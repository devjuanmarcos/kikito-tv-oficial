# Guia de Uso do InputRender

Este documento ensina como utilizar o componente `InputRender` para criar formulários dinâmicos no projeto.

## Índice

- [Visão Geral](#visão-geral)
- [Estrutura Básica](#estrutura-básica)
- [Criando o Schema Zod](#criando-o-schema-zod)
- [Criando os Inputs](#criando-os-inputs)
- [Tipos de Input Disponíveis](#tipos-de-input-disponíveis)
- [Propriedades Comuns](#propriedades-comuns)
- [Exemplos Práticos](#exemplos-práticos)
- [Máscaras de Input](#máscaras-de-input)

---

## Visão Geral

O `InputRender` é um componente genérico que renderiza diferentes tipos de inputs de formulário integrados com `react-hook-form` e `zod` para validação. Ele suporta diversos tipos de campos e possui tipagem TypeScript forte.

### Benefícios

- ✅ Tipagem forte com TypeScript
- ✅ Validação automática com Zod
- ✅ Integração nativa com React Hook Form
- ✅ Suporte a múltiplos tipos de input
- ✅ Máscaras de input customizáveis
- ✅ Estilos consistentes com Tailwind CSS

---

## Estrutura Básica

### 1. Imports Necessários

```typescript
import { z } from "zod";
import { Control, UseFormReturn } from "react-hook-form";
import { InputRenderProps } from "@/components/form/input-render";
import { IconeDoLucide } from "lucide-react";
```

### 2. Estrutura de Arquivos

Recomenda-se criar dois arquivos separados:

```
_components/
  ├── inputs.tsx        // Schema e inputs de texto/select/etc
  └── imagemInput.tsx   // Inputs de arquivo/imagem (opcional)
```

---

## Criando o Schema Zod

O schema Zod define as regras de validação para cada campo do formulário.

### Exemplo Básico

```typescript
import { z } from "zod";

export const schema = z.object({
  name: z
    .string({ required_error: "O nome é obrigatório" })
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(150, { message: "O nome não pode ter mais de 150 caracteres" }),

  email: z.string({ required_error: "O e-mail é obrigatório" }).email({ message: "Digite um e-mail válido" }),

  phone: z.string().optional(),

  age: z.number({ required_error: "A idade é obrigatória" }).min(18, { message: "Deve ser maior de 18 anos" }),

  isActive: z.boolean().optional(),

  category: z.enum(["A", "B", "C"], {
    required_error: "Selecione uma categoria",
  }),

  description: z
    .string()
    .min(10, { message: "A descrição deve ter pelo menos 10 caracteres" })
    .max(1000, { message: "A descrição não pode ter mais de 1000 caracteres" }),
});

// Exportar o tipo inferido do schema
export type FormDataType = z.infer<typeof schema>;
```

### Validações Comuns

#### String

```typescript
// Obrigatório
campo: z.string({ required_error: "Mensagem de erro" });

// Opcional
campo: z.string().optional();

// Com comprimento mínimo/máximo
campo: z.string().min(3).max(100);

// Email
email: z.string().email({ message: "Email inválido" });

// URL
website: z.string().url({ message: "URL inválida" }).optional().or(z.literal(""));

// Regex customizado
cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido");
```

#### Number

```typescript
// Número obrigatório
age: z.number({ required_error: "Idade obrigatória" });

// Com mínimo/máximo
price: z.number().min(0).max(9999);

// Positivo
quantity: z.number().positive();

// Inteiro
count: z.number().int();
```

#### Boolean

```typescript
// Checkbox/Switch
isActive: z.boolean().optional();
acceptTerms: z.boolean().refine((val) => val === true, {
  message: "Você deve aceitar os termos",
});
```

#### Enum/Select

```typescript
// Enum simples
status: z.enum(["ATIVO", "INATIVO", "PENDENTE"]);

// Com mensagem de erro
priority: z.enum(["BAIXA", "MEDIA", "ALTA"], {
  required_error: "Selecione uma prioridade",
});
```

#### Array/Multiselect

```typescript
// Array de strings
tags: z.array(z.string()).min(1, { message: "Selecione ao menos uma tag" });

// Array de objetos
items: z.array(
  z.object({
    name: z.string(),
    quantity: z.number(),
  })
).optional();
```

#### Arquivo/Imagem

```typescript
const imageSchema = z.object({
  image: z.string().max(5242880, "A imagem não pode exceder 5MB").optional(),
  file: z.any().optional(),
});

// Single file
logo: z.array(imageSchema).optional();

// Multiple files
gallery: z.array(imageSchema).max(10, { message: "Máximo 10 imagens" }).optional();
```

---

## Criando os Inputs

Crie uma função que retorna um array de objetos `InputRenderProps`:

### Estrutura Básica

```typescript
import { Control } from "react-hook-form";
import { InputRenderProps } from "@/components/form/input-render";
import { Mail, Phone, User } from "lucide-react";
import { FormDataType } from "./schema"; // seu schema

export const FormInputs = (
  control: Control<FormDataType>
): InputRenderProps<FormDataType>[] => {
  return [
    {
      id: "name",
      label: "Nome Completo",
      placeholder: "Digite seu nome",
      type: "text",
      icon: <User className="h-4 w-4" />,
      control: control,
      description: "Seu nome completo como consta nos documentos.",
    },
    // ... mais inputs
  ];
};
```

---

## Tipos de Input Disponíveis

### 1. Text Input

Tipos: `"text"`, `"email"`, `"password"`, `"tel"`, `"url"`, `"number"`, `"date"`

```typescript
{
  id: "email",
  label: "E-mail",
  placeholder: "seu@email.com",
  type: "email",
  icon: <Mail className="h-4 w-4" />,
  control: control,
  description: "Seu e-mail de contato.",
  disabled: false, // opcional
  className: "custom-class", // opcional
  containerClassName: "md:col-span-2", // opcional
}
```

### 2. Textarea

```typescript
{
  id: "description",
  label: "Descrição",
  placeholder: "Descreva aqui...",
  type: "textarea",
  control: control,
  rows: 5, // opcional, padrão é 3
  description: "Uma descrição detalhada.",
}
```

### 3. Select

```typescript
{
  id: "category",
  label: "Categoria",
  placeholder: "Selecione uma categoria",
  type: "select",
  control: control,
  options: [
    { label: "Categoria A", value: "A" },
    { label: "Categoria B", value: "B" },
    { label: "Categoria C", value: "C" },
  ],
  defaultValue: "A", // opcional
}
```

### 4. MultiSelect

```typescript
{
  id: "tags",
  label: "Tags",
  placeholder: "Selecione as tags",
  type: "multiselect",
  control: control,
  options: [
    { label: "React", value: "react" },
    { label: "TypeScript", value: "typescript" },
    { label: "Next.js", value: "nextjs" },
  ],
  defaultValue: ["react"], // opcional
}
```

### 5. Checkbox

```typescript
{
  id: "acceptTerms",
  label: "Termos de Uso",
  checkboxLabel: "Aceito os termos e condições",
  type: "checkbox",
  control: control,
  description: "Você deve aceitar para continuar.",
}
```

### 6. Switch

```typescript
{
  id: "isActive",
  label: "Status",
  switchLabel: "Ativo",
  type: "switch",
  control: control,
  description: "Ative ou desative esta opção.",
}
```

### 7. File/Image (Single)

```typescript
{
  id: "logo",
  label: "Logo da Empresa",
  type: "single-file",
  icon: <Image className="h-4 w-4" />,
  control: control,
  form: form, // UseFormReturn<FormDataType>
  description: "Envie o logo da empresa.",
}
```

### 8. File/Image (Multiple)

```typescript
{
  id: "gallery",
  label: "Galeria de Imagens",
  type: "file",
  icon: <Images className="h-4 w-4" />,
  control: control,
  form: form, // UseFormReturn<FormDataType>
  description: "Envie até 10 imagens.",
  previewImages: previewImages, // opcional
  setPreviewImages: setPreviewImages, // opcional
  fileInputRefs: fileInputRefs, // opcional
}
```

---

## Propriedades Comuns

Todas as propriedades disponíveis para todos os tipos de input:

| Propriedade          | Tipo         | Obrigatório | Descrição                                       |
| -------------------- | ------------ | ----------- | ----------------------------------------------- |
| `id`                 | `string`     | ✅          | ID único do campo (deve coincidir com o schema) |
| `label`              | `string`     | ✅          | Label exibido acima do input                    |
| `type`               | `InputType`  | ✅          | Tipo do input (ver tipos disponíveis)           |
| `control`            | `Control<T>` | ✅          | Control do react-hook-form                      |
| `icon`               | `ReactNode`  | ❌          | Ícone exibido ao lado do label                  |
| `description`        | `string`     | ❌          | Texto de ajuda abaixo do input                  |
| `disabled`           | `boolean`    | ❌          | Desabilita o input                              |
| `className`          | `string`     | ❌          | Classes CSS para o input                        |
| `containerClassName` | `string`     | ❌          | Classes CSS para o container                    |
| `labelClassName`     | `string`     | ❌          | Classes CSS para o label                        |

### Propriedades Específicas por Tipo

**Text/Textarea:**

- `placeholder` (string): Texto de placeholder
- `rows` (number): Número de linhas (apenas textarea)
- `inputMask` (function): Função de máscara

**Select/MultiSelect:**

- `options` (array): Array de `{ label, value }`
- `placeholder` (string): Texto quando nada está selecionado
- `defaultValue` (string | string[]): Valor inicial

**Checkbox:**

- `checkboxLabel` (string): Label ao lado do checkbox

**Switch:**

- `switchLabel` (string): Label ao lado do switch

**File:**

- `form` (UseFormReturn): Objeto form do react-hook-form
- `previewImages` (string[]): Array de URLs de preview
- `setPreviewImages` (Dispatch): Setter do estado de preview
- `fileInputRefs` (MutableRefObject): Refs dos inputs de arquivo

---

## Exemplos Práticos

### Exemplo 1: Formulário de Cadastro Simples

**Schema:**

```typescript
export const schema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  bio: z.string().min(10).max(500),
  isActive: z.boolean().optional(),
});

export type FormDataType = z.infer<typeof schema>;
```

**Inputs:**

```typescript
export const FormInputs = (control: Control<FormDataType>): InputRenderProps<FormDataType>[] => {
  return [
    {
      id: "name",
      label: "Nome",
      placeholder: "Seu nome completo",
      type: "text",
      icon: <User className="h-4 w-4" />,
      control: control,
    },
    {
      id: "email",
      label: "E-mail",
      placeholder: "seu@email.com",
      type: "email",
      icon: <Mail className="h-4 w-4" />,
      control: control,
    },
    {
      id: "phone",
      label: "Telefone",
      placeholder: "(00) 00000-0000",
      type: "tel",
      icon: <Phone className="h-4 w-4" />,
      control: control,
      inputMask: (value) => {
        const numbers = value.replace(/\D/g, "");
        let formatted = "";
        if (numbers.length >= 1) formatted = `(${numbers.slice(0, 2)}`;
        if (numbers.length >= 3) formatted += `) ${numbers.slice(2, 7)}`;
        if (numbers.length >= 8) formatted += `-${numbers.slice(7, 11)}`;
        return formatted || numbers;
      },
    },
    {
      id: "bio",
      label: "Biografia",
      placeholder: "Fale um pouco sobre você",
      type: "textarea",
      control: control,
      rows: 4,
    },
    {
      id: "isActive",
      label: "Status",
      switchLabel: "Perfil Ativo",
      type: "switch",
      control: control,
    },
  ];
};
```

### Exemplo 2: Formulário com Select e MultiSelect

**Schema:**

```typescript
export const schema = z.object({
  category: z.enum(["TECH", "DESIGN", "MARKETING"]),
  skills: z.array(z.string()).min(1, "Selecione ao menos uma skill"),
  experience: z.enum(["JUNIOR", "PLENO", "SENIOR"]),
});

export type FormDataType = z.infer<typeof schema>;
```

**Inputs:**

```typescript
export const FormInputs = (control: Control<FormDataType>): InputRenderProps<FormDataType>[] => {
  return [
    {
      id: "category",
      label: "Categoria",
      placeholder: "Selecione sua área",
      type: "select",
      control: control,
      options: [
        { label: "Tecnologia", value: "TECH" },
        { label: "Design", value: "DESIGN" },
        { label: "Marketing", value: "MARKETING" },
      ],
    },
    {
      id: "skills",
      label: "Habilidades",
      placeholder: "Selecione suas skills",
      type: "multiselect",
      control: control,
      options: [
        { label: "React", value: "react" },
        { label: "TypeScript", value: "typescript" },
        { label: "Node.js", value: "nodejs" },
        { label: "Python", value: "python" },
      ],
    },
    {
      id: "experience",
      label: "Nível de Experiência",
      type: "select",
      control: control,
      options: [
        { label: "Júnior", value: "JUNIOR" },
        { label: "Pleno", value: "PLENO" },
        { label: "Sênior", value: "SENIOR" },
      ],
    },
  ];
};
```

### Exemplo 3: Formulário com Upload de Arquivo

**Schema (inputs.tsx):**

```typescript
const imageSchema = z.object({
  image: z.string().max(5242880, "Imagem muito grande").optional(),
  file: z.any().optional(),
});

export const schema = z.object({
  companyName: z.string().min(3),
  logo: z.array(imageSchema).optional(),
});

export type FormDataType = z.infer<typeof schema>;
```

**Inputs de Texto (inputs.tsx):**

```typescript
export const FormInputs = (control: Control<FormDataType>): InputRenderProps<FormDataType>[] => {
  return [
    {
      id: "companyName",
      label: "Nome da Empresa",
      placeholder: "Empresa Ltda",
      type: "text",
      icon: <Building className="h-4 w-4" />,
      control: control,
    },
  ];
};
```

**Inputs de Imagem (imagemInput.tsx):**

```typescript
import { Control, UseFormReturn } from "react-hook-form";
import { InputRenderProps } from "@/components/form/input-render";
import { Image } from "lucide-react";
import { FormDataType } from "./inputs";

export const imagemInputs = (
  control: Control<FormDataType>,
  form: UseFormReturn<FormDataType>
): InputRenderProps<FormDataType>[] => {
  return [
    {
      id: "logo",
      label: "Logo da Empresa",
      type: "single-file",
      icon: <Image className="h-4 w-4" />,
      control: control,
      form: form,
      description: "Envie o logo da empresa (máx. 5MB)",
    },
  ];
};
```

**Uso no Componente:**

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputRender } from "@/components/form/input-render";
import { FormInputs } from "./_components/inputs";
import { imagemInputs } from "./_components/imagemInput";
import { schema, FormDataType } from "./_components/inputs";

export default function MyForm() {
  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      logo: [],
    },
  });

  const textInputs = FormInputs(form.control);
  const imageInputs = imagemInputs(form.control, form);

  const onSubmit = (data: FormDataType) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {textInputs.map((input) => (
        <InputRender key={input.id} {...input} />
      ))}

      {imageInputs.map((input) => (
        <InputRender key={input.id} {...input} />
      ))}

      <button type="submit">Enviar</button>
    </form>
  );
}
```

---

## Máscaras de Input

Use a propriedade `inputMask` para formatar valores automaticamente:

### Telefone

```typescript
inputMask: (value: string) => {
  const numbers = value.replace(/\D/g, "");
  let formatted = "";
  if (numbers.length >= 1) formatted = `(${numbers.slice(0, 2)}`;
  if (numbers.length >= 3) formatted += `) ${numbers.slice(2, 7)}`;
  if (numbers.length >= 8) formatted += `-${numbers.slice(7, 11)}`;
  return formatted || numbers;
};
```

### CEP

```typescript
inputMask: (value: string) => {
  const numbers = value.replace(/\D/g, "");
  let formatted = "";
  if (numbers.length >= 1) formatted = numbers.slice(0, 5);
  if (numbers.length >= 6) formatted += `-${numbers.slice(5, 8)}`;
  return formatted || numbers;
};
```

### CPF

```typescript
inputMask: (value: string) => {
  const numbers = value.replace(/\D/g, "");
  let formatted = "";
  if (numbers.length >= 1) formatted = numbers.slice(0, 3);
  if (numbers.length >= 4) formatted += `.${numbers.slice(3, 6)}`;
  if (numbers.length >= 7) formatted += `.${numbers.slice(6, 9)}`;
  if (numbers.length >= 10) formatted += `-${numbers.slice(9, 11)}`;
  return formatted || numbers;
};
```

### CNPJ

```typescript
inputMask: (value: string) => {
  const numbers = value.replace(/\D/g, "");
  let formatted = "";
  if (numbers.length >= 1) formatted = numbers.slice(0, 2);
  if (numbers.length >= 3) formatted += `.${numbers.slice(2, 5)}`;
  if (numbers.length >= 6) formatted += `.${numbers.slice(5, 8)}`;
  if (numbers.length >= 9) formatted += `/${numbers.slice(8, 12)}`;
  if (numbers.length >= 13) formatted += `-${numbers.slice(12, 14)}`;
  return formatted || numbers;
};
```

### Moeda (R$)

```typescript
inputMask: (value: string) => {
  const numbers = value.replace(/\D/g, "");
  const amount = parseFloat(numbers) / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};
```

---

## Dicas e Boas Práticas

### ✅ Fazer

- **Sempre** exporte o tipo inferido do schema: `export type FormDataType = z.infer<typeof schema>`
- Use `Control<FormDataType>` para garantir tipagem forte
- Organize inputs em arquivos separados quando há muitos campos
- Use `description` para ajudar o usuário a entender o campo
- Adicione ícones relevantes para melhor UX
- Use `containerClassName` para controlar layout (ex: `md:col-span-2`)

### ❌ Evitar

- Não use valores hardcoded nos defaults quando podem vir de props/API
- Não esqueça de validar com Zod no schema
- Não use `any` para o tipo genérico do Control
- Não crie campos sem `id` único

---

## Troubleshooting

### Erro de Tipagem no Control

**Problema:**

```
Type 'Control<FormDataType>' is not assignable to type 'Control<FieldValues>'
```

**Solução:**
Use o tipo genérico corretamente:

```typescript
export const FormInputs = (control: Control<FormDataType>): InputRenderProps<FormDataType>[] => {
  // ...
};
```

### Campo File/Image não Inicializa

**Problema:**
Campo de arquivo não aparece ou não funciona.

**Solução:**

- Certifique-se de passar o `form` (UseFormReturn) para inputs de arquivo
- Inicialize o valor no `defaultValues` do useForm:

```typescript
defaultValues: {
  logo: [],
}
```

### Máscara não Funciona

**Problema:**
A máscara não é aplicada ao digitar.

**Solução:**
Verifique se:

- A propriedade `inputMask` está no input correto (text, tel, etc.)
- A função retorna uma string
- Está removendo caracteres não numéricos quando necessário

---

## Checklist de Implementação

Ao criar um novo formulário com InputRender:

- [ ] Criar schema Zod com todas as validações
- [ ] Exportar o tipo inferido do schema
- [ ] Criar função que retorna array de InputRenderProps
- [ ] Adicionar tipagem genérica correta em Control
- [ ] Configurar useForm com zodResolver
- [ ] Mapear inputs com .map() no JSX
- [ ] Testar validações do formulário
- [ ] Testar máscaras de input (se houver)
- [ ] Verificar responsividade com containerClassName

---

## Recursos Adicionais

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Última atualização:** Janeiro 2026
