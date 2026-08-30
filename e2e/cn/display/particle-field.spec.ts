import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/particle-field";

test.describe("ParticleField", () => {
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

  test("as 2 instancias renderizam canvas com dimensoes reais", async ({ page }) => {
    const frame = page
      .locator('text="Particle Field — canvas animation with floating connected particles"')
      .locator("..");
    const canvases = frame.locator("canvas");
    await expect(canvases).toHaveCount(2);
    for (let i = 0; i < 2; i++) {
      const box = await canvases.nth(i).boundingBox();
      expect(box?.width).toBeGreaterThan(0);
      expect(box?.height).toBeGreaterThan(0);
    }
  });
});
