"use client";
import { Avatar } from "@/components/ui/cn/avatar";
import { cn } from "@/lib/utils";

import type { QuoteBlockProps, QuoteBlockVariant } from "./quote-block.types";

const VARIANT_WRAP: Record<QuoteBlockVariant, string> = {
  // p-5/pl-5: sem match exato na escala de spacing
  default: "border-(length:--border-width-hairline) border-rule rounded-(--radius-md) p-5",
  bordered: "border-l-(length:--border-width-thick) border-patina pl-5 py-(--spacing-sm)",
  filled: "bg-graphite rounded-(--radius-md) p-5",
  minimal: "py-(--spacing-sm)",
};

const QuoteIcon = () => (
  <svg viewBox="0 0 32 28" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-patina/40 shrink-0">
    <path d="M0 28V17.143Q0 12 2.571 7.429T10.286 0L12.571 2.857Q9.143 4.857 7.143 8.214T5.143 14.857H10.857V28H0ZM18.286 28V17.143Q18.286 12 20.857 7.429T28.571 0L30.857 2.857Q27.429 4.857 25.429 8.214T23.429 14.857H29.143V28H18.286Z" />
  </svg>
);

export function QuoteBlock({
  children,
  variant = "default",
  author,
  role,
  avatar,
  avatarFallback,
  className,
  style,
}: QuoteBlockProps) {
  const hasFooter = author || role;

  return (
    <figure style={style} className={cn("m-0", VARIANT_WRAP[variant], className)}>
      {variant !== "minimal" && (
        <div className="mb-(--spacing-md)">
          <QuoteIcon />
        </div>
      )}
      <blockquote className="m-0 text-body-callout text-foreground leading-[1.7] font-medium italic">
        {children}
      </blockquote>
      {hasFooter && (
        <figcaption className="flex items-center gap-2.5 mt-(--spacing-lg) not-italic">
          {(avatar || avatarFallback) && <Avatar src={avatar} name={avatarFallback ?? author} alt={author} size="sm" />}
          <div className="flex flex-col">
            {author && <span className="text-body-callout font-semibold text-foreground">{author}</span>}
            {role && <span className="text-body-caption text-faint">{role}</span>}
          </div>
        </figcaption>
      )}
    </figure>
  );
}
