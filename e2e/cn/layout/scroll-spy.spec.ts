import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/scroll-spy";

test.describe("ScrollSpy", () => {
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

  test("nav tem aria-label e o item ativo usa aria-current=location (não 'true' genérico)", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Table of contents" });
    await expect(nav).toBeVisible();
    const current = nav.locator('[aria-current="location"]');
    await expect(current).toHaveCount(1);
  });

  test("clicar num item rola até a seção correspondente mesmo com prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
    const nav = page.getByRole("navigation", { name: "Table of contents" });
    await nav.getByRole("button", { name: "Usage" }).click();
    await expect(page.locator("#usage")).toBeInViewport();
  });
});
