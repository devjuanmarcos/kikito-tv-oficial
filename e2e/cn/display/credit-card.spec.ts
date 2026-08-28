import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/credit-card";

test.describe("CreditCard", () => {
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

  test("mostra número mascarado, nome e validade do titular", async ({ page }) => {
    await expect(page.getByText("4111 1111 1111 1111")).toBeVisible();
    await expect(page.getByText("JANE DOE")).toBeVisible();
    await expect(page.getByText("12/28")).toBeVisible();
  });

  test("botão Show Back alterna o label (front/back)", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Show Back" })).toBeVisible();
    await page.getByRole("button", { name: "Show Back" }).click();
    await expect(page.getByRole("button", { name: "Show Front" })).toBeVisible();
  });

  test("variantes light e gradient renderizam", async ({ page }) => {
    await expect(page.getByText("5500 0055 5555 5559")).toBeVisible();
    await expect(page.getByText("3714 4963 5398 431•")).toBeVisible();
  });
});
