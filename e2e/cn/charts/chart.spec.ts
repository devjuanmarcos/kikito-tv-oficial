import { test, expect } from "@playwright/test";

/**
 * Chart — Super component (router, not an absorption): dispatches by `type`
 * to the dedicated standalone renderers, which remain independently
 * importable/usable. All 7 routes below render real, separate charts.
 */
const ROUTES = {
  chart: "/pt/cn/charts/chart",
  "line-chart": "/pt/cn/charts/line-chart",
  "bar-chart": "/pt/cn/charts/bar-chart",
  "area-chart": "/pt/cn/charts/area-chart",
  "donut-chart": "/pt/cn/charts/donut-chart",
  "pie-chart": "/pt/cn/charts/pie-chart",
  "radar-chart": "/pt/cn/charts/radar-chart",
  "funnel-chart": "/pt/cn/charts/funnel-chart",
};

for (const [name, url] of Object.entries(ROUTES)) {
  test.describe(`Chart family (CN) — ${name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
    });

    test("renderiza sem crash", async ({ page }) => {
      await expect(page).not.toHaveTitle(/Error|500|404/);
      await expect(page.locator("main")).toBeVisible();
    });

    test("sem erros de console", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      // filtra ruído de origens externas incorporadas em OUTRAS demos da mesma página (fora do escopo do chart)
      expect(errors.filter((e) => !e.includes("favicon") && !e.includes("Content Security Policy"))).toHaveLength(0);
    });
  });
}

test.describe("Chart family (CN) — a11y", () => {
  test("SVG dos charts (exceto funnel, que e HTML) expoe role=img com aria-label", async ({ page }) => {
    for (const url of [
      ROUTES["line-chart"],
      ROUTES["bar-chart"],
      ROUTES["area-chart"],
      ROUTES["donut-chart"],
      ROUTES["pie-chart"],
      ROUTES["radar-chart"],
    ]) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      // svg[role="img"] em vez de getByRole("img"): SVGs decorativos da página (ícones de nav)
      // também se expõem implicitamente como role=img na árvore de acessibilidade
      const img = page.locator('svg[role="img"]').first();
      await expect(img).toBeAttached();
      await expect(img).toHaveAttribute("aria-label", /.+/);
    }
  });
});

test.describe("Chart family (CN) — dark mode", () => {
  test("pagina nao quebra ao alternar", async ({ page }) => {
    await page.goto(ROUTES.chart);
    await page.waitForLoadState("networkidle");
    const toggle = page.getByRole("button", { name: /Ativar modo/ });
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(400);
      await expect(page.locator("main")).toBeVisible();
    }
  });
});
