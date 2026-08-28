import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/keyboard-shortcuts";

test.describe("KeyboardShortcuts (CN)", () => {
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

  test("abre com role=dialog/aria-modal e foco inicial no campo de busca", async ({ page }) => {
    await page.getByRole("button", { name: "Show keyboard shortcuts" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(page.getByPlaceholder("Search shortcuts…")).toBeFocused();
  });

  test("Escape fecha o dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Show keyboard shortcuts" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("busca filtra os atalhos", async ({ page }) => {
    await page.getByRole("button", { name: "Show keyboard shortcuts" }).click();
    await expect(page.getByText("Save file")).toBeVisible();
    await page.getByPlaceholder("Search shortcuts…").fill("undo");
    await expect(page.getByText("Undo", { exact: true })).toBeVisible();
    await expect(page.getByText("Save file")).not.toBeVisible();
  });

  test("Tab no ultimo elemento focavel (busca) volta pro primeiro (close), focus trap", async ({ page }) => {
    await page.getByRole("button", { name: "Show keyboard shortcuts" }).click();
    // ordem de foco no DOM: [Close, Search] — nenhum outro elemento focavel dentro do dialog
    await page.getByPlaceholder("Search shortcuts…").focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
  });
});
