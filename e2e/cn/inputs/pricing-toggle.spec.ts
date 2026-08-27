import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/pricing-toggle";

test.describe("PricingToggle (CN)", () => {
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

  test("switch tem aria-label real e aria-checked muda ao clicar", async ({ page }) => {
    const toggle = page.getByRole("switch").first();
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    const labelBefore = await toggle.getAttribute("aria-label");
    expect(labelBefore).toBeTruthy();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    const labelAfter = await toggle.getAttribute("aria-label");
    expect(labelAfter).not.toBe(labelBefore);
  });

  test("thumb usa bg-canvas, nao bg-white hardcoded", async ({ page }) => {
    const toggle = page.getByRole("switch").first();
    const thumb = toggle.locator("span").first();
    await expect(thumb).not.toHaveClass(/bg-white/);
  });

  test("label 'Yearly' e acionavel por teclado (role=button + Enter)", async ({ page }) => {
    const toggle = page.getByRole("switch").first();
    const yearlyLabel = page.getByRole("button", { name: "Yearly" }).first();
    await yearlyLabel.focus();
    await yearlyLabel.press("Enter");
    await expect(toggle).toHaveAttribute("aria-checked", "true");
  });
});
