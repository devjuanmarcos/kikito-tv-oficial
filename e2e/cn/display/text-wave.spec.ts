import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/text-wave";

test.describe("TextWave", () => {
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

  test("texto completo acessivel via aria-label, mesmo staggered por caractere", async ({ page }) => {
    const frame = page.locator('text="Text Wave — per-character opacity shimmer, staggered"').locator("..");
    await expect(frame.getByLabel("Kikito Design")).toBeVisible();
    await expect(frame.getByLabel("Faster wave")).toBeVisible();
  });
});
