import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/image-compare";

test.describe("ImageCompare", () => {
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

  test("divisor é um slider com aria-valuenow, e ArrowRight incrementa a posição", async ({ page }) => {
    const slider = page.getByRole("slider").first();
    await expect(slider).toHaveAttribute("aria-valuenow", "50");
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await expect(slider).toHaveAttribute("aria-valuenow", "55");
  });

  test("Home/End movem o divisor pros extremos", async ({ page }) => {
    const slider = page.getByRole("slider").first();
    await slider.focus();
    await page.keyboard.press("End");
    await expect(slider).toHaveAttribute("aria-valuenow", "100");
    await page.keyboard.press("Home");
    await expect(slider).toHaveAttribute("aria-valuenow", "0");
  });

  test("versão vertical tem aria-orientation=vertical", async ({ page }) => {
    const sliders = page.getByRole("slider");
    await expect(sliders).toHaveCount(2);
    await expect(sliders.nth(1)).toHaveAttribute("aria-orientation", "vertical");
  });
});
