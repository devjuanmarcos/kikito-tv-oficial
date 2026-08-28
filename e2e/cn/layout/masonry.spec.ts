import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/masonry";

test.describe("Masonry", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
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
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("colunas fixas: column-count aplicado em todos os tiers", async ({ page }) => {
    const frame = page.locator('text="Masonry — CSS column-based grid with variable height items"').locator("..");
    const grid = frame.locator("text=Card A").locator("../..").first();
    const columnCount = await grid.evaluate((el) => getComputedStyle(el).columnCount);
    expect(columnCount).toBe("3");
  });

  test("columns responsivo: sm/md/lg aplicam column-count diferente por breakpoint", async ({ page }) => {
    const frame = page.locator('text="Masonry — CSS column-based grid with variable height items"').locator("..");
    const grids = frame.locator("text=Card A").locator("../..");
    const responsiveGrid = grids.nth(1);

    await page.setViewportSize({ width: 375, height: 800 });
    await expect.poll(async () => responsiveGrid.evaluate((el) => getComputedStyle(el).columnCount)).toBe("1");

    await page.setViewportSize({ width: 1280, height: 800 });
    await expect.poll(async () => responsiveGrid.evaluate((el) => getComputedStyle(el).columnCount)).toBe("4");
  });
});
