<div align="center">

# kikitocn

**The official CLI for [Kikito CN](https://kikito-tv-oficial.vercel.app/pt) — a React component library built with Tailwind CSS v4 and Framer Motion.**

[![npm version](https://img.shields.io/npm/v/kikitocn?color=7c3aed&label=kikitocn)](https://www.npmjs.com/package/kikitocn)
[![npm downloads](https://img.shields.io/npm/dm/kikitocn?color=7c3aed)](https://www.npmjs.com/package/kikitocn)
[![Node.js](https://img.shields.io/node/v/kikitocn?color=7c3aed)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-7c3aed)](LICENSE)

</div>

---

## What is Kikito CN?

Kikito CN is a collection of **196+ animated, production-ready React components** — buttons, modals, inputs, carousels, data tables, charts, and more. Every component is copy-owned: source lives in your project, not in a black-box dependency.

The CLI handles setup, token injection, and component installation automatically.

---

## Quick Start

```bash
npx kikitocn init
```

That's it. The CLI detects your framework, package manager, and CSS file automatically, then asks a few quick questions.

---

## Installation

```bash
# No install needed — use npx
npx kikitocn <command>

# Or install globally
npm install -g kikitocn
```

---

## Commands

### `init`

Set up Kikito CN in your project. Detects your stack and writes `kikitocn.json`, injects design tokens into your CSS, creates `utils.ts` with `cn()`, and installs peer dependencies.

```bash
npx kikitocn init
```

### `add`

Add one or more components. Resolves dependencies automatically and installs any required npm packages.

```bash
npx kikitocn add button
npx kikitocn add button modal input
npx kikitocn add accordion card badge avatar
```

### `list`

Browse all available components grouped by category with version and dependency info.

```bash
npx kikitocn list
npx kikitocn list --group inputs
```

### `doctor`

Check that your project is correctly configured — tokens imported, utils present, packages installed, registry reachable.

```bash
npx kikitocn doctor
```

---

## How it works

```
npx kikitocn init
  └─ writes kikitocn.json (config)
  └─ fetches kikitocn-tokens.css (design tokens)
  └─ injects @import into your global CSS
  └─ creates src/lib/utils.ts with cn()
  └─ installs clsx + tailwind-merge

npx kikitocn add button
  └─ fetches Button.tsx from the registry
  └─ resolves registry dependencies (e.g. ripple-button → button)
  └─ installs npm deps (e.g. motion)
  └─ writes files to your components dir
```

---

## Requirements

| Requirement            | Version    |
| ---------------------- | ---------- |
| Node.js                | ≥ 18       |
| React                  | ≥ 18       |
| Tailwind CSS           | v4         |
| Next.js / Vite / Remix | any recent |

---

## Configuration

After `init`, a `kikitocn.json` is created at your project root:

```json
{
  "version": "1",
  "componentsDir": "src/components/ui",
  "utils": "src/lib/utils",
  "tailwind": {
    "css": "src/app/globals.css"
  },
  "registry": "https://raw.githubusercontent.com/devjuanmarcos/kikito-tv-oficial/main/registry"
}
```

All paths are configurable during `init` or by editing the file directly.

---

## Component categories

| Category       | Examples                                                        |
| -------------- | --------------------------------------------------------------- |
| **inputs**     | Button, RippleButton, FlipButton, Input, Select, Slider, Switch |
| **display**    | Card, Badge, Avatar, Accordion, Carousel, Timeline              |
| **overlay**    | Modal, Drawer, Tooltip, Popover, DropdownMenu                   |
| **navigation** | Tabs, Pagination, Breadcrumb, Menubar                           |
| **data**       | DataTable, DataGrid, Calendar, Command                          |
| **charts**     | AreaChart, BarChart, LineChart, PieChart                        |
| **feedback**   | Toast, Alert, Progress, Skeleton, Spinner                       |
| **layout**     | Collapsible, Separator, ScrollArea, ResizablePanels             |

---

## Links

- **Docs & demos:** [kikitotv](https://kikito-tv-oficial.vercel.app/pt)
- **GitHub:** [devjuanmarcos/kikito-tv-oficial](https://github.com/devjuanmarcos/kikito-tv-oficial)
- **npm:** [npmjs.com/package/kikitocn](https://www.npmjs.com/package/kikitocn)

---

## License

MIT © [Juan Marcos](https://github.com/devjuanmarcos)
