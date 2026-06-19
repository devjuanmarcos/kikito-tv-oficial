import { Metadata } from "next";
import ChangePasswordPage from "./_components/send-code-view";

export const metadata: Metadata = {
  title: "Precificador | Trocar Senha",
  description: "Página de troca de senha.",
};

export default async function Page() {
  return <ChangePasswordPage />;
}
