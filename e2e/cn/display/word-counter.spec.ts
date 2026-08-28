import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/word-counter";

test.describe("WordCounter", () => {
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

  test("digitar atualiza contagem de palavras/chars e a barra de progresso (aria-valuenow)", async ({ page }) => {
    const frame = page.locator("main");
    const textarea = frame.getByPlaceholder("Describe your project…");
    await textarea.fill("hello world from kikito");
    await expect(frame.getByText("4/50")).toBeVisible();
    const progressbar = frame.getByRole("progressbar").first();
    const valueNow = await progressbar.getAttribute("aria-valuenow");
    expect(Number(valueNow)).toBeGreaterThan(0);
  });

  test("ultrapassar o limite de palavras marca a contagem como over (text-danger)", async ({ page }) => {
    const frame = page.locator("main");
    const textarea = frame.getByPlaceholder("Describe your project…");
    const longText = Array.from({ length: 60 }, (_, i) => `word${i}`).join(" ");
    await textarea.fill(longText);
    const wordsStat = frame.getByText("60/50");
    await expect(wordsStat).toBeVisible();
    await expect(wordsStat).toHaveClass(/text-danger/);
  });
});
