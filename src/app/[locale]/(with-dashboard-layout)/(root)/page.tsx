"use server";

import React from "react";
import { createDefaultMetadata } from "@/lib/metadata";
import { PageContainer } from "./_components/PageContainer";

export async function generateMetadata() {
  return createDefaultMetadata("Comunidade CST | Home", "Confira a página principal do site da Comunidade CST.");
}
export default async function Home() {
  return <PageContainer />;
}
