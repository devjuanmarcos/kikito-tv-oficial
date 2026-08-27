"use client";

import { useState } from "react";

import { Button } from "@/components/ui/cn/button";
import { cn } from "@/lib/utils";

import type { NewsletterFormProps } from "./newsletter-form.types";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function NewsletterForm({
  title = "Stay in the loop",
  description = "Get the latest updates delivered directly to your inbox.",
  placeholder = "Enter your email address",
  ctaLabel = "Subscribe",
  onSubmit,
  variant = "card",
  className,
  style,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    await onSubmit?.(email);
    setLoading(false);
    setDone(true);
  }

  const isCard = variant === "card";
  const isInline = variant === "inline";

  if (done) {
    return (
      <div
        role="status"
        className={cn(
          "flex items-center gap-(--spacing-md) text-body-callout text-success font-medium",
          isCard && "p-(--spacing-xl) rounded-(--radius-lg) border border-rule bg-raised",
          className
        )}
        style={style}
      >
        <span aria-hidden="true" className="text-body-title">
          🎉
        </span>
        <span>You&apos;re subscribed! Check your inbox.</span>
      </div>
    );
  }

  const errorId = error ? "newsletter-form-error" : undefined;

  return (
    <div
      className={cn(
        isCard &&
          "rounded-(--radius-lg) border border-rule bg-raised p-(--spacing-xl) flex flex-col gap-(--spacing-md)",
        isInline && "flex flex-col gap-(--spacing-md)",
        variant === "minimal" && "flex flex-col gap-(--spacing-sm)",
        className
      )}
      style={style}
    >
      {isCard && (
        <div aria-hidden="true" className="text-heading-05">
          ✉️
        </div>
      )}
      {title && (
        <p className={cn("font-bold text-foreground", isCard ? "text-body-title" : "text-body-paragraph")}>{title}</p>
      )}
      {description && <p className="text-body-callout text-muted">{description}</p>}

      {/* noValidate: sem isso, a validação nativa do browser pro type="email" bloqueia o
          submit ANTES do handleSubmit rodar — a mensagem de erro estilizada do próprio
          componente (com role="alert" ligado por aria-describedby) nunca aparecia, só o
          balão de validação nativo do navegador (inconsistente com o tema, idioma do SO) */}
      <form onSubmit={handleSubmit} noValidate>
        <div className={cn("flex gap-(--spacing-sm)", isInline ? "flex-row" : "flex-col sm:flex-row")}>
          <input
            type="email"
            aria-label={placeholder}
            aria-invalid={!!error}
            aria-describedby={errorId}
            placeholder={placeholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="flex-1 px-(--spacing-md) py-(--spacing-sm) rounded-(--radius-sm) border border-rule bg-canvas text-foreground text-body-callout placeholder:text-faint outline-none focus:border-patina/60 transition-colors"
          />
          <Button type="submit" intent="primary" variant="solid" size="sm" loading={loading}>
            {ctaLabel}
          </Button>
        </div>
        {error && (
          <p id={errorId} role="alert" className="mt-(--spacing-sm) text-body-caption text-danger">
            {error}
          </p>
        )}
      </form>

      {isCard && <p className="text-body-caption text-faint">We respect your privacy. Unsubscribe at any time.</p>}
    </div>
  );
}
