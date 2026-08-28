import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/sortable-list";

test.describe("SortableList (CN)", () => {
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

  test("reordena por teclado: ArrowDown no grip move o item pra baixo", async ({ page }) => {
    const list = page.locator("main ul[role=list]").first();
    const items = list.locator("> li:not([role=status])");
    await expect(items.nth(0)).toContainText("Design tokens");
    await expect(items.nth(1)).toContainText("Button component");

    const grip = items.nth(0).getByRole("button");
    await grip.focus();
    await grip.press("ArrowDown");

    await expect(items.nth(0)).toContainText("Button component");
    await expect(items.nth(1)).toContainText("Design tokens");
  });

  test("End no grip move o item pro final da lista", async ({ page }) => {
    const list = page.locator("main ul[role=list]").first();
    const items = list.locator("> li:not([role=status])");
    const grip = items.nth(0).getByRole("button");
    await grip.focus();
    await grip.press("End");
    await expect(items.nth(4)).toContainText("Design tokens");
  });

  test("live region anuncia a mudanca de posicao", async ({ page }) => {
    const list = page.locator("main ul[role=list]").first();
    const items = list.locator("> li:not([role=status])");
    const grip = items.nth(0).getByRole("button");
    await grip.focus();
    await grip.press("ArrowDown");
    await expect(list.getByRole("status")).toContainText(/posição 2 de 5/);
  });

  test("disabled: sem grip focavel, sem draggable", async ({ page }) => {
    const disabledList = page.locator("main ul[role=list]").nth(1);
    await expect(disabledList.getByRole("button")).toHaveCount(0);
    const firstLi = disabledList.locator("> li:not([role=status])").first();
    await expect(firstLi).toHaveAttribute("draggable", "false");
  });
});
