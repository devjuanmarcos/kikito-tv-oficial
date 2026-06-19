/**
 * Tipos e helpers de autenticação reutilizáveis.
 * Adapte UserRole conforme as roles do sistema.
 */

export type UserRole = "admin" | "moderator" | "user";

export const AUTH_ROUTES = {
  login: "/auth",
  unauthorized: "/unauthorized",
} as const;

/**
 * Mapa de rotas protegidas com as roles permitidas.
 * Chave: prefixo da rota sem locale. Valor: roles que têm acesso.
 */
export const ROLE_ROUTES: Record<string, UserRole[]> = {
  "/administrador": ["admin"],
  "/dashboard/admin": ["admin"],
  "/dashboard/moderator": ["admin", "moderator"],
  "/dashboard": ["admin", "moderator", "user"],
};

const PUBLIC_ROUTES = [
  "/",
  AUTH_ROUTES.login,
  "/auth/enviar-codigo",
  "/auth/nova-senha",
  "/auth/trocar-senha",
  "/register",
  "/forgot-password",
  AUTH_ROUTES.unauthorized,
];

const LOCALE_PREFIX_REGEX = /^\/[a-z]{2}(?:-[A-Za-z]{2,4})?(?=\/|$)/;

export function stripLocaleFromPathname(pathname: string): string {
  const withoutLocale = pathname.replace(LOCALE_PREFIX_REGEX, "") || "/";
  return withoutLocale.startsWith("/") ? withoutLocale : `/${withoutLocale}`;
}

export function hasRequiredRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function isPublicRoute(pathname: string): boolean {
  const withoutLocale = stripLocaleFromPathname(pathname);
  return PUBLIC_ROUTES.some((route) => withoutLocale === route || withoutLocale.startsWith(`${route}/`));
}

export function getRequiredRoles(pathname: string): UserRole[] | null {
  const withoutLocale = stripLocaleFromPathname(pathname);

  if (isPublicRoute(withoutLocale)) {
    return null;
  }

  for (const [route, roles] of Object.entries(ROLE_ROUTES)) {
    if (withoutLocale === route || withoutLocale.startsWith(`${route}/`)) {
      return roles;
    }
  }

  return null;
}

export function buildLoginUrl(locale: string, callbackUrl: string): string {
  return `/${locale}${AUTH_ROUTES.login}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}
