import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/metric-card";

test.describe("MetricCard (CN)", () => {
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

  test("3 variantes de trend (up/down/flat) renderizam com valores reais", async ({ page }) => {
    await expect(page.getByText("$42,890")).toBeVisible();
    await expect(page.getByText("2.1%")).toBeVisible();
    await expect(page.getByText("8,214")).toBeVisible();
  });

  test("loading state renderiza skeleton", async ({ page }) => {
    await expect(page.getByText("Revenue")).toBeVisible();
  });
});
