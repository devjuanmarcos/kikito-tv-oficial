import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/icon-box";

test.describe("IconBox", () => {
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

  test("7 intents renderizam com cores distintas (soft vs neutral)", async ({ page }) => {
    const frame = page.locator('text="6 intents coloridos + neutral"').locator("..");
    const boxes = frame.locator("svg").locator("..");
    await expect(boxes).toHaveCount(7);
    const primaryBg = await boxes.nth(0).evaluate((el) => getComputedStyle(el).backgroundColor);
    const neutralBg = await boxes.nth(6).evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(primaryBg).not.toBe(neutralBg);
  });

  test("título e descrição renderizam nos 3 tamanhos", async ({ page }) => {
    const frame = page.locator('text="With title and description"').locator("..");
    await expect(frame.getByText("Fast", { exact: true })).toBeVisible();
    await expect(frame.getByText("Reliable")).toBeVisible();
    await expect(frame.getByText("Secure")).toBeVisible();
  });
});
