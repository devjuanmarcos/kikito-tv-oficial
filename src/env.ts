import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Variáveis de ambiente server-side (nunca expostas ao browser).
   */
  server: {
    NEXTAUTH_SECRET: z.string().min(16),
    NEXTAUTH_URL: z.string().url().optional(),
    BASE_URL_BIOCONECTA: z.string().url().optional(),
    // APIs externas — adicione as URLs dos seus serviços aqui
    // BASE_URL_API: z.string().url(),
    LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error"]).default("info"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },

  /**
   * Variáveis expostas ao browser (devem começar com NEXT_PUBLIC_).
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },

  /**
   * Mapeamento explícito das variáveis de runtime.
   * Cada variável declarada acima DEVE ter uma entrada aqui.
   */
  runtimeEnv: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    BASE_URL_BIOCONECTA: process.env.BASE_URL_BIOCONECTA,
    LOG_LEVEL: process.env.LOG_LEVEL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /**
   * Pular validação durante CI build sem env vars configuradas.
   * Use: SKIP_ENV_VALIDATION=true pnpm build
   */
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",

  /**
   * Trata strings vazias como undefined — evita bugs silenciosos.
   */
  emptyStringAsUndefined: true,
});
