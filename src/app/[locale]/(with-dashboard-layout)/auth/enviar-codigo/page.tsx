import { Metadata } from "next";
import SendCodePage from "./_components/send-code-view";

export const metadata: Metadata = {
  title: "Precificador | Recuperar Senha",
  description: "Página de recuperação de senha.",
};

export default async function Page() {
  return <SendCodePage />;
}
