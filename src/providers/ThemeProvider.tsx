"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: Readonly<ThemeProviderProps>) {
  return (
    <NextThemesProvider {...props}>
      {/* reducedMotion="user": faz TODA animação motion/react respeitar prefers-reduced-motion
          automaticamente, sem cada componente precisar lembrar de checar (mesma filosofia do
          reset CSS global já aplicado em kikitocn-tokens.css pra @keyframes/transition — ver
          docs/component-import/motion-infrastructure/PLAN.md, esse reset NÃO cobre motion). */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  );
}
