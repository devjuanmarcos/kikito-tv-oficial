import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/tilt-card";

test.describe("TiltCard", () => {
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

  test("as 3 variações (com e sem glare) renderizam", async ({ page }) => {
    await expect(page.getByText("Hover me")).toBeVisible();
    await expect(page.getByText("Gradient", { exact: true })).toBeVisible();
    await expect(page.getByText("No glare")).toBeVisible();
  });
});
