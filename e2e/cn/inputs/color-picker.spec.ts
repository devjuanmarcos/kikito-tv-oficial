import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/color-picker";

test.describe("ColorPicker (CN)", () => {
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

  test("clicar num swatch atualiza aria-pressed e o input hex", async ({ page }) => {
    const swatch = page.getByRole("button", { name: "Select color #22c55e" }).first();
    await swatch.click();
    await expect(swatch).toHaveAttribute("aria-pressed", "true");
    const hexInput = page.getByLabel("Cor em hexadecimal").first();
    await expect(hexInput).toHaveValue("#22C55E");
  });

  test("digitar hex valido atualiza o preview", async ({ page }) => {
    const hexInput = page.getByLabel("Cor em hexadecimal").first();
    await hexInput.fill("#123abc");
    await hexInput.blur();
    await expect(hexInput).toHaveValue("#123ABC");
  });

  test("instancia disabled bloqueia interacao", async ({ page }) => {
    const disabledSwatch = page.getByRole("button", { name: "Select color #8b5cf6" }).last();
    await expect(disabledSwatch).toBeDisabled();
  });
});
