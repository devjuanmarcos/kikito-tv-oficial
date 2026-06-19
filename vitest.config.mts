import path from "path";
import { fileURLToPath } from "url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e", "**/*.d.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      // Thresholds mínimos — incrementar gradualmente conforme cobertura cresce
      thresholds: {
        lines: 40,
        functions: 40,
        branches: 35,
        statements: 40,
      },
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "src/@types/**",
        "src/providers/**",
        "src/mockdata/**",
        "src/stores/**",
        "**/index.ts",
      ],
    },
  },
  resolve: {
    alias: {
      // vite-tsconfig-paths não resolve segmentos com colchetes ([locale])
      "@localeComponents": path.resolve(__dirname, "./src/app/[locale]/_components"),
    },
  },
});
