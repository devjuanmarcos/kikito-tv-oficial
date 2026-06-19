"use server";

import { getAccessTokenValue } from "@/services/auth/session-tokens";

export async function getAccessTokenServerAction() {
  const token = await getAccessTokenValue();
  return token ? { value: token } : undefined;
}
