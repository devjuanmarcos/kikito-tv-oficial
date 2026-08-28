import { test, expect } from "@playwright/test";

const URL = "/pt/cn/feedback/log-viewer";

test.describe("LogViewer", () => {
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

  test("mostra as entradas com badges de nível", async ({ page }) => {
    await expect(page.getByText("Server started on port 3000")).toBeVisible();
    await expect(page.getByText("error", { exact: true })).toBeVisible();
  });

  test("campo de busca (aria-label Filter logs) filtra as entradas", async ({ page }) => {
    const search = page.getByRole("textbox", { name: "Filter logs" });
    await search.fill("database");
    await expect(page.getByText("Database connected successfully")).toBeVisible();
    await expect(page.getByText("Server started on port 3000")).toHaveCount(0);
  });
});
