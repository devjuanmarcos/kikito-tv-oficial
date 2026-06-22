import * as p from "@clack/prompts";
import pc from "picocolors";

import { readConfig } from "../utils/config.js";
import { detectPackageManager } from "../utils/detector.js";
import { resolveComponents, collectNpmDeps } from "../utils/resolver.js";
import { writeComponentFiles, installPackages } from "../utils/writer.js";

export async function runAdd(names: string[], cwd: string) {
  if (names.length === 0) {
    p.log.error("Specify at least one component. Example: npx kikitocn add button");
    process.exit(1);
  }

  // ── Read config ──────────────────────────────────────────────────────────
  const config = readConfig(cwd);
  if (!config) {
    p.log.error(`No ${pc.bold("kikitocn.json")} found. Run ${pc.cyan("npx kikitocn init")} first.`);
    process.exit(1);
  }

  const pm = detectPackageManager(cwd);

  console.log("");
  p.intro(pc.bold(pc.cyan("  Kikito CN  ") + ` add: ${names.join(", ")}`));

  // ── Resolve components + deps ────────────────────────────────────────────
  const s = p.spinner();
  s.start("Resolving components");

  let components;
  try {
    components = await resolveComponents(names, config.registry);
  } catch (err: any) {
    s.stop(pc.red("Failed"));
    p.log.error(err.message);
    process.exit(1);
  }

  s.stop(pc.green(`Resolved ${components.length} component(s)`));

  // ── Show install plan ────────────────────────────────────────────────────
  const npmDeps = collectNpmDeps(components);

  p.log.step(pc.bold("Install plan:"));
  for (const c of components) {
    const isTarget = names.includes(c.name);
    const label = isTarget ? pc.green(`  + ${c.title}`) : pc.dim(`  + ${c.title} (dependency)`);
    console.log(label);
  }

  if (npmDeps.length > 0) {
    console.log("");
    p.log.step(pc.bold("npm packages:"));
    for (const d of npmDeps) {
      console.log(pc.dim(`  + ${d}`));
    }
  }

  console.log("");
  const ok = await p.confirm({
    message: `Install ${components.length} component(s)?`,
    initialValue: true,
  });

  if (p.isCancel(ok) || !ok) {
    p.cancel("Cancelled.");
    return;
  }

  // ── Write files ──────────────────────────────────────────────────────────
  s.start("Copying files");
  const allWritten: string[] = [];

  for (const comp of components) {
    try {
      const written = writeComponentFiles(comp, config, cwd);
      allWritten.push(...written);
    } catch (err: any) {
      s.stop(pc.red(`Failed writing ${comp.name}`));
      p.log.error(err.message);
      process.exit(1);
    }
  }

  s.stop(pc.green(`Wrote ${allWritten.length} file(s)`));

  // ── Install npm deps ─────────────────────────────────────────────────────
  if (npmDeps.length > 0) {
    s.start(`Installing npm packages`);
    try {
      const installed = installPackages(npmDeps, pm, cwd);
      s.stop(
        installed.length > 0 ? pc.green(`Installed: ${installed.join(", ")}`) : pc.dim("All packages already installed")
      );
    } catch (err: any) {
      s.stop(pc.yellow("Install failed — run manually:"));
      p.log.warn(`  ${pm} add ${npmDeps.join(" ")}`);
    }
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  const targetComp = components.find((c) => names.includes(c.name)) ?? components[components.length - 1];
  const importPath = `${config.componentsDir}/cn/${targetComp.name}/${targetComp.files[0]?.path
    .split("/")
    .pop()
    ?.replace(/\.tsx$/, "")}`;

  p.outro(
    pc.bold(pc.green("Done!")) +
      `\n\n  Import with:\n  ${pc.cyan(`import { ${targetComp.title.replace(/ /g, "")} } from "@/${importPath}"`)}`
  );
}
