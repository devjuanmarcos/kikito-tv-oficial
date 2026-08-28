import { test, expect } from "@playwright/test";

const URL = "/pt/cn/overlays/quick-actions";

test.describe("QuickActions", () => {
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

  test("menu fechado: ação fica fora da ordem de tab (tabindex=-1)", async ({ page }) => {
    const newItemButton = page.getByRole("button", { name: "New item", exact: true }).first();
    await expect(newItemButton).toHaveAttribute("tabindex", "-1");
  });

  test("abrir o menu torna a ação focável (tabindex=0) e clicável", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Quick actions" }).first();
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const newItemButton = page.getByRole("button", { name: "New item", exact: true }).first();
    await expect(newItemButton).toHaveAttribute("tabindex", "0");
    await newItemButton.click();
    // clicar numa ação fecha o menu de volta
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
