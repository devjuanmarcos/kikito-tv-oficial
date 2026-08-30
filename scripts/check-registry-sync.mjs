#!/usr/bin/env node
/**
 * check-registry-sync.mjs
 *
 * cn-registry.tsx (site de docs, curado, fonte da verdade de `group`) e
 * registry-meta.mjs (pacote CLI publicado, mantido a mao) sao dois arquivos
 * de metadado INDEPENDENTES pro mesmo conjunto de componentes. Nada os
 * mantinha em sincronia — achado real em 2026-08-30 (auditoria de
 * organizacao da sidebar): 10 componentes inteiros faltando em
 * COMPONENT_META (caiam num fallback silencioso group:"display" +
 * descricao generica) e 68 componentes com `group` divergente entre os
 * dois arquivos (incluindo 2 valores — "navigation"/"overlay" — que nem
 * existem como grupo real no site, deveriam ser "layout"/"inputs"/"display"/
 * "overlays" conforme o caso).
 *
 * Este script e chamado por build-registry.mjs antes de gerar qualquer
 * saida — falha (exit 1) se achar drift, pra nunca mais publicar dado
 * incorreto silenciosamente. Rodar isolado: `node scripts/check-registry-sync.mjs`.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { COMPONENT_META, SKIP_COMPONENTS } from "./registry-meta.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CN_DIR = path.join(ROOT, "src", "components", "ui", "cn");
const CN_REGISTRY_PATH = path.join(ROOT, "src", "lib", "cn-registry.tsx");

function readCnRegistrySource() {
  return fs.readFileSync(CN_REGISTRY_PATH, "utf-8");
}

/** grupos validos: os `id` declarados em CN_GROUPS no cn-registry.tsx */
function extractValidGroups(src) {
  const block = src.match(/export const CN_GROUPS[\s\S]*?\];/);
  if (!block) throw new Error("Nao achei CN_GROUPS em cn-registry.tsx — mudou de formato?");
  return new Set([...block[0].matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]));
}

/** name -> group, so a PRIMEIRA ocorrencia de cada `name:` (entrada top-level de CN_REGISTRY) */
function extractNameToGroup(src) {
  const nameHits = [...src.matchAll(/name:\s*"([^"]+)"/g)];
  const map = new Map();
  for (let i = 0; i < nameHits.length; i++) {
    const start = nameHits[i].index;
    const end = i + 1 < nameHits.length ? nameHits[i + 1].index : src.length;
    // janela curta: so os campos da propria entrada (name/title/group ficam
    // sempre nas primeiras linhas de cada objeto, bem antes do proximo `name:`)
    const chunk = src.slice(start, Math.min(end, start + 600));
    const groupMatch = chunk.match(/group:\s*"([^"]+)"/);
    const name = nameHits[i][1];
    if (groupMatch && !map.has(name)) map.set(name, groupMatch[1]);
  }
  return map;
}

export function checkRegistrySync() {
  const errors = [];

  const src = readCnRegistrySource();
  const validGroups = extractValidGroups(src);
  const cnRegistryGroups = extractNameToGroup(src);

  const dirs = fs
    .readdirSync(CN_DIR)
    .filter((f) => fs.statSync(path.join(CN_DIR, f)).isDirectory());

  // 1) todo diretorio real precisa estar em COMPONENT_META ou SKIP_COMPONENTS
  for (const dir of dirs) {
    if (!COMPONENT_META[dir] && !SKIP_COMPONENTS.has(dir)) {
      errors.push(
        `[registry-meta.mjs] "${dir}" tem pasta em src/components/ui/cn/ mas nao esta em ` +
          `COMPONENT_META nem em SKIP_COMPONENTS — vai cair no fallback generico ` +
          `group:"display" + descricao placeholder.`
      );
    }
  }

  // 2) todo `group` de COMPONENT_META precisa ser um id valido de CN_GROUPS
  for (const [name, meta] of Object.entries(COMPONENT_META)) {
    if (!validGroups.has(meta.group)) {
      errors.push(
        `[registry-meta.mjs] "${name}" tem group:"${meta.group}", que nao existe em ` +
          `CN_GROUPS (validos: ${[...validGroups].join(", ")}).`
      );
    }
  }

  // 3) pra todo nome presente nos dois arquivos, o `group` precisa bater
  for (const [name, meta] of Object.entries(COMPONENT_META)) {
    const truth = cnRegistryGroups.get(name);
    if (truth && truth !== meta.group) {
      errors.push(
        `[registry-meta.mjs] "${name}" tem group:"${meta.group}", mas cn-registry.tsx ` +
          `(fonte curada do site) diz group:"${truth}".`
      );
    }
  }

  return errors;
}

// Executa direto se chamado via `node scripts/check-registry-sync.mjs`
const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMainModule) {
  const errors = checkRegistrySync();
  if (errors.length > 0) {
    console.error(`✖ ${errors.length} problema(s) de sincronia entre cn-registry.tsx e registry-meta.mjs:\n`);
    errors.forEach((e) => console.error(" ", e));
    process.exit(1);
  }
  console.log("✓ cn-registry.tsx e registry-meta.mjs sincronizados (0 problemas).");
}
