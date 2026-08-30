#!/usr/bin/env node
/**
 * build-registry.mjs
 * Scans src/components/ui/cn/ and generates:
 *   registry/registry.json  — component index
 *   registry/r/<name>.json  — per-component manifest with inline file content
 *   registry/tokens/kikitocn-tokens.css — copy of standalone token layer
 *
 * Run: node scripts/build-registry.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COMPONENT_META, SKIP_COMPONENTS, NPM_DEP_MAP } from "./registry-meta.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CN_DIR = path.join(ROOT, "src", "components", "ui", "cn");
const OUT_DIR = path.join(ROOT, "registry");
const TOKENS_SRC = path.join(ROOT, "src", "styles", "kikitocn-tokens.css");
const VERSION = "1.1.0";
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/devjuanmarcos/kikito-tv-oficial/main";

// ── Helpers ──────────────────────────────────────────────────────────────────

function toTitleCase(str) {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Read all .tsx and .ts files from a directory (non-recursive) */
function readComponentFiles(dir) {
  return fs.readdirSync(dir).filter((f) => /\.(tsx|ts)$/.test(f) && !f.endsWith(".d.ts"));
}

/**
 * Maps a shared internal lib import to its registry item name, or null.
 * Achado real (2026-08-29, ver docs/design-system-maintenance/00-FINDINGS.md):
 * "@/lib/utils"/"@/lib/motion" não batiam em nenhum dos outros baldes de
 * parseImports (não são pacote npm, não são @/components/ui/cn/*, não são
 * ../* relativo) e eram descartados em silêncio — nenhum registry:file era
 * gerado pra eles, então `npx kikitocn add` entregava um componente com um
 * import quebrado em 149/9 casos.
 */
function sharedLibDep(mod) {
  if (mod === "@/lib/utils") return "utils";
  if (mod === "@/lib/motion" || mod.startsWith("@/lib/motion/")) return "motion";
  if (mod === "@/lib/echarts" || mod.startsWith("@/lib/echarts/")) return "echarts";
  return null;
}

/**
 * Parse import statements from file content.
 * Returns { npmDeps: string[], registryDeps: string[] }
 */
function parseImports(content, componentName) {
  const importLines = content.match(/^import\s+.*?from\s+['"]([^'"]+)['"]/gm) || [];
  const npmDeps = new Set();
  const registryDeps = new Set();

  for (const line of importLines) {
    const match = line.match(/from\s+['"]([^'"]+)['"]/);
    if (!match) continue;
    const mod = match[1];

    // npm dep from known map
    for (const [pkg, dep] of Object.entries(NPM_DEP_MAP)) {
      if (mod === pkg || mod.startsWith(pkg + "/")) {
        npmDeps.add(dep);
      }
    }

    // Shared internal lib: "@/lib/utils" or "@/lib/motion" (see sharedLibDep below)
    const sharedLib = sharedLibDep(mod);
    if (sharedLib) registryDeps.add(sharedLib);

    // Internal CN dep: "@/components/ui/cn/<name>" or relative "../<name>"
    const cnAbsolute = mod.match(/^@\/components\/ui\/cn\/([^/'"]+)/);
    if (cnAbsolute) {
      const dep = cnAbsolute[1];
      if (dep !== componentName && !SKIP_COMPONENTS.has(dep)) {
        registryDeps.add(dep);
      }
    }

    // Relative import to sibling cn component: ../../button/Button or ../button
    const relCn = mod.match(/\.\.\/([^/'"]+)/);
    if (relCn) {
      const dep = relCn[1];
      if (dep !== componentName && fs.existsSync(path.join(CN_DIR, dep)) && !SKIP_COMPONENTS.has(dep)) {
        registryDeps.add(dep);
      }
    }
  }

  return { npmDeps: [...npmDeps], registryDeps: [...registryDeps] };
}

/** Build a single component entry */
function buildComponent(name) {
  const dir = path.join(CN_DIR, name);
  if (!fs.statSync(dir).isDirectory()) return null;
  if (SKIP_COMPONENTS.has(name)) return null;

  const meta = COMPONENT_META[name] ?? {
    title: toTitleCase(name),
    group: "display",
    description: `${toTitleCase(name)} component.`,
    status: "live",
  };

  const fileNames = readComponentFiles(dir);
  if (fileNames.length === 0) return null;

  const allNpmDeps = new Set();
  const allRegistryDeps = new Set();
  const files = [];

  for (const fileName of fileNames) {
    const filePath = path.join(dir, fileName);
    const content = fs.readFileSync(filePath, "utf-8");
    const relPath = `components/ui/cn/${name}/${fileName}`;

    const { npmDeps, registryDeps } = parseImports(content, name);
    npmDeps.forEach((d) => allNpmDeps.add(d));
    registryDeps.forEach((d) => allRegistryDeps.add(d));

    files.push({
      path: relPath,
      type: fileName.endsWith(".types.ts") || fileName === "index.ts" ? "registry:file" : "registry:component",
      target: `components/ui/cn/${name}/${fileName}`,
      content,
    });
  }

  return {
    name,
    version: VERSION,
    title: meta.title,
    type: "registry:component",
    description: meta.description,
    group: meta.group,
    status: meta.status,
    dependencies: [...allNpmDeps],
    registryDependencies: [...allRegistryDeps],
    tailwind: { requires: ["kikitocn-tokens"] },
    docs: `https://cn.kikito.tv/components/${name}`,
    files,
  };
}

/**
 * Build a shared-lib registry entry (utils.ts, motion/**) — these live outside
 * CN_DIR (src/lib/**, not src/components/ui/cn/**) so buildComponent() never
 * sees them. Ver docs/design-system-maintenance/registry-shared-libs/PLAN.md.
 */
function buildLib(name, { title, description, sourceDir, sourceFile }) {
  const files = [];

  if (sourceFile) {
    const content = fs.readFileSync(sourceFile, "utf-8");
    const fileName = path.basename(sourceFile);
    files.push({
      path: `lib/${fileName}`,
      type: "registry:lib",
      target: `lib/${fileName}`,
      content,
    });
  }

  if (sourceDir) {
    for (const fileName of fs.readdirSync(sourceDir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))) {
      const content = fs.readFileSync(path.join(sourceDir, fileName), "utf-8");
      files.push({
        path: `lib/${name}/${fileName}`,
        type: "registry:lib",
        target: `lib/${name}/${fileName}`,
        content,
      });
    }
  }

  return {
    name,
    version: VERSION,
    title,
    type: "registry:lib",
    description,
    group: "internal",
    status: "live",
    dependencies: name === "utils" ? ["clsx", "tailwind-merge"] : name === "echarts" ? ["echarts"] : [],
    registryDependencies: [],
    tailwind: { requires: [] },
    docs: `https://cn.kikito.tv/internal/${name}`,
    files,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  // Ensure output dirs exist
  fs.mkdirSync(path.join(OUT_DIR, "r"), { recursive: true });
  fs.mkdirSync(path.join(OUT_DIR, "tokens"), { recursive: true });

  const entries = fs.readdirSync(CN_DIR);
  const index = [];
  let built = 0;
  let skipped = 0;

  // Shared libs (utils.ts, motion/**) — outside CN_DIR, built separately.
  const LIB_DIR = path.join(ROOT, "src", "lib");
  const libs = [
    buildLib("utils", {
      title: "Utils",
      description: "Shared cn() class-merging helper (clsx + tailwind-merge).",
      sourceFile: path.join(LIB_DIR, "utils.ts"),
    }),
    buildLib("motion", {
      title: "Motion tokens",
      description: "Kikito CN animation token presets (durations, easings, variants, springs).",
      sourceDir: path.join(LIB_DIR, "motion"),
    }),
    buildLib("echarts", {
      title: "ECharts infrastructure",
      description: "Shared ECharts lifecycle, token bridge, responsive rendering and accessibility infrastructure.",
      sourceDir: path.join(LIB_DIR, "echarts"),
    }),
  ];
  for (const lib of libs) {
    fs.writeFileSync(path.join(OUT_DIR, "r", `${lib.name}.json`), JSON.stringify(lib, null, 2), "utf-8");
    index.push({
      name: lib.name,
      version: lib.version,
      title: lib.title,
      type: lib.type,
      description: lib.description,
      group: lib.group,
      status: lib.status,
      dependencies: lib.dependencies,
      registryDependencies: lib.registryDependencies,
    });
    console.log(`  built ${lib.name} (lib, ${lib.files.length} files)`);
    built++;
  }

  for (const name of entries) {
    // skip non-dirs and special files
    const full = path.join(CN_DIR, name);
    if (!fs.statSync(full).isDirectory()) { skipped++; continue; }
    if (SKIP_COMPONENTS.has(name)) { console.log(`  skip  ${name}`); skipped++; continue; }

    try {
      const comp = buildComponent(name);
      if (!comp) { skipped++; continue; }

      // Write per-component JSON (with inline content)
      const outFile = path.join(OUT_DIR, "r", `${name}.json`);
      fs.writeFileSync(outFile, JSON.stringify(comp, null, 2), "utf-8");

      // Index entry (no file content — lighter)
      index.push({
        name: comp.name,
        version: comp.version,
        title: comp.title,
        type: comp.type,
        description: comp.description,
        group: comp.group,
        status: comp.status,
        dependencies: comp.dependencies,
        registryDependencies: comp.registryDependencies,
      });

      console.log(`  built ${name} (deps: [${comp.dependencies.join(", ")}], registryDeps: [${comp.registryDependencies.join(", ")}])`);
      built++;
    } catch (err) {
      console.error(`  ERROR ${name}:`, err.message);
      skipped++;
    }
  }

  // Write registry index
  const registryJson = {
    $schema: "https://kikitocn.com/schema/registry.json",
    name: "kikitocn",
    homepage: "https://cn.kikito.tv",
    rawBase: `${GITHUB_RAW_BASE}/registry`,
    generatedAt: new Date().toISOString(),
    items: index,
  };
  fs.writeFileSync(path.join(OUT_DIR, "registry.json"), JSON.stringify(registryJson, null, 2), "utf-8");

  // Copy tokens file
  if (fs.existsSync(TOKENS_SRC)) {
    fs.copyFileSync(TOKENS_SRC, path.join(OUT_DIR, "tokens", "kikitocn-tokens.css"));
    console.log(`  copied kikitocn-tokens.css`);
  }

  console.log(`\n✓ Built ${built} components, skipped ${skipped}`);
  console.log(`  registry/registry.json — index`);
  console.log(`  registry/r/ — ${built} component JSONs`);
  console.log(`  registry/tokens/kikitocn-tokens.css`);
}

main();
