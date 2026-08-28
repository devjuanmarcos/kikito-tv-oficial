import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/breadcrumb";

test.describe("Breadcrumb", () => {
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

  test("último item tem aria-current=page e não é link", async ({ page }) => {
    const frame = page.locator('text="Default (md)"').locator("..");
    const last = frame.getByText("Breadcrumb", { exact: true });
    await expect(last).toHaveAttribute("aria-current", "page");
    await expect(frame.locator("a", { hasText: "Breadcrumb" })).toHaveCount(0);
  });

  test("colapsado com maxItems mostra elipse", async ({ page }) => {
    const frame = page.locator('text="Collapsed (maxItems=3)"').locator("..");
    await expect(frame.getByText("…", { exact: true })).toBeVisible();
  });

  test("item com href é um link clicável", async ({ page }) => {
    const frame = page.locator('text="Default (md)"').locator("..");
    await expect(frame.getByRole("link", { name: "Home" })).toBeVisible();
  });
});
