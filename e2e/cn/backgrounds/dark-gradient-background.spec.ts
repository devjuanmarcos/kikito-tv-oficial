import { test, expect } from "@playwright/test";

const URL = "/pt/cn/backgrounds/dark-gradient-background";

test.describe("DarkGradientBackground", () => {
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

  test("children renderiza por cima do fundo (z-10)", async ({ page }) => {
    await expect(page.getByText("Build something great")).toBeVisible();
  });

  test("sem hotlink pra asset de terceiro (framerusercontent removido)", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (r) => requests.push(r.url()));
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(requests.some((u) => u.includes("framerusercontent.com"))).toBe(false);
  });
});
