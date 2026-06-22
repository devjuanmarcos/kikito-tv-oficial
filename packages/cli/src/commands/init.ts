import path from "node:path";

import * as p from "@clack/prompts";
import pc from "picocolors";

import { DEFAULT_CONFIG, writeConfig, readConfig } from "../utils/config.js";
import {
  detectFramework,
  detectPackageManager,
  detectGlobalsCSS,
  detectComponentsDir,
  detectUtilsPath,
} from "../utils/detector.js";
import { fetchTokensCSS } from "../utils/registry.js";
import { writeTokensFile, injectTokensImport, ensureUtils, installPackages } from "../utils/writer.js";

export async function runInit(cwd: string) {
  const existing = readConfig(cwd);

  console.log("");
  p.intro(pc.bold(pc.cyan("  Kikito CN  ") + " — component library setup"));

  if (existing) {
    const overwrite = await p.confirm({
      message: pc.yellow("kikitocn.json already exists. Overwrite?"),
      initialValue: false,
    });
    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel("Setup cancelled.");
      return;
    }
  }

  // ── Auto-detect defaults ─────────────────────────────────────────────────
  const framework = detectFramework(cwd);
  const detectedPm = detectPackageManager(cwd);
  const detectedCss = detectGlobalsCSS(cwd, framework);
  const detectedComps = detectComponentsDir(cwd);
  const detectedUtils = detectUtilsPath(cwd);

  // ── Interactive questions ─────────────────────────────────────────────────
  const answers = await p.group(
    {
      componentsDir: () =>
        p.text({
          message: "Where should components be installed?",
          placeholder: detectedComps,
          defaultValue: detectedComps,
        }),

      utils: () =>
        p.text({
          message: "Path to your utils file (without extension)?",
          placeholder: detectedUtils,
          defaultValue: detectedUtils,
        }),

      css: () =>
        p.text({
          message: "Global CSS file (for token @import)?",
          placeholder: detectedCss,
          defaultValue: detectedCss,
        }),

      pm: () =>
        p.select({
          message: "Package manager?",
          options: [
            { value: "pnpm", label: "pnpm" },
            { value: "bun", label: "bun" },
            { value: "yarn", label: "yarn" },
            { value: "npm", label: "npm" },
          ],
          initialValue: detectedPm,
        }),

      registry: () =>
        p.text({
          message: "Registry URL? (leave default for official)",
          placeholder: DEFAULT_CONFIG.registry,
          defaultValue: DEFAULT_CONFIG.registry,
        }),
    },
    {
      onCancel: () => {
        p.cancel("Setup cancelled.");
        process.exit(0);
      },
    }
  );

  const config = {
    version: "1" as const,
    componentsDir: answers.componentsDir as string,
    utils: answers.utils as string,
    tailwind: { css: answers.css as string },
    registry: answers.registry as string,
  };

  // ── Write config ─────────────────────────────────────────────────────────
  const s = p.spinner();

  s.start("Writing kikitocn.json");
  writeConfig(cwd, config);
  s.stop(pc.green("kikitocn.json created"));

  // ── Fetch & copy tokens ──────────────────────────────────────────────────
  s.start("Fetching kikitocn-tokens.css");
  try {
    const css = await fetchTokensCSS(config.registry);
    const written = writeTokensFile(css, cwd);
    s.stop(pc.green(`Tokens → ${written}`));

    // Inject @import into user's global CSS
    const injected = injectTokensImport(config.tailwind.css, cwd);
    if (injected) {
      p.log.success(pc.green(`@import injected into ${config.tailwind.css}`));
    } else {
      p.log.info(`Tokens already imported in ${config.tailwind.css} — skipped`);
    }
  } catch (err) {
    s.stop(pc.yellow("Could not fetch tokens (offline?) — skipping"));
    p.log.warn("Run `npx kikitocn sync-tokens` when you're online.");
  }

  // ── Ensure utils ─────────────────────────────────────────────────────────
  const created = ensureUtils(config, cwd);
  if (created) {
    p.log.success(pc.green(`Created ${config.utils}.ts with cn()`));
  }

  // ── Install peer deps ────────────────────────────────────────────────────
  s.start("Installing peer dependencies (clsx, tailwind-merge)");
  try {
    const installed = installPackages(["clsx", "tailwind-merge"], answers.pm as any, cwd);
    s.stop(
      installed.length > 0
        ? pc.green(`Installed: ${installed.join(", ")}`)
        : pc.dim("clsx + tailwind-merge already installed")
    );
  } catch {
    s.stop(pc.yellow("Could not install deps — run manually:"));
    p.log.warn(`  ${answers.pm} add clsx tailwind-merge`);
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  p.outro(
    pc.bold(pc.green("Done!")) +
      `\n\n  Add your first component:\n  ${pc.cyan("npx kikitocn add button")}\n\n  See all components:\n  ${pc.cyan("npx kikitocn list")}`
  );
}
