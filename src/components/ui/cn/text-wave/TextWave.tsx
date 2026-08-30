"use client";
/**
 * TextWave — wave shimmer por caractere. Sem prop `as` (diferente de TextShine/
 * TextGradient): o container precisa ser um `motion.*` pra orquestrar o stagger,
 * e cobrir qualquer tag arbitrária via `motion[Tag]` dinâmico não vale a
 * complexidade — uso típico é `<motion.span>`/`<span>` dentro de qualquer heading.
 */
import { motion } from "motion/react";

import { staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

import type { TextWaveProps } from "./text-wave.types";

const NBSP = " ";

export function TextWave({ children, duration = 1.2, staggerDelay = 0.05, className, style }: TextWaveProps) {
  const chars = Array.from(children);

  return (
    <motion.span
      className={cn("inline-block", className)}
      style={style}
      aria-label={children}
      variants={staggerContainer(staggerDelay)}
      initial="initial"
      animate="animate"
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          variants={{
            initial: { opacity: 0.35 },
            animate: {
              opacity: [0.35, 1, 0.35],
              transition: { duration, repeat: Infinity, ease: "easeInOut" },
            },
          }}
        >
          {/* espaço vira NBSP: dentro de inline-block isolado o navegador pode colapsar
              um espaço comum — NBSP garante que a lacuna entre palavras não suma */}
          {char === " " ? NBSP : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
