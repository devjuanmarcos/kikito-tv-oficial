"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import ShinyText from "@/components/ui/shiny-text";

/* Frases de impacto da tela de apresentação */
const PHRASES = ["Bem-vindo ao KikitoTV", "Onde ideias ganham vida"];

const PHRASE_MS = 2200;

export default function Loading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % PHRASES.length), PHRASE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[var(--ks-lacquer,#0b0b0c)] px-6 text-center"
      role="status"
      aria-live="polite"
      aria-label="Carregando"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        >
          <ShinyText
            text={PHRASES[index]}
            speed={2}
            color="#5a5340"
            shineColor="#f5c518"
            spread={120}
            className="text-2xl font-bold leading-[1.4] tracking-tight sm:text-4xl [padding-block:0.15em]"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
