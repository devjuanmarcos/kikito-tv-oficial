import { z } from "zod";

export const REGISTRY_BASE = "https://raw.githubusercontent.com/devjuanmarcos/kikito-tv-oficial/main/registry";

// ── Schemas ──────────────────────────────────────────────────────────────────

export const RegistryFileSchema = z.object({
  path: z.string(),
  type: z.string(),
  target: z.string(),
  content: z.string().optional(),
});

export const ComponentEntrySchema = z.object({
  name: z.string(),
  version: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  group: z.string(),
  status: z.string(),
  dependencies: z.array(z.string()).default([]),
  registryDependencies: z.array(z.string()).default([]),
  files: z.array(RegistryFileSchema).default([]),
  tailwind: z.object({ requires: z.array(z.string()) }).optional(),
  docs: z.string().optional(),
});

export const RegistryIndexSchema = z.object({
  name: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      version: z.string(),
      title: z.string(),
      type: z.string(),
      description: z.string(),
      group: z.string(),
      status: z.string(),
      dependencies: z.array(z.string()).default([]),
      registryDependencies: z.array(z.string()).default([]),
    })
  ),
});

export type RegistryFile = z.infer<typeof RegistryFileSchema>;
export type ComponentEntry = z.infer<typeof ComponentEntrySchema>;
export type RegistryIndex = z.infer<typeof RegistryIndexSchema>;

// ── Cache ─────────────────────────────────────────────────────────────────────

const cache = new Map<string, unknown>();

async function fetchJson<T>(url: string, schema: z.ZodType<T>): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;

  const res = await fetch(url, {
    headers: { "User-Agent": "kikitocn-cli/1.0" },
  });

  if (!res.ok) {
    throw new Error(`Registry fetch failed: ${res.status} ${url}`);
  }

  const json = await res.json();
  const parsed = schema.parse(json);
  cache.set(url, parsed);
  return parsed;
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchIndex(registryBase: string): Promise<RegistryIndex> {
  return fetchJson(`${registryBase}/registry.json`, RegistryIndexSchema);
}

export async function fetchComponent(name: string, registryBase: string): Promise<ComponentEntry> {
  return fetchJson(`${registryBase}/r/${name}.json`, ComponentEntrySchema);
}

export async function fetchTokensCSS(registryBase: string): Promise<string> {
  const url = `${registryBase}/tokens/kikitocn-tokens.css`;
  if (cache.has(url)) return cache.get(url) as string;

  const res = await fetch(url, {
    headers: { "User-Agent": "kikitocn-cli/1.0" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tokens CSS: ${res.status}`);
  }

  const text = await res.text();
  cache.set(url, text);
  return text;
}

export function groupByCategory(items: RegistryIndex["items"]) {
  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const g = item.group ?? "other";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(item);
  }
  return groups;
}
