"use server";

import { loginService } from "@/services/auth";
import { persistAuthTokens } from "@/services/auth/session-tokens";
import { axiosErrorMessage } from "@/utils/errorMessage";
import { type JwtPayloadCustom } from "@/utils/parseJwt";

interface loginInterface {
  email: string;
  password: string;
}

type FormState = {
  message: string;
  success: boolean;
  fields?: Record<string, FormDataEntryValue>;
  data?: any;
};

function parseJwt(token: string): JwtPayloadCustom {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    throw new Error("Token inválido");
  }
}

export async function nodeLogin(loginProps: loginInterface): Promise<FormState> {
  try {
    const response = await loginService(loginProps);
    const data = response.data;
    const decodedToken = parseJwt(data.access_token);

    if (!response.data || !response.data.access_token) {
      return {
        success: false,
        message: "Erro no login: tokens não encontrados na resposta do servidor",
      };
    }

    await persistAuthTokens(data);

    return {
      message: "Login realizado com sucesso. Aguarde o redirecionamento.",
      success: true,
      data: {
        sub: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        document: decodedToken.document,
        gender: decodedToken.gender,
        isDisabled: decodedToken.isDisabled,
        disabledDetails: decodedToken.disabledDetails,
        role: decodedToken.role,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      },
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao realizar login", false, true);
    return {
      success: false,
      message: errorMessage,
    };
  }
}
