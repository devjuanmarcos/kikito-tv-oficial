import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

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

  return nextIntlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|static).*)"],
};
