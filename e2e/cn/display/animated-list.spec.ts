import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/animated-list";

test.describe("AnimatedList", () => {
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

  test("renderiza todos os itens da lista", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.getByText("Design System", { exact: true })).toBeVisible();
    await expect(main.getByText("Token Bridge", { exact: true })).toBeVisible();
    await expect(main.getByText("SSG Routes", { exact: true })).toBeVisible();
  });

  test("trocar direção via botão continua renderizando a lista", async ({ page }) => {
    await page.getByRole("button", { name: "left", exact: true }).click();
    await expect(page.getByText("Dark Mode", { exact: true })).toBeVisible();
  });
});
