import KBar from "@/components/kbar";
import AppSidebar from "@/components/layout/app-sidebar";
import DashboardProviders from "@/components/layout/DashboardProviders";
import { LayoutVars } from "@/components/layout/layout-vars";
import { LoadingItemProvider } from "@/context/LoadingItemContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Biomob - Dashboard",
  description: "Portal de gestão de preços",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <DashboardProviders>
      <LoadingItemProvider>
        <KBar>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset>
              <LayoutVars className="bg-background rounded-xl h-full w-full">
                {children}
              </LayoutVars>
            </SidebarInset>
          </SidebarProvider>
        </KBar>
      </LoadingItemProvider>
    </DashboardProviders>
  );
}
