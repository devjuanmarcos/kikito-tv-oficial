import { cn } from "@/lib/utils";

import type { SpinnerIntent, SpinnerProps, SpinnerSize } from "./spinner.types";

const SIZE_CLS: Record<SpinnerSize, string> = {
  xs: "w-3 h-3 border-[1.5px]",
  sm: "w-4 h-4 border-2",
  md: "w-5 h-5 border-2",
  lg: "w-7 h-7 border-[2.5px]",
  xl: "w-10 h-10 border-[3px]",
};

// opacidade no border: sem token dedicado pra "trilho" (trough) de um anel giratório —
// border-*-soft não existe (os pares soft são bg/text, não border), então a trilha
// esmaecida por trás do arco ativo precisa ser mesmo opacidade ad-hoc
const INTENT_CLS: Record<SpinnerIntent, string> = {
  primary: "border-patina/25 border-t-patina",
  secondary: "border-kinpaku/25 border-t-kinpaku",
  neutral: "border-faint/20 border-t-faint",
  current: "border-current/20 border-t-current",
};

export function Spinner({ size = "md", intent = "primary", label, className, style }: SpinnerProps) {
  return (
    <span
      className={cn("inline-flex flex-col items-center gap-(--spacing-sm)", className)}
      style={style}
      role="status"
      aria-label={label ?? "Loading"}
    >
      <span className={cn("rounded-full animate-spin", SIZE_CLS[size], INTENT_CLS[intent])} aria-hidden="true" />
      {label && <span className="text-body-caption text-faint">{label}</span>}
    </span>
  );
}
