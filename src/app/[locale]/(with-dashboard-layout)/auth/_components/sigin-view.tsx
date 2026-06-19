"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserAuthForm from "./user-auth-form";
import AuthLayout from "./AuthLayout";

export default function SignInViewPage() {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "pt";

  return (
    <AuthLayout title="Entrar" description="Insira seus dados para logar-se no sistema">
      <div className="flex flex-col gap-4 h-full w-full">
        <UserAuthForm />
        <p className="px-8 text-center body-callout-light text-muted-foreground">
          Ao clicar em continue você estará aceitando nossos{" "}
          <Link href={`/${locale}/terms`} className="underline underline-offset-4 hover:text-primary">
            Termos de serviço
          </Link>{" "}
          e{" "}
          <Link href={`/${locale}/privacy`} className="underline underline-offset-4 hover:text-primary">
            Políticas de privacidade
          </Link>
          .
        </p>
      </div>
    </AuthLayout>
  );
}
