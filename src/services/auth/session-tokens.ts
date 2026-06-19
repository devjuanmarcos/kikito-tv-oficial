import "server-only";

import { cookies } from "next/headers";

import { RefreshTokenService } from "@/services/auth/refresh-token";

export const AUTH_COOKIE_NAMES = {
  accessToken: "portal-bioconecta-access-token",
  refreshToken: "portal-bioconecta-refresh-token",
  sessionExpired: "auth-session-expired",
} as const;

export interface AuthTokenPair {
  access_token: string;
  refresh_token: string;
}

export async function getAccessTokenValue(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAMES.accessToken)?.value ?? null;
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAMES.accessToken);
  cookieStore.delete(AUTH_COOKIE_NAMES.refreshToken);
}

export async function markAuthSessionExpired(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAMES.sessionExpired, "1", {
    path: "/",
    maxAge: 60,
    httpOnly: true,
    sameSite: "strict",
  });
}

export async function persistAuthTokens(tokens: AuthTokenPair): Promise<void> {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set(AUTH_COOKIE_NAMES.accessToken, tokens.access_token, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15,
  });

  cookieStore.set(AUTH_COOKIE_NAMES.refreshToken, tokens.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function refreshAuthSession(): Promise<AuthTokenPair> {
  const response = await RefreshTokenService();
  const responseData = (await response.json()) as Partial<AuthTokenPair> & { message?: string };

  if (!response.ok || !responseData.access_token || !responseData.refresh_token) {
    throw new Error(responseData.message || "Erro ao atualizar o token");
  }

  const tokens = {
    access_token: responseData.access_token,
    refresh_token: responseData.refresh_token,
  };

  await persistAuthTokens(tokens);
  return tokens;
}

export async function expireAuthSession(): Promise<void> {
  await clearAuthCookies();
  await markAuthSessionExpired();
}
