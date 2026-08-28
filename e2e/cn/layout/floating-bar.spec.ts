import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/floating-bar";

test.describe("FloatingBar (CN)", () => {
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

  test("barra fica contida no card do demo, nao vaza pro canto do viewport", async ({ page }) => {
    const card = page.getByText("3 items selected").locator("../../..");
    const cardBox = await card.boundingBox();
    const barBox = await page.getByText("3 items selected").locator("../..").boundingBox();
    expect(cardBox && barBox).toBeTruthy();
    if (cardBox && barBox) {
      expect(barBox.y).toBeGreaterThanOrEqual(cardBox.y - 4);
      expect(barBox.y + barBox.height).toBeLessThanOrEqual(cardBox.y + cardBox.height + 4);
    }
  });

  test("botao dismiss (aria-label Dismiss) esconde a barra", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chrome", "sidebar do showcase intercepta clique (pendência 0b)");
    const dismiss = page.getByRole("button", { name: "Dismiss" }).first();
    await expect(dismiss).toBeVisible();
    await dismiss.click();
    await expect(page.getByRole("button", { name: "Show bar" }).first()).toBeVisible();
  });

  test("posicao top: toggle visibility funciona", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chrome", "sidebar do showcase intercepta clique (pendência 0b)");
    await expect(page.getByText("Update available")).toBeVisible();
    await page.getByRole("button", { name: "Hide bar" }).last().click();
    await expect(page.getByRole("button", { name: "Show bar" }).last()).toBeVisible();
  });
});
