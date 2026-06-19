"use client";
import { usePathname } from "next/navigation";
import UserSendCodeForm from "./user-auth-form";
import AuthLayout from "../../_components/AuthLayout";

export default function SendCodePage() {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "pt";

  return (
    <AuthLayout
      title="Recuperar senha"
      description="Insira seu e-mail cadastrado"
      showBackLink
      backLinkHref={`/${locale}/auth`}
      backLinkText="Voltar para o login"
    >
      <UserSendCodeForm />
    </AuthLayout>
  );
}
