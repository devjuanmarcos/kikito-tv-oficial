import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/receipt-card";

test.describe("ReceiptCard (CN)", () => {
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

  test("itens, desconto e imposto aparecem com valores formatados", async ({ page }) => {
    // "Discount"/"Tax" sao rotulos comuns, podem colidir com outros cards da mesma pagina
    const main = page.locator("main");
    await expect(main.getByText("Coffee (×2)")).toBeVisible();
    await expect(main.getByText("Discount").first()).toBeVisible();
    await expect(main.getByText("-$1.50")).toBeVisible();
    await expect(main.getByText("Tax").first()).toBeVisible();
  });

  test("status badges (paid/pending/cancelled) renderizam via <Badge> CN", async ({ page }) => {
    await expect(page.getByText("paid", { exact: true })).toBeVisible();
    await expect(page.getByText("pending", { exact: true })).toBeVisible();
    await expect(page.getByText("cancelled", { exact: true })).toBeVisible();
  });
});
