import { getServerSession } from "next-auth";
import { createSafeActionClient } from "next-safe-action";

import { log } from "./logger";

/**
 * Cliente base para Server Actions públicas (sem autenticação).
 * Captura erros e os formata de maneira consistente.
 */
export const actionClient = createSafeActionClient({
  handleServerError(e) {
    log.error("Server action error", e);

    if (e instanceof Error) return e.message;
    return "Erro inesperado. Tente novamente.";
  },
});

/**
 * Cliente para Server Actions que requerem autenticação.
 * Injeta o usuário da sessão no ctx de cada action.
 *
 * @example
 * export const updateProfileAction = authActionClient
 *   .schema(z.object({ name: z.string().min(1) }))
 *   .action(async ({ parsedInput, ctx }) => {
 *     // ctx.user disponível e tipado
 *   })
 */
export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Não autenticado. Faça login para continuar.");
  }

  return next({ ctx: { user: session.user } });
});
