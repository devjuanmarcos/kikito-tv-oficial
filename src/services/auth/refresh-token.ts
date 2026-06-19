import { cookies } from "next/headers";

export async function RefreshTokenService(): Promise<any> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("portal-bioconecta-refresh-token");

  if (!refreshToken?.value) {
    throw new Error("No refresh token found");
  }

  const baseUrl = process.env.BASE_URL_BIOCONECTA || "https://api.biomoborg.biomob.app";

  return await fetch(`${baseUrl}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken.value,
    }),
  });
}
