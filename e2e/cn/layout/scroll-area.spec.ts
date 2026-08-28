import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/scroll-area";

test.describe("ScrollArea", () => {
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

  test("viewport de scroll é focável por teclado", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const frame = page.locator("main");
    // pelo menos os 2 viewports da demo (vertical + horizontal) com tabindex=0
    const count = await frame.locator("div[tabindex='0']").count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("scroll via teclado (End) move o scrollTop do viewport focado", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const frame = page.locator("main");
    const viewport = frame.locator("div[tabindex='0']").first();
    await viewport.focus();
    const before = await viewport.evaluate((el) => el.scrollTop);
    await page.keyboard.press("End");
    await expect.poll(async () => viewport.evaluate((el) => el.scrollTop)).not.toBe(before);
  });
});
