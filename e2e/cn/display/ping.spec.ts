import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/ping";

test.describe("Ping", () => {
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

  test("com label, o dot expõe role=img com aria-label (não só cor)", async ({ page }) => {
    const frame = page.locator("main");
    await expect(frame.getByRole("img", { name: "Online" })).toBeVisible();
  });

  test("achado real corrigido: intent neutral usa bg-neutral, não diluição de foreground", async ({ page }) => {
    const frame = page.locator("main");
    const neutralDot = frame.locator('span[class*="bg-neutral"]').first();
    await expect(neutralDot).toBeVisible();
    const hasForegroundDilution = await frame.locator('span[class*="bg-foreground/"]').count();
    expect(hasForegroundDilution).toBe(0);
  });
});
