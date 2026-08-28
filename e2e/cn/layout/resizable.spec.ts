import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/resizable";

test.describe("Resizable", () => {
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

  test("divisor horizontal é focável e ArrowRight aumenta aria-valuenow", async ({ page }) => {
    const frame = page.locator("text=Resizable — drag the divider to resize panels").locator("..");
    const divider = frame.getByRole("slider", { name: "Resize" });
    await expect(divider).toHaveAttribute("aria-valuenow", "50");
    await divider.focus();
    await page.keyboard.press("ArrowRight");
    await expect(divider).toHaveAttribute("aria-valuenow", "55");
  });

  test("Home/End levam aos extremos min/max", async ({ page }) => {
    const frame = page.locator("text=Resizable — drag the divider to resize panels").locator("..");
    const divider = frame.getByRole("slider", { name: "Resize" });
    await divider.focus();
    await page.keyboard.press("End");
    await expect(divider).toHaveAttribute("aria-valuenow", "80");
    await page.keyboard.press("Home");
    await expect(divider).toHaveAttribute("aria-valuenow", "20");
  });

  test("divisor vertical tem aria-orientation vertical", async ({ page }) => {
    const frame = page.locator("text=Resizable — vertical").locator("..");
    const divider = frame.getByRole("slider", { name: "Resize" });
    await expect(divider).toHaveAttribute("aria-orientation", "vertical");
  });
});
