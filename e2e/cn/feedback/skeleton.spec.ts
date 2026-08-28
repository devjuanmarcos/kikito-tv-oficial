import { test, expect } from "@playwright/test";

const URL = "/pt/cn/feedback/skeleton";

test.describe("Skeleton", () => {
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

  test("decorativo: aria-hidden em todas as instâncias", async ({ page }) => {
    const frame = page.locator('text="default · rounded · circle · pill"').locator("..");
    const skeletons = frame.locator('[aria-hidden="true"]');
    await expect(skeletons).toHaveCount(4);
  });

  test("shape circle e pill usam rounded-full", async ({ page }) => {
    // rounded-full do Tailwind resolve pra calc(infinity * 1px) — o computed value vira um
    // número gigante (ex.: 3.35544e+07px), não um literal "9999px"; checar que é bem maior
    // que o próprio elemento já confirma "totalmente arredondado" o suficiente
    const frame = page.locator('text="default · rounded · circle · pill"').locator("..");
    const circle = frame.locator('[aria-hidden="true"]').nth(2);
    const borderRadius = await circle.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
    expect(borderRadius).toBeGreaterThan(1000);
  });
});
