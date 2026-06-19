"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import SwitchWithIcon from "../ui/switchWithIcon";
import FontSizeSlider from "../ui/FontSizeSlider";
import { SidebarTrigger } from "@ui/sidebar";
import { Separator } from "@ui/separator";
import { Skeleton } from "../ui/skeleton";
import { Button, LinkButton } from "../ui/button";
import Image from "next/image";
import { Bell, Search, UserCircle } from "lucide-react";

export const AcessibilityBar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Extrai o locale do pathname (ex: /pt/... ou /en/...)
  const locale = pathname?.split("/")[1] || "pt";
  const authPath = `/${locale}/auth`;

  return (
    <div
      className="max-h-12 overflow-y-hidden relative flex justify-end 
      gap-4 items-center 
        w-full 
        px-4 py-1 my-0 mx-auto"
    >
      <div className="flex gap-4 items-center max-md:mx-auto">
        <div className="hidden lg:flex gap-1 items-center text-end ">
          <span className="flex flex-col body-paragraph justify-end ">
            <span className="w-max text-end ">by</span>
          </span>
          <Image
            src={"/img/LOGO_INSTITUTO_BRANCA.png"}
            alt={"Logo Instituto Biomob"}
            aria-label={"Logo Instituto Biomob"}
            sizes="100vw"
            width={30}
            height={30}
            className="w-auto h-7"
          />
        </div>
        <span className="2xl:contents hidden font-semibold text-lg font-montserrat">Acessibilidade</span>
        <SwitchWithIcon />
        <FontSizeSlider />
        <div className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-foreground mr-1" />
          <Button variant="ghost" size="icon" className="size-9">
            <Bell className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-9">
            <Search className="size-4" />
          </Button>
          {session?.user ? (
            <LinkButton variant="outline" size="sm" href={`/${locale}/user/${session.user.id}`}>
              {session.user.name}
            </LinkButton>
          ) : (
            <LinkButton href={authPath} variant="ghost" size="icon">
              <UserCircle className="size-4" />
            </LinkButton>
          )}
        </div>
      </div>
    </div>
  );
};

interface HeaderProps {
  breadcrumbs?: React.ReactNode;
}

export default function Header({ breadcrumbs }: HeaderProps) {
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className="w-100 mx-4 mt-2 h-10" />;
  }

  return (
    <header className="rounded-t-xl border-b flex h-[3.25rem] shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 print:hidden">
      <div className="flex items-center gap-2 px-4 lg:w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {breadcrumbs && <div className="max-lg:hidden">{breadcrumbs}</div>}
      </div>
      <AcessibilityBar />
    </header>
  );
}
