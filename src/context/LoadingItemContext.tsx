"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

interface LoadingItemContextType {
  loadingItemUrl: string | null;
  setLoadingItemUrl: (url: string | null) => void;
}

const LoadingItemContext = createContext<LoadingItemContextType | undefined>(undefined);

export function LoadingItemProvider({ children }: { children: React.ReactNode }) {
  const [loadingItemUrl, setLoadingItemUrl] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Limpar o loading quando a rota mudar
    setLoadingItemUrl(null);
  }, [pathname]);

  return (
    <LoadingItemContext.Provider value={{ loadingItemUrl, setLoadingItemUrl }}>{children}</LoadingItemContext.Provider>
  );
}

export function useLoadingItem() {
  const context = useContext(LoadingItemContext);
  if (context === undefined) {
    throw new Error("useLoadingItem must be used within LoadingItemProvider");
  }
  return context;
}
