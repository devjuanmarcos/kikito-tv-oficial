import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/flip-card";

test.describe("FlipCard", () => {
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

  test("trigger=click: Enter no card focado vira e marca aria-pressed", async ({ page }) => {
    const card = page.locator('[role="button"][aria-pressed]').nth(1);
    await expect(card).toHaveAttribute("aria-pressed", "false");
    await card.focus();
    await page.keyboard.press("Enter");
    await expect(card).toHaveAttribute("aria-pressed", "true");
  });

  test("trigger=hover: card é focável e vira com Espaço (alternativa de teclado)", async ({ page }) => {
    const card = page.locator('[role="button"][aria-pressed]').first();
    await expect(card).toHaveAttribute("aria-pressed", "false");
    await card.focus();
    await page.keyboard.press(" ");
    await expect(card).toHaveAttribute("aria-pressed", "true");
  });
});
