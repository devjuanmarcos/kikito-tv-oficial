import { test, expect } from "@playwright/test";

const URL = "/pt/cn/data/pagination";

test.describe("Pagination", () => {
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

  test("página 1 tem aria-current=page e botão 'First page' desabilitado", async ({ page }) => {
    const first = page.getByRole("button", { name: "First page" }).first();
    await expect(first).toBeDisabled();
    const pageOne = page.getByRole("button", { name: "Page 1" }).first();
    await expect(pageOne).toHaveAttribute("aria-current", "page");
  });

  test("clicar em 'Next page' avança a página em ambas as instâncias (estado compartilhado)", async ({ page }) => {
    await page.getByRole("button", { name: "Next page" }).first().click();
    const pageTwoButtons = page.getByRole("button", { name: "Page 2" });
    await expect(pageTwoButtons).toHaveCount(2);
    for (const btn of await pageTwoButtons.all()) {
      await expect(btn).toHaveAttribute("aria-current", "page");
    }
  });

  test("range label mostra contagem de itens", async ({ page }) => {
    await expect(page.getByText("1–20 of 240")).toBeVisible();
  });
});
