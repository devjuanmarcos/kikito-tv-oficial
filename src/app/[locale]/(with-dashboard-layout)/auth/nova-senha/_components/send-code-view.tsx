"use client";
import UserNewPasswordForm from "./user-auth-form";
import AuthLayout from "../../_components/AuthLayout";

export default function NewPasswordPage() {
  return (
    <AuthLayout
      title="Nova senha"
      description="Insira sua senha para finalizar seu cadastro"
    >
      <UserNewPasswordForm />
    </AuthLayout>
  );
}
