import { test, expect } from "@playwright/test";

const URL = "/pt/cn/feedback/alert";

test.describe("Alert", () => {
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

  test("role=alert nos 5 intents", async ({ page }) => {
    const frame = page.locator('text="All intents (soft)"').locator("..");
    await expect(frame.getByRole("alert")).toHaveCount(5);
  });

  test("dismissible: botão × remove o alert", async ({ page }) => {
    const frame = page.locator('text="Dismissible · with action"').locator("..");
    const alert = frame.getByRole("alert");
    await expect(alert).toBeVisible();
    await alert.getByRole("button", { name: "Dismiss" }).click();
    await expect(alert).not.toBeVisible();
  });

  test("solid warning: texto usa cor de contraste real, não branco/preto fixo", async ({ page }) => {
    const frame = page.locator('text="soft · outline · solid · left-accent"').locator("..");
    const solidWarning = frame.getByRole("alert").filter({ hasText: "Solid warning" });
    await expect(solidWarning).toBeVisible();
    const bg = await solidWarning.evaluate((el) => getComputedStyle(el).backgroundColor);
    const color = await solidWarning.evaluate((el) => getComputedStyle(el).color);
    expect(color).not.toBe(bg);
  });
});
