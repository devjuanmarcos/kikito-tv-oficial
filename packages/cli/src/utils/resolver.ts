import { fetchComponent } from "./registry.js";
import type { ComponentEntry } from "./registry.js";

/**
 * Recursively resolves a component and all its registryDependencies.
 * Returns the full set in install order (deps first).
 */
export async function resolveComponents(
  names: string[],
  registryBase: string,
  installed: Set<string> = new Set()
): Promise<ComponentEntry[]> {
  const result: ComponentEntry[] = [];
  const seen = new Set<string>(installed);

  async function resolve(name: string) {
    if (seen.has(name)) return;
    seen.add(name);

    const comp = await fetchComponent(name, registryBase);

    // Resolve deps first (depth-first)
    for (const dep of comp.registryDependencies) {
      await resolve(dep);
    }

    result.push(comp);
  }

  for (const name of names) {
    await resolve(name);
  }

  return result;
}

/** Collect all npm deps from a list of components, deduped */
export function collectNpmDeps(components: ComponentEntry[]): string[] {
  const deps = new Set<string>();
  for (const c of components) {
    for (const d of c.dependencies) {
      deps.add(d);
    }
  }
  return [...deps];
}
