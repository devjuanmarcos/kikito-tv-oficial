import { test, expect } from "@playwright/test";

const URL = "/pt/cn/charts/donut-chart";

test.describe("DonutChart", () => {
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

  test("acessivel via role=img com aria-label descrevendo os segmentos", async ({ page }) => {
    await expect(page.getByRole("img", { name: /Donut chart: React 40/ }).first()).toBeVisible();
  });
});
