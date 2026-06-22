import * as p from "@clack/prompts";
import pc from "picocolors";

import { readConfig } from "../utils/config.js";
import { fetchIndex, groupByCategory } from "../utils/registry.js";
import { REGISTRY_BASE } from "../utils/registry.js";

export async function runList(cwd: string, options: { group?: string } = {}) {
  const config = readConfig(cwd);
  const registryBase = config?.registry ?? REGISTRY_BASE;

  console.log("");
  p.intro(pc.bold(pc.cyan("  Kikito CN  ") + " — available components"));

  const s = p.spinner();
  s.start("Fetching registry");

  let index;
  try {
    index = await fetchIndex(registryBase);
  } catch (err: any) {
    s.stop(pc.red("Failed to fetch registry"));
    p.log.error(err.message);
    process.exit(1);
  }

  s.stop(pc.green(`${index.items.length} components available`));
  console.log("");

  const liveItems = index.items.filter((i) => i.status === "live");
  const byGroup = groupByCategory(options.group ? liveItems.filter((i) => i.group === options.group) : liveItems);

  const GROUP_ORDER = ["inputs", "display", "overlay", "navigation", "data", "charts", "feedback", "layout"];
  const orderedGroups = [
    ...GROUP_ORDER.filter((g) => byGroup.has(g)),
    ...[...byGroup.keys()].filter((g) => !GROUP_ORDER.includes(g)),
  ];

  for (const group of orderedGroups) {
    const items = byGroup.get(group)!;
    console.log(pc.bold(pc.yellow(`  ${group.toUpperCase()}`)));

    for (const item of items) {
      const deps = item.dependencies.length > 0 ? pc.dim(` [${item.dependencies.join(", ")}]`) : "";
      const regDeps =
        item.registryDependencies.length > 0 ? pc.dim(` needs: ${item.registryDependencies.join(", ")}`) : "";

      console.log(
        `  ${pc.green("○")} ${pc.white(item.name.padEnd(28))} ${pc.dim("v" + item.version.padEnd(7))} ${item.title}${deps}${regDeps}`
      );
    }

    console.log("");
  }

  const totalDeps = new Set(liveItems.flatMap((i) => i.dependencies));
  console.log(pc.dim(`  ${liveItems.length} components · npm deps: ${[...totalDeps].join(", ")}`));
  console.log("");
  console.log(`  Install:  ${pc.cyan("npx kikitocn add <component>")}`);
  console.log(`  Docs:     ${pc.cyan("https://cn.kikito.tv/components")}`);
  console.log("");
}
