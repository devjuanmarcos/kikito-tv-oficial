import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import { getMessages } from "next-intl/server";
import { Toaster } from "sonner";

import { SkipToContent } from "@/components/a11y";
import LandingPageProviders from "@/components/layout/LandingPageProviders";
import { authOptions } from "@/lib/auth";
import { ThemeProvider } from "@/providers/ThemeProvider";

const APP_NAME = "Kikito - TV";
const APP_DEFAULT_TITLE = "Kikito - TV";
const APP_TITLE_TEMPLATE = "%s";
const APP_DESCRIPTION = "My little website!";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#1e4a7a",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const messages = await getMessages(resolvedParams.locale as any);
  const session = await getServerSession(authOptions);

  return (
    <html className={`${GeistSans.variable} scroll-container`} suppressHydrationWarning lang="pt-BR">
      <body className={""}>
        <SkipToContent />
        <LandingPageProviders messages={messages} locale={resolvedParams.locale} session={session}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </LandingPageProviders>
        <Toaster richColors />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
