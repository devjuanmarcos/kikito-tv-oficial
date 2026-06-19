"use server";

import { refreshAuthSession } from "@/services/auth/session-tokens";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function actionRefreshToken() {
  try {
    const responseData = await refreshAuthSession();

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao atualizar o token", false, true);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
