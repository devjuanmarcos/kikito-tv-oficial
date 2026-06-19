"use client";
import React from "react";
import { WindowSizeProvider } from "@/context/WindowSizeContext";
import { HtmlFontSizeProvider } from "@/context/HtmlFontSizeContext";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { UpdateProvider } from "@/context/UpdateContext";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { QueryProvider } from "@/providers/QueryProvider";

export default function Providers({
  children,
  locale,
  messages,
  session,
}: {
  children: React.ReactNode;
  locale: string | undefined;
  messages: AbstractIntlMessages | undefined;
  session: SessionProviderProps["session"];
}) {
  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider messages={messages} timeZone={"America/Sao_Paulo"} locale={locale}>
        <WindowSizeProvider>
          <HtmlFontSizeProvider>
            <UpdateProvider>
              <QueryProvider>{children}</QueryProvider>
            </UpdateProvider>
          </HtmlFontSizeProvider>
        </WindowSizeProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
