type JwtPayload = {
  iss: string;
  sub: string;
  exp: number;
};

export interface JwtPayloadCustom extends JwtPayload {
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
  document?: string;
  gender?: string;
  isDisabled?: boolean;
  disabledDetails?: string;
}

export function parseJwt(token: string): JwtPayloadCustom | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const buffer = Buffer.from(base64, "base64");
    const jsonPayload = buffer.toString("utf-8");

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}
