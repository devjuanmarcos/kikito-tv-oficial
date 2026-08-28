import { test, expect } from "@playwright/test";

const URL = "/pt/cn/feedback/spinner";

test.describe("Spinner", () => {
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

  test("role=status com aria-label padrão 'Loading' nas 5 sizes", async ({ page }) => {
    const frame = page.locator('text="xs · sm · md · lg · xl"').locator("..");
    await expect(frame.getByRole("status", { name: "Loading" })).toHaveCount(5);
  });

  test("intent secondary usa a cor kinpaku, distinta de neutral", async ({ page }) => {
    const frame = page.locator('text="primary · secondary · neutral"').locator("..");
    const statuses = frame.getByRole("status");
    const secondaryRing = statuses.nth(1).locator("span").first();
    const neutralRing = statuses.nth(2).locator("span").first();
    const secondaryColor = await secondaryRing.evaluate((el) => getComputedStyle(el).borderTopColor);
    const neutralColor = await neutralRing.evaluate((el) => getComputedStyle(el).borderTopColor);
    expect(secondaryColor).not.toBe(neutralColor);
  });
});
