import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/time-picker";

test.describe("TimePicker", () => {
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

  test("abre popover, fecha com Escape (achado real corrigido)", async ({ page }) => {
    const frame = page.locator("main");
    const trigger = frame.getByRole("button", { name: "Choose a time" });
    await trigger.click();
    const dialog = frame.getByRole("dialog", { name: "Choose time" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("achado real corrigido: uncontrolled + selecionar meia-noite (00:00) atualiza o texto exibido", async ({
    page,
  }) => {
    const frame = page.locator("main");
    const trigger = frame.getByRole("button", { name: "Choose a time" });
    await trigger.click();
    const dialog = frame.getByRole("dialog", { name: "Choose time" });
    await dialog.getByRole("button", { name: "00", exact: true }).first().click();
    await dialog.getByRole("button", { name: "00", exact: true }).last().click();
    await page.keyboard.press("Escape");
    await expect(frame.getByRole("button", { name: "00:00" })).toBeVisible();
  });

  test("disabled não abre popover", async ({ page }) => {
    const frame = page.locator("main");
    const trigger = frame.getByRole("button", { name: "Unavailable" });
    await expect(trigger).toBeDisabled();
  });
});
