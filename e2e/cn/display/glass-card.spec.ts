import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/glass-card";

test.describe("GlassCard", () => {
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

  test("as 2 variações (blur default e blur=24) renderizam com backdrop-filter", async ({ page }) => {
    const count = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll<HTMLElement>("main *"));
      return all.filter((el) => getComputedStyle(el).backdropFilter.includes("blur")).length;
    });
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
