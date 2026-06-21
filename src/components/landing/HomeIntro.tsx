"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import ShinyText from "@/components/ui/shiny-text";

/* Frases de impacto exibidas ao entrar na home */
const PHRASES = ["Bem-vindo ao KikitoTV", "Onde ideias ganham vida"];
const PHRASE_MS = 1900;

/**
 * Guard em escopo de módulo: persiste durante navegação client-side
 * (o runtime JS sobrevive) mas é reavaliado em refresh / entrada direta.
 * Resultado: intro toca só no carregamento "real" da página.
 */
let introPlayed = false;

export function HomeIntro() {
  const [show, setShow] = useState(() => !introPlayed);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!show) return;
    introPlayed = true;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      if (i < PHRASES.length) {
        setIndex(i);
      } else {
        clearInterval(tick);
        setShow(false);
      }
    }, PHRASE_MS);

    return () => {
      clearInterval(tick);
      document.body.style.overflow = prevOverflow;
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[var(--ks-lacquer,#0b0b0c)] px-6 text-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          role="status"
          aria-live="polite"
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
                className="text-2xl font-bold leading-[1.4] tracking-tight [padding-block:0.15em] sm:text-4xl"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default HomeIntro;
