import type { AnimatedNumberProps } from "@/components/ui/cn/animated-number";
import type { MorphingTextProps } from "@/components/ui/cn/morphing-text";
import type { TextGradientProps } from "@/components/ui/cn/text-gradient";
import type { TypewriterProps } from "@/components/ui/cn/typewriter";

export type TextEffectType = "typewriter" | "morph" | "gradient" | "number";

export type TextEffectProps =
  | ({ effect?: "typewriter" } & TypewriterProps)
  | ({ effect: "morph" } & MorphingTextProps)
  | ({ effect: "gradient" } & TextGradientProps)
  | ({ effect: "number" } & AnimatedNumberProps);
