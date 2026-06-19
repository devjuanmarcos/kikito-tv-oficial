"use client";
import { ColumnsContexProvider } from "@/context/ColumnsContext";
import { SortProvider } from "@/context/SortContext";
import React from "react";

export default function DashboardProviders({ children }: { children: React.ReactNode }) {
  return (
    <SortProvider>
      <ColumnsContexProvider>{children}</ColumnsContexProvider>
    </SortProvider>
  );
}
