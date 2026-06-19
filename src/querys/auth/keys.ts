/**
 * Query keys factory para o módulo de auth.
 * Use sempre estas keys para garantir cache e invalidação corretos.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: authKeys.all })
 * useQuery({ queryKey: authKeys.session() })
 */
export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
  profile: (userId: string) => [...authKeys.all, "profile", userId] as const,
} as const;
