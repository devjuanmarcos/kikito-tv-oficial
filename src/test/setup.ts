import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { configureAxe, toHaveNoViolations } from "jest-axe";
import React from "react";
import { expect, beforeAll, afterEach, afterAll, vi } from "vitest";

import { server } from "./mocks/server";

// ─── jest-axe matchers ───────────────────────────────────────────────────────
expect.extend(toHaveNoViolations);

// Instância axe configurada — exportar para usar nos testes
export const axe = configureAxe({
  rules: {
    // jsdom não computa CSS real, então color-contrast não é possível testar
    "color-contrast": { enabled: false },
  },
});

// ─── MSW ─────────────────────────────────────────────────────────────────────
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

// ─── react.cache shim (not available in jsdom / client React build) ──────────
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    cache: (actual as Record<string, unknown>)["cache"] ?? ((fn: unknown) => fn),
  };
});

// ─── next/navigation (App Router) ────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => "/pt"),
  useParams: vi.fn(() => ({ locale: "pt" })),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

// ─── next/image ───────────────────────────────────────────────────────────────
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [k: string]: unknown }) =>
    React.createElement("img", {
      src: typeof src === "string" ? src : "",
      alt,
      ...props,
    }),
}));

// ─── next/link ────────────────────────────────────────────────────────────────
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.PropsWithChildren<{ href: string; [k: string]: unknown }>) =>
    React.createElement("a", { href, ...props }, children as React.ReactNode),
}));

// ─── next-intl ────────────────────────────────────────────────────────────────
vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => key),
  useLocale: vi.fn(() => "pt"),
  useMessages: vi.fn(() => ({})),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// ─── next-themes ─────────────────────────────────────────────────────────────
vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({
    theme: "light",
    setTheme: vi.fn(),
    resolvedTheme: "light",
  })),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// ─── next-auth ────────────────────────────────────────────────────────────────
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({ data: null, status: "unauthenticated" })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(() => Promise.resolve(null)),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// ─── framer-motion ────────────────────────────────────────────────────────────
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get:
        (_target, prop: string) =>
        ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
          React.createElement(prop as keyof React.JSX.IntrinsicElements, props, children as React.ReactNode),
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: vi.fn(() => ({ start: vi.fn(), stop: vi.fn() })),
  useInView: vi.fn(() => true),
  useMotionValue: vi.fn(() => ({ set: vi.fn(), get: vi.fn(() => 0) })),
  useTransform: vi.fn(() => 0),
  useSpring: vi.fn(() => 0),
}));

vi.mock("motion", () => ({
  motion: new Proxy(
    {},
    {
      get:
        (_target, prop: string) =>
        ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
          React.createElement(prop as keyof React.JSX.IntrinsicElements, props, children as React.ReactNode),
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// ─── Browser API stubs ────────────────────────────────────────────────────────
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
}));

window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo;
Element.prototype.scrollIntoView = vi.fn();

document.elementFromPoint = vi.fn(() => null) as typeof document.elementFromPoint;
