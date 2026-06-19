"use server";

import { axiosErrorMessage } from "@/utils/errorMessage";

interface TestActionResponse {}

export async function postTestAction(
  prevState: PostAndPutActionProps<any>,
  data: FormData
): Promise<PostAndPutActionProps<TestActionResponse>> {
  try {
    const dtoToSend = {};
    const formDataToSend = new FormData();
    formDataToSend.append("dto", JSON.stringify(dtoToSend));
    const images = data.getAll("images");
    images.forEach((file: any, index: number) => {
      formDataToSend.append("images", file);
    });

    return {
      message: "Informações do produto enviadas com sucesso!",
      success: true,
      responseData: {},
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao enviar informações do produto");
    return {
      message: errorMessage,
      success: false,
    };
  }
}
