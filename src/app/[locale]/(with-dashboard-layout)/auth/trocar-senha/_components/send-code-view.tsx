"use client";
import { usePathname } from "next/navigation";
import UserPasswordChangeForm from "./user-auth-form";
import AuthLayout from "../../_components/AuthLayout";

export default function ChangePasswordPage() {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "pt";

  return (
    <AuthLayout
      title="Trocar senha"
      description="Insira o código enviado para o seu e-mail"
      showBackLink
      backLinkHref={`/${locale}/auth/enviar-codigo`}
      backLinkText="Enviar código novamente"
    >
      <UserPasswordChangeForm />
    </AuthLayout>
  );
}
