# Plano — empacotar `@/lib/utils` e `@/lib/motion` no registry publicado

**✅ Implementado e testado end-to-end em 2026-08-29** (mesmo dia do levantamento). Ver [`../00-FINDINGS.md`](../00-FINDINGS.md) pro levantamento completo (causa raiz, escala do problema — 149/9 componentes afetados, código exato responsável).

**Correção sobre a previsão original**: a seção "Não muda" abaixo previa que `packages/cli/src/utils/writer.ts` não precisaria de nenhuma alteração — **isso estava errado**, achado só ao rodar o teste end-to-end real (passo 4). `writeComponentFiles()` mapeava todo `file.target` assumindo que começava com `"components/ui/"`; os novos arquivos `"lib/..."` caíam em `<componentsDir>/lib/...` (ex. `src/components/ui/lib/utils.ts`) em vez de `src/lib/...`. Corrigido com um caso especial pra `target` começando com `"lib/"`, usando `path.dirname(config.utils)` como raiz. Fica registrado aqui como lição: **testar end-to-end de verdade importa mesmo quando a análise estática parece completa** — o teste do passo 4 pegou isso, uma leitura de código sozinha não teria.

## Objetivo

Depois desta mudança, `npx kikitocn add <qualquer-um-dos-149-componentes-que-usa-cn()>` deve entregar um projeto que **compila de verdade**, sem exigir que o consumidor crie `src/lib/utils.ts`/`src/lib/motion/**` manualmente.

## Escopo — o que muda e o que não muda

**Muda:**

- `scripts/build-registry.mjs` — nova função pra gerar itens `registry:lib` a partir de `src/lib/utils.ts` e `src/lib/motion/**`.
- `scripts/build-registry.mjs` `parseImports()` — reconhecer `@/lib/utils` e `@/lib/motion` como uma 4ª categoria de dependência (lib compartilhada), não descartar mais.
- `registry/r/utils.json` e `registry/r/motion.json` — novos arquivos gerados.
- Todo `registry/r/<nome>.json` cujo componente-fonte importa `@/lib/utils`/`@/lib/motion` — ganha a entrada correspondente em `registryDependencies` (efeito colateral automático do fix, não uma edição manual).

**Não muda (confirmado no levantamento, zero risco aqui):**

- `packages/cli/src/utils/resolver.ts` — `resolveComponents()` já resolve `registryDependencies` recursivamente e não olha pro campo `type` do item; funciona pra um item `registry:lib` sem nenhuma alteração.
- `packages/cli/src/utils/writer.ts` — `writeComponentFiles()` já escreve qualquer `files[]` que o item declarar, tipo-agnóstico também.
- Nenhum componente `.tsx` precisa ser tocado — os imports `@/lib/utils`/`@/lib/motion` já estão corretos no código-fonte, só faltava o registry _saber_ disso.

## Passo a passo

### 1. Gerar os itens `registry:lib`

Em `scripts/build-registry.mjs`, adicionar uma função irmã de `buildComponent()`:

```js
/** Build a shared-lib registry entry (utils.ts, motion/**) — not scanned from CN_DIR */
function buildLib(name, { title, description, sourceDir, sourceFile }) {
  const files = [];

  if (sourceFile) {
    // caso utils.ts: um arquivo só, na raiz de src/lib/
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
    // caso motion/: todos os .ts da pasta
    for (const fileName of fs.readdirSync(sourceDir).filter((f) => f.endsWith(".ts"))) {
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
    dependencies: name === "utils" ? ["clsx", "tailwind-merge"] : [],
    registryDependencies: [],
    tailwind: { requires: [] },
    docs: `https://cn.kikito.tv/internal/${name}`,
    files,
  };
}
```

Chamar isso no `main()`, antes do loop de componentes:

```js
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
}
```

**Cuidado**: `clsx`/`tailwind-merge` como `dependencies` do item `utils` — confirmar que já estão em `NPM_DEP_MAP` ou no `package.json` de qualquer projeto shadcn-like (quase sempre estão, mas declarar explícito aqui evita depender de sorte).

### 2. Ensinar `parseImports` a reconhecer as duas libs

No loop de `importLines` dentro de `parseImports()`, adicionar antes do fallthrough silencioso:

```js
if (mod === "@/lib/utils") registryDeps.add("utils");
if (mod === "@/lib/motion" || mod.startsWith("@/lib/motion/")) registryDeps.add("motion");
```

Colocar isso **antes** do bloco de "Internal CN dep" (ordem não importa aqui já que os padrões de regex não se sobrepõem, mas por clareza).

### 3. Rodar `npm run registry:build` e conferir

- `registry/r/utils.json` e `registry/r/motion.json` devem existir, `type: "registry:lib"`.
- Escolher 1 componente de cada grupo pra conferir manualmente:
  - Um componente comum (ex. `button.json`) → `registryDependencies` deve incluir `"utils"`.
  - Um dos 9 componentes com motion (ex. `modal.json`) → `registryDependencies` deve incluir `"utils"` **e** `"motion"`.
  - Um componente sem nenhuma das duas libs (raro, mas confirmar que existe pelo menos 1 caso pra provar que o parser não está marcando tudo por engano).

### 4. Teste end-to-end local (sem precisar publicar o pacote CLI)

O CLI já está neste repo (`packages/cli`) — dá pra testar o fluxo completo sem publicar nada:

1. `cd packages/cli && npm run build` (ou o script equivalente do `package.json` de lá).
2. Criar uma pasta de teste vazia fora do repo (ex. `%TEMP%\kikitocn-install-test`), com um `kikitocn.json` mínimo apontando `registry` pro caminho local do `registry/registry.json` deste repo (`file://` ou um servidor estático local — `npx serve registry` resolve rápido).
3. Rodar o binário local do CLI (`node packages/cli/dist/index.js add modal --cwd <pasta-de-teste>`).
4. Confirmar que a pasta de teste ganhou `src/lib/utils.ts`, `src/lib/motion/*.ts` **e** `src/components/ui/cn/modal/Modal.tsx`, todos os 3 sem intervenção manual.
5. Rodar `tsc --noEmit` (ou só abrir o arquivo num editor) na pasta de teste pra confirmar que os imports resolvem.

Esse passo é o que realmente prova a correção — os passos 1-3 provam que o registry ficou certo, mas só o passo 4 prova que o CLI publicado (mesmo código, sem mudança nenhuma) consegue usar isso corretamente.

### 5. (separado, menor) — alinhar `registry-meta.mjs` com `cn-registry.tsx`

Achado extra do levantamento, não bloqueia o fix principal: componentes novos adicionados só em `src/lib/cn-registry.tsx` (fonte real da UI) não têm entrada em `scripts/registry-meta.mjs` (fonte do build do registry publicado) — caem no fallback genérico. Duas opções, escolher uma quando for mexer nisso:

- (a) Fazer `build-registry.mjs` importar título/descrição/grupo direto de `cn-registry.tsx` em vez de manter `COMPONENT_META` duplicado (elimina a duplicação de vez, mas exige que `cn-registry.tsx` seja importável fora do Next.js/React — hoje é um arquivo `.tsx`, precisa checar se tem JSX que quebraria um import Node puro).
- (b) Manter os dois arquivos, mas adicionar um script de lint/CI que falha se um nome existir em um e não no outro (mais barato de implementar, não resolve a duplicação, só evita que ela drifte silenciosamente de novo).

Não incluído nesta rodada de correção porque é ortogonal ao problema de `utils`/`motion` — registrado aqui pra não se perder.

## Critério de aceite

- [x] `registry/r/utils.json` e `registry/r/motion.json` existem, `type: "registry:lib"`.
- [x] Os componentes que importam `@/lib/utils` têm `"utils"` em `registryDependencies` (confirmado: `button.json` → `["utils"]`).
- [x] Os componentes que importam `@/lib/motion` têm `"utils"` e `"motion"` em `registryDependencies` (confirmado: `modal.json` → `["button", "motion", "utils"]`).
- [x] Teste end-to-end local (passo 4) confirma que `npx kikitocn add modal` (via script direto chamando `resolveComponents`+`writeComponentFiles`, contornando o prompt interativo que não roda num shell sem TTY) entrega um projeto que resolve todos os imports sem edição manual — `Modal.tsx` instalado com `@/lib/motion`/`@/lib/utils` apontando pra `src/lib/motion/**`/`src/lib/utils.ts`, ambos escritos corretamente. Achado real nesse passo: precisou de um fix extra em `writer.ts` (ver nota no topo deste documento).
- [x] `CLAUDE.md` §Animação, item 4 atualizado — pendência removida, marcado resolvido.
- [x] `docs/component-import/motion-infrastructure/PLAN.md` §3.5 atualizado — marcado ✅ RESOLVIDO.
