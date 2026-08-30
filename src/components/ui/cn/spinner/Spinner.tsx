import { cn } from "@/lib/utils";

import type { SpinnerIntent, SpinnerProps, SpinnerSize, SpinnerVariant } from "./spinner.types";

// border-[2.5px] (lg): fora da escala de --border-width-* (só cobre 1/1.5/2/3/4px) —
// exceção rara demais pra token próprio, ver CLAUDE.md §Bordas.
const SIZE_CLS: Record<SpinnerSize, string> = {
  xs: "w-3 h-3 border-(length:--border-width-thin)",
  sm: "w-4 h-4 border-(length:--border-width-base)",
  md: "w-5 h-5 border-(length:--border-width-base)",
  lg: "w-7 h-7 border-[2.5px]",
  xl: "w-10 h-10 border-(length:--border-width-thick)",
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

// variant="orbital": mesmo wrapper de tamanho de SIZE_CLS, sem borda (dots via bg-current,
// não anel) — origem: spinner-07.tsx do shadcndashboard (núcleo pulsante + satélite orbitando).
const ORBITAL_WRAP_SIZE: Record<SpinnerSize, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
  xl: "w-10 h-10",
};

// bg-current em vez de border-*: dots sólidos precisam de cor de preenchimento, não de borda —
// mesmas 4 cores de INTENT_CLS, só como text-* pra bg-current herdar certo.
const ORBITAL_INTENT_CLS: Record<SpinnerIntent, string> = {
  primary: "text-patina",
  secondary: "text-kinpaku",
  neutral: "text-faint",
  current: "text-current",
};

function RingSpinner({ size, intent }: { size: SpinnerSize; intent: SpinnerIntent }) {
  return (
    <span
      className={cn("rounded-full animate-spin motion-reduce:animate-none", SIZE_CLS[size], INTENT_CLS[intent])}
      aria-hidden="true"
    />
  );
}

function OrbitalSpinner({ size, intent }: { size: SpinnerSize; intent: SpinnerIntent }) {
  return (
    <span
      className={cn("relative inline-block", ORBITAL_WRAP_SIZE[size], ORBITAL_INTENT_CLS[intent])}
      aria-hidden="true"
    >
      {/* núcleo — pulsa via animate-pulse nativo do Tailwind, sem keyframe custom */}
      <span
        className="absolute inset-0 m-auto rounded-full bg-current animate-pulse motion-reduce:animate-none"
        style={{ width: "42%", height: "42%" }}
      />
      {/* satélite — o CONTAINER gira (animate-spin), o dot fica fixo na borda superior dele,
          então o giro do pai é o que produz a órbita, não o dot se movendo sozinho */}
      <span className="absolute inset-0 animate-spin motion-reduce:animate-none" style={{ animationDuration: "1.4s" }}>
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-current"
          style={{ width: "24%", height: "24%" }}
        />
      </span>
    </span>
  );
}

export function Spinner({
  size = "md",
  intent = "primary",
  variant = "ring" as SpinnerVariant,
  label,
  className,
  style,
}: SpinnerProps) {
  return (
    <span
      className={cn("inline-flex flex-col items-center gap-(--spacing-sm)", className)}
      style={style}
      role="status"
      aria-label={label ?? "Loading"}
    >
      {variant === "orbital" ? (
        <OrbitalSpinner size={size} intent={intent} />
      ) : (
        <RingSpinner size={size} intent={intent} />
      )}
      {label && <span className="text-body-caption text-faint">{label}</span>}
    </span>
  );
}
