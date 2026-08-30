# Chart Library Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate the eight complex Kikito CN chart implementations behind a token-aware Apache ECharts infrastructure while preserving public props, accessibility, theme behavior, and a lightweight SVG Sparkline.

**Architecture:** `EChartsContainer` owns the ECharts lifecycle, token/theme bridge, resize handling, renderer seam, reduced-motion policy, and accessible wrapper. Each chart keeps its existing public interface and exposes a pure option builder. `Sparkline` remains a standalone SVG implementation and `gauge`/`skill-bar` stay outside the Chart family.

**Tech Stack:** Next.js 15, React 18, TypeScript, Apache ECharts modular imports, next-themes, Vitest, Playwright, pnpm.

---

### Task 1: Add the ECharts dependency and token-aware infrastructure

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/lib/echarts/chart-theme.ts`
- Create: `src/lib/echarts/EChartsContainer.tsx`
- Create: `src/lib/echarts/chart-theme.test.ts`

- [ ] Write tests for resolving CSS tokens, preserving explicit colors, and applying reduced motion defaults.
- [ ] Run the focused Vitest file and verify it fails because the infrastructure does not exist.
- [ ] Add modular `echarts` dependency and implement the token bridge plus client-only container.
- [ ] Run the focused tests, then `pnpm typecheck`.

### Task 2: Migrate radial, donut, and pie charts

**Files:**

- Modify: `src/components/ui/cn/radial-bar-chart/RadialBarChart.tsx`
- Modify: `src/components/ui/cn/donut-chart/DonutChart.tsx`
- Modify: `src/components/ui/cn/pie-chart/PieChart.tsx`
- Create: option-builder tests beside each chart
- Modify: `e2e/cn/charts/chart.spec.ts`

- [ ] Add failing pure-builder tests for data, colors, legends, tooltips, and accessibility summaries.
- [ ] Replace Recharts/SVG drawing with ECharts option builders while keeping public props unchanged.
- [ ] Verify focused unit tests, dark mode, and existing e2e chart routes.

### Task 3: Migrate bar and radar charts

**Files:**

- Modify: `src/components/ui/cn/bar-chart/BarChart.tsx`
- Modify: `src/components/ui/cn/radar-chart/RadarChart.tsx`
- Create: option-builder tests beside each chart

- [ ] Test vertical/horizontal bar options and radar axis/series mapping first.
- [ ] Implement builders using resolved design tokens and ECharts modules.
- [ ] Verify unit, typecheck, lint, and Playwright routes.

### Task 4: Migrate line and area charts

**Files:**

- Modify: `src/components/ui/cn/line-chart/LineChart.tsx`
- Modify: `src/components/ui/cn/area-chart/AreaChart.tsx`
- Create: option-builder tests beside each chart

- [ ] Test grid, dots, legends, labels, gradients, stacking, tooltip, and empty-data behavior first.
- [ ] Implement pure builders and route rendering through the shared container.
- [ ] Verify visual showcase data remains unchanged and all chart tests pass.

### Task 5: Migrate funnel and finalize registry

**Files:**

- Modify: `src/components/ui/cn/funnel-chart/FunnelChart.tsx`
- Modify: `scripts/registry-meta.mjs`
- Modify: `src/lib/cn-registry.tsx`
- Modify: `e2e/cn/charts/chart.spec.ts`

- [ ] Add failing funnel option and accessibility tests.
- [ ] Implement native ECharts funnel while preserving values, percentages, conversion, and height props.
- [ ] Keep Recharts for the unrelated generic `src/components/ui/chart.tsx`; add ECharts registry detection and update generated registry artifacts.
- [ ] Verify registry build, typecheck, lint, unit tests, and e2e tests.

### Task 6: Bundle and release verification

**Files:**

- Modify: `docs/component-import/chart-library-migration/PLAN.md`
- Modify: `e2e/cn/charts/chart.spec.ts`

- [ ] Capture pre-migration and post-migration production bundle measurements by route/chunk.
- [ ] Verify non-chart routes do not import the ECharts chunk unnecessarily.
- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm test:run`, `pnpm registry:build`, and `pnpm test:e2e`.
- [ ] Update the migration checklist with measured evidence and any justified follow-up.
