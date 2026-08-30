import { expect, test } from "@playwright/test";

const ROUTES = {
  chart: "/pt/cn/charts/chart",
  "line-chart": "/pt/cn/charts/line-chart",
  "bar-chart": "/pt/cn/charts/bar-chart",
  "area-chart": "/pt/cn/charts/area-chart",
  "donut-chart": "/pt/cn/charts/donut-chart",
  "pie-chart": "/pt/cn/charts/pie-chart",
  "radar-chart": "/pt/cn/charts/radar-chart",
  "radial-bar-chart": "/pt/cn/charts/radial-bar-chart",
  "funnel-chart": "/pt/cn/charts/funnel-chart",
};

for (const [name, url] of Object.entries(ROUTES)) {
  test.describe(`Chart family (CN) — ${name}`, () => {
    test.setTimeout(120_000);
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState("domcontentloaded");
      await expect(page.locator("main")).toBeVisible({ timeout: 120_000 });
    });
    test("renderiza sem crash", async ({ page }) => await expect(page).not.toHaveTitle(/Error|500|404/));
    test("sem erros de console", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.goto(url);
      await page.waitForLoadState("domcontentloaded");
      await expect(page.locator("main")).toBeVisible({ timeout: 120_000 });
      expect(
        errors.filter(
          (error) =>
            !error.includes("favicon") &&
            !error.includes("Content Security Policy") &&
            !error.includes("downloadable font") &&
            !error.includes("__nextjs_font")
        )
      ).toHaveLength(0);
    });
  });
}

test.describe("Chart family (CN) — a11y", () => {
  test("a raiz acessível dos charts expõe role=img com aria-label", async ({ page }) => {
    for (const url of Object.values(ROUTES)) {
      await page.goto(url);
      await page.waitForLoadState("domcontentloaded");
      await expect(page.locator("main")).toBeVisible({ timeout: 120_000 });
      await expect(page.locator('[role="img"][aria-label]').first()).toBeAttached();
    }
  });
});

test.describe("Line Chart (CN) — reference line + step", () => {
  test.setTimeout(120_000);
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES["line-chart"]);
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("main")).toBeVisible({ timeout: 120_000 });
  });

  test("prop referenceLine renderiza o rotulo da linha de meta (markLine do ECharts)", async ({ page }) => {
    const section = page.locator('text="Reference line"').locator("..");
    await expect(section.getByText("Meta: 60")).toBeVisible({ timeout: 10_000 });
  });

  test('prop step="middle" nao quebra o grafico (interpolacao em degrau)', async ({ page }) => {
    const section = page.locator('text="Step interpolation"').locator("..");
    await expect(section.locator('[role="img"][aria-label]')).toBeAttached();
  });
});

test.describe("Area Chart (CN) — step", () => {
  test.setTimeout(120_000);
  test('prop step="start" nao quebra o grafico (interpolacao em degrau)', async ({ page }) => {
    await page.goto(ROUTES["area-chart"]);
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("main")).toBeVisible({ timeout: 120_000 });
    const section = page.locator('text="Step interpolation"').locator("..");
    await expect(section.locator('[role="img"][aria-label]')).toBeAttached();
  });
});

test.describe("Chart family (CN) — dark mode", () => {
  test("página não quebra ao alternar", async ({ page }) => {
    await page.goto(ROUTES.chart);
    await page.waitForLoadState("domcontentloaded");
    const toggle = page.getByRole("button", { name: /Ativar modo/ });
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(400);
      await expect(page.locator("main")).toBeVisible();
    }
  });
});
