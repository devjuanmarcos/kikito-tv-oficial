"use server";

import { resetPasswordSolicitationResponse } from "@/@types/auth";
import { resetPasswordSolicitationService } from "@/services/auth";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function resetPasswordSolicitationAction(
  email: string
): Promise<PostAndPutActionProps<resetPasswordSolicitationResponse>> {
  try {
    const response = await resetPasswordSolicitationService({ email });
    return {
      message: "Código enviado com sucesso!",
      success: true,
      responseData: response.data,
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao enviar código");
    return {
      message: errorMessage,
      success: false,
    };
  }
}
