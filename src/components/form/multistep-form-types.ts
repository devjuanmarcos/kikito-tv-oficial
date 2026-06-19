import type { Control, FieldValues, UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import type { InputRenderProps } from "./input-render";

/** Configuração de um step do formulário multistep */
export interface StepConfig<T extends FieldValues> {
  id: string;
  title?: string;
  description?: string;
  /** Nomes dos campos deste step (para validação ao avançar) */
  fields: (keyof T)[];
  /** Schema opcional para este step (ex.: com refine). Se não informado, usa pick do schema global */
  stepSchema?: z.ZodType<Partial<T>>;
  /** Lista de inputs ou função que recebe control e form e retorna inputs */
  inputs:
    | InputRenderProps<T>[]
    | ((control: Control<T>, form: UseFormReturn<T>) => InputRenderProps<T>[]);
}

/** Configuração completa do MultistepForm */
export interface MultistepFormConfig<T extends FieldValues> {
  /** Schema Zod do formulário completo */
  schema: z.ZodType<T>;
  /** Steps do formulário */
  steps: StepConfig<T>[];
  /** Valores iniciais */
  defaultValues: Partial<T>;
  /** Callback chamado ao submeter (recebe dados validados) */
  onSubmit: (data: T) => void | Promise<void>;
}
