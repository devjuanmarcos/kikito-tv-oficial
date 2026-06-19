"use client";

import type { Control, FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Tipos de input suportados pelo InputRender */
export type InputType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "url"
  | "number"
  | "date"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "switch"
  | "single-file"
  | "file";

export type InputOption = { label: string; value: string };

/** Props base comuns a todos os tipos */
export interface InputRenderBaseProps<T extends FieldValues> {
  id: FieldPath<T>;
  label: string;
  type: InputType;
  control: Control<T>;
  icon?: ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
}

/** Props específicas por tipo (opcionais na união) */
export interface InputRenderExtraProps {
  placeholder?: string;
  rows?: number;
  inputMask?: (value: string) => string;
  options?: InputOption[];
  defaultValue?: string | string[];
  checkboxLabel?: string;
  switchLabel?: string;
  form?: UseFormReturn<FieldValues>;
  previewImages?: string[];
  setPreviewImages?: React.Dispatch<React.SetStateAction<string[]>>;
  fileInputRefs?: React.MutableRefObject<(HTMLInputElement | null)[]>;
}

export type InputRenderProps<T extends FieldValues> = InputRenderBaseProps<T> & InputRenderExtraProps;

function InputRenderInner<T extends FieldValues>(props: InputRenderProps<T>) {
  const {
    id,
    label,
    type,
    control,
    icon,
    description,
    disabled,
    className,
    containerClassName,
    labelClassName,
    placeholder,
    rows = 3,
    options = [],
    checkboxLabel,
    switchLabel,
    inputMask,
  } = props;

  const name = id as FieldPath<T>;

  if (type === "textarea") {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("space-y-2", containerClassName)}>
            <FormLabel className={cn("flex items-center gap-2", labelClassName)}>
              {icon}
              {label}
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder={placeholder}
                rows={rows}
                value={field.value ?? ""}
                disabled={disabled}
                className={className}
                onChange={(e) => {
                  const v = e.target.value;
                  field.onChange(inputMask ? inputMask(v) : v);
                }}
              />
            </FormControl>
            {description && <p className="text-body-callout text-muted-foreground">{description}</p>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (type === "select") {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("space-y-2", containerClassName)}>
            <FormLabel className={cn("flex items-center gap-2", labelClassName)}>
              {icon}
              {label}
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={(field.value as string) ?? ""}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className={className}>
                  <SelectValue placeholder={placeholder ?? "Selecione..."} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {description && <p className="text-body-callout text-muted-foreground">{description}</p>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (type === "multiselect") {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("space-y-2", containerClassName)}>
            <FormLabel className={cn("flex items-center gap-2", labelClassName)}>
              {icon}
              {label}
            </FormLabel>
            <FormControl>
              <MultiSelect
                key={`${String(name)}-${JSON.stringify(field.value ?? [])}`}
                options={options}
                onValueChange={field.onChange}
                defaultValue={Array.isArray(field.value) ? field.value : []}
                placeholder={placeholder ?? "Selecione..."}
                disabled={disabled}
                className={className}
              />
            </FormControl>
            {description && <p className="text-body-callout text-muted-foreground">{description}</p>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (type === "checkbox") {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("flex flex-row items-start gap-3 space-y-0", containerClassName)}>
            <FormControl>
              <Checkbox
                checked={!!field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className={className}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className={cn("flex items-center gap-2 cursor-pointer", labelClassName)}>
                {icon}
                {checkboxLabel ?? label}
              </FormLabel>
              {description && (
                <p className="text-body-callout text-muted-foreground">{description}</p>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (type === "switch") {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("flex flex-row items-center justify-between space-y-0", containerClassName)}>
            <div className="space-y-0.5">
              <FormLabel className={cn("flex items-center gap-2", labelClassName)}>
                {icon}
                {label}
              </FormLabel>
              {description && (
                <p className="text-body-callout text-muted-foreground">{description}</p>
              )}
            </div>
            <FormControl>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className={className}
              />
            </FormControl>
            {switchLabel && (
              <span className="text-body-callout text-muted-foreground">{switchLabel}</span>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (type === "single-file" || type === "file") {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("space-y-2", containerClassName)}>
            <FormLabel className={cn("flex items-center gap-2", labelClassName)}>
              {icon}
              {label}
            </FormLabel>
            <FormControl>
              <input
                type="file"
                accept="image/*"
                multiple={type === "file"}
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files?.length) return;
                  if (type === "single-file") {
                    field.onChange(files[0] ?? null);
                  } else {
                    field.onChange(Array.from(files));
                  }
                }}
                className={cn(
                  "block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90",
                  className
                )}
                disabled={disabled}
              />
            </FormControl>
            {description && <p className="text-body-callout text-muted-foreground">{description}</p>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  const inputType =
    type === "tel"
      ? "tel"
      : type === "url"
        ? "url"
        : type === "number"
          ? "number"
          : type === "date"
            ? "date"
            : type;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", containerClassName)}>
          <FormLabel className={cn("flex items-center gap-2", labelClassName)}>
            {icon}
            {label}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={inputType}
              placeholder={placeholder}
              value={field.value ?? ""}
              disabled={disabled}
              className={className}
              onChange={(e) => {
                const v = type === "number" ? e.target.valueAsNumber : e.target.value;
                field.onChange(
                  inputMask && typeof v === "string" ? inputMask(v) : v
                );
              }}
            />
          </FormControl>
          {description && <p className="text-body-callout text-muted-foreground">{description}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/** Componente que renderiza um único input a partir de InputRenderProps */
export function InputRender<T extends FieldValues>(props: InputRenderProps<T>) {
  return <InputRenderInner {...props} />;
}
