"use client";
/**
 * TextEffect — Super component.
 * Single catalog entry that dispatches by `effect` to the dedicated animated-text
 * renderers (typewriter/morph/gradient/number). The renderers are unchanged —
 * TextEffect only routes props, so each effect keeps its exact behavior.
 * The individual components remain importable (backward-compat).
 */
import { AnimatedNumber } from "@/components/ui/cn/animated-number";
import { MorphingText } from "@/components/ui/cn/morphing-text";
import { TextGradient } from "@/components/ui/cn/text-gradient";
import { TextShine } from "@/components/ui/cn/text-shine";
import { TextWave } from "@/components/ui/cn/text-wave";
import { Typewriter } from "@/components/ui/cn/typewriter";

import type { TextEffectProps } from "./text-effect.types";

export function TextEffect(props: TextEffectProps) {
  switch (props.effect) {
    case "morph": {
      const { effect: _e, ...rest } = props;
      return <MorphingText {...rest} />;
    }
    case "gradient": {
      const { effect: _e, ...rest } = props;
      return <TextGradient {...rest} />;
    }
    case "number": {
      const { effect: _e, ...rest } = props;
      return <AnimatedNumber {...rest} />;
    }
    case "shine": {
      const { effect: _e, ...rest } = props;
      return <TextShine {...rest} />;
    }
    case "wave": {
      const { effect: _e, ...rest } = props;
      return <TextWave {...rest} />;
    }
    default: {
      const { effect: _e, ...rest } = props;
      return <Typewriter {...rest} />;
    }
  }
}
