"use server";

import { Metadata } from "next";
import { PageContainer } from "./_components/PageContainer";

export async function metadata(): Promise<Metadata> {
  return {
    title: "Painel Administrativo",
    description: "Painel de controle do administrador",
  };
}

export default async function page() {
  return <PageContainer />;
}
