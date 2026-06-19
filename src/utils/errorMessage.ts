"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AUTH_COOKIE_NAMES } from "@/services/auth/session-tokens";

export async function axiosErrorMessage(
  error: any,
  message: string,
  stack?: boolean,
  ignoreStatus?: boolean,
  ignoreRedirect?: boolean
) {
  const session = await getServerSession();
  const cookieStore = await cookies();

  const errorMessage =
    error?.response?.data?.message || error?.response?.data?.error || error?.message || error?.toString() || message;

  const stackError = error?.stack ? `\nStack: ${error.stack}` : "";

  const errorStatus = error?.response?.status;

  if (errorMessage.includes("Refresh token failed, redirect to login") || !session?.user) {
    cookieStore.delete("cst-admin-access-token");
    cookieStore.delete("cst-admin-refresh-token");
    cookieStore.delete(AUTH_COOKIE_NAMES.accessToken);
    cookieStore.delete(AUTH_COOKIE_NAMES.refreshToken);
    cookieStore.delete("next-auth.session-token");
    cookieStore.delete("next-auth.csrf-token");
    cookieStore.delete("next-auth.callback-url");

    if (!ignoreRedirect) {
      redirect("/pt/auth");
    }
  }

  return `${!ignoreStatus ? ` ErrorStatus: ${errorStatus}, ` : ""}${errorMessage}, ${stack ? "Stack: " + stackError : ""}`;
}
