import { axiosErrorMessage } from "@/utils/errorMessage";
import { AxiosResponse } from "axios";

export function baseGetAction<T, R>(
  serviceFunction: (params: T) => Promise<AxiosResponse<R>>,
  successMessage: string,
  errorMessage: string
) {
  return async function (params?: T): Promise<GetActionProps<R>> {
    try {
      // console.log(`Minha data do params ${JSON.stringify(params)}`);
      const response = await serviceFunction(params || ({} as T));

      // if (process.env.NODE_ENV === "development") {
      //   console.log(`Minha data do response ${serviceFunction.toString()}`, response.data);
      // }

      return {
        message: successMessage,
        success: true,
        issues: [],
        responseData: response.data,
      };
    } catch (error) {
      const errorMsg = await axiosErrorMessage(error, errorMessage);
      return {
        message: errorMsg,
        success: false,
        issues: [errorMsg],
        responseData: undefined,
      };
    }
  };
}

// Exemplo de uso
// export const allAttendanceByDateAction = createAttendanceAction<AttendanceRequestParams, AttendanceResponse>(
//   allAttendanceByDateService,
//   "Lista de presenças por data obtida com sucesso",
//   "Erro ao buscar lista de presenças por data"
// );
