"use client";

import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

import { authKeys } from "./keys";

/**
 * Hook para acessar a sessão do usuário com cache React Query.
 * staleTime: 5 minutos — sessão muda raramente.
 */
export function useSessionQuery() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: () => getSession(),
    staleTime: 5 * 60 * 1000,
  });
}
