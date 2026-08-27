import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/tabs";

test.describe("Tabs (CN)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
  });

  test("renderiza sem crash", async ({ page }) => {
    await expect(page).not.toHaveTitle(/Error|500|404/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("dark mode: pagina nao quebra ao alternar", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /Ativar modo/ });
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(400);
      await expect(page.locator("main")).toBeVisible();
    }
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

  test("clique numa tab troca a selecionada", async ({ page }) => {
    const tabs = page.getByRole("tab");
    const settings = tabs.filter({ hasText: "Settings" }).first();
    await settings.click();
    await expect(settings).toHaveAttribute("aria-selected", "true");
  });

  test("navegacao por teclado (ArrowRight/ArrowLeft) troca a tab focada", async ({ page }) => {
    const tabs = page.getByRole("tab");
    const first = tabs.first();
    await first.focus();
    await expect(first).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("ArrowRight");
    const second = tabs.nth(1);
    await expect(second).toHaveAttribute("aria-selected", "true");
    await expect(second).toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(first).toHaveAttribute("aria-selected", "true");
    await expect(first).toBeFocused();
  });
});
