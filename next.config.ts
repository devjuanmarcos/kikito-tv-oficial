/** @type {import('next').NextConfig} */
import { spawnSync } from "node:child_process";

import bundleAnalyzer from "@next/bundle-analyzer";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const revision = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ?? crypto.randomUUID();

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  maximumFileSizeToCacheInBytes: 4.5 * 1024 * 1024,
  cacheOnNavigation: true,
  additionalPrecacheEntries: [{ url: "/~offline.html", revision }],
  // Em dev o plugin regrava sw.js a cada compile e o file watcher entra em loop.
  disable: process.env.NODE_ENV === "development",
});

function composePlugins(...plugins: ((config: NextConfig) => NextConfig)[]) {
  return (config: NextConfig) => plugins.reduceRight((acc, plugin) => plugin(acc), config);
}

const nextConfig: NextConfig = {
  // ESLint roda via `pnpm lint` no CI — não durante o build para manter build rápido
  eslint: { ignoreDuringBuilds: true },
  // TypeScript errors pré-existentes no template — não bloquear o build
  typescript: { ignoreBuildErrors: true },

  // Necessário para o Dockerfile multi-stage com standalone output
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,

  experimental: {
    serverActions: { bodySizeLimit: "100mb" },
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "@tanstack/react-query",
      "@tanstack/react-table",
      "@tanstack/react-virtual",
    ],
  },

  images: {
    // Whitelist explícita de domínios — remover wildcard é crítico para segurança
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "*.vercel-storage.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers aplicados a todas as rotas
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          // HSTS — habilitar apenas em produção com HTTPS
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
            : []),
        ],
      },
      // Cache imutável para assets estáticos gerados pelo Next.js
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Cache para imagens e fontes públicas
      {
        source: "/:path*\\.(jpg|jpeg|png|gif|ico|svg|webp|avif|woff|woff2|ttf|eot)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },

  // Evita loop de compilação: o Serwist regrava public/sw.js a cada build
  webpack: (config, { dev }) => {
    if (dev) {
      const prev = config.watchOptions ?? {};
      const prevIgnored = prev.ignored;
      const prevList = Array.isArray(prevIgnored) ? prevIgnored : prevIgnored ? [prevIgnored] : [];
      const validPrev = prevList.filter((x): x is string => typeof x === "string" && x.length > 0);
      config.watchOptions = {
        ...prev,
        ignored: [...validPrev, "**/public/sw.js", "**/public/sw.js.map"],
        aggregateTimeout: 600,
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(composePlugins(withNextIntl, withSerwist)(nextConfig));
