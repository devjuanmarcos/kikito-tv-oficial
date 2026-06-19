import { test, expect } from "@playwright/test";

test.describe("Navegação", () => {
  test("homepage carrega com status 200", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBeLessThan(400);
  });

  test("redireciona para locale padrão", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/pt/);
  });

  test("título da página está definido", async ({ page }) => {
    await page.goto("/pt");
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});
