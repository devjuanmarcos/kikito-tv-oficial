"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/cn/button";
import { Checkbox } from "@/components/ui/cn/checkbox/Checkbox";
import { Input } from "@/components/ui/cn/input/Input";
import { RadioGroup } from "@/components/ui/cn/radio/Radio";
import { Rating } from "@/components/ui/cn/rating/Rating";
import { Textarea } from "@/components/ui/cn/textarea/Textarea";
import { cn } from "@/lib/utils";

import type { SurveyFormProps, SurveyQuestion } from "./survey-form.types";

// Achado real: `required` só desenhava o asterisco no label — nenhum tipo de
// pergunta além de text/textarea (via atributo HTML nativo) de fato bloqueava
// o submit se ficasse sem resposta. "Obrigatório" mentia pra radio/checkbox/
// scale/rating. Define o que conta como "respondida" por tipo e valida no submit.
function isAnswered(q: SurveyQuestion, value: unknown): boolean {
  switch (q.type) {
    case "text":
    case "textarea":
    case "radio":
      return typeof value === "string" && value.trim().length > 0;
    case "checkbox":
      return Array.isArray(value) && value.length > 0;
    case "scale":
    case "rating":
      return typeof value === "number" && value > 0;
    default:
      return value !== undefined;
  }
}

export function SurveyForm({
  title,
  description,
  questions,
  onSubmit,
  submitLabel = "Enviar respostas",
  className,
  style,
}: SurveyFormProps) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const set = (id: string, val: unknown) => setAnswers((a) => ({ ...a, [id]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, boolean> = {};
    for (const q of questions) {
      if (q.required && !isAnswered(q, answers[q.id])) nextErrors[q.id] = true;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit?.(answers);
  };

  return (
    <form
      className={cn("bg-raised border border-rule rounded-(--radius-lg) p-8", className)}
      style={style}
      onSubmit={handleSubmit}
    >
      {/* mb-7/mt-7 (1.75rem): sem match exato na escala de spacing */}
      {(title || description) && (
        <div className="mb-7">
          {title && <div className="text-heading-05 font-bold text-foreground mb-(--spacing-xs)">{title}</div>}
          {description && <div className="text-body-callout text-muted leading-normal">{description}</div>}
        </div>
      )}

      <div className="flex flex-col gap-(--spacing-xl)">
        {questions.map((q) => (
          <div key={q.id} className="flex flex-col gap-(--spacing-sm)">
            <label className="text-body-callout font-semibold text-foreground">
              {q.label}
              {q.required && <span className="text-danger ml-(--spacing-3xs)">*</span>}
            </label>

            {q.type === "text" && (
              // required nativo do HTML removido: colidia com a validação customizada
              // abaixo (o browser bloqueia o submit ANTES do onSubmit disparar, então
              // a pergunta nunca chegava a aparecer como "erro" no fluxo unificado —
              // achado real, só apareceu ao testar o caminho de required de verdade)
              <Input
                fullWidth
                placeholder={q.placeholder}
                value={String(answers[q.id] ?? "")}
                onChange={(e) => set(q.id, e.target.value)}
              />
            )}

            {q.type === "textarea" && (
              <Textarea
                className="w-full"
                resize="vertical"
                placeholder={q.placeholder}
                value={String(answers[q.id] ?? "")}
                onChange={(e) => set(q.id, e.target.value)}
              />
            )}

            {q.type === "radio" && (
              <RadioGroup
                name={q.id}
                options={(q.options ?? []).map((opt) => ({ value: opt, label: opt }))}
                value={typeof answers[q.id] === "string" ? (answers[q.id] as string) : undefined}
                onChange={(v) => set(q.id, v)}
              />
            )}

            {q.type === "checkbox" && (
              <div className="flex flex-col gap-(--spacing-sm)">
                {(q.options ?? []).map((opt) => {
                  const checked = ((answers[q.id] as string[]) ?? []).includes(opt);
                  return (
                    <Checkbox
                      key={opt}
                      label={opt}
                      checked={checked}
                      onChange={() => {
                        const cur = (answers[q.id] as string[]) ?? [];
                        set(q.id, checked ? cur.filter((x) => x !== opt) : [...cur, opt]);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {q.type === "scale" && (
              // role="radiogroup"/"radio" + aria-checked: eram <button> soltos sem
              // nenhuma semântica de "escolha única" pro leitor de tela — cada botão
              // já era focável/clicável nativamente (teclado sempre funcionou aqui,
              // só faltava o estado ser anunciado)
              <div role="radiogroup" aria-label={q.label} className="flex gap-(--spacing-xs) flex-wrap">
                {Array.from({ length: (q.max ?? 10) - (q.min ?? 1) + 1 }, (_, i) => (q.min ?? 1) + i).map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={answers[q.id] === n}
                    className={cn(
                      "w-10 h-10 border border-rule rounded-(--radius-sm) bg-raised text-foreground text-body-callout cursor-pointer transition-all duration-[120ms] hover:border-patina",
                      answers[q.id] === n && "bg-patina border-patina text-patina-fg"
                    )}
                    onClick={() => set(q.id, n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}

            {q.type === "rating" && (
              // Estrelas customizadas (<button> soltos sem aria-label, "★"/"☆" cru pro
              // leitor de tela) reinventavam o Rating CN, que já resolve isso — trocado
              <Rating value={(answers[q.id] as number) ?? 0} onChange={(v) => set(q.id, v)} max={q.max ?? 5} />
            )}

            {q.required && errors[q.id] && <p className="text-body-caption text-danger">This question is required.</p>}
          </div>
        ))}
      </div>

      <div className="mt-7">
        <Button type="submit" intent="primary" variant="solid">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
