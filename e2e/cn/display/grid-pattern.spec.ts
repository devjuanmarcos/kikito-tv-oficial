import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/grid-pattern";

test.describe("GridPattern", () => {
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

  test("os 4 tipos (dots/grid/cross/lines) renderizam camada decorativa aria-hidden com background-image real", async ({
    page,
  }) => {
    const frame = page.locator("main");
    for (const type of ["dots", "grid", "cross", "lines"]) {
      const label = frame.getByText(type, { exact: true });
      await expect(label).toBeVisible();
      const container = label.locator("../../..");
      const decorLayer = container.locator('[aria-hidden="true"]');
      const bgImage = await decorLayer.evaluate((el) => getComputedStyle(el).backgroundImage);
      expect(bgImage).toContain("data:image/svg+xml");
    }
  });
});
