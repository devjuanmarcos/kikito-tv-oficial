import { test, expect } from "@playwright/test";

const URL = "/pt/cn/overlays/modal";

test.describe("Modal (CN)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
  });

  test("renderiza sem crash", async ({ page }) => {
    await expect(page).not.toHaveTitle(/Error|500|404/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("dark mode: pagina nao quebra ao alternar", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /Ativar modo/ });
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(400);
      await expect(page.locator("main")).toBeVisible();
    }
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

  // O painel fica sempre montado no DOM (transição via CSS opacity + data-open),
  // entao a asserção correta é sobre o atributo data-open, nao toBeVisible/toBeHidden.
  test("abre e fecha no Escape", async ({ page }) => {
    const openBtn = page.getByRole("button", { name: "Open modal" });
    await openBtn.click();

    const dialog = page.getByRole("dialog", { name: "Confirm deletion" });
    await expect(dialog).toHaveAttribute("data-open", "true");

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveAttribute("data-open", "false");
  });

  test("Tab dentro do modal fica preso (focus trap)", async ({ page }) => {
    await page.getByRole("button", { name: "Open modal" }).click();
    const dialog = page.getByRole("dialog", { name: "Confirm deletion" });
    await expect(dialog).toHaveAttribute("data-open", "true");

    const focusables = dialog.locator('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
    const count = await focusables.count();
    expect(count).toBeGreaterThan(1);

    const first = focusables.first();
    const last = focusables.last();
    await last.focus();
    await page.keyboard.press("Tab");
    await expect(first).toBeFocused();
  });

  test("botao de fechar (X) fecha o modal", async ({ page }) => {
    await page.getByRole("button", { name: "Open modal" }).click();
    const dialog = page.getByRole("dialog", { name: "Confirm deletion" });
    await expect(dialog).toHaveAttribute("data-open", "true");

    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toHaveAttribute("data-open", "false");
  });
});
