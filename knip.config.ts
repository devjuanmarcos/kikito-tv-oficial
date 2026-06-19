import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "src/app/**/{page,layout,loading,error,not-found,template}.tsx",
    "src/app/**/route.ts",
    "src/middleware.ts",
    "src/env.ts",
    "src/i18n/request.ts",
    "src/i18n/routing.ts",
  ],
  ignore: [
    "src/components/ui/**", // shadcn/ui — gerado automaticamente
    "src/@types/**",
    "src/test/**",
    "**/*.test.{ts,tsx}",
    "**/*.spec.{ts,tsx}",
    "e2e/**",
  ],
  ignoreDependencies: [
    "tailwindcss", // usado via PostCSS, não importado diretamente
    "postcss",
    "autoprefixer",
    "@tailwindcss/postcss",
    "tailwindcss-animate",
  ],
};

export default config;
