import path from "node:path";

import fs from "fs-extra";
import { z } from "zod";

export const CONFIG_FILE = "kikitocn.json";

export const ConfigSchema = z.object({
  version: z.literal("1"),
  componentsDir: z.string().default("src/components/ui"),
  utils: z.string().default("src/lib/utils"),
  tailwind: z.object({
    css: z.string().default("src/app/globals.css"),
  }),
  registry: z.string().default("https://raw.githubusercontent.com/devjuanmarcos/kikito-tv-oficial/main/registry"),
});

export type KikitoCNConfig = z.infer<typeof ConfigSchema>;

export const DEFAULT_CONFIG: KikitoCNConfig = {
  version: "1",
  componentsDir: "src/components/ui",
  utils: "src/lib/utils",
  tailwind: {
    css: "src/app/globals.css",
  },
  registry: "https://raw.githubusercontent.com/devjuanmarcos/kikito-tv-oficial/main/registry",
};

export function findConfigPath(cwd: string): string | null {
  const direct = path.join(cwd, CONFIG_FILE);
  if (fs.existsSync(direct)) return direct;
  return null;
}

export function readConfig(cwd: string): KikitoCNConfig | null {
  const configPath = findConfigPath(cwd);
  if (!configPath) return null;

  try {
    const raw = fs.readJsonSync(configPath);
    return ConfigSchema.parse(raw);
  } catch {
    return null;
  }
}

export function writeConfig(cwd: string, config: KikitoCNConfig): void {
  const configPath = path.join(cwd, CONFIG_FILE);
  fs.writeJsonSync(configPath, config, { spaces: 2 });
}
