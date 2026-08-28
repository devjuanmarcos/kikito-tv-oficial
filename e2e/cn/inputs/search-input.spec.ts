import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/search-input";

test.describe("SearchInput", () => {
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

  test("campo tem nome acessível via aria-label mesmo depois de digitar", async ({ page }) => {
    const frame = page.locator("main");
    const input = frame.getByRole("searchbox", { name: "Search…" });
    await input.fill("kikito cn");
    await expect(frame.getByRole("searchbox", { name: "Search…" })).toHaveValue("kikito cn");
  });

  test("digitar mostra botão Clear que limpa o campo", async ({ page }) => {
    const frame = page.locator("main");
    const input = frame.getByRole("searchbox", { name: "Search…" });
    await input.fill("teste");
    const clearButton = frame.getByRole("button", { name: "Clear" });
    await expect(clearButton).toBeVisible();
    await clearButton.click();
    await expect(input).toHaveValue("");
  });
});
