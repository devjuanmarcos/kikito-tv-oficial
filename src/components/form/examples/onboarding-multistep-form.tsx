"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { Mail, User, Building2 } from "lucide-react";
import { toast } from "sonner";
import { MultistepForm } from "@/components/form/multistep-form";
import type { MultistepFormConfig } from "@/components/form/multistep-form-types";
import type { InputRenderProps } from "@/components/form/input-render";
import { onboardingAction } from "@/app/actions/onboarding/onboarding-action";

/** Schema do onboarding em 3 steps */
export const onboardingSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  accountType: z.enum(["personal", "company"], {
    required_error: "Selecione o tipo de conta",
  }),
  companyName: z.string().optional(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

const initialState: PostAndPutActionProps<{ id: string }> = {
  success: false,
  message: "",
};

function accountInputs(control: InputRenderProps<OnboardingData>["control"]): InputRenderProps<OnboardingData>[] {
  return [
    {
      id: "email",
      label: "E-mail",
      type: "email",
      control,
      placeholder: "seu@email.com",
      icon: <Mail className="size-4" />,
    },
    {
      id: "password",
      label: "Senha",
      type: "password",
      control,
      placeholder: "Mínimo 6 caracteres",
    },
  ];
}

function profileInputs(control: InputRenderProps<OnboardingData>["control"]): InputRenderProps<OnboardingData>[] {
  return [
    {
      id: "firstName",
      label: "Nome",
      type: "text",
      control,
      placeholder: "Seu nome",
      icon: <User className="size-4" />,
    },
    {
      id: "lastName",
      label: "Sobrenome",
      type: "text",
      control,
      placeholder: "Seu sobrenome",
    },
  ];
}

function companyInputs(control: InputRenderProps<OnboardingData>["control"]): InputRenderProps<OnboardingData>[] {
  return [
    {
      id: "accountType",
      label: "Tipo de conta",
      type: "select",
      control,
      placeholder: "Selecione",
      options: [
        { label: "Pessoal", value: "personal" },
        { label: "Empresa", value: "company" },
      ],
      icon: <Building2 className="size-4" />,
    },
    {
      id: "companyName",
      label: "Nome da empresa",
      type: "text",
      control,
      placeholder: "Opcional",
    },
  ];
}

const defaultValues: Partial<OnboardingData> = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  accountType: undefined,
  companyName: "",
};

/** Configuração do MultistepForm de onboarding */
export const onboardingMultistepConfig: MultistepFormConfig<OnboardingData> = {
  schema: onboardingSchema,
  defaultValues,
  steps: [
    {
      id: "account",
      title: "Conta",
      description: "Crie seu acesso.",
      fields: ["email", "password"],
      inputs: (control) => accountInputs(control),
    },
    {
      id: "profile",
      title: "Perfil",
      description: "Como podemos te chamar?",
      fields: ["firstName", "lastName"],
      inputs: (control) => profileInputs(control),
    },
    {
      id: "company",
      title: "Tipo de conta",
      description: "Uso pessoal ou empresa?",
      fields: ["accountType", "companyName"],
      inputs: (control) => companyInputs(control),
    },
  ],
  onSubmit: () => {},
};

/** Props do FormBox compatível com DrawerFormComponent */
export interface OnboardingFormBoxProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row?: unknown;
}

/**
 * Exemplo de FormBox que usa MultistepForm + useActionState,
 * compatível com DrawerFormComponent (Form={OnboardingFormBox}).
 */
export function OnboardingFormBox({ setOpen }: OnboardingFormBoxProps) {
  const [state, formAction] = React.useActionState(onboardingAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
    }
    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, setOpen]);

  const config: MultistepFormConfig<OnboardingData> = {
    ...onboardingMultistepConfig,
    onSubmit: () => {
      // Opcional: side effects após submit (o envio já é feito via action no MultistepForm)
    },
  };

  return (
    <MultistepForm<OnboardingData>
      config={config}
      action={formAction}
      onCancel={() => setOpen(false)}
      submitLabel="Concluir cadastro"
      nextLabel="Próximo"
      prevLabel="Voltar"
      renderProgress={(current, total) => (
        <p className="text-body-callout text-muted-foreground">
          Etapa {current} de {total}
        </p>
      )}
    />
  );
}
