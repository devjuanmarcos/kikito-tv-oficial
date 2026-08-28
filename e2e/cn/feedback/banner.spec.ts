import { test, expect } from "@playwright/test";

const URL = "/pt/cn/feedback/banner";

test.describe("Banner", () => {
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

  test("botão Dismiss remove o banner correspondente", async ({ page }) => {
    const frame = page.locator("main");
    const firstBanner = frame.getByRole("alert").first();
    await expect(firstBanner).toContainText("Info banner message");
    await firstBanner.getByRole("button", { name: "Dismiss" }).click();
    await expect(frame.getByText("Info banner message", { exact: false })).toHaveCount(0);
  });

  test("os 5 intents renderizam com role=alert", async ({ page }) => {
    const frame = page.locator("main");
    const alerts = frame.getByRole("alert");
    await expect(alerts).toHaveCount(6); // 5 intents + o banner com icon/action custom
  });
});
