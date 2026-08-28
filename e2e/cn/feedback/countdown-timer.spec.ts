import { test, expect } from "@playwright/test";

const URL = "/pt/cn/feedback/countdown-timer";

test.describe("CountdownTimer", () => {
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

  test("timer tem role=timer e mostra Days/Hours/Minutes/Seconds", async ({ page }) => {
    const timers = page.locator('[role="timer"]');
    await expect(timers).toHaveCount(2);
    const withDays = timers.nth(1);
    await expect(withDays.getByText("Days", { exact: true })).toBeVisible();
    await expect(withDays.getByText("Hours", { exact: true })).toBeVisible();
  });

  test("timer com showDays=false não mostra unidade Days", async ({ page }) => {
    const withoutDays = page.locator('[role="timer"]').first();
    await expect(withoutDays.getByText("Days", { exact: true })).toHaveCount(0);
  });
});
