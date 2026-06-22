import { execSync } from "node:child_process";
import path from "node:path";

import fs from "fs-extra";

import type { KikitoCNConfig } from "./config.js";
import type { PackageManager } from "./detector.js";
import { getInstallCommand, isPackageInstalled } from "./detector.js";
import type { ComponentEntry } from "./registry.js";

/** Write all files from a component to the project */
export function writeComponentFiles(component: ComponentEntry, config: KikitoCNConfig, cwd: string): string[] {
  const written: string[] = [];

  for (const file of component.files) {
    if (!file.content) continue;

    // Map registry path → project path
    // registry path: "components/ui/cn/button/Button.tsx"
    // target in config: "src/components/ui" → "src/components/ui/cn/button/Button.tsx"
    const relativePart = file.target.replace(/^components\/ui\//, "");
    const destPath = path.join(cwd, config.componentsDir, relativePart);

    fs.ensureDirSync(path.dirname(destPath));
    fs.writeFileSync(destPath, file.content, "utf-8");
    written.push(path.relative(cwd, destPath));
  }

  return written;
}

/** Copy the kikitocn-tokens.css to the project's styles dir */
export function writeTokensFile(cssContent: string, cwd: string): string {
  const stylesDir = path.join(cwd, "src", "styles");
  fs.ensureDirSync(stylesDir);
  const dest = path.join(stylesDir, "kikitocn-tokens.css");
  fs.writeFileSync(dest, cssContent, "utf-8");
  return path.relative(cwd, dest);
}

/** Inject @import of tokens into user's global CSS */
export function injectTokensImport(cssPath: string, cwd: string): boolean {
  const fullPath = path.join(cwd, cssPath);
  if (!fs.existsSync(fullPath)) return false;

  const content = fs.readFileSync(fullPath, "utf-8");
  const importLine = `@import "./styles/kikitocn-tokens.css";`;

  if (content.includes("kikitocn-tokens.css")) return false; // already imported

  // Insert after first @import or @config line
  const lines = content.split("\n");
  const insertAfter = lines.findLastIndex((l) => l.trim().startsWith("@import") || l.trim().startsWith("@config"));

  if (insertAfter >= 0) {
    lines.splice(insertAfter + 1, 0, importLine);
  } else {
    lines.unshift(importLine);
  }

  fs.writeFileSync(fullPath, lines.join("\n"), "utf-8");
  return true;
}

/** Write utils.ts with cn() if it doesn't exist */
export function ensureUtils(config: KikitoCNConfig, cwd: string): boolean {
  const utilsPath = path.join(cwd, `${config.utils}.ts`);
  if (fs.existsSync(utilsPath)) return false;

  fs.ensureDirSync(path.dirname(utilsPath));
  fs.writeFileSync(
    utilsPath,
    `import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n`,
    "utf-8"
  );
  return true;
}

/** Install npm packages that aren't already installed */
export function installPackages(packages: string[], pm: PackageManager, cwd: string): string[] {
  const missing = packages.filter((p) => !isPackageInstalled(p, cwd));
  if (missing.length === 0) return [];

  const cmd = getInstallCommand(pm, missing);
  execSync(cmd, { cwd, stdio: "pipe" });
  return missing;
}
