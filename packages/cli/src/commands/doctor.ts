import path from "node:path";

import * as p from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";

import { readConfig } from "../utils/config.js";
import { isPackageInstalled, detectPackageManager } from "../utils/detector.js";
import { fetchIndex } from "../utils/registry.js";

interface CheckResult {
  label: string;
  status: "ok" | "warn" | "error";
  detail?: string;
}

function ok(label: string, detail?: string): CheckResult {
  return { label, status: "ok", detail };
}
function warn(label: string, detail?: string): CheckResult {
  return { label, status: "warn", detail };
}
function err(label: string, detail?: string): CheckResult {
  return { label, status: "error", detail };
}

export async function runDoctor(cwd: string) {
  console.log("");
  p.intro(pc.bold(pc.cyan("  Kikito CN  ") + " — doctor"));

  const results: CheckResult[] = [];

  // ── 1. Config exists ─────────────────────────────────────────────────────
  const config = readConfig(cwd);
  if (!config) {
    results.push(err("kikitocn.json", `Not found. Run ${pc.cyan("npx kikitocn init")}`));
  } else {
    results.push(ok("kikitocn.json", `v${config.version}`));

    // ── 2. Components dir ──────────────────────────────────────────────────
    if (fs.existsSync(path.join(cwd, config.componentsDir))) {
      results.push(ok("componentsDir", config.componentsDir));
    } else {
      results.push(warn("componentsDir", `${config.componentsDir} does not exist yet — will be created on first add`));
    }

    // ── 3. Tokens CSS ─────────────────────────────────────────────────────
    const tokensPath = path.join(cwd, "src", "styles", "kikitocn-tokens.css");
    if (fs.existsSync(tokensPath)) {
      results.push(ok("kikitocn-tokens.css", "src/styles/kikitocn-tokens.css"));
    } else {
      results.push(warn("kikitocn-tokens.css", `Not found — run ${pc.cyan("npx kikitocn init")} to download`));
    }

    // ── 4. Token @import in CSS ────────────────────────────────────────────
    const cssPath = path.join(cwd, config.tailwind.css);
    if (fs.existsSync(cssPath)) {
      const content = fs.readFileSync(cssPath, "utf-8");
      if (content.includes("kikitocn-tokens.css")) {
        results.push(ok("@import tokens", `Found in ${config.tailwind.css}`));
      } else {
        results.push(warn("@import tokens", `Missing in ${config.tailwind.css} — run npx kikitocn init`));
      }
    } else {
      results.push(warn("Global CSS", `${config.tailwind.css} not found`));
    }

    // ── 5. Peer deps ──────────────────────────────────────────────────────
    for (const pkg of ["clsx", "tailwind-merge"]) {
      if (isPackageInstalled(pkg, cwd)) {
        results.push(ok(`dep:${pkg}`, "installed"));
      } else {
        const pm = detectPackageManager(cwd);
        results.push(warn(`dep:${pkg}`, `Not installed — run: ${pm} add ${pkg}`));
      }
    }

    // ── 6. motion installed ────────────────────────────────────────────────
    if (isPackageInstalled("motion", cwd)) {
      results.push(ok("dep:motion", "installed"));
    } else {
      results.push(warn("dep:motion", "Not installed (required for animated components)"));
    }

    // ── 7. Registry reachable ─────────────────────────────────────────────
    const s = p.spinner();
    s.start("Checking registry");
    try {
      const index = await fetchIndex(config.registry);
      s.stop();
      results.push(ok("Registry", `${index.items.length} components available`));
    } catch {
      s.stop();
      results.push(err("Registry", `Cannot reach ${config.registry}`));
    }
  }

  // ── Print results ─────────────────────────────────────────────────────────
  console.log("");
  let hasErrors = false;
  let hasWarns = false;

  for (const r of results) {
    const icon = r.status === "ok" ? pc.green("✓") : r.status === "warn" ? pc.yellow("⚠") : pc.red("✗");

    const label = r.status === "error" ? pc.red(r.label) : r.status === "warn" ? pc.yellow(r.label) : r.label;
    const detail = r.detail ? pc.dim(` — ${r.detail}`) : "";

    console.log(`  ${icon}  ${label}${detail}`);

    if (r.status === "error") hasErrors = true;
    if (r.status === "warn") hasWarns = true;
  }

  console.log("");

  if (hasErrors) {
    p.outro(pc.red("Issues found. Fix errors above and re-run doctor."));
  } else if (hasWarns) {
    p.outro(pc.yellow("Setup has warnings — components may not work correctly."));
  } else {
    p.outro(pc.green("All good! Ready to install components."));
  }
}
