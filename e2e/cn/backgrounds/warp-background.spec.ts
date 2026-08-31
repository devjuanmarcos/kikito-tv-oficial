import { test, expect } from "@playwright/test";

const URL = "/pt/cn/backgrounds/warp-background";

test.describe("WarpBackground", () => {
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

  test("children (nosso Card CN) renderiza dentro do warp", async ({ page }) => {
    await expect(page.getByText("Parabéns pela promoção!")).toBeVisible();
  });

  test("gera feixes animados via motion (elementos com transform)", async ({ page }) => {
    // 4 lados x beamsPerSide (default 3) = 12 motion.div de feixe
    const beams = page.locator("[style*='--x']");
    await expect(beams).toHaveCount(12);
  });
});
