"use client";
import React from "react";
import { ScrollArea } from "@ui/scroll-area";
import { usePathname } from "next/navigation";

export default function PageContainer({
  children,
  scrolllable,
  className,
  removePadding,
}: {
  children: React.ReactNode;
  scrolllable?: boolean;
  className?: string;
  removePadding?: boolean;
}) {
  const pathname = usePathname();
  const isQRCodePage = pathname?.includes("/dashboard/qrcodes");
  const isAuthPage = pathname?.includes("/auth");

  return (
    <>
      {scrolllable ? (
        <ScrollArea className={`print:h-auto h-[calc(100dvh-4.25rem)] scroll-container ${className || ""}`}>
          <div 
            className={`${removePadding ? "" : "p-2 md:p-5"} ${isAuthPage ? "min-h-full" : ""}`}
            style={isAuthPage ? { minHeight: "100%" } : undefined}
          >
            {children}
          </div>
        </ScrollArea>
      ) : (
        <div className={`h-full ${removePadding ? "" : "p-2 md:p-5"} ${className || ""}`}>
          <div className={isQRCodePage ? "h-auto" : "h-full max-h-[calc(100vh-4.25rem)] overflow-y-hidden"}>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
