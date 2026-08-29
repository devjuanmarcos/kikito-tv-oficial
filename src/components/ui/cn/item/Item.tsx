import { Separator } from "@/components/ui/cn/separator";
import { cn } from "@/lib/utils";

import type {
  ItemGroupProps,
  ItemProps,
  ItemVariant,
  ItemSize,
  ItemMediaProps,
  ItemMediaVariant,
  ItemContentProps,
  ItemTitleProps,
  ItemDescriptionProps,
  ItemActionsProps,
  ItemHeaderProps,
  ItemFooterProps,
  ItemSeparatorProps,
} from "./item.types";

/**
 * Item — primitivo genérico de linha/card de lista (absorvido de
 * `shadcn-dashboard-library/ui/item.tsx`). Sem primo direto na Kikito CN antes
 * disso — o mais próximo é montar a mesma coisa à mão dentro de cada
 * componente de lista (notificação, configuração, resultado de busca).
 * `Item` + subcomponentes viram a base compartilhada pra esses casos.
 *
 * A origem usa `@base-ui/react` (`useRender`/`mergeProps`) pra polimorfismo
 * (`render` prop, tipo `asChild`) — não portado: nenhum outro componente da
 * Kikito CN tem esse padrão (todos são `<div>`/`<button>` fixos com props
 * nativas), então introduzir só aqui quebraria a consistência da biblioteca.
 * Se `Item` precisar renderizar como link, envolva um `<a>` dentro (o hover
 * de link já é estilizado — ver `[&_a]:hover`).
 */

const VARIANT_CLS: Record<ItemVariant, string> = {
  default: "border-transparent bg-transparent",
  outline: "border-rule bg-transparent",
  muted: "border-transparent bg-graphite",
};

const SIZE_CLS: Record<ItemSize, string> = {
  default: "gap-(--spacing-md) px-(--spacing-md) py-(--spacing-md)",
  sm: "gap-(--spacing-md) px-(--spacing-md) py-(--spacing-md)",
  xs: "gap-(--spacing-sm) px-(--spacing-sm) py-(--spacing-2xs)",
};

export function ItemGroup({ className, style, children, ...props }: ItemGroupProps) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        "group/item-group flex w-full flex-col gap-(--spacing-lg)",
        "has-[[data-size=sm]]:gap-(--spacing-sm) has-[[data-size=xs]]:gap-(--spacing-2xs)",
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export function ItemSeparator({ className, style }: ItemSeparatorProps) {
  return <Separator spacing="sm" className={className} style={style} />;
}

export function Item({ variant = "default", size = "default", className, style, children, ...props }: ItemProps) {
  return (
    <div
      role="listitem"
      data-slot="item"
      data-size={size}
      className={cn(
        "group/item flex w-full flex-wrap items-center rounded-(--radius-md) border text-body-callout",
        "transition-colors duration-[100ms] outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina",
        "[&_a]:transition-colors [&_a:hover]:bg-graphite [&_a:hover]:text-foreground",
        VARIANT_CLS[variant],
        SIZE_CLS[size],
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

const MEDIA_VARIANT_CLS: Record<ItemMediaVariant, string> = {
  default: "bg-transparent",
  icon: "[&>svg]:w-4 [&>svg]:h-4 text-faint",
  image:
    "w-10 h-10 overflow-hidden rounded-(--radius-xs) group-data-[size=sm]/item:w-8 group-data-[size=sm]/item:h-8 group-data-[size=xs]/item:w-6 group-data-[size=xs]/item:h-6 [&>img]:w-full [&>img]:h-full [&>img]:object-cover",
};

export function ItemMedia({ variant = "default", className, style, children, ...props }: ItemMediaProps) {
  return (
    <div
      data-slot="item-media"
      className={cn(
        "flex shrink-0 items-center justify-center gap-(--spacing-sm)",
        "group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start",
        "[&>svg]:pointer-events-none",
        MEDIA_VARIANT_CLS[variant],
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export function ItemContent({ className, style, children, ...props }: ItemContentProps) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-(--spacing-3xs) group-data-[size=xs]/item:gap-0",
        "[&+[data-slot=item-content]]:flex-none",
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export function ItemTitle({ className, style, children, ...props }: ItemTitleProps) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "flex w-fit items-center gap-(--spacing-2xs) text-body-callout font-medium leading-snug text-foreground truncate",
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export function ItemDescription({ className, style, children, ...props }: ItemDescriptionProps) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-left text-body-callout text-muted group-data-[size=xs]/item:text-body-caption",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-patina",
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </p>
  );
}

export function ItemActions({ className, style, children, ...props }: ItemActionsProps) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-(--spacing-sm)", className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export function ItemHeader({ className, style, children, ...props }: ItemHeaderProps) {
  return (
    <div
      data-slot="item-header"
      className={cn("flex basis-full items-center justify-between gap-(--spacing-sm)", className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export function ItemFooter({ className, style, children, ...props }: ItemFooterProps) {
  return (
    <div
      data-slot="item-footer"
      className={cn("flex basis-full items-center justify-between gap-(--spacing-sm)", className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
