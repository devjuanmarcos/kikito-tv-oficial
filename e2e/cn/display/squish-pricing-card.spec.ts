import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/squish-pricing-card";

test.describe("SquishPricingCard", () => {
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

  test("os 3 tiers renderizam com label, preco e cta", async ({ page }) => {
    const frame = page.locator('text="Hover cada card — fundo, preço e botão reagem elástico"').locator("..");
    await expect(frame.getByText("Individual", { exact: true })).toBeVisible();
    await expect(frame.getByText("Company", { exact: true })).toBeVisible();
    await expect(frame.getByText("Enterprise", { exact: true })).toBeVisible();
    await expect(frame.getByText("$299")).toBeVisible();
    await expect(frame.getByRole("button", { name: "Book a call" })).toBeVisible();
  });

  test("hover escala o card (achado real: motion aplica transform)", async ({ page }) => {
    const frame = page.locator('text="Hover cada card — fundo, preço e botão reagem elástico"').locator("..");
    const card = frame.getByText("Individual").locator("../..");
    const before = await card.evaluate((el) => getComputedStyle(el).transform);
    await card.hover();
    await page.waitForTimeout(600);
    const after = await card.evaluate((el) => getComputedStyle(el).transform);
    expect(after).not.toBe(before);
  });

  test("cta e clicavel de verdade, nao bloqueado pela forma de fundo (z-index)", async ({ page }) => {
    // a forma SVG animada fica absolutamente posicionada atras do conteudo (z-0) --
    // clicavel de verdade confirma que o botao (z-20) nao fica escondido embaixo dela.
    const frame = page.locator('text="Hover cada card — fundo, preço e botão reagem elástico"').locator("..");
    const cta = frame.getByRole("button", { name: "Sign up" }).first();
    await expect(cta).toBeEnabled();
    await cta.click({ timeout: 3000 });
  });
});
