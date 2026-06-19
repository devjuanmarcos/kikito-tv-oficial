import type { ElementType, ComponentPropsWithoutRef } from "react";

interface VisuallyHiddenProps<T extends ElementType = "span"> {
  as?: T;
}

type Props<T extends ElementType = "span"> = VisuallyHiddenProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof VisuallyHiddenProps<T>>;

/**
 * Texto visível apenas para leitores de tela.
 * Substitui className="sr-only" espalhado pelo código.
 *
 * @example
 * <button>
 *   <Icon />
 *   <VisuallyHidden>Fechar modal</VisuallyHidden>
 * </button>
 */
export function VisuallyHidden<T extends ElementType = "span">({ as, children, ...props }: Props<T>) {
  const Component = (as ?? "span") as ElementType;
  return (
    <Component className="sr-only" {...props}>
      {children}
    </Component>
  );
}
