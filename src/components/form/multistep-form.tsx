"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import type { FieldValues } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputRender } from "@/components/form/input-render";
import { pickStepSchema } from "@/components/form/multistep-step-schema";
import type { MultistepFormConfig } from "@/components/form/multistep-form-types";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { z } from "zod";

/** Converte dados do formulário em FormData (incluindo arquivos) */
function buildFormData<T extends FieldValues>(data: T): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      if (value.length && value[0] instanceof File) {
        value.forEach((file) => formData.append(key, file as File));
      } else {
        formData.append(key, JSON.stringify(value));
      }
    } else if (typeof value === "object" && value !== null && !(value instanceof Date)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  }
  return formData;
}

export interface MultistepFormProps<T extends FieldValues> {
  config: MultistepFormConfig<T>;
  /** Server Action para envio (opcional). Se fornecido, ao submeter montamos FormData e chamamos action(formData). */
  action?: (formData: FormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  nextLabel?: string;
  prevLabel?: string;
  renderProgress?: (current: number, total: number) => ReactNode;
  formId?: string;
}

export function MultistepForm<T extends FieldValues>({
  config,
  action,
  onCancel,
  submitLabel = "Enviar",
  nextLabel = "Próximo",
  prevLabel = "Voltar",
  renderProgress,
  formId,
}: MultistepFormProps<T>) {
  const { schema, steps, defaultValues, onSubmit } = config;
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();

  const form = useForm<T>({
    defaultValues: defaultValues as T,
    mode: "onTouched",
    shouldUnregister: false,
  });

  const totalSteps = steps.length;
  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const currentInputs =
    typeof step.inputs === "function"
      ? step.inputs(form.control, form as ReturnType<typeof useForm<T>>)
      : step.inputs;

  /** Para schemas com .refine() (ZodEffects), usa o schema interno na validação por step */
  const schemaForStep =
    schema instanceof z.ZodEffects && "_def" in schema && (schema._def as { schema?: z.ZodType }).schema
      ? (schema._def as { schema: z.ZodObject<z.ZodRawShape> }).schema
      : (schema as z.ZodObject<z.ZodRawShape>);

  const handleNext = async () => {
    const values = form.getValues();
    const stepSchema =
      "stepSchema" in step && step.stepSchema
        ? step.stepSchema
        : pickStepSchema(schemaForStep, step.fields as (keyof z.ZodRawShape)[]);
    const result = stepSchema.safeParse(values);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      for (const [field, messages] of Object.entries(errors)) {
        const msg = Array.isArray(messages) ? messages[0] : messages;
        if (msg) form.setError(field as keyof T, { type: "manual", message: msg });
      }
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmitFinal = () => {
    const values = form.getValues();
    const result = schema.safeParse(values);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      for (const [field, messages] of Object.entries(errors)) {
        const msg = Array.isArray(messages) ? messages[0] : messages;
        if (msg) form.setError(field as keyof T, { type: "manual", message: msg });
      }
      return;
    }
    const data = result.data as T;
    startTransition(() => {
      if (action) {
        const formData = buildFormData(data);
        action(formData);
      }
      void Promise.resolve(onSubmit(data)).catch(() => {});
    });
  };

  return (
    <Form {...form}>
      <form
        id={formId}
        className="flex flex-col gap-6 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          const submitter = (e.nativeEvent as SubmitEvent).submitter;
          const isExplicitSubmit =
            submitter?.getAttribute("type") === "submit" &&
            submitter?.getAttribute("data-multistep-submit") === "true";
          if (isLastStep && isExplicitSubmit) handleSubmitFinal();
        }}
      >
        {renderProgress?.(currentStep + 1, totalSteps)}

        {step.title && (
          <div>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            {step.description && (
              <p className="text-body-callout text-muted-foreground mt-1">{step.description}</p>
            )}
          </div>
        )}

        <div className={cn("flex flex-col gap-4")}>
          {currentInputs.map((input) => (
            <InputRender key={String(input.id)} {...input} />
          ))}
        </div>

        <div className="flex justify-between gap-2 pt-2">
          <div>
            {!isFirstStep ? (
              <Button type="button" variant="outline" onClick={handlePrev} disabled={isPending}>
                {prevLabel}
              </Button>
            ) : onCancel ? (
              <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
                Cancelar
              </Button>
            ) : null}
          </div>
          <div>
            {isLastStep ? (
              <Button type="submit" data-multistep-submit="true" disabled={isPending}>
                {submitLabel}
              </Button>
            ) : (
              <Button type="button" onClick={(e) => { e.preventDefault(); void handleNext(); }}>
                {nextLabel}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
