"use client";

import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  LAYOUT_SIDEBAR_WIDTH_EXPANDED,
  LAYOUT_SIDEBAR_WIDTH_MOBILE,
} from "@/config/layout";
import { cn } from "@/lib/utils";

/**
 * Define --layout-sidebar-offset no DOM conforme o estado do sidebar.
 * Deve ser usado dentro de SidebarProvider (ex.: dentro de SidebarInset).
 * - Mobile: sidebar vira dialog → offset 0.
 * - Sidebar fechada (offcanvas): some completamente → offset 0.
 * - Sidebar aberta: ocupa 16rem → offset 16rem.
 */
export function LayoutVars({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { state, isMobile } = useSidebar();

  const sidebarOffset =
    isMobile || state === "collapsed"
      ? LAYOUT_SIDEBAR_WIDTH_MOBILE
      : LAYOUT_SIDEBAR_WIDTH_EXPANDED;

  return (
    <div
      className={cn("h-full w-full", className)}
      style={
        {
          "--layout-sidebar-offset": sidebarOffset,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
