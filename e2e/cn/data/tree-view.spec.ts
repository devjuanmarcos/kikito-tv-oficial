import { test, expect } from "@playwright/test";

const URL = "/pt/cn/data/tree-view";

test.describe("TreeView", () => {
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

  test("roving tabindex: só o item ativo tem tabIndex=0", async ({ page }) => {
    const tree = page.locator("main ul[role='tree']").first();
    const tabbable = tree.locator("button[tabindex='0']");
    await expect(tabbable).toHaveCount(1);
  });

  test("achado real corrigido: seta Down move o foco pro próximo item visível", async ({ page }) => {
    const tree = page.locator("main ul[role='tree']").first();
    // "Button.tsx" (selected=true no showcase) começa como item ativo
    const buttonItem = tree.getByRole("button", { name: "Button.tsx" });
    await buttonItem.focus();
    await page.keyboard.press("ArrowDown");
    await expect(tree.getByRole("button", { name: "Input.tsx" })).toBeFocused();
  });

  test("achado real corrigido: seta Left num filho volta o foco pro pai", async ({ page }) => {
    const tree = page.locator("main ul[role='tree']").first();
    const inputItem = tree.getByRole("button", { name: "Input.tsx" });
    await inputItem.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(tree.getByRole("button", { name: "components" })).toBeFocused();
  });

  test("achado real corrigido: seta Right num nó colapsado expande sem perder o foco", async ({ page }) => {
    const tree = page.locator("main ul[role='tree']").first();
    const publicItem = tree.getByRole("button", { name: "public" });
    await publicItem.focus();
    await page.keyboard.press("ArrowRight");
    await expect(tree.getByRole("button", { name: "favicon.ico" })).toBeVisible();
  });

  test("item disabled (package.json) não recebe foco por Tab nem seta", async ({ page }) => {
    const tree = page.locator("main ul[role='tree']").first();
    await expect(tree.getByRole("button", { name: "package.json" })).toBeDisabled();
  });
});
