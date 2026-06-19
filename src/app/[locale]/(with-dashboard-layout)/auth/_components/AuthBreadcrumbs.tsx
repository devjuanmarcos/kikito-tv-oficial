"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function AuthBreadcrumbs() {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "pt";

  // Determina o texto da página atual baseado no pathname
  const getCurrentPage = () => {
    if (pathname?.includes("/enviar-codigo")) return "Recuperar senha";
    if (pathname?.includes("/trocar-senha")) return "Trocar senha";
    if (pathname?.includes("/nova-senha")) return "Nova senha";
    return "Entrar";
  };

  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/${locale}`}>Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbPage>{getCurrentPage()}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
