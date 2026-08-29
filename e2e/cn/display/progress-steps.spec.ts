import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/progress-steps";

test.describe("ProgressSteps", () => {
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

  test("expõe role=list/listitem e aria-current=step no passo atual", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const frame = page.locator("main");
    const list = frame.getByRole("list").first();
    await expect(list).toBeVisible();
    const items = list.getByRole("listitem");
    await expect(items.first()).toBeVisible();
    const current = list.locator('[aria-current="step"]');
    await expect(current).toHaveCount(1);
  });
});
