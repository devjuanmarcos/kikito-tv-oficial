import { test, expect } from "@playwright/test";

const URL = "/pt/cn/charts/sparkline";

test.describe("Sparkline", () => {
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

  test("os 3 tipos (area/line/bar) expõem role=img com nome acessível gerado a partir dos dados", async ({ page }) => {
    const frame = page.locator("main");
    const charts = frame.getByRole("img", { name: /Sparkline chart, trending/ });
    await expect(charts).toHaveCount(3);
  });
});
