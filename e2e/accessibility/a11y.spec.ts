import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test.describe("Acessibilidade", () => {
  test("homepage não tem violações críticas", async ({ page }) => {
    await page.goto("/pt");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .exclude(".skip-a11y") // exclua seletores intencionalmente não conformes
      .analyze();

    const criticalViolations = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");

    expect(criticalViolations).toHaveLength(0);
  });

  test("skip-to-content link existe", async ({ page }) => {
    await page.goto("/pt");
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveCount(1);
  });

  test("navegação por teclado: Tab chega ao conteúdo principal", async ({ page }) => {
    await page.goto("/pt");
    await page.keyboard.press("Tab");
    const focusedHref = await page.evaluate(() => document.activeElement?.getAttribute("href"));
    expect(focusedHref).toBe("#main-content");
  });
});
