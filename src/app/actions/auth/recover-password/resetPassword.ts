"use server";

import { resetPasswordResponse } from "@/@types/auth";
import { resetPasswordService } from "@/services/auth";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function resetPasswordAction(
  code: string,
  newPassword: string
): Promise<PostAndPutActionProps<resetPasswordResponse>> {
  try {
    const response = await resetPasswordService({ code, newPassword });
    return {
      message: "Senha redefinida com sucesso!",
      success: true,
      responseData: response.data,
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao redefinir senha");
    return {
      message: errorMessage,
      success: false,
    };
  }
}
