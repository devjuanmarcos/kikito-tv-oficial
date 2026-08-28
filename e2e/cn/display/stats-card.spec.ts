import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/stats-card";

test.describe("StatsCard (CN)", () => {
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

  test("2/3/4 colunas renderizam todos os stats", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile-chrome",
      "sidebar do showcase espreme a largura real do Frame (pendência 0b) — grid de colunas fica sem espaço útil"
    );
    await expect(page.getByText("12,849").first()).toBeVisible();
    await expect(page.getByText("$84,200").first()).toBeVisible();
    await expect(page.getByText("NPS")).toBeVisible();
  });
});
