import { test, expect } from "@playwright/test";

const URL = "/pt/cn/feedback/notice-bar";

test.describe("NoticeBar", () => {
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

  test("role=status nos 5 intents", async ({ page }) => {
    const frame = page.locator('text="All 5 intents"').locator("..");
    await expect(frame.getByRole("status")).toHaveCount(5);
  });

  test("dismissible: botão de fechar remove a barra", async ({ page }) => {
    const frame = page.locator('text="Dismissible · with action"').locator("..");
    const bar = frame.getByRole("status");
    await expect(bar).toBeVisible();
    await bar.getByRole("button", { name: "Dismiss" }).click();
    await expect(bar).not.toBeVisible();
  });

  test("action button dispara o callback", async ({ page }) => {
    const frame = page.locator('text="Dismissible · with action"').locator("..");
    await frame.getByRole("button", { name: "Learn more" }).click();
    await expect(frame.getByText("Show notice again")).toBeVisible();
  });
});
