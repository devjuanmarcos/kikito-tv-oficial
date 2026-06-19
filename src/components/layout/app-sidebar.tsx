"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@ui/sidebar";
import { adminNavItems } from "@/constants/data";
import { ChevronRight, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { Icons } from "../icons";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLoadingItem } from "@/context/LoadingItemContext";

export const company = {
  name: "CST BRASIL",
  plan: "Dashboard",
};

export default function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { toggleSidebar, state } = useSidebar();
  const { theme } = useTheme();
  const { loadingItemUrl, setLoadingItemUrl } = useLoadingItem();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogout() {
    try {
      await signOut({ redirect: false });
      window.location.href = "/";
    } catch (error) {
      toast(`Erro ao requisitar `, {
        description: `${error}`,
      });
    }
  }

  const navItemsToExibe = adminNavItems();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex gap-2 py-2 text-sidebar-accent-foreground ">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {mounted && (
              <Image
                src={theme === "dark" ? "/img/LUMIABRANCA.png" : "/img/LUMIAPRETA.png"}
                alt="Logo"
                width={100}
                height={100}
                className="w-20 h-auto"
              />
            )}
          </div>
          <div className="grid flex-1 text-left paragraph_01 leading-tight">
            <span className="truncate font-semibold">{company.name}</span>
            <span className="truncate paragraph-card">{company.plan}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        {navItemsToExibe.map((section, sectionIndex) => (
          <SidebarGroup key={section.type || sectionIndex}>
            <SidebarGroupLabel>{section.type}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items?.map((item: any, index: number) => {
                const Icon = item.icon ? (Icons as any)[item.icon] : Icons.logo;
                const isAnySubItemActive = item.items?.some((subItem: any) => pathname === subItem.url) || false;
                const isParentActive = (item.url && pathname === item.url) || isAnySubItemActive;
                const isParentLoading = item.url && loadingItemUrl === item.url;
                const activeButtonClasses = buttonVariants({ variant: "default" });
                return item?.items && item?.items?.length > 0 ? (
                  <Collapsible
                    key={item.title || index}
                    asChild
                    defaultOpen={isParentActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger
                        asChild
                        onClick={() => {
                          if (!item?.items?.length) return;
                          if (state === "collapsed" && window.innerWidth >= 764) {
                            toggleSidebar();
                          }
                        }}
                      >
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isParentActive || isParentLoading}
                          className={
                            isParentActive || isParentLoading
                              ? `${activeButtonClasses} justify-start text-start`
                              : "justify-start"
                          }
                        >
                          {isParentLoading ? (
                            <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          ) : (
                            item.icon && <Icon className={cn("transition-colors")} />
                          )}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem: any, idx: number) => {
                            const isSubItemLoading = loadingItemUrl === subItem.url;
                            return (
                              <SidebarMenuSubItem key={subItem.key || `${subItem.title}-${subItem.url}-${idx}`}>
                                <SidebarMenuSubButton
                                  asChild
                                  target={subItem.target}
                                  isActive={pathname === subItem.url || isSubItemLoading}
                                  className={
                                    pathname === subItem.url || isSubItemLoading
                                      ? `${activeButtonClasses} justify-start text-start`
                                      : "justify-start"
                                  }
                                  onClick={(e) => {
                                    if (subItem.target !== "_blank") {
                                      setLoadingItemUrl(subItem.url);
                                    }
                                  }}
                                >
                                  <Link
                                    href={subItem.url}
                                    target={subItem.target}
                                    rel={subItem.target === "_blank" ? "noreferrer" : undefined}
                                  >
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : item.url ? (
                  <SidebarMenuItem key={item.title || index}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url || isParentLoading}
                      className={
                        pathname === item.url || isParentLoading
                          ? `${activeButtonClasses} justify-start text-start`
                          : "justify-start"
                      }
                      onClick={(e) => {
                        if (item.target !== "_blank" && item.url) {
                          setLoadingItemUrl(item.url);
                        }
                      }}
                    >
                      <Link
                        href={item.url}
                        className="justify-start flex items-center gap-2"
                        target={item.target}
                        rel={item.target === "_blank" ? "noreferrer" : undefined}
                      >
                        {isParentLoading ? (
                          <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Icon className={cn("transition-colors")} />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : null;
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={handleLogout}>
              <LogOut className="size-4" />
              <span className="font-medium">Sair da Plataforma</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
