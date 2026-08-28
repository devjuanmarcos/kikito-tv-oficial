import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/empty-state";

test.describe("EmptyState", () => {
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

  test("título, descrição e ação renderizam", async ({ page }) => {
    const frame = page.locator('text="With icon, description and action"').locator("..");
    await expect(frame.getByText("No results found")).toBeVisible();
    await expect(frame.getByRole("button", { name: "Add item" })).toBeVisible();
  });

  test("3 tamanhos renderizam com títulos distintos", async ({ page }) => {
    const frame = page.locator('text="sm · md · lg"').locator("..");
    await expect(frame.getByText("Small", { exact: true })).toBeVisible();
    await expect(frame.getByText("Medium (default)")).toBeVisible();
    await expect(frame.getByText("Large", { exact: true })).toBeVisible();
  });
});
