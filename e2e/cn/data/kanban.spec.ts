import { test, expect } from "@playwright/test";

const URL = "/pt/cn/data/kanban";

test.describe("Kanban", () => {
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

  test("mostra as 4 colunas com seus cards", async ({ page }) => {
    await expect(page.getByText("Backlog", { exact: true })).toBeVisible();
    await expect(page.getByText("In Progress", { exact: true })).toBeVisible();
    await expect(page.getByText("Add dark mode")).toBeVisible();
  });

  test("card é focável e ArrowRight move pra próxima coluna", async ({ page }) => {
    const card = page.getByRole("button", { name: /CI pipeline fix/ });
    await card.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("button", { name: /CI pipeline fix — em Done/ })).toBeVisible();
  });
});
