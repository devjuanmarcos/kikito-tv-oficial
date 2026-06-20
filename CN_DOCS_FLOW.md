# CN Docs — Fluxo de Implementação

## O que adicionar em cada página de componente

Cada rota `/cn/[group]/[component]` deve ter, além do showcase visual, três blocos informativos:

```
CnComponentPage
├── CnPageHeader        (título, descrição, breadcrumb)
├── CnShowcase          (demos visuais interativas)  ← já existe
├── CnInstallBlock      (como copiar o componente)   ← NOVO
├── CnSourceBlock       (código-fonte do componente) ← NOVO
└── CnPropsTable        (tabela de props tipadas)    ← NOVO
```

---

## 1. CnInstallBlock

**O que mostra:** caminho do arquivo para copiar + dependências.

```tsx
// Exemplo de output visual:
// ╔══════════════════════════════════════╗
// ║ Copiar componente                    ║
// ║ src/components/ui/cn/button/Button.tsx [copy btn]
// ║ Dependências: cn, react             ║
// ╚══════════════════════════════════════╝
```

**Dados necessários no registry:**

```ts
interface ComponentMeta {
  // já existem:
  id: string;
  title: string;
  description: string;
  group: string;
  // adicionar:
  filePath: string; // 'src/components/ui/cn/button/Button.tsx'
  dependencies?: string[]; // ['react', 'lucide-react']
  peerDeps?: string[]; // ['@/lib/utils']
}
```

---

## 2. CnSourceBlock

**O que mostra:** código-fonte real do componente, syntax-highlighted, colapsável.

**Estratégia:** server component lê o arquivo em build-time via `fs.readFileSync`.

```ts
// Em src/lib/cn-source.ts
import fs from "fs";
import path from "path";

export function getComponentSource(filePath: string): string {
  const abs = path.join(process.cwd(), filePath);
  return fs.readFileSync(abs, "utf8");
}
```

O `page.tsx` (server component) lê o source e passa como prop para o `CnSourceBlock` (client component que usa highlight).

**Syntax highlight:** usar `shiki` (já é dependência do Next.js/Vercel) ou `highlight.js`. Preferência: `shiki` com tema alinhado ao design system.

---

## 3. CnPropsTable

**O que mostra:** tabela com nome, tipo, padrão, required e descrição de cada prop.

**Dados necessários:**

```ts
interface PropDoc {
  name: string;
  type: string; // 'string | number', 'ButtonVariant', etc.
  default?: string; // '"solid"', 'false', 'undefined'
  required?: boolean;
  description: string;
}

interface ComponentMeta {
  // ...campos existentes + novos acima...
  props?: PropDoc[];
}
```

**Exemplo (Button):**

```ts
props: [
  { name: "variant", type: "ButtonVariant", default: '"solid"', description: "Estilo visual do botão" },
  { name: "intent", type: "ButtonIntent", default: '"primary"', description: "Intenção semântica da ação" },
  { name: "size", type: "ButtonSize", default: '"md"', description: "Tamanho do botão" },
  { name: "loading", type: "boolean", default: "false", description: "Estado de loading manual" },
  {
    name: "status",
    type: "ButtonStatus",
    default: "undefined",
    description: "Estado controlado (idle/loading/success/error)",
  },
  { name: "iconLeft", type: "ReactNode", default: "undefined", description: "Ícone à esquerda do texto" },
  { name: "disabled", type: "boolean", default: "false", description: "Desabilita o botão" },
  // ...
];
```

---

## Checkpoints de aprovação por componente

Antes de avançar ao próximo componente, todos os checks abaixo devem passar:

### Visual

- [ ] Showcase carrega sem erros de console
- [ ] Todos os demos renderizam corretamente
- [ ] Border-radius visível (não quadrado)
- [ ] Cores corretas por intent/variant

### Bloco de Instalação

- [ ] Caminho do arquivo correto
- [ ] Botão de cópia copia o path para clipboard
- [ ] Dependências listadas corretamente

### Bloco de Código

- [ ] Código-fonte correto do componente exibido
- [ ] Syntax highlighting funcional
- [ ] Toggle colapsar/expandir funcional
- [ ] Botão copiar código funcional

### Tabela de Props

- [ ] Todas as props tipadas no types file estão documentadas
- [ ] Tipos corretos (não `any`)
- [ ] Defaults corretos
- [ ] Descrições em português

### Playwright

```ts
// template de teste por componente
test("cn/button — docs completos", async ({ page }) => {
  await page.goto("/pt/cn/forms/button");

  // Showcase
  await expect(page.locator('[data-testid="cn-showcase"]')).toBeVisible();

  // Install block
  await expect(page.locator('[data-testid="cn-install-block"]')).toBeVisible();
  await page.click('[data-testid="cn-install-copy"]');
  // clipboard check via evaluate

  // Source block
  await expect(page.locator('[data-testid="cn-source-block"]')).toBeVisible();
  await page.click('[data-testid="cn-source-toggle"]');
  // verificar que source collapsed

  // Props table
  await expect(page.locator('[data-testid="cn-props-table"]')).toBeVisible();
  const rows = page.locator('[data-testid="cn-props-row"]');
  await expect(rows).toHaveCount({ greaterThan: 3 }); // mínimo por componente
});
```

---

## Ordem de implementação

### Fase 0 — Infraestrutura (implementar antes de qualquer componente)

1. Atualizar `ComponentMeta` no cn-registry com `filePath` e `props`
2. Criar `src/lib/cn-source.ts` — leitura de source em server component
3. Criar `CnInstallBlock` component
4. Criar `CnSourceBlock` component
5. Criar `CnPropsTable` component
6. Atualizar `page.tsx` do componente para incluir os 3 blocos
7. Escrever Playwright test template

### Fase 1 — Componentes por grupo (um de cada vez, com aprovação)

**Forms (alta prioridade — mais usados)**

- [ ] Button
- [ ] Input
- [ ] Select
- [ ] Textarea
- [ ] Checkbox
- [ ] Radio
- [ ] Switch
- [ ] Badge

**Feedback**

- [ ] Alert
- [ ] Toast
- [ ] Modal
- [ ] Progress

**Navigation**

- [ ] Tabs
- [ ] Dropdown
- [ ] Breadcrumb

**Display**

- [ ] Card
- [ ] Avatar
- [ ] Badge
- [ ] Callout

_(...continuar pelos grupos restantes)_

---

## Regra de progressão

```
Para cada componente:
  1. Adicionar filePath + props[] ao cn-registry
  2. Verificar que CnInstallBlock, CnSourceBlock, CnPropsTable renderizam
  3. Rodar Playwright: npx playwright test cn-[component]
  4. Todos checks verdes? → próximo componente
  5. Algum check vermelho? → corrigir antes de avançar
```

---

## Estrutura de arquivos a criar

```
src/
├── components/ui/cn/
│   ├── cn-install-block/
│   │   ├── CnInstallBlock.tsx
│   │   └── index.ts
│   ├── cn-source-block/
│   │   ├── CnSourceBlock.tsx
│   │   └── index.ts
│   └── cn-props-table/
│       ├── CnPropsTable.tsx
│       └── index.ts
└── lib/
    └── cn-source.ts      (server-only, reads fs)
```

---

## Decisões de design dos blocos

### CnInstallBlock

- Fundo: `bg-graphite` com borda `border-rule`
- Botão copy: ícone de clipboard, muda para check por 2s
- Path em `font-mono text-body-caption`

### CnSourceBlock

- Código em `font-mono text-body-caption`
- Tema shiki: custom alinhado aos tokens CSS do design system
- Colapsado por padrão (mostra ~15 linhas)
- "Ver código completo" expande
- Botão copy no topo direito

### CnPropsTable

- Tabela com colunas: **Prop** | **Tipo** | **Padrão** | **Descrição**
- Required props: asterisco vermelho no nome
- Tipos complexos como links para types file
- Zebra alternada ou hover highlight
