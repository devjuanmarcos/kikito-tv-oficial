import { execSync } from "node:child_process";
import path from "node:path";

import fs from "fs-extra";

export type Framework = "next" | "vite" | "remix" | "unknown";
export type PackageManager = "pnpm" | "bun" | "yarn" | "npm";

export function detectFramework(cwd: string): Framework {
  const pkg = readPackageJson(cwd);
  if (!pkg) return "unknown";

  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  if ("next" in deps) return "next";
  if ("remix" in deps || "@remix-run/react" in deps) return "remix";
  if ("vite" in deps || "@vitejs/plugin-react" in deps) return "vite";
  return "unknown";
}

export function detectPackageManager(cwd: string): PackageManager {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "bun.lockb")) || fs.existsSync(path.join(cwd, "bun.lock"))) return "bun";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export function detectGlobalsCSS(cwd: string, framework: Framework): string {
  const candidates =
    framework === "next"
      ? ["src/app/globals.css", "src/app/[locale]/globals.css", "app/globals.css", "styles/globals.css"]
      : ["src/index.css", "src/styles/index.css", "src/main.css", "index.css"];

  for (const c of candidates) {
    if (fs.existsSync(path.join(cwd, c))) return c;
  }

  return framework === "next" ? "src/app/globals.css" : "src/index.css";
}

export function detectComponentsDir(cwd: string): string {
  const candidates = ["src/components/ui", "src/components", "components/ui", "components"];
  for (const c of candidates) {
    if (fs.existsSync(path.join(cwd, c))) return c;
  }
  return "src/components/ui";
}

export function detectUtilsPath(cwd: string): string {
  const candidates = ["src/lib/utils.ts", "src/utils/cn.ts", "src/utils.ts", "lib/utils.ts"];
  for (const c of candidates) {
    if (fs.existsSync(path.join(cwd, c))) return c.replace(/\.ts$/, "");
  }
  return "src/lib/utils";
}

export function isPackageInstalled(pkg: string, cwd: string): boolean {
  try {
    const pkgJson = readPackageJson(cwd);
    if (!pkgJson) return false;
    const all = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
    return pkg in all;
  } catch {
    return false;
  }
}

export function getInstallCommand(pm: PackageManager, packages: string[]): string {
  const list = packages.join(" ");
  switch (pm) {
    case "pnpm":
      return `pnpm add ${list}`;
    case "bun":
      return `bun add ${list}`;
    case "yarn":
      return `yarn add ${list}`;
    default:
      return `npm install ${list}`;
  }
}

function readPackageJson(cwd: string): Record<string, any> | null {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) return null;
  try {
    return fs.readJsonSync(pkgPath);
  } catch {
    return null;
  }
}
