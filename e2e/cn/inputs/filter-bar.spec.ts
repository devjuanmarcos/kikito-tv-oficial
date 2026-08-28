import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/filter-bar";

test.describe("FilterBar", () => {
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

  test("multi-select: acumula filtros em vez de trocar", async ({ page }) => {
    const frame = page.locator('text="Multi-select"').locator("..");
    await frame.getByRole("button", { name: /Pending/ }).click();
    await expect(frame.getByRole("button", { name: /^Active/ })).toHaveClass(/text-patina-soft-fg/);
    await expect(frame.getByRole("button", { name: /^Pending/ })).toHaveClass(/text-patina-soft-fg/);
  });

  test("single select: escolher outro filtro troca em vez de acumular", async ({ page }) => {
    const frame = page.locator('text="Single select"').locator("..");
    await frame.getByRole("button", { name: /Closed/ }).click();
    await expect(frame.getByRole("button", { name: /^All/ })).not.toHaveClass(/text-patina-soft-fg/);
    await expect(frame.getByRole("button", { name: /^Closed/ })).toHaveClass(/text-patina-soft-fg/);
  });
});
