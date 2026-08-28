import { test, expect } from "@playwright/test";

const URL = "/pt/cn/overlays/context-menu";

test.describe("ContextMenu", () => {
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

  test("clique direito abre o menu com os itens e o item de perigo", async ({ page }) => {
    const trigger = page.getByText("Right-click here");
    await trigger.click({ button: "right" });
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Copy" })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Delete" })).toBeVisible();
  });

  test("clicar num item fecha o menu", async ({ page }) => {
    const trigger = page.getByText("Right-click here");
    await trigger.click({ button: "right" });
    const menu = page.getByRole("menu");
    await menu.getByRole("menuitem", { name: "Copy" }).click();
    await expect(menu).not.toBeVisible();
  });
});
