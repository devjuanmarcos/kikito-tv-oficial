import { cn } from "@/lib/utils";

import type { SeparatorProps, SeparatorSpacing, SeparatorVariant } from "./separator.types";

const SPACING_H: Record<SeparatorSpacing, string> = {
  xs: "my-(--spacing-2xs)",
  sm: "my-(--spacing-sm)",
  md: "my-(--spacing-lg)",
  lg: "my-(--spacing-xl)",
  xl: "my-(--spacing-2xl)",
};
const SPACING_V: Record<SeparatorSpacing, string> = {
  xs: "mx-(--spacing-2xs)",
  sm: "mx-(--spacing-sm)",
  md: "mx-(--spacing-lg)",
  lg: "mx-(--spacing-xl)",
  xl: "mx-(--spacing-2xl)",
};
const BORDER_STYLE: Record<SeparatorVariant, string> = {
  solid: "border-rule",
  dashed: "border-rule border-dashed",
  dotted: "border-rule border-dotted",
};

export function Separator({
  orientation = "horizontal",
  variant = "solid",
  label,
  labelAlign = "center",
  spacing,
  decorative = true,
  className,
  style,
}: SeparatorProps) {
  const role = decorative ? "none" : "separator";

  if (orientation === "vertical") {
    return (
      <span
        role={role}
        aria-orientation="vertical"
        className={cn(
          "inline-block self-stretch border-l",
          BORDER_STYLE[variant],
          spacing && SPACING_V[spacing],
          className
        )}
        style={style}
      />
    );
  }

  if (label) {
    // alinhamento já é resolvido pelos dois spans flex-1 abaixo (o lado omitido empurra o
    // label pra ponta oposta) — não precisa de justify-content, os itens flex-1 absorvem
    // todo o espaço livre de qualquer forma
    return (
      <div
        role={role}
        className={cn("flex items-center gap-(--spacing-md)", spacing && SPACING_H[spacing], className)}
        style={style}
      >
        {labelAlign !== "start" && <span className={cn("flex-1 border-t", BORDER_STYLE[variant])} />}
        <span className="text-body-caption text-faint shrink-0 whitespace-nowrap">{label}</span>
        {labelAlign !== "end" && <span className={cn("flex-1 border-t", BORDER_STYLE[variant])} />}
      </div>
    );
  }

  return (
    <hr
      role={role}
      className={cn("border-t border-0", BORDER_STYLE[variant], spacing && SPACING_H[spacing], className)}
      style={style}
    />
  );
}
