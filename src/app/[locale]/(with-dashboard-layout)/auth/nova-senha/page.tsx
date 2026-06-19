import { Metadata } from "next";
import NewPasswordPage from "./_components/send-code-view";

export const metadata: Metadata = {
  title: "Precificador | Nova Senha",
  description: "Página de nova senha.",
};

export default async function Page() {
  return <NewPasswordPage />;
}
