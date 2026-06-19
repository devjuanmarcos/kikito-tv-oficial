"use client";
import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { PageBoxLayout } from "@/components/layout/page-box";
import { AuthBreadcrumbs } from "./AuthBreadcrumbs";
import { WavyBackground } from "@/components/ui/wavy-background";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  showBackLink?: boolean;
  backLinkHref?: string;
  backLinkText?: string;
}

interface WavyContent {
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  description,
  showBackLink = false,
  backLinkHref,
  backLinkText = "Voltar",
}: AuthLayoutProps) {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "pt";
  
  // Se backLinkHref não foi fornecido, usa o padrão baseado no locale
  const defaultBackLinkHref = backLinkHref || `/${locale}/auth`;

  // Define textos customizados para cada rota
  const wavyContent: WavyContent = useMemo(() => {
    if (pathname?.includes("/enviar-codigo")) {
      return {
        title: "Recupere sua conta",
        subtitle: "Vamos ajudá-lo a recuperar o acesso à sua conta de forma segura e rápida",
      };
    }
    if (pathname?.includes("/trocar-senha")) {
      return {
        title: "Redefina sua senha",
        subtitle: "Crie uma nova senha forte para proteger sua conta",
      };
    }
    if (pathname?.includes("/nova-senha")) {
      return {
        title: "Bem-vindo à comunidade",
        subtitle: "Complete seu cadastro criando uma senha segura",
      };
    }
    // Login (padrão)
    return {
      title: "Bem-vindo de volta",
      subtitle: "Entre na Comunidade Lumen e faça parte da rede colaborativa sobre demência",
    };
  }, [pathname]);

  return (
    <PageBoxLayout breadcrumbs={<AuthBreadcrumbs />} ignoreIcon>
      <div className="relative flex flex-col items-center justify-center w-full min-h-[calc(100vh-260px)] md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* WavyBackground com texto customizado - apenas desktop */}
        <div className="relative hidden min-h-[600px] lg:flex rounded-lg overflow-hidden">
          <WavyBackground
            className="max-w-full mx-auto h-full"
            containerClassName="h-full min-h-[600px]"
            colors={[
              "#1e4a7a", // azul escuro (brand-primary-mid)
              "#4a90c4", // azul claro (brand-primary-light)
              "#a65c00", // amarelo escuro (warning-dark)
              "#e67e00", // amarelo médio (warning-mid)
              "#3b82c4", // azul intermediário
            ]}
            waveWidth={50}
            backgroundFill="rgb(24, 24, 27)"
            blur={10}
            speed="slow"
            waveOpacity={0.5}
          >
            <div className="flex flex-col items-center justify-center h-full px-10 py-20">
              <p className="text-2xl md:text-4xl lg:text-6xl text-white font-bold inter-var text-center">
                {wavyContent.title}
              </p>
              <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center max-w-2xl">
                {wavyContent.subtitle}
              </p>
            </div>
          </WavyBackground>
        </div>

        {/* Conteúdo principal */}
        <div className="flex w-full items-center justify-center p-4 lg:p-8 min-h-[calc(100vh-260px)]">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[483px]">
            <div className="flex flex-col text-center">
              <h1 className="heading-02-medium tracking-tight">{title}</h1>
              <p className="body-title text-muted-foreground mt-2">{description}</p>
            </div>
            {children}
            {showBackLink && (
              <Link
                href={defaultBackLinkHref}
                className="w-fit mx-auto underline underline-offset-4 hover:text-primary body-callout-light"
              >
                {backLinkText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </PageBoxLayout>
  );
}
