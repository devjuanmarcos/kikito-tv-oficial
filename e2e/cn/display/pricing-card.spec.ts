import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/pricing-card";

test.describe("PricingCard", () => {
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

  test("plano destacado mostra badge real e CTA clicável", async ({ page }) => {
    const frame = page.locator("text=Regular · Highlighted").locator("..");
    await expect(frame.getByText("Most popular")).toBeVisible();
    await frame.getByRole("button", { name: "Start free trial" }).click();
  });

  test("plano normal tem CTA distinto do destacado", async ({ page }) => {
    const frame = page.locator("text=Regular · Highlighted").locator("..");
    await expect(frame.getByRole("button", { name: "Get started" })).toBeVisible();
  });
});
