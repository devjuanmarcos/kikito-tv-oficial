import { test, expect } from "@playwright/test";

const URL = "/pt/cn/feedback/toast";

test.describe("Toast", () => {
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

  test("clicar num botão dispara toast com role=status e título correto", async ({ page }) => {
    await page.getByRole("button", { name: "success", exact: true }).click();
    const toast = page.getByRole("status").filter({ hasText: "Success" });
    await expect(toast).toBeVisible();
  });

  test("dismissible: botão de fechar remove o toast", async ({ page }) => {
    await page.getByRole("button", { name: "info", exact: true }).click();
    const toast = page.getByRole("status").filter({ hasText: "Info" });
    await expect(toast).toBeVisible();
    await toast.getByRole("button", { name: "Dismiss" }).click();
    await expect(toast).not.toBeVisible();
  });

  test("solid warning: ícone e ação usam cor de contraste real, não branco fixo", async ({ page }) => {
    await page.getByRole("button", { name: "Solid warning" }).click();
    const toast = page.getByRole("status").filter({ hasText: "Solid warning" });
    await expect(toast).toBeVisible();
    const action = toast.getByRole("button", { name: "Undo" });
    const bg = await toast.evaluate((el) => getComputedStyle(el).backgroundColor);
    const actionColor = await action.evaluate((el) => getComputedStyle(el).color);
    // a cor do botão de ação nunca deve ser idêntica ao fundo (ficaria invisível)
    expect(actionColor).not.toBe(bg);
    expect(actionColor).not.toBe("rgb(255, 255, 255)");
  });
});
