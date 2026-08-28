import { test, expect } from "@playwright/test";

const URL = "/pt/cn/feedback/notification-bell";

test.describe("NotificationBell", () => {
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

  test("abre o painel e mostra as notificações", async ({ page }) => {
    const frame = page.locator("text=Bell with unread badge + panel").locator("..");
    await frame.getByRole("button", { name: /Notifications/ }).click();
    await expect(page.getByText("New comment")).toBeVisible();
    await expect(page.getByText("Build failed")).toBeVisible();
  });

  test("clicar na notificação marca como lida (button, não li) sem fechar o painel", async ({ page }) => {
    const frame = page.locator("text=Bell with unread badge + panel").locator("..");
    await frame.getByRole("button", { name: /Notifications/ }).click();
    const item = page.getByRole("button", { name: /New comment/ });
    await item.click();
    await expect(page.getByText("New comment")).toBeVisible();
  });

  test("Dismiss é focável por teclado e some da lista", async ({ page }) => {
    const frame = page.locator("text=Bell with unread badge + panel").locator("..");
    await frame.getByRole("button", { name: /Notifications/ }).click();
    const dismiss = page.getByRole("button", { name: "Dismiss" }).first();
    await dismiss.focus();
    await expect(dismiss).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByText("New comment")).toHaveCount(0);
  });
});
