"use client";

/**
 * Link "Pular para o conteúdo principal" — oculto visualmente até receber foco.
 * Deve ser o PRIMEIRO elemento dentro do <body>.
 * O elemento <main> deve ter id="main-content".
 *
 * @example
 * // No layout raiz, antes do header:
 * <SkipToContent />
 * <Header />
 * <main id="main-content">...</main>
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
    >
      Pular para o conteúdo principal
    </a>
  );
}
