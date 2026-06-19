import { Metadata } from "next";
import SignInViewPage from "./_components/sigin-view";

export const metadata: Metadata = {
  title: "Precificador | Login",
  description: "Página de login para autenticação.",
};

export default async function Page() {
  return <SignInViewPage />;
}
