import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/feature-list";

test.describe("FeatureList (CN)", () => {
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

  test("item indisponivel tem texto sr-only 'Não disponível'", async ({ page }) => {
    const srText = page.locator("main").getByText("Não disponível:", { exact: false }).first();
    await expect(srText).toBeAttached();
  });

  test("indicadores decorativos (check/numero/icone) tem aria-hidden", async ({ page }) => {
    const list = page.locator("main ul").first();
    const badge = list.locator("li > span").first();
    await expect(badge).toHaveAttribute("aria-hidden", "true");
  });

  test("variante numbered mostra numeros 1, 2, 3...", async ({ page }) => {
    const numberedList = page.locator("main ul").nth(1);
    await expect(numberedList.locator("li").first().locator("span").first()).toHaveText("1");
  });
});
