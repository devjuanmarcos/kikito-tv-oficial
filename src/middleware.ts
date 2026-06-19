import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";

import {
  AUTH_ROUTES,
  buildLoginUrl,
  getRequiredRoles,
  hasRequiredRole,
  isPublicRoute,
  type UserRole,
} from "@/lib/auth-utils";

const locales = [
  "zh-Hant",
  "zh-Hans",
  "en",
  "pt",
  "es",
  "ja",
  "de",
  "fr",
  "it",
  "bn",
  "hi",
  "ru",
  "ko",
  "vi",
  "te",
  "yue",
  "mr",
  "ta",
  "tr",
  "ur",
  "gu",
  "pl",
  "uk",
  "ms",
  "kn",
  "or",
  "pa",
  "ro",
  "az",
  "fa",
  "my",
  "th",
  "nl",
  "yo",
  "sd",
];

const defaultLocale = "pt";
const nextIntlMiddleware = createMiddleware({ locales, defaultLocale });

function extractLocale(pathname: string): string {
  const segment = pathname.split("/")[1];
  return locales.includes(segment) ? segment : defaultLocale;
}

function shouldSkipMiddleware(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api/auth") ||
    /\.(jpg|jpeg|png|gif|svg|webp|ico|json|css|js|map)$/.test(pathname)
  );
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next();
  }

  const isLocaleMissing = !locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (isLocaleMissing) {
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const locale = extractLocale(pathname);

  if (req.cookies.get("auth-session-expired")?.value) {
    const loginUrl = new URL(`/${locale}${AUTH_ROUTES.login}`, req.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set("auth-session-expired", "", { maxAge: 0, path: "/" });
    return res;
  }

  if (isPublicRoute(pathname)) {
    return nextIntlMiddleware(req);
  }

  const requiredRoles = getRequiredRoles(pathname);
  if (!requiredRoles) {
    return nextIntlMiddleware(req);
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL(buildLoginUrl(locale, pathname), req.url));
  }

  const userRole = (token.role ?? "user") as UserRole;
  if (!hasRequiredRole(userRole, requiredRoles)) {
    return NextResponse.redirect(new URL(`/${locale}${AUTH_ROUTES.unauthorized}`, req.url));
  }

  return nextIntlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|static).*)"],
};
