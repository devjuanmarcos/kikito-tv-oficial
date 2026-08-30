"use server";

/**
 * Server action placeholder pro exemplo em src/components/form/examples/onboarding-multistep-form.tsx
 * (MultistepForm + useActionState). Nunca foi implementada de verdade - so o import faltava,
 * quebrando o tsc pro arquivo de exemplo. Substituir pela chamada real (API/DB) quando o
 * fluxo de onboarding for implementado.
 */
export async function onboardingAction(
  prevState: PostAndPutActionProps<{ id: string }>,
  data: FormData
): Promise<PostAndPutActionProps<{ id: string }>> {
  try {
    // TODO: enviar `data` pro endpoint/DB real de onboarding
    void data;
    return {
      message: "Cadastro concluído com sucesso!",
      success: true,
      responseData: { id: "" },
    };
  } catch {
    return {
      message: "Erro ao concluir o cadastro.",
      success: false,
    };
  }
}
