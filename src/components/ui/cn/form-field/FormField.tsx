"use client";
import { cn } from "@/lib/utils";

import type { FormFieldProps } from "./form-field.types";

/**
 * `required`/`errorMessage` só afetam a aparência (asterisco no label, cor/ícone de erro) —
 * o `<input>` real passado como `children` não recebe `required`/`aria-invalid`
 * automaticamente (o componente não clona/injeta props no filho). O hint/erro ganha um
 * `id` estável derivado de `htmlFor` — para o leitor de tela anunciar o texto ao focar o
 * campo, o consumidor precisa passar `aria-describedby={`${htmlFor}-description`}` no
 * input real também.
 */
export function FormField({
  children,
  label,
  hint,
  errorMessage,
  required,
  htmlFor,
  className,
  style,
}: FormFieldProps) {
  const hasError = !!errorMessage;
  const descriptionId = htmlFor ? `${htmlFor}-description` : undefined;

  return (
    <div style={style} className={cn("flex flex-col gap-(--spacing-2xs)", className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-body-callout font-medium text-foreground">
          {label}
          {required && (
            <span className="ml-(--spacing-3xs) text-danger" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
      )}
      {children}
      {hasError ? (
        <p
          id={descriptionId}
          role="alert"
          className="flex items-center gap-(--spacing-2xs) text-body-caption text-danger"
        >
          <span aria-hidden="true">⚠</span>
          {errorMessage}
        </p>
      ) : hint ? (
        <p id={descriptionId} className="text-body-caption text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
