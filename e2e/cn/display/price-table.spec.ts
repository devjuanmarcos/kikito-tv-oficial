import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/price-table";

test.describe("PriceTable", () => {
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

  test("colunas de plano têm scope=col e badge usa Badge real", async ({ page }) => {
    const frame = page.locator("text=Price Table — plans with feature matrix").locator("..");
    // "Pro" por si só colide por substring com "Projects" na descrição do plano Free —
    // localiza a coluna pelo badge, que só existe no plano Pro
    const proHeader = frame.locator("th", { has: page.getByText("Most popular") });
    await expect(proHeader).toHaveAttribute("scope", "col");
    await expect(frame.getByText("Most popular")).toBeVisible();
  });

  test("features booleanas renderizam check/cross corretos por plano", async ({ page }) => {
    const frame = page.locator("text=Price Table — plans with feature matrix").locator("..");
    const row = frame.locator("tr", { hasText: "API access" });
    await expect(row).toContainText("✓");
    await expect(row).toContainText("✕");
  });
});
